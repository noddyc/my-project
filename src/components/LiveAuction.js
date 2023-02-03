import Navbar from "./Navbar";
import ProfileBox from "./ProfileBox";
import { useRef, useState, useEffect, useMemo } from "react";
import React from 'react';
import HomeInfo from "./HomeInfo";
import {useIsAuthenticated} from 'react-auth-kit';
import {NavLink, Outlet, useNavigate, useOutletContext} from 'react-router-dom'
import axios from 'axios';
import qs from 'qs';
import './LiveAuction.css'
import moment from 'moment-timezone'
import Modal from './Modal'
import ModalInfo from "./ModalInfo";
import LeftSideBar from "./LeftSideBar";
import InfoNavBar from "./InfoNavBar";
import { useTable, usePagination, useSortBy } from 'react-table'
import { COLUMNS } from './columns'


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

      <div className="border-4 border-orange-900 flex flex-row navbarSM:flex navbarSM:flex-col ">
            <LeftSideBar></LeftSideBar>
            <AuctionForm></AuctionForm>
      </div>
        <div className="flex flex-row navbarSM:flex navbarSM:flex-col">
            <LeftSideBar></LeftSideBar>
            <div className="body">
              <div className="displayOption">
                  <label htmlFor="cardbutton">Detailed Display: </label>
                  <input type="checkbox" id="cardbutton" 
                  onClick={(e)=>{
                    if(detail ==='false'){
                      setDetail('true');
                      console.log(detail)
                    }else{
                      setDetail('false');
                      console.log(detail)
                    }
                  }} value={detail}/>
                </div>
                 {
                 detail !=='false' ? display.map((d, index) => {
                 return (
                  <div className="card" key={index}>          
                      <div className="card-header">
                        <h3>{d.product_name}</h3>
                        <p>{d.product_description} {d.product_description} {d.product_description} {d.product_description} {d.product_description} {d.product_description} </p>
                      </div>

                      <div className="card-img">
                          <img src={require('../assets/card-img.jpeg')} alt="" />
                      </div>

                    <div className="card-details">
                        <div className="price">
                          <p>Total Price:{'\u00A0'}{'\u00A0'}</p>
                          <strong>${d.product_price}</strong>
                        </div>

                        <div className="time">
                          <p><span>Start time: {'\u00A0'}{'\u00A0'}</span>{moment(d.start_time).tz(Intl.DateTimeFormat().resolvedOptions().timeZone).format('MM/DD/YYYY HH:mm:ss')}</p>
                          <p><span>End time: {'\u00A0'}{'\u00A0'}</span>{moment(d.end_time).tz(Intl.DateTimeFormat().resolvedOptions().timeZone).format('MM/DD/YYYY HH:mm:ss')}</p>
                        </div>

                        <div className="card-footer">
                          <button onClick={() => {
                              setInd(index);
                              setIsOpen(true);
                          }}>Join Now</button>
                        </div>
                    </div>
                  </div> )}) :(
                                  <div>
                                  <table {...getTableProps()}>
                                  <thead>
                                    {headerGroups.map(headerGroup => (
                                      <tr {...headerGroup.getHeaderGroupProps()}>
                                        {headerGroup.headers.map(column => (
                                          <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                              {column.render('Header')}
                                              <span>
                                              {column.isSorted
                                                ? column.isSortedDesc
                                                  ? <i className="material-icons">arrow_downward</i>
                                                  : <i className="material-icons">arrow_upward</i>
                                                : ''}
                                              </span>
                                              </th>
                                        ))}
                                      </tr>
                                    ))}
                                  </thead>
                                  <tbody {...getTableBodyProps()}>
                                    {page.map(row => {
                                      prepareRow(row)
                                      return (
                                        <tr {...row.getRowProps()}>
                                          {row.cells.map(cell => {
                                            return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                          })}
                                          <td><button style={{textDecoration:"underline", marginLeft:'1rem'}} onClick={() => {
                                                setInd(display[row.id]);
                                                setIsOpen(true);
                                              }}>detail</button></td>
                                        </tr>
                                      )
                                    })}
                                  </tbody>
                                </table>
                                <div>
                                  <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                                    {'<<'}
                                  </button>{' '}
                                  <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                                    Previous
                                  </button>{' '}
                                  <button onClick={() => nextPage()} disabled={!canNextPage}>
                                    Next
                                  </button>{' '}
                                  <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                                    {'>>'}
                                  </button>{' '}
                                  <span>
                                    Page{' '}
                                    <strong>
                                      {pageIndex + 1} of {pageOptions.length}
                                    </strong>{' '}
                                  </span>
                                  <span>
                                    | Go to page:{' '}
                                    <input
                                      type='number'
                                      defaultValue={pageIndex + 1}
                                      onChange={e => {
                                        const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0
                                        gotoPage(pageNumber)
                                      }}
                                      style={{ width: '50px' }}
                                    />
                                  </span>{' '}
                                  <select
                                    value={pageSize}
                                    onChange={e => setPageSize(Number(e.target.value))}>
                                    {[10, 25, 50].map(pageSize => (
                                      <option key={pageSize} value={pageSize}>
                                        Show {pageSize}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                </div>

                  )
                  
                  }
            </div>  
            <InfoNavBar info={props.info} toggleInfo={props.toggleInfo} setToggleInfo={props.setToggleInfo}></InfoNavBar>
            <Modal open={isOpen} onClose={() => setIsOpen(false)} d={ind}>
            </Modal>
        </div>
    </div>
    );
}

export default LiveAuction;