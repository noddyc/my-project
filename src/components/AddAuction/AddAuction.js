import Navbar from "../Utils/Navbar";
import InfoNavBar from "../Utils/InfoNavBar";
import {useEffect} from "react";
import React from 'react';
import LeftSideBar from "../Utils/LeftSideBar";
import AuctionForm from "./AuctionForm";
import {useNavigate, useOutletContext} from 'react-router-dom'
import {io} from 'socket.io-client'
import {useIsAuthenticated, useAuthUser} from 'react-auth-kit';


const AddAuction = (props)=>{
    const isAuthenticated = useIsAuthenticated();
    const navigate = useNavigate();
    const obj = useOutletContext();
    const auth = useAuthUser();
    console.log(props)


    // useEffect(()=>{
    //     console.log("line 27")
    //     const socket = io('http://localhost:9001');
    //     socket?.emit("newUser", auth().id)
    //     props.setSocket(socket);
    // }, []);


    useEffect(()=>{
        if(!isAuthenticated()){
            navigate('/')
        } 
    },[])


return(
    <div className="flex-col">
        <Navbar socket={props.socket} notifiCount={props.notifiCount} setNotificount={props.setNotificount} 
       info={props.info} toggleInfo={props.toggleInfo} setToggleInfo={props.setToggleInfo}></Navbar>
        <div className=" flex flex-row navbarSM:flex navbarSM:flex-col ">
            <LeftSideBar></LeftSideBar>
            <AuctionForm info={props.info}></AuctionForm>
        </div>
        <InfoNavBar info={props.info} toggleInfo={props.toggleInfo} setToggleInfo={props.setToggleInfo}></InfoNavBar>
    </div>
  )
}

export default AddAuction;