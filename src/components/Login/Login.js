import { useRef, useState, useEffect } from "react";
import axios from 'axios';
import qs from 'qs';
import { useSignIn, useIsAuthenticated} from 'react-auth-kit';
import {BrowserRouter as Router, useNavigate, Route, Switch} from "react-router-dom"
import {ip} from '../Utils/ip'

// regex validate password
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
// regex validate email
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;


const Login = (props) =>{
    const navigate = useNavigate()
    const isAuthenticated = useIsAuthenticated()
    const signIn = useSignIn();
    // email 
    const emailRef = useRef();
    const errRef = useRef();
    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    

    // set the password
    const [pwd, setPwd] = useState('');
    // set if the password field is valid or not
    const [validPwd, setValidPwd] = useState(false);
    // set if the password field is on focus
    const [pwdFocus, setPwdFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');


    useEffect(()=>{
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email])


    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
    }, [pwd])

    useEffect(() => {
        setErrMsg('');
    }, [email, pwd])

    const handleSubmit = async (e)=>{
        e.preventDefault();

        const v1 = EMAIL_REGEX.test(email);
        const v2 = PWD_REGEX.test(pwd);

        if(!v1 || !v2){
            setErrMsg("Invalid Entry");
            return;
        }
        try{
            let data = qs.stringify({
                'email': email,
                'password': pwd 
            });
            let config = {
                method: 'post',
                url: `${ip}/user/loginUser`,
                headers: { 
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                data : data,
                withCredentials: true,
            };

            let resp = await axios(config).then(function(response){
                let thisId = response.data.id;
                console.log(response.data.id)
                signIn({
                    token: response.data.token,
                    expiresIn: 3600,
                    tokenType: "Bearer",
                    authState:{id: thisId},
                })
                console.log("successful signed");
            });
            navigate("/main")
        }catch(err){
            console.log(err.message)
        }
    }

    useEffect(()=>{
        if(isAuthenticated()){
            navigate("/main")
        }
    }, []
    )

    return(
        <div className="ml-[200px] mt-10 w-1/2 font-inter font-light text-xl">
            <div class="md:grid md:grid-cols-3 md:gap-6">
                <div class="md:col-span-1">
                    <div class="px-4 sm:px-0">
                        <h3 class="text-4xl font-inter font-bold">Login</h3>
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
                                            {'\u00A0'}Please enter a valid email address
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
                                            {'\u00A0'}Password must be 8 to 24 characters.<br />
                                            Must include uppercase and lowercase letters, a number and a special character.
                                        </p>
                                    </div>

                                    <div class="col-span-6 sm:col-span-3">

                                        <p ref={errRef} className={errMsg ? "warning" : "warning invisible"} aria-live="assertive">{errMsg}</p>

                                        <div  className="flex justify-center mt-5">
                                            <button onClick={handleSubmit} 
                                            className="button">Login</button>
                                        </div>

                                        <div className="flex-col mt-5 font-medium">
                                            <p>Don't Have An account?</p>
                                            <h4><button onClick={()=>{
                                                console.log("hello");
                                                navigate('/registration', {replace:true});
                                            }} >Register</button></h4>
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

export default Login;