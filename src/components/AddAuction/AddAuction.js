import Navbar from "../Utils/Navbar";
import InfoNavBar from "../Utils/InfoNavBar";
import {useEffect, useState} from "react";
import React from 'react';
import LeftSideBar from "../Utils/LeftSideBar";
import AuctionForm from "./AuctionForm";
import {useNavigate, useOutletContext} from 'react-router-dom'
import {io} from 'socket.io-client'
import {useIsAuthenticated, useAuthUser} from 'react-auth-kit';


const AddAuction = (props)=>{
    const isAuthenticated = useIsAuthenticated();
    const navigate = useNavigate();
    const obj = useOutletContext();
    const auth = useAuthUser();
    console.log(props)


///////////////////
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleImageChange = (e) => {
      setSelectedFiles([...selectedFiles, ...e.target.files]);
    };

    const handleImageRemove = (index) => {
        const newFiles = [...selectedFiles];
        newFiles.splice(index, 1);
        setSelectedFiles(newFiles);
      };
  
    const handleSubmitImg = (e) => {
      e.preventDefault();
      console.log(e)

    };
///////////////////

    // useEffect(()=>{
    //     console.log("line 27")
    //     const socket = io('http://localhost:9001');
    //     socket?.emit("newUser", auth().id)
    //     props.setSocket(socket);
    // }, []);


    useEffect(()=>{
        if(!isAuthenticated()){
            navigate('/')
        } 
    },[])


    


return(
    <div className="flex-col">
        <Navbar notifications={props.notifications} setNotifications={props.setNotifications} socket={props.socket} notifiCount={props.notifiCount} setNotificount={props.setNotificount} 
       info={props.info} toggleInfo={props.toggleInfo} setToggleInfo={props.setToggleInfo}></Navbar>
        <div className=" flex flex-row navbarSM:flex navbarSM:flex-col ">
            <LeftSideBar></LeftSideBar>
            <AuctionForm info={props.info}></AuctionForm>

            {/* //////////////////// */}
                        <div className='mb-16'>
                    <form onSubmit={handleSubmitImg}>
                        <label htmlFor="image-upload">Upload Images:</label>
                        <input
                        id="image-upload"
                        type="file"
                        multiple
                        onChange={handleImageChange}
                        />
                        <br />
                        <button type="submit">Submit</button>
                    </form>
                    {selectedFiles.length > 0 && (
                        <div>
                        {selectedFiles.map((file, index) => (
                            <div key={index}>
                            <img src={URL.createObjectURL(file)} alt="preview" />
                            <button onClick={() => handleImageRemove(index)}>Remove</button>
                            </div>
                        ))}
                        </div>
                    )}
                </div>

        {/* //////////////////// */}
        </div>
        <InfoNavBar info={props.info} toggleInfo={props.toggleInfo} setToggleInfo={props.setToggleInfo}></InfoNavBar>
    </div>
  )
}

export default AddAuction;