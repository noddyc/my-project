import {useNavigate} from "react-router-dom";

const InfoNavBar = (props)=>{
    const navigate = useNavigate();
    let username = props.info.username === undefined?"   ":
    props.info.username.toUpperCase();
    const buttonHandler=()=>{
        props.setToggleInfo("translate-x-full");
    }

    return (
        <div className={`flex flex-col items-center h-screen w-80
        fixed right-0 top-0  ${props.toggleInfo}
        border-l-2  border-inputColor text-2xl text-center transition-all duration-500 bg-white navbarSM:hidden`}>
               
            <div className="flex justify-end w-full"><i style={{cursor:"pointer", display:"block"}} onClick={buttonHandler} className="material-icons">close</i></div>
            <div className="flex justify-center w-full">
                <img src={require("../assets/img1.jpeg")} alt="" className="h-40 mb-4 mt-12 w-40
                rounded-full rounded-brtl-xl"></img>
            </div>

            <div className='flex flex-col justify-center items-start p-0 h-20 gap-2 w-full '>
                    <label htmlFor='name' className='w-full h-4 not-italic font-semibold text-sm leading-4 text-gray-700 text-left pl-10'>Username</label>
                    <h5 className="pl-10 not-italic font-semibold text-sm leading-4 text-gray-700">{props.info.username === undefined?"   ":props.info.username.toUpperCase()}</h5>
            </div>
            
            <div className='flex flex-col justify-center items-start p-0 h-20 gap-2 w-full '>
                    <label htmlFor='name' className='w-full h-4 not-italic font-semibold text-sm leading-4 text-gray-700 text-left pl-10'>FirstName</label>
                    <h5 className="pl-10 not-italic font-semibold text-sm leading-4 text-gray-700">{props.info.firstname}</h5>
            </div>
            
            <div className='flex flex-col justify-center items-start p-0 h-20 gap-2 w-full '>
                    <label htmlFor='name' className='w-full h-4 not-italic font-semibold text-sm leading-4 text-gray-700 text-left pl-10'>LastName</label>
                    <h5 className="pl-10 not-italic font-semibold text-sm leading-4 text-gray-700">{props.info.lastname}</h5>
            </div>

        
            <div className='flex flex-col justify-center items-start p-0 h-20 gap-2 w-full '>
                    <label htmlFor='name' className='w-full h-4 not-italic font-semibold text-sm leading-4 text-gray-700 text-left pl-10'>Email</label>
                    <h5 className="pl-10 not-italic font-semibold text-sm leading-4 text-gray-700">{props.info.email}</h5>
            </div>

            <div className='flex flex-col  justify-center items-start p-0 h-20 gap-2 w-full '>
                    <label htmlFor='name' className='w-full h-4 not-italic font-semibold text-sm leading-4 text-gray-700 text-left pl-10'>Timezone</label>
                    <h5 className="pl-10 not-italic font-semibold text-sm leading-4 text-gray-700">{Intl.DateTimeFormat().resolvedOptions().timeZone}</h5>
            </div>

            <div className='flex flex-col justify-center items-start p-0 h-20 gap-2 w-full mb-10'>
                    <label htmlFor='name' className='w-full h-4 not-italic font-semibold text-sm leading-4 text-gray-700 text-left pl-10'>Address</label>
                    <h5 className="pl-10 not-italic font-semibold text-sm leading-4 text-gray-700">{props.info.address}</h5>
            </div>

            <button className="flex flex-col justify-center items-center  w-40 h-10 ml-10 bg-buttonColor text-white rounded-lg"
                onClick={()=>{
                    navigate('/logout')
                }}  
            >Sign Out</button>

        </div>
    );
}

export default InfoNavBar;