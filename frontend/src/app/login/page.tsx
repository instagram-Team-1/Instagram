'use client'

import React from 'react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Logo from './loginComponent/logo.svg'
import FbLogin from './loginComponent/fbLogin'
import SeparatorOr from './loginComponent/SeparatorOr'
import Jump from './loginComponent/jump'

const Page = () => {
  return (
    <div className='bg-black w-full h-[100vh]'>
    <div className='h-full flex items-center justify-center flex-col gap-[10px]'>
      <div className='border border-white/50 w-full max-w-[500px] flex flex-col items-center gap-8 px-6 py-14 rounded-xl'>
        
        {/* Logo Section */}
        <div className='w-full flex justify-center items-center bg-white p-6'>
          <Logo className="w-32 h-auto text-black" />
        </div>
        
        {/* Input Fields Section */}
        <div className='flex flex-col gap-5 w-full'>
          <div className='flex flex-col gap-3'>
            <Input placeholder='Phone number, username, or email' />
            <Input placeholder='Password' />
          </div>

          {/* Login Button */}
          <Button variant="ghost" className='bg-blue-500 w-full py-2'>
            Login
          </Button>
        </div>

       
        <SeparatorOr />
        <FbLogin />
      </div>

     
      <Jump pageName="signUp"/>
    </div>
    </div>
  )
}

export default Page
