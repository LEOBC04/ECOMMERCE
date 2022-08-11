import React from "react";
import { Link, Outlet } from "react-router-dom";
import style from "./navBar.module.scss";
import { BsFillCartFill, BsFillPersonLinesFill, BsCash } from "react-icons/bs";
import jwt_decode from "jwt-decode"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserById } from "../../Redux/thunks/usersThunks";

const NavBar = () => {



  //console.log(info)

  const { userById } = useSelector((state) => state.users);
  const dispatch = useDispatch()

  console.log(userById)

  useEffect(() => {
    if (window.localStorage.token) {
      let info = jwt_decode(window.localStorage.token);
      let id = info.id
      dispatch(fetchUserById(id));
    }


  }, []);

  return (
    <div>
      {

      }
      <section>
        <Outlet />
      </section>
      <nav className={style.container}>
        <div>
          <Link to={"/"} >
            <img src={require("./Merged.png")} alt=""
              height="40px" className={style.logo} />
          </Link>
        </div>
        
          <ul>
            <li>
              <Link to={"/"}>Home</Link>
            </li>
            <li>
              <Link to={"/deals"}>Today's Deals</Link>
            </li>
            <li>
              <Link to={"/gift"}>Gift Card</Link>
            </li>
            <li>
              <Link to={"/wish"}>WishList</Link>
            </li>
            <li>
              {
                window.localStorage.token ?
                  <div className={style.saldo}>
                    <BsCash className={style.icon} />
                    <p>$ {userById.available_money}</p>
                  </div> :
                  <div className={style.saldo}>
                    <BsCash className={style.icon} />
                    <p>$ 0</p>
                  </div>
              }

            </li>
            <li>
              <Link to={"/shopping"}>
                <BsFillCartFill className={style.icon} />
              </Link>
            </li>
            <li>
              {userById.admin === false ?
                <Link to={"/user"}>
                  <BsFillPersonLinesFill className={style.icon} />
                </Link> :
                <Link to={"/admin/summary"}>
                  <BsFillPersonLinesFill className={style.icon} />
                </Link>
              }
            </li>
          </ul>
        
      </nav>
    </div>
  );
};

export default NavBar;
