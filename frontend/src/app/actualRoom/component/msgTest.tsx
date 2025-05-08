import React, { useState } from 'react'
import Msgs from './msgs'
import Request from './req'
const msgTest = () => {
const [status,setStatus] = useState('')


  
  return (
    <div className='bg-black h-[100vh] w-[30%] text-white'>
  <div className='w-full flex justify-between px-[20px]'>
    <p onClick={()=>setStatus('msg')} className={status === 'msg' ? '' :"text-white/50"}>Messages</p>
    <p onClick={()=>setStatus('req')} className={status === 'req' ? '' :"text-white/50"}>requests</p>
  </div>
  { status === 'msg' ? 
  (<div><Msgs/></div>)
  :(<div><Request/></div>)
  }
    </div>
  )
}

export default msgTest