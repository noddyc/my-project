import React, { useEffect } from 'react';
import { useSignOut } from 'react-auth-kit';
import {useNavigate} from 'react-router-dom'

const Logout = () => {
    const navigate = useNavigate();
    const signOut = useSignOut();
    useEffect(()=>{
        setTimeout(()=>{
            signOut();
            navigate('/');
        }, 500);
    })
    return (
        <div>
            Logging out
        </div>
    );
};

export default Logout;