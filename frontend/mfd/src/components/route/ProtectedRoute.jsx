import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({children}) => {
   const { authenticatedUser } = useSelector(state => state.authState);
   if(!authenticatedUser){
     return <Navigate to='/login'/>
   }
  return children
    
}

export default ProtectedRoute