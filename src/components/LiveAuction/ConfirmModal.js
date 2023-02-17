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


export default function ConfirmModal(props) {

    const auth = useAuthUser();
    const [errMsg, setErrMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("")
    const navigate = useNavigate()

    const submitHandler = _.debounce(async (e)=>{
        try{
            console.log(props.data)
            if(props.slot === ""){
                throw new Error("No slot is selected");
            }
            let data = qs.stringify({
              'auctionId': props.data.id,
              'userId': auth().id,
              'pick': props.slot,
              'timezone' : 'America/New York'
            });
    
            let config = {
                method: 'post',
                url: `${ip}/auction/joinAuction`,
                headers: { 
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                data : data
              };
            axios(config).then((response) => {
                console.log(JSON.stringify(response.data));
                props.setDetectChange((prev)=>{return !prev})
                setSuccessMsg("Joined auction successfully");
            }).catch((error) => {
                console.log("error222")
                setErrMsg("Failed to join auction");
                setTimeout(()=>{setSuccessMsg(""); setErrMsg(""); props.onClose()}, 1500);
              })
            setTimeout(()=>{setSuccessMsg(""); props.onClose(); props.setUpperOnClose()}, 1500);
        }catch(err){
            console.log("here111");
            console.log(err);
            setErrMsg("Failed to join auction");
        }
    }, 800)

    if (!props.open || props.slot==='') return null
    return ReactDom.createPortal(
        <>
        <div style={OVERLAY_STYLES} />
        <div style={MODAL_STYLES} className="border-2 border-inputColor rounded-lg">
                <div className="flex flex-col items-start p-0
                  isolate w-[250px] gap-4 navbarSM:w-[180px]">
                    
                    <div className=" flex flex-col w-[250px] h-8 pl-2 mb-36 navbarSM:w-[180px]">
                            <h1>Confirm Bid Detail: {'\u00A0'}{'\u00A0'}</h1>
                            <p>Product Name <strong>{props.data.product_name}</strong></p>
                            <p>Bid Price  <strong>${Math.round(props.data.product_price/10*100)/100}</strong></p>
                            <p>Slot Picked <strong>{props.slot}</strong></p>
                     </div>

                     <div className='w-full navbarSM:w-[180px]'> 
                        <p className={errMsg ? "font-bold p-2 mb-2 text-black bg-stone-300" : "invisible"} aria-live="assertive">{errMsg}</p>
                    </div>

                    <div className='w-full navbarSM:w-[180px]'> 
                        <p className={successMsg ? "font-bold p-2 mb-2 text-black bg-stone-300" : "invisible"} aria-live="assertive">{successMsg}</p>
                    </div>

                    
                    <div className="flex flex-row justify-center items-center gap-20 w-[250px] h-8 mb-4 navbarSM:w-[180px] navbarSM:gap-10">
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