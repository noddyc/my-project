import ProfileBox from "./ProfileBox";
import Navbar from "./Navbar";
import {useIsAuthenticated} from 'react-auth-kit';
import {NavLink, Outlet, useNavigate, useOutletContext} from 'react-router-dom'
import { useEffect, useState } from "react";
import LeftSideBar from "./LeftSideBar";
import InfoNavBar from "./InfoNavBar";
import axios from 'axios';
import qs from 'qs';
import moment from 'moment';
import Modal from "./Modal"

const BidHist = (props)=>{
    const [isOpen, setIsOpen] = useState(false)
    const [display, setDisplay] = useState([]);
    const [ind, setInd] = useState(0);
    const [detail, setDetail] = useState("false");

    const isAuthenticated = useIsAuthenticated();
    const navigate = useNavigate();
    const obj = useOutletContext();

    useEffect(()=>{
      if(!isAuthenticated()){
          navigate('/')
      }
    },[])


    useEffect(()=>{
        let data = qs.stringify({
            'userId': '3' 
          });
        let config = {
        method: 'post',
        url: 'http://localhost:9001/bid/displayBid',
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded', 
        },
        data : data
        };
        axios(config).then((response)=>{
            setDisplay(response.data);
        })     
    }, [])

    function d(){
        let computedArr = display.map((d,index)=>{
          return <li key={index} style={{marginBottom:"10px", 
          border:"1px solid black", padding:"10px", cursor:"pointer",
          borderRadius: '10px'}} onClick={() => {
            setInd(index);
            setIsOpen(true);
        }}>
            {d['Auction'].product_name}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}
            {moment(d['Auction'].start_time).format('MM/DD/YYYY HH:mm:ss')}{'\u00A0'}-
            {'\u00A0'}{moment(d['Auction'].end_time).format('MM/DD/YYYY HH:mm:ss')}{'\u00A0'}
            ${d['Auction'].product_price}
            </li>
        })
        return <ul style={{margin:'100px'}}>{computedArr}</ul>;
      }

    return (
        <div>        
          <Navbar toggleInfo={props.toggleInfo} setToggleInfo={props.setToggleInfo}></Navbar>
              <div className="flex flex-row navbarSM:flex navbarSM:flex-col">
                <LeftSideBar></LeftSideBar>


                  <div className="body">
                      <div className="displayOption">
                        <label htmlFor="cardbutton">Detailed Display: </label>
                        <input type="checkbox" id="cardbutton" 
                        onClick={(e)=>{
                          if(detail ==='false'){
                            setDetail('true');
                          }else{
                            setDetail('false');
                          }
                        }} value={detail}/>
                      </div>
                      {
                      detail !=='false' ? display.map((d, index) => {
                      return (
                        <div className="card" key={index}>          
                            <div className="card-header">
                              <h3>{d['Auction'].product_name}</h3>
                              <p>{d['Auction'].product_description} {d['Auction'].product_description} {d['Auction'].product_description} 
                              {d['Auction'].product_description} {d['Auction'].product_description} {d['Auction'].product_description} </p>
                              <h3>jello</h3>
                            </div>
      
                            <div className="card-img">
                                <img src={require('../assets/card-img.jpeg')} alt="" />
                            </div>
      
                          <div className="card-details">
                              <div className="price">
                                <p>Bid Price:{'\u00A0'}{'\u00A0'}</p>
                                <strong>${Math.round(d['Auction'].product_price/10*100)/100}</strong>
                              </div>

                              <div className="time">
                                  <p><span>Start time:{'\u00A0'}{'\u00A0'}</span>{moment(d['Auction'].start_time).format('MM/DD/YYYY HH:mm:ss')}</p>
                                  <p><span>End time:{'\u00A0'}{'\u00A0'}</span>{moment(d['Auction'].end_time).format('MM/DD/YYYY HH:mm:ss')}</p>
                              </div>


                              <div className="slot">
                                  <p><span>Slot picked:{'\u00A0'}{'\u00A0'}</span> {d.slot_number}</p>
                              </div>

                              <div className="status">
                                  <p><span>Status:{'\u00A0'}{'\u00A0'}</span>{d['Auction'].status}</p>
                              </div>          

                              <div className="winningNumber">
                                  {d['Auction']['Winning_Number'] === null ?
                                  <p><span>Winning Number:{'\u00A0'}{'\u00A0'}</span>-</p>:
                                  <p><span>Winning Number:{'\u00A0'}{'\u00A0'}</span>{d['Auction']['Winning_Number'].number}</p>
                                  }
                              </div>
      
                              <div className="card-footer">
                                <button onClick={() => {
                                    setInd(index);
                                    setIsOpen(true);
                                }}>Join Now</button>
                              </div>
                          </div>
                        </div> )}
                        
                        ) : d()
                        
                        }
                  </div>  
                  <InfoNavBar info={props.info} toggleInfo={props.toggleInfo} setToggleInfo={props.setToggleInfo}></InfoNavBar>
                  {/* <Modal open={isOpen} onClose={() => setIsOpen(false)} d={display[ind]}
                                // product_name={d.product_name} product_description={d.product_description}
                                // product_price={d.product_price/10} start_time={d.start_time}
                                // end_time={d.end_time} slots={[d.slot_0, d.slot_1, d.slot_2, d.slot_3
                                // , d.slot_4, d.slot_5, d.slot_6, d.slot_7, d.slot_8, d.slot_9]}
                                // auctionId={d}
                                >
                  </Modal> */}
              </div>
        </div>
        );
}

export default BidHist;