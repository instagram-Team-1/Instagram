'use client';

import { API } from '@/utils/api';
import axios from 'axios';
import { useState, useRef, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';

type MailVerifyProps = {
  email: string;
  closeDialog: () => void;
};

const MailVerify = ({ email, closeDialog }: MailVerifyProps) => {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [preId, setPreId] = useState<string | null>(null);

  useEffect(() => {
    const code = localStorage.getItem('code');
    if (code) {
      setPreId(code);
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const mailcode = otp.join('');
    if (mailcode.length !== 6) {
      toast.error('Please enter the complete 6-digit code.');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/auth/create-account`, {
        code: mailcode,
        email,
      });
      toast.success(res.data.message || 'Account created successfully!');
      setTimeout(() => {
        router.push('/Home');
      }, 1500);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = async () => {
    if (preId) {
      try {
        await axios.delete(`${API}/api/auth/editPre/${preId}`);
      } catch (error: any) {
        toast.error('Failed to delete temporary data.');
      }
    }
    closeDialog()
  };

  return (
    <div className="text-white w-full h-full flex flex-col justify-center items-center gap-6">
      <h1 className="text-2xl font-semibold">Enter 6-digit Code</h1>

      <div className="flex gap-3">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            className="w-12 h-12 text-2xl text-center border border-gray-400 rounded bg-transparent focus:outline-none focus:border-blue-400"
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
          />
        ))}
      </div>

      <div className="flex justify-between gap-6">
        {/* <button
          onClick={handleBack}
          className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
        >
          Back
        </button> */}

        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:bg-blue-300"
          disabled={loading}
        >
          {loading ? 'Verifying...' : 'Verify Code'}
        </button>
      </div>

      <ToastContainer theme="dark" position="top-center" />
    </div>
  );
};

export default MailVerify;