import Register from './pages/register/Register';
import Login from './pages/login/Login';
import Home from './pages/home/Home';
import ResetPasswordReq from './pages/reset_password_req/ResetPasswordReq';
import ResetPassword from './pages/reset_password/ResetPassword';
import OTPVerification from './pages/otp/OTPVerification';
import { AuthContext } from './AuthContext';
import React, { useState,useContext } from 'react';

import {BrowserRouter, Routes, Route} from "react-router-dom";

function App() {
  const { isLoggedIn } = useContext(AuthContext);
  const APP_NAME = "g-captcha-react-integration";
  return (
    <div style={{marginTop : '-3.5rem'}}>
     
        <Routes>
          <Route path={`${APP_NAME}/register`} element ={<Register/>} />
          <Route path={`${APP_NAME}/login`} element ={<Login/>} />
          <Route path={`${APP_NAME}/reset-password-req`} element ={<ResetPasswordReq/>} />
          <Route path={`${APP_NAME}/reset-password`} element ={<ResetPassword/>} />
          <Route path={`${APP_NAME}/otp-verification`} element ={<OTPVerification/>} />

          <Route
            path={`${APP_NAME}/`}
            element={isLoggedIn ? <Home/> : <Login/>}
          />
          <Route path={`${APP_NAME}/`} element ={<Home/>} />
        </Routes>
      
    </div>
  )
}

export default App
