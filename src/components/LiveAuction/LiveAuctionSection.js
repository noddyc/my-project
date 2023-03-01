import {useState, useEffect, useMemo } from "react";
import React from 'react';
import {useIsAuthenticated, useAuthUser} from 'react-auth-kit';
import {useNavigate} from 'react-router-dom'
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


function upperFirstLetter(text){
  return text.charAt(0).toUpperCase()+text.slice(1);
}

function LiveAuctionSection(props) {
   
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
    const [imgPos, setImgPos] = useState([]);

    const [img, setImg] = useState(null);

    const keywordHandler = debounce((e)=>{
      setKeyWord(e.target.value)
    }, 500)
  

    useEffect(()=>{
      if(!isAuthenticated()){
          navigate('/')
      }
    },[])

    const clickHandler = () => {
      console.log("hello")
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

                data.forEach((e)=>{
                  auctionId.push(e.id);
                })

                // console.log(data)

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
                setDisplay(arr)
                setMOCK_DATA(arr);
                setImgPos(new Array(arr.length).fill(0));
              }).then((response)=>{
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
                  console.log(myMap)
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
            <div className='overflow-scroll bg-lightBg h-full mb-20  w-full gap-2 flex flex-col justify-center items-start ml-[150px]  relative font-inter font-light
            navbarSM:w-full navbarSM:pl-0 navbarSM:pr-0 navbarSM:ml-0'>
                <div className="mb-8 mt-2 ml-2 absolute top-0 font-bold"><h1 className="text-5xl">Live Games</h1>
                </div>
                
                <div className="mb-8 mt-2 ml-2 absolute top-16 navbarSM:hidden">
                    <label htmlFor="cardbutton">Table Display:</label>
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

                <div className="flex flex-row flex-wrap overflow-scroll gap-12 w-full pl-16 pr-16 mt-16 absolute top-24">

                {
                 detail !=='false' ? display.map((d, index) => {
                  console.log(d)
                 return (
                  <div className="border-1 border-black flex flex-col items-start
                  isolate w-[325px] rounded-2xl bg-cardBg 
                  hover:bg-cardHoverColor" key={index} >  

                      <div className="max-w-[325px] max-h-[212px] overflow-hidden relative rounded ">
                          <button className="z-50 absolute top-[80px] left-0 border-inputColor border-y-2 border-r-2 bg-inputColor w-4 h-12 rounded-r-2xl opacity-70 hover:w-6"
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
                          {d.id && img  &&  img.has(d.id) && <img className=" min-w-[325px] min-h-[212px] object-center rounded-tl-2xl rounded-tr-2xl" 
                          src={`data:image;base64,${img.get(d.id)[imgPos[index]]}`} alt="image"></img> }
                          {d.id && img && !img.has(d.id) && <img className=" min-w-[325px] min-h-[212px] rounded-tl-2xl rounded-tr-2xl object-center" src={require(`../../assets/card-img${imgPos[index]}.jpeg`)} alt="" />}

                          <button className="z-50 absolute top-[80px] right-0 border-inputColor border-y-2 border-l-2 bg-inputColor w-4 h-12 rounded-l-2xl opacity-70 hover:w-6"
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
                          <p className="font-inter font-bold text-xl">{_.startCase(d.product_name) + " I am from USA "} {'\u00A0'}
                          </p>
                        </div>

                        <div className="h-30 mb-2">
                          <span className="font-inter font-medium">Description:</span>
                          <div className="not-italic h-24 tracking-[0.25px] overflow-scroll break-all"><p>{_.capitalize(d.product_description +
                             " I am from USA I am from USA I am from USA I am from USA I am from USA ")} </p></div>
                        </div>

                        <div className="font-inter mb-2">
                              <span className="font-inter font-medium">Host:</span>
                              <p>{'\u00A0'}{'\u00A0'}{upperFirstLetter(d.User.firstname)} {upperFirstLetter(d.User.lastname)}</p>
                        </div>

                        <div className="font-inter mb-2">
                          <span className="font-inter font-medium">End Time:</span>
                          <p>{'\u00A0'}{'\u00A0'}{(moment(d.end_time).clone().tz(props.info.timezone))!==undefined? (moment(d.end_time).clone().tz(props.info.timezone)).format("YYYY-MM-DD HH:mm:ss"):""}
                          {'\u00A0'}({(moment(d?.end_time).clone().tz('UTC').format("HH:mm:ss")==="12:40:00"?'DAY':'NIGHT')})</p>    
                        </div>



                        <div className="font-inter mb-2">
                          <span className="font-inter font-medium">Total Price:</span>
                          <p>{'\u00A0'}{'\u00A0'}$ {Math.round(d.product_price)}.00</p>    
                        </div>

                        <div className="font-inter mb-2">
                          <span className="font-inter font-medium">Buyback Price:</span>
                          <p>{'\u00A0'}{'\u00A0'}$ {
                                Math.round(
                                slotArr.reduce((accumulator, currentValue)=>{
                                // console.log(d.currentValue)
                                return accumulator + (d[currentValue] !== null ? d.product_price/10 : 0)
                              }, 0)*0.9)}.00</p>
                        </div>
                      </div>

                     {/* to make justify-center items-center work, need to include width */}
                     <div className="flex justify-start items-center w-full mb-6 pl-4">
                        <button className={`flex flex-row justify-center items-center w-[90px] p-4 h-[36px] gap-2 bg-darkBg text-white font-bold
                        rounded-full ${d.ownerId === auth().id ? "invisible":"" } hover:opacity-60`}
                        onClick={() => {  
                                setInd({original:{...display[index]}});
                                setIsOpen(true);
                          
                            }}><i className="material-icons inline">add_circle</i><span>Join</span></button>
                    </div>
                  </div> )}
                  
                  ) : (
                            <div className="self-center flex flex-col justify-center items-center mt-24 mb-32">
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
                                    <button onClick={() => {

                                      // console.log("hello I clicked");
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
                <Modal open={isOpen} onClose={() => setIsOpen(false)} d={ind} setDetectChange={setDetectChange} info={props.info}></Modal>
            </div>
    );
}
export default LiveAuctionSection;