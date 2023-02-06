import React from 'react'
import ReactDom from 'react-dom'
import { useRef, useState, useEffect } from "react";
import moment from 'moment'
import axios from 'axios';
import qs from 'qs'
import {BrowserRouter, Routes, Link, Route, Switch, useNavigate} from "react-router-dom"
import {useIsAuthenticated, useAuthUser} from 'react-auth-kit';
import _ from 'lodash'

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

export default function Modal(props) {
    let d = props.d.original
    console.log(props)

    // const [slot, setSlot] = useState("");
    const slotRef = useRef();
    const [errMsg, setErrMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("")
    const auth = useAuthUser();
    const navigate = useNavigate();

    const handleSubmit= _.debounce(async (e)=>{
        try{
            console.log("start")
            if(slotRef.current.value === ""){
                throw new Error("No slot is selected");
            }
            let data = qs.stringify({
              'auctionId': d.auction_id,
              'userId': auth().id,
              'pick': slotRef.current.value,
              'timezone' : 'America/New York'
            });
    
            let config = {
                method: 'post',
                url: 'http://localhost:9001/auction/joinAuction',
                headers: { 
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                data : data
              };
            axios(config).then((response) => {
                console.log(JSON.stringify(response.data));
                props.setDetectChange((prev)=>{return !prev})
                setSuccessMsg("Joined auction successfully")
            })
            setTimeout(()=>{setSuccessMsg(""); props.onClose()}, 500);
        }catch(err){
            console.log(err)
            setErrMsg("Failed to join auction");
        }
    }, 800)

    if (!props.open) return null
    return ReactDom.createPortal(
        <>
        <div style={OVERLAY_STYLES} />
        <div style={MODAL_STYLES} className="border-2 border-inputColor rounded-lg">
                <div className="flex flex-col items-start p-0
                  isolate w-[300px] gap-4 navbarSM:w-[180px]">
                    <div className=" flex flex-col  w-[300px] h-8 items-center justify-center overflow-scroll navbarSM:w-[180px]">
                        <h3>{d.name}</h3>
                    </div>

                    <div className="max-w-[300px] max-h-[188px] overflow-hidden navbarSM:w-[180px]">
                          <img className="object-center" src={require('../assets/card-img.jpeg')} alt="" />
                    </div>

                    <div className="w-[300px] h-20 not-italic font-normal text-sm leading-5 tracking-[0.25px] 
                      overflow-scroll text-roboto pl-2 pr-2 navbarSM:w-[180px]">
                        <p>Description: {d.description}</p>
                    </div>


                    <div className=" flex flex-col  w-[300px] h-8 pl-2 navbarSM:w-[180px]">
                            <p>Total Price{'\u00A0'}{'\u00A0'}</p>
                            <strong>${Math.round(d.price/10*100)/100}</strong>
                     </div>



                     <div className=" flex flex-col  w-[300px] h-8 pl-2 navbarSM:w-[180px]">
                        <p><span>End time: {'\u00A0'}{'\u00A0'}</span>{d.closing_time}</p>     
                     </div>

                    <div className="flex flex-col  w-[300px] h-8 pl-2 mb-8 navbarSM:w-[180px]">
                        <label htmlFor="slots" >Choose an open slot: </label>
                        <select name="slots" id="slots" className='w-3/4 border-2 border-inputColor' ref={slotRef} onChange={()=>{setErrMsg("");setSuccessMsg("")}}>
                            <option value="">-</option>
                            {
                                slotArr.map((i, index)=>{
                                    if(d[slotArr[index]] === null){
                                        return (<option key={index} value={index}>{index}</option>)
                                    }
                                })
                            } 
                        </select>
                    </div>

                    <div className='w-full navbarSM:w-[180px]'> 
                        <p className={errMsg ? "font-bold p-2 mb-2 text-black bg-stone-300" : "invisible"} aria-live="assertive">{errMsg}</p>
                    </div>

                    <div className='w-full navbarSM:w-[180px]'> 
                        <p className={successMsg ? "font-bold p-2 mb-2 text-black bg-stone-300" : "invisible"} aria-live="assertive">{successMsg}</p>
                    </div>

                    <div className="flex flex-row justify-center items-center gap-32 w-[300px] h-8 mb-4 navbarSM:w-[180px] navbarSM:gap-10">
                        <button className="flex flex-col justify-center items-center w-20 h-8 bg-buttonColor text-white rounded-lg navbarSM:w-80"
                        onClick={()=>{
                            setErrMsg("");
                            setSuccessMsg("");
                            props.onClose();
                        }}>Close</button>

                        <button className="flex flex-col justify-center items-center w-20 h-8 bg-buttonColor text-white rounded-lg navbarSM:w-80"
                        onClick={handleSubmit}>Submit</button>
                    </div>
                </div>
        </div>
        </>,
        document.getElementById('portal')
  )
}