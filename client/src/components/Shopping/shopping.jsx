import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import NavBar from '../NavBar/navBar';
import styles from './shopping.module.scss'
import Footer from '../Footer/footer';
import { addToCart, clearCart, decreaseCart, getTotals, removeFromCart } from '../../Redux/slices/shoping.slice';
import PayButton from './PayButton';
import jwt_decode from "jwt-decode"
import { fetchUserById } from '../../Redux/thunks/usersThunks';

const Shopping = () =>{

  const cart = useSelector((state) => state.shoppingCart)
  const dispatch = useDispatch()
  let info = jwt_decode(window.localStorage.token);
  const { userById } = useSelector((state) => state.users);




  useEffect(() =>{
    dispatch(getTotals())
    dispatch(fetchUserById(info.id));
  }, [cart])



  const handleRemoveFromCart = (cartItem) =>{
    dispatch(removeFromCart(cartItem))
  }

  const handleDecreaseCart = (cartItem) =>{
    dispatch(decreaseCart(cartItem))
  }

  const handleIncreaseCart = (cartItem) =>{
    dispatch(addToCart(cartItem))
  }

  const handleClearCart = () =>{
    dispatch(clearCart())
  }

  return(
    <div >
    <div className={styles.cartContainer}>
    <div className={styles.container}>
      <h2>Shopping cart</h2>
      {cart.cartItems.length === 0 ? (
        <div className={styles.cartEmpty}>
          <p>Your shopping cart is currently empty</p>
          <div className={styles.startShopping}>
            <Link to='/'>
            <svg xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            fill="currentColor" 
            class="bi bi-arrow-left" 
            viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
            </svg>
              <span>Start shopping</span>
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <div className={styles.titles}>
            <h3 className={styles.productTitle}>Product</h3>
            <h3 className={styles.price}>Price</h3>
            <h3 className={styles.quantity}>Quantity</h3>
            <h3 className={styles.total}>Total</h3>
          </div>
          <div className={styles.cartItems}>
            {cart.cartItems?.map(cartItem => (
              <div className={styles.cartItem} key={cartItem.id}>
                <div className={styles.cartProduct}>
                  <img src={cartItem.image} alt={cartItem.name}/>
                  <div>
                    <h3>{cartItem.name}</h3>
                    <p>{cartItem.description}</p>
                    <button onClick={() => handleRemoveFromCart(cartItem)}>Remove</button>
                  </div>
                </div>
                <div className={styles.cartProductPrice}>${cartItem.price}</div>
                <div className={styles.cartProductQuantity}>
                  <button className={styles.cartProductQuantityButton} onClick={() => handleDecreaseCart(cartItem)}>-</button>
                  <div className={styles.count}>{cartItem.cartQuantity}</div>
                  <button className={styles.cartProductQuantityButton} onClick={() => handleIncreaseCart(cartItem)}>+</button>
                </div>
                <div className={styles.cartProductTotalPrice}>
                  ${cartItem.price * cartItem.cartQuantity}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.cartSummary}>
            <button className={styles.clearCart} onClick={() => handleClearCart()}>Clear cart</button>
            <div className={styles.cartCheckout}>
              <div className={styles.subtotal}>
                <span>Subtotal</span>
                <span className={styles.amount}>${cart.cartTotalAmount}</span>
              </div>
              <p>Taxes and shipping calculated at checkout</p>
              <PayButton cartItems={cart.cartItems} userInfo={userById} cartInfo={cart}/>
              <div className={styles.continueShopping}>
                <Link to="/">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-arrow-left"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                    />
                  </svg>
                  <span>Continue Shopping</span>
                </Link>
              </div>
            </div>
          </div>
          
        </div>
        
        )}</div>
   <Footer />     
    </div>
    
    </div>
  )
}

export default Shopping;
























// import React, { useReducer, useState, useEffect } from 'react';
// import shoppingSlice, { initialState, ADD_TO_CART, REMOVE_ALL_FROM_CART, REMOVE_ONE_FROM_CART, CLEAR_CART } from '../../Redux/slices/shoping.slice.js'
// import CartItem from './CartItem';
// import ProductItem from './ProductItem';
// import styles from './shopping.module.scss'
// import NavBar from '../NavBar/navBar';
// import Footer from '../Footer/footer';
// import { useSelector } from 'react-redux'
// import { Link } from 'react-router-dom'

// const Shopping = () => {
//   const [state, dispatch] = useReducer(shoppingSlice, initialState)
//   const {products, cartItems} = state;
//   const [totalPrice, setTotalPrice] = useState(0)
//   const [totalItems, setTotalItems] = useState(0)
//   const cart = useSelector((state) => state.shoppingCart)
//   let items = 0
//   let price = 0
//   cartItems.map(item => {
//     items+=item.cartQuantity;
//     price+= item.cartQuantity * item.price
//   })
    
  

//   useEffect(() =>{
//     console.log(cartItems)
//     setTotalItems(items)
//     setTotalPrice(price)
//   }, [cartItems])



 

//   return (
//     <div>
//     <NavBar />
//     <br />
//     <br />
//     <br />
//     <br />
      
//       <h3>Products</h3>
      
//       <article className='box'>
        
//         <h2 className={styles.title}>Your shopping cart</h2>
//         <br />
//         <div>
//         {
//           cartItems.map((item, index) => <CartItem key={item.index} data={item} />)
//         }
//         </div>
//       </article>
//       <h1 className={styles.total}>Total items: {totalItems}</h1>
//       <h1 className={styles.total}>Total: {totalPrice}$</h1>
//       <button className={styles.boton}>Proceed to Checkout</button>
//       <div className={styles.clearfix}></div>
      
//       <button  className={styles.limpiar}>Clear cart</button>
//       <Footer />
//     </div>
//   );
// }

// export default Shopping;




