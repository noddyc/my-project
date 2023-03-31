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
        <div style={MODAL_STYLES} className="border-4 border-cardBorderColor rounded-lg font-inter font-light text-xl flex flex-col items-center navbarSM:w-[90%]
        navbarSM:text-xs">
                <div className="flex flex-col items-start p-0
                  isolate w-[450px] navbarSM:w-[90%]">
                    <div className="h-14 overflow-scroll ">
                          <p className="font-inter font-bold text-xl">{_.startCase(d.product_name)} {'\u00A0'}
                          </p>
                    </div>

                    <div className="h-30 mt-5 navbarSM:mt-0">
                          <span className="font-inter font-medium">Description:</span>
                          <div className="not-italic h-24 tracking-[0.25px] overflow-scroll break-all"><p>{_.capitalize(d.product_description)} </p></div>
                    </div>


                    <div className="flex flex-col flex-wrap overflow-scroll w-full h-76 mt-5 navbarSM:mt-2">
                                <p className='font-inter font-medium'>Slots:</p>
                                <div className='grid grid-cols-2 w-full'>
                                    {slotArr.map((i,index)=>{
                                        if(d?.[i] === null){
                                            return (<div className='w-1/2' key={index}><p className='leading-7' key={index}><span>{'\u00A0'}{'\u00A0'}<strong>{index}:</strong> - </span></p></div>)
                                        }
                                        if(d?.[i]?.split === true){
                                            if(d?.[i]?.player2 === null){
                                                return (<div className='w-1/2' key={index}><p className='leading-7' key={index}><span>{'\u00A0'}{'\u00A0'}<strong>{index}:</strong>{'\u00A0'}</span>{`${_.startCase(d?.[i]?.player_1?.firstname)+" "+_.startCase(d?.[i]?.player_1?.lastname)??'-'}/-`}</p></div>)
                                            }else if(d?.[i]?.player1 === null){
                                                return (<div className='w-1/2' key={index}><p className='leading-7' key={index}><span>{'\u00A0'}{'\u00A0'}<strong>{index}:</strong>{'\u00A0'}</span>{`-/${_.startCase(d?.[i]?.player_2?.firstname)+" "+_.startCase(d?.[i]?.player_2?.lastname)??'-'}`}</p></div>)
                                            }
                                            else{
                                                return (<div className='w-1/2' key={index}><p className='leading-7' key={index}><span>{'\u00A0'}{'\u00A0'}<strong>{index}:</strong>{'\u00A0'}</span>{`${_.startCase(d?.[i]?.player_1?.firstname)+" "+_.startCase(d?.[i]?.player_1?.lastname)??'-'}/${_.startCase(d?.[i]?.player_2?.firstname)+" "+_.startCase(d?.[i]?.player_2?.lastname)??'-'}`}</p></div>)
                                            }
                                        }

                                        if(d?.[i]?.split === false){
                                            return (<div className='w-1/2' key={index}><p className='leading-7' key={index}><span>{'\u00A0'}{'\u00A0'}<strong>{index}:</strong>{'\u00A0'}{'\u00A0'}</span>{`${_.startCase(d?.[i]?.player_1?.firstname)+" "+_.startCase(d?.[i]?.player_1?.lastname)??'-'}`}</p></div>)
                                        }
                                        
                                    })}
                                </div>
                     </div>


                     <div className="font-inter mt-5">
                          <span className="font-inter font-medium">Selection Price:</span>
                          <p>{'\u00A0'}{'\u00A0'}$ {Math.round(d.product_price/10)}.00</p>    
                    </div>


                    <div className= {`flex flex-col w-[300px] mt-5 gap-2  navbarSM:w-[90%] ${slotFilled()?'hidden':''}`}>
                        <label htmlFor="slots" className='font-medium'>Choose an Open Slot <span className='text-red-500'>*</span></label>
                        <select name="slots" id="slots" className= {`w-3/4 border-2 border-inputColor rounded-full`} ref={slotRef} onChange={handleSelectChange}>
                            <option value=''>{'\u00A0'}-</option>
                            {
                             (
                                slotArr.map((i, index)=>{
                                    if(d[slotArr[index]] === null){
                                        return (<Fragment key={index}>
                                        <option key={index} value={index}>{'\u00A0'}{index}</option>
                                        </Fragment> )
                                    }else{
                                        // console.log(d[slotArr[index]]) 
                                        if(d[slotArr[index]]?.split === true && d[slotArr[index]]?.player2 === null){
                                            return (<Fragment key={index}>
                                                <option key={index} value={index}>{'\u00A0'}{index}</option>
                                            </Fragment>)
                                        }

                                        if(d[slotArr[index]]?.split === true && d[slotArr[index]]?.player1 === null){
                                            return (<Fragment key={index}>
                                                <option key={index} value={index}>{'\u00A0'}{index}</option>
                                            </Fragment>)
                                        }
                                    }
                                })
                                )
                            } 
                        </select>
                    </div>

                    <div className={`flex flex-col  w-[300px] mt-5 gap-2  navbarSM:w-[90%] ${slotFilled()?'hidden':''}`}>
                              <label htmlFor="splitOption" className='font-medium'>Split Option <span className='text-red-500'>*</span></label>
                              <select name="splitOption" id="splitOption" className='w-3/4 border-2 border-inputColor rounded-full' ref={splitRef}>
                                {
                                    selectedSlot === ''?<option value=''>{'\u00A0'}-</option>: 
                                    d[slotArr[selectedSlot]] === null?
                                    <Fragment> 
                                        <option value=''>{'\u00A0'}-</option>
                                        <option value='true'>{'\u00A0'}TRUE</option>
                                        <option value='false'>{'\u00A0'}FALSE</option>
                                    </Fragment>:
                                    d[slotArr[selectedSlot]]?.split === true && (d[slotArr[selectedSlot]]?.player1 == null || d[slotArr[selectedSlot]]?.player2 == null) &&
                                    (d[slotArr[selectedSlot]]?.player1 !== auth().id && d[slotArr[selectedSlot]]?.player2 !== auth().id)?
                                    <Fragment> 
                                        <option value=''>{'\u00A0'}-</option>
                                        <option value='true'>{'\u00A0'}TRUE</option>
                                    </Fragment>:<option value=''>{'\u00A0'}-</option>
                                }

                              </select>
                    </div>

                    <div className= {`warning w-full  ${slotFilled()?'':'hidden'}`}>
                        <p>This game has no open slots</p>
                    </div>


                    <div className="flex flex-row justify-center items-center gap-32 w-full mt-5 navbarSM:gap-[calc(10%)]">
                        <button className="button_light "
                        onClick={()=>{
                            props.onClose();
                        }}><i className="material-icons inline navbarSM:text-sm">cancel</i>Reject</button>

                        <button className={`button  ${slotFilled()?'hidden':''}`}
                        onClick={()=>{
                            if(slotRef.current.value!=='' && splitRef.current.value!==''){
                                setOpenConfirm(true)
                            }else{
                                return;
                            }
                            }}><i className="material-icons inline navbarSM:text-sm">check_circle</i>Submit</button>
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