import styled from 'styled-components'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { useSelector, useDispatch } from 'react-redux'
import { fetchAllBooks } from '../../../Redux/thunks/booksThunks'
import { useNavigate } from 'react-router-dom'
// import { booksDelete } from '../../../Redux/slices/bookSlice'
import axios from 'axios'
import { fetchAllUsers } from '../../../Redux/thunks/usersThunks'

const UsersList = () =>{
    

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { users } = useSelector((state) => state.users)

    const [reload, setReload] = useState(false)
   

  console.log(users)

  function reloading(){
    
    if (reload){

        return setReload(false)
    }else{
      return setReload(true)
    }
}
  

    useEffect(() => {
        if(users.length === 0){
        dispatch(fetchAllUsers())}
    }, [dispatch, users, reload])

    

    const rows = users && users.map(user => {
        return {
            id: user._id,
            uName: user.name,
            uEmail: user.email,
            isAdmin: user.admin,
        }
    })

    const columns = [
        { field: "id", headerName: "ID", width: 220 },
        { field: "uName", headerName: "Name", width:150,},
        { field: "uEmail", headerName: "Email", width: 200},
        { 
            field: "isAdmin", 
            headerName: "Role", 
            width: 130,
            renderCell: (params) => {
                return (
                    <div>
                        {params.row.isAdmin ? (
                            <Admin>Admin</Admin>
                        ) : (
                            <Customer>Customer</Customer>
                        )}
                    </div>
                )
            }},
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
                        
                    </Actions>
                )
            }
        }
    ]

    const handleDelete = (id) => {
        
        //axios.delete(`http://localhost:3001/books/${del}/${id}`)
        axios.delete(`http://localhost:3001/users/${id}`)
        .then(dispatch(fetchAllUsers()))
        window.location.reload()
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

export default UsersList




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
    background-color: rgb(255, 77, 73)
`

const View = styled.button`
    background-color: rgb(114, 225, 40)
`

const Admin = styled.div`
    color: rgb(253, 181, 40);
    background-color: rgb(38, 198, 249, 0.12);
    padding: 3px 5px;
    border-radius: 3px;
    font-size: 14px;
`;

const Customer = styled.div`
    color: rgb(38, 198, 249);
    background-color: rgb(38, 198, 249, 0.12);
    padding: 3px 5px;
    border-radius: 3px;
    font-size: 14px;
`;