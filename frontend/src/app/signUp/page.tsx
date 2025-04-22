import React from 'react'
import { createContext } from 'react';
import { Formik, Form, Field } from 'formik';

import Logo from '@/app/login/loginComponent/logo.svg'
import FbLogin from '../login/loginComponent/fbLogin'
import SeparatorOr from '../login/loginComponent/SeparatorOr'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Jump from '../login/loginComponent/jump'
import { useFormik } from 'formik'

const Page = () => {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      username: '',
      fullname: ''
    },
    onSubmit: (values) => {
      console.log('Form values:', values)
    }
  })

  return (
    <div className='bg-black w-full h-[100vh]'>
      <div className='bg-black h-full w-full flex items-center justify-center flex-col gap-[10px]'>
        <div className='border border-white/50 w-full max-w-[500px] flex flex-col items-center gap-8 px-[30px] py-14 rounded-xl'>
          <div className='w-full flex justify-center items-center bg-white p-6'>
            <Logo className='w-32 h-auto text-black' />
          </div>

          <p className='text-center text-white/50'>
            Sign up to see photos and videos <br /> from your friends
          </p>

          <FbLogin />
          <SeparatorOr />

          <form onSubmit={formik.handleSubmit} className='w-full flex flex-col gap-[10px]'>
            <Input
              placeholder='Mobile number or email'
              name='email'
              onChange={formik.handleChange}
              value={formik.values.email}
            />
            <Input
              placeholder='Password'
              name='password'
              type='password'
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            <Input
              placeholder='Full name'
              name='fullname'
              onChange={formik.handleChange}
              value={formik.values.fullname}
            />
            <Input
              placeholder='Username'
              name='username'
              onChange={formik.handleChange}
              value={formik.values.username}
            />
            <Button type='submit' className='bg-blue-500 w-full'>
              <p>Sign up</p>
            </Button>
          </form>

          <div className='text-center text-[12px] flex flex-col gap-[10px]'>
            <p>
              People who use our service may have uploaded your contact information to Pentagram.{' '}
              <span className='text-blue-100 cursor-pointer hover:underline'>Learn more</span> .
            </p>
            <p>
              By signing up, you agree to our{' '}
              <span className='text-blue-100 cursor-pointer hover:underline'>Terms</span>,{' '}
              <span className='text-blue-100 cursor-pointer hover:underline'>Privacy Policy</span> and{' '}
              <span className='text-blue-100 cursor-pointer hover:underline'>Cookie Policy</span> .
            </p>
          </div>
        </div>

        <Jump pageName='login' />
      </div>
    </div>
  )
}

export default Page
