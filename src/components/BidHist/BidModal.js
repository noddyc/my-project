import React from 'react'
import ReactDom from 'react-dom'
import { useRef, useState} from "react";
import moment from 'moment'
import {useNavigate} from "react-router-dom"
import {useAuthUser} from 'react-auth-kit';
import _ from 'lodash'
import ConfirmBidModal from './ConfirmBidModal'

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

export default function BidModal(props) {
   //  console.log(props)
    let d = props.d.original
    // console.log(d)

    // const [slot, setSlot] = useState("");
    const slotRef = useRef();
    const [errMsg, setErrMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("")
    const auth = useAuthUser();
    const navigate = useNavigate();
    const [openConfirm, setOpenConfirm] = useState(false)

    const statusConversion = (status, winning)=>{
      if(status === "OPEN_LIVE"){
        return "OPEN LIVE"
      }
      if(status === "OPEN_NOT_LIVE"){
        return "OPEN NOT LIVE"
      }
      if(status === "WAITING_FOR_DRAW"){
        return "WAITING FOR DRAW";
      }
      if(status === "NO_WINNER_WINNER_NOTIFIED"){
        return "WINNING NUMBER POSTED"
      }
    }


    if (!props.open) return null
    return ReactDom.createPortal(
        <>
        <div style={OVERLAY_STYLES} />
        <div style={MODAL_STYLES} className="border-4 border-cardBorderColor rounded-lg font-inter font-light text-xl">
                <div className="flex flex-col items-start p-0
                  isolate w-[450px]   ">
                    <div className="h-14 overflow-scroll">
                          <p className="font-inter font-bold text-xl">{_.startCase(d.product_name)} {'\u00A0'}
                          </p>
                    </div>

              
                    <div className="h-30 mt-5">
                          <span className="font-inter font-medium">Description</span>
                          <div className="not-italic h-24 tracking-[0.25px] overflow-scroll break-all"><p>{_.capitalize(d.product_description +
                             " I am from USA I am from USA I am from USA I am from USA I am from USA ")} </p></div>
                    </div>


                    <div className="font-inter mt-5">
                          <span className="font-inter font-medium">Total Price</span>
                          <p>{'\u00A0'}{'\u00A0'}$ {Math.round(d.product_price)}.00</p>    
                    </div>

                    <div className="font-inter mt-5">
                          <span className="font-inter font-medium">End time</span>
                          <p>{'\u00A0'}{'\u00A0'}{(moment(d.end_time).clone().tz(props.info.timezone))!==undefined? (moment(d.end_time).clone().tz(props.info.timezone)).format("YYYY-MM-DD"):""}
                                  {'\u00A0'}({(moment(d?.end_time).clone().tz('UTC').format("HH:mm:ss")==="12:40:00"?'DAY':'NIGHT')})</p>    
                    </div>

                    <div className="font-inter mt-5">
                          <span className="font-inter font-medium">Owner</span>
                          <p>{'\u00A0'}{'\u00A0'}{d.onwerId}</p>     
                    </div>

                    <div className="font-inter mt-5">
                          <span className="font-inter font-medium">Slot Picked</span>
                          <p>{'\u00A0'}{'\u00A0'}{d.slot_number}</p>     
                    </div>

      
                    <div className="font-inter mt-5">
                          <span className="font-inter font-medium">Status</span>
                          <p>{'\u00A0'}{'\u00A0'}{statusConversion(d.status)}</p>     
                    </div>
                
                    

                     <div className="flex flex-row justify-center items-center gap-32 w-full mt-5  navbarSM:gap-10">
                        <button className="button_light navbarSM:w-80"
                        onClick={()=>{
                            props.onClose();
                        }}><i className="material-icons inline">cancel</i>Decline</button>


                        <button className={`button
                        ${d.status === 'OPEN_LIVE' || d.status === 'OPEN_NOT_LIVE' ?'': 'hidden'} navbarSM:w-80`}
                        onClick={()=>{
                           setOpenConfirm(true)
                            }}><i className="material-icons inline">published_with_changes</i>Withdraw</button>
                    </div>
                </div>
                <ConfirmBidModal open={openConfirm} data={d} onClose={()=>{setOpenConfirm(false)}} info={props.info}
                setUpperOnClose = {props.onClose} socket = {props.socket}
                setDetectChange={props.setDetectChange}></ConfirmBidModal>
        </div>
        </>,
        document.getElementById('portal')
  )
}