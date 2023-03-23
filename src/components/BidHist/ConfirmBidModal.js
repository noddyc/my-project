import React from 'react'
import ReactDom from 'react-dom'
import { useState } from "react";
import axios from 'axios';
import qs from 'qs'
import {useNavigate} from "react-router-dom"
import { useAuthUser} from 'react-auth-kit';
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


export default function ConfirmBidModal(props) {
    // console.log(props)
    const auth = useAuthUser();
    const [errMsg, setErrMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("")
    const navigate = useNavigate()

    const submitHandler = _.debounce(async (e)=>{
        try{
          let auctionId = props.data.auctionId
          let slot = props.data.slot_number
          let receiverId = props.data.onwerId
          let senderId = auth().id 

          // check if message already in db
          // handle duplicate message
          let msg = `Player ${_.startCase(props.info.firstname+" " + props.info.lastname)} (id: ${senderId}) request retraction of Game (id: ${auctionId}) on Slot ${slot}`

          let data = qs.stringify({
            'message': msg,
            'response': 'NONE'
          });
          let config = {
            method: 'post',
            url: `${ip}/notifications/searchNotifications`,
            headers: { 
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data : data
          };
          
          axios(config)
          .then((response) => {
            console.log(JSON.stringify(response.data));
            if(JSON.stringify(response.data.length) == 0){
                props.socket.emit("createNotification", 
                {
                  name: props.info.firstname+" " + props.info.lastname,
                  auctionId: auctionId,
                  slot: slot,
                  receiverId: receiverId,
                  senderId: senderId
                })
            }else{
                let data = qs.stringify({
                  'id': response.data[0].id 
                });
                let config = {
                  method: 'post',
                  url: `${ip}/notifications/updateNotificationsView`,
                  headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded'
                  },
                  data : data
                };
                
                axios(config)
                .then((response) => {
                  console.log(JSON.stringify(response.data));
                })
                .catch((error) => {
                  console.log(error);
                });
            }
            setSuccessMsg("Withdraw Request Sent Successfully");
            setTimeout(()=>{setSuccessMsg(""); props.onClose(); props.setUpperOnClose()}, 1000);
          })
          .catch((error) => {
            throw new Error(error.message)
          });
        
        }catch(err){
            setErrMsg("Failed to Withdraw Selection");
            setTimeout(()=>{setErrMsg(""); props.onClose(); props.setUpperOnClose()}, 1500);
        }
    }, 800)

    if (!props.open || props.slot==='') return null
    return ReactDom.createPortal(
        <>
        <div style={OVERLAY_STYLES} />
        <div style={MODAL_STYLES} className="border-4 border-cardBorderColor rounded-xl font-inter font-light text-xl navbarSM:text-sm navbarSM:w-[90%]">
                <div className="flex flex-col items-start p-0
                  isolate  gap-4">

                    <div className="flex flex-col w-full mb-2">
                        <div className='font-inter font-bold mb-2'>
                              <h1>Confirm Withdraw Slot Detail{'\u00A0'}{'\u00A0'}</h1>
                        </div>
                    </div>

                    <div className="h-10 overflow-scroll mb-2">
                          <p className="font-inter font-medium text-xl">{_.startCase(props.data.product_name)} {'\u00A0'}</p>
                    </div>

                    <div className='flex gap-4 mb-5'>
                          <div className="font-inter">
                              <span className="font-inter font-medium">Slot Price</span>
                              <p>{'\u00A0'}{'\u00A0'}$ {Math.round(props.data.product_price/10)}.00</p>    
                          </div>

                          <div className="font-inter">
                              <span className="font-inter font-medium">Slot Picked</span>
                              <p>{props.data.slot_number}</p>    
                          </div>
                    </div>


                    <div className='w-full '> 
                        <p className={errMsg ? "warning" : "invisible"} aria-live="assertive"><i className="material-icons inline text-lg">error</i> {errMsg}</p>
                    </div>

                    <div className='w-full'> 
                        <p className={successMsg ? "success" : "invisible"} aria-live="assertive"><i className="material-icons inline text-lg">check</i> {successMsg}</p>
                    </div>

                    
          
                    <div className="flex flex-row justify-center items-center gap-20 w-full h-8 mb-4  navbarSM:justify-start navbarSM:gap-x-[10vw]">
                        <button className="button_light navbarSM:text-xs navbarSM:w-1/2"
                        onClick={()=>{
                            props.onClose()
                        }}><i className="material-icons inline navbarSM:text-xs">cancel</i>Decline</button>

                        <button className={`button navbarSM:text-xs navbarSM:w-1/2`}
                        onClick={submitHandler}><i className="material-icons inline navbarSM:text-sm">check_circle</i>Accept</button>
                    </div>
                </div>
        </div>
        </>,
        document.getElementById('portal')
  )
}