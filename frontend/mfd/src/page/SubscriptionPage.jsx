import React from 'react'
import SubscriptionForm from '../components/subscription/SubscriptionForm';

const SubscriptionPage = () => {

        const user = {
            _id:"",
            firstName:"",
            lastName:"",
            email:"",
            phone:"",
            address:"",
            city:""
        }
   
  return (
    <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">Subscribe to a Plan</h2>
    <SubscriptionForm user={user} />
  </div>
  )
}

export default SubscriptionPage