import ProfileBox from "./ProfileBox";
import { useRef, useState, useEffect } from "react";
import React from 'react';
import HomeInfo from "./HomeInfo";
import {BrowserRouter as Router, useNavigate, Route, Switch} from "react-router-dom"
import {NavLink, Outlet} from 'react-router-dom'

const Navbar = (props) =>{
    const navigate = useNavigate();
    const [toggle, setToggle] = useState("hidden");

    const navLinkStyles = ({isActive})=>{
        return{
            textDecoration: isActive?'underline':'none',
        }
    }

    const barmenuHandler =  async (e)=>{
        e.preventDefault();
        if(toggle==="hidden"){
            setToggle("flex");
        }else{
            setToggle("hidden");
        }
    }
    
    return(
        <nav className="flex items-center justify-around relative text-white
         bg-black navbarSM:flex-col navbarSM:items-start">
            <div className="flex-grow text-2xl my-2 mr-2 ml-4">Website Name</div>
            <a href="#/" onClick={barmenuHandler} className={`hidden flex-col justify-between h-5 absolute top-3 right-4 w-8 navbarSM:flex`}>
                <span className="bg-white h-1 w-full rounded-2xl"></span>
                <span className="bg-white h-1 w-full rounded-2xl"></span>
                <span className="bg-white h-1 w-full rounded-2xl"></span>
            </a>
            <div className={`h-full navbarSM:${toggle} navbarSM:w-full`}>
                <ul className="flex m-0 p-0 navbarSM:flex-col navbarSM:w-full">
                    <NavLink style={navLinkStyles} to='/main' className="list-none  navbarSM:text-center"><span className="block p-4 text-white no-underline navbarSM:py-2 navbarSM:px-4">Home</span></NavLink>
                    <NavLink  style={navLinkStyles} to='/liveauction' className="list-none  navbarSM:text-center"><span  className="block p-4 text-white no-underline navbarSM:py-2 navbarSM:px-4">Live Auctions</span></NavLink>
                    <NavLink  style={navLinkStyles} to='/auctionhist' className="list-none  navbarSM:text-center"><span  className="block p-4 text-white no-underline navbarSM:py-2 navbarSM:px-4">Auction History</span></NavLink>
                    <NavLink  style={navLinkStyles} to='/bidhist' className="list-none  navbarSM:text-center"><span  className="block p-4 text-white no-underline navbarSM:py-2 navbarSM:px-4">Bid History</span></NavLink>
                    <NavLink to='/logout' className="list-none  navbarSM:text-center"><span className="block p-4 text-white no-underline navbarSM:py-2 navbarSM:px-4">Sign Out</span></NavLink>
                </ul>
            </div>
        </nav>
       )
}

export default Navbar;