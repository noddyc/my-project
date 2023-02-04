import {React, useState} from 'react';

function AuctionForm(props) {
    const [name, setName]= useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");


    return (
        <div className=' border-2 border-green-900 h-screen w-full flex-col items-center justify-center bg-formColor relative'>
            <div className='border-t-2 border-r-2 border-l-2 border-inputColor w-1/2 absolute left-1/4 top-16  bg-white'>
                <h1 className='h-24 not-italic font-normal text-center text-[60px] leading-[94px] font-roboto text-gray-700'>Create Auction</h1></div>
            <form className='border-b-2 border-r-2 border-l-2 border-inputColor  flex flex-col justify-center items-center p-4 gap-8 w-1/2
            absolute left-1/4 top-40 bg-white'>
                <div className='flex flex-col items-start p-0 h-20 gap-2 w-full'>
                    <label htmlFor='name' className='w-full h-4 not-italic font-semibold text-xs leading-4 text-gray-700'>Name</label>
                    <input id='name' type='text' maxlength="10" className='w-full flex flex-col items-start p-4 h-12 bg-white rounded-lg gap-2 
                    border-2 border-inputColor'/>
                </div>

                <div className='flex flex-col items-start p-0 h-20 gap-2 w-full'>
                    <label htmlFor='description' className='w-full h-4 not-italic font-semibold text-xs leading-4 text-gray-700'>Description: </label>
                    <input id='description' type='text' maxlength="200" className='w-full flex flex-col items-start p-4 h-12 bg-white rounded-lg gap-2 
                    border-2 border-inputColor'/>
                </div>

                <div className='flex flex-col items-start p-0 h-20 gap-2 w-full'>
                    <label htmlFor='price' className='w-full h-4 not-italic font-semibold text-xs leading-4 text-gray-700'>Price: </label>
                    <input id='price' type="number" min="0.00" step="0.01" className='w-full flex flex-col items-start p-4 h-12 bg-white rounded-lg gap-2 border-2 border-inputColor' />
                </div>

                <div className='flex flex-col items-start p-0 h-28 gap-2 w-full'>
                    <label htmlFor='start_time' className='w-full h-4 not-italic font-semibold text-xs leading-4 text-gray-700'>Start Time: </label>
                    <input id='start_time' type="datetime-local" className='w-full p-4 h-12 bg-white rounded-lg gap-2
                    border-2 border-inputColor'/>
                    <h5 className='invisible'>End time must be 24 hours from current time.</h5>
                </div>

                <div className='flex flex-col items-start p-0 h-28 gap-2 w-full'>
                    <label htmlFor='end_time' className='w-full h-4 not-italic font-semibold text-xs leading-4 text-gray-700 '>End Time: </label>
                    <input id='end_time' type="datetime-local" className='w-full 
                    border-2 border-inputColor p-4 h-12 bg-white rounded-lg gap-2'/>
                    <h5 className='invisible'>End time must be 24 hours from current time.</h5>
                </div>
            

                <div className='w-full flex flex-row justify-between items-start p-0 h-12'>
                    <button className='flex flex-col justify-center items-center p-4 w-40 h-12 bg-white rounded-lg text-buttonColor border-2 border-buttonColor'>Cancel</button>
                    <button className='flex flex-col justify-center items-center p-4 w-40 h-12 bg-buttonColor text-white rounded-lg'>Submit</button>
                </div>
            </form>
        </div>
    );
}

export default AuctionForm;