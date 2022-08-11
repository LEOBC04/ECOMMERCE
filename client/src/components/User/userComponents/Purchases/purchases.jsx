import React from 'react';
import SideBar from '../../sideBar';
import s from './purchases.module.scss'
import Product from './product';
import jwt_decode from "jwt-decode"
import portada from '../../../../assets/imgs/hp.jpg'
import portada2 from '../../../../assets/imgs/LOTR.jpg'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Review from './review';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers, fetchUserById } from '../../../../Redux/thunks/usersThunks';
import { fetchAllBooks } from '../../../../Redux/thunks/booksThunks';

function Purchases(){

    const { bookById } = useSelector((state) => state.books);
    const[review, setReview] = useState(false)    
    const { userById } = useSelector((state) => state.users);
    const { books } = useSelector((state) => state.books);
    const[purchBooks, setPurchBooks] = useState(null)  
    const dispatch = useDispatch()

    let info = jwt_decode(window.localStorage.token);
    let id = info.id
    console.log(userById)
    
    
    useEffect(() => {
  
        dispatch(fetchUserById(id));
        dispatch(fetchAllBooks());
        
        //setReload(false)
        
      
  }, []); 
    
    function editOn(){
        setReview(true)
      }
    const editOff = () =>{
        setReview(false)
    }
    
    let libros

    if(userById.purchased_books){
        let deletecopy = [...new Set(userById.purchased_books)]
        console.log(deletecopy)
        
        libros = deletecopy.map(libro => {
             //console.log(libros)
            console.log('//////')
            let filtrado = books.filter(b =>  b._id === libro._id)
            //console.log(filtrado)
            return filtrado
        })
        
        
    }
    console.log(libros)
 

    let[bookss, setBooks] = useState([{ bookName:"Harry Potter", image:portada, price: 40.50, amount: 15, state:'Nuevesito prro'}, {    bookName:"El Señor de los Anillos", image:portada2, price: 40.50, amount: 10, state:'Nuevesito prro'}])
    
    const rederProducts = () =>(

        <tbody>

            {
               libros.map((arreglo) => {
                    return arreglo.map((book, i) =>(

                         <Product 
                        key={i}
                        i = {i}
                        bookName={book.name}
                        image={book.image}
                        price={book.price}
        
                        />
                    ))
               }) 
                
                
}
        </tbody>

    )

    return(
        <div className={s.container}>
            <div className={s.containerSide}>
            <SideBar/>
            </div>
            
            {   review ?(
                <div>
                    <Review editOff={editOff} libros ={libros} />
                </div>
            ):

            libros.length>0?(                
                <div className={s.containerPur}>
                <table className={s.table}>
                    <caption className={s.table_cap}>PURCHASES<div><button className={s.reviewb} onClick={editOn}>Reviews</button></div></caption>
                    <thead className={s.table_head}>
                        <tr className={s.table_row}>
                            <th className={s.table_heading} scope='col'>Book</th>
                            <th className={s.table_heading} scope='col'>Name</th>
                            <th className={s.table_heading} scope='col'>Precio</th>
                        </tr>
                    </thead>
                    {rederProducts()}
                </table>
                
                </div>):
                <div className={s.vacio}>
                    <div>
                     <h1>Not purchases  yet</h1>
                    </div>
                    <div>
                        <h1>Buy now!!!</h1>
                    </div>
                    <div>
                        <Link to={'/'}>
                            <button >BUY</button> 
                        </Link>
                    </div>
                </div>
             }

        </div>
    )
}
export default Purchases