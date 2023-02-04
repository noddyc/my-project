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
import { useTable, usePagination, useSortBy,useFilters, useGlobalFilter } from 'react-table'
import { COLUMNS } from './columns'
import { GlobalFilter } from './GlobalFilter'
import { ColumnFilter } from './ColumnFilter'

function LiveAuctionSection(props) {
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
        <div className=' border-2 border-green-900 h-screen w-full flex-col items-center justify-center bg-formColor relative'>
            {/* <div className='border-2 border-inputColor w-10/12 bg-white
            flex flex-col items-start p-8 h-5/6 gap-2 
            absolute left-20 top-16 '> */}
            <div className='border-2 border-inputColor w-10/12 bg-white
            flex flex-col items-start p-8 h-5/6 gap-2 
             '>
                <div className="mb-8">
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

                <div className="flex-row justify-center items-cente" style={{display : detail !=='false'?"none":""}}>
                <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} className="border-2 border-inputColor" />
                </div>
                <div className="flex-row justify-center items-center" style={{display : detail !=='false'?"none":""}}>
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


                <div className="flex flex-row flex-wrap overflow-scroll gap-12 w-full pl-16">
                {
                 detail !=='false' ? display.map((d, index) => {
                 return (
                  <div className="border-2 border-inputColor flex flex-col items-start p-0
                  isolate w-[300px] gap-4 rounded-lg" key={index} >          
                      <div className=" flex flex-col  w-[300px] h-8 items-center justify-center">
                        <h3>{d.product_name}</h3>
                      </div>

                      <div className="max-w-[300px] max-h-[188px] overflow-hidden">
                          <img className="object-center" src={require('../assets/card-img.jpeg')} alt="" />
                      </div>


                      <div className="w-[300px] h-20 not-italic font-normal text-sm leading-5 tracking-[0.25px] 
                      overflow-scroll text-roboto pl-2">
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

                     <div className=" flex flex-col  w-[300px] h-8 pl-2 mb-4">
                     <p><span>Start time: {'\u00A0'}{'\u00A0'}</span>{moment(d.start_time).tz(Intl.DateTimeFormat().resolvedOptions().timeZone).format('MM/DD/YYYY HH:mm:ss')}</p>
                        <p><span>End time: {'\u00A0'}{'\u00A0'}</span>{moment(d.end_time).tz(Intl.DateTimeFormat().resolvedOptions().timeZone).format('MM/DD/YYYY HH:mm:ss')}</p>     
                     </div>

                     <div className="flex flex-row justify-center items-center gap-2 w-[300px] h-8 p-0 mb-4">
                        <button className="flex flex-col justify-center items-center p-4 w-40 h-8 bg-buttonColor text-white rounded-lg"
                        onClick={() => {
                                setInd(index);
                                setIsOpen(true);
                            }}>Join Now</button>
                    </div>

                     
            
                  </div> )}) : (
                            <div className="h-full w-full flex flex-col items-start pt-4 pl-4">
                                <table {...getTableProps() }
                                   className="flex flex-col items-start h-[758px] p-0 mb-8">
                                  <thead className="">
                                    {headerGroups.map(headerGroup => (
                                      <tr {...headerGroup.getHeaderGroupProps()}
                                      className="">
                                        {headerGroup.headers.map(column => (
                                          <th className="max-w-[200px] min-w-[200px] border p-2 border-solid h-10 leading-10" 
                                        
                                          {...column.getHeaderProps(column.getSortByToggleProps())}>
                                              {column.render('Header')} 
                                              {/* <div>{column.canFilter ? column.render('Filter') : null}</div> */}
                                              <span>
                                              {column.isSorted
                                                ? column.isSortedDesc
                                                  ? <i className="material-icons" style={{display:"inline"}}>arrow_downward</i>
                                                  : <i className="material-icons" style={{display:"inline"}}>arrow_upward</i>
                                                : ''}
                                              </span>
                                              </th>
                                        ))}
                                      </tr>
                                    ))}
                                  </thead>
                                  <tbody className="" {...getTableBodyProps()}>
                                    {page.map(row => {
                                      prepareRow(row)
                                      return (
                                        <tr {...row.getRowProps()}>
                                          {row.cells.map(cell => {
                                            return <td className="max-w-[200px] min-w-[200px] max-h-[50px] min-h-[50px] border p-2 border-solid"
                                             {...cell.getCellProps()}><div className="max-w-[200px] min-w-[200px] max-h-[50px] min-h-[50px] overflow-scroll break-normal">{cell.render('Cell')}</div>
                                            </td>
                                          })}
                                          <td className="max-w-[200px] min-w-[200px] max-h-[50px] min-h-[50px] border p-2 border-solid">
                                            <div className="max-w-[200px] min-w-[200px] max-h-[50px] min-h-[50px] overflow-scroll break-normal">
                                            <button style={{textDecoration:"underline", marginLeft:'1rem'}} onClick={() => {
                                                setInd(display[row.id]);
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
            </div>
        </div>
    );
}
export default LiveAuctionSection;