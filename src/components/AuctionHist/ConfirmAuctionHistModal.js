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

export default function ConfirmAuctionHistModal(props) {
    console.log(props.data)
    const auth = useAuthUser();
    const [errMsg, setErrMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("")
    const navigate = useNavigate()

    const submitHandler = _.debounce(async (e)=>{
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
                    setTimeout(()=>{setSuccessMsg(""); setErrMsg(""); props.onClose()}, 1500);
                  })
                setTimeout(()=>{setSuccessMsg(""); props.onClose(); props.setUpperOnClose(); return;}, 1500);
            }catch(err){
                console.log("here111");
                console.log(err);
                setErrMsg("Failed to Roll Over");
                return ;
            }
          }

          if(props.data.status === 'WAITING_FOR_DRAW'){
            try{
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
                  setTimeout(()=>{setSuccessMsg(""); setErrMsg(""); props.onClose()}, 1500);
                })
              setTimeout(()=>{setSuccessMsg(""); props.onClose(); props.setUpperOnClose(); return;}, 1500);
          }catch(err){
              console.log("here111");
              console.log(err);
              setErrMsg("Failed to Join Game");
              return;
          }
        }
    }, 800)

    if (!props.open || props.slot==='') return null
    return ReactDom.createPortal(
        <>
        <div style={OVERLAY_STYLES} />
        <div style={MODAL_STYLES} className="border-4 border-cardBorderColor rounded-lg">
                <div className="flex flex-col items-start p-0
                  isolate w-[250px] gap-4  ">
                    
                    <div className=" flex flex-col w-[250px] h-8 pl-2 mb-36  ">
                            <h1>{(props.data.status==='NO_WINNER_WINNER_NOTIFIED'?'Roll Over':props.data.status==='WAITING_FOR_DRAW'?'Join':'') + ' Detail Confirmation'} {'\u00A0'}{'\u00A0'}</h1>
                            <p>Product Name: <strong>{props.data.product_name}</strong></p>
                            {
                              props.data.status === 'WAITING_FOR_DRAW'? <p>Slot Filled: <strong>{slotFilled(props.data)}</strong></p> : props.data.status ==='NO_WINNER_WINNER_NOTIFIED'?
                               <p>Winning Number: <strong>{props.data.winnning_number === null ?'-': props.data.winnning_number}</strong></p>: ''
                            }
                            <p>{props.data.status === 'WAITING_FOR_DRAW'?<strong>As host, you can join a game with 6 filled slots to make it live within five minutes before drawing</strong>: 
                            props.data.status ==='NO_WINNER_WINNER_NOTIFIED'?<strong>As host, you can roll over this game if no winner is declared</strong>:''}</p>
                     </div>

                     <div className='w-full  '> 
                        <p className={errMsg ? "font-bold p-2 mb-2 text-black bg-stone-300" : "invisible"} aria-live="assertive">{errMsg}</p>
                    </div>

                    <div className='w-full  '> 
                        <p className={successMsg ? "font-bold p-2 mb-2 text-black bg-stone-300" : "invisible"} aria-live="assertive">{successMsg}</p>
                    </div>

                    
                    <div className="flex flex-row justify-center items-center gap-20 w-[250px] h-8 mb-4   navbarSM:gap-10">
                        <button className="flex flex-col justify-center items-center w-32 h-8 bg-buttonColor text-white rounded-lg navbarSM:w-80"
                        onClick={()=>{
                            props.onClose()
                        }}>Close</button>

                        <button className={`flex flex-col justify-center items-center w-32 h-8 bg-buttonColor text-white rounded-lg navbarSM:w-80`}
                        onClick={submitHandler}>Confirm</button>
                    </div>
                </div>
        </div>
        </>,
        document.getElementById('portal')
  )
}