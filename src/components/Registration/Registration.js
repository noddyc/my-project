/*
    component of registration page
*/
import { useRef, useState, useEffect } from "react";
import axios from 'axios';
import qs from 'qs';
import {useNavigate} from "react-router-dom"
import {ip} from '../Utils/ip'
import _ from 'lodash'

// regex validate user
const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;

// regex validate password
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;


// regex validate email
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

// regex for empty space
const EMPTY_REGEX= /^(?!\s*$).+/;

// regex for trailing space
const SPACE_REGEX = /^(?! )[A-Za-z0-9 ]*(?<! )$/


const Registration = () =>{
        const navigate = useNavigate();
        // ref for user field
        const userRef = useRef();
        // ref for err
        const errRef = useRef();
        // ref for email
        const emailRef = useRef();
        // ref for firstname
        const firstnameRef = useRef();
    
        const lastnameRef = useRef();
    
        // set state for email
        const [email, setEmail] = useState('');
        // set if the email is valid or not
        const [validEmail, setValidEmail] = useState(false);
        // set if the email is on focuse or not
        const [emailFocus, setEmailFocus] = useState(false);
    
    
        const [lastname, setLastName] = useState('');
        const [validLastName, setValidLastName] = useState(false);
        const [lastnameFocus, setLastNameFocus] = useState(false);
    
    
        const [firstname, setFirstName] = useState('');
        const [validFirstName, setValidFirstName] = useState(false);
        const [firstnameFocus, setFirstNameFocus] = useState(false);
    
    
        // set state for user
        const [user, setUser] = useState('');
        // set if the username is valid or not
        const [validName, setValidName] = useState(false);
        // set if the user is on focus or not
        const [userFocus, setUserFocus] = useState(false);
    
        // set the password
        const [pwd, setPwd] = useState('');
        // set if the password field is valid or not
        const [validPwd, setValidPwd] = useState(false);
        // set if the password field is on focus
        const [pwdFocus, setPwdFocus] = useState(false);
    
        // set the password match field 
        const [matchPwd, setMatchPwd] = useState('');
        // set the password match field is valid or not 
        const [validMatch, setValidMatch] = useState(false);
        // set the password match field is focus or not 
        const [matchFocus, setMatchFocus] = useState(false);
    
        // set error message
        const [errMsg, setErrMsg] = useState('');
        // set if log in is success
        const [success, setSuccess] = useState(false);
    
        useEffect(()=>{
            setValidEmail(EMAIL_REGEX.test(email));
        }, [email])
    
        useEffect(() => {
            setValidName(USER_REGEX.test(user));
        }, [user])
    
    
        useEffect(() => {
            setValidFirstName(EMPTY_REGEX.test(firstname) && SPACE_REGEX.test(firstname));
        }, [firstname])
    
        useEffect(() => {
            setValidLastName(EMPTY_REGEX.test(lastname) && SPACE_REGEX.test(lastname));
        }, [lastname])
    
        useEffect(() => {
            setValidPwd(PWD_REGEX.test(pwd));
            setValidMatch(pwd === matchPwd);
        }, [pwd, matchPwd])
    
        useEffect(() => {
            setErrMsg('');
        }, [email, user, pwd, matchPwd, firstname, lastname])

        const handleSubmit = async (e) => {
            e.preventDefault();
    
            // if button enabled with JS hack
            // check if user is valid before submit
            const v1 = USER_REGEX.test(user);
            // check if password is valid before submit
            const v2 = PWD_REGEX.test(pwd);
    
            // check if email is valid before submit
            const v3 = EMAIL_REGEX.test(email);
    
            // check if firstname is valid
            const v4 = EMPTY_REGEX.test(firstname) && SPACE_REGEX.test(firstname);
            
            // check if lastname is valid
            const v5 = EMPTY_REGEX.test(lastname) && SPACE_REGEX.test(lastname);
    
    
    
            // if either one not valid return false messsage
            if (!v1 || !v2 || !v3 || !v4 || !v5) {
                setErrMsg("Invalid Entry");
                return;
            }
            try {
                let emailData = qs.stringify({
                    'email': email
                  });
    
                let emailConfig = {
                    method: 'post',
                    url: `${ip}/user/checkDuplicateEmail`,
                    headers: { 
                      'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data : emailData
                  };
                  
                let emailResp = await axios(emailConfig).then(function (response) {
                    if(JSON.stringify(response.data) === "false"){
                        setValidEmail(false);
                        emailRef.current.focus();
                        const error = new Error("Email Taken");
                        throw error
                    }
                })
    
                let userData = qs.stringify({
                    'username': user
                });
    
                let usernameConfig = {
                    method: 'post',
                    url:  `${ip}/user/checkDuplicateUserName`,
                    headers: { 
                      'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data : userData
                  };
    
                let usernameResp = await axios(usernameConfig).then(function (response) {
                    if(JSON.stringify(response.data) === "false"){
                        setValidName(false);
                        userRef.current.focus();
                        const error = new Error("Username Taken");
                        throw error
                    };
                })
    
                // post
                let postData = qs.stringify({
                    'email': email,
                    'username': user,
                    'firstname': firstname,
                    'lastname': lastname,
                    'password': pwd
                  });
    
                let config = {
                    method: 'put',
                    url: `${ip}/user/addUser`,
                    headers: { 
                      'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data : postData
                  };
    
                let resp = await axios(config).then(function (response) {
                    console.log(JSON.stringify(response.data))

                })
    
                setSuccess(true);      
                setUser('');
                setPwd('');
                setMatchPwd('');
                setEmail('');
                setFirstName('');
                setLastName('');
                setTimeout(()=>{
                    navigate('/', {replace:true})
                }, 1000);
    
            } catch (err) {
                if (err.response?.status === 404) {
                    setErrMsg('No Server Response');
                }
                else{
                    setErrMsg(err.message);
                }
            }
        }

    return(
        <div className='ml-[200px] mt-10 w-1/2 font-inter font-light text-xl navbarSM:ml-[20vw]'>
              <div class="md:grid md:grid-cols-3 md:gap-6">
                    <div class="md:col-span-1">
                        <div class="px-4 sm:px-0">
                            <h3 class="text-4xl font-inter font-bold">Registration</h3>
                        </div>
                    </div>
              </div>

              <div class="mt-5 md:col-span-2 md:mt-0">
                <div>
                    <div class="overflow-hidden sm:rounded-md">
                        <div class="bg-white px-4 py-5 sm:p-6">
                            <div class="grid grid-cols-6 gap-6">

                                <div class="col-span-6 sm:col-span-3">
                                    <label htmlFor="email" className="label">Email <span className="text-red-700">*</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" 
                                    className= {`${validEmail || !email ? "hidden":"ml-1"} w-4 h-4 text-red-700 inline`}
                                    fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>

                                    <svg xmlns="http://www.w3.org/2000/svg" 
                                    className={`${validEmail? "ml-1":"hidden"} w-4 h-4 text-green-700 inline`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                    </label>

                                    <input id="email" ref={emailRef}  autoComplete="off" onChange={(e) => setEmail(e.target.value)} value={email} required
                                    aria-invalid={validEmail ? "false" : "true"} aria-describedby="emailnote" onFocus={() => setEmailFocus(true)}
                                    onBlur={() => setEmailFocus(false)}
                                    type="text" placeholder="Enter Email" className="input"></input>

                                    <p id="emailnote" className={`${emailFocus && email && !validEmail ? "warning":"hidden" } mt-5`}>
                                        <i className="material-icons inline text-lg">error</i>
                                        {'\u00A0'}{_.startCase("Please enter a valid email address")}
                                    </p>
                                </div>

                                <div class="col-span-6 sm:col-span-3">
                                    <label htmlFor="username" className="label">Username <span className="text-red-700">*</span>

                                    <svg xmlns="http://www.w3.org/2000/svg" 
                                    className= {`${validName || !user ? "hidden":"ml-1"} w-4 h-4 text-red-700 inline`}
                                    fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>

                                    <svg xmlns="http://www.w3.org/2000/svg" 
                                    className={`${validName? "ml-1":"hidden"} w-4 h-4 text-green-700 inline`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                    </label>

                                    <input type="text" 
                                        id="username" placeholder="Enter Username" ref={userRef} autoComplete="off" onChange={(e) => setUser(e.target.value)}value={user}
                                        required aria-invalid={validName ? "false" : "true"} aria-describedby="usernamenote" onFocus={() => setUserFocus(true)}
                                        onBlur={() => setUserFocus(false)} className="input"></input>

                                    <p id="usernamenote" className={`${userFocus && user && !validName? "warning":"hidden" } mt-5`}>
                                    <i className="material-icons inline text-lg">error</i>
                                    {'\u00A0'}
                                        {_.startCase("Username must be 4 to 24 characters.")}<br />
                                        {_.startCase("Must begin with a letter.")}<br />
                                        {_.startCase("Letters, numbers, underscores, hyphens allowed.")}
                                    </p>
                                </div>

                                <div class="col-span-6 sm:col-span-3">
                                    <label htmlFor="firstname" className="label">Firstname <span className="text-red-700">*</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" 
                                    className= {`${validFirstName || !firstname ? "hidden":"ml-1"} w-4 h-4 text-red-700 inline`}
                                    fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>

                                    <svg xmlns="http://www.w3.org/2000/svg" 
                                    className={`${validFirstName? "ml-1":"hidden"} w-4 h-4 text-green-700 inline`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                    </label>
                                    <input type="text" id="firstname" ref={firstnameRef} autoComplete="off" onChange={(e) => setFirstName(e.target.value)} value={firstname} placeholder="Enter Firstname"
                                            required aria-invalid={validFirstName ? "false" : "true"} aria-describedby="firstnamenote"
                                            onFocus={() => setFirstNameFocus(true)}
                                            onBlur={() => setFirstNameFocus(false)} className="input"></input>
                                    <p id="firstnamenote" className={`${firstnameFocus && firstname && !validFirstName ? "warning":"hidden" } mt-5`}>
                                        <i className="material-icons inline text-lg">error</i>
                                        {'\u00A0'}{_.startCase("First name must contain with letters only")}<br />
                                    </p>
                                </div>

                                <div class="col-span-6 sm:col-span-3">

                                    <label htmlFor="lastname" className="label">Lastname <span className="text-red-700">*</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" 
                                        className= {`${validLastName || !lastname ? "hidden":"ml-1"} w-4 h-4 text-red-700 inline`}
                                        fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>

                                        <svg xmlns="http://www.w3.org/2000/svg" 
                                        className={`${validLastName? "ml-1":"hidden"} w-4 h-4 text-green-700 inline`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                    </label>
                                    <input type="text" id="lastname" ref={lastnameRef} autoComplete="off" onChange={(e) => setLastName(e.target.value)}
                                            value={lastname} required aria-invalid={validLastName ? "false" : "true"} aria-describedby="lastnamenote" onFocus={() => setLastNameFocus(true)} placeholder="Enter Lastname"
                                            onBlur={() => setLastNameFocus(false)} className="input"></input>
                                    <p id="lastnamenote" className={`${lastnameFocus && lastname && !validLastName ? "warning":"hidden" } mt-5`}>
                                    <i className="material-icons inline text-lg">error</i>
                                    {'\u00A0'}{_.startCase("Last name must contain with letters only")}<br />
                                    </p>
                                </div>

                                <div class="col-span-6 sm:col-span-3">
                                    <label htmlFor="password" className="label">Password<span className="text-red-700">*</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" 
                                    className= {`${validPwd || !pwd ? "hidden":"ml-1"} w-4 h-4 text-red-700 inline`}
                                    fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>

                                    <svg xmlns="http://www.w3.org/2000/svg" 
                                    className={`${validPwd? "ml-1":"hidden"} w-4 h-4 text-green-700 inline`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                    </label>
                                    <input type="password" id="password" onChange={(e) => setPwd(e.target.value)} value={pwd} required placeholder="Enter password"
                                            aria-invalid={validPwd ? "false" : "true"} aria-describedby="passwordnote" onFocus={() => setPwdFocus(true)} onBlur={() => setPwdFocus(false)} 
                                            className="input"></input>

                                    <p id="passwordnote" className={`${pwdFocus && !validPwd? "warning":"hidden" } mt-5`}>
                                    <i className="material-icons inline text-lg">error</i>
                                    {'\u00A0'}{_.startCase("Password must be 8 to 24 characters.")}<br />
                                        {_.startCase("Must include uppercase and lowercase letters, a number and a special character.")}
                                    </p>
                                </div>

                                <div class="col-span-6 sm:col-span-3">
                                    <label htmlFor="confirmpassword" className="label">Confirm Password<span className="text-red-700">*</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" 
                                    className= {`${validMatch || !matchPwd ? "hidden":"ml-1"} w-4 h-4 text-red-700 inline`}
                                    fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>

                                    <svg xmlns="http://www.w3.org/2000/svg" 
                                    className={`${validMatch && matchPwd? "ml-1":"hidden"} w-4 h-4 text-green-700 inline`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                </label>
                                <input type="password" id="confirm_pwd" onChange={(e) => setMatchPwd(e.target.value)} value={matchPwd} required aria-invalid={validMatch ? "false" : "true"}
                                        aria-describedby="confirmnote" onFocus={() => setMatchFocus(true)} onBlur={() => setMatchFocus(false)} placeholder="Confirm Password" className="input"></input>
                                    <p id="confirmnote" className={`${matchFocus && !validMatch? "warning":"hidden" } mt-5`}>
                                    <i className="material-icons inline text-lg">error</i>
                                    {'\u00A0'}{_.startCase("Password must match.")}
                                     </p>
                                </div>
                                
                                <div class="col-span-6 sm:col-span-3">
                                    <p ref={errRef} className={errMsg ? "warning" :"warning invisible"} aria-live="assertive"><i className="material-icons inline text-lg">error</i> Failed to Register: {errMsg}</p>

                                    <p  className={success ? "success" :"warning invisible"} aria-live="assertive"><i className="material-icons inline text-lg">check</i> Successfully Register</p>
                                 
                                    <div  className="flex justify-center mt-5">
                                        <button onClick={handleSubmit} 
                                        className="button"><i className="material-icons inline navbarSM:text-sm">check_circle</i>Register</button>
                                    </div>

                                    <div className="flex-col mt-5 font-medium">
                                        <p>Already Have an Account?</p>
                                        <h4><button onClick={()=>{
                                            console.log("hello");
                                            navigate('/', {replace:true});
                                        }} >Login</button></h4>
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

export default Registration;