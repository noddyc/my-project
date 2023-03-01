import {useState, useEffect} from "react";
import React from 'react';
import {useNavigate} from "react-router-dom"
import { useAuthUser } from "react-auth-kit";
import qs from 'qs'
import axios from 'axios'
import {debounce} from 'lodash'
import { timezonelist } from "../Utils/timezonelist";
import {ip} from '../Utils/ip'



// regex validate email
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;

const HomeInfo = (props)=>{
   
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
        }
          
    }

    const handleChange = event => {
        setTimeZone(event.target.value);
      };


    return (
        <div className='h-screen w-full flex-col items-center justify-center relative font-inter font-light'>
            <div className='border-t-2 border-r-2 border-l-2 border-inputColor w-1/2 absolute left-1/4 top-16  bg-white
            navbarSM:w-3/4 navbarSM:left-[15%]'>
                <h1 className='h-24 not-italic font-normal text-center text-[60px] leading-[94px] font-roboto text-gray-700
                navbarSM:text-[30px] navbarSM:leading-[94px]'>Change Information</h1></div>
            <div className='border-b-2 border-r-2 border-l-2 border-inputColor  flex flex-col justify-center items-center p-4 gap-8 w-1/2
            absolute left-1/4 top-40 bg-white pb-16 navbarSM:w-3/4 navbarSM:left-[15%]'>

                <div className='flex flex-col items-start p-0 h-20 gap-2 w-full mb-32'>
                    <img src={require("../../assets/img1.jpeg")} alt="" className="h-40 mb-4 mt-12 w-40
                    rounded-full rounded-brtl-xl"></img>
                </div>

                <div className='flex flex-col items-start p-0 h-20 gap-2 w-full'>
                    <label>Username: </label>
                    <input className="border-2 border-inputColor " placeholder={display.username} onChange={usernameHandler}></input>
                    <p className={`${username && !usernameValid ? "flex":"invisible"}`}>duplicate username or invalid username</p>
                </div>

                <div className='flex flex-col items-start p-0 h-20 gap-2 w-full'>
                    <label>Email: </label>
                    <input className="border-2 border-inputColor " placeholder={display.email} onChange={emailHandler}></input>
                    <p className={`${email && !emailValid? "flex":"invisible"}`}>duplicate email or invalid email</p>
                </div>

                <div className='flex flex-col items-start p-0 h-20 gap-2 w-full'>
                    <label>Firstname: </label>
                    <input className="border-2 border-inputColor " placeholder={display.firstname}
                    onChange={(e)=>{setFirstName(e.target.value)}}></input>
                </div>


                <div className='flex flex-col items-start p-0 h-20 gap-2 w-full'>
                    <label>Lastname: </label>
                    <input className="border-2 border-inputColor " placeholder={display.lastname}
                    onChange={(e)=>{setLastName(e.target.value)}}></input>
                </div>

                <div className='flex flex-col items-start p-0 h-20 gap-2 w-full'>
                    <label>Address: </label>
                    <input className="border-2 border-inputColor " placeholder={display.address}
                    onChange={(e)=>{setAddress(e.target.value)}}></input>
                </div>

                {/* <div className='flex flex-col items-start p-0 h-20 gap-2 w-full'>
                    <label htmlFor="timezone" >Choose an timezone to change: {`(${display.timezone})`} </label>
                        <select name="timezone" id="timezone" className= {`w-3/4 border-2 border-inputColor`} onChange={handleChange}>
                            <option value=''>-</option>
                            {
                             (
                                timezonelist.map((i, index)=>{
                                    return (<option key={index} value={i}>{i}</option>)
                                }))
                            } 
                        </select>
                </div>
                 */}
                <button className={`flex flex-col justify-center items-center p-4 w-40 h-12 bg-buttonColor text-white rounded-lg
                     navbarSM:w-20 ${(count()) ? "":"opacity-50 cursor-not-allowed"}`} onClick={submitHandler}>Submit</button>
            </div>
        </div>
        );
}
export default HomeInfo;