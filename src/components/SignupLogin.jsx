import React, { useState } from "react";
import "./SignupLogin.css";
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { LoginStateActions } from "../store/LoginState-slice";

function SignupLogin() {
  const dispatch = useDispatch();
  const apiAddress = useSelector((state) => state.ApiSlice.address);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formData2, setFormData2] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleChange2 = (e) => {
    const { name, value } = e.target;
    setFormData2({
      ...formData2,
      [name]: value,
    });
  };

  const login = async (e) => {
    e.preventDefault();
    const res = await axios.post(
      `${apiAddress}auth/login`,
      formData
    );
    dispatch(LoginStateActions.logIn({token: res.data.token, expires: res.data.expiresIn, userName: res.data.userName, userId: res.data.userId}));
  };

  const signup = async (e) => {
    e.preventDefault();
    const sign = await axios.put(
      `${apiAddress}auth/signup`,
      formData2
    );
    if(sign){
      const res = await axios.post(
        `${apiAddress}auth/login`,
        formData2
      );
      dispatch(LoginStateActions.logIn({token: res.data.token, expires: res.data.expiresIn, userName: res.data.userName}));
    }
  };
  return (
    <>
      <div className="wrapper">
        <div className="card-switch">
          <label className="switch">
            <input className="toggle" type="checkbox" />
            <span className="slider"></span>
            <span className="card-side"></span>
            <div className="flip-card__inner">
              <div className="flip-card__front">
                <div className="title">Log in</div>
                <form action="" className="flip-card__form">
                  <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    className="flip-card__input"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    className="flip-card__input"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button onClick={login} className="flip-card__btn">
                    Let`s go!
                  </button>
                </form>
              </div>
              <div className="flip-card__back">
                <div className="title">Sign up</div>
                <form action="" className="flip-card__form">
                  <input
                    placeholder="Name"
                    className="flip-card__input"
                    name="name"
                    value={formData2.name}
                    onChange={handleChange2}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    className="flip-card__input"
                    value={formData2.email}
                    onChange={handleChange2}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    className="flip-card__input"
                    value={formData2.password}
                    onChange={handleChange2}
                  />
                  <button onClick={signup} className="flip-card__btn">
                    Confirm!
                  </button>
                </form>
              </div>
            </div>
          </label>
        </div>
      </div>
    </>
  );
}

export default SignupLogin;
