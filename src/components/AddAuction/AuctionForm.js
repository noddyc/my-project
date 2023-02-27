import {React, useState, useRef} from 'react';
import moment from 'moment'
import axios from 'axios'
import qs from 'qs'
import { useAuthUser} from 'react-auth-kit';
import { useNavigate} from "react-router-dom"
import {ip} from '../Utils/ip'


function AuctionForm(props) {
    const imgRef = useRef(null)
    const [name, setName]= useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [endTime, setEndTime] = useState("");
    const [errMsg, setErrMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [dayNight, setDayNight] = useState("day");
    const auth = useAuthUser();
    const navigate = useNavigate();

    // multi version
    ///////////////////

    const [selectedImages, setSelectedImages] = useState([]);

    const onSelectFile = (event) => {
    
      const selectedFiles = event.target.files;
      const selectedFilesArray = Array.from(selectedFiles);
  
    //   const imagesArray = selectedFilesArray.map((file) => {
    //     return URL.createObjectURL(file);
    //   });
  
    //   console.log(selectedFilesArray)
    
      // setstate is async
      setSelectedImages((prev)=> {return [...prev, ...selectedFilesArray]});
      // FOR BUG IN CHROME
    //   event.target.value = "";
    };
  
    function deleteHandler(image) {
        setSelectedImages((prev) => {return selectedImages.filter((e) => e !== image)});
        // let f = imgRef.current.files;
        // let curFiles = [];
        // Array.prototype.push.apply(curFiles, f);
        // curFiles = curFiles.filter(function(file) {
        //     return file!== image;
        // });
        // console.log(curFiles)

    }
  


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
            if(selectedImages.length > 0 && selectedImages.length > 4){
                throw new Error("Maximum of 4 images to upload")
            }
            let obj = {
                start_time: dateConversion(new Date()),
                end_time: dateConversion(endTimeDate),
                product_price: price,
                product_name: name,
                product_description: description,
                status: "OPEN_NOT_LIVE",
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
                    let auctionId = response.data.id;
                    const formData = new FormData();
                    for (let i = 0; i < selectedImages.length; i++) {
                        formData.append('image', selectedImages[i]);
                        formData.append('auctionId', auctionId);
                        }
                    axios.post('http://localhost:9001/api/posts', formData, 
                    {headers: {'Content-Type': 'multipart/form-data'}}).then(
                        (response)=>{
                            setSuccessMsg("Game created successfully")
                            setTimeout(()=>{
                                setName("")
                                setDescription("")
                                setPrice("")
                                setEndTime("")
                                setSuccessMsg("")
                                setSelectedImages([])
                            },1000);
                        }
                    ).catch(()=>{
                        setErrMsg("Failed to add game");
                    })
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
            <div className='border-b-2 border-r-2 border-l-2 border-inputColor  flex flex-col justify-center items-center p-4 gap-8 w-1/2
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
                    console.log(e.target.value)
                    setErrMsg("");
                    setSuccessMsg("");
                    setEndTime(e.target.value)}}/>
                    <h5 className='text-center'><i className="material-icons" style={{display:"inline", fontSize:"1rem"}}>info</i> End Date must be 24 hours from current time.</h5>
                </div>

                <div className='flex flex-col items-start p-0 h-20 gap-2 w-full'>
                    <label htmlFor='day-night' className='w-full h-4 not-italic font-semibold text-xs leading-4 text-gray-700'>Time Option:</label>
                    <select id='day-night' name='day-night' value={dayNight} onChange={handleDayNightChange} className='w-full 
                    border-2 border-inputColor h-12 pl-2 bg-white rounded-lg gap-2'>
                        <option value="day">Day: 12:40:00</option>
                        <option value="night">Night: 21:22:00</option>
                    </select>
                </div>
 {/* //////////////// */} 

                <div className='flex flex-col items-start p-0 h-28 gap-2 w-full mb-24'>
                    <form>
                    <label htmlFor="image" className='w-full h-4 not-italic font-semibold text-xs leading-4 text-gray-700'>
                        Upload Images (Up to 4 images)
                        <br />
                    <input
                        ref={imgRef}
                        type="file" multiple accept="image/*"
                        name="image"
                        onChange={onSelectFile} className="w-[12rem] mb-4" 
                        />
                    </label>
                    <br />

                    <div className="h-28 overflow-scroll flex flex-col gap-2 w-[24rem]">
                        {selectedImages &&
                        selectedImages.map((image, index) => {
                            return (
                            <div key={index} className="w-3/4 border-2 border-inputColor rounded-lg p-2 relative">
                                <p>{image.name}</p>
                                <button 
                                className='absolute top-1/4 right-0'
                                onClick={(e) => {e.preventDefault(); deleteHandler(image); setErrMsg("")}}>
                                <i className="material-icons">close</i>
                                </button>
                            </div>
                            );
                        })}
                    </div>
                    {selectedImages.length > 0 &&
                        selectedImages.length > 4 ? (
                        <p className="error">
                            You can't upload more than 4 images! <br />
                            <span>
                            please delete <b> {selectedImages.length - 4} </b> of them{" "}
                            </span>
                        </p>
                        ): <p></p>}
                    </form>
                </div>



{/* /////////// */}
                

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
                        setSelectedImages([]);
                        setSuccessMsg("")
                    }}>Cancel</button>
                    <button className='flex flex-col justify-center items-center p-4 w-40 h-12 bg-buttonColor text-white rounded-lg
                     navbarSM:w-20'
                    onClick={handleSubmit}>Submit</button>
                </div>


                <div>

                </div>

            </div>


        </div>
    );
}

export default AuctionForm;