import Navbar from "../Utils/Navbar";
import React,{useEffect, useState} from 'react';
import LeftSideBar from "../Utils/LeftSideBar";
import InfoNavBar from "../Utils/InfoNavBar";
import { io } from "socket.io-client";
import {useAuthUser} from 'react-auth-kit';
import axios from 'axios';
import qs from 'qs';

function Notifications(props) {
    const [like, setLike] = useState(0);
    const auth = useAuthUser();

    useEffect(()=>{
        console.log("line 27")
        const socket = io('http://localhost:9001');
        socket?.emit("newUser", auth().id)
        props.setSocket(socket);
    }, []);


    // useEffect(()=>{
    //     let mostRecentArr = props.notifications.filter((e)=>{return !e.viewed}).map((e)=>{return e.id})
    //     try{
    //         let data = qs.stringify({
    //             'list':mostRecentArr
    //           });
    //         let config = {
    //             method: 'post',
    //             url: 'http://localhost:9001/notifications/updateNotifications',
    //             headers: { 
    //               'Content-Type': 'application/x-www-form-urlencoded'
    //             },
    //             data : data
    //           };
              
    //         axios(config)
    //           .then((response) => {
    //             console.log(JSON.stringify(response.data));
    //         })
    //     }catch(err){
    //         console.log(err.message)
    //     }
    // }, [])

    useEffect(()=>{
        return ()=>{
            props.setNotifications(
                (prev)=>{
                    let arr = prev.map((e)=>{
                        return {...e, viewed:true}
                })
                    return arr; 
                }
            )
        }

    }, [])




    return (
        <div className="h-screen relative">
        <Navbar notifications={props.notifications} setNotifications={props.setNotifications} socket={props.socket} notifiCount={props.notifiCount} setNotificount={props.setNotificount} 
       info={props.info} toggleInfo={props.toggleInfo} setToggleInfo={props.setToggleInfo}></Navbar>
        <div className="flex flex-row h-[calc(100%-80px)] navbarSM:flex navbarSM:flex-col">
              <LeftSideBar></LeftSideBar>
              <div className=' w-full h-[90%] bg-white gap-2 flex flex-col justify-center items-start ml-40 mt-10 mb-10 relative navbarSM:w-full navbarSM:pl-0 navbarSM:pr-0 navbarSM:ml-0'>
                <div>Notifications</div>
                {
                    props.notifications.map((item, index)=>{
                        return (<div key={index} className={`flex flex-col border-2 border-black p-2 rounded-lg gap-2 ${!item.viewed?'bg-red-200':''}`}>
                        {item.message} (id: {item.id})
                        <div className="gap-4 flex">
                            <button className="border-2 border-black px-2 rounded-lg cursor-pointer" onClick = {async (e)=>{
                                try{
                                    console.log(item)
                                    let data = qs.stringify({
                                        'id': item.id,
                                        'response': "ACCEPT"
                                      });
                                      let config = {
                                        method: 'post',
                                        url: 'http://localhost:9001/notifications/confirmNotifications',
                                        headers: { 
                                          'Content-Type': 'application/x-www-form-urlencoded'
                                        },
                                        data : data
                                      };
                                      
                                      axios(config)
                                      .then((response) => {
                                        console.log(JSON.stringify(response.data));
                                      })
                                }catch(err){
                                    console.log(err.message)
                                }
                                props.setNotifications((prev,)=>{
                                    return prev.filter((e,ind)=>{
                                        return ind != index
                                    })
                                })
                            }}>Confirm</button>
                            <button className="border-2 border-black px-2 rounded-lg cursor-pointer">Decline</button>
                        </div>
                        </div> )
                    }

                    )
                }        
              
              </div>
        </div>
        <InfoNavBar info={props.info} toggleInfo={props.toggleInfo} setToggleInfo={props.setToggleInfo}></InfoNavBar>
      </div>
    );
}

export default Notifications;