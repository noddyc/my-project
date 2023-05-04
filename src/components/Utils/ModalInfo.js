/*
    component of modal
*/
import React from 'react'
import ReactDom from 'react-dom'
import { useRef} from "react";

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

export default function ModalInfo(props) {

    const usernameRef = useRef();
    const emailRef = useRef();
    const addressRef = useRef();
    const lastnameRef = useRef();
    const firstnameRef = useRef();
    
    if (!props.open) return null
    return ReactDom.createPortal(
        <>
        <div style={OVERLAY_STYLES} />
        <div style={MODAL_STYLES}>
                <div>
                    <h1>Change information</h1>
                    <div style={{marginBottom: "20px"}}>
                        <label htmlFor="username">username: </label>
                        <input type='text' id="username" style={{border:"solid 1px black"}} placeholder={props.d.username} ref={usernameRef}></input>
                        <button style={{width:"100px", height:"30px", marginLeft:"10px"}}onClick={()=>{
                            props.setInfo({...props.d, username: usernameRef.current.value});
                        }} >submit</button>
                    </div>

                    <div style={{marginBottom: "20px"}}>
                        <label htmlFor="email">email: </label>
                        <input type='text' id="email" style={{border:"solid 1px black"}} placeholder={props.d.email} ref={emailRef}></input>
                        <button style={{width:"100px", height:"30px", marginLeft:"10px"}} onClick={()=>{
                            props.setInfo({...props.d , email: emailRef.current.value});
                        }} >submit</button>
                    </div>


                    <div style={{marginBottom: "20px"}}>
                        <label htmlFor="firstname">firstname: </label>
                        <input type='text' id="firstname" style={{border:"solid 1px black"}} placeholder={props.d.firstname} ref={firstnameRef}></input>
                        <button style={{width:"100px", height:"30px", marginLeft:"10px"}} onClick={()=>{
                            props.setInfo({...props.d , firstname: firstnameRef.current.value});
                        }} >submit</button>
                    </div>


                    <div style={{marginBottom: "20px"}}>
                        <label htmlFor="lastname">lastname: </label>
                        <input type='text' id="lastname" style={{border:"solid 1px black"}} placeholder={props.d.lastname} ref={lastnameRef}></input>
                        <button style={{width:"100px", height:"30px", marginLeft:"10px"}} onClick={()=>{
                            props.setInfo({...props.d , lastname: lastnameRef.current.value});
                        }} >submit</button>
                    </div>

                    <div style={{marginBottom: "20px"}}>
                        <label htmlFor="address">address: </label>
                        <input type='text' id="address" style={{border:"solid 1px black"}} placeholder={props.d.address} ref={addressRef}></input>
                        <button style={{width:"100px", height:"30px", marginLeft:"10px"}} onClick={()=>{
                            props.setInfo({...props.d , address: addressRef.current.value});
                        }} >submit</button>
                    </div>

                    <div className="" >
                        <button onClick={props.onClose}>Cancel</button>
                    </div>
                </div>
        </div>
        </>,
        document.getElementById('portal')
  )
}