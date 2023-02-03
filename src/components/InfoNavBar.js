const InfoNavBar = (props)=>{
    let username = props.info.username === undefined?"   ":
    props.info.username.toUpperCase();

    const buttonHandler=()=>{
        props.setToggleInfo("translate-x-full");
    }

    return (
        <div className={`flex flex-col items-center h-screen w-80
        fixed right-0 top-0 bg-white ${props.toggleInfo}
        border-solid border border-orange-500 text-2xl text-center navbarSM:hidden`}>
                {/* navbarSM:w-screen navbarSM:text-base navbarSM:h-1/4 pb-8" */}

            <div><button style={{cursor:"pointer"}} onClick={buttonHandler}>closed</button></div>
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

export default InfoNavBar;