import {useNavigate} from "react-router-dom";
import _ from 'lodash'

const InfoNavBar = (props)=>{
    const navigate = useNavigate();
    let username = props.info.username === undefined?"   ":
    props.info.username.toUpperCase();
    const buttonHandler=()=>{
        props.setToggleInfo("translate-x-full");
    }

    return (
        <div className={`font-inter font-light text-xl flex flex-col items-center h-screen w-80
        fixed right-0 top-0  ${props.toggleInfo} border-l-2  border-inputColor text-2xl text-center transition-all duration-500 bg-white navbarSM:hidden`}>
               
            <div className="flex justify-end w-full"><i style={{cursor:"pointer", display:"block"}} onClick={buttonHandler} className="material-icons">close</i></div>
            <div className="flex justify-center w-full">
                <img src={require("../../assets/img1.jpeg")} alt="" className="h-40 mb-4 mt-12 w-40
                rounded-full rounded-brtl-xl"></img>
            </div>

            <div className='flex flex-col justify-center items-start p-0 h-20 gap-2 w-full mt-5'>
                    <label htmlFor='name' className='w-full pl-10 not-italic text-left text-2xl font-medium'>Username</label>
                    <h5 className="pl-10 not-italic">{props.info.username === undefined?"   ":props.info.username.toUpperCase()}</h5>
            </div>
            
            <div className='flex flex-col justify-center items-start p-0 h-20 gap-2 w-full mt-5'>
                    <label htmlFor='name' className='w-full pl-10 not-italic text-left text-2xl font-medium'>FirstName</label>
                    <h5 className="pl-10 not-italic">{props.info.firstname}</h5>
            </div>
            
            <div className='flex flex-col justify-center items-start p-0 h-20 gap-2 w-full mt-5'>
                    <label htmlFor='name' className='w-full pl-10 not-italic text-left text-2xl font-medium'>LastName</label>
                    <h5 className="pl-10 not-italic">{props.info.lastname}</h5>
            </div>

        
            <div className='flex flex-col justify-center items-start p-0 h-20 gap-2 w-full mt-5'>
                    <label htmlFor='name' className='w-full pl-10 not-italic text-left text-2xl font-medium'>Email</label>
                    <h5 className="pl-10 not-italic">{props.info.email}</h5>
            </div>

        
            <div className='flex flex-col justify-center items-start p-0 h-20 gap-2 w-full mt-5'>
                    <label htmlFor='name' className='w-full pl-10 not-italic text-left text-2xl font-medium'>Address</label>
                    <h5 className="not-italic">{props.info.address}</h5>
            </div>

            <div className='flex flex-col justify-center items-start p-0 h-20 gap-2 w-full mt-5'>
                <button className="button  ml-10"
                    onClick={()=>{
                        navigate('/logout')
                    }}  
                >Sign Out</button>
            </div>

        </div>
    );
}

export default InfoNavBar;