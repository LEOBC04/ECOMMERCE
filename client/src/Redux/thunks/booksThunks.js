import axios from "axios";
import { getBooks, searchBook, getDetail } from "../slices/bookSlice";
import { getGenres } from "../slices/genreSlice";

const fetchAllBooks = () => (dispatch) => {
  axios
    .get("/books")
    .then((response) => {
      dispatch(getBooks(response.data.books));
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

export { fetchAllBooks, fetchBookByName, fetchBooksDetail, fetchBooksGenres };
