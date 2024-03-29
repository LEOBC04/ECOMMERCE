import axios from "axios";

import { useDispatch, useSelector } from "react-redux";

// import { url } from "../../Redux/slices/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import swal from "sweetalert";
import { clearCart } from "../../Redux/slices/shoping.slice";

const PayButton = ({ cartItems, userInfo, cartInfo }) => {
  let navigate = useNavigate();
  const user = useSelector((state) => state.auth);
  const [saldo, setSaldo] = useState(500);
  const dispatch = useDispatch();

  const handleCheckout = () => {
    if (userInfo.available_money > cartInfo.cartTotalAmount) {
      swal({
        title: "Balance",
        text: "Do you want to use your balance?",
        icon: "warning",
        buttons: ["No", "Yes"],
      }).then((res) => {
        if (res) {
          //la condicional solo lleva la respuyesta ya que el segundo boton retorna un True por eso se posiciono el yes a la izquierda
          console.log(cartInfo);
          console.log(cartItems);
          console.log(userInfo.available_money);
          console.log(userInfo._id);
          axios({
            method: "put",
            url: `/users/purchasing-books/${userInfo._id}`,
            data: {
              cartQuantity: cartItems,
            },
          });
          cartItems.map((libro) => {
            console.log("//////////////////////////////");

            axios({
              method: "put",
              url: `/users/${userInfo._id}/${libro._id}`,
            });
          });
          dispatch(clearCart());
        } else {
          swal({
            title: "Payment",
            text: "Go to payment platform?",
            icon: "warning",
            buttons: ["Cancel", "Yes"],
          }).then((res) => {
            if (res) {
              console.log(user.token);
              if (user.token) {
                axios
                  .post(`/api/stripe/create-checkout-session`, {
                    cartItems,
                    userId: user._id,
                  })
                  .then((res) => {
                    if (res.data.url) {
                      window.location.href = res.data.url;
                    }
                  })
                  .catch((err) => console.log(err.message));
              } else {
                toast.error(`First you must be login`, {
                  position: "top-center",
                });
              }
            }
          });
        }
      });
    } else {
      console.log(user.token);
      if (user.token) {
        axios
          .post(`/api/stripe/create-checkout-session`, {
            cartItems,
            userId: user._id,
          })
          .then((res) => {
            if (res.data.url) {
              window.location.href = res.data.url;
            }
          })
          .catch((err) => console.log(err.message));
      } else {
        navigate("/login");
        // toast.error(`First you must be login`, {position: "top-center"})
      }
    }
  };

  return (
    <div>
      <button onClick={() => handleCheckout()}>Check out</button>
    </div>
  );
};

export default PayButton;

// axios({
//     method: 'put',
//     url: `/users/purchasing-books/${idUsuario}/${idLibro}`,
//     data: {
//         gastoPorLibro: precio*cantidad
//         cantidadLibro: 2

//     }
// })
