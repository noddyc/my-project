import React from 'react'
import ReactDom from 'react-dom'
import { useRef, useState, useEffect } from "react";
import moment from 'moment'

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
    let d = props.d
    // console.log(d)
    if(d!== undefined && d['Auction'] !== undefined){
        d = d['Auction']
    }
    const [slot, setSlot] = useState("");
    if (!props.open) return null
    return ReactDom.createPortal(
        <>
        <div style={OVERLAY_STYLES} />
        <div style={MODAL_STYLES}>
                <div>
                    <div>
                        <h3>{d.product_name}</h3>
                        <p>{d.product_description}</p>
                    </div>


                    <div>
                        <div>
                        <p>Price to bid:{'\u00A0'}{'\u00A0'}</p>
                        <strong>$ {Math.round(d.product_price/10*100)/100}</strong>
                        </div>

                        <div className="time">
                        <p><span>Start time: {'\u00A0'}{'\u00A0'}</span>{moment(d.start_time).format('MM/DD/YYYY HH:mm:ss')}</p>
                        <p><span>End time: {'\u00A0'}{'\u00A0'}</span>{moment(d.end_time).format('MM/DD/YYYY HH:mm:ss')}</p>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="slots" >Choose an open slot: </label>
                        <select name="slots" id="slots">
                            {
                                slotArr.map((i, index)=>{
                                    if(d[slotArr[index]] === null){
                                        return (<option key={index} value={index}>{index}</option>)
                                    }
                                })
                            } 
                        </select>
                    </div>

                    <div className="">
                        <button onClick={props.onClose}>Submit</button>
                        <button onClick={props.onClose}>Cancel</button>
                    </div>
                </div>
        </div>
        </>,
        document.getElementById('portal')
  )
}