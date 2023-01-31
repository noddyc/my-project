import Navbar from "./Navbar";
import ProfileBox from "./ProfileBox";
import { useRef, useState, useEffect } from "react";
import React from 'react';
import HomeInfo from "./HomeInfo";
import {useIsAuthenticated, useAuthUser} from 'react-auth-kit';
import {NavLink, Outlet, useNavigate, useOutletContext} from 'react-router-dom'
import axios from 'axios';
import qs from 'qs';
import { stringify } from "postcss";

const Home = (props)=>{

    const isAuthenticated = useIsAuthenticated();
    const navigate = useNavigate();
    const obj = useOutletContext();
    const auth = useAuthUser();


    useEffect(()=>{
        if(!isAuthenticated()){
            navigate('/')
        }
    },[])


return(
    <div>
        <Navbar></Navbar>
        <div className="flex flex-row navbarSM:flex navbarSM:flex-col">
            <ProfileBox info={props.info}></ProfileBox>
            <HomeInfo info={props.info} setInfo={props.setInfo}></HomeInfo>
        </div>
    </div>
  )
}

export default Home;