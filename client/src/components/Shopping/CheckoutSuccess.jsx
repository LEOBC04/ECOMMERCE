import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom'
import jwt_decode from "jwt-decode"
import { clearCart, getTotals } from "../../Redux/slices/shoping.slice";
// import Footer from "../Footer/footer";
import s from './shopping.module.scss'
import styled from 'styled-components'

const CheckoutSuccess = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.shoppingCart)
  const navigate = useNavigate()
  // let info = jwt_decode(window.localStorage.token); 
  // let id = info.id
  // console.log(cart)
  useEffect(() => {
    dispatch(getTotals());
    // cart.cartItems.map(libro => {
    //     console.log('//////////////////////////////')
    //     // console.log(`/users/purchasing-books/${userInfo.id}`)
    //     // console.log(libro.cartQuantity)
    //     // console.log(libro.price)
    //     axios({
    //         method: 'put',
    //         url: `/users/${id}/${libro._id}`
    //     })
    //   })
    //   dispatch(clearCart());
  }, [dispatch]);

  // useEffect(() => {
  //   dispatch(getTotals());
  // }, [cart, dispatch]);
  function next() {
    let info = jwt_decode(window.localStorage.token);
    let id = info.id
    cart.cartItems.map(libro => {
      console.log('//////////////////////////////')
      axios({
        method: 'put',
        url: `/users/${id}/${libro._id}`
      })
    })
    dispatch(clearCart());
    navigate(`/`);
  }

  return (
    <Container>
      <h2>Checkout Successful</h2>
      <p>Your order might take some time to process.</p>
      <p>Check your order status at your profile after about 10mins.</p>
      <p>
        In case of any inqueries contact the support at{" "}
        <strong>clickandreadecommerce@gmail.com</strong>
      </p>
      <button className={s.continue} onClick={next} >Continue</button>
    </Container>
  );
};

export default CheckoutSuccess;

const Container = styled.div`
  min-height: 80vh;
  max-width: 800px;
  width: 100%;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  h2 {
    margin-bottom: 0.5rem;
    color: #029e02;
  }
`;