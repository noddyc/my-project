import { useRef, useState, useEffect } from "react";
import axios from 'axios';
import qs from 'qs';
import {useNavigate} from "react-router-dom"
import {ip} from '../Utils/ip'

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
                    // console.log(JSON.stringify(response.data));
                    if(JSON.stringify(response.data) === "false"){
                        // console.log("this way")
                        // setErrMsg("Email Taken");
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
                        // setErrMsg("Username Taken");
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
                    // if(JSON.stringify(response.data.name) === "SequelizeValidationError"){
                    //     console.log("this way lol")
                    //     const error = new Error("Failed to register");
                    //     throw error
                    // }
                })
    
                // // success and show message success
                setSuccess(true);
                // clear state and controlled inputs
                // need value attrib on inputs for this
      
                setUser('');
                setPwd('');
                setMatchPwd('');
                //1/18
                setEmail('');
                setFirstName('');
                setLastName('');
    
            } catch (err) {
                // console.log(err.name)
                // ? means optional chaining, if it is undefined or null
                // returns undefined instead of throwing an error
                if (err.response?.status === 404) {
                    setErrMsg('No Server Response');
                }
                else{
                    setErrMsg(err.message);
                }
                // if (!err?.response) {
                //     console.log(err)
                //     setErrMsg('No Server Response');
                // } else if (err.response?.status === 409 && err.response?.message == "Email Taken") {
                //     setErrMsg('Email Taken');
                // } else {
                //     setErrMsg('Registration Failed')
                // }
                // errRef.current.focus();
            }
        }

    return(

        <div className="m-0 h-full min-h-screen pr-2 pb-0 pl-2 pt-40 border-2 tablet:px-2 tablet:pb-0 tablet:pt-40 desktop:pl-10 desktop:pt-20">
            <div className="w-6/12 relative rounded flex flex-col pl-10 pt-10 
            pb-20 border-2 box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05) tablet:w-full tablet:px-2 desktop:w-4/12" >
                <img src="" alt=""></img>
                <h1 className = "text-center mb-2">Register Now</h1>

                <p className= {success? "font-bold p-2 mb-2 text-black bg-stone-300":"invisible"}>Successful Registration</p>

                <form className="h-90 w-4/5 overflow-y-scroll 
                pr-0 pb-4 pt-2 pl-2 border-2 mb-8 tablet:w-full">
                    <label htmlFor="email" className="block w-3/5 mb-2">Email <span className="text-red-700">*</span>
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
                    type="text" placeholder="Enter Email" className="block w-3/5 mb-2 border-black border-2 tablet:w-11/12"></input>

                    <p id="emailnote" className={`${emailFocus && email && !validEmail ? "text-xs rounded-lg text-black p-1 relative bg-stone-300 w-6/12":"hidden" } mb-2`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 pb-1 inline">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Please enter a valid email address
                    </p>

                    <label htmlFor="username" className="block w-3/5 mb-2">Username <span className="text-red-700">*</span>
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
                        onBlur={() => setUserFocus(false)} className="block w-3/5 mb-2 border-black border-2 tablet:w-11/12"></input>

                    <p id="usernamenote" className={`${userFocus && user && !validName? "text-xs rounded-lg text-black p-1 relative bg-stone-300 w-6/12":"hidden" } mb-2`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 pb-1 inline">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                        Username must be 4 to 24 characters.<br />
                        Must begin with a letter.<br />
                        Letters, numbers, underscores, hyphens allowed.
                    </p>

                    <label htmlFor="firstname" className="block w-3/5 mb-2">Firstname <span className="text-red-700">*</span>
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
                            onBlur={() => setFirstNameFocus(false)} className="block w-3/5 mb-2 border-black border-2 tablet:w-11/12"></input>
                    <p id="firstnamenote" className={`${firstnameFocus && firstname && !validFirstName ? "text-xs rounded-lg text-black p-1 relative bg-stone-300 w-6/12":"hidden" } mb-2`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 pb-1 inline">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                        First name must contain with letters only<br />
                    </p>

                    <label htmlFor="lastname" className="block w-3/5 mb-2">Lastname <span className="text-red-700">*</span>
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
                            onBlur={() => setLastNameFocus(false)} className="block w-3/5 mb-2 border-black border-2 tablet:w-11/12"></input>
                    <p id="lastnamenote" className={`${lastnameFocus && lastname && !validLastName ? "text-xs rounded-lg text-black p-1 relative bg-stone-300 w-6/12":"hidden" } mb-2`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 pb-1 inline">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                        Last name must contain with letters only<br />
                    </p>

                    <label htmlFor="password" className="block w-3/5 mb-2">Password<span className="text-red-700">*</span>
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
                            className="block w-3/5 mb-2 border-black border-2 tablet:w-11/12"></input>

                    <p id="passwordnote" className={`${pwdFocus && !validPwd? "text-xs rounded-lg text-black p-1 relative bg-stone-300 w-6/12":"hidden" } mb-2`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 pb-1 inline">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                        Password must be 8 to 24 characters.<br />
                        Must include uppercase and lowercase letters, a number and a special character.
                    </p>

                    <label htmlFor="confirmpassword" className="block w-3/5 mb-2">Confirm Password<span className="text-red-700">*</span>
                        <svg xmlns="http://www.w3.org/2000/svg" 
                        className= {`${validMatch || !matchPwd ? "hidden":"ml-1"} w-4 h-4 text-red-700 inline`}
                        fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>

                        <svg xmlns="http://www.w3.org/2000/svg" 
                        className={`${validMatch && matchPwd? "ml-1":"hidden"} w-4 h-4 text-green-700 inline`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                    </label>
                    <input type="password" id="confirm_pwd" onChange={(e) => setMatchPwd(e.target.value)} value={matchPwd} required aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmnote" onFocus={() => setMatchFocus(true)} onBlur={() => setMatchFocus(false)} placeholder="Confirm Password" className="block w-3/5 mb-2 border-black border-2 tablet:w-11/12"></input>
                    <p id="confirmnote" className={`${matchFocus && !validMatch? "text-xs rounded-lg text-black p-1 relative bg-stone-300 w-6/12":"hidden" } mb-2`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 pb-1 inline">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                            Password must match.
                    </p>

                </form>

                <p ref={errRef} className={errMsg ? "font-bold p-2 mb-2 text-black bg-stone-300" : "invisible"} aria-live="assertive">Failed to Register: {errMsg}</p>

                <div  className="border-solid border mt-8 mb-8 px-8 py-0 tablet:py-0 tablet:px-32 desktop:px-0">
                    <button onClick={handleSubmit} 
                    className="w-11/12 border-solid border desktop:w-full">REGISTER</button>
                </div>

                <div className="textLogIn">
                    <p>Already Have An account?</p>
                    <h4><button onClick={()=>{
                        console.log("hello");
                        navigate('/', {replace:true});
                    }} >Log In</button></h4>
                </div>
            </div>
        </div>
    );
}

export default Registration;