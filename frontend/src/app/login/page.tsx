"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Logo from "./loginComponent/asd.svg";
import FbLogin from "./loginComponent/fbLogin";
import SeparatorOr from "./loginComponent/SeparatorOr";
import Jump from "./loginComponent/jump";
import loginSchema from "./loginComponent/loginSchema";
import { useFormik } from "formik";
import Image from "next/image";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { parseJwt } from "../../utils/JwtParse";
import { useRouter } from "next/navigation";

import {API} from "../../utils/api"


const Page = () => {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      login: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
       const res = await axios.post(

         API + "/api/auth/login",

         values,
         { withCredentials: true } 
       );

        const token = res.data.token;
  
        const payload = parseJwt(token);

        if (payload) {
          console.log("Decoded JWT:", payload);
          console.log("User ID:", payload.userId);
        }

        toast.success(res.data.message);
        router.push("/Home");
      } catch (error) {
        toast.error("Login failed");
      }
    },
  });

  return (
    <div className="bg-black w-full h-[100vh]">
      <div className="h-full flex items-center justify-center flex-col gap-[10px]">
        <div className="border border-white/50 w-full max-w-[500px] flex flex-col items-center gap-8 px-6 py-14 rounded-xl">
          <div className="w-full p-6 relative">
            <Image
              src={Logo}
              alt="Logo"
              objectFit="contain"
              layout="responsive"
            />
          </div>
          <div className="flex flex-col gap-5 w-full">
            <form
              onSubmit={formik.handleSubmit}
              className="w-full flex flex-col gap-3"
            >
              <div className="flex flex-col gap-3 text-white">
                <Input
                  placeholder="Phone number, username, or email"
                  name="login"
                  value={formik.values.login}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.login && formik.touched.login && (
                  <div className="text-red-500 text-xs">
                    {formik.errors.login}
                  </div>
                )}
                <Input
                  placeholder="Password"
                  name="password"
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.password && formik.touched.password && (
                  <div className="text-red-500 text-xs">
                    {formik.errors.password}
                  </div>
                )}
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
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={true}
        pauseOnHover={false}
        theme="dark"
      />
    </div>
  );
};

export default Page;
