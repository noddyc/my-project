import Registration from "./components/Registration"
import Login from "./components/Login"
import Home from "./components/Home"
import AuctionHist from "./components/AuctionHist";
import LiveAuction from "./components/LiveAuction";
import BidHist from "./components/BidHist";
import Navbar from "./components/Navbar"
import Logout from './components/Logout'
import {BrowserRouter, Routes, Link, Route, Switch, useNavigate} from "react-router-dom"
import {useState, useEffect} from 'react'
import axios from "axios";
import qs from 'qs';
import {useIsAuthenticated, useAuthUser} from 'react-auth-kit';

function App() {
  const [info, setInfo] = useState({})
  const auth = useAuthUser();

  useEffect(()=>{
    try{
        let data = qs.stringify({
            'id': auth().id 
          }); 
        let config = {
            method: 'post',
            url: 'http://localhost:9001/user/getInfo',
            headers: { 
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data : data
        };
        axios(config).then(
            (response)=>{
                // console.log(JSON.stringify(response))
                setInfo(response.data)
            }
        )            
    }catch(err){
        console.log(err.message)
    }

  }, [])

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path=''>
          <Route path="/main" element={<Home info={info} setInfo={setInfo}/>}/>
          <Route path="/liveauction" element={<LiveAuction info={info} setInfo={setInfo}/>}/>
          <Route path="/auctionhist" element={<AuctionHist info={info} setInfo={setInfo}/>}/>
          <Route path="/bidhist" element={<BidHist info={info} setInfo={setInfo}/>}/>
        </Route>
        <Route path='/registration' element={<Registration/>}/>
        <Route path='/logout' element={<Logout/>}/>
        <Route path="*" element={<h1>Not found</h1>}/>
      </Routes>
    </div>
  );
}

export default App;
