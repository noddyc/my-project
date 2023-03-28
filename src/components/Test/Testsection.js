import React from 'react';
import {useState, useRef } from "react";
import _ from "lodash"
import Product from '../AddAuction/Product'

function Testsection(props) {
    const [errMsg, setErrMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const product = new Product(); 
    const [state, setState] = useState([product]);


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

    return (
        <div  className='after-margin-200 overflow-scroll h-full flex flex-col mt-10 ml-[200px] relative font-inter font-light gap-6
        navbarSM:ml-[10px]'>
            {
                state.map((s, index)=>{
                    return (
                    <div key={index}>
                        {
                            index === 0?null:(
                                <div>
                                    <button onClick={()=>{
                                        const newState=[...state];
                                        newState.splice(index, 1);
                                        setState(newState);
                                    }}><i className='material-icons'>close</i></button>
                                </div>
                            )
                        }

                        <div >
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

                        <div>
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
                        
                        <div>
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
                    </div>);
                })
            }

            <div className='flex flex-row'>
                <div className='border-dashed border-black border-2 flex-1 mx-3 h-0 mt-3'></div>
                <div>
                    <button onClick={()=>{
                        const newState = [...state];
                        const newProduct= new Product();
                        newState.push(newProduct);
                        setState(newState);
                    }}><span>Add Product</span></button>
                </div>
                <div className='border-dashed border-black border-2 flex-1 mx-3 h-0 mt-3'></div>
            </div>

            <div><button onClick={()=>{
                state.forEach((s)=>{
                    console.log(JSON.stringify(s.description))
                })
            }}>Click</button></div>
        </div>
    );
}

export default Testsection;