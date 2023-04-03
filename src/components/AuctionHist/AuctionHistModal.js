import React from 'react'
import ReactDom from 'react-dom'
import {useState} from "react";
import moment from 'moment'
import {useAuthUser} from 'react-auth-kit';
import _ from 'lodash'
import ConfirmAuctionHistModal from './ConfirmAuctionHistModal';
import { dayStartHour, dayStartMin, dayStartSec, dayEndHour, dayEndMin, dayEndSec, dayStartHourSaving, dayEndHourSaving,
        nightStartHour, nightStartMin, nightStartSec, nightEndHour, nightEndMin, nightEndSec, nightStartHourSaving, nightEndHourSaving, checkDayLightSaving, UTCToCentral} from '../Utils/time';  

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
let slotArr=['slot0', 'slot1', 'slot2', 'slot3', 'slot4', 'slot5', 'slot6', 'slot7','slot8','slot9']

checkDayLightSaving()

function spotWinner(d){
  let count = 0;
  for(let i = 0; i < slotArr.length; i++){
    if(d[slotArr[i]] != null){
      count++;
    }
  }
  if(count < 7){
    return false;
  }
  if(d.winnning_number === null){
    return false;
  }else{
    const winNum = d.winNum.specialNumber;
    if(d[slotArr[winNum]] != null){
      return true;
    }else{
      return false;
    }
  }
}

function calcInSec(H,M,S){
  return H*3600+M*60+S;
}

function isCurrentTimeInRange(e) {
  const currentTime = new Date(e);
  // console.log(currentTime)

  const currentTimeHour = currentTime.getUTCHours();
  const currentTimeMin = currentTime.getUTCMinutes();
  const currentTimeSec = currentTime.getUTCSeconds();

  const currentTimeSecTotal = calcInSec(currentTimeHour, currentTimeMin, currentTimeSec);


  let dayStartSecTotal, dayEndSecTotal, nightStartSecTotal, nightEndSecTotal;

  // console.log(currentTime.isDstObserved())
  if(currentTime.isDstObserved()){
    dayStartSecTotal = calcInSec(dayStartHourSaving, dayStartMin, dayStartSec);
    dayEndSecTotal = calcInSec(dayEndHourSaving, dayEndMin, dayEndSec);
  
    nightStartSecTotal = calcInSec(nightStartHourSaving, nightStartMin, nightStartSec);
    nightEndSecTotal = calcInSec(nightEndHourSaving, nightEndMin, nightEndSec);
  }else{
    dayStartSecTotal = calcInSec(dayStartHour, dayStartMin, dayStartSec);
    dayEndSecTotal = calcInSec(dayEndHour, dayEndMin, dayEndSec);
  
    nightStartSecTotal = calcInSec(nightStartHour, nightStartMin, nightStartSec);
    nightEndSecTotal = calcInSec(nightEndHour, nightEndMin, nightEndSec);
  }

  let res = (currentTimeSecTotal >= dayStartSecTotal && currentTimeSecTotal <= dayEndSecTotal) || 
  (currentTimeSecTotal >= dayStartSecTotal && currentTimeSecTotal <= dayEndSecTotal);
  // console.log(res)
  return res
}


export default function AuctionHistModal(props) {
    let d = props.d.original
    console.log(d)
    const [openConfirm, setOpenConfirm] = useState(false)
    const auth = useAuthUser();

    const countSlots = () =>{
      let count = 0;
      for(let i = 0; i < slotArr.length; i++){
        if(d?.[slotArr[i]] !== null){
          count++;
        }
      }
      return count === 6;
    }



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
        <div style={MODAL_STYLES} className="border-4 border-cardBorderColor rounded-lg font-inter font-light text-xl  navbarSM:w-[90%]
        navbarSM:text-xs">
                <div className="flex flex-col items-start p-0
                  isolate w-[450px]   navbarSM:w-[90%]">
                    <div className="h-14 overflow-scroll">
                          <p className="font-inter font-bold text-xl">ID: {_.startCase(d.id)} {'\u00A0'}
                          </p>
                    </div>


                    <div className="h-30 mt-5 navbarSM:mt-0">
                    {
                        d.Products.map((p, index)=>{
                          return (
                            <div key={index} className="font-inter "><span className='font-medium'>Product {index+1}</span>: {p.product_name} / Price: $ {p.product_price}.00</div>
                          )
                        })
                      }
                    </div>

            
                    <div className="font-inter mt-5">
                          <span className="font-inter font-medium">End time</span>
                          <p>{'\u00A0'}{'\u00A0'}{(UTCToCentral(d.end_time).split(' ')[0]+" "+(UTCToCentral(d.end_time).split(' ')[1]==="12:40:00"?'(DAY)':'(NIGHT)'))}</p>
                    </div>

                    <div className="flex flex-col flex-wrap overflow-scroll w-full h-76 mt-5">
                                <p className='font-inter font-medium'>Slots</p>
                                <div className='grid grid-cols-2 w-full'>
                                    {slotArr.map((i,index)=>{
                                        if(d?.[i] === null){
                                            return (<div key={index}><p className='leading-7' key={index}><span>{'\u00A0'}{'\u00A0'}<strong>{index}:</strong> - </span></p></div>)
                                        }
                                        if(d?.[i]?.split === true){
                                            if(d?.[i]?.player2 === null){
                                                return (<div key={index}><p className='leading-7' key={index}><span>{'\u00A0'}{'\u00A0'}<strong>{index}:</strong>{'\u00A0'}</span>{`${_.startCase(d?.[i]?.player_1?.firstname)+" "+_.startCase(d?.[i]?.player_1?.lastname)??'-'}/-`}</p></div>)
                                            }else if(d?.[i]?.player1 === null){
                                                return (<div key={index}><p className='leading-7' key={index}><span>{'\u00A0'}{'\u00A0'}<strong>{index}:</strong>{'\u00A0'}</span>{`-/${_.startCase(d?.[i]?.player_2?.firstname)+" "+_.startCase(d?.[i]?.player_2?.lastname)??'-'}`}</p></div>)
                                            }
                                            else{
                                                return (<div key={index}><p className='leading-7' key={index}><span>{'\u00A0'}{'\u00A0'}<strong>{index}:</strong>{'\u00A0'}</span>{`${_.startCase(d?.[i]?.player_1?.firstname)+" "+_.startCase(d?.[i]?.player_1?.lastname)??'-'}/${_.startCase(d?.[i]?.player_2?.firstname)+" "+_.startCase(d?.[i]?.player_2?.lastname)??'-'}`}</p></div>)
                                            }
                                        }

                                        if(d?.[i]?.split === false){
                                            return (<div key={index}><p className='leading-7' key={index}><span>{'\u00A0'}{'\u00A0'}<strong>{index}:</strong>{'\u00A0'}{'\u00A0'}</span>{`${_.startCase(d?.[i]?.player_1?.firstname)+" "+_.startCase(d?.[i]?.player_1?.lastname)??'-'}`}</p></div>)
                                        }
                                        
                                    })}
                                </div>
                     </div>


                    <div className="flex flex-row w-full mt-5">
                          <div className="font-inter mb-2 w-1/2">
                              <span className="font-inter font-medium">Winning number</span>
                              <p>{'\u00A0'}{'\u00A0'}{d.winNum===null || d.winNum===undefined?"-":d.winNum.specialNumber}</p>
                          </div>


                          <div className="font-inter mb-2">
                              <span className="font-inter font-medium">Status</span>
                              <p>{'\u00A0'}{'\u00A0'}{statusConversion(d.status)}</p> 
                          </div>
                    </div>


                    {/* <div className="h-30 mt-5 navbarSM:mt-0">
                          <span className="font-inter font-medium">Description</span>
                          <div className="not-italic h-24 tracking-[0.25px] overflow-scroll break-all"><p>{_.capitalize(d.product_description)} </p></div>
                    </div> */}

                     <div className="flex flex-row justify-center items-center gap-32 w-full mt-5   navbarSM:gap-10">
                        <button className="button_light "
                        onClick={()=>{
                            props.onClose();
                        }}><i className="material-icons inline navbarSM:text-sm">cancel</i>Close</button>


                        <button className={`button 
                        ${d.status ==='NO_WINNER_WINNER_NOTIFIED'?'w-40':''} 
                        navbarSM:text-xs 
                        ${(d.status ==='NO_WINNER_WINNER_NOTIFIED' && !spotWinner(d)) || (d.status ==='WAITING_FOR_DRAW' && countSlots() && isCurrentTimeInRange(d.end_time)) ?'':'invisible'}`}
                            onClick={()=>{
                                    setOpenConfirm(true)
                                  }
                                  // open not live
                                }><i className="material-icons inline navbarSM:text-sm">check_circle</i>{d.status==='NO_WINNER_WINNER_NOTIFIED'?'Roll Over':d.status==='WAITING_FOR_DRAW' && countSlots() && isCurrentTimeInRange(d.end_time) ?'Join':''}</button>
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