import Navbar from "./Navbar";
import InfoNavBar from "./InfoNavBar";
import ProfileBox from "./ProfileBox";
import { useRef, useState, useEffect } from "react";
import React from 'react';
import HomeInfo from "./HomeInfo";
import LeftSideBar from "./LeftSideBar";
import AuctionForm from "./AuctionForm";
import {useIsAuthenticated, useAuthUser} from 'react-auth-kit';
import {NavLink, Outlet, useNavigate, useOutletContext} from 'react-router-dom'
import axios from 'axios';
import qs from 'qs';
import { stringify } from "postcss";

const AddAuction = (props)=>{
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
    <div className="flex-col">
        <Navbar toggleInfo={props.toggleInfo} setToggleInfo={props.setToggleInfo}></Navbar>
        <div className="border-4 border-orange-900 flex flex-row navbarSM:flex navbarSM:flex-col ">
            <LeftSideBar></LeftSideBar>
            <AuctionForm></AuctionForm>
        </div>
        <InfoNavBar info={props.info} toggleInfo={props.toggleInfo} setToggleInfo={props.setToggleInfo}></InfoNavBar>
    </div>
  )
}

export default AddAuction;