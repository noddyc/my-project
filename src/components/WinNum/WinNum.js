/*
    component of winning number
*/
import Navbar from "../Utils/Navbar";
import React,{useEffect} from 'react';
import LeftSideBar from "../Utils/LeftSideBar";
import InfoNavBar from "../Utils/InfoNavBar";
import WinNumSection from "./WinNumSection";
import {useIsAuthenticated, useAuthUser} from 'react-auth-kit';

const WinNum = (props)=>{  
    const auth = useAuthUser();
    return (
    <div className="h-screen relative">
        {props.info !== undefined && <Navbar notifications={props.notifications} setNotifications={props.setNotifications}  socket={props.socket} notifiCount={props.notifiCount} setNotificount={props.setNotificount} 
       info={props.info} setInfo={props.setInfo} toggleInfo={props.toggleInfo} setToggleInfo={props.setToggleInfo}></Navbar>}
        <LeftSideBar info={props.info}></LeftSideBar>
        <WinNumSection></WinNumSection>
        <InfoNavBar info={props.info} toggleInfo={props.toggleInfo} setToggleInfo={props.setToggleInfo}></InfoNavBar>
    </div>
    );
}

export default WinNum;