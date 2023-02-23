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
      <Navbar socket={props.socket} notifiCount={props.notifiCount} setNotificount={props.setNotificount} 
       info={props.info} toggleInfo={props.toggleInfo} setToggleInfo={props.setToggleInfo}></Navbar>
      <div className="flex flex-row h-[calc(100%-80px)] navbarSM:flex navbarSM:flex-col">
            <LeftSideBar></LeftSideBar>
            <LiveAuctionSection socket={props.socket} setSocket={props.setSocket} info={props.info}></LiveAuctionSection>
      </div>
      <InfoNavBar info={props.info} toggleInfo={props.toggleInfo} setToggleInfo={props.setToggleInfo}></InfoNavBar>
    </div>
    );
}

export default LiveAuction;