import Registration from "./components/Registration/Registration"
import Notifications from "./components/Notifications/Notifications";
import Login from "./components/Login/Login"
import Home from "./components/Home/Home"
import AuctionHist from "./components/AuctionHist/AuctionHist";
import LiveAuction from "./components/LiveAuction/LiveAuction";
import BidHist from "./components/BidHist/BidHist";
import AddAuction from "./components/AddAuction/AddAuction"
import Logout from './components/Logout/Logout'
import {Routes,Route} from "react-router-dom"
import React, {useState, useEffect} from 'react'
import axios from "axios";
import qs from 'qs';
import {ip} from './components/Utils/ip.js'
import {useAuthUser} from 'react-auth-kit';
import { io } from "socket.io-client";

function App() {
  const auth = useAuthUser();
  const [notifications, setNotifications] = useState([]);
  const [info, setInfo] = useState({})
  const [change, setChange] = useState(false)
  const [toggleInfo, setToggleInfo] = useState("translate-x-full")
  const [socket, setSocket] = useState(() => {
    const storedSocket = localStorage.getItem('socket');
    return storedSocket !== null ? io.connect(storedSocket) : io('http://localhost:9001');
  });
  useEffect(()=>{
    try{              
      // only display in progress auctions
          let data = qs.stringify({
            'userId': auth().id, 
          });
          let config = {
            method: 'post',
            url: 'http://localhost:9001/notifications/displayNotifications',
            headers: { 
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data : data
          };
          axios(config)
          .then((response) => {
            let data = response.data;
            setNotifications(data);
          })
    }catch(err){
        console.log([err.message])
    }
}, [])



  // Emit a newUser event with a user ID when the component mounts
  useEffect(() => {
    if(auth() != null){
      socket.emit('newUser', auth().id);
    }
  }, [socket, auth]);



  const [notifiCount, setNotificount] = useState(()=>{
    const storedCount = localStorage.getItem('count');
    // return storedCount !== null ? parseInt(storedCount) : notifications?.length;
      return notifications.length !== null ?  notifications?.length : parseInt(storedCount) ;
  });

  useEffect(()=>{
    try{
        console.log(ip)
        let data = qs.stringify({
            'id': auth().id 
          }); 
        let config = {
            method: 'post',
            url: `${ip}/user/getInfo`,
            headers: { 
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data : data
        };
        axios(config).then(
            (response)=>{
                console.log(response.data.timezone)
                setInfo(response.data)
            }
        )            
    }catch(err){
        console.log(err.message)
    }

  }, [change])


  return (
      <div className="App">
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path=''>
            <Route path="/main" element={<Home socket={socket} setSocket={setSocket} notifications={notifications} setNotifications={setNotifications} notifiCount={notifiCount} 
            setNotificount={setNotificount} info={info} setInfo={setInfo} toggleInfo={toggleInfo} setToggleInfo={setToggleInfo} setChange={setChange} />}/>

            <Route path="/liveauction" element={<LiveAuction socket={socket} setSocket={setSocket} notifications={notifications} setNotifications={setNotifications} 
            notifiCount={notifiCount} setNotificount={setNotificount} info={info} setInfo={setInfo} toggleInfo={toggleInfo} setToggleInfo={setToggleInfo}/>}/>

            <Route path="/auctionhist" element={<AuctionHist socket={socket} setSocket={setSocket} notifications={notifications} setNotifications={setNotifications} 
            notifiCount={notifiCount}  setNotificount={setNotificount} info={info} setInfo={setInfo} toggleInfo={toggleInfo} setToggleInfo={setToggleInfo}/>}/>

            <Route path="/bidhist" element={<BidHist socket={socket} setSocket={setSocket}  notifications={notifications} setNotifications={setNotifications}  notifiCount={notifiCount}  
            setNotificount={setNotificount} info={info} setInfo={setInfo} toggleInfo={toggleInfo} setToggleInfo={setToggleInfo}/>}/>

            <Route path="/addauction" element={<AddAuction socket={socket} setSocket={setSocket} notifications={notifications} setNotifications={setNotifications}  notifiCount={notifiCount}  
            setNotificount={setNotificount} info={info} setInfo={setInfo} toggleInfo={toggleInfo} setToggleInfo={setToggleInfo}/>}/>
          </Route>
          <Route path='/registration' element={<Registration/>}/>
          <Route path='/logout' element={<Logout/>}/>
          <Route path='/notifications' element={<Notifications socket={socket} notifications={notifications} setNotifications={setNotifications} 
          setNotificount={setNotificount} setSocket={setSocket} notifiCount={notifiCount}  info={info} setInfo={setInfo} toggleInfo={toggleInfo} setToggleInfo={setToggleInfo}/>}/>
          <Route path="*" element={<h1>Not found</h1>}/>
        </Routes>
      </div>
  );
}

export default App;
