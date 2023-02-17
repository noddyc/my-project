import Navbar from "../Utils/Navbar";
import InfoNavBar from "../Utils/InfoNavBar";
import {useEffect } from "react";
import React from 'react';
import HomeInfo from "./HomeInfo";
import LeftSideBar from "../Utils/LeftSideBar";
import {useIsAuthenticated, useAuthUser} from 'react-auth-kit';
import {useNavigate, useOutletContext} from 'react-router-dom'

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
        <Navbar info={props.info} toggleInfo={props.toggleInfo} setToggleInfo={props.setToggleInfo}></Navbar>
        <div className="flex flex-row navbarSM:flex navbarSM:flex-col">
            <LeftSideBar></LeftSideBar>
            <HomeInfo info={props.info} setInfo={props.setInfo} toggleInfo={props.toggleInfo} setToggleInfo={props.setToggleInfo} setChange={props.setChange}></HomeInfo>
            <InfoNavBar info={props.info} toggleInfo={props.toggleInfo} setToggleInfo={props.setToggleInfo}></InfoNavBar>
        </div>
    </div>
  )
}

export default Home;