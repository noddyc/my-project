import {React, useState, useRef} from 'react';
import moment from 'moment'
import axios from 'axios'
import qs from 'qs'
import { useAuthUser} from 'react-auth-kit';
import { useNavigate} from "react-router-dom"
import {ip} from '../Utils/ip'
import _ from 'lodash'
import FormModal from './FormModal';
import { checkDayLightSaving } from '../Utils/time';

checkDayLightSaving()

function AuctionForm(props) {
    const descriptionRef = useRef(null)
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

    const [isOpen, setIsOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    // multi version
    ///////////////////

    const [selectedImages, setSelectedImages] = useState([]);

    const onSelectFile = async(event) => {   
      setSuccessMsg("")  
      setErrMsg("")
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
        return e;
    }


    const handleDayNightChange = (event) => {
        setSuccessMsg("")
        setErrMsg("")
        setDayNight(event.target.value);
      };


    const myMap = {day:'12:40:00', night: '21:22:00'}


    const handleSubmit= async(e)=>{
        e.preventDefault();
        // not daylight saving time -6
        // daylight saving time -5
        let dayLightAdjustDate = new Date((endTime+'T'+'09:00:00'+'.000Z').toString());
        let isDayLightSaving = dayLightAdjustDate.isDstObserved()
        let endTimeDate;
        if(isDayLightSaving){
            endTimeDate = new Date((endTime+'T'+myMap[dayNight]+"-05:00").toString());
        }else{
            endTimeDate = new Date((endTime+'T'+myMap[dayNight]+"-06:00").toString());
        }
        let storeEndTime = (endTimeDate.toISOString())
        console.log(storeEndTime)
 
        try{
            if(name === "" || description === "" || price === ""  || !priceRegex.test(price) || !oneDayAhead(storeEndTime)){
                throw new Error(_.startCase("Fields must be valid or end time must be 24 hours from current time"));
            }
            if(selectedImages.length > 0 && selectedImages.length > 4){
                throw new Error(_.startCase("Maximum of 4 Images to Upload"))
            }
            setIsOpen(true)
            let obj = {
                start_time: (new Date()),
                end_time: storeEndTime,
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
                    if(selectedImages.length != 0){
                        axios.post(`${ip}/api/posts`, formData, 
                        {headers: {'Content-Type': 'multipart/form-data'}}).then(
                            (response)=>{
                                // setSuccessMsg("Game Created Successfully")

                                setSubmitting(true)
                                

                                setTimeout(()=>{
                                    setName("")
                                    setDescription("")
                                    setPrice("")
                                    setEndTime("")
                                    setSuccessMsg("")
                                    setErrMsg("")
                                    setSelectedImages([])
                                },500);
                            }
                        ).catch(()=>{
                            setSuccessMsg("")
                            setIsOpen(false);
                            setErrMsg("Failed to Add Game");
                            setTimeout(()=>{
                                setName("")
                                setDescription("")
                                setPrice("")
                                setEndTime("")
                                setSuccessMsg("")
                                setErrMsg("")
                                setSelectedImages([])
                            },1000);
                        })
                    }else{
                        // setSuccessMsg("Game Created Successfully")
                        setSubmitting(true)
                        setTimeout(()=>{
                            setName("")
                            setDescription("")
                            setPrice("")
                            setEndTime("")
                            setSuccessMsg("")
                            setErrMsg("")
                            setSelectedImages([])
                        },500);
                    }
                }
            ).catch(()=>{
                setSuccessMsg("")
                setIsOpen(false);

                setErrMsg("Failed to Add Game");

                setTimeout(()=>{
                    setName("")
                    setDescription("")
                    setPrice("")
                    setEndTime("")
                    setSuccessMsg("")
                    setErrMsg("")
                    setSelectedImages([])
                }, 1000);
            })
        }catch(err){
            if (err.response?.status) {
                setSuccessMsg("")

                setIsOpen(false);

                setErrMsg('Failed to Add Game');
            }
            else{
                setSuccessMsg("")

                setIsOpen(false);

                setErrMsg(err.message);
            }
        }
    }



    return (
        <div className='ml-[200px] mt-10 w-1/2 font-inter font-light text-xl navbarSM:ml-[20vw]'>
            <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                    <div className="px-4 sm:px-0">
                        <h3 className="text-4xl font-inter font-bold">Create New Game</h3>
                    </div>
                </div>

                <div className="mt-5 md:col-span-2 md:mt-0">
                    <div>
                        <div className="overflow-hidden sm:rounded-md">
                            <div className="bg-white px-4 py-5 sm:p-6">
                                <div className="grid grid-cols-6 gap-6">
                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="name" className="label">Name<span className='text-red-500'>*</span></label>
                                        <input id='name' type='text' maxLength="20" 
                                            value={name} onChange={(e)=>{setErrMsg("");
                                            setSuccessMsg("");
                                            setName(e.target.value)}} placeholder="Enter Game Name" className="input"/>
                                    </div>         

                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor='description' className="label">Description<span className='text-red-500'>*</span></label>
                                         <textarea id='description' type='text' maxLength="200" rows="3" ref={descriptionRef}
                                         value={description} onChange={(e)=>{setErrMsg("");
                                         setSuccessMsg("");
                                         setDescription(e.target.value)}} placeholder="Enter Description"
                                         className="input"/>
                                         <span className="block text-right font-inter font-medium text-xs">{200-descriptionRef.current?.value.length} characters remaining</span>
                                    </div>

                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor='price' className='label'>Price<span className='text-red-500'>*</span></label>
                                        <input id='price' type="numeric" min="1" step="1" className='input'
                                            value={price} onChange={(e)=>{setErrMsg("");
                                            setSuccessMsg("");
                                            setPrice(e.target.value)}} placeholder="0"/>
                                    </div>


                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor='date' className='label'>End Date<span className='text-red-500'>*</span></label>

                                        <input id='date' name='date' type="date" className='input' value={endTime}
                                            onChange={(e)=>{
                                            setErrMsg("");
                                            setSuccessMsg("");
                                            setEndTime(e.target.value)}}/>

                                    </div>

                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor='day-night' className='label'>Time Option<span  className='text-red-500'>*</span></label>
                                        <select id='day-night' name='day-night' value={dayNight} onChange={handleDayNightChange} className='input'>
                                            <option value="day">Day: 12:40:00 (Central Time)</option>
                                            <option value="night">Night: 21:22:00 (Central Time)</option>
                                        </select>
                                    </div>


                                    <div className="col-span-6 sm:col-span-3">
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
                                                    items-center navbarSM:text-sm">
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
                                                <div className='mt-2'>
                                                    <p>
                                                        {_.startCase("You can not upload more than 4 images!") }<br />
                                                        <span>
                                                        {_.startCase(`please delete ${selectedImages.length - 4} of them `)}
                                                        </span>
                                                    </p>
                                                </div>
                                                ): <p></p>}
                                        </form>
                                    </div>

                                    <div className='col-span-6 sm:col-span-3 mb-1'> 
                                        <p className={errMsg ? "warning" : "invisible"} aria-live="assertive">
                                            <i className="material-icons inline text-lg">error</i> {errMsg}</p>
                                    </div>

                                    <div className='col-span-6 sm:col-span-3 mb-1 '> 
                                        <p className={successMsg ? "success" : "invisible"} aria-live="assertive">
                                        <i className="material-icons inline text-lg">check</i> {successMsg}</p>
                                    </div>


                                </div>    
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='col-span-6 mb-20'>
                                        <div className='flex justify-between navbarSM:gap-[4vw]'>
                                            <button className='button_light navbarSM:text-xs'
                                            onClick={(e)=>{
                                                e.preventDefault();
                                                setName("");
                                                setDescription("");
                                                setPrice("");
                                                setEndTime("");
                                                setSelectedImages([]);
                                                setSuccessMsg("")
                                            }}><i className="material-icons inline navbarSM:text-sm">cancel</i><span>Cancel</span></button>
                                            <button className={`button navbarSM:text-xs`}
                                            onClick={handleSubmit}><i className={`material-icons inline navbarSM:text-sm`}>add_circle</i><span>Submit</span></button>
                                        </div>
                                    </div>
        
            <FormModal  open={isOpen} onClose={() => setIsOpen(false)} submitting={submitting} setSubmitting={setSubmitting}></FormModal>
        </div> 
    );
}

export default AuctionForm;