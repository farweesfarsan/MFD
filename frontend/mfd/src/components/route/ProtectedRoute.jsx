import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';
import Loader from '../layouts/Loader';

const ProtectedRoute = ({children}) => {
   const { authenticatedUser, loading } = useSelector(state => state.authState);
   if(!authenticatedUser && !loading){
     return <Navigate to='/login'/>
   }

   if(authenticatedUser){
    return children
   }

   if(loading){
    return  <Loader/>
   }
  
    
}

export default ProtectedRoute