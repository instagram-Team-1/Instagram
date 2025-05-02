import React from 'react'
import { Separator } from '@/components/ui/separator'
const SeparatorOr = () => {
  return (
    <div className='flex items-center justify-center gap-3 w-full overflow-hidden'>
    <Separator />
    <p className='text-sm text-white'>Or</p>
    <Separator />
  </div>
  )
}

export default SeparatorOr
