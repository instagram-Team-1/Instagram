import React from 'react'
import { Separator } from '@/components/ui/separator'
const SeparatorOr = () => {
  return (
    <div className='flex items-center justify-center gap-3 w-full overflow-hidden'>
    <Separator className='bg-white/40'/>
    <p className='text-sm text-white/80'>OR</p>
    <Separator className='bg-white/40'/>
  </div>
  )
}

export default SeparatorOr
