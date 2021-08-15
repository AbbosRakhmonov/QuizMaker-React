import React, { useRef, useState, useEffect } from "react";
import "./style.css";
import Logo from "./logo.svg";
import UserImage from "./user-image.svg";
import Plus from "./plus-button.svg";
import Play from "./play-button.svg";
import Loader from "../../Components/Loader/Loader";

function WelcomePage({ history }) {
  const [opacityLoader, setOpacityLoader] = useState(1);
  const [isFill, setIsFill] = useState(false);
  const username = useRef("");
  const surname = useRef("");
  const clickPlayBtn = (e) => {
    e.preventDefault();
    if (
      username.current.value !== "" &&
      username.current.value.indexOf(" ") < 0 &&
      surname.current.value !== "" &&
      surname.current.value.indexOf(" ") < 0
    ) {
      history.push("/quiz");
      setIsFill((prev) => false);
    } else {
      setIsFill((prev) => true);
    }
  };
  const clickPlusBtn = () => {
    history.push("/login");
  };
  useEffect(() => {
    setTimeout(() => {
      setOpacityLoader(0);
    }, 500);
  }, []);
  return (
    <>
      <Loader opacity={opacityLoader} />
      <section id="welcomePage">
        <div
          className={`alert alert-primary d-flex align-items-center ${
            isFill ? "show-alert" : ""
          }`}
          role="alert"
        >
          <i className="alert-icon bi bi-info-circle-fill"></i>
          <div>Please fill password</div>
        </div>
        <div className="container h-100">
          <div className="row m-0 p-0 h-100">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 p-0 m-0 left-side">
              <div className="logo">
                <img src={Logo} alt="logo" />
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 p-0 m-0 right-side">
              <form className="user-form" id="userForm">
                <img src={UserImage} alt="user" />
                <div className="input-group">
                  <label htmlFor="username" className="input-label">
                    Name
                  </label>
                  <input
                    type="text"
                    id="username"
                    placeholder="Your name"
                    className="form-input"
                    ref={username}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="password" className="input-label">
                    Surname
                  </label>
                  <input
                    type="text"
                    id="password"
                    placeholder="Your surname"
                    className="form-input"
                    ref={surname}
                    autoComplete="false"
                  />
                </div>
              </form>
              <div className="role-buttons">
                <button
                  className="btn form-button"
                  form="userForm"
                  onClick={clickPlayBtn}
                >
                  <img src={Play} alt="play icon" />
                  <span className="text-btn">Start</span>
                </button>
                <button className="btn form-button" onClick={clickPlusBtn}>
                  <img src={Plus} alt="plus icon" />
                  <span className="text-btn">Sign In</span>
                </button>
              </div>
            </div>
            <span className="bottom-text">Press play for running test</span>
          </div>
        </div>
      </section>
    </>
  );
}

export default WelcomePage;
