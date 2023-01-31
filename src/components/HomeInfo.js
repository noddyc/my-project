import Navbar from "./Navbar";
import ProfileBox from "./ProfileBox";
import { useRef, useState, useEffect } from "react";
import React from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom"
import ModalInfo from "./ModalInfo";

const HomeInfo = (props)=>{
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="flex flex-col w-4/5 border-orange-500 border-solid navbarSM:w-screen">
            <div className="border-solid border flex flex-col pl-20">
                <h1>About</h1>
                <div>Full Name</div>
                <h5>Burt Macklin</h5>
                <div>Address</div>
                <h5>2128 Monroe Ave Apt 4</h5>
                <div>Phone</div>
                <h5>217-819-9168</h5>
                <div className="editButton">
                <button style={{width:"200px", height:"30px", overflowWrap: "wrap"}} onClick={() => {
                              setIsOpen(true);
                          }}>Change Info</button>
                </div>
            </div>

            <div className="text-center">
                <span>Next Section</span>
            </div>
            <ModalInfo open={isOpen} onClose={() => setIsOpen(false)} d={props.info} setInfo={props.setInfo}>
            </ModalInfo>
        </div>
        );
}
export default HomeInfo;