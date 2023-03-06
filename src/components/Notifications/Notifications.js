import Navbar from "../Utils/Navbar";
import React,{useEffect, useState} from 'react';
import LeftSideBar from "../Utils/LeftSideBar";
import InfoNavBar from "../Utils/InfoNavBar";
import { io } from "socket.io-client";
import {useAuthUser} from 'react-auth-kit';
import axios from 'axios';
import qs from 'qs';


function getSlot(sentence){
    const lastWord = sentence.split(" ").pop(); 
    const lastNumber = parseInt(lastWord); 
    return lastNumber
}

function Notifications(props) {

    console.log(props.info)
    let name = props.info.firstname+" " + props.info.lastname;
    console.log(name);
    const [like, setLike] = useState(0);
    const auth = useAuthUser();

    useEffect(()=>{
        console.log("line 27")
        const socket = io('http://localhost:9001');
        socket?.emit("newUser", auth().id)
        props.setSocket(socket);
    }, []);


    useEffect(()=>{
        props.setNotifications(
            (prev)=>{
                let arr = prev.map((e)=>{
                    console.log(e)
                    return {...e, viewed: true}
            })
                return arr; 
            }
        )
        // because set notifications is async so props.notifications is not updated yet
        // let mostRecentArr = props.notifications.map((e)=>{return e.id});
        try{
            let data = qs.stringify({
                'list':auth().id
              });
            let config = {
                method: 'post',
                url: 'http://localhost:9001/notifications/updateNotifications',
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
    }, [])

    


    return (
        <div className="h-screen relative">
        <Navbar notifications={props.notifications} setNotifications={props.setNotifications} socket={props.socket} notifiCount={props.notifiCount} setNotificount={props.setNotificount} 
       info={props.info} setInfo={props.setInfo} toggleInfo={props.toggleInfo} setToggleInfo={props.setToggleInfo}></Navbar>
        <div className="flex flex-row h-[calc(100%-80px)] navbarSM:flex navbarSM:flex-col">
              <LeftSideBar></LeftSideBar>
              <div className=' w-full h-[90%] bg-white gap-2 flex flex-col justify-center items-start ml-40 mt-10 mb-10 relative navbarSM:w-full navbarSM:pl-0 navbarSM:pr-0 navbarSM:ml-0'>
                <div className="mb-2 mt-2 ml-2 absolute top-0"><h1 className="font-bold text-5xl">Notifications</h1></div>
                <div className="flex flex-col gap-8 absolute top-20 left-8">
                {
                    props.notifications.map((item, index)=>{
                        console.log(item)
                        let slot = getSlot(item.message)
                        return (<div key={index} className={`flex flex-col border-2 border-black p-2 rounded-lg gap-2 hover:shadow-xl
                         ${!item.viewed?'bg-red-100':'bg-cardBGColor'}`}>
                        {item.message}
                        <div className="gap-4 flex">
                            {item.type !== "RETRACTION_RECEIVE"? 
                                 <><button className="border-2 border-black px-2 rounded-lg cursor-pointer hover:bg-cardHoverColor" onClick = {async (e)=>{
                                    props.socket.emit("increaseCount", 
                                    {
                                        auctionId: item.auctionId,
                                        slot: slot,
                                        id: item.id,
                                        receiverId: item.senderId,
                                        response: "ACCEPT"
                                    });
                                    props.setNotifications((prev)=>{
                                        return prev.filter((e,ind)=>{
                                            return ind != index
                                        })
                                    })
                                }}>Confirm</button>
                                
                                <button className="border-2 border-black px-2 rounded-lg cursor-pointer hover:bg-cardHoverColor"
                                onClick = {async (e)=>{
                                    // console.log(props.info.firstname+" "+props.info.lastname)
                                    props.socket.emit("increaseCount", 
                                    {
                                        // name: props.info.firstname+" "+props.info.lastname,
                                        auctionId: item.auctionId,
                                        slot: slot,
                                        id: item.id,
                                        receiverId: item.senderId,
                                        response: "DECLINE"
                                    });
                                    props.setNotifications((prev)=>{
                                        return prev.filter((e,ind)=>{
                                            return ind != index
                                        })
                                    })
                                }}>Decline</button></>:

                                <button className="border-2 border-black px-2 rounded-lg cursor-pointer hover:bg-cardHoverColor"
                                onClick={async ()=>{
                                    props.setNotifications((prev)=>{
                                        return prev.filter((e,ind)=>{
                                            return ind != index
                                        })
                                    })
                                    let id = item.id;
                                    try{
                                        let data = qs.stringify({
                                            'id':id
                                          });
                                        let config = {
                                            method: 'post',
                                            url: 'http://localhost:9001/notifications/deleteNotifications',
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
                                }
                                }
                                >Dismiss</button>}
                            
                        </div>
                        </div> )
                    })
                }        
                </div>
              </div>
        </div>
        <InfoNavBar info={props.info} toggleInfo={props.toggleInfo} setToggleInfo={props.setToggleInfo}></InfoNavBar>
      </div>
    );
}

export default Notifications;