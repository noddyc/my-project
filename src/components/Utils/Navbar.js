import {useState} from "react";
import React,{useEffect} from 'react';
import {useNavigate} from "react-router-dom"
import {NavLink} from 'react-router-dom'

const Navbar = (props) =>{
    const navigate = useNavigate();
    // const [toggle, setToggle] = useState("hidden");
    const [toggle, setToggle] = useState("");
    const [toggleHeight, setToggleHeight] = useState('h-[80px]');
    const [len, setLen] = useState(props.notifications.filter((e)=>!e.viewed).length)

    console.log(props)

    // useEffect(()=>{
    //     props.setNotifications(
    //         (prev)=>{
    //             let arr = prev.map((e)=>{
    //                 return {...e, viewed:true}
    //         })
    //             return arr; 
    //         }
    //     )
    // }, [])

    useEffect(()=>{
        console.log("this is navbar")
        props.socket.off("increaseNotifyCount").on("increaseNotifyCount", (e)=>{
            props.setNotifications((prev)=>[...prev, e])
            // localStorage.setItem('count', props.notifiCount);
        })
    }, [props.socket]);

    useEffect(()=>{
        setLen(props.notifications.filter((e)=>!e.viewed).length)
    }, [props.notifications])

    useEffect(()=>{
        localStorage.setItem('count', props.notifiCount);
    }, [props.notifiCount])


    const navLinkStyles = ({isActive})=>{
        return{
            textDecoration: isActive?'underline':'none',
        }
    }
    
    const imgClickHandler = async (e)=>{
        props.setToggleInfo(" ");
    }

    const barmenuHandler =  async (e)=>{
        e.preventDefault();
        console.log("hello")
        if(toggle==="hidden"){
            setToggle("flex");
            setToggleHeight('h-[220px]')
        }else{
            setToggle("hidden");
            setToggleHeight('h-[80px]');
        }
    }

    const bellClickHandler = async(e)=>{
        navigate('/notifications')
    }
    
    return(
        <nav className={`flex items-center justify-around relative text-white bg-black navbarSM:flex-col ${toggleHeight} navbarSM:items-start`}>
            <div className="flex-grow text-2xl my-2 mr-2 ml-4"></div>
            <a href="#/" onClick={barmenuHandler} className={`hidden flex-col justify-between h-5 absolute top-3 right-4 w-8 navbarSM:flex`}>
                <span className="bg-white h-1 w-full rounded-2xl"></span>
                <span className="bg-white h-1 w-full rounded-2xl"></span>
                <span className="bg-white h-1 w-full rounded-2xl"></span>
            </a>
            <div className={`h-full m-0 px-2 py-0 gap-2 navbarSM:w-full navbarSM:hidden`}>
                <ul className={`flex m-0 px-2 py-0 gap-2  navbarSM:flex-col navbarSM:w-full`}>
                    <div className="flex flex-col justify-center items-center gap-1 w-[126.67px] h-20 pt-3 pb-4 px-0"><span>{props.info.firstname} {props.info.lastname}</span><span className="w-[126.67px] h-4 not-italic font-medium text-xs leading-4 text-center tracking-[0.5px]">{props.info.identity}</span></div>
                    <div className="flex flex-col justify-center items-center gap-1 w-[126.67px] h-20 pt-3 pb-4 px-0 relative"><i className="material-icons hover:cursor-pointer" style={{fontSize: '36px'}}
                    onClick={bellClickHandler}>notifications</i>
                    <div className="absolute top-5 right-10 bg-red-700 w-5 h-5 text-xs text-white flex justify-center items-center rounded-lg">{len}</div>
                    </div>
                    <div className="flex flex-col justify-center items-center gap-1 w-[126.67px] h-20 pt-3 pb-4 px-0"><img onClick={imgClickHandler} src={require("../../assets/img1.jpeg")} 
                    className="flex flex-row justify-center items-center isolate w-8 h-8 p-0 rounded-2xl" style={{cursor:"pointer", height:"3rem", width:"3rem", borderRadius:"10rem"}}></img></div>
                </ul>
            </div>

            <div className={`h-full hidden navbarSM:w-full navbarSM:${toggle}`}>
                <ul className={`flex m-0 p-0 navbarSM:flex-col navbarSM:w-full`}>
                    <NavLink style={navLinkStyles} to='/main' className="list-none  navbarSM:text-center"><span className="block p-4 text-white no-underline navbarSM:py-2 navbarSM:px-4">Home</span></NavLink>
                    <NavLink  style={navLinkStyles} to='/liveauction' className="list-none  navbarSM:text-center"><span  className="block p-4 text-white no-underline navbarSM:py-2 navbarSM:px-4">Live Auctions</span></NavLink>
                    <NavLink  style={navLinkStyles} to='/auctionhist' className="list-none  navbarSM:text-center"><span  className="block p-4 text-white no-underline navbarSM:py-2 navbarSM:px-4">Auction History</span></NavLink>
                    <NavLink  style={navLinkStyles} to='/bidhist' className="list-none  navbarSM:text-center"><span  className="block p-4 text-white no-underline navbarSM:py-2 navbarSM:px-4">Bid History</span></NavLink>
                    <NavLink to='/logout' className="list-none  navbarSM:text-center"><span className="block p-4 text-white no-underline navbarSM:py-2 navbarSM:px-4">Sign Out</span></NavLink>
                </ul>
            </div>

        </nav>
       )
}

export default Navbar;