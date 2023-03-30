import {useState, useEffect, useRef} from "react";
import React from 'react';
import {useNavigate} from "react-router-dom"
import { useAuthUser } from "react-auth-kit";
import qs from 'qs'
import axios from 'axios'
import {debounce} from 'lodash'
import _ from 'lodash'
import {ip} from '../Utils/ip'



// regex validate email
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;

const HomeInfo = (props)=>{
    const descriptionRef = useRef(null);
   
    const navigate = useNavigate();
    const [display, setDisplay] = useState({});
    const [username, setUsername] = useState("");
    const [usernameValid, setUsernameValid] = useState(false);
    const [email, setEmail] = useState("");
    const [emailValid, setEmailValid] = useState(false);
    const [lastname, setLastName] = useState("");
    const [firstname, setFirstName] = useState("");
    const [address, setAddress] = useState("");
    const [timezone, setTimeZone] = useState("");
    const auth = useAuthUser();

    const [errMsg, setErrMsg] = useState("");

    const count=()=>{
        let count = 0;
        if(username){
            count++;
        }
        if(email){
            count++;
        }
        if(firstname){
            count++;
        }
        if(lastname){
            count++;
        }
        if(address){
            count++;
        }
        if(timezone){
            count++;
        }
        if(email){
            if(emailValid){
                if(username){
                    if(usernameValid){
                        return true;
                    }else{
                        return false;
                    }
                }
            }else{
                return false;
            }
        }
        if(username){
            if(usernameValid){
                if(email){
                    if(emailValid){
                        return true;
                    }else{
                        return false;
                    }
                }
            }else{
                return false;
            }
        }
        if(count > 0){
            return true;
        }else{
            return false;
        }
    }

    useEffect(()=>{
        try{              
            let data = qs.stringify({
                'id': auth().id 
              });
            let config = {
            method: 'post',
            url: `${ip}/user/getInfo`,
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data : data
            };
              
            axios(config)
            .then((response) => {
                let data = response.data;
                console.log(data)
                setDisplay({...display, ...data})
                console.log(display)
            })
        }catch(err){
            console.log([err.message])
        }
    }, [])


    useEffect(()=>{
        if(username === ""){
            setUsernameValid(false);
            return;
        }
        if(USER_REGEX.test(username) === false){
            setUsernameValid(false);
            return;
        }
        let data = qs.stringify({
            'username': username
          });
        let config = {
            method: 'post',
            url: `${ip}/user/checkDuplicateUserName`,
            headers: { 
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data : data
        };
        axios(config)
        .then((response) => {
            console.log("data is"+ response.data)
            setUsernameValid(response.data);
        })
        .catch((error) => {
            console.log(error);
        });  
    } ,[username])


    useEffect(()=>{
        if(email === ""){
            setEmailValid(false);
            return;
        }
        if(EMAIL_REGEX.test(email) === false){
            setEmailValid(false);
            return;
        }
        let data = qs.stringify({
            'email': email
          });
        let config = {
            method: 'post',
            url: `${ip}/user/checkDuplicateEmail`,
            headers: { 
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data : data
        };
        axios(config)
        .then((response) => {
            console.log("data is"+ response.data)
            setEmailValid(response.data);
        })
        .catch((error) => {
            console.log(error);
        });  
    } ,[email])

    const usernameHandler = debounce((e) => {
        setUsername(e.target.value)
    }, 500)

    const emailHandler = debounce((e) => {
        setEmail(e.target.value)
    }, 500)

    const submitHandler = async(e)=>{
        try{
            console.log(timezone)
            let data = qs.stringify({
                'id': auth().id,
                'username': username,
                'firstname': firstname,
                'lastname': lastname,
                'address': address,
                'timezone': timezone
              });
              let config = {
                method: 'post',
                url: `${ip}/user/updateUser`,
                headers: { 
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                data : data
              };
              let resp = await axios(config).then((response)=>{
                    if(response.data[0] === 1){
                        props.setChange((prev)=>{return !prev})
                        navigate('/', {replace:true});
                    }
                }
              )
        }catch(err){
            console.log(err.message)
            setErrMsg("Failed To Update Information")
        }
          
    }

    const handleChange = event => {
        setTimeZone(event.target.value);
      };


    return (
        <div className='ml-[200px] mt-10 w-1/2 font-inter font-light text-xl navbarSM:ml-[20vw]'>
              <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                        <div className="px-4 sm:px-0">
                            <h3 className="text-4xl font-inter font-bold">PERSONAL INFORMATION</h3>
                        </div>
                </div>
                <div className="mt-5 md:col-span-2 md:mt-0">
                    <div className="">
                        <div className="overflow-hidden sm:rounded-md">
                            <div className="bg-white px-4 py-5 sm:p-6">
                                <div className="grid grid-cols-6 gap-6">

                                    <div className="col-span-6 sm:col-span-3">
                                        <img src={require("../../assets/img1.jpeg")} alt="" className="h-40 w-40 rounded-full rounded-brtl-xl"></img>
                                    </div>

                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="name" className="label">Username</label>
                                        <input id='name' type='text' maxLength="10" className="input" placeholder={display.username} onChange={usernameHandler}></input>
                                        <div className={`warning mt-2 ${username && !usernameValid ? "flex":"invisible"}`}>
                                        <i className="material-icons inline warningIcon">error</i>{'\u00A0'}{_.startCase("duplicate username or invalid username")}</div>
                                    </div> 

                                    <div className="col-span-6 sm:col-span-3">
                                        <label className="label">Email</label>
                                        <input className="input" placeholder={display.email} onChange={emailHandler}></input>
                                        <div className={`warning mt-2 ${email && !emailValid? "flex":"invisible"}`}>                                        
                                        <i className="material-icons warningIcon">error</i>{'\u00A0'}{_.startCase("duplicate email or invalid email")}</div>
                                    </div> 



                                    <div className="col-span-6 sm:col-span-3">
                                        <label className="label">First Name</label>
                                        <input className="input" placeholder={_.startCase(display.firstname)}
                                        onChange={(e)=>{setFirstName(e.target.value)}}></input>
                                    </div> 


                                    <div className="col-span-6 sm:col-span-3">
                                        <label className="label">Last Name</label>
                                        <input className="input" placeholder={_.startCase(display.lastname)}
                                        onChange={(e)=>{setLastName(e.target.value)}}></input>
                                    </div> 


                                    <div className="col-span-6 sm:col-span-3 mb-12">
                                        <label className="label">Address</label>
                                        <textarea type='text' maxLength="100" rows="3" className="input" placeholder={display.address} ref={descriptionRef}
                                        onChange={(e)=>{setAddress(e.target.value)}}></textarea>
                                        <span className="block text-right font-inter font-medium text-xs">{200-descriptionRef.current?.value.length} Characters Remaining</span>
                                    </div> 

                                    <div className={`col-span-6 ${errMsg ? "warning" : "invisible"} sm:col-span-3 mt-5 mb-1`}> 
                                        <i className="material-icons warningIcon">error</i>
                                         <p className='' aria-live="assertive">{errMsg}</p>
                                    </div>

                                    <div className='col-span-6 mb-20'>
                                        <div className="flex justify-end">
                                            <button className={`button ${(count()) ? "":"cursor-not-allowed"}`} onClick={submitHandler}>
                                            <i className="material-icons inline navbarSM:text-sm">check_circle</i>Submit</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

              </div>
        </div> 
        );
}
export default HomeInfo;