import React from 'react'
import ReactDom from 'react-dom'
import {useState} from "react";
import axios from 'axios';
import qs from 'qs'
import {useNavigate} from "react-router-dom"
import {useAuthUser} from 'react-auth-kit';
import _ from 'lodash'
import {ip} from '../Utils/ip'

const MODAL_STYLES = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#FFF',
  padding: '50px',
  zIndex: 1000
}

const OVERLAY_STYLES = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, .05)',
  zIndex: 1000
}
let slotArr=['slot_0', 'slot_1', 'slot_2', 'slot_3', 'slot_4', 'slot_5', 'slot_6', 'slot_7','slot_8','slot_9']

function slotFilled(dataValues){
  let count = 0;
  for(let i = 0; i < slotArr.length; i++){
    if(dataValues[slotArr[i]] != null){
      count++;
    }
  }
  return count;
}

function calcInSec(H,M,S){
  return H*3600+M*60+S;
}

export default function ConfirmAuctionHistModal(props) {
    console.log(props.data)
    const auth = useAuthUser();
    const [errMsg, setErrMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("")
    const navigate = useNavigate()

    const submitHandler = _.debounce(async (e)=>{
          let endTime = new Date(props.data.end_time);
          let endTimeUTCYear = endTime.getUTCFullYear();
          let endTimeUTCMonth = endTime.getUTCMonth();
          let endTimeUTCDay = endTime.getUTCDate();
          let endTimeUTCHour = endTime.getUTCHours();
          let endTimeUTCMin = endTime.getUTCMinutes();
          let endTimeUTCSec = endTime.getUTCSeconds();
          let endTimeSec = calcInSec(endTimeUTCHour, endTimeUTCMin, endTimeUTCSec)
          // console.log(endTimeUTCYear + " " + endTimeUTCMonth + " " + endTimeUTCDay + " " + endTimeUTCHour + " " + endTimeUTCMin + " " + endTimeUTCSec)


          let curTime = new Date();
          let curTimeUTCYear = curTime.getUTCFullYear();
          let curTimeUTCMonth = curTime.getUTCMonth();
          let curTimeUTCDay = curTime.getUTCDate();
          let curTimeUTCHour = curTime.getUTCHours();
          let curTimeUTCMin = curTime.getUTCMinutes();
          let curTimeUTCSec = curTime.getUTCSeconds();
          let curTimeSec = calcInSec(curTimeUTCHour, curTimeUTCMin, curTimeUTCSec);
        
          let res = (endTimeUTCYear === curTimeUTCYear && endTimeUTCMonth === curTimeUTCMonth && endTimeUTCDay === curTimeUTCDay
              && (endTimeSec > curTimeSec));
          console.log(endTime)
          console.log(endTimeSec)
          console.log(curTime)
          console.log(curTimeSec)

          // // test
          // let res = (endTimeUTCYear >= curTimeUTCYear && endTimeUTCMonth >= curTimeUTCMonth && endTimeUTCDay >= curTimeUTCDay
          //     || (endTimeSec > curTimeSec));
          // console.log(res)
          
          if(props.data.status === 'NO_WINNER_WINNER_NOTIFIED'){
              try{
                let data = qs.stringify({
                  'auctionId': props.data.id,
                });
        
                let config = {
                    method: 'post',
                    url: `${ip}/auction/rollOver`,
                    headers: { 
                      'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data : data
                  };
                axios(config).then((response) => {
                    console.log(JSON.stringify(response.data));
                    props.setDetectChange((prev)=>{return !prev})
                    setSuccessMsg("Roll Over Successfully");
                }).catch((error) => {
                    console.log("error222")
                    setErrMsg("Failed to roll over");
                    setTimeout(()=>{setSuccessMsg(""); setErrMsg(""); props.onClose(); props.setUpperOnClose(); return;}, 1500);
                  })
                setTimeout(()=>{setSuccessMsg(""); setErrMsg(""); props.onClose(); props.setUpperOnClose(); return;}, 1500);
            }catch(err){
                console.log("here111");
                console.log(err);
                setErrMsg("Failed to Roll Over");
                setTimeout(()=>{setSuccessMsg(""); setErrMsg(""); props.onClose(); props.setUpperOnClose(); return;}, 1500);
                return ;
            }
          }

          if(props.data.status === 'WAITING_FOR_DRAW'){
            try{
              if(!res){
                throw new Error("This game was closed")
              }
              let data = qs.stringify({
                'auctionId': props.data.id,
                'userId': auth().id,
              });
      
              let config = {
                  method: 'post',
                  url: `${ip}/auction/addHost`,
                  headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded'
                  },
                  data : data
                };
              axios(config).then((response) => {
                  console.log(JSON.stringify(response.data));
                  props.setDetectChange((prev)=>{return !prev})
                  setSuccessMsg("Join Game Successfully");
              }).catch((error) => {
                  console.log("error222")
                  setErrMsg("Failed to Join Game");
                  setTimeout(()=>{setSuccessMsg(""); setErrMsg(""); props.onClose();props.setUpperOnClose(); return;}, 1500);
                })
              setTimeout(()=>{setSuccessMsg(""); setErrMsg(""); props.onClose(); props.setUpperOnClose(); return;}, 1500);
          }catch(err){
              console.log("here111");
              console.log(err);
              setErrMsg("Failed to Join Game");
              setTimeout(()=>{setSuccessMsg(""); setErrMsg(""); props.onClose();props.setUpperOnClose(); return;}, 1500);
          }
        }
    }, 800)

    if (!props.open || props.slot==='') return null
    return ReactDom.createPortal(
        <>
        <div style={OVERLAY_STYLES} />
        <div style={MODAL_STYLES} className="border-4 border-cardBorderColor rounded-lg ">
                <div className="flex flex-col items-start p-0
                  isolate w-[250px] gap-4  ">
                    
                    <div className=" flex flex-col w-[250px] h-8 pl-2 mb-36  ">
                            <h1>{(props.data.status==='NO_WINNER_WINNER_NOTIFIED'?'Roll Over':props.data.status==='WAITING_FOR_DRAW'?'Join':'') + ' Detail Confirmation'} {'\u00A0'}{'\u00A0'}</h1>
                            <p>Product Name: <strong>{props.data.product_name}</strong></p>
                            {
                              props.data.status === 'WAITING_FOR_DRAW'? <p>Number of Slot Filled: <strong>{slotFilled(props.data)}</strong></p> : props.data.status ==='NO_WINNER_WINNER_NOTIFIED'?
                               <p>Winning Number: <strong>{props.data.winNum === null ?'-': props.data.winNum.specialNumber}</strong></p>: ''
                            }
                            <p>{props.data.status === 'WAITING_FOR_DRAW'?<strong>{_.startCase("As host, you can join a game with six filled slots to make it live within five minutes before drawing")}</strong>: 
                            props.data.status ==='NO_WINNER_WINNER_NOTIFIED'?<strong>{_.startCase("As host, you can roll over this game if no winner is declared or game did not go live")}</strong>:''}</p>
                     </div>

                     <div className='w-full  '> 
                        <p className={errMsg ? "warning" : "invisible"} aria-live="assertive"><i className="material-icons inline text-lg">error</i> {_.startCase(errMsg)}</p>
                    </div>

                    <div className='w-full  '> 
                        <p className={successMsg ? "success" : "invisible"} aria-live="assertive"><i className="material-icons inline text-lg">check</i> {_.startCase(successMsg)}</p>
                    </div>

                    
                    <div className="flex flex-row justify-center items-center gap-10 w-[250px] h-8 mb-4 navbarSM:justify-start navbarSM:gap-x-[5vw]">
                        <button className="button_light navbarSM:w-80"
                        onClick={()=>{
                            props.onClose()
                        }}><i className="material-icons inline navbarSM:text-sm">cancel</i>Close</button>

                        <button className={`button navbarSM:w-80`}
                        onClick={submitHandler}><i className="material-icons inline navbarSM:text-sm">check_circle</i>Confirm</button>
                    </div>
                </div>
        </div>
        </>,
        document.getElementById('portal')
  )
}