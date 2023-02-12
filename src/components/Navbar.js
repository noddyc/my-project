import ProfileBox from "./ProfileBox";
import { useRef, useState, useEffect } from "react";
import React from 'react';
import HomeInfo from "./HomeInfo";
import {BrowserRouter as Router, useNavigate, Route, Switch} from "react-router-dom"
import {NavLink, Outlet} from 'react-router-dom'

const Navbar = (props) =>{
    const navigate = useNavigate();
    // const [toggle, setToggle] = useState("hidden");
    const [toggle, setToggle] = useState("");
    const [toggleHeight, setToggleHeight] = useState(false);

    const navLinkStyles = ({isActive})=>{
        return{
            textDecoration: isActive?'underline':'none',
        }
    }
    
    const imgClickHandler = async (e)=>{
        props.setToggleInfo(" ");
    }

    const barmenuHandler =  async (e)=>{
        e.preventDefault();
        console.log("hello")
        if(toggle==="hidden"){
            setToggle("flex");
            setToggleHeight(false)
        }else{
            setToggle("hidden");
            setToggleHeight(true);
        }
    }
    // navbarSM:${toggleHeight}
    
    return(
        <nav className={`flex items-center justify-around relative text-white
         bg-black navbarSM:flex-col navbarSM:items-start navbarSM:h-[220px]`}>
            <div className="flex-grow text-2xl my-2 mr-2 ml-4"></div>
            {/* <a href="#/" onClick={barmenuHandler} className={`hidden flex-col justify-between h-5 absolute top-3 right-4 w-8 navbarSM:flex`}>
                <span className="bg-white h-1 w-full rounded-2xl"></span>
                <span className="bg-white h-1 w-full rounded-2xl"></span>
                <span className="bg-white h-1 w-full rounded-2xl"></span>
            </a> */}
            <div className={`h-full m-0 px-2 py-0 gap-2 navbarSM:w-full navbarSM:hidden`}>
                <ul className={`flex m-0 px-2 py-0 gap-2  navbarSM:flex-col navbarSM:w-full`}>
                    <div className="flex flex-col justify-center items-center gap-1 w-[126.67px] h-20 pt-3 pb-4 px-0;"><span>John Munson</span><label className="w-[126.67px] h-4 not-italic font-medium text-xs leading-4 text-center tracking-[0.5px]" >Admin</label></div>
                    <div className="flex flex-col justify-center items-center gap-1 w-[126.67px] h-20 pt-3 pb-4 px-0;"><i className="material-icons" style={{fontSize: '36px'}}>notifications</i></div>
                    <div className="flex flex-col justify-center items-center gap-1 w-[126.67px] h-20 pt-3 pb-4 px-0;"><img onClick={imgClickHandler} src={require("../assets/img1.jpeg")} 
                    className="flex flex-row justify-center items-center isolate w-8 h-8 p-0 rounded-2xl" style={{cursor:"pointer", height:"3rem", width:"3rem", borderRadius:"10rem"}}></img></div>
                </ul>
            </div>

            <div className={`h-full hidden navbarSM:w-full navbarSM:flex`}>
                <ul className={`flex m-0 p-0 navbarSM:flex-col navbarSM:w-full`}>
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