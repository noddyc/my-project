import Navbar from "../Utils/Navbar";
import React,{useEffect} from 'react';
import LeftSideBar from "../Utils/LeftSideBar";
import InfoNavBar from "../Utils/InfoNavBar";
import LiveAuctionSection from "./LiveAuctionSection";
import { io } from "socket.io-client";
import {useIsAuthenticated, useAuthUser} from 'react-auth-kit';

const LiveAuction = (props)=>{  
    console.log(props);

    const auth = useAuthUser();

    // useEffect(()=>{
    //     console.log("line 27")
    //     const socket = io('http://localhost:9001');
    //     socket?.emit("newUser", auth().id)
    //     props.setSocket(socket);
    // }, []);

    return (
    <div className="h-screen relative">
        {props.info !== undefined && <Navbar notifications={props.notifications} setNotifications={props.setNotifications}  socket={props.socket} notifiCount={props.notifiCount} setNotificount={props.setNotificount} 
       info={props.info} setInfo={props.setInfo} toggleInfo={props.toggleInfo} setToggleInfo={props.setToggleInfo}></Navbar>}
       
    
        <LeftSideBar></LeftSideBar>
        <LiveAuctionSection socket={props.socket} setSocket={props.setSocket} info={props.info}></LiveAuctionSection>
        <InfoNavBar info={props.info} toggleInfo={props.toggleInfo} setToggleInfo={props.setToggleInfo}></InfoNavBar>
    </div>
    );
}

export default LiveAuction;