import Navbar from "../Utils/Navbar";
import React,{useEffect, useState} from 'react';
import LeftSideBar from "../Utils/LeftSideBar";
import InfoNavBar from "../Utils/InfoNavBar";
import { io } from "socket.io-client";
import {useAuthUser} from 'react-auth-kit';
import axios from 'axios';
import qs from 'qs';
import {ip} from "../Utils/ip"
import _ from 'lodash'



function findWords(sentence, target, count) {
    const words = sentence.split(" ");
    const index = words.indexOf(target);
    console.log(words)
    console.log(index)
  
    if (index !== -1 && index < words.length - count) {
      const wordsAfterGame = words.slice(index + 1, index + 1 + count);
      console.log(wordsAfterGame)
      return wordsAfterGame;
    } else {
      return null;
    }
  }

  
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
        const socket = io(`${ip}`);
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
                url: `${ip}/notifications/updateNotifications`,
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
        <LeftSideBar info={props.info}></LeftSideBar>
        <div className='after-margin-200 overflow-scroll h-full flex flex-col mt-10 ml-[200px] relative font-inter font-light gap-6 navbarSM:ml-[10vw]'>
                <div className="px-4 sm:px-0">
                  <h3 className="text-4xl font-inter font-bold">Notifications</h3>
                </div>


                <div className="flex-col flex-wrap overflow-scroll gap-12 px-4 w-full mt-5 ">
                    {
                        props.notifications.sort((a,b)=>{ 
                            if (a.viewed === b.viewed) {
                                return 0; // no change in ordering
                            } else if (a.viewed) {
                                return 1; // a is viewed, b is not, so b should come first
                            } else {
                                return -1; // b is viewed, a is not, so a should come first
                            }}).map((item, index)=>{
                            let slot = getSlot(item.message);
                            return(<div className={ `flex-col justify-start w-[450px] rounded-2xl border-2 border-darkBg p-2 mb-5
                             hover:shadow-xl ${!item.viewed?'bg-red-100':'bg-cardBGColor'} navbarSM:w-[250px]`} key={index} >

                                <div className="flex-col gap-6 mb-5">
                                    <div className="flex flex-col flex-grow px-2">
                                        <div className="font-inter font-medium flex ">
                                            <span className="font-inter font-medium">{item.message.split(' ')[0]}</span>
                                            <p>{'\u00A0'}{'\u00A0'}{item.message.split(' ')[1]+'\u00A0'+item.message.split(' ')[2]
                                            +'\u00A0'+item.message.split(' ')[3]+item.message.split(' ')[4]}</p>                          
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col flex-grow px-2">
                                        <div className="font-inter font-medium flex ">
                                            <span className="font-inter font-medium">Type:</span>
                                            <p>{'\u00A0'}{'\u00A0'}{item.message.split(' ')[5]==='confirm'?'Retraction Confirm':'Retraction Requested'}</p> 
                                        </div>                      
                                    </div>

                                    <div className="flex flex-col flex-grow px-2">
                                        <div className="font-inter font-medium flex ">
                                            <span className="font-inter font-medium">Game:</span>
                                            <p>{'\u00A0'}{'\u00A0'}{findWords(item.message, 'Game', 2)}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col flex-grow px-2">
                                        <div className="font-inter font-medium flex ">
                                            <span className="font-inter font-medium">Slot:</span>
                                            <p>{'\u00A0'}{'\u00A0'}{findWords(item.message, 'Slot', 1)}</p>
                                        </div>
                                    </div>


                                </div>    

                                <div className=" ">
                                {item.type !== "RETRACTION_RECEIVE"? 
                                 <div className="flex flex-row justify-center items-center gap-32 w-full mt-5 navbarSM:gap-4 navbarSM:justify-start">
                                
                                    <button className="button_light hover:bg-cardHoverColor"
                                    onClick = {async (e)=>{
                                        // console.log(props.info.firstname+" "+props.info.lastname)
                                        props.socket.emit("increaseCount", 
                                        {
                                            name: (props.info.firstname+" "+props.info.lastname),
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
                                    }}><i className="material-icons inline navbarSM:text-sm">cancel</i>Decline</button>

                                    <button className="button hover:bg-cardHoverColor" onClick = {async (e)=>{
                                            props.socket.emit("increaseCount", 
                                            {
                                                name: (props.info.firstname+" "+props.info.lastname),
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
                                        }}><i className="material-icons inline navbarSM:text-sm">check_circle</i>Confirm</button>
                                </div>
                                :
                                <button className="button_light hover:bg-cardHoverColor"
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
                                                url: `${ip}/notifications/deleteNotifications`,
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
                                    ><i className="material-icons inline navbarSM:text-sm">cancel</i>Dismiss
                                </button>}
                            

                                </div>

                            </div>)

                        })
                    }  
              </div>
        </div>
        <InfoNavBar info={props.info} toggleInfo={props.toggleInfo} setToggleInfo={props.setToggleInfo}></InfoNavBar>
      </div>
    );
}

export default Notifications;