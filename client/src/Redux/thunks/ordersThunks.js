import axios from 'axios'
import { getOrders } from '../slices/ordersSlice'

const fetchAllOrders = () => (dispatch) => {
    let config ={headers:{authorization:localStorage.getItem("token")}}
    axios
      .get("/orders", config)
      .then((response) => {
        dispatch(getOrders(response.data));
      })
      .catch((error) => console.log(error));
  };

// const ordersEdit = (dispatch) => {
//   let config ={headers:{authorization:localStorage.getItem("token")}}
//   axios
//     .put("/orders/:id", config)
//     .then((response) => {
//       dispatch
//     })
// }

  export { 
    fetchAllOrders
   };