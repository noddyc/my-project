import Navbar from "../Utils/Navbar";
import React from 'react';
import LeftSideBar from "../Utils/LeftSideBar";
import InfoNavBar from "../Utils/InfoNavBar";
import LiveAuctionSection from "./LiveAuctionSection";


const LiveAuction = (props)=>{  
    return (
    <div className="h-screen relative">
      <Navbar info={props.info} toggleInfo={props.toggleInfo} setToggleInfo={props.setToggleInfo}></Navbar>
      <div className="flex flex-row h-[calc(100%-80px)] navbarSM:flex navbarSM:flex-col">
            <LeftSideBar></LeftSideBar>
            <LiveAuctionSection info={props.info}></LiveAuctionSection>
      </div>
      <InfoNavBar info={props.info} toggleInfo={props.toggleInfo} setToggleInfo={props.setToggleInfo}></InfoNavBar>
    </div>
    );
}

export default LiveAuction;