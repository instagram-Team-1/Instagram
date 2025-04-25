"use client";

import { API } from '@/utils/api';
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import { OTPInput } from '@/components/ui/otpXOP';

const MailVerify = () => {
    const router = useRouter()
  const [mailcode, setMailcode] = useState("");
  const handleSubmit = async () => {
    try {
      const res = await axios.post(API + '/api/auth/create-account', {
        code: mailcode,
      });
      toast.success(res.data.message || "Account created successfully!")
      router.push('/Home')
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Verification failed.");
    }
  };
  return (
    <div className='w-full h-[100vh] bg-black flex items-center justify-center '>
    <div className="text-white w-fit flex flex-col gap-[100px]">
    <div className="flex flex-col items-center justify-center gap-4 p-4 text-white" >
      <h2 className="text-lg font-semibold">Enter Verification Code</h2>
      <OTPInput value={mailcode} onChange={setMailcode} length={6} />
      <button className="mt-4 px-4 py-2 rounded-md bg-primary text-black bg-white font-[700]" onClick={handleSubmit}>
        Verify
      </button>
    </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
    </div>
  );
};
export default MailVerify;
