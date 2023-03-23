import React from 'react'
import ReactDom from 'react-dom'
import { useRef, useState} from "react";
import moment from 'moment'
import {useNavigate} from "react-router-dom"
import {useAuthUser} from 'react-auth-kit';
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

export default function FormModal(props) {
    const slotRef = useRef();
    const [errMsg, setErrMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("")
    const auth = useAuthUser();
    const navigate = useNavigate();
    const [openConfirm, setOpenConfirm] = useState(false)


    if (!props.open) return null
    return ReactDom.createPortal(
        <>
        <div style={OVERLAY_STYLES} />
        <div style={MODAL_STYLES} className="border-4 border-cardBorderColor rounded-lg font-inter font-light text-xl navbarSM:w-[90%] navbarSM:text-xs">
                <div className="flex flex-col items-start p-0
                  isolate w-[450px]  navbarSM:w-[90%] "> 
                     {
                        !props.submitting?
                            <div className='text-xl font-inter font-bold w-full flex flex-col items-center gap-10'>
                                <div><p>Form Submmiting...</p></div>
                                <div><i className='material-icons text-5xl'>autorenew</i></div>
                            </div>:
                            <div className='text-xl font-inter font-bold w-full flex flex-col items-center gap-10'>
                                <div><p>Form Succefully Submitted</p></div>
                                <div><i className='material-icons text-5xl'>check_circle</i></div>
                            </div>
                            
                     }
                     <div className="flex flex-row justify-center items-center gap-32 w-full mt-5  navbarSM:gap-[calc(10%)]">
                        <button className="button_light"
                        onClick={()=>{
                            props.setSubmitting(false);
                            props.onClose();
                        }}><i className="material-icons inline navbarSM:text-sm">cancel</i>Close</button>

                        <button className="button"
                          onClick={()=>{
                            navigate("/main")
                        }}><i className="material-icons inline navbarSM:text-sm">home</i>Home</button>

                    </div>
                </div>
        </div>
        </>,
        document.getElementById('portal')
  )
}