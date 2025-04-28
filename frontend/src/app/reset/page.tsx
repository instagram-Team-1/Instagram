"use client"
import React from 'react'
import { Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SeparatorOr from '../login/loginComponent/SeparatorOr';
import { useRouter } from 'next/navigation';
const page = () => {
    const router = useRouter()
    const createNew = ()=>{
        router.push('/signUp')
    }
    const login = ()=>{
        router.push('/login')
    }
  return (
    <div className='flex items-center justify-center w-full h-[100vh]'>
      <div className='border border-white/50 flex flex-col items-center max-w-[350px] px-[30px] gap-[5px] py-[15px]'>
      <div className='rounded-full p-[30px]  border border-white w-fit' >
      <Lock />
      </div>
      <h1>Trouble logging in?</h1>
      <p className='text-[10px] text-center text-white/50'>Enter your email, phone, or username and we'll send you a link to get back into your account.</p>
      <Input
      placeholder='enter your email, or Username'
      
      />
      <Button variant={'default'} className='bg-blue-500 w-full my-[10px]'>Send reset code</Button>
      <a href='https://help.instagram.com/374546259294234' className='text-[10px]'>Cant reset your password?</a>
     < SeparatorOr/>
     <p className='text-[12px] hover:text-white/50 cursor-pointer' onClick={createNew}>Create new account</p>
     <Button onClick={login} className='bg-gray-700 w-full'>Back to login</Button>
      </div>
    </div>
  )
}

export default page