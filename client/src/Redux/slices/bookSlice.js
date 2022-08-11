import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axios } from 'axios'
import { setHeaders } from './api'
import { toast } from "react-toastify";
const initialState = {
  books: [],
  booksCopy: [],
  booksDetail: {},
  genres: [],
  filterObject: {},
  filterEmpty: false,
  bookById:[],
  searchEmpty: false,
  deleteStatus: null
};


// export const booksDelete = createAsyncThunk(
//   "books/booksDelete",
//   async (id) => {
//     try {
//       const response = await axios.delete(
//         `http://localhost:3001/books/${id}`,
//         setHeaders()
//       );
//       return response.data
//     } catch (error) {
//       console.log(error)
//       toast.error(error.response?.data)
//     }
//   }
// )

const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    getBooks(state, action) {
      state.books = action.payload;
      state.booksCopy = action.payload;
    },
    getBookById(state, action) {
      
      state.bookById = action.payload;
    },
    searchBook(state, action) {
      if (action.payload.length === 0) {
        state.searchEmpty = true;
        state.books = action.payload;
      } else {
        state.searchEmpty = false;
        state.books = action.payload;
      }
    },
    resetSearch(state, action) {
      state.books = state.booksCopy;
      state.searchEmpty = false;
      // state.filterObject = {}
    },


    getDetail(state, action) {
      state.booksDetail = action.payload;
    },
    clearDetail(state, action) {
      state.booksDetail = {};
    },
    getGenres(state, action) {
      state.genres = action.payload;
    },
    getFilters(state, action) {
      if (action.payload.length === 0) {
        state.filterEmpty = true;
        state.books = action.payload;
      } else {
        state.filterEmpty = false;
        state.books = action.payload;
      }
    },
    saveFilterObject(state, action) {
      state.filterObject[action.payload.key] = action.payload.value;
    },
    resetFilters(state, action) {
      state.books = state.booksCopy;
      state.filterEmpty = false;
      state.filterObject = {}
    },
    resetObjectFilter(state, action) {
      state.filterObject = {};
    },
  }, //extraReducers:{
  //   [booksDelete.pending]: (state, action) => {
  //     state.deleteStatus = "pending";
  //   },
  //   [booksDelete.fulfilled]: (state, action) => {

  //     const newList = state.books.filter((book) => book._id !== action.payload._id)

  //     state.books = newList

  //     state.deleteStatus = "success";
  //     toast.success("Product Deleted!");
  //   },
  //   [booksDelete.rejected]: (state, action) => {
  //     state.deleteStatus = "rejected";
  //   }
  // },
});

export const {
  getBooks,
  searchBook,
  getDetail,
  clearDetail,
  getGenres,
  getFilters,
  resetFilters,
  resetObjectFilter,
  saveFilterObject,
  getBookById,
  resetSearch,
} = bookSlice.actions;

export default bookSlice.reducer;
