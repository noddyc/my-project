import {React, useState} from 'react';
import moment from 'moment'
import axios from 'axios'
import qs from 'qs'
import { useAuthUser} from 'react-auth-kit';
import { useNavigate} from "react-router-dom"
import {ip} from '../Utils/ip'


function AuctionForm(props) {
    const [name, setName]= useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [endTime, setEndTime] = useState("");
    const [errMsg, setErrMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [dayNight, setDayNight] = useState("day");
    const auth = useAuthUser();
    const navigate = useNavigate();



    let priceRegex = /^[1-9][0-9]*$/;

    const oneDayAhead = (endTime)=>{
        let time2 = new Date(endTime);
        let time1 = new Date();

        const diffInMs = time2.getTime() - time1.getTime();

        return diffInMs >= 24 * 60 * 60 * 1000;
      
    }

    const dateConversion = (e)=>{
        const timeInA = moment.tz(e, props.info.timezone);
        const timeInB = timeInA.clone().tz('UTC');
        return timeInB.format();
    }


    const handleDayNightChange = (event) => {
        setDayNight(event.target.value);
      };


    const myMap = {day:'12:40:00', night: '21:22:00'}


    const handleSubmit= async(e)=>{
        e.preventDefault();
        try{
            let endTimeDate = new Date(endTime+'T'+myMap[dayNight])
            if(name === "" || description === "" || price === ""  || !priceRegex.test(price) || !oneDayAhead(endTimeDate)){
                throw new Error("Fields must be valid or end time must be 24 hours from current time");
            }
            let obj = {
                start_time: dateConversion(new Date()),
                end_time: dateConversion(endTimeDate),
                product_price: price,
                product_name: name,
                product_description: description,
                status: "IN_PROGRESS",
                ownerId: auth().id,
            }
            let data = qs.stringify(obj);
            let config = {
                method: 'put',
                url: `${ip}/auction/addAuction`,
                headers: { 
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                data : data
              };
            axios(config).then(
                (response)=>{
                    console.log(JSON.stringify(response.data))
                    setSuccessMsg("Game created successfully")
                    setTimeout(()=>{
                        setName("")
                        setDescription("")
                        setPrice("")
                        setEndTime("")
                        setSuccessMsg("")
                    },1000);
                }
            ).catch(()=>{
                setErrMsg("Failed to add game");
            })
        }catch(err){
            if (err.response?.status) {
                setErrMsg('Failed to add game');
            }
            else{
                setErrMsg(err.message);
            }
        }
    }

    return (
        <div className='h-screen w-full flex-col items-center justify-center relative'>
            <div className='border-t-2 border-r-2 border-l-2 border-inputColor w-1/2 absolute left-1/4 top-16  bg-white
            navbarSM:w-3/4 navbarSM:left-[15%]'>
                <h1 className='h-24 not-italic font-normal text-center text-[60px] leading-[94px] font-roboto text-gray-700
                navbarSM:text-[30px] navbarSM:leading-[94px]'>Create Game</h1></div>
            <form className='border-b-2 border-r-2 border-l-2 border-inputColor  flex flex-col justify-center items-center p-4 gap-8 w-1/2
            absolute left-1/4 top-40 bg-white navbarSM:w-3/4 navbarSM:left-[15%]'>
                <div className='flex flex-col items-start p-0 h-20 gap-2 w-full'>
                    <label htmlFor='name' className='w-full h-4 not-italic font-semibold text-xs leading-4 text-gray-700'>Name</label>
                    <input id='name' type='text' maxLength="20" className='w-full flex flex-col items-start p-4 h-12 bg-white rounded-lg gap-2 
                    border-2 border-inputColor' value={name} onChange={(e)=>{setErrMsg("");
                    setSuccessMsg("");
                    setName(e.target.value)}} placeholder="Enter Game Name"/>
                </div>

                <div className='flex flex-col items-start p-0 h-20 gap-2 w-full'>
                    <label htmlFor='description' className='w-full h-4 not-italic font-semibold text-xs leading-4 text-gray-700'>Description: </label>
                    <input id='description' type='text' maxLength="200" className='w-full flex flex-col items-start p-4 h-12 bg-white rounded-lg gap-2 
                    border-2 border-inputColor' value={description} onChange={(e)=>{setErrMsg("");
                    setSuccessMsg("");
                    setDescription(e.target.value)}} placeholder="Enter Description"/>
                </div>

                <div className='flex flex-col items-start p-0 h-20 gap-2 w-full'>
                    <label htmlFor='price' className='w-full h-4 not-italic font-semibold text-xs leading-4 text-gray-700'>Price: </label>
                    <input id='price' type="numeric" min="1" step="1" className='w-full flex flex-col items-start p-4 h-12 bg-white rounded-lg gap-2 border-2 border-inputColor'
                    value={price} onChange={(e)=>{setErrMsg("");
                    
                    setSuccessMsg("");
                    setPrice(e.target.value)}} placeholder="0"/>
                </div>

                <div className='flex flex-col items-start p-0 h-28 gap-2 w-full'>
                    <label htmlFor='date' className='w-full h-4 not-italic font-semibold text-xs leading-4 text-gray-700'>End Date: </label>
                    <input id='date' name='date' type="date" className='w-full 
                    border-2 border-inputColor p-4 h-12 bg-white rounded-lg gap-2' value={endTime}
                    onChange={(e)=>{
                    // const timeInA = moment.tz(e.target.value, 'America/New_York');
                    // const timeInB = timeInA.clone().tz('UTC');
                    // console.log(timeInA.format());
                    // console.log(timeInB.format());
                    console.log(e.target.value)
                    setErrMsg("");
                    setSuccessMsg("");
                    setEndTime(e.target.value)}}/>
                    <h5 className='text-center'><i className="material-icons" style={{display:"inline", fontSize:"1rem"}}>info</i> End Date must be 24 hours from current time.</h5>
                </div>

                <div className='flex flex-col items-start p-0 h-28 gap-2 w-full'>
                    <label htmlFor='day-night' className='w-full h-4 not-italic font-semibold text-xs leading-4 text-gray-700'>Time Option:</label>
                    <select id='day-night' name='day-night' value={dayNight} onChange={handleDayNightChange} className='w-full 
                    border-2 border-inputColor h-12 pl-2 bg-white rounded-lg gap-2'>
                        <option value="day">Day: 12:40:00</option>
                        <option value="night">Night: 21:22:00</option>
                    </select>
                </div>

                <div className='w-full'> 
                    <p className={errMsg ? "font-bold p-2 mb-2 text-black bg-stone-300" : "invisible"} aria-live="assertive">{errMsg}</p>
                </div>
                <div className='w-full'> 
                    <p className={successMsg ? "font-bold p-2 mb-2 text-black bg-stone-300" : "invisible"} aria-live="assertive">{successMsg}</p>
                </div>
                <div className='w-full flex flex-row justify-between items-start p-0 h-12'>
                    <button className='flex flex-col justify-center items-center p-4 w-40 h-12 bg-white rounded-lg text-buttonColor border-2 border-buttonColor
                     navbarSM:w-20'
                    onClick={(e)=>{
                        e.preventDefault();
                        setName("");
                        setDescription("");
                        setPrice("");
                        setEndTime("");
                        setSuccessMsg("")
                    }}>Cancel</button>
                    <button className='flex flex-col justify-center items-center p-4 w-40 h-12 bg-buttonColor text-white rounded-lg
                     navbarSM:w-20'
                    onClick={handleSubmit}>Submit</button>
                </div>

            </form>
        </div>
    );
}

export default AuctionForm;