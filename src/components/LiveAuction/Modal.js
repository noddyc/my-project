import React from 'react'
import ReactDom from 'react-dom'
import { useRef, useState} from "react";
import {useAuthUser} from 'react-auth-kit';
import _ from 'lodash'
import ConfirmModal from './ConfirmModal';
import moment from 'moment'


const MODAL_STYLES = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#FFF',
  padding: '50px',
  zIndex: 500
}

const OVERLAY_STYLES = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, .05)',
  zIndex: 500
}
let slotArr=['slot_0', 'slot_1', 'slot_2', 'slot_3', 'slot_4', 'slot_5', 'slot_6', 'slot_7','slot_8','slot_9']


export default function Modal(props) {
    let d = props.d.original
    console.log(props)

    const slotFilled = () => {
        let count = 0;
        slotArr.forEach((i, index)=>{
            if(d[slotArr[index]] === null){
                count++;
            }
        })
        return count===0;
    }


    const slotRef = useRef('');
    const [openConfirm, setOpenConfirm] = useState(false)
    const auth = useAuthUser();


    if (!props.open) return null
    return ReactDom.createPortal(
        <>
        <div style={OVERLAY_STYLES} />
        <div style={MODAL_STYLES} className="border-2 border-inputColor rounded-lg">
                <div className="flex flex-col items-start p-0
                  isolate w-[300px] gap-4 navbarSM:w-[180px]">
                    <div className=" flex flex-col  w-[300px] h-8 items-center justify-center overflow-scroll navbarSM:w-[180px]">
                        <h3>{d.product_name}</h3>
                    </div>

                    <div className="max-w-[300px] max-h-[188px] overflow-hidden navbarSM:w-[180px]">
                          <img className="object-center" src={require('../../assets/card-img.jpeg')} alt="" />
                    </div>

                    <div className="w-[300px] h-20 not-italic font-normal text-sm leading-5 tracking-[0.25px] 
                      overflow-scroll text-roboto pl-2 pr-2 navbarSM:w-[180px]">
                        <p>Description: {d.product_description}</p>
                    </div>


                    <div className=" flex flex-col  w-[300px] h-8 pl-2 navbarSM:w-[180px]">
                            <p>Bid Price{'\u00A0'}{'\u00A0'}</p>
                            <strong>${Math.round(d.product_price/10*100)/100}</strong>
                     </div>



                     <div className=" flex flex-col  w-[300px] h-8 pl-2 navbarSM:w-[180px]">
                        <p><span>End time: {'\u00A0'}{'\u00A0'}</span>{(moment(d.end_time).clone().tz(props.info.timezone))!==undefined? (moment(d.end_time).clone().tz(props.info.timezone)).format("YYYY-MM-DD HH:mm:ss"):""}</p>     
                     </div>

                    <div className= {`flex flex-col  w-[300px] h-8 pl-2 mb-16 navbarSM:w-[180px] ${slotFilled()?'hidden':''}`}>
                        <label htmlFor="slots" >Choose an open slot: </label>
                        <select name="slots" id="slots" className= {`w-3/4 border-2 border-inputColor`} ref={slotRef}>
                            <option value=''>-</option>
                            {
                             (
                                slotArr.map((i, index)=>{
                                    if(d[slotArr[index]] === null){
                                        return (<option key={index} value={index}>{index}</option>)
                                    }
                                }))
                            } 
                        </select>
                        
                        <label htmlFor="split">Choose split option</label>
                        <select name="split" id="split" className= {`w-3/4 border-2 border-inputColor`} >
                            <option value= 'false'>no</option>
                            <option value= 'true'>yes</option>
                        </select>
                    </div>

                    <div className= {`flex flex-col  w-[300px] h-8 pl-2 mb-8 navbarSM:w-[180px] ${slotFilled()?'':'hidden'}`}>
                        <span>This auction has no open slots</span>
                    </div>


                    <div className="flex flex-row justify-center items-center gap-32 w-[300px] h-8 mb-4 navbarSM:w-[180px] navbarSM:gap-10">
                        <button className="flex flex-col justify-center items-center w-20 h-8 bg-buttonColor text-white rounded-lg navbarSM:w-80"
                        onClick={()=>{
                            props.onClose();
                        }}>Close</button>

                        <button className={`flex flex-col justify-center items-center w-20 h-8 bg-buttonColor text-white rounded-lg navbarSM:w-80 ${slotFilled()?'hidden':''}`}
                        onClick={()=>{
                            console.log(slotRef.current.value)
                            if(slotRef.current.value!==''){
                                setOpenConfirm(true)
                            }else{
                                return;
                            }
                            }}>Submit</button>
                    </div>
                </div>
                <ConfirmModal open={openConfirm} data={d} onClose={()=>{setOpenConfirm(false)}} slot={slotRef.current?slotRef.current.value:''}
                setUpperOnClose = {props.onClose}
                setDetectChange={props.setDetectChange}></ConfirmModal>
        </div>
        </>,
        document.getElementById('portal')
  )
}