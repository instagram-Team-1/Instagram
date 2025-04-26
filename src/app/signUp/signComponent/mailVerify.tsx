"use client";

import { API } from '@/utils/api';
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
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
    <div className="text-white">
      <h1>Type 6-digit code</h1>
      
      <Input
        type="number"
        value={mailcode}
        onChange={(e) => setMailcode(e.target.value)}
        placeholder="Enter your code"
        className="text-white"
      />
      
      <button
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Verify Code
      </button>

      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default MailVerify;
