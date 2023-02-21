import {NavLink} from 'react-router-dom'
import React from 'react';

function LeftSideBar(props) {

    const navLinkStyles = ({isActive})=>{
        return{
            // borderLeft: isActive?'solid 4px transparent':'none',
            // borderRadius: isActive?'1px':'none',
            borderLeftColor: isActive?"black":'rgb(203 213 225)',
        }
    }
    
    return (
        <div className='flex flex-col w-24 justify-start bg-slate-300 h-screen pt-10 fixed top-0 bottom-0 z-50
        navbarSM:hidden'>
        {/* // <div className='border-4 border-red-900 w-24 justify-start bg-slate-300 h-screen pt-10 fixed top-0 bottom-0 flex flex-col items-center navbarSM:hidden'> */}
            <div className=''>
                <div className='flex flex-col justify-center items-center h-20 mb-10 border-l-4 border-l-slate-300'>
                    {/* <i className="material-icons">home</i> */}
                    <div className='flex-col justify-center items-center'><span className='text-center table'>Game Website</span><br/></div>
                </div>

                <NavLink className='flex flex-col justify-center items-center h-20 mb-10 border-l-4 border-l-slate-300' style={navLinkStyles} to='/main'>
                    <i className="material-icons">home</i>
                    <div className='flex-col justify-center items-center'><span className='text-center table'>HOME</span><br/></div>
                </NavLink>
                <NavLink className='flex flex-col justify-center items-center h-20  mb-10 border-l-4 border-l-slate-300' style={navLinkStyles} to='/liveauction'>
                    <i className="material-icons">star</i>
                    <div className='flex-col justify-center items-center'><span className='text-center table'>LIVE</span><span className='text-center table'>GAMES</span></div>
                </NavLink>

                <NavLink className='flex flex-col justify-center items-center h-20  mb-10 border-l-4 border-l-slate-300' style={navLinkStyles} to='/auctionhist'>
                    <i className="material-icons">timer</i>
                    <div className='flex-col justify-center items-center'><span className='text-center table'>GAME</span><span className='text-center table'>HISTORY</span></div>
                </NavLink>

                <NavLink className='flex flex-col justify-center items-center h-20  mb-10 border-l-4 border-l-slate-300' style={navLinkStyles} to='/bidhist'>
                    <i className="material-icons">timelapse</i>
                    <div className='flex-col justify-center items-center'><span className='text-center table'>SELECTION</span><span className='text-center table'>HISTORY</span></div>
                </NavLink>

                <NavLink className='flex flex-col justify-center items-center h-20  mb-10 border-l-4 border-l-slate-300' style={navLinkStyles} to='/addauction'>
                    <i className="material-icons">open_in_new</i>
                    <div className='flex-col justify-center items-center'><span className='text-center table'>NEW</span><span className='text-center table'>GAME</span></div>
                </NavLink>
            </div>
        </div>
    );
}

export default LeftSideBar;