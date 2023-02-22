import Navbar from "../Utils/Navbar";
import React from 'react';
import LeftSideBar from "../Utils/LeftSideBar";
import InfoNavBar from "../Utils/InfoNavBar";


function Notifications(props) {
    return (
        <div className="h-screen relative">
        <Navbar info={props.info} toggleInfo={props.toggleInfo} setToggleInfo={props.setToggleInfo}></Navbar>
        <div className="flex flex-row h-[calc(100%-80px)] navbarSM:flex navbarSM:flex-col">
              <LeftSideBar></LeftSideBar>
              <div className=' w-full h-[90%] bg-white gap-2 flex flex-col justify-center items-start ml-40 mt-10 mb-10 relative navbarSM:w-full navbarSM:pl-0 navbarSM:pr-0 navbarSM:ml-0'>
                <div className="flex flex-col border-2 border-black p-2 rounded-lg gap-2">
                    User 1 request retraction on slot 9 of auction 1
                    <div className="gap-4 flex">
                        <button className="border-2 border-black px-2 rounded-lg cursor-pointer">Confrim</button>
                        <button className="border-2 border-black px-2 rounded-lg cursor-pointer">Delete</button>
                    </div>
                </div>

                <div className="flex flex-col border-2 border-black p-2 rounded-lg gap-2">
                    User 1 request retraction on slot 9 of auction 1
                    <div className="gap-4 flex">
                        <button className="border-2 border-black px-2 rounded-lg cursor-pointer">Confrim</button>
                        <button className="border-2 border-black px-2 rounded-lg cursor-pointer">Delete</button>
                    </div>
                </div>


                <div className="flex flex-col border-2 border-black p-2 rounded-lg gap-2">
                    User 1 request retraction on slot 9 of auction 1
                    <div className="gap-4 flex">
                        <button className="border-2 border-black px-2 rounded-lg cursor-pointer">Confrim</button>
                        <button className="border-2 border-black px-2 rounded-lg cursor-pointer">Delete</button>
                    </div>
                </div>


                <div className="flex flex-col border-2 border-black p-2 rounded-lg gap-2">
                    User 1 request retraction on slot 9 of auction 1
                    <div className="gap-4 flex">
                        <button className="border-2 border-black px-2 rounded-lg cursor-pointer">Confrim</button>
                        <button className="border-2 border-black px-2 rounded-lg cursor-pointer">Delete</button>
                    </div>
                </div>

                
              </div>
        </div>
        <InfoNavBar info={props.info} toggleInfo={props.toggleInfo} setToggleInfo={props.setToggleInfo}></InfoNavBar>
      </div>
    );
}

export default Notifications;