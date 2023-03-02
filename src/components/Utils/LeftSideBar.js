import {NavLink} from 'react-router-dom'
import React from 'react';

function LeftSideBar(props) {

    const navLinkStyles = ({isActive})=>{
        return{
            borderLeftColor: isActive?"white":'#334155',
        }
    }
    
    return (
        <div className='flex flex-col w-[150px] justify-start bg-darkBg text-white h-screen pt-10 fixed top-0 bottom-0 z-50 
        navbarSM:hidden'>
            <div className=''>
                <div className='flex flex-col justify-center items-center h-20 mb-10 border-l-4 border-l-darkBg'>
                    <div className='flex-col justify-center items-center'><span className='text-center table text-2xl'>Game Website</span><br/></div>
                </div>

                <NavLink className='flex flex-col justify-center items-center h-20 mb-10 border-l-4 border-l-slate-300 gap-2' style={navLinkStyles} to='/main'>
                    <i className="material-icons text-4xl">home</i>
                    <div className='flex-col justify-center items-center'><span className='text-center table'>HOME</span><br/></div>
                </NavLink>
                
                <NavLink className='flex flex-col justify-center items-center h-20  mb-10 border-l-4 border-l-slate-300 gap-2' style={navLinkStyles} to='/liveauction'>
                    <i className="material-icons text-4xl">star</i>
                    <div className='flex-col justify-center items-center'><span className='text-center table'>LIVE GAMES</span></div>
                </NavLink>

                <NavLink className='flex flex-col justify-center items-center h-20  mb-10 border-l-4 border-l-slate-300 gap-2' style={navLinkStyles} to='/auctionhist'>
                    <i className="material-icons text-4xl">timer</i>
                    <div className='flex-col justify-center items-center'><span className='text-center table'>GAME HISTORY</span></div>
                </NavLink>

                <NavLink className='flex flex-col justify-center items-center h-20  mb-10 border-l-4 border-l-slate-300 gap-2' style={navLinkStyles} to='/bidhist'>
                    <i className="material-icons text-4xl">timelapse</i>
                    <div className='flex-col justify-center items-center'><span className='text-center table'>SELECTIONS</span></div>
                </NavLink>

                <NavLink className='flex flex-col justify-center items-center h-20  mb-10 border-l-4 border-l-slate-300' style={navLinkStyles} to='/addauction'>
                    <i className="material-icons text-4xl">open_in_new</i>
                    <div className='flex-col justify-center items-center'><span className='text-center table'>NEW GAME</span></div>
                </NavLink>
            </div>
        </div>
    );
}

export default LeftSideBar;