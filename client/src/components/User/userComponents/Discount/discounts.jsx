import React from 'react';
import SideBar from '../../sideBar';
import s from './discounts.module.scss'
import ProductDis from './productDis';
import jwt_decode from "jwt-decode"
import portada from '../../../../assets/imgs/hp.jpg'
import portada2 from '../../../../assets/imgs/LOTR.jpg'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { BallTriangle } from "react-loader-spinner";
import { fetchAllBooks } from '../../../../Redux/thunks/booksThunks';
import { useDispatch, useSelector } from 'react-redux';

export const data = [
    {
        Component: BallTriangle,
        props: {
            color: "#B881FF",
        },
        name: "Ball Triangle",
    },
  ];

  
function Discounts(){

    const navigate = useNavigate()
    const dispatch = useDispatch()
    let info = jwt_decode(window.localStorage.token);
    //console.log(userById.selling_books)
    let id = info.id
    const { books } = useSelector((state) => state.books);
  
    const [prueba, setPrueba] = useState()
    const[reload, setReload] = useState(false)
    
    function reloading(){
    console.log('entro')
        if (reload){
            dispatch(fetchAllBooks())
            setReload(false)
            // window.location.reload()
            
        }else{
            dispatch(fetchAllBooks())
            setReload(true)
            //window.location.reload()
        }
    }

    const rederProducts = () =>(

        <tbody>
            {prueba.selling_books.length > 0 &&
            prueba.selling_books.map((book, i) =>(
                <ProductDis 
                key={i}
                i = {i}
                bookName={book.name}
                image={book.image}
                price={book.price}k
                offer = {book.priceWithDiscount}
                estado = {books}
                reload = {reloading}
                />
            ))}
        </tbody>

    )
    //console.log(prueba)

    useEffect( () => {
        dispatch(fetchAllBooks())
          setReload(false)
          axios.get(`http://localhost:3001/users/${id}`)
          .then((response)=>{
            
            setPrueba(response.data.userrrs)
          })       
          
          
          
          //llenarState()
      
    }, [reload]);

    return(
        <div className={s.container}>
            
            <div className={s.containerSide}>
            <SideBar/>
            </div>
            {prueba ?
            <>
            {
                prueba.selling_books.length > 0?(                <div className={s.containerPur}>
                <table className={s.table}>
                    <caption className={s.table_cap}>APPLY DISCOUNTS</caption>
                    <thead className={s.table_head}>
                        <tr className={s.table_row}>
                            <th className={s.table_heading} scope='col'>#</th>
                            <th className={s.table_heading} scope='col'>Book</th>
                            <th className={s.table_heading} scope='col'>Name</th>
                            <th className={s.table_heading} scope='col'>Precio</th>
                            <th className={s.table_heading} scope='col'>Offer Price</th>
                        </tr>
                    </thead>
                    {rederProducts()}
                </table>
                </div>):
                <div className={s.vacio}>
                    <div>
                     <h1>Not posted books  yet</h1>
                    </div>
                    <div>
                        <h1>Go post now!!!</h1>
                    </div>
                    <div>
                        <Link to={'/user/newBook'}>
                            <button >Sell</button> 
                        </Link>
                    </div>
                </div>
             }
                
                </>:
                <div>
                {data.map((loader, index) => (
                    <div className={s.loading} data-tip={loader.name}>
                        <loader.Component {...loader.props} />
                    </div>
                ))}
    
                </div> 
            }
        </div>
    )
}
export default Discounts

