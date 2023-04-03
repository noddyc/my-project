import {useState, useEffect, useMemo } from "react";
import React from 'react';
import {useIsAuthenticated, useAuthUser} from 'react-auth-kit';
import { useNavigate} from 'react-router-dom'
import axios from 'axios';
import qs from 'qs';
import moment from 'moment-timezone'
import AuctionHistModal from './AuctionHistModal'
import { useTable, usePagination, useSortBy,useFilters, useGlobalFilter } from 'react-table'
import { COLUMNS } from './auctionhistcolumns'
import { GlobalFilter } from '../Utils/GlobalFilter'
import { ColumnFilter } from '../Utils/ColumnFilter'
import {ip} from '../Utils/ip'
import {debounce} from 'lodash'
import _ from 'lodash'
import AHTableLg from "./AHTableLg";
import { UTCToCentral } from "../Utils/time";

function AuctionHistSection(props) {
    const slotArr = ['slot0', 'slot1', 'slot2', 'slot3', 'slot4', 'slot5','slot6', 'slot7', 'slot8','slot9']
    const auth = useAuthUser();
    const isAuthenticated = useIsAuthenticated();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false)
    const [display, setDisplay] = useState([]);
    const [ind, setInd] = useState({});
    const [detail, setDetail] = useState("true");
    const [sortDir, setSortDir] = useState(1);
    const [detectChange, setDetectChange] = useState(false);

    ////
    ////

    const [MOCK_DATA, setMOCK_DATA] = useState([])


    const [keyword, setKeyWord] = useState("");

    const [productIndex, setProductIndex] = useState([]);
    const [imgIndex, setImgIndex] = useState([]);


    const imageLen = (d, index)=>{
      let len = 0;
      for(let i = 1; i <= 4; i++){
        if(d.Products[productIndex[index]][`image_${i}`] !== null){
          len++;
        }
      }
      return len;
    }


    const imageConversion = (d, index)=>{
      console.log(imgIndex)
      let imageData = d.Products[productIndex[index]][`image_${imgIndex[index]}`].data;
      const base64Image = btoa(
        new Uint8Array(imageData).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        )
      );

      return base64Image;
    }

    const totalPriceCalculator = (d) =>{
      let totalPrice = 0;
      for(let i = 0; i < 4; i++){
        if(d.Products[i]){
          totalPrice += d.Products[i].product_price;
        }
      }
      return totalPrice;
    }

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
        return "Wait For Draw"
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
            let arr = [];    
            let data = qs.stringify({
                'statues': ["OPEN_NOT_LIVE", "OPEN_LIVE", "WAITING_FOR_DRAW", "NO_WINNER_WINNER_NOTIFIED"],
                'ownerId': auth().id,
              }, {arrayFormat:`indices`});

              let config = {
                method: 'post',
                url: `${ip}/auction/displayAuction`,
                headers: { 
                  'Content-Type': 'application/x-www-form-urlencoded', 
                },
                data : data
              };
              axios(config)
              .then((response) => {
          
                let data = response.data;

                data.forEach((e)=>{
                  auctionId.push(e.id);
                })

                data.forEach((e, index)=>{
                    console.log(e)
                    arr.push(e)
                })
                // console.log(arr);
                // setDisplay(arr)
                // setMOCK_DATA(arr);
                setProductIndex(new Array(arr.length).fill(0));
                setImgIndex(new Array(arr.length).fill(1));
              })
              .then((response)=>{

                let data = qs.stringify({
                  'statues': ["OPEN_NOT_LIVE", "OPEN_LIVE", "WAITING_FOR_DRAW", "NO_WINNER_WINNER_NOTIFIED"],
                  'ownerId': auth().id,
                }, {arrayFormat:`indices`});
  
                let config = {
                  method: 'post',
                  url: `${ip}/auction/auctionWinNumber`,
                  headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded', 
                  },
                  data : data
                };

                axios(config)
                .then((response) => {
                  let arr1= response.data;
                  const mergedArr = _.merge(_.keyBy(arr1, 'id'), _.keyBy(arr, 'id'));
                  const result = Object.values(mergedArr);
                  setDisplay(result)
                  setMOCK_DATA(result)                                  
                })                
              }).then((response)=>{
                console.log(display);
                console.log(productIndex);
                console.log(imgIndex);
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
            <div className='after-margin-200 overflow-scroll h-full flex flex-col mt-10 ml-[200px] relative font-inter font-light gap-6  navbarSM:ml-[10px]'>

                <div className="px-4 sm:px-0">
                  <h3 className="text-4xl font-inter font-bold">GAME HISTORY</h3>
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

          
              <div className={`w-1/2  px-4 flex-row justify-center items-center ${detail==='true'?'flex':'hidden'} navbarSM:${detail==='true'?'flex':'hidden'} navbarSM:w-3/4`}>
                  <label className="label">Search:{'\u00A0'}</label>
                  <input className="input" placeholder="Enter keyword" onChange={keywordHandler}></input>
              </div>

              <div className={`w-1/2  px-4 flex-row justify-center items-center ${detail==='false'?'flex':'hidden'} navbarSM:${detail==='false'?'flex':'hidden'} navbarSM:w-3/4`}>
                  <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter}/>
              </div>

                <div className="flex flex-row flex-wrap  gap-12 px-4 w-full mt-5 navbarSM:justify-center">
                {
                 detail !=='false' ? display.map((d, index) => {
                 return (
                  <div className={ `border-1 border-black flex flex-col items-start isolate w-[450px] rounded-2xl bg-cardBg
                  hover:bg-cardHoverColor ${d.status==="OPEN_NOT_LIVE" || d.status==="OPEN_LIVE"? "bg-green-100":""} 
                  ${d.status==="WAITING_FOR_DRAW"? "bg-yellow-100":""}  ${d.status==="NO_WINNER_WINNER_NOTIFIED" ?"bg-red-100":""} navbarSM:w-[300px]`} key={index} >

                    <div className="max-w-[450px] max-h-[300px] overflow-hidden relative rounded navbarSM:max-w-[300px]  navbarSM:max-h-[200px]">
                        <button className="z-50 absolute top-[80px] left-0 border-inputColor border-y-2 border-r-2 bg-inputColor w-6 h-24 rounded-r-2xl opacity-70 hover:w-6"
                        onClick={(e)=>{
                          const len = imageLen(d, index);
                          if(imgIndex[index] > 1){
                            const newArray = [...imgIndex];
                            newArray[index] -= 1;
                            setImgIndex(newArray);
                          }else{
                            const newArray = [...imgIndex];
                            newArray[index] = len;
                            setImgIndex(newArray);
                          }
                        }}>
                            <i className="material-icons text-sm pl-1">arrow_back_ios</i>
                        </button>


                        {d.Products && d.Products[productIndex[index]] && <img className="min-w-[450px] min-h-[300px] object-center rounded-tl-2xl rounded-tr-2xl
                        navbarSM:min-w-[300px]  navbarSM:min-h-[200px]"
                        src={`data:image;base64,${imageConversion(d, index)}`} alt="image"></img>}

                        <button className="z-50 absolute top-[80px] right-0 border-inputColor border-y-2 border-l-2 bg-inputColor w-6 h-24 rounded-l-2xl opacity-70 hover:w-6"
                        onClick={(e)=>{
                          const len = imageLen(d, index);
                          if(imgIndex[index] < len){
                            const newArray = [...imgIndex];
                            newArray[index] += 1;
                            setImgIndex(newArray);
                          }else{
                            const newArray = [...imgIndex];
                            newArray[index] = 1;
                            setImgIndex(newArray);
                          }
                        }}>
                          <i className="material-icons text-sm">arrow_forward_ios</i>
                        </button>
                    </div>

                     <div className="w-full p-5">              
                          <div className="flex flex-row items-center mb-2">
                                {d.Products[productIndex[index]] && <div className="w-1/2 h-8 overflow-x-scroll"> 
                                  <p className="font-inter font-bold text-xl">{_.startCase(d.Products[productIndex[index]].product_name) +" (ID: "+d.id+ ")" } {'\u00A0'}</p>
                                </div>}
                              

                                {d.Products[productIndex[index]] && <div className="w-1/2">
                                        <select id="products" className='input' onChange={(e)=>{
                                          const newArray = [...productIndex];
                                          newArray[index] = e.target.value;
                                          setProductIndex(newArray)
                                        }}>
                                          {
                                            d.Products.map((o, index)=>{
                                              return (
                                                <option key={index} value={index}>Product {index+1}</option>
                                              )
                                            })

                                          }
                                        </select>
                                </div>}
                            </div>

                      <div className="flex gap-6 flex-col navbarSM:gap-0 navbarSM:text-sm">
                          <div className="flex flex-col flex-grow">


                                <div className="flex flex-row ">
                                    {d.Products[productIndex[index]] && <div className="font-inter mb-2 w-1/2">
                                      <span className="font-inter font-medium">Product Price</span>
                                      <p>{'\u00A0'}{'\u00A0'}$ {Math.round(d.Products[productIndex[index]].product_price)}.00</p>    
                                    </div>}

                                    <div className="font-inter mb-2">
                                      <span className="font-inter font-medium">Buyback Price</span>
                                      <p>{'\u00A0'}{'\u00A0'}$ {
                                            Math.round(
                                            slotArr.reduce((accumulator, currentValue)=>{
                                            return accumulator + (d[currentValue] !== null ? totalPriceCalculator(d)/10 : 0)
                                          }, 0)*0.9)}.00</p>
                                    </div>
                                  </div>

                               
                                <div className="font-inter mb-2 flex flex-row ">
                                  <div className="w-1/2">
                                    <span className="font-inter font-medium">End Time</span>
                                    <p>{'\u00A0'}{'\u00A0'}{(UTCToCentral(d.end_time).split(' ')[0]+" "+(UTCToCentral(d.end_time).split(' ')[1]==="12:40:00"?'(DAY)':'(NIGHT)'))}</p>
                                  </div>  

                                  {d.Products[productIndex[index]] && <div className="w-1/2">
                                    <span className="font-inter font-medium">Game Type</span>
                                    <p>{'\u00A0'}{'\u00A0'}{d.Products.length > 1 ? 'Multi Game' : 'Single Game'}</p>
                                  </div>  }
                                </div>


                                <div className="flex flex-row">
                                  <div className="font-inter mb-2 w-1/2">
                                      <span className="font-inter font-medium">Winning number</span>
                                      <p>{'\u00A0'}{'\u00A0'}{d.winNum===null || d.winNum===undefined?"-":d.winNum.specialNumber}</p>
                                  </div>


                                  <div className="font-inter mb-2">
                                      <span className="font-inter font-medium">Status</span>
                                      <p>{'\u00A0'}{'\u00A0'}{statusConversion(d.status)}</p> 
                                  </div>
                                </div>
                          </div>

                          <div className="h-30 w-full mb-2">
                                  <span className="font-inter font-medium">Product Description</span>

                                  {d.Products[productIndex[index]] && <div className="not-italic h-30 tracking-[0.25px] overflow-scroll break-all"><p>{_.capitalize(d.Products[productIndex[index]].product_description)} </p></div>}
                          </div>
                      </div>
                    </div>

                    <div className="flex justify-end items-center w-full mb-6 pr-6">
                        <button className="button"
                        onClick={() => {  
                                setInd({original: {...d}});
                                setIsOpen(true);
                            }}><i className="material-icons inline">search</i>Detail</button>
                    </div>
                  </div> )}) : 


                      <>
                      <AHTableLg detail={detail} gotoPage={gotoPage} canPreviousPage={canPreviousPage} 
                      previousPage={previousPage} nextPage={nextPage} canNextPage={canNextPage} pageCount={pageCount}
                      pageIndex={pageIndex} pageOptions={pageOptions} pageSize={pageSize} 
                      setPageSize={setPageSize} getTableProps={getTableProps} headerGroups={headerGroups}
                      getTableBodyProps={getTableBodyProps} page={page} prepareRow={prepareRow}
                      setInd={setInd} setIsOpen={setIsOpen}></AHTableLg>

                      <div className="hidden navbarSM:flex navbarSM:flex-col navbarSM:w-[90%] navbarSM:ml-[10px]">
                          {display.map((d, index)=>{
                            return (
                              <table key={index} className="mb-10 font-inter font-light text-xl">
                              <tbody>
                                <tr>
                                  <td className="border-2 border-black text-center font-inter font-medium text-xl  px-2"><p>Name</p></td>
                                  <td className="border-2 border-black text-center">{_.startCase(d.product_name)+" (ID: "+d.id+ ")"}</td>
                                </tr>
                                <tr>
                                  <td className="border-2 border-black text-center font-inter font-medium text-xl  px-2"><p>Win Num</p></td>
                                  <td className="border-2 border-black  text-center">{d.winnning_number===null?"-":d.winnning_number}</td>
                                </tr>
                                <tr>
                                  <td className="border-2 border-black text-center font-inter font-medium text-xl  px-2"><p>End Time</p></td>
                                  <td className="border-2 border-black text-center">
                                    {(UTCToCentral(d.end_time).split(' ')[0]+" "+(UTCToCentral(d.end_time).split(' ')[1]==="12:40:00"?'(DAY)':'(NIGHT)'))}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-2 border-black text-center font-inter font-medium text-xl  px-2"><p>Status</p></td>
                                  <td className="border-2 border-black text-center">{statusConversion(d.status)}</td>
                                </tr>
                                <tr>
                                  <td className="border-2 border-black text-center font-inter font-medium text-xl px-2"><p>Detail</p></td>
                                  <td className="border-2 border-black text-center w-[300px]"> 
                                  <button className=""
                                  onClick={() => {  
                                          setInd({original: {...d}});
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
                <AuctionHistModal open={isOpen} onClose={() => setIsOpen(false)} d={ind} setDetectChange={setDetectChange} info={props.info}></AuctionHistModal>
            </div>
    );
}
export default AuctionHistSection;