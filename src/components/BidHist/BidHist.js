import Navbar from "../Utils/Navbar";
import React,{useEffect} from 'react';
import LeftSideBar from "../Utils/LeftSideBar";
import InfoNavBar from "../Utils/InfoNavBar";
import BidHistSection from "./BidHistSection";
import {io} from 'socket.io-client'
import {useIsAuthenticated, useAuthUser} from 'react-auth-kit';


const BidHist = (props)=>{  
  const auth = useAuthUser();

 
    return (
    <div className="h-screen relative">
        {props.info !== undefined && <Navbar notifications={props.notifications} setNotifications={props.setNotifications}  socket={props.socket} notifiCount={props.notifiCount} setNotificount={props.setNotificount} 
       info={props.info} setInfo={props.setInfo} toggleInfo={props.toggleInfo} setToggleInfo={props.setToggleInfo}></Navbar>}
       
      <div className="">
            <LeftSideBar></LeftSideBar>
            <BidHistSection socket={props.socket} info={props.info} setNotifications={props.setNotifications}></BidHistSection>
      </div>
      <InfoNavBar info={props.info} toggleInfo={props.toggleInfo} setToggleInfo={props.setToggleInfo}></InfoNavBar>
    </div>
    );
}

export default BidHist;