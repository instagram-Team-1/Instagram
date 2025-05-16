'use client'

import React, { useState } from 'react'
import { useFormik } from 'formik'
import FbLogin from '../login/loginComponent/fbLogin'
import SeparatorOr from '../login/loginComponent/SeparatorOr'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Jump from '../login/loginComponent/jump'
import signSchema from './signComponent/signSchema'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import MailVerify from './signComponent/mailVerify'
import { API } from '@/utils/api'
import { LampContainer } from '@/components/ui/lamp'
import * as Dialog from '@radix-ui/react-dialog';

const Page = () => {
  const [resp, setResp] = useState('')
  const [loading, setLoading] = useState(false)
  const [code, setCode] = useState('');

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      username: '',
      fullname: '',
    },
    validationSchema: signSchema,
    onSubmit: async (values) => {
      setLoading(true)
      try {
        const res = await axios.post(API + '/api/auth/register', values)
        setCode(res.data.code);
        toast(res.data.message)
        setResp(res.data.message)
      } catch (error) {
        toast.error('Something went wrong!')
      } finally {
        setLoading(false)
      }
    },
  })

  const isDialogVisible = !!resp && resp.includes('Verification code sent to email')

  const handleOverlayClick = async () => {
    if (code) {
      try {
        await axios.delete(`${API}/api/auth/editPre/${code}`);
        console.log('Temporary data deleted.');
      } catch (error) {
        toast.error('Failed to delete temporary data.');
      }
    }
    setResp('');
  };

  return (
    <div className="w-full h-[100vh] flex relative">
<LampContainer>
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      <div className="bg-transparent h-full w-full flex items-center justify-center flex-col gap-[10px]">
        <div className="border border-white/50 w-full max-w-[350px] flex flex-col items-center gap-[10px] px-[30px] py-14 rounded-xl">
          <p className="text-center text-white">
            Sign up to see photos and videos <br /> from your friends
          </p>

          <FbLogin />
          <SeparatorOr />
          <form onSubmit={formik.handleSubmit} className="w-full flex flex-col gap-[15px] text-white">
            <Input name="email" placeholder="Email" type="email" onChange={formik.handleChange} value={formik.values.email} />
            <Input name="password" placeholder="Password" type="password" onChange={formik.handleChange} value={formik.values.password} />
            <Input name="fullname" placeholder="Full name" onChange={formik.handleChange} value={formik.values.fullname} />
            <Input name="username" placeholder="Username" onChange={formik.handleChange} value={formik.values.username} />
            <Button type="submit" className="bg-blue-500 w-full" disabled={formik.isSubmitting || loading}>Sign up</Button>
          </form>
        </div>
        <Jump pageName="login" />
      </div>

      <Dialog.Root open={isDialogVisible}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={handleOverlayClick} />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black border border-white/50 p-6 rounded-lg">
          <Dialog.DialogTitle></Dialog.DialogTitle>
            <MailVerify email={formik.values.email} closeDialog={() => setResp('')} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      </LampContainer>
    </div>
  )
}

export default Page;
