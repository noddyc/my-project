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
            border: isActive?'solid':'none',
            borderColor: isActive?'#334155':'none',
            borderWidth: isActive?'1px':'none',
            borderRadius: isActive?'10px':'none',
            backgroundColor: isActive? '#334155':'none'
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

                <div className={`${toggle} justify-center h-[300px]`}>
                    <ul className="flex-col">
                        <NavLink style={navLinkStyles} to='/main' className='flex font-inter font-medium text-2xl mb-4 text-white px-2 justify-center'><span>Home</span></NavLink>
                        <NavLink  style={navLinkStyles} to='/liveauction' className='flex font-inter font-medium text-2xl mb-4 text-white px-2 justify-center'><span>Live Games</span></NavLink>
                        <NavLink  style={navLinkStyles} to='/auctionhist' className='flex font-inter font-medium text-2xl mb-4 text-white px-2 justify-center'><span>Game History</span></NavLink>
                        <NavLink  style={navLinkStyles} to='/bidhist' className='flex font-inter font-medium text-2xl mb-4 text-white px-2 justify-center'><span>Selections</span></NavLink>
                        <NavLink  style={navLinkStyles} to='/addauction' className='flex font-inter font-medium text-2xl mb-4 text-white px-2 justify-center'><span>New Game</span></NavLink>
                        <NavLink to='/logout' className='flex font-inter font-medium text-2xl text-white px-2 justify-center'><span>Sign Out</span></NavLink>
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
                        {<div className="absolute font-inter font-medium top-5 -right-1 bg-red-700 w-5 h-5 text-xs text-white flex justify-center items-center rounded-full">{len}</div>}
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