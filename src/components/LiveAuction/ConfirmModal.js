import React from 'react'
import ReactDom from 'react-dom'
import {useState, useRef, useEffect} from "react";
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


export default function ConfirmModal(props) {

    const auth = useAuthUser();
    const [errMsg, setErrMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("")
    const navigate = useNavigate()

    const submitHandler = _.debounce(async (e)=>{
        try{
            // console.log(props.data)
            if(props.slot === ""){
                throw new Error("No slot is selected");
            }


            let data = qs.stringify({
              'auctionId': props.data.id,
              'userId': auth().id,
              'slot': props.slot,
              'split': props.split
            });
    
            let config = {
                method: 'post',
                url: `${ip}/auction/joinAuction1`,
                headers: { 
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                data : data
              };
            axios(config).then((response) => {
                console.log(JSON.stringify(response.data));
                props.setDetectChange((prev)=>{return !prev})
                setSuccessMsg("Joined game successfully");
            }).catch((error) => {
                console.log("error222")
                setErrMsg("Failed to join game");
                setTimeout(()=>{setSuccessMsg(""); setErrMsg(""); props.onClose()}, 1500);
              })
            setTimeout(()=>{setSuccessMsg(""); props.onClose(); props.setUpperOnClose()}, 1500);
        }catch(err){
            console.log("here111");
            console.log(err);
            setErrMsg(err.message);
        }
    }, 800)

    if (!props.open || props.slot==='') return null
    return ReactDom.createPortal(
        <>
        <div style={OVERLAY_STYLES} />
        <div style={MODAL_STYLES} className="border-4 border-cardBorderColor rounded-xl font-inter font-light text-xl">
                <div className="flex flex-col items-start p-0
                  isolate w-[375px] gap-4 navbarSM:w-[180px]">
                    
                    <div className="flex flex-col w-full mb-4 navbarSM:w-[180px]">
                      
                      <div className='font-inter font-bold mb-2'>
                          <h1>Confirm Slot Detail:{'\u00A0'}{'\u00A0'}</h1>
                      </div>
                      
                                
                      <div className="h-10 overflow-scroll mb-2">
                          <p className="font-inter font-medium text-xl">{_.startCase(props.data.product_name) + " I am from USA "} {'\u00A0'}</p>
                      </div>

                      <div className='flex gap-4 mb-5'>
                        <div className="font-inter">
                            <span className="font-inter font-medium">Total Price</span>
                            <p>{'\u00A0'}{'\u00A0'}$ {Math.round(props.data.product_price/10)}.00</p>    
                        </div>

                        <div className="font-inter">
                            <span className="font-inter font-medium">Slot Picked</span>
                            <p>{'\u00A0'}{'\u00A0'}{props.slot}</p>    
                        </div>

                        <div className="font-inter">
                            <span className="font-inter font-medium">Slot Option</span>
                            <p>{'\u00A0'}{'\u00A0'}{_.startCase(props.split)}</p>    
                        </div>

                      </div>
                    </div>

                    <div className='w-full navbarSM:w-[180px]'> 
                        <p className={errMsg ? "font-bold p-2 mb-2 text-black rounded-lg bg-stone-300" : "invisible"} aria-live="assertive">{errMsg}</p>
                    </div>

                    <div className='w-full navbarSM:w-[180px]'> 
                        <p className={successMsg ? "font-bold p-2 mb-2 text-black rounded-lg bg-stone-300" : "invisible"} aria-live="assertive">{successMsg}</p>
                    </div>
                    
                    <div className="flex flex-row justify-center items-center gap-20 w-full h-8 mb-4 navbarSM:w-[180px] navbarSM:gap-10">
                        <button className="button_light"
                        onClick={()=>{
                            props.onClose()
                        }}><i className="material-icons inline">cancel</i>Decline</button>

                        <button className={`button`}
                        onClick={submitHandler}><i className="material-icons inline">check_circle</i>Accept</button>
                    </div>
                </div>
        </div>
        </>,
        document.getElementById('portal')
  )
}