import Navbar from "./Navbar";
import ProfileBox from "./ProfileBox";
import { useRef, useState, useEffect, useMemo } from "react";
import React from 'react';
import HomeInfo from "./HomeInfo";
import {useIsAuthenticated} from 'react-auth-kit';
import {NavLink, Outlet, useNavigate, useOutletContext} from 'react-router-dom'
import axios from 'axios';
import qs from 'qs';
import moment from 'moment-timezone'
import Modal from './Modal'
import ModalInfo from "./ModalInfo";
import LeftSideBar from "./LeftSideBar";
import InfoNavBar from "./InfoNavBar";
import { useTable, usePagination, useSortBy } from 'react-table'
import { COLUMNS } from './columns'
import LiveAuctionSection from "./LiveAuctionSection";


const BUTTON_WRAPPER_STYLES = {
  position: 'relative',
  zIndex: 1
}

// let browserTimeZone = moment.tz(new Date(), new Date().getTimezoneOffset)
// console.log(browserTimeZone)

const LiveAuction = (props)=>{  
    const isAuthenticated = useIsAuthenticated();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false)
    const [display, setDisplay] = useState([]);
    const [ind, setInd] = useState({});
    const [detail, setDetail] = useState("false");
    const [sortDir, setSortDir] = useState(1);

    const [MOCK_DATA, setMOCK_DATA] = useState([])

    function d(){
      let computedArr = display.map((d,index)=>{
        return <li key={index} style={{marginBottom:"10px", 
        border:"1px solid black", padding:"10px", cursor:"pointer",
        borderRadius: '10px'}} onClick={() => {
          setInd(index);
          setIsOpen(true);
      }}>
          {d.product_name}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}
          {moment(d.start_time).format('MM/DD/YYYY HH:mm:ss')}{'\u00A0'}-
          {'\u00A0'}{moment(d.end_time).format('MM/DD/YYYY HH:mm:ss')}{'\u00A0'}
          ${d.product_price}
          </li>
      })
      return <ul style={{margin:'100px'}}>{computedArr}</ul>;
    }

    useEffect(()=>{
      if(!isAuthenticated()){
          navigate('/')
      }
    },[])

  
    useEffect(()=>{
        try{              
          // only display in progress auctions
            let data = qs.stringify({
                'statues': ['IN_PROGRESS'] 
              }, {arrayFormat:`indices`});
              let config = {
                method: 'post',
                url: 'http://localhost:9001/auction/displayAuction',
                headers: { 
                  'Content-Type': 'application/x-www-form-urlencoded', 
                },
                data : data
              };
              axios(config)
              .then((response) => {
                let data = response.data;
                setDisplay(data)
                let arr = [];
                data.forEach((e, index)=>{
                    arr.push({
                    id: index,
                    name:e.product_name,
                    auctioneer:e.ownerId,
                    closing_time: moment(e.end_time).format("YYYY/MM/DD-HH:MM:SS"),
                    price: e.product_price,
                    })
                })
                setMOCK_DATA(arr);
              })
        }catch(err){
            console.log([err.message])
        }
    }, [])

    const columns = useMemo(() => COLUMNS, [])
    const data = useMemo(() => MOCK_DATA, [MOCK_DATA])
  
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      footerGroups,
      rows,
      page,
      nextPage,
      previousPage,
      canPreviousPage,
      canNextPage,
      pageOptions,
      state,
      gotoPage,
      pageCount,
      setPageSize,
      prepareRow
    } = useTable(
      {
        columns,
        data,
        initialState: { pageIndex: 0 }
      },
      useSortBy,
      usePagination
    )
  
    const { pageIndex, pageSize } = state

    return (
    <div>
      <Navbar toggleInfo={props.toggleInfo} setToggleInfo={props.setToggleInfo}></Navbar>
        <div className="flex flex-row navbarSM:flex navbarSM:flex-col">
              {/* <LeftSideBar></LeftSideBar> */}
              <LiveAuctionSection></LiveAuctionSection>
        </div>

    </div>
    );
}

export default LiveAuction;