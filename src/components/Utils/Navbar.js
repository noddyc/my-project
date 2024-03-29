/*
    component of navigation bar
*/
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
    const auth = useAuthUser();
    const [toggle, setToggle] = useState("flex");
    const [toggleHeight, setToggleHeight] = useState('h-80px');
    const [len, setLen] = useState(props.notifications.filter((e)=>!e.viewed).length)

    useEffect(()=>{
        try{
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
                    props.setInfo(response.data)
                }
            ).then(
                console.log(props.info)
            )            
        }catch(err){
            console.log(err.message)
        }
    
      }, [props.change])

      useEffect(()=>{
        try{              
              let data = qs.stringify({
                'userId': auth().id, 
              });
              let config = {
                method: 'post',
                url: `${ip}/notifications/displayNotifications`,
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
    
    useEffect(()=>{
        props.socket.off("increaseNotifyCount").on("increaseNotifyCount", (e)=>{
            props.setNotifications((prev)=>[...prev, e])
            localStorage.setItem('count', props.notifiCount);
        })
    }, [props.socket]);

    useEffect(()=>{
        setLen(props.notifications.filter((e)=>!e.viewed).length)
    }, [props.notifications])



    const navLinkStyles = ({isActive})=>{
        return{
            border: isActive?'solid':'none',
            borderColor: isActive?'#334155':'none',
            borderWidth: isActive?'1px':'none',
            borderRadius: isActive?'10px':'none',
            backgroundColor: isActive? '#334155':'none',
            color: isActive? 'white':'none'
        }
    }
    
    const imgClickHandler = async (e)=>{
        props.setToggleInfo(" ");
    }

    const barmenuHandler =  async (e)=>{
        e.preventDefault();
        if(toggle==="hidden"){
            setToggle("flex");
            setToggleHeight('h-[250px]')
        }else{
            setToggle("hidden");
            setToggleHeight('h-[80px]');
        }
    }

    const bellClickHandler = async(e)=>{
        navigate('/notifications')
    }
    
    return (
        <nav className="bg-slate-200">
            <div className="hidden  navbarSM:block">
                <div className="flex justify-end h-[80px]">
                    <i className="material-icons text-black text-4xl mr-10 py-4" onClick={barmenuHandler}>menu</i>
                </div>

                <div className={`${toggle} justify-center ${props.info.identity === 'ADMIN' ? 'h-[400px]':'h-[350px]'}`}>
                    <ul className="flex-col">
                        <NavLink style={navLinkStyles} to='/main' className='flex font-inter font-medium text-2xl mb-4 text-darkBg px-2 justify-center'><span>Home</span></NavLink>
                        <NavLink  style={navLinkStyles} to='/liveauction' className='flex font-inter font-medium text-2xl mb-4 text-darkBg px-2 justify-center'><span>Live Games</span></NavLink>
                        <NavLink  style={navLinkStyles} to='/auctionhist' className='flex font-inter font-medium text-2xl mb-4 text-darkBg px-2 justify-center'><span>Game History</span></NavLink>
                        <NavLink  style={navLinkStyles} to='/bidhist' className='flex font-inter font-medium text-2xl mb-4 text-darkBg px-2 justify-center'><span>Selections</span></NavLink>
                        <NavLink  style={navLinkStyles} to='/addauction' className='flex font-inter font-medium text-2xl mb-4 text-darkBg px-2 justify-center'><span>New Game</span></NavLink>
                        <NavLink  style={navLinkStyles} to='/notifications' className='flex font-inter font-medium text-2xl mb-4 text-darkBg px-2 justify-center'><span>Notifications</span></NavLink>
                        {props.info.identity === 'ADMIN' && <NavLink  style={navLinkStyles} to='/winnum' className='flex font-inter font-medium text-2xl mb-4 text-darkBg px-2 justify-center'><span>Win Number</span></NavLink>}
                        <NavLink to='/logout' className='flex font-inter font-medium text-2xl text-darkBg px-2 justify-center'><span>Sign Out</span></NavLink>
                    </ul>
                </div>                
            </div>

            <div className="block h-[80px] navbarSM:hidden">
                <div className="flex justify-end">
                    <ul className={`flex gap-10`}>
                        {props.info.firstname !== undefined && props.info.lastname !== undefined  && 
                        <div className="flex items-center"><span className="font-inter font-medium text-2xl text-darkBg">{props.info.firstname === undefined ?
                        " ": props.info.firstname.toUpperCase()} {props.info.lastname.toUpperCase()}</span></div>}

                        <div className="flex items-center relative"><i className="material-icons text-4xl text-darkBg" 
                        onClick={bellClickHandler}>notifications</i>
                        {<div className="absolute font-inter font-medium top-5 -right-1 p-1 bg-red-700 w-[22px] h-[22px] text-xs text-white flex justify-center items-center rounded-full">
                            {len>9?'9+':len}</div>}
                        </div>
                        <div className="w-[126.67px] pt-3 pb-4 px-0"><img onClick={imgClickHandler} src={require("../../assets/img1.jpeg")} 
                        className="cursor-pointer h-[3rem] w-[3rem] rounded-full"></img></div>
                    </ul>
                </div>
            </div>
        </nav>
      );
}

export default Navbar;