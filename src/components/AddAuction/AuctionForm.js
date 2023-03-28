import {React, useState, useRef} from 'react';
import moment from 'moment'
import axios from 'axios'
import qs from 'qs'
import { useAuthUser} from 'react-auth-kit';
import { useNavigate} from "react-router-dom"
import {ip} from '../Utils/ip'
import _, { set } from 'lodash'
import FormModal from './FormModal';
import { checkDayLightSaving } from '../Utils/time';
import Product from './Product'

checkDayLightSaving()

function AuctionForm(props) {
    const [endTime, setEndTime] = useState("");
    const [errMsg, setErrMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [dayNight, setDayNight] = useState("day");
    const auth = useAuthUser();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);   

    const product = new Product(); 
    const [state, setState] = useState([product]);


    // multi version
    ///////////////////

    const onSelectFile = async(e, index) => {   
        setSuccessMsg("")  
        setErrMsg("")
        const selectedFiles = e.target.files;
        const selectedFilesArray = Array.from(selectedFiles);  
        // setstate is async
        const newState = [...state];
        const newItem = newState[index];
        newItem.images = [...newItem.images, ...Array.from(e.target.files)];
        setState(newState)
      };
  
    const deleteHandler = async(e, imageIndex, index)=>{
        e.preventDefault();
        const newState = [...state];
        const newItem = newState[index];
        console.log(newItem)
        newItem.images.splice(imageIndex, 1);
        setState(newState);
        setErrMsg("")
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
            // for(let i = 0; i < state.length; i++){
            //     const obj = state[i];

            // }
            // if(name === "" || description === "" || price === ""  || !priceRegex.test(price) || !oneDayAhead(storeEndTime)){
            //     throw new Error(_.startCase("Fields must be valid or end time must be 24 hours from current time"));
            // }
        //     if(selectedImages.length > 0 && selectedImages.length > 4){
        //         throw new Error(_.startCase("Maximum of 4 Images to Upload"))
        //     }
            setIsOpen(true)
            let obj = {
                start_time: (new Date()),
                end_time: storeEndTime,
                status: "OPEN_NOT_LIVE",
                ownerId: auth().id,
                multiGame: state.length > 1?true:false
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
                    for(let i = 0; i < state.length; i++){
                        let obj = {
                            product_name: state[i].name,
                            product_description: state[i].description,
                            product_price: state[i].price
                        }
                        let data = qs.stringify(obj);
                        let config = {
                            method: 'put',
                            url: `${ip}/product/addProduct`,
                            headers: { 
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            data : data
                            };
                        axios(config).then(
                            (response)=>{
                                setSubmitting(true)

                                setTimeout(()=>{
                                    setEndTime("")
                                    setSuccessMsg("")
                                    setErrMsg("")
                                    const obj = new Product();
                                    setState([obj]);
                                },500);
                            }
                        )
                }


                }
                // (response)=>{
                //     for(let i = 0; i < state.length; i++){
                //         let obj = {
                //             product_name: state[i].name,
                //             product_description: state[i].description,
                //             product_price: state[i].price
                //         }
                //         let data = qs.stringify(obj);
                //         let config1 = {
                //             method: 'put',
                //             url: `${ip}/product/addProduct`,
                //             headers: { 
                //               'Content-Type': 'application/x-www-form-urlencoded'
                //             },
                //             data : data
                //           };
                //         axios(config1).then(
                //             (response)=>{
                //                 console.log(response.data)
                //             }
                //         )
                //     }
                // }
            ).catch(
                ()=>{
                    setSuccessMsg("")
                    setIsOpen(false);
    
                    setErrMsg("Failed to Add Game");
            
                    setTimeout(()=>{
                        // setName("")
                        // setDescription("")
                        // setPrice("")
                        setEndTime("")
                        setSuccessMsg("")
                        setErrMsg("")
                        // setSelectedImages([])
                    }, 1000);
                }

            )
        //     axios(config).then(
        //         (response)=>{
        //             console.log(JSON.stringify(response.data))
        //             let auctionId = response.data.id;
        //             const formData = new FormData();
        //             for (let i = 0; i < selectedImages.length; i++) {
        //                 formData.append('image', selectedImages[i]);
        //                 formData.append('auctionId', auctionId);
        //                 }
        //             if(selectedImages.length != 0){
        //                 axios.post(`${ip}/api/posts`, formData, 
        //                 {headers: {'Content-Type': 'multipart/form-data'}}).then(
        //                     (response)=>{
        //                         // setSuccessMsg("Game Created Successfully")

        //                         setSubmitting(true)
                                

        //                         setTimeout(()=>{
        //                             setName("")
        //                             setDescription("")
        //                             setPrice("")
        //                             setEndTime("")
        //                             setSuccessMsg("")
        //                             setErrMsg("")
        //                             setSelectedImages([])
        //                         },500);
        //                     }
        //                 ).catch(()=>{
        //                     setSuccessMsg("")
        //                     setIsOpen(false);
        //                     setErrMsg("Failed to Add Game");
        //                     setTimeout(()=>{
        //                         setName("")
        //                         setDescription("")
        //                         setPrice("")
        //                         setEndTime("")
        //                         setSuccessMsg("")
        //                         setErrMsg("")
        //                         setSelectedImages([])
        //                     },1000);
        //                 })
        //             }else{
        //                 // setSuccessMsg("Game Created Successfully")
        //                 setSubmitting(true)
        //                 setTimeout(()=>{
        //                     setName("")
        //                     setDescription("")
        //                     setPrice("")
        //                     setEndTime("")
        //                     setSuccessMsg("")
        //                     setErrMsg("")
        //                     setSelectedImages([])
        //                 },500);
        //             }
        //         }
        //     ).catch(()=>{
        //         setSuccessMsg("")
        //         setIsOpen(false);

        //         setErrMsg("Failed to Add Game");

        //         setTimeout(()=>{
        //             setName("")
        //             setDescription("")
        //             setPrice("")
        //             setEndTime("")
        //             setSuccessMsg("")
        //             setErrMsg("")
        //             setSelectedImages([])
        //         }, 1000);
        //     })
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
                        <h3 className="text-4xl font-inter font-bold">CREATE NEW GAME</h3>
                    </div>
                </div>

                <div className="mt-5 md:col-span-2 md:mt-0">
                    <div>
                        <div className="overflow-hidden sm:rounded-md">
                            <div className="bg-white px-4 py-5 sm:p-6">
                                <div className="grid grid-cols-6 gap-6">

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
                                        {
                                            state.map((s,index)=>{
                                                return <div className='grid grid-cols-6 gap-6' key={index}>
                                                    <div className='col-span-6 sm:col-span-3'>

                                                        <div className='flex flex-row'>
                                                            <span className='label'>Product {index+1}</span>
                                                            {
                                                            index === 0?null:(
                                                                    <button className='flex-grow text-right'
                                                                    onClick={()=>{
                                                                        const newState=[...state];
                                                                        newState.splice(index, 1);
                                                                        setState(newState);
                                                                    }}><i className='material-icons text-red-500'>remove</i></button>
                                                            )
                                                            }
            
                                                        </div>
                                                    </div>
                                                    
                                                    <div  className="col-span-6 sm:col-span-3">
                                                        <label htmlFor="name" className="label">Product Name<span className='text-red-500'>*</span></label>
                                                        <input id='name' type='text' maxLength="20" 
                                                            value={s.name} onChange={(e)=>{
                                                                setErrMsg("");
                                                                setSuccessMsg("");
                                                                const newState=[...state];
                                                                newState[index] = {...newState[index], name: e.target.value }
                                                                setState(newState);
                                                                }} placeholder="Enter Product Name" className="input"/>
                                                    </div>  


                                                    <div className="col-span-6 sm:col-span-3">
                                                        <label htmlFor='price' className='label'>Product Price<span className='text-red-500'>*</span></label>
                                                        <input id='price' type="numeric" min="1" step="1" className='input'
                                                            value={s.price} onChange={(e)=>{
                                                                setErrMsg("");
                                                                setSuccessMsg("");
                                                                const newState=[...state];
                                                                newState[index] = {...newState[index], price: e.target.value }
                                                                setState(newState);
                                                                }} placeholder="0"/>
                                                    </div>


                                                    <div className="col-span-6 sm:col-span-3">
                                                        <label htmlFor='description' className="label">Product Description<span className='text-red-500'>*</span></label>
                                                            <textarea id='description' type='text' maxLength="200" rows="3" 
                                                            value={s.description} onChange={(e)=>{
                                                                setErrMsg("");
                                                                setSuccessMsg("");
                                                                const newState = [...state];
                                                                newState[index] = {...newState[index], description: e.target.value }
                                                                setState(newState);
                                                                }
                                                            } 
                                                            placeholder="Enter Description"
                                                            className="input"/>
                                                            <span className="block text-right font-inter font-medium text-xs">{200-s.description.length} Characters Remaining</span>
                                                    </div>  


                                                    <div className="col-span-6 sm:col-span-3">
                                                        <form >
                                                            <label htmlFor="image" className='label'>
                                                                Images
                                                                <br />
                                                            <input
                                                                type="file" multiple accept="image/*"
                                                                name="image"
                                                                onChange={(e)=>{
                                                                    onSelectFile(e, index)
                                                                }} className="mt-1 py-1 block w-[105px] rounded-md text-sm" 
                                                                />
                                                            </label>
                                                            <br />

                                                            <div className="col-span-6 sm:col-span-3 overflow-scroll h-28 border-2 rounded-md border-inputColor p-2">
                                                                {s.images.map((image, imgIndex) => {
                                                                    return (
                                                                    <div key={imgIndex} className="w-full border-2 border-inputColor rounded-lg px-1 mb-1 flex
                                                                    items-center navbarSM:text-sm">
                                                                        <p className='flex-grow'>{image.name}</p>
                                                                        <button onClick={(e)=>{
                                                                            e.preventDefault();
                                                                            deleteHandler(e, imgIndex, index);
                                                                            } 
                                                                        }>
                                                                        <i className="material-icons block text-base items-end">close</i>
                                                                        </button>
                                                                    </div>
                                                                    );
                                                                })}
                                                            </div>
                                                            {s.images.length > 0 &&
                                                                s.images.length > 4 ? (
                                                                <div className='mt-2'>
                                                                    <p>
                                                                        {_.startCase("You can not upload more than 4 images!") }<br />
                                                                        <span>
                                                                        {_.startCase(`please delete ${s.images.length - 4} of them `)}
                                                                        </span>
                                                                    </p>
                                                                </div>
                                                                ): <p></p>}
                                                        </form>
                                                    </div>

                                                    <div className={`col-span-6 mb-5 sm:col-span-3`}>
                                                        <div className='flex flex-row'>
                                                            <div className='border-dashed border-black border-2 mr-0.5 flex-1 h-0 mt-3'></div>
                                                            <button className={`block mx-3 ${state.length >= 4 || state.length-index>1?"hidden":""}`}  onClick={()=>{
                                                                const newState = [...state];
                                                                const newProduct= new Product();
                                                                newState.push(newProduct);
                                                                setState(newState);
                                                            }}><span>Add Product</span></button>
                                                            <div className='border-dashed border-black border-2 ml-0.5 flex-1 h-0 mt-3'></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            })

                                        }
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

            <div className='col-span-6 mt-10 mb-20'>
                                        <div className='flex justify-between navbarSM:gap-[4vw]'>
                                            <button className='button_light navbarSM:text-xs'
                                            onClick={(e)=>{
                                                e.preventDefault();
                                                // setName("");
                                                // setDescription("");
                                                // setPrice("");
                                                // setEndTime("");
                                                // setSelectedImages([]);
                                                // setSuccessMsg("")
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