import {useState} from "react";
import React,{useEffect} from 'react';
import {useNavigate} from "react-router-dom"
import {NavLink} from 'react-router-dom'
import axios from "axios";
import qs from 'qs';
import {ip} from './ip.js'
import {useAuthUser} from 'react-auth-kit';

const Navbar = (props) =>{
    const navigate = useNavigate();
    // const [toggle, setToggle] = useState("hidden");
    const auth = useAuthUser();
    const [toggle, setToggle] = useState("");
    const [toggleHeight, setToggleHeight] = useState('h-[80px]');
    const [len, setLen] = useState(props.notifications.filter((e)=>!e.viewed).length)

    console.log(props.info.firstname)

    useEffect(()=>{
        try{
            console.log(ip)
            let data = qs.stringify({
                'id': auth().id 
              }); 
            let config = {
                method: 'post',
                url: `${ip}/user/getInfo`,
                headers: { 
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                data : data
            };
            axios(config).then(
                (response)=>{
                    // console.log(response.data.timezone)
                    props.setInfo(response.data)
                }
            )            
        }catch(err){
            console.log(err.message)
        }
    
      }, [props.change])

      useEffect(()=>{
        try{              
          // only display in progress auctions
              let data = qs.stringify({
                'userId': auth().id, 
              });
              let config = {
                method: 'post',
                url: 'http://localhost:9001/notifications/displayNotifications',
                headers: { 
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                data : data
              };
              axios(config)
              .then((response) => {
                let data = response.data;
                props.setNotifications(data);
              })
        }catch(err){
            console.log([err.message])
        }
    }, [])
    

    // also retrive notifications from db
    // want to make instant changes on bid history

    useEffect(()=>{
        console.log("this is navbar")
        props.socket.off("increaseNotifyCount").on("increaseNotifyCount", (e)=>{
            props.setNotifications((prev)=>[...prev, e])
            localStorage.setItem('count', props.notifiCount);
        })
    }, [props.socket]);

    useEffect(()=>{
        setLen(props.notifications.filter((e)=>!e.viewed).length)
        console.log("len updated")
    }, [props.notifications])



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
            setToggleHeight('h-[220px]')
        }else{
            setToggle("hidden");
            setToggleHeight('h-[80px]');
        }
    }

    const bellClickHandler = async(e)=>{
        navigate('/notifications')
    }
    
    return(
        <nav className={`flex items-center justify-around relative text-black bg-slate-300 navbarSM:flex-col ${toggleHeight} navbarSM:items-start`}>
            <div className="flex-grow text-2xl my-2 mr-2 ml-4"></div>
            <a href="#/" onClick={barmenuHandler} className={`hidden flex-col justify-between h-5 absolute top-3 right-4 w-8 navbarSM:flex`}>
                <span className="bg-white h-1 w-full rounded-2xl"></span>
                <span className="bg-white h-1 w-full rounded-2xl"></span>
                <span className="bg-white h-1 w-full rounded-2xl"></span>
            </a>
            <div className={`h-full m-0 px-2 py-0 gap-2 navbarSM:w-full navbarSM:hidden`}>
                <ul className={`flex m-0 px-2 py-0 gap-2  navbarSM:flex-col navbarSM:w-full`}>
                    {props.info.firstname !== undefined && props.info.lastname !== undefined && props.info.identity != undefined && <div className="flex flex-col justify-center items-center gap-1 w-[126.67px] h-20 pt-3 pb-4 px-0"><span>{props.info.firstname === undefined ?
                    " ": props.info.firstname.toUpperCase()} {props.info.lastname.toUpperCase()}</span></div>}
                    <div className="flex flex-col justify-center items-center gap-1 w-[126.67px] h-20 pt-3 pb-4 px-0 relative"><i className="material-icons hover:cursor-pointer" style={{fontSize: '36px'}}
                    onClick={bellClickHandler}>notifications</i>
                    {<div className="absolute top-5 right-10 bg-red-700 w-5 h-5 text-xs text-white flex justify-center items-center rounded-lg">{len}</div>}
                    </div>
                    <div className="flex flex-col justify-center items-center gap-1 w-[126.67px] h-20 pt-3 pb-4 px-0"><img onClick={imgClickHandler} src={require("../../assets/img1.jpeg")} 
                    className="flex flex-row justify-center items-center isolate w-8 h-8 p-0 rounded-2xl" style={{cursor:"pointer", height:"3rem", width:"3rem", borderRadius:"10rem"}}></img></div>
                </ul>
            </div>

            <div className={`h-full hidden navbarSM:w-full navbarSM:${toggle}`}>
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