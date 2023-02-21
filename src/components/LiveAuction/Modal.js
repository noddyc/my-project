import React ,{Fragment} from 'react'
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
let slotArr=['slot0', 'slot1', 'slot2', 'slot3', 'slot4', 'slot5', 'slot6', 'slot7','slot8','slot9']


export default function Modal(props) {
    let d = props.d.original
    console.log(d)

    const slotFilled = () => {
        let count = 0;
        slotArr.forEach((i, index)=>{
            if(d[slotArr[index]] === null || (d[slotArr[index]].player1 != null || d[slotArr[index]].player2 != null)){
                count++;
            }
        })
        return count===0;
    }

    function slotObj(slot, split, player1, player2) {
        this.slot= slot;
        this.split = split;
      }


    const slotRef = useRef('');
    const splitRef = useRef('');
    const [openConfirm, setOpenConfirm] = useState(false)
    const auth = useAuthUser();


    const [selectedSlot, setSelectedSlot] = useState('');


    function handleSelectChange(e){
        console.log(e.target.value)
        setSelectedSlot(e.target.value);
    }

    if (!props.open) return null
    return ReactDom.createPortal(
        <>
        <div style={OVERLAY_STYLES} />
        <div style={MODAL_STYLES} className="border-4 border-cardBorderColor rounded-lg">
                <div className="flex flex-col items-start p-0
                  isolate w-[300px] gap-4 navbarSM:w-[180px]">
                    <div className=" flex flex-col  w-[300px] h-8 justify-center overflow-scroll navbarSM:w-[180px]">
                        <p>Host:{'\u00A0'}{'\u00A0'}<strong>{d.User.firstname} {d.User.lastname}</strong></p>
                    </div>

                    <div className=" flex flex-col  w-[300px] h-8 navbarSM:w-[180px]">
                        <p><span>End time: {'\u00A0'}{'\u00A0'}</span><strong>{(moment(d.end_time).clone().tz(props.info.timezone))!==undefined? (moment(d.end_time).clone().tz(props.info.timezone)).format("YYYY-MM-DD HH:mm:ss"):""}</strong></p>     
                     </div>

                    <div className=" flex flex-col  w-[300px] h-8 justify-center overflow-scroll navbarSM:w-[180px]">
                        <h3>{d.product_name}</h3>
                    </div>

                    <div className="w-[300px] h-20 not-italic font-normal text-sm leading-5 tracking-[0.25px] 
                      overflow-scroll text-roboto  pr-2 navbarSM:w-[180px]">
                        <p>{d.product_description}</p>
                    </div>

                    <div className=" flex flex-col flex-wrap overflow-scroll w-[300px] h-64 navbarSM:w-[180px]">
                        {slotArr.map((i,index)=>{
                            if(d?.[i] === null){
                                return (<p key={index}><span>Slot {index}: - </span></p>)
                            }
                            if(d?.[i]?.split === true){
                                if(d?.[i]?.player2 === null){
                                    return (<p key={index}><span>Slot {index}:{'\u00A0'}{'\u00A0'}</span>{`${d?.[i]?.player_1?.firstname+" "+d?.[i]?.player_1?.lastname??'-'}/-`}</p>)
                                }else if(d?.[i]?.player1 === null){
                                    return (<p key={index}><span>Slot {index}:{'\u00A0'}{'\u00A0'}</span>{`-/${d?.[i]?.player_2?.firstname+" "+d?.[i]?.player_2?.lastname??'-'}`}</p>)
                                }
                                else{
                                    return (<p key={index}><span>Slot {index}:{'\u00A0'}{'\u00A0'}</span>{`${d?.[i]?.player_1?.firstname+" "+d?.[i]?.player_1?.lastname??'-'}/${d?.[i]?.player_2?.firstname+" "+d?.[i]?.player_2?.lastname??'-'}`}</p>)
                                }
                            }

                            if(d?.[i]?.split === false){
                                return (<p key={index}><span>Slot {index}:{'\u00A0'}{'\u00A0'}</span>{`${d?.[i]?.player_1?.firstname+" "+d?.[i]?.player_1?.lastname??'-'}`}</p>)
                            }
                            
                        })}
                     </div>


                    <div className=" flex flex-col w-[300px] h-8 navbarSM:w-[180px]">
                            {/* <p>Total Price:{'\u00A0'}{'\u00A0'}<strong>${d.product_price}</strong></p> */}
                            <p>Slot Price:{'\u00A0'}{'\u00A0'}<strong>${Math.round(d.product_price/10)}</strong></p>
                     </div>

                    <div className= {`flex flex-col  w-[300px] h-8  mb-8 navbarSM:w-[180px] ${slotFilled()?'hidden':''}`}>
                        <label htmlFor="slots" >Choose an open slot: </label>
                        <select name="slots" id="slots" className= {`w-3/4 border-2 border-inputColor rounded`} ref={slotRef} onChange={handleSelectChange}>
                            <option value=''>-</option>
                            {
                             (
                                slotArr.map((i, index)=>{
                                    if(d[slotArr[index]] === null){
                                        return (<Fragment key={index}>
                                        {/* <option  value={new slotObj(index, false, null, null)}>{index}-Full</option>
                                        <option  value={new slotObj(index, true, auth().id, null)}>{index}-Split</option> */}
                                        <option key={index} value={index}>{index}</option>
                                        </Fragment> )
                                    }else{
                                        // console.log(d[slotArr[index]]) 
                                        if(d[slotArr[index]]?.split === true && d[slotArr[index]]?.player2 === null){
                                            return (<Fragment key={index}>
                                                {/* <option  value={new slotObj(index, true, d[slotArr[index]]?.player1, auth().id)}>{index}-Split</option> */}
                                                <option key={index} value={index}>{index}</option>
                                            </Fragment>)
                                        }

                                        if(d[slotArr[index]]?.split === true && d[slotArr[index]]?.player1 === null){
                                            return (<Fragment key={index}>
                                                {/* <option  value={new slotObj(index, true, d[slotArr[index]]?.player1, auth().id)}>{index}-Split</option> */}
                                                <option key={index} value={index}>{index}</option>
                                            </Fragment>)
                                        }
                                    }
                                })
                                )

                                // (
                                //     slotArr.map((i, index)=>{
                                //         if(d[slotArr[index]] === null){
                                //             return (<option key={index} value={index}>{index}</option>)
                                //         }
                                // }))
                            } 
                        </select>
                    </div>

                    <div className={`flex flex-col  w-[300px] h-8  mb-16 navbarSM:w-[180px] ${slotFilled()?'hidden':''}`}>
                              <label htmlFor="splitOption">Split option: </label>
                              <select name="splitOption" id="splitOption" className='w-3/4 border-2 border-inputColor rounded' ref={splitRef}>
                                {
                                    selectedSlot === ''?<option value=''>-</option>: 
                                    d[slotArr[selectedSlot]] === null?
                                    <Fragment> 
                                        <option value=''>-</option>
                                        <option value='true'>true</option>
                                        <option value='false'>false</option>
                                    </Fragment>:
                                    d[slotArr[selectedSlot]]?.split === true && (d[slotArr[selectedSlot]]?.player1 == null || d[slotArr[selectedSlot]]?.player2 == null) &&
                                    (d[slotArr[selectedSlot]]?.player1 !== auth().id && d[slotArr[selectedSlot]]?.player2 !== auth().id)?
                                    <Fragment> 
                                        <option value=''>-</option>
                                        <option value='true'>true</option>
                                    </Fragment>:<option value=''>-</option>


                                    // d[slotArr[selectedSlot]]?.split === true && d[slotArr[selectedSlot]]?.player2 === null?
                                    // d[slotArr[selectedSlot]]?.player1 === auth().id?<option value=''>-</option>:
                                    // <Fragment> 
                                    //     <option value=''>-</option>
                                    //     <option value='true'>true</option>
                                    // </Fragment>:<option value=''>-</option>
                                }
                                {/* <option value=''>-</option>
                                <option value='true'>true</option>
                                <option value='false'>false</option> */}
                              </select>
                    </div>

                    <div className= {`flex flex-col  w-[300px] h-8 pl-2 mb-8 navbarSM:w-[180px] ${slotFilled()?'':'hidden'}`}>
                        <span>This game has no open slots</span>
                    </div>


                    <div className="flex flex-row justify-center items-center gap-32 w-[300px] h-8 mb-4 navbarSM:w-[180px] navbarSM:gap-10">
                        <button className="flex flex-col justify-center items-center w-20 h-8 bg-buttonColor text-white rounded-lg navbarSM:w-80"
                        onClick={()=>{
                            props.onClose();
                        }}>Close</button>

                        <button className={`flex flex-col justify-center items-center w-20 h-8 bg-buttonColor text-white rounded-lg navbarSM:w-80 ${slotFilled()?'hidden':''}`}
                        onClick={()=>{
                            // console.log(slotRef.current.value)
                            if(slotRef.current.value!=='' && splitRef.current.value!==''){
                                setOpenConfirm(true)
                            }else{
                                return;
                            }
                            }}>Submit</button>
                    </div>
                </div>
                <ConfirmModal 
                    open={openConfirm} 
                    data={d} 
                    onClose={()=>{setOpenConfirm(false)}} 
                    slot={slotRef.current?slotRef.current.value:''}
                    split={splitRef.current?splitRef.current.value:''}
                    setUpperOnClose = {props.onClose}
                    setDetectChange={props.setDetectChange}>
                </ConfirmModal>
        </div>
        </>,
        document.getElementById('portal')
  )
}