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
import _ from 'lodash'
import BHTableLg from "./BHTableLg";

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

    const statusConversion = (status)=>{
      if(status === "OPEN_LIVE"){
        return "Open Live"
      }else if(status === "OPEN_NOT_LIVE"){
        return "Open Not Live"
      }else if(status === "NO_WINNER_WINNER_NOTIFIED"){
        return "WinNum Posted"
      }else if(status === "WAITING_FOR_DRAW"){
        return "Wait For DRAW"
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
                console.log("line 96");
                console.log(data)
                data.forEach((e)=>{
                  auctionId.push(e.auctionId);
                })

                auctionId = auctionId.filter((value, index, self)=>{
                  return self.indexOf(value) === index;
                })
                // console.log(auctionId)

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
                  url: `${ip}/auction/getImage`,
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
                      // console.log(e)
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


    useEffect(()=>{
      // console.log("this is navbar")
      props.socket.off("increaseNotifyCount").on("increaseNotifyCount", (e)=>{
          console.log("line 186")
          props.setNotifications((prev)=>[...prev, e])
          localStorage.setItem('count', props.notifiCount);
          setTimeout(()=>{
            setDetectChange((prev)=> !prev)
          },1000)
        
      })
  }, [props.socket]);

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
            <div className='after-margin-200  overflow-scroll h-full flex flex-col mt-10 ml-[200px] relative font-inter font-light gap-6'>
                <div className="px-4 sm:px-0">
                  <h3 className="text-4xl font-inter font-bold">Selections</h3>
                </div>
                <div className="mt-5 px-4 text-2xl font-inter font-medium">
                    <label htmlFor="cardbutton">Table Display:{'\u00A0'}</label>
                    <input type="checkbox" id="cardbutton" 
                    onClick={(e)=>{
                        if(detail ==='true'){
                        setDetail('false');
                        }else{
                        setDetail('true');
                        }
                    }} value={detail}/>
                </div>

                <div className={`w-1/2  px-4 flex-row justify-center items-center ${detail==='true'?'flex':'hidden'} navbarSM:${detail==='true'?'flex':'hidden'}`}>
                    <label className="label">Search:{'\u00A0'}</label>
                    <input className="input" placeholder="Enter keyword" onChange={keywordHandler}></input>
                </div>

                <div className={`w-1/2  px-4 flex-row justify-center items-center ${detail==='false'?'flex':'hidden'} navbarSM:${detail==='false'?'flex':'hidden'}`}>
                    <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter}/>
                </div>


                <div className="flex flex-row flex-wrap overflow-scroll gap-12 px-4 w-full mt-5">
                {
                 detail !=='false' ? display.map((d, index) => {
                  // console.log(d)
                 return (
                  <div className={`border-1 border-black flex flex-col items-start
                  isolate w-[450px] rounded-2xl bg-cardBg hover:bg-cardHoverColor ${d.status==="OPEN_NOT_LIVE" || d.status==="OPEN_LIVE"  ?"bg-green-100":""} ${d.status==="NO_WINNER_WINNER_NOTIFIED" || d.status==="WAITING_FOR_DRAW" ?"bg-red-100":""}`} key={index} >          
       
                      <div className="max-w-[450px] max-h-[300px] overflow-hidden relative rounded ">
                          <button className="z-50 absolute top-[80px] left-0 border-inputColor border-y-2 border-r-2 bg-inputColor w-6 h-24 rounded-r-2xl opacity-70 hover:w-6"
                          onClick={(e)=>{
                            const updatedItems = [...imgPos];
                            const newImgPos = updatedItems[index]-1;
                            if(newImgPos < 0){
                              updatedItems[index] = img.has(d.id)?img.get(d.id).length:3;
                              setImgPos(updatedItems);
                              return;
                            }
                            updatedItems[index] = newImgPos;
                            setImgPos(updatedItems);
                          }}>
                              <i className="material-icons text-sm pl-1">arrow_back_ios</i>
                          </button>
                          {d.id && img  &&  img.has(d.id) && <img className=" min-w-[450px] min-h-[300px] object-center rounded-tl-2xl rounded-tr-2xl" 
                          src={`data:image;base64,${img.get(d.id)[imgPos[index]]}`} alt="image"></img> }
                          {d.id && img && !img.has(d.id) && <img className=" min-w-[450px] min-h-[300px] rounded-tl-2xl rounded-tr-2xl object-center" src={require(`../../assets/card-img${imgPos[index]}.jpeg`)} alt="" />}

                          <button className="z-50 absolute top-[80px] right-0 border-inputColor border-y-2 border-l-2 bg-inputColor w-6 h-24 rounded-l-2xl opacity-70 hover:w-6"
                          onClick={(e)=>{
                            const updatedItems = [...imgPos];
                            const newImgPos = updatedItems[index]+1;
                            if(newImgPos > (img.has(d.id)?img.get(d.id).length-1:3)){
                              updatedItems[index] = 0;
                              setImgPos(updatedItems);
                              return;
                            }
                            updatedItems[index] = newImgPos;
                            setImgPos(updatedItems);
                          }}>
                            <i className="material-icons text-sm">arrow_forward_ios</i>
                          </button>
                      </div>


                    <div className="w-full p-5">              
                        <div className="h-14 overflow-scroll mb-2">
                          <p className="font-inter font-bold text-xl">{_.startCase(d.product_name)} {'\u00A0'}
                          </p>
                        </div>

                        <div className="flex gap-6">
                            <div className="flex flex-col flex-grow">

                                <div className="font-inter mb-2">
                                  <span className="font-inter font-medium">Total Price</span>
                                  <p>{'\u00A0'}{'\u00A0'}$ {Math.round(d.product_price)}.00</p>    
                                </div>

                                <div className="font-inter mb-2">
                                  <span className="font-inter font-medium">End Time</span>
                                  <p>{'\u00A0'}{'\u00A0'}{(moment(d.end_time).clone().tz(props.info.timezone))!==undefined? (moment(d.end_time).clone().tz(props.info.timezone)).format("YYYY-MM-DD"):""}
                                  {'\u00A0'}({(moment(d?.end_time).clone().tz('UTC').format("HH:mm:ss")==="12:40:00"?'DAY':'NIGHT')})</p>    
                                </div>

                                <div className="font-inter mb-2">
                                  <span className="font-inter font-medium">Owner</span>
                                  <p>{'\u00A0'}{'\u00A0'}{d.onwerId}</p> 
                                </div>

                                <div className="font-inter mb-2">
                                  <span className="font-inter font-medium">Slot Picked</span>
                                  <p>{'\u00A0'}{'\u00A0'}{d.slot_number}</p> 
                                </div>


                                <div className="font-inter mb-2">
                                  <span className="font-inter font-medium">Winning Number</span>
                                  <p>{'\u00A0'}{'\u00A0'}{d.winning_number}</p> 
                                </div>

                                <div className="font-inter mb-2">
                                  <span className="font-inter font-medium">Status</span>
                                  <p>{'\u00A0'}{'\u00A0'}{statusConversion(d.status)}</p>
                                </div>
                            </div>

                            <div className="h-30 w-1/2">
                                <span className="font-inter font-medium">Description</span>
                                <div className="not-italic h-30 tracking-[0.25px] overflow-scroll break-all"><p>{_.capitalize(d.product_description +
                                  " I am from USA I am from USA I am from USA I am from USA I am from USA ")} </p></div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end items-center w-full mb-6 pr-6">
                      <button className={`button ${d.ownerId === auth().id ? "invisible":"" }`}
                      onClick={() => {  
                              setInd({original:{...display[index]}});
                              setIsOpen(true);
                        
                          }}><i className="material-icons inline">search</i><span>Detail</span></button>
                    </div>

                  </div> )}) : 
                        <>
                        <BHTableLg detail={detail} gotoPage={gotoPage} canPreviousPage={canPreviousPage} 
                        previousPage={previousPage} nextPage={nextPage} canNextPage={canNextPage} pageCount={pageCount}
                        pageIndex={pageIndex} pageOptions={pageOptions} pageSize={pageSize} 
                        setPageSize={setPageSize} getTableProps={getTableProps} headerGroups={headerGroups}
                        getTableBodyProps={getTableBodyProps} page={page} prepareRow={prepareRow}
                        setInd={setInd} setIsOpen={setIsOpen}></BHTableLg>
  
                        <div className="hidden navbarSM:flex navbarSM:flex-col">
                            {display.map((d, index)=>{
                              return (
                                <table className="mb-10 font-inter font-light text-xl">
                                <tbody>
                                  <tr>
                                    <td className="border-2 border-black text-center font-inter font-medium text-xl  px-2"><p>Name</p></td>
                                    <td className="border-2 border-black text-center">{_.startCase(d.product_name)}</td>
                                  </tr>
                                  <tr>
                                    <td className="border-2 border-black text-center font-inter font-medium text-xl  px-2"><p>Win Num</p></td>
                                    <td className="border-2 border-black  text-center">{d.winning_number===null?"-":d.winning_number}</td>
                                  </tr>
                                  <tr>
                                    <td className="border-2 border-black text-center font-inter font-medium text-xl  px-2"><p>End Time</p></td>
                                    <td className="border-2 border-black text-center">
                                      {(moment(d.end_time).clone().tz(props.info.timezone)) !== undefined ? 
                                      (moment(d.end_time).clone().tz(props.info.timezone)).format("YYYY-MM-DD ") : ""}
                                      ({moment(d?.end_time).clone().tz('UTC').format("HH:mm:ss") === "12:40:00" ? 'DAY' : 'NIGHT'})
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-2 border-black text-center font-inter font-medium text-xl  px-2"><p>Slot Picked</p></td>
                                    <td className="border-2 border-black text-center">{d.slot_number}</td>
                                  </tr>
                                  <tr>
                                    <td className="border-2 border-black text-center font-inter font-medium text-xl px-2"><p>Detail</p></td>
                                    <td className="border-2 border-black text-center w-[300px]"> 
                                    <button className={`${d.ownerId === auth().id ? "invisible":"" }`}
                                    onClick={() => {  
                                            setInd({original:{...display[index]}});
                                            setIsOpen(true);
                                      
                          }}><span className="underline">Detail</span></button>
                                  </td>
                                  </tr>
                                </tbody>
                              </table>
                              
                              )
                            })}
                        </div>
                    </>  
                }
                </div>
                <BidModal  open={isOpen} onClose={() => setIsOpen(false)} socket={props.socket} d={ind} setDetectChange={setDetectChange} info={props.info}></BidModal>
            </div>
    );
}
export default BidHistSection;