import {useState, useEffect, useMemo, useRef} from "react";
import React from 'react';
import {useIsAuthenticated, useAuthUser} from 'react-auth-kit';
import {useNavigate, useLocation} from 'react-router-dom'
import axios from 'axios';
import qs from 'qs';
import Modal from './Modal'
import moment from 'moment-timezone'
import { useTable, usePagination, useSortBy,useFilters, useGlobalFilter } from 'react-table'
import { COLUMNS } from './columns'
import { GlobalFilter } from '../Utils/GlobalFilter'
import { ColumnFilter } from '../Utils/ColumnFilter'
import {ip} from '../Utils/ip'
import {debounce} from 'lodash'
import {io} from 'socket.io-client'
import _ from 'lodash'
import LATableLg from "./LATableLg";
import { UTCToCentral } from "../Utils/time";


function upperFirstLetter(text){
  return text.charAt(0).toUpperCase()+text.slice(1);
}

function LiveAuctionSection(props) {
    window.history.replaceState({}, document.title)
    const location = useLocation();
    const relocate = location.state ? location.state.relocate : null;
    const divRefs = useRef([]);


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
    const [MOCK_DATA, setMOCK_DATA] = useState([]);
    const [keyword, setKeyWord] = useState("");


    //should be array [];
    const [productIndex, setProductIndex] = useState([]);
    const [imgIndex, setImgIndex] = useState([]);

    // const [renderStatus, setRenderStatus] = useState(false);
    

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
      // console.log(imgIndex)
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
      
    useEffect(()=>{
      if(!isAuthenticated()){
          navigate('/')
      }
    },[])

    const clickHandler = () => {
      props.socket.emit("increaseCount", {receiverId: auth().id});
    };

    useEffect(()=>{
        try{              
          let auctionId = [];
          // only display in progress auctions
            let data = qs.stringify({
                'statues': ['OPEN_LIVE','OPEN_NOT_LIVE'] 
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
                // console.log(data)

                data.forEach((e, index)=>{
                  auctionId.push(e.id);
                })

                divRefs.current = data.map(() => React.createRef());
                let arr = [];
                data.filter((e)=>{
                  if(keyword === ""){
                    return true;
                  }
                  for(let props in e){
                    if(typeof JSON.stringify(e[props]) === 'string' && JSON.stringify(e[props]).toLowerCase().includes(keyword.toLowerCase())){
                      return true;
                    }
                  }
                  return false;

                }).forEach((e, index)=>{
                    arr.push(e)
                })
                setDisplay(arr);
                setMOCK_DATA(arr);
                
                setProductIndex(new Array(arr.length).fill(0));
                setImgIndex(new Array(arr.length).fill(1));
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


    useEffect(()=>{
      if(relocate){
        console.log(display)
        console.log(relocate)
        let index = display.findIndex((e)=>{
          return e.id == relocate
        })
        console.log(index)
        console.log(divRefs.current)
        if(divRefs.current[index] != undefined){
          divRefs.current[index].current.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest',
          });
        }
      }
    }, [display])

    return (
            <div className='after-margin-200 overflow-scroll h-full flex flex-col mt-10 ml-[200px] relative font-inter font-light gap-6
            navbarSM:ml-[10px]'>
              <div className="px-4 sm:px-0 nav">
                <h3 className="text-4xl font-inter font-bold">OPEN GAMES</h3>
              </div>

              <div className="mt-5 px-4 text-2xl font-inter font-medium invisible">
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

              <div className={`w-1/2  px-4 flex-row justify-center items-center ${detail==='true'?'flex':'hidden'}  navbarSM:${detail==='true'?'flex':'hidden'} navbarSM:w-3/4`}>
                  <label className="label">Search:{'\u00A0'}</label>
                  <input className="input" placeholder="Enter keyword" onChange={keywordHandler}></input>
              </div>

              <div className={`w-1/2 px-4 flex-row justify-center items-center ${detail==='false'?'flex':'hidden'} navbarSM:${detail==='false'?'flex':'hidden'} navbarSM:w-3/4`}>
                  <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter}/>
              </div>

              <div className="flex flex-row flex-wrap gap-12 px-4 w-full mt-5 navbarSM:justify-center">
              {
              detail !=='false' ? display.map((d, index) => {
              return (
                <div className={`border-4 flex flex-col items-start
                isolate w-[450px] rounded-2xl bg-cardBg ${relocate && relocate==d.id ? 'border-black border-dashed':'border-white'}
                hover:bg-cardHoverColor navbarSM:w-[300px]`}
                key={index} ref={divRefs.current[index]}>  

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


                        {d.Products && d.Products[productIndex[index]] && <img className="img"
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
                         

                          <div className="w-1/2">
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
                          </div>
                        </div>

                        <div className="flex gap-6 flex-col navbarSM:gap-0 navbarSM:text-sm">

                              <div className="flex flex-col flex-grow">
                                    <div className="font-inter mb-2 w-1/2">
                                          <span className="font-inter font-medium">Host</span>
                                          <p>{'\u00A0'}{'\u00A0'}{upperFirstLetter(d.User.firstname)} {upperFirstLetter(d.User.lastname)}</p>
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
                                  
                                </div>
                                <div className="h-30 w-full mb-2">
                                  <span className="font-inter font-medium">Product Description</span>

                                  {d.Products[productIndex[index]] && <div className="not-italic h-30 tracking-[0.25px] overflow-scroll break-all"><p>{_.capitalize(d.Products[productIndex[index]].product_description)} </p></div>}
                                </div>

                                
                          </div>
                       </div>

                    <div className="flex justify-end items-center w-full mb-6 pr-6">
                      <button className={`button ${d.ownerId === auth().id ? "invisible":"" }`}
                      onClick={() => {  
                              setInd({original:{...display[index]}});
                              setIsOpen(true);
                          }}><i className="material-icons inline">add_circle</i><span>Join</span></button>
                    </div>
                </div> )}
                
                ) : 
                  <>
                      <LATableLg detail={detail} gotoPage={gotoPage} canPreviousPage={canPreviousPage} 
                      previousPage={previousPage} nextPage={nextPage} canNextPage={canNextPage} pageCount={pageCount}
                      pageIndex={pageIndex} pageOptions={pageOptions} pageSize={pageSize} 
                      setPageSize={setPageSize} getTableProps={getTableProps} headerGroups={headerGroups}
                      getTableBodyProps={getTableBodyProps} page={page} prepareRow={prepareRow}
                      setInd={setInd} setIsOpen={setIsOpen}></LATableLg>

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
                                  <td className="border-2 border-black text-center font-inter font-medium text-xl  px-2"><p>Host</p></td>
                                  <td className="border-2 border-black  text-center">{upperFirstLetter(d.User.firstname)} {upperFirstLetter(d.User.lastname)}</td>
                                </tr>
                                <tr>
                                  <td className="border-2 border-black text-center font-inter font-medium text-xl  px-2"><p>End Time</p></td>
                                  <td className="border-2 border-black text-center">
                                    {'\u00A0'}{'\u00A0'}{(UTCToCentral(d.end_time).split(' ')[0]+" "+(UTCToCentral(d.end_time).split(' ')[1]==="12:40:00"?'(DAY)':'(NIGHT)'))}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-2 border-black text-center font-inter font-medium text-xl  px-2"><p>Price</p></td>
                                  <td className="border-2 border-black text-center">$ {Math.round(d.product_price)}.00</td>
                                </tr>
                                <tr>
                                  <td className="border-2 border-black text-center font-inter font-medium text-xl px-2"><p>Detail</p></td>
                                  <td className="border-2 border-black text-center w-[300px]"> 
                                        <button className={` ${d.ownerId === auth().id ? "invisible":"" }`}
                            onClick={() => {  
                                    setInd({original:{...display[index]}});
                                    setIsOpen(true);
                                }}><span className="underline">Join</span></button></td>
                                </tr>
                              </tbody>
                            </table>
                            
                              
                            )
                          })}
                </div>

                  </>    
                }
              </div>

                
                <Modal open={isOpen} onClose={() => setIsOpen(false)} d={ind} setDetectChange={setDetectChange} info={props.info}></Modal>
            </div>
    );
}
export default LiveAuctionSection;