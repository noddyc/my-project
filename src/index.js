import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter, Routes, Route, Switch, useNavigate} from "react-router-dom"
import { AuthProvider } from "react-auth-kit";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
      <AuthProvider
            authType={"cookie"}
            authName={"_auth"}
            cookieDomain={window.location.hostname}
            cookieSecure={false}>
        <App />
      </AuthProvider> 
    </BrowserRouter> 
);


