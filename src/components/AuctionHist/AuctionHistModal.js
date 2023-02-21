import React from 'react'
import ReactDom from 'react-dom'
import {useState} from "react";
import moment from 'moment'
import {useAuthUser} from 'react-auth-kit';
import _ from 'lodash'
import ConfirmAuctionHistModal from './ConfirmAuctionHistModal';

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

export default function AuctionHistModal(props) {
    console.log(props)
    let d = props.d.original

    const [openConfirm, setOpenConfirm] = useState(false)
    const auth = useAuthUser();

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
        <div style={MODAL_STYLES} className="border-4 border-cardBorderColor rounded-lg">
                <div className="flex flex-col items-start p-0
                  isolate w-[300px] gap-4 navbarSM:w-[180px]">
                     <div className=" flex flex-col  w-[300px] h-8 items-center justify-center overflow-scroll navbarSM:w-[180px]">
                        <h3>{d.product_name}</h3>
                    </div>

                    <div className="max-w-[300px] max-h-[188px] overflow-hidden navbarSM:w-[180px]">
                          <img className="object-center" src={require('../../assets/card-img1.jpeg')} alt="" />
                    </div>

                    <div className="w-[300px] h-20 not-italic font-normal text-sm leading-5 tracking-[0.25px] 
                      overflow-scroll text-roboto pl-2 pr-2 navbarSM:w-[180px]">
                        <p>Description: {d.product_description}</p>
                    </div>


                    <div className=" flex flex-col  w-[300px] h-8 pl-2 navbarSM:w-[180px]">
                            <p>Total Price:{'\u00A0'}{'\u00A0'}</p>
                            <strong>${d.product_price}</strong>
                     </div>

                     <div className=" flex flex-col w-[300px] h-8 pl-2 mb-2 navbarSM:w-[180px]">
                        <p><span>Start time: {'\u00A0'}{'\u00A0'}</span>{moment(d.start_time).format("YYYY/MM/DD-HH:MM:SS")}</p>    
                        <p><span>End time: {'\u00A0'}{'\u00A0'}</span>{moment(d.end_time).format("YYYY/MM/DD-HH:MM:SS")}</p>     
                     </div>

                     <div className=" flex flex-col w-[300px] h-4 pl-2 navbarSM:w-[180px]">
                        <p><span>Winning number: {'\u00A0'}{'\u00A0'}</span>{d.winning_number}</p>     
                     </div>

                     {/* <div className=" flex flex-col w-[300px] h-4 pl-2 navbarSM:w-[180px]">
                        <p><span>Slots open: {'\u00A0'}{'\u00A0'}</span>{d.slotsOpen}</p>     
                     </div> */}

                     <div className=" flex flex-col flex-wrap overflow-scroll w-[300px] h-32 pl-2 navbarSM:w-[180px]">
                        <p><span>Slot0:{'\u00A0'}{'\u00A0'}</span>{`${d.slot_0?d.slot_0:'-'}`}</p>    
                        <p><span>Slot1:{'\u00A0'}{'\u00A0'}</span>{`${d.slot_1?d.slot_1:'-'}`}</p>    
                        <p><span>Slot2:{'\u00A0'}{'\u00A0'}</span>{`${d.slot_2?d.slot_2:'-'}`}</p>    
                        <p><span>Slot3:{'\u00A0'}{'\u00A0'}</span>{`${d.slot_3?d.slot_3:'-'}`}</p>    
                        <p><span>Slot4:{'\u00A0'}{'\u00A0'}</span>{`${d.slot_4?d.slot_4:'-'}`}</p>   
                        <p><span>Slot5:{'\u00A0'}{'\u00A0'}</span>{`${d.slot_5?d.slot_5:'-'}`}</p>   
                        <p><span>Slot6:{'\u00A0'}{'\u00A0'}</span>{`${d.slot_6?d.slot_6:'-'}`}</p>   
                        <p><span>Slot7:{'\u00A0'}{'\u00A0'}</span>{`${d.slot_7?d.slot_7:'-'}`}</p>   
                        <p><span>Slot8:{'\u00A0'}{'\u00A0'}</span>{`${d.slot_8?d.slot_8:'-'}`}</p>   
                        <p><span>Slot9:{'\u00A0'}{'\u00A0'}</span>{`${d.slot_9?d.slot_9:'-'}`}</p>   
                     </div>

                     <div className=" flex flex-col w-[300px] h-4 pl-2 navbarSM:w-[180px]">
                        <p><span>Status: {'\u00A0'}{'\u00A0'}</span>{statusConversion(d.status)}</p>     
                     </div>


                     <div className="flex flex-row justify-center items-center gap-32 w-[300px] h-8 mb-4 navbarSM:w-[180px] navbarSM:gap-10">
                        <button className="flex flex-col justify-center items-center w-20 h-8 bg-buttonColor text-white rounded-lg navbarSM:w-80"
                        onClick={()=>{
                            props.onClose();
                        }}>Close</button>


                        <button className={`flex flex-col justify-center items-center w-20 h-8 bg-buttonColor text-white rounded-lg navbarSM:w-80 ${d.status ==='IN_PROGRESS' ||
                        d.status ==='CLOSED'?'':'invisible'}`}
                        onClick={()=>{
                                setOpenConfirm(true)
                              }
                            }>Cancel</button>
                    </div>
                </div>
                <ConfirmAuctionHistModal open={openConfirm} data={d} onClose={()=>{setOpenConfirm(false)}} 
                setUpperOnClose = {props.onClose}
                setDetectChange={props.setDetectChange}></ConfirmAuctionHistModal>
        </div>
        </>,
        document.getElementById('portal')
  )
}