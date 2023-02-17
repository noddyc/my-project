import Navbar from "../Utils/Navbar";
import React from 'react';
import LeftSideBar from "../Utils/LeftSideBar";
import InfoNavBar from "../Utils/InfoNavBar";
import BidHistSection from "./BidHistSection";


const BidHist = (props)=>{  
    return (
    <div className="h-screen relative">
      <Navbar info={props.info} toggleInfo={props.toggleInfo} setToggleInfo={props.setToggleInfo}></Navbar>
      <div className="flex flex-row h-[calc(100%-80px)] navbarSM:flex navbarSM:flex-col">
            <LeftSideBar></LeftSideBar>
            <BidHistSection info={props.info}></BidHistSection>
      </div>
      <InfoNavBar info={props.info} toggleInfo={props.toggleInfo} setToggleInfo={props.setToggleInfo}></InfoNavBar>
    </div>
    );
}

export default BidHist;