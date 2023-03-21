import {React, useState}  from 'react';
import _ from 'lodash'
import moment from 'moment'
import {ip} from  '../Utils/ip'
import qs from 'qs'
import axios from 'axios';


const numberRegex = /^[0-9]$/

function WinNumSection(props) {

    const [firstNumber, setFirstNumber] = useState("");
    const [secondNumber, setSecondNumber] = useState("");
    const [thirdNumber, setThirdNumber] = useState("");
    const [specialNumber, setSpecialNumber] = useState("");
    const [errMsg, setErrMsg] = useState("")
    const [successMsg, setSuccessMsg] = useState("")

    const submitHandler=()=>{
        try{
            if(!firstNumber || !secondNumber || !thirdNumber || !specialNumber){
                throw new Error(_.startCase('All numbers are required'))
            }
            if(!numberRegex.test(firstNumber) || !numberRegex.test(secondNumber) || !numberRegex.test(thirdNumber) || !numberRegex.test(specialNumber)){
                throw new Error(_.startCase('Please enter number from 0 to 9 only'))
            }
            
            let data = qs.stringify({
                'firstNumber': firstNumber,
                'secondNumber': secondNumber,
                'thirdNumber': thirdNumber,
                'specialNumber': specialNumber 
              });
              let config = {
                method: 'post',
                url: `${ip}/winningNum/submitWinningNumber`,
                headers: { 
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                data : data
              };
              
              axios(config)
              .then((response) => {
                console.log(JSON.stringify(response.data));
                setSuccessMsg("Successfully Submitted Winning Number")
                setTimeout(()=>{
                    setFirstNumber("");
                    setSecondNumber("");
                    setThirdNumber("");
                    setSpecialNumber("");
                    setErrMsg("");
                    setSuccessMsg("")
                }, 1000)
              })
        }catch(err){
            setErrMsg(err.message);
        }
    }

    return (
        <div className='ml-[200px] mt-10 w-1/2 font-inter font-light text-xl navbarSM:ml-[20vw]'>
            <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                    <div className="px-4 sm:px-0">
                        <h3 className="text-4xl font-inter font-bold">Submit Win Number</h3>
                    </div>
                </div>

                <div className="mt-5 md:col-span-2 md:mt-0">
                    <div>
                        <div className="overflow-hidden sm:rounded-md">
                            <div className="bg-white px-4 py-5 sm:p-6">
                                <div className="grid grid-cols-6 gap-6">

                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="firstNum" className="label">First Number</label>
                                        <input id='firstNum' type='numeric' min="0" max="9" step="1" placeholder="Enter First Number" required 
                                        value={firstNumber} onChange={(e)=>{
                                            setErrMsg("")
                                            setFirstNumber(e.target.value)}} className="input"/>
                                    </div>         

                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="secondNum" className="label">Second Number</label>
                                        <input id='secondNum' type='numeric' min="0" max="9" step="1" placeholder="Enter Second Number" required 
                                        value={secondNumber} onChange={(e)=>{
                                            setErrMsg("")
                                            setSecondNumber(e.target.value)}} className="input"/>
                                    </div>   

                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="thirdNum" className="label">Third Number</label>
                                        <input id='thirdNum' type='numeric' min="0" max="9" step="1" placeholder="Enter Third Number" required 
                                        value={thirdNumber} onChange={(e)=>{
                                            setErrMsg("")
                                            setThirdNumber(e.target.value)}} className="input"/>
                                    </div>   

                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="specialNum" className="label">Special Number</label>
                                        <input id='specialNum' type='numeric' min="0" max="9" step="1" placeholder="Enter Special Number"  required
                                        value={specialNumber} onChange={(e)=>{
                                            setErrMsg("")
                                            setSpecialNumber(e.target.value)}} className="input"/>
                                    </div>   


                                    <div className='col-span-6 sm:col-span-3 mb-1'> 
                                        <p className={errMsg ? "warning" : "invisible"} aria-live="assertive">{errMsg}</p>
                                    </div>

                                    <div className='col-span-6 sm:col-span-3 mb-1'> 
                                        <p className={successMsg ? "warning" : "invisible"} aria-live="assertive">{successMsg}</p>
                                    </div>

                                </div>    
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className='col-span-6 mb-20'>
                                        <div className='flex justify-between navbarSM:gap-[4vw]'>
                                            <button className='button_light navbarSM:text-xs navbarSM:w-3/4' onClick={()=>{
                                                setFirstNumber("");
                                                setSecondNumber("");
                                                setSpecialNumber("");
                                                setErrMsg("");
                                            }}><i className="material-icons inline">cancel</i><span>Cancel</span></button>
                                            <button className='button navbarSM:text-xs navbarSM:w-3/4'
                                            onClick={submitHandler}
                                            ><i className="material-icons inline">add_circle</i><span>Submit</span></button>
                                        </div>
                                    </div>
        </div> 
    );
}

export default WinNumSection;