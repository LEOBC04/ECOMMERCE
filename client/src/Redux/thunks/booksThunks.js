import axios from "axios";
import { getBooks, searchBook, getDetail , getBookById} from "../slices/bookSlice";
import { getGenres } from "../slices/genreSlice";

const fetchAllBooks = () => (dispatch) => {
  axios
    .get("/books")
    .then((response) => {
      dispatch(getBooks(response.data.books));
    })
    .catch((error) => console.log(error));
};


// const fetchAllBooks = () => (dispatch) => {
//   let config ={headers:{authorization:localStorage.getItem("token")}}
//   axios
//     .get("/books",config)
//     .then((response) => {
//       dispatch(getBooks(response.data.books));
//     })
//     .catch((error) => console.log(error));
// };

const fetchBooksById = (id) => (dispatch) => {
  axios
    .get(`/books/${id}`)
    .then((response) => {
      
      dispatch(getBookById(response.data.book));
    })
    .catch((error) => console.log(error));
};


const fetchBookByName = (name) => (dispatch) => {
  axios
    .get(`/books?name=${name}`)
    .then((response) => dispatch(searchBook(response.data.books)))
    .catch((error) => console.log(error));
};
const fetchBooksDetail = (id) => (dispatch) => {
  axios
    .get(`/books/${id}`)
    .then((response) => dispatch(getDetail(response.data.book)))
    .catch((error) => console.log(error));
};

const fetchBooksGenres = () => (dispatch) => {
  axios
    .get("/books/genres")
    .then((response) => {
      dispatch(getGenres(response.data.genres));
    })
    .catch((error) => console.log(error));
};

// const deleteFetchBook = (id) => (dispatch) => {
//   let config ={headers:{authorization:localStorage.getItem("token")}}
//   axios
//     .delete("/books", config)
//     .then((response) => {
//       dispatch(deleteBook(response.data.books));
//     })
//     .catch((error) => console.log(error));
// };

export { fetchAllBooks, fetchBookByName, fetchBooksDetail, fetchBooksGenres , fetchBooksById};
