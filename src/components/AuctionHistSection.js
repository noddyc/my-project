import Navbar from "./Navbar";
import ProfileBox from "./ProfileBox";
import { useRef, useState, useEffect, useMemo } from "react";
import React from 'react';
import HomeInfo from "./HomeInfo";
import {useIsAuthenticated, useAuthUser} from 'react-auth-kit';
import {NavLink, Outlet, useNavigate, useOutletContext} from 'react-router-dom'
import axios from 'axios';
import qs from 'qs';
import moment from 'moment-timezone'
import AuctionHistModal from './AuctionHistModal'
import { useTable, usePagination, useSortBy,useFilters, useGlobalFilter } from 'react-table'
import { COLUMNS } from './auctionhistcolumns'
import { GlobalFilter } from './GlobalFilter'
import { ColumnFilter } from './ColumnFilter'

function BidHistSection(props) {
    const auth = useAuthUser();
    const isAuthenticated = useIsAuthenticated();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false)
    const [display, setDisplay] = useState([]);
    const [ind, setInd] = useState({});
    const [detail, setDetail] = useState("true");
    const [sortDir, setSortDir] = useState(1);
    const [detectChange, setDetectChange] = useState(false);
    

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
            let data = qs.stringify({
                'statues': ['CLOSED','CANCELED','COMPLETED','IN_PROGRESS'],
                'ownerId': auth().id,
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
                let arr = [];
                data.forEach((e, index)=>{
                    console.log(e)
                    arr.push(e)
                })
                // console.log(arr);
                setDisplay(arr)
                setMOCK_DATA(arr);
              })
        }catch(err){
            console.log([err.message])
        }
    }, [])

    const columns = useMemo(() => COLUMNS, [])
    const data = useMemo(() => MOCK_DATA, [MOCK_DATA])


    const defaultColumn = React.useMemo(
        () => ({
        Filter: ColumnFilter
        }),
        []
    )
  
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
      setGlobalFilter,
      gotoPage,
      pageCount,
      setPageSize,
      prepareRow
    } = useTable(
      {
        columns,
        data,
        defaultColumn,
        initialState: { pageIndex: 0 }
      },
      useFilters,
      useGlobalFilter,
      useSortBy,
      usePagination,
    )
  
    const { globalFilter } = state
    const { pageIndex, pageSize } = state

    return (
            <div className=' w-full h-[90%] bg-white gap-2 flex flex-col justify-center items-start ml-40 mt-10 mb-10 relative  navbarSM:w-full navbarSM:pl-0 navbarSM:pr-0 navbarSM:ml-0'>
                <div className="mb-8 mt-2 ml-2 absolute top-0"><h1 className="font-bold text-5xl">Auction History</h1></div>
                <div className="mb-8 mt-2 ml-2 absolute top-16 navbarSM:hidden">
                    <label htmlFor="cardbutton">Table Display: </label>
                    <input type="checkbox" id="cardbutton" 
                    onClick={(e)=>{
                        if(detail ==='true'){
                        setDetail('false');
                        }else{
                        setDetail('true');

                        }
                    }} value={detail}/>
                </div>

                <div className="flex-row justify-center items-center ml-2 absolute top-32" style={{display : detail !=='false'?"none":""}}>
                  <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter}/>
                </div>

                <div className=" self-center absolute top-44" style={{display : detail !=='false'?"none":""}}>
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
                        className="border-2 border-inputColor"
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


                <div className="flex flex-row flex-wrap overflow-scroll gap-12 w-full pl-16 mt-16 pr-16  absolute top-16">
                {
                 detail !=='false' ? display.map((d, index) => {
                 return (
                  <div className={`border-2 border-inputColor flex flex-col items-start p-0
                  isolate w-[300px] gap-4 rounded-lg ${d.status==='COMPLETED'?"bg-green-100":""} ${d.status==='CANCELED' || d.status==="CLOSED" ?"bg-red-100":""}`} key={index} >          
                      <div className=" flex flex-col  w-[300px] h-8  pl-2 items-center justify-center overflow-scroll">
                        <h3>{d.product_name}</h3>
                      </div>

                      <div className="max-w-[300px] max-h-[188px] overflow-hidden">
                          <img className="object-center" src={require('../assets/card-img.jpeg')} alt="" />
                      </div>


                      <div className="w-[300px] h-20 not-italic font-normal text-sm leading-5 tracking-[0.25px] 
                      overflow-scroll text-roboto pl-2 pr-2">
                        <p>{d.product_description} {d.product_description} {d.product_description} 
                        {d.product_description} {d.product_description} {d.product_description} 
                        {d.product_description} {d.product_description} {d.product_description}
                        {d.product_description} {d.product_description} {d.product_description}
                        {d.product_description} {d.product_description} {d.product_description}
                        {d.product_description} {d.product_description} {d.product_description}
                        {d.product_description} {d.product_description} {d.product_description}
                        </p>
                      </div>
                      
                      <div className=" flex flex-col  w-[300px] h-8 pl-2">
                            <p>Total Price{'\u00A0'}{'\u00A0'}</p>
                            <strong>${d.product_price}</strong>
                     </div>

                     <div className=" flex flex-col  w-[300px] h-4 pl-2">
                        <p><span>End time: {'\u00A0'}{'\u00A0'}</span><strong>{moment(d.end_time).clone().tz(props.info.timezone).format('MM/DD/YYYY HH:mm:ss')}</strong></p>     
                     </div>

                     <div className=" flex flex-col  w-[300px] h-4 pl-2 ">
                        <p><span>Winning number: {'\u00A0'}{'\u00A0'}</span>{d.winnning_number===null?"-":d.winnning_number}</p>     
                     </div>

                     <div className=" flex flex-col  w-[300px] h-4 pl-2 ">
                        <p><span>Slot open: {'\u00A0'}{'\u00A0'}</span>{d.slotsOpen}</p>     
                     </div>

                     <div className=" flex flex-col  w-[300px] h-4 pl-2 ">
                        <p><span>Status: {'\u00A0'}{'\u00A0'}</span>{d.status}</p>     
                     </div>


                     <div className="flex flex-row justify-center items-center gap-2 w-[300px] h-8 p-0 mb-4">
                        <button className="flex flex-col justify-center items-center p-4 w-40 h-8 bg-buttonColor text-white rounded-lg"
                        onClick={() => {  
                  
                                setInd({original: {...d}});
                                setIsOpen(true);
                                console.log(ind)
                            }}>Detail</button>
                    </div>
                  </div> )}) : (
                            <div className="self-center flex flex-col justify-center items-center mt-24">
                                <table {...getTableProps() }
                                   className="flex flex-col items-start w-11/12">
                                  <thead className="">
                                    {headerGroups.map(headerGroup => (
                                      <tr {...headerGroup.getHeaderGroupProps()}
                                      className="">
                                        {headerGroup.headers.map(column => (
                                          <th className="max-w-[200px] min-w-[200px] border p-2 border-solid max-h-10 min-h-10 " 
                                        
                                          {...column.getHeaderProps(column.getSortByToggleProps())}>
                                              {column.render('Header')} 
                                              <span>
                                              {column.isSorted
                                                ? column.isSortedDesc
                                                  ? <i className="material-icons" style={{display:"inline", fontSize:"0.75rem"}}>arrow_downward</i>
                                                  : <i className="material-icons" style={{display:"inline", fontSize:"0.75rem"}}>arrow_upward</i>
                                                : ''}
                                              </span>
                                              </th>
                                        ))}
                                      </tr>
                                    ))}
                                  </thead>
                                  <tbody className="" {...getTableBodyProps()}>
                                    {page.map((row,index) => {
                                      console.log(index)
                                      prepareRow(row)
                                      return (
                                        <tr {...row.getRowProps()}>
                                          {row.cells.map(cell => {
                                            return <td className={`max-w-[200px] min-w-[200px] max-h-[30px] min-h-[30px] border p-2 border-solid ${index%2===0?"":"bg-yellow-100"}`}
                                             {...cell.getCellProps()}><div className="max-w-[200px] min-w-[200px] max-h-[30px] min-h-[30px] overflow-scroll break-normal">{cell.render('Cell')}</div>
                                            </td>
                                          })}
                                          <td className={`max-w-[200px] min-w-[200px] max-h-[30px] min-h-[30px] border p-2 border-solid ${index%2===0?"":"bg-yellow-100"}`}>
                                            <div className="max-w-[200px] min-w-[200px] max-h-[30px] min-h-[30px] overflow-scroll break-normal">
                                            <button style={{textDecoration:"underline", marginLeft:'1rem'}} onClick={() => {
                                                setInd(row);
                                                console.log(ind)
                                                setIsOpen(true);
                                              }}>detail</button>
                                              </div></td>
                                        </tr>
                                      )
                                    })}
                                  </tbody>
                                </table>
                            </div>
                  )
                }
                </div>
                <AuctionHistModal open={isOpen} onClose={() => setIsOpen(false)} d={ind} setDetectChange={setDetectChange}></AuctionHistModal>
            </div>
    );
}
export default BidHistSection;