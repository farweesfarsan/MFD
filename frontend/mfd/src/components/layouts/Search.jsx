import React, { useEffect, useState } from 'react'
import { IoSearch } from "react-icons/io5";
import { useLocation, useNavigate } from 'react-router-dom';

const Search = () => {

     const navigate = useNavigate();
     const location = useLocation();
     const [keyword,setKeyWord] = useState("");
    const searchHandler = (e)=>{
       e.preventDefault();
       navigate(`/search/${keyword}`)
    }

    const clearKeyword = () =>{
       setKeyWord("");
    }

    useEffect(()=>{
      if(location.pathname == '/'){
        clearKeyword();
      }
    },[location])
  return (
    <form onSubmit={searchHandler}>
       <div className="flex flex-grow items-center justify-center mx-2 md:mx-4 lg:mx-6">
            <input
              type="text"
              placeholder="Search Dairy Products ..."
              className="w-44 sm:w-60 md:w-52 lg:w-80 px-4 py-2 text-black rounded-l-md outline-none"
              value={keyword}
              onChange={(e)=>{
                setKeyWord(e.target.value)
              }}
            />
            <button className="bg-[#e99820fa] px-4 py-2 rounded-r-md hover:bg-[#a87c3afa]">
              <IoSearch className='text-[#0f0404] text-2xl'/>
            </button>
     </div>
    </form>
    
  )
}

export default Search