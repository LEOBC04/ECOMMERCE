import styled from 'styled-components'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { useSelector, useDispatch } from 'react-redux'
import { fetchAllBooks } from '../../../Redux/thunks/booksThunks'
import { useNavigate } from 'react-router-dom'
// import { booksDelete } from '../../../Redux/slices/bookSlice'
import axios from 'axios'

const ProductList = () =>{
    

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { books } = useSelector((state) => state.books)

    const [reload, setReload] = useState(false)
    
  const { filterEmpty } = useSelector((state) => state.books);

  console.log(books)

  function reloading(){
    
    if (reload){

        return setReload(false)
    }else{
      return setReload(true)
    }
}
  

    useEffect(() => {
        if (books.length === 0 && !filterEmpty) {
          dispatch(fetchAllBooks());
          window.location.reload()
        }

        setReload(false)
      }, [dispatch, books, reload]);

    

    const rows = books && books.map(book => {
        return {
            id: book._id,
            imageUrl: book.image,
            bName: book.name,
            bDesc: book.description,
            price: book.price.toLocaleString(),
            delete: book.deleted
        }
    })

    const columns = [
        { field: "id", headerName: "ID", width: 220 },
        { field: "imageUrl", headerName: "Image", width:80,
        renderCell: (params) => {
            return (
                <ImageContainer>
                    <img src={params.row.imageUrl} alt="image" />
                </ImageContainer>
            )
        }
    },
        { field: "bName", headerName: "Name", width: 130},
        { field: "bDesc", headerName: "Description", width: 130},
        { field: "price", headerName: "Price", width: 80},
        { field: "delete", headerName: "Delete", width: 80},
        {
            field: "actions",
            headerName: "Actions",
            description: "This column has a value getter and is not sortable",
            sortable: false,
            width: 170,
            renderCell: (params) => {
                return (
                    <Actions>
                        <Delete onClick={() => handleDelete(params.row.id)}>Delete</Delete>
                        <View onClick={() => navigate(`/admin/book/${params.row.id}`)}>View</View>
                    </Actions>
                )
            }
        }
    ]

    const handleDelete = (id) => {
        
        //axios.delete(`http://localhost:3001/books/${del}/${id}`)
        axios.delete(`http://localhost:3001/books/${id}`)
        .then(dispatch(fetchAllBooks()))
        
    }

    return (
        <div style={{ height: 400, width: '100%' }}>
        <br />
        <br />
        <br />
        <br />
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection
                disableSelectionOnClick
            />
            
        </div>
    )
}

export default ProductList


const ImageContainer = styled.div`
    img {
        height: 40px;
    }
`;

const Actions = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    button {
        border: none;
        outline: none;
        padding: 3px 5px;
        color: white;
        border-radius: 3px;
        cursor: pointer;
    }
`;

const Delete = styled.button`
    background-color: rgb(255, 77, 73);
`;

const View = styled.button`
    background-color: rgb(114, 225, 40);
`;