import { useRef, useState, useEffect } from "react";
import axios from 'axios';
import qs from 'qs';
import { useSignIn, useIsAuthenticated} from 'react-auth-kit';
import {BrowserRouter as Router, useNavigate, Route, Switch} from "react-router-dom"
import {ip} from './ip'

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
        <div className="m-0 h-full min-h-screen pr-2 pb-0 pl-2 pt-40 border-2 tablet:px-2 tablet:pb-0 tablet:pt-40 desktop:pl-10 desktop:pt-20">
            <div className="w-6/12 relative rounded flex flex-col pl-10 pt-10 
            pb-20 border-2 box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05) tablet:w-full tablet:px-2 desktop:w-4/12" >
                <img src="" alt=""></img>
                <h1 className = "text-center mb-2">Log In</h1>

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

                </form>

                <p ref={errRef} className={errMsg ? "font-bold p-2 mb-2 text-black bg-stone-300" : "invisible"} aria-live="assertive">{errMsg}</p>

                <div  className="border-solid border mt-8 mb-8 px-8 py-0 tablet:py-0 tablet:px-32 desktop:px-0">
                    <button onClick={handleSubmit} 
                    className="w-11/12 border-solid border desktop:w-full">Log In</button>
                </div>

                <div className="textLogIn">
                    <p>Don't Have An account?</p>
                    <h4><button onClick={()=>{
                        console.log("hello");
                        navigate('/registration', {replace:true});
                    }} >Register</button></h4>
                </div>
            </div>
        </div>
    );
}

export default Login;