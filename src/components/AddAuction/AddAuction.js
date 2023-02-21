import Navbar from "../Utils/Navbar";
import InfoNavBar from "../Utils/InfoNavBar";
import {useEffect} from "react";
import React from 'react';
import LeftSideBar from "../Utils/LeftSideBar";
import AuctionForm from "./AuctionForm";
import {useIsAuthenticated, useAuthUser} from 'react-auth-kit';
import {useNavigate, useOutletContext} from 'react-router-dom'


const AddAuction = (props)=>{
    const isAuthenticated = useIsAuthenticated();
    const navigate = useNavigate();
    const obj = useOutletContext();
    const auth = useAuthUser();
    console.log(props)


    useEffect(()=>{
        if(!isAuthenticated()){
            navigate('/')
        } 
    },[])


return(
    <div className="flex-col">
        <Navbar info={props.info} toggleInfo={props.toggleInfo} setToggleInfo={props.setToggleInfo}></Navbar>
        <div className=" flex flex-row navbarSM:flex navbarSM:flex-col ">
            <LeftSideBar></LeftSideBar>
            <AuctionForm info={props.info}></AuctionForm>
        </div>
        <InfoNavBar info={props.info} toggleInfo={props.toggleInfo} setToggleInfo={props.setToggleInfo}></InfoNavBar>
    </div>
  )
}

export default AddAuction;