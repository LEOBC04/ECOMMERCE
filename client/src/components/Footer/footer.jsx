import s from "./footer.module.scss";
import React from 'react';
import { Link } from "react-router-dom"

const Footer = () => {
    return (

        <footer className={s.Footer}>
            <div className={s.Legal}>
                <h4>Legal</h4>
                <Link className={s.Links} to={"/"}>
                    <a >Privacy</a>
                </Link>
                <Link className={s.Links} to={"/"}>
                    <a>Terms</a>
                </Link>
                <Link className={s.Links} to={"/"}>
                    <a>License</a>
                </Link>

            </div>
            <div className={s.LogosContainer}>
                <Link className={s.Logos} to={"/"}>
                    <i class="fab fa-linkedin fa-2x"></i>
                </Link>
                <a href="https://www.instagram.com/clickandreadstore/" className={s.Logos}> <i class="fab fa-instagram fa-2x">   </i></a>

                <a href="https://www.facebook.com/profile.php?id=100084151102078" className={s.Logos}> <i class="fab fa-facebook-square fa-2x"></i></a>

                <Link className={s.Logos} to={"/"}>
                    <i class="fab fa-twitter fa-2x"></i>
                </Link><Link className={s.Logos} to={"/locations"}>
                    <button>Store Locator</button>
                </Link>
                <Link className={s.Logos} to={"/contact"}>
                    <button>Contact Us</button>
                </Link>
            </div>
            <h4 className={s.LastLine}> © 2022 E-Commerce, Click&Read.com. All rights reserved.</h4>
        </footer>

    );
}

export default Footer;