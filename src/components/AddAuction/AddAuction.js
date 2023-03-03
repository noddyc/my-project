import Navbar from "../Utils/Navbar";
import InfoNavBar from "../Utils/InfoNavBar";
import {useEffect, useState} from "react";
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

    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleImageChange = (e) => {
      setSelectedFiles([...selectedFiles, ...e.target.files]);
    };

    const handleImageRemove = (index) => {
        const newFiles = [...selectedFiles];
        newFiles.splice(index, 1);
        setSelectedFiles(newFiles);
      };
  
    const handleSubmitImg = (e) => {
      e.preventDefault();
      console.log(e)

    };


    useEffect(()=>{
        if(!isAuthenticated()){
            navigate('/')
        } 
    },[])


    


return(
    <div className="flex-col">
        {props.info !== undefined && <Navbar notifications={props.notifications} setNotifications={props.setNotifications}  socket={props.socket} notifiCount={props.notifiCount} setNotificount={props.setNotificount} 
       info={props.info} setInfo={props.setInfo} toggleInfo={props.toggleInfo} setToggleInfo={props.setToggleInfo}></Navbar>}
       
        <div className=" flex flex-row navbarSM:flex navbarSM:flex-col ">
            <LeftSideBar></LeftSideBar>
            <AuctionForm info={props.info}></AuctionForm>
        </div>
        <InfoNavBar info={props.info} toggleInfo={props.toggleInfo} setToggleInfo={props.setToggleInfo}></InfoNavBar>
    </div>
  )
}

export default AddAuction;