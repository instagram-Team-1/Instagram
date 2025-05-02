"use client"
import axios from "axios";
import { API } from "@/utils/api";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
import { UserDataType } from "./types";

export const fetchUser = async (username: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API}/api/users/${username}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
    return response.data;
  } catch (error) {
    console.error("fetchUser error:", error);
    throw error;
  }
};



// import { jwtDecode } from 'jwt-decode'; 
// const getUser = ()=>{
//     const token = localStorage.getItem('token');

//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         console.log('Decoded JWT:', decoded);
//       } catch (err) {
//         console.error('Invalid token:', err);
//       }
//     } else {
//       console.warn('No token found in localStorage');
//     }
// }
// export default getUser