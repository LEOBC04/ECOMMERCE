
import React, { Component } from "react";
import Slider from "react-slick";
import s from "../Slider/Slider.module.scss"

export default class Responsive extends Component {
    render() {
        var settings = {
            dots: true,
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 5000,
            pauseOnHover: true,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        infinite: true,
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        dots: false
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        dots: false
                    }
                }
            ]
        };

        return (
            <div className={s.Container}>
                <Slider {...settings}>
                    <div >
                        <img className={s.img1} src={window.screen.width < 400 ? require("./phone.jpeg") : window.screen.width > 400 && window.screen.width < 768 ? require("./tablet.jpeg") : require("./Slider1.jpeg")} alt="book slider" />
                    </div>
                    <div>
                        <img className={s.img1} src={window.screen.width < 400 ? require("./phone.jpeg") : window.screen.width > 400 && window.screen.width < 768 ? require("./tablet.jpeg") : require("./Slider2.jpeg")} alt="book slider" />
                    </div>
                    <div>
                        <img className={s.img1} src={window.screen.width < 400 ? require("./phone.jpeg") : window.screen.width > 400 && window.screen.width < 768 ? require("./tablet.jpeg") : require("./Slider3.jpeg")} alt="book slider" />
                    </div>              
                    <div>
                        <img className={s.img1} src={window.screen.width < 400 ? require("./phone.jpeg") : window.screen.width > 400 && window.screen.width < 768 ? require("./tablet.jpeg") : require("./Slider4.jpeg")} alt="book slider" />
                    </div>
                </Slider>
            </div>
        );
    }
}