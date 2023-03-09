import Navbar from "../Utils/Navbar";
import InfoNavBar from "../Utils/InfoNavBar";
import {useEffect } from "react";
import React from 'react';
import HomeInfo from "./HomeInfo";
import LeftSideBar from "../Utils/LeftSideBar";
import {useIsAuthenticated, useAuthUser} from 'react-auth-kit';
import {useNavigate, useOutletContext} from 'react-router-dom'
import { io } from "socket.io-client";

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
        {props.info !== undefined && <Navbar notifications={props.notifications} setNotifications={props.setNotifications}  socket={props.socket} notifiCount={props.notifiCount} setNotificount={props.setNotificount} 
       info={props.info} setInfo={props.setInfo} toggleInfo={props.toggleInfo} setToggleInfo={props.setToggleInfo}></Navbar>}
        <div className="flex flex-row navbarSM:flex navbarSM:flex-col">
            <LeftSideBar info={props.info}></LeftSideBar>
            <HomeInfo info={props.info} setInfo={props.setInfo} toggleInfo={props.toggleInfo} setToggleInfo={props.setToggleInfo} setChange={props.setChange}></HomeInfo>
            <InfoNavBar info={props.info} toggleInfo={props.toggleInfo} setToggleInfo={props.setToggleInfo}></InfoNavBar>
        </div>
    </div>
  )
}

export default Home;