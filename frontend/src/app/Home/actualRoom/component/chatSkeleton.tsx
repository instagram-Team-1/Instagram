import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { array } from 'yup'
const chatSkeleton = () => {
  return (
    <div className='flex flex-col gap-[8px]'>
        {Array.from({length:5}).map((i,index)=>(
            <Skeleton key={index} className='w-[200px] h-[40px] '/>
        ))}
    </div>
  )
}

export default chatSkeleton
