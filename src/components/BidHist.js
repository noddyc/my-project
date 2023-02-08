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
import BidHistSection from "./BidHistSection";


const BidHist = (props)=>{  
    return (
    <div className="h-screen relative">
      <Navbar toggleInfo={props.toggleInfo} setToggleInfo={props.setToggleInfo}></Navbar>
      <div className="flex flex-row h-[calc(100%-80px)] navbarSM:flex navbarSM:flex-col">
            <LeftSideBar></LeftSideBar>
            <BidHistSection info={props.info}></BidHistSection>
      </div>
      <InfoNavBar info={props.info} toggleInfo={props.toggleInfo} setToggleInfo={props.setToggleInfo}></InfoNavBar>
    </div>
    );
}

export default BidHist;