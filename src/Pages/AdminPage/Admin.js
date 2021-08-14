import React, { useRef, useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Link } from "react-router-dom";
import Developer from "./developer.svg";
import "bootstrap-icons/font/bootstrap-icons.css";
import Api from "../../Services/Api";
import "./style.css";

function Admin({ history }) {
  const [isPasswordEmpty, setIsPasswordEmpty] = useState(false);
  const [isPasswordWrong, setIsPasswordWrong] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const password = useRef("");
  const email = useRef("");

  const clickSignBtn = (e) => {
    e.preventDefault();
    if (
      password.current.value !== "" &&
      password.current.value.indexOf(" ") < 0
    ) {
      Api("/admin", "get").then((res) => {
        if (password.current.value === res.data[0].password) {
          history.push("/database");
          setIsPasswordEmpty((prev) => false);
          setIsPasswordWrong((prev) => false);
        } else {
          setIsPasswordEmpty((prev) => false);
          setIsPasswordWrong((prev) => true);
        }
      });
    } else if (
      password.current.value === "" ||
      password.current.value.indexOf(" ") >= 0
    ) {
      setIsPasswordEmpty((prev) => true);
      setIsPasswordWrong((prev) => false);
    }
  };

  const isOpenModal = (e) => {
    e.preventDefault();
    setModalVisible((prev) => !prev);
  };

  const emailSender = () => {
    if (email.current.value !== "" && email.current.value.indexOf(" ") < 0) {
      setModalVisible((prev) => !prev);
    }
  };

  return (
    <section id="adminPage">
      <Modal
        isOpen={modalVisible}
        toggle={isOpenModal}
        className={"message-sender-modal"}
      >
        <ModalHeader>Message Sender</ModalHeader>
        <ModalBody>
          <input
            type="email"
            required="@"
            placeholder="Your email"
            className="form-control modal-input"
            ref={email}
          />
        </ModalBody>
        <ModalFooter>
          <Button className="btn btn-success" onClick={emailSender}>
            Send
          </Button>{" "}
          <Button className="btn btn-danger" onClick={isOpenModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      <div
        className={`alert alert-primary d-flex align-items-center ${
          isPasswordEmpty ? "show-alert" : ""
        }`}
        role="alert"
      >
        <i className="alert-icon bi bi-info-circle-fill"></i>
        <div>Please fill password</div>
      </div>
      <div
        className={`alert alert-danger d-flex align-items-center ${
          isPasswordWrong ? "show-alert" : ""
        }`}
        role="alert"
      >
        <i className="alert-icon bi bi-exclamation-triangle-fill"></i>
        <div>Wrong password</div>
      </div>
      <div className="container h-100">
        <div className="row p-0 m-0 h-100">
          <div className="col-12 form-box">
            <form className="admin-form">
              <img src={Developer} alt="developer" />
              <div className="admin-form-input">
                <label htmlFor="login" className="admin-input-label">
                  Login
                </label>
                <input
                  type="text"
                  id="login"
                  className="admin-input disabled"
                  placeholder="Admin"
                  disabled="disabled"
                />
              </div>
              <div className="admin-form-input">
                <label htmlFor="password" className="admin-input-label">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  autoComplete="true"
                  placeholder="Password"
                  className="admin-input"
                  ref={password}
                />
              </div>
              <button className="btn login-base-btn" onClick={clickSignBtn}>
                Sign in
              </button>
              <button className="btn forget-btn" onClick={isOpenModal}>
                Forget password?
              </button>
              <Link to="/" className="btn go-ahead-btn">
                Go Back
              </Link>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Admin;
