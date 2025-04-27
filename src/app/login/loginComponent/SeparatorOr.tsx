import React from 'react'
import { Separator } from '@/components/ui/separator'
const SeparatorOr = () => {
  return (
    <div className='flex items-center justify-center gap-3 w-full overflow-hidden '>
    <Separator className='bg-white/50'/>
    <p className='text-sm text-white'>Or</p>
    <Separator className='bg-white/50' />
  </div>
  )
}

export default SeparatorOr
