import {useState, useEffect, useMemo } from "react";
import React from 'react';
import {useIsAuthenticated, useAuthUser} from 'react-auth-kit';
import {useNavigate} from 'react-router-dom'
import axios from 'axios';
import qs from 'qs';
import moment from 'moment-timezone'
import BidModal from './BidModal'
import { useTable, usePagination, useSortBy,useFilters, useGlobalFilter } from 'react-table'
import { COLUMNS } from './bidcolumns'
import { GlobalFilter } from '../Utils/GlobalFilter'
import { ColumnFilter } from '../Utils/ColumnFilter'
import {ip} from '../Utils/ip'
import {debounce} from 'lodash'

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

    const [imgPos, setImgPos] = useState([]);

    const [img, setImg] = useState(null);
    
    

    const [MOCK_DATA, setMOCK_DATA] = useState([])

    const [keyword, setKeyWord] = useState("");

    const keywordHandler = debounce((e)=>{
      setKeyWord(e.target.value)
    }, 500)

    const statusConversion = (status, winning)=>{
      if(status === "OPEN_LIVE"){
        return "OPEN LIVE"
      }
      if(status === "OPEN_NOT_LIVE"){
        return "OPEN NOT LIVE"
      }
      if(status === "WAITING_FOR_DRAW"){
        return "WAITING FOR DRAW";
      }
      if(status === "NO_WINNER_WINNER_NOTIFIED"){
        return "WINNING NUMBER POSTED"
      }
    }

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
            let auctionId = [];
            let data = qs.stringify({
                'userId': auth().id });
              let config = {
                method: 'post',
                url: `${ip}/bid/displayBid`,
                headers: { 
                  'Content-Type': 'application/x-www-form-urlencoded', 
                },
                data : data
              };
              axios(config)
              .then((response) => {
                let data = response.data;

                data.forEach((e)=>{
                  auctionId.push(e.auctionId);
                })

                auctionId = auctionId.filter((value, index, self)=>{
                  return self.indexOf(value) === index;
                })
                console.log(auctionId)

                let arr = [];
                data.forEach((e, index)=>{
                    // console.log(e.Auction)
                    arr.push({id: e.id, userId:e.userId, slot_number:e.slot_number,
                    auctionId: e.auctionId, end_time: e.Auction['end_time'],
                    product_description: e.Auction['product_description'],
                    product_name: e.Auction['product_name'],
                    product_price: e.Auction['product_price'], 
                    slotsOpen: e.Auction['slotsOpen'],
                    status: e.Auction['status'],
                    onwerId: e.Auction['ownerId'],
                    winning_number: e.Auction['winnning_number']===null?"-":e.Auction['winnning_number']})
                })
                // console.log(arr);
                setDisplay(arr)
                setMOCK_DATA(arr);
                setImgPos(new Array(arr.length).fill(0));
              })
              .then((response)=>{
                let data = qs.stringify({
                  'auctionId': auctionId
                }, {arrayFormat:`indices`});

                let config = {
                  method: 'post',
                  url: 'http://localhost:9001/auction/getImage',
                  headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded'
                  },
                  data : data
                };
                
                axios(config)
                .then((response) => {
                  const myMap = new Map();
                  response.data.forEach(
                    (e)=>{
                      console.log(e)
                      let key = e.auctionId;
                      if(!myMap.has(key)){
                        let arr = [];

                        const base64Image = btoa(
                          new Uint8Array(e.imgData.data).reduce(
                            (data, byte) => data + String.fromCharCode(byte),
                            ''
                          )
                        );

                        arr.push(base64Image)
                        myMap.set(key, arr)
                      }else{
                        let arr = myMap.get(key);

                        const base64Image = btoa(
                          new Uint8Array(e.imgData.data).reduce(
                            (data, byte) => data + String.fromCharCode(byte),
                            ''
                          )
                        );
              
                        arr.push(base64Image)
                      }
                    }
                  )
                  setImg(myMap);
                  // console.log(myMap)
                })
                .catch((error) => {
                  console.log(error);
                });
              })
        }catch(err){
            console.log([err.message])
        }
    }, [detectChange, keyword])

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
            <div className=' w-full h-[90%] bg-white gap-2 flex flex-col justify-center items-start ml-40 mt-10 mb-10 relative font-inter font-light  
            navbarSM:w-full navbarSM:pl-0 navbarSM:pr-0 navbarSM:ml-0'>
                <div className="mb-8 mt-2 ml-2 absolute top-0"><h1 className="font-bold text-5xl">Selection History</h1></div>
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


                <div className={`mt-2 ml-2 absolute top-24 gap-2 ${detail==='true'?'flex':'hidden'} navbarSM:${detail==='true'?'flex':'hidden'}`}>
                  <label>Search: </label>
                  <input className="border-2 border-inputColor" placeholder="Enter keyword" onChange={keywordHandler}></input>
                </div>


                <div className="flex flex-row flex-wrap overflow-scroll gap-12 w-full pl-16 mt-16 pr-16 absolute top-24">
                {
                 detail !=='false' ? display.map((d, index) => {
                  console.log(d)
                 return (
                  <div className={`border-4 border-cardBorderColor flex flex-col items-start p-0
                  isolate w-[300px] gap-4 rounded-lg  ${d.status==="OPEN_NOT_LIVE" || d.status==="OPEN_LIVE"  ?"bg-green-100":""} ${d.status==="NO_WINNER_WINNER_NOTIFIED" || d.status==="WAITING_FOR_DRAW" ?"bg-red-100":""}`} key={index} >          
                      <div className=" flex flex-col  w-[300px] h-8  pl-2 items-center justify-center overflow-scroll">
                        <h3>{d.product_name}</h3>
                      </div>

                      <div className="max-w-[300px] max-h-[188px] overflow-hidden relative">
                          <button className="z-50 absolute top-[80px] left-0 border-inputColor border-y-2 border-r-2 bg-inputColor w-4 h-12 rounded-r opacity-70 hover:w-6"
                          onClick={(e)=>{
                            const updatedItems = [...imgPos];
                            const newImgPos = updatedItems[index]-1;
                            if(newImgPos < 0){
                              updatedItems[index] = img.has(d.auctionId)?img.get(d.auctionId).length:3;
                              setImgPos(updatedItems);
                              return;
                            }
                            updatedItems[index] = newImgPos;
                            setImgPos(updatedItems);
                          }}>
                              <i className="material-icons text-base">arrow_back_ios</i>
                          </button>
                          {d.auctionId && img  &&  img.has(d.auctionId) && <img className=" min-w-[290px] min-h-[188px] object-center" 
                          src={`data:image;base64,${img.get(d.auctionId)[imgPos[index]]}`} alt="image"></img> }
                          {d.auctionId && img && !img.has(d.auctionId) && <img className=" min-w-[290px] min-h-[188px] object-center" src={require(`../../assets/card-img${imgPos[index]}.jpeg`)} alt="" />}
                          <button className="z-50 absolute top-[80px] right-0 border-inputColor border-y-2 border-l-2 bg-inputColor w-4 h-12 rounded-l opacity-70 hover:w-6"
                          onClick={(e)=>{
                            const updatedItems = [...imgPos];
                            const newImgPos = updatedItems[index]+1;
                            if(newImgPos > (img.has(d.auctionId)?img.get(d.auctionId).length-1:3)){
                              updatedItems[index] = 0;
                              setImgPos(updatedItems);
                              return;
                            }
                            updatedItems[index] = newImgPos;
                            setImgPos(updatedItems);
                          }}>
                              <i className="material-icons text-base">arrow_forward_ios</i>
                          </button>
                      </div>


                      <div className="w-[300px] h-20 not-italic font-normal text-sm leading-5 tracking-[0.25px] 
                      overflow-scroll text-roboto pl-8 pr-8 break-all">
                        <p>{d.product_description} {d.product_description} {d.product_description} 
                        {d.product_description} {d.product_description} {d.product_description} 
                        {d.product_description} {d.product_description} {d.product_description}
                        {d.product_description} {d.product_description} {d.product_description}
                        {d.product_description} {d.product_description} {d.product_description}
                        {d.product_description} {d.product_description} {d.product_description}
                        {d.product_description} {d.product_description} {d.product_description}
                        </p>
                      </div>
                      
                      <div className=" flex flex-col  w-[300px] h-4 pl-2">
                            <p>Total Price:{'\u00A0'}{'\u00A0'}<strong>${Math.round(d.product_price)}</strong></p>
                     </div>

                     <div className=" flex flex-col  w-[300px] h-4 pl-2">
                        <p><span>End time: {'\u00A0'}{'\u00A0'}</span>{(moment(d.end_time).clone().tz(props.info.timezone))!==undefined? (moment(d.end_time).clone().tz(props.info.timezone)).format("YYYY-MM-DD HH:mm:ss"):""}</p>     

              
                     </div>

                     <div className=" flex flex-col  w-[300px] h-4 pl-2">
                        <p><span>Owner: {'\u00A0'}{'\u00A0'}</span>{d.onwerId}</p>     
                     </div>


                     <div className=" flex flex-col  w-[300px] h-4 pl-2 ">
                        <p><span>Slot picked: {'\u00A0'}{'\u00A0'}</span>{d.slot_number}</p>     
                     </div>

                     <div className=" flex flex-col  w-[300px] h-4 pl-2 ">
                        <p><span>Winning number: {'\u00A0'}{'\u00A0'}</span>{d.winning_number}</p>     
                     </div>

                     {/* <div className=" flex flex-col  w-[300px] h-4 pl-2 ">
                        <p><span>Slot open: {'\u00A0'}{'\u00A0'}</span>{d.slotsOpen}</p>     
                     </div> */}

                     <div className=" flex flex-col  w-[300px] h-4 pl-2 ">
                        <p><span>Status: {'\u00A0'}{'\u00A0'}</span>{statusConversion(d.status)}</p>     
                     </div>


                     <div className="flex flex-row justify-center items-center gap-2 w-[300px] h-8 p-0 mb-4">
                        <button className="flex flex-col justify-center items-center p-4 w-40 h-8 bg-buttonColor text-white rounded-lg"
                        onClick={() => {  
                  
                                setInd({original: {...d}});
                                setIsOpen(true);
                                // console.log(ind)
                            }}>Detail</button>
                    </div>
                  </div> )}) : (
                            <div className="self-center flex flex-col justify-center items-center  mt-24 mb-32">
                                <div className="flex-row justify-center items-center ml-2 absolute top-0 left-0" style={{display : detail !=='false'?"none":""}}>
                                  <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter}/>
                                </div>

                                <div id="buttonNot" className="flex-row justify-center items-center ml-2 absolute top-16" style={{display : detail !=='false'?"none":""}}>
                                    <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                                        {'<<'}
                                    </button>{' '}
                                    <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                                        Previous
                                    </button>{' '}
                                    <button onClick={() => {console.log("hello I clicked");
                                      nextPage()}} disabled={!canNextPage}>
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
                                <table {...getTableProps() }
                                   className="flex flex-col items-start w-11/12 mt-8">
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
                                                // console.log(ind)
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
                <BidModal  open={isOpen} onClose={() => setIsOpen(false)} socket={props.socket} d={ind} setDetectChange={setDetectChange} info={props.info}></BidModal>
            </div>
    );
}
export default BidHistSection;