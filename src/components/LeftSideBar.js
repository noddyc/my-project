import {NavLink, Outlet} from 'react-router-dom'
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
                    <div className='flex-col justify-center items-center'><span className='text-center table'>Auction Website</span><br/></div>
                </div>

                <NavLink className='flex flex-col justify-center items-center h-20 mb-10 border-l-4 border-l-slate-300' style={navLinkStyles} to='/main'>
                    <i className="material-icons">home</i>
                    <div className='flex-col justify-center items-center'><span className='text-center table'>Home</span><br/></div>
                </NavLink>
                <NavLink className='flex flex-col justify-center items-center h-20  mb-10 border-l-4 border-l-slate-300' style={navLinkStyles} to='/liveauction'>
                    <i className="material-icons">home</i>
                    <div className='flex-col justify-center items-center'><span className='text-center table'>Live</span><span className='text-center table'>Auctions</span></div>
                </NavLink>

                <NavLink className='flex flex-col justify-center items-center h-20  mb-10 border-l-4 border-l-slate-300' style={navLinkStyles} to='/auctionhist'>
                    <i className="material-icons">home</i>
                    <div className='flex-col justify-center items-center'><span className='text-center table'>Auctions</span><span className='text-center table'>History</span></div>
                </NavLink>

                <NavLink className='flex flex-col justify-center items-center h-20  mb-10 border-l-4 border-l-slate-300' style={navLinkStyles} to='/bidhist'>
                    <i className="material-icons">home</i>
                    <div className='flex-col justify-center items-center'><span className='text-center table'>Bids</span><span className='text-center table'>History</span></div>
                </NavLink>

                <NavLink className='flex flex-col justify-center items-center h-20  mb-10 border-l-4 border-l-slate-300' style={navLinkStyles} to='/addauction'>
                    <i className="material-icons">home</i>
                    <div className='flex-col justify-center items-center'><span className='text-center table'>Add</span><span className='text-center table'>Auction</span></div>
                </NavLink>
            </div>
        </div>
    );
}

export default LeftSideBar;