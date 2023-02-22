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

function App() {
  const [info, setInfo] = useState({})
  const [change, setChange] = useState(false)
  const [toggleInfo, setToggleInfo] = useState("translate-x-full")
  const auth = useAuthUser();

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
            <Route path="/main" element={<Home info={info} setInfo={setInfo} toggleInfo={toggleInfo} setToggleInfo={setToggleInfo} setChange={setChange} />}/>
            <Route path="/liveauction" element={<LiveAuction info={info} setInfo={setInfo} toggleInfo={toggleInfo} setToggleInfo={setToggleInfo}/>}/>
            <Route path="/auctionhist" element={<AuctionHist info={info} setInfo={setInfo} toggleInfo={toggleInfo} setToggleInfo={setToggleInfo}/>}/>
            <Route path="/bidhist" element={<BidHist info={info} setInfo={setInfo} toggleInfo={toggleInfo} setToggleInfo={setToggleInfo}/>}/>
            <Route path="/addauction" element={<AddAuction info={info} setInfo={setInfo} toggleInfo={toggleInfo} setToggleInfo={setToggleInfo}/>}/>
          </Route>
          <Route path='/registration' element={<Registration/>}/>
          <Route path='/logout' element={<Logout/>}/>
          <Route path='/notifications' element={<Notifications info={info} setInfo={setInfo} toggleInfo={toggleInfo} setToggleInfo={setToggleInfo}/>}/>
          <Route path="*" element={<h1>Not found</h1>}/>
        </Routes>
      </div>
  );
}

export default App;
