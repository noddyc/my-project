import { useRef, useState, useEffect } from "react";
import React from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom"
import moment from "moment";
import { useAuthUser } from "react-auth-kit";
import qs from 'qs'
import axios from 'axios'

const HomeInfo = (props)=>{
    const [display, setDisplay] = useState({});
    const [isOpen, setIsOpen] = useState(false)
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [lastname, setLastName] = useState("");
    const [firstname, setFirstName] = useState("");
    const [adress, setAdress] = useState("");
    const auth = useAuthUser();

    useEffect(()=>{
        try{              
            let data = qs.stringify({
                'id': auth().id 
              });
            let config = {
            method: 'post',
            url: 'http://localhost:9001/user/getInfo',
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data : data
            };
              
            axios(config)
            .then((response) => {
                let data = response.data;
                // console.log(data)
                setDisplay({...display, ...data})
                console.log(display)
            })
        }catch(err){
            console.log([err.message])
        }
    }, [])

    return (
        <div className="border-solid border flex flex-col items-center h-screen w-full
        border-orange-500 text-2xl text-center navbarSM:w-screen navbarSM:text-base navbarSM:h-1/4 pb-8 pt-8">
            <div className="border-2 border-inputColor flex flex-col items-start p-0
                  isolate w-1/2 h-[90%] gap-4 rounded-lg">        

                <div>
                    <label>Username: </label>
                    <input className="border-2 border-inputColor " placeholder={display.username}></input>
                </div>  

                <div>
                    <label>Email: </label>
                    <input className="border-2 border-inputColor " placeholder={display.email}></input>
                </div>  

                <div>
                    <label>Firstname: </label>
                    <input className="border-2 border-inputColor " placeholder={display.firstname}></input>
                </div>  

                <div>
                    <label>Lastname: </label>
                    <input className="border-2 border-inputColor " placeholder={display.lastname}></input>
                </div>  

                <div>
                    <label>Address: </label>
                    <input className="border-2 border-inputColor " placeholder={display.address}></input>
                </div> 

            </div> 
        </div>
        );
}
export default HomeInfo;