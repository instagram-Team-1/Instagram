"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Logo from "./loginComponent/asd.svg";
import FbLogin from "./loginComponent/fbLogin";
import SeparatorOr from "./loginComponent/SeparatorOr";
import Jump from "./loginComponent/jump";
import loginSchema from "./loginComponent/loginSchema";
import { useFormik } from "formik";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import { API } from "../../utils/api";
const Page = () => {
  const [errormsg, setErrormsg] = useState('')
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      login: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        const res = await axios.post(API + "/api/auth/login", values, {
          withCredentials: false,
        });
        const token  = res.data;
   if (res.status === 200) {
   
    
    router.push("/Home");
  localStorage.setItem('token', token)
   }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          setErrormsg(error.response.data);
        } else {
          setErrormsg("An unexpected error occurred");
        }
      } 
      }
    },
  );
  return (
    <div className="bg-black w-full h-[100vh]">
      <div className="h-full flex items-center justify-center flex-col gap-[10px]">
        <div className="w-full max-w-[350px] flex flex-col items-center gap-8 px-6 py-14">
          <div className="w-full p-6 relative">
            <Image src={Logo} alt="Logo" objectFit="contain" layout="responsive" />
          </div>
          <div className="flex flex-col gap-5 w-full">
            <form onSubmit={formik.handleSubmit} className="w-full flex flex-col gap-3">
              <div className="flex flex-col gap-3 text-white">
                <Input
                  placeholder="username, or email"
                  name="login"
                  value={formik.values.login}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`${
                    formik.errors.login && formik.touched.login ? "border-red-500" : "border-white/50"
                  }`}
                />
                {formik.errors.login && formik.touched.login && (
                  <div className="text-red-500 text-xs">{formik.errors.login}</div>
                )}
                {errormsg === "User not found" && <div className="text-red-500 text-xs">User not found</div>}

                <Input
                  placeholder="Password"
                  name="password"
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`${
                    formik.errors.password && formik.touched.password ? "border-red-500" : "border-white/50"
                  }`}
                />
                {formik.errors.password && formik.touched.password && (
                  <div className="text-red-500 text-xs">{formik.errors.password}</div>
                )}
                {errormsg === "Invalid password" && <div className="text-red-500 text-xs">Invalid password</div>}
              </div>

              <Button
                type="submit"
                variant="ghost"
                className="bg-blue-500 w-full py-2"
                disabled={formik.isSubmitting}
              >
                Login
              </Button>
            </form>
          </div>
          <SeparatorOr />
          <FbLogin />
        </div>
        <Jump pageName="signUp" />
      </div>
    </div>
  );
};

export default Page;
