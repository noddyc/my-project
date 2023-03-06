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
      // setstate is async
      setSelectedImages((prev)=> {return [...prev, ...selectedFilesArray]});
    };
  
    function deleteHandler(image) {
        setSelectedImages((prev) => {return selectedImages.filter((e) => e !== image)});

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
                            setSuccessMsg("Game Created Successfully")
                            setTimeout(()=>{
                                setName("")
                                setDescription("")
                                setPrice("")
                                setEndTime("")
                                setSuccessMsg("")
                                setErrMsg("")
                                setSelectedImages([])
                            },1000);
                        }
                    ).catch(()=>{
                        setErrMsg("Failed to Add Game");
                    })
                }
            ).catch(()=>{
                setErrMsg("Failed to Add Game");
            })


        }catch(err){
            if (err.response?.status) {
                setErrMsg('Failed to Add Game');
            }
            else{
                setErrMsg(err.message);
            }
        }
    }



    return (
        <div className='ml-[200px] mt-10 w-1/2 font-inter font-light text-xl'>
            <div class="md:grid md:grid-cols-3 md:gap-6">
                <div class="md:col-span-1">
                    <div class="px-4 sm:px-0">
                        <h3 class="text-4xl font-inter font-bold">Create New Game</h3>
                    </div>
                </div>

                <div class="mt-5 md:col-span-2 md:mt-0">
                    <div>
                        <div class="overflow-hidden sm:rounded-md">
                            <div class="bg-white px-4 py-5 sm:p-6">
                                <div class="grid grid-cols-6 gap-6">
                                    <div class="col-span-6 sm:col-span-3">
                                        <label htmlFor="name" className="label">Name</label>
                                        <input id='name' type='text' maxLength="20" 
                                            value={name} onChange={(e)=>{setErrMsg("");
                                            setSuccessMsg("");
                                            setName(e.target.value)}} placeholder="Enter Game Name" className="input"/>
                                    </div>         

                                    <div class="col-span-6 sm:col-span-3">
                                        <label htmlFor='description' className="label">Description</label>
                                         <textarea id='description' type='text' maxLength="200" rows="3"
                                         value={description} onChange={(e)=>{setErrMsg("");
                                         setSuccessMsg("");
                                         setDescription(e.target.value)}} placeholder="Enter Description"
                                         className="input"/>
                                    </div>

                                    <div class="col-span-6 sm:col-span-3">
                                        <label htmlFor='price' className='label'>Price</label>
                                        <input id='price' type="numeric" min="1" step="1" className='input'
                                            value={price} onChange={(e)=>{setErrMsg("");
                                            setSuccessMsg("");
                                            setPrice(e.target.value)}} placeholder="0"/>
                                    </div>


                                    <div class="col-span-6 sm:col-span-3">
                                        <label htmlFor='date' className='label'>End Date</label>

                                        <input id='date' name='date' type="date" className='input' value={endTime}
                                            onChange={(e)=>{
                                            setErrMsg("");
                                            setSuccessMsg("");
                                            setEndTime(e.target.value)}}/>

                                        <p class="mt-2 text-sm text-gray-500">End Date must be 24 hours from current time.</p>
                                    </div>

                                    <div class="col-span-6 sm:col-span-3">
                                        <label htmlFor='day-night' className='label'>Time Option</label>
                                        <select id='day-night' name='day-night' value={dayNight} onChange={handleDayNightChange} className='input'>
                                            <option value="day">Day: 12:40:00</option>
                                            <option value="night">Night: 21:22:00</option>
                                        </select>
                                    </div>


                                    <div class="col-span-6 sm:col-span-3">
                                        <form>
                                            <label htmlFor="image" className='label'>
                                                Images
                                                <br />
                                            <input
                                                ref={imgRef}
                                                type="file" multiple accept="image/*"
            
                                                name="image"
                                                onChange={onSelectFile} className="mt-1 py-1 block w-[105px] rounded-md text-sm" 
                                                />
                                            </label>
                                            <br />

                                            <div className="col-span-6 sm:col-span-3 overflow-scroll h-28 border-2 rounded-md border-inputColor p-2">
                                                {selectedImages &&
                                                selectedImages.map((image, index) => {
                                                    return (
                                                    <div key={index} className="w-full border-2 border-inputColor rounded-lg px-1 mb-1 flex
                                                    items-center">
                                                        <p className='flex-grow'>{image.name}</p>
                                                        <button 
                                                        onClick={(e) => {e.preventDefault(); deleteHandler(image); setErrMsg("")}}>
                                                        <i className="material-icons block text-base items-end">close</i>
                                                        </button>
                                                    </div>
                                                    );
                                                })}
                                            </div>
                                            {selectedImages.length > 0 &&
                                                selectedImages.length > 4 ? (
                                                <p>
                                                    You can't upload more than 4 images! <br />
                                                    <span>
                                                    please delete {selectedImages.length - 4} of them{" "}
                                                    </span>
                                                </p>
                                                ): <p></p>}
                                        </form>
                                    </div>

                                    <div className='col-span-6 sm:col-span-3 mb-1'> 
                                        <p className={errMsg ? "warning" : "invisible"} aria-live="assertive">{errMsg}</p>
                                    </div>

                                    <div className='col-span-6 sm:col-span-3 mb-1'> 
                                        <p className={successMsg ? "warning" : "invisible"} aria-live="assertive">{successMsg}</p>
                                    </div>


                                    <div className='col-span-6 mb-20'>
                                        <div className='flex justify-between'>
                                            <button className='button'
                                            onClick={(e)=>{
                                                e.preventDefault();
                                                setName("");
                                                setDescription("");
                                                setPrice("");
                                                setEndTime("");
                                                setSelectedImages([]);
                                                setSuccessMsg("")
                                            }}><i className="material-icons inline">cancel</i><span>Cancel</span></button>
                                            <button className='button'
                                            onClick={handleSubmit}><i className="material-icons inline">add_circle</i><span>Submit</span></button>
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

export default AuctionForm;