import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';
import Loader from '../layouts/Loader';

const ProtectedRoute = ({children,isAdmin}) => {
   const { authenticatedUser, loading, user} = useSelector(state => state.authState);
   if(!authenticatedUser && !loading){
     return <Navigate to='/login'/>
   }

   if(authenticatedUser){
    if(isAdmin === true && user.role !== 'admin'){
      return <Navigate to='/'/>
    }
    return children
   }

   if(loading){
    return  <Loader/>
   }
  
    
}

export default ProtectedRoute