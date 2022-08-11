import styled from 'styled-components'
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { setHeaders } from '../../Redux/slices/api';
import axios from 'axios';
import { fetchBooksDetail } from '../../Redux/thunks/booksThunks';

const LibroDetalle = () => {
    const params = useParams()
    const dispatch = useDispatch()
    const [book, setBook] = useState({})
    const [loading, setLoading] = useState(false)
    var { booksDetail } = useSelector((state) => state.books)

    console.log(book)

    useEffect(() => {

        setLoading(true)

        async function fetchData() {
            try {
                const res = dispatch(fetchBooksDetail(params.id))

                setBook(res)
                                
            } catch (error) {
                console.log(error)
            }

            setLoading(false)

        }
        
        fetchData();
    }, [dispatch])

    return(
        <StyledProduct>
            <ProductContainer>
                {loading ? <p>Loading...</p> : <>
                    <ImageContainer>
                        <img src={booksDetail.image} alt="book"/>
                    </ImageContainer>
                    <ProductDetails>
                        <h3>{booksDetail.name}</h3>
                        <p><span>Description: </span> {booksDetail.description}</p>
                        <Price>${booksDetail.price?.toLocaleString()}</Price>
                    </ProductDetails>
                </>}
            </ProductContainer>
        </StyledProduct>
    )
}

export default LibroDetalle

const StyledProduct = styled.div`
    margin: 3rem;
    display: flex;
    justify-content: center;
`

const ProductContainer = styled.div`
    max-width: 500px;
    width: 100%;
    height: auto;
    display: flex;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    border-radius: 5px;
    padding: 2rem;
`;

const ImageContainer = styled.div`
    flex: 1;
    img {
        width: 100%;
    }
`

const ProductDetails = styled.div`
    flex: 2;
    margin-left: 2rem;
    h3 {
        font-size: 35px;
    }
    p span {
        font-weight: bold;
    }
`

const Price = styled.div`
    margin: 1rem 0;
    font-weight: bold;
    font-size: 25px;
`