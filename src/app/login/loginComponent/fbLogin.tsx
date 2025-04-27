import React from 'react'
import { Button } from "@/components/ui/button";
import { Facebook } from "lucide-react"; 
const fbLogin = () => {
  return (
  
       <Button variant="ghost" className="text-white flex items-center gap-2 bg-blue-500 w-full">
      <Facebook className="w-5 h-5 rounded-full" />
      <span>Login with Facebook</span>
    </Button>
   
  )
}

export default fbLogin
