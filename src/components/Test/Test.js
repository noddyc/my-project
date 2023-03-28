import Navbar from "../Utils/Navbar";
import InfoNavBar from "../Utils/InfoNavBar";
import {useEffect, useState} from "react";
import React from 'react';
import LeftSideBar from "../Utils/LeftSideBar";
import {useNavigate, useOutletContext} from 'react-router-dom'
import {io} from 'socket.io-client'
import {useIsAuthenticated, useAuthUser} from 'react-auth-kit';
import Testsection from "./Testsection";

const Test = (props)=>{
    const isAuthenticated = useIsAuthenticated();
    const navigate = useNavigate();
    const obj = useOutletContext();
    const auth = useAuthUser();
    console.log(props)

    const [selectedFiles, setSelectedFiles] = useState([]);


    useEffect(()=>{
        if(!isAuthenticated()){
            navigate('/')
        } 
    },[])


    


return(
    <div className="flex-col">
        {props.info !== undefined && <Navbar notifications={props.notifications} setNotifications={props.setNotifications}  socket={props.socket} notifiCount={props.notifiCount} setNotificount={props.setNotificount} 
       info={props.info} setInfo={props.setInfo} toggleInfo={props.toggleInfo} setToggleInfo={props.setToggleInfo}></Navbar>}
          <LeftSideBar info={props.info}></LeftSideBar>
          <Testsection info={props.info}></Testsection>
          <InfoNavBar info={props.info} toggleInfo={props.toggleInfo} setToggleInfo={props.setToggleInfo}></InfoNavBar>
    </div>
  )
}

export default Test;