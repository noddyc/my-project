import React from 'react';

const ProfileBox = (props)=>{

    // const [date, setDate] = useState(new Date());
    // useEffect(()=>{
    //     let timer = setInterval(()=>{
    //         setDate(new Date(), 1000)});
    //     return function cleanup(){
    //         clearInterval(timer)
    //     }
    // }, [])
    // console.log(props.info)
    let username = props.info.username === undefined?"   ":
    props.info.username.toUpperCase();
    return (
        <div className="border-solid border flex flex-col items-center h-screen w-1/5
        border-orange-500 text-2xl text-center navbarSM:w-screen navbarSM:text-base navbarSM:h-1/4 pb-8">
            <img src={require("../assets/img1.jpeg")} alt="" className="h-40 mb-4 mt-12 w-40
            rounded-full rounded-brtl-xl"></img>
            <div className="">Username: </div>
            <h5>{username}</h5>
            <div className="">Firstname: </div>
            <h5>{props.info.firstname}</h5>
            <div className="">Lastname: </div>
            <h5>{props.info.lastname}</h5>
            <div className="">Email: </div>
            <h5>{props.info.email}</h5>
            <div className="">Timezone: </div>
            <h5>{Intl.DateTimeFormat().resolvedOptions().timeZone}</h5>
            <div className="">Address: </div>
            <h5>{props.info.address}</h5>
            
        </div>
    );
}

export default ProfileBox;