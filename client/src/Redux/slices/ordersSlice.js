import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setHeaders } from "./api";

const initialState = {
    list: [],
    status: null
}

export const ordersFetch = createAsyncThunk("orders/ordersFetch", async () => {
    try {
        const response = await axios.get(`http://localhost:3001/orders`, setHeaders());

        return response.data;
        
    } catch (error) {
        console.log(error)
    }
})

export const ordersEdit = createAsyncThunk(
    "orders/ordersEdit",
    async( values, { getState }) => {
        const state = getState();

        let currentOrder = state.orders.list.filter(
            (order) => order._id === values.id
        )

        const newOrder = {
            ...currentOrder[0],
            delivery_status: values.delivery_status
        }

        try {
            const response = await axios.put(
                `http://localhost:3001/orders/${values.id}`,
                newOrder,
                setHeaders()
            );

            return response.data
        } catch (error) {
            console.log(error)
        }
    }
    )

const ordersSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {
        getOrders(state, action){
            state.list = action.payload
            console.log(action.payload)
            console.log(state.list)
        }
    },
    extraReducers: {
        [ordersFetch.pending]: (state, action) => {
            state.status = "pending";
        },
        [ordersFetch.fullfilled]: (state, action) => {
            state.list = action.payload;
            state.status = "success";
        },
        [ordersFetch.rejected]: (state, action) => {
            state.status = "rejected";
        },
        [ordersEdit.pending]: (state, action) => {
            state.status = "pending";
        },
        [ordersEdit.fulfilled]: (state, action) => {
            
            const updatedOrders = state.list.map((order) => 
                order._id === action.payload._id ? action.payload : order
            );
            state.list = updatedOrders;
            state.status = "success";
        },
        [ordersEdit.rejected]: (state, action) => {
            state.status = "rejected";
        }
    }
})

export const {
    getOrders
} = ordersSlice.actions

export default ordersSlice.reducer