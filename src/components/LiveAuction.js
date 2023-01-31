import Navbar from "./Navbar";
import ProfileBox from "./ProfileBox";
import { useRef, useState, useEffect } from "react";
import React from 'react';
import HomeInfo from "./HomeInfo";
import {useIsAuthenticated} from 'react-auth-kit';
import {NavLink, Outlet, useNavigate, useOutletContext} from 'react-router-dom'
import axios from 'axios';
import qs from 'qs';
import './LiveAuction.css'
import moment from 'moment-timezone'
import Modal from './Modal'
import ModalInfo from "./ModalInfo";

const BUTTON_WRAPPER_STYLES = {
  position: 'relative',
  zIndex: 1
}

// let browserTimeZone = moment.tz(new Date(), new Date().getTimezoneOffset)
// console.log(browserTimeZone)

const LiveAuction = (props)=>{  
    const isAuthenticated = useIsAuthenticated();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false)
    const [display, setDisplay] = useState([]);
    const [ind, setInd] = useState(0);
    const [detail, setDetail] = useState("false");

    function d(){
      let computedArr = display.map((d,index)=>{
        return <li key={index} style={{marginBottom:"10px", 
        border:"1px solid black", padding:"10px", cursor:"pointer",
        borderRadius: '10px'}} onClick={() => {
          setInd(index);
          setIsOpen(true);
      }}>
          {d.product_name}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}
          {moment(d.start_time).format('MM/DD/YYYY HH:mm:ss')}{'\u00A0'}-
          {'\u00A0'}{moment(d.end_time).format('MM/DD/YYYY HH:mm:ss')}{'\u00A0'}
          ${d.product_price}
          </li>
      })
      return <ul style={{margin:'100px'}}>{computedArr}</ul>;
    }

    useEffect(()=>{
      if(!isAuthenticated()){
          navigate('/')
      }
    },[])

    useEffect(()=>{
        try{              
          // only display in progress auctions
            let data = qs.stringify({
                'statues': ['IN_PROGRESS'] 
              }, {arrayFormat:`indices`});
              let config = {
                method: 'post',
                url: 'http://localhost:9001/auction/displayAuction',
                headers: { 
                  'Content-Type': 'application/x-www-form-urlencoded', 
                },
                data : data
              };
              axios(config)
              .then((response) => {
                setDisplay(response.data);
              })
        }catch(err){
            console.log([err.message])
        }
    }, [])

    return (
    <div>
        <Navbar page={props.page}></Navbar>
        <div className="flex flex-row navbarSM:flex navbarSM:flex-col">
            <ProfileBox info={props.info}></ProfileBox>
            <div className="body">
                <div className="displayOption">
                  <label htmlFor="cardbutton">Detailed Display: </label>
                  <input type="checkbox" id="cardbutton" 
                  onClick={(e)=>{
                    if(detail ==='false'){
                      setDetail('true');
                      console.log(detail)
                    }else{
                      setDetail('false');
                      console.log(detail)
                    }
                  }} value={detail}/>
                </div>
                 {
                 detail !=='false' ? display.map((d, index) => {
                 return (
                  <div className="card" key={index}>          
                      <div className="card-header">
                        <h3>{d.product_name}</h3>
                        <p>{d.product_description} {d.product_description} {d.product_description} {d.product_description} {d.product_description} {d.product_description} </p>
                      </div>

                      <div className="card-img">
                          <img src={require('../assets/card-img.jpeg')} alt="" />
                      </div>

                    <div className="card-details">
                        <div className="price">
                          <p>Total Price:{'\u00A0'}{'\u00A0'}</p>
                          <strong>${d.product_price}</strong>
                        </div>

                        <div className="time">
                          <p><span>Start time: {'\u00A0'}{'\u00A0'}</span>{moment(d.start_time).tz(Intl.DateTimeFormat().resolvedOptions().timeZone).format('MM/DD/YYYY HH:mm:ss')}</p>
                          <p><span>End time: {'\u00A0'}{'\u00A0'}</span>{moment(d.end_time).tz(Intl.DateTimeFormat().resolvedOptions().timeZone).format('MM/DD/YYYY HH:mm:ss')}</p>
                        </div>

                        <div className="card-footer">
                          <button onClick={() => {
                              setInd(index);
                              setIsOpen(true);
                          }}>Join Now</button>
                        </div>
                    </div>
                  </div> )}) : d()
                  
                  }
            </div>  
            <Modal open={isOpen} onClose={() => setIsOpen(false)} d={display[ind]}>
            </Modal>
        </div>
    </div>
    );
}

export default LiveAuction;