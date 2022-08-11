import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {Formik, Form,  Field, ErrorMessage} from 'formik'
import style from './contactUs.module.scss'
import swal from 'sweetalert'
import axios from 'axios'
import {useNavigate} from "react-router-dom";
import {
    fetchBooksGenres, fetchAllBooks
  } from "../../Redux/thunks/booksThunks";
import jwt_decode from "jwt-decode"
import example from '../../assets/imgs/example.jpg'
import { BallTriangle } from "react-loader-spinner";
import Footer from "../Footer/footer";


function ContactUs(){


    let info = jwt_decode(window.localStorage.token); 
    console.log(info)
    let id = info.id

   

    const initialState = {
        name: "",
        email: "",
        comment: "",
      };
    const [form, setForm] = useState(initialState);

    const [errors, setErrors] = useState({
    name: "",
    email: "",
    comment: "",

    });

    const validations = (input) => {
        const errorObject = {};
    
        if (!input.name) {
          errorObject.name = "The name field is empty";
        } else if (!/^[a-zA-Z ]*$/.test(input.name) || input.name.length < 3) {
          errorObject.name =
            "Your name must contain letters and more than 3 characters";
          console.log(errorObject);
        }
    
        if (!input.email) {
          errorObject.email = "The email field is empty";
        } else if (
            /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/.test(input.email) 
        ) {
          errorObject.email =
            "Email field must contain more than 20 characters";
        }
    
        if (!input.comment) {
            errorObject.comment = "The comment field is empty";
          } else if (/^[a-zA-Z ]*$/.test(input.comment) || input.comment.length < 3) {
            errorObject.comment =
              "Your comment must contain letters and more than 3 characters";
            console.log(errorObject);
          }
    

        return errorObject;
      };

    const handleInputChange = (e) => {
    setForm({
        ...form,
        [e.target.name]: e.target.value,
    }); 
    setErrors(
        validations({
          ...form,
          [e.target.name]: e.target.value,
        })
      );
    };

    return (
        <div className={style.container}>
            <div className={style.footer}>
        <section className={style.section}>
              <div className={style.formulario}>

                    <form action="https://formsubmit.co/24db36c4b7b8664f19823cadcfbceab3" method="POST">
                        <h4>CONTACT US</h4>
                        <div>
                            <label htmlFor="name">Name: </label>
                            <input type="text" name="name" onChange={handleInputChange} placeholder="Type your name..." required/>
                            {errors ? <p >{errors.name}</p> : null}
                        </div>
                        <div>
                            <label htmlFor="name">Your Email: </label>
                            <input type="email" name="email" onChange={handleInputChange} placeholder="email@example.com" required/>
                            {errors ? <p >{errors.email}</p> : null}
                        </div>
                        <div>
                            <label htmlFor="name">Description: </label>
                            <textarea name="comment" onChange={handleInputChange}/>
                            {errors ? <p> {errors.comment}</p> : null}
                        </div>
                        <input type="hidden" name="_next" value='https://ecommerce-books-three.vercel.app/' required/>
                        <input type="hidden" name="_captcha" value='false' required/>
                        <button type="submit">Send</button>
                    </form> 
            
                </div>

                 </section>
                 <Footer/>
             </div>
       
         </div>
    )

    
}


export default ContactUs;

