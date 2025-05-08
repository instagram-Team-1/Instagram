import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useParams } from 'next/navigation'
import axios from 'axios'
import {API} from '@/utils/api'
const nameChanger = () => {
const params = useParams()
const roomId = params.id
const [newName,setNewName] = useState('')
const changeName= async()=>{
const res = await axios.patch(API+`/api/chat/name/${roomId}`, {newName})
    console.log(res.data);
    alert(res.data)
}
    return (
        <div className='flex flex-col gap-[10px]'>
            <h1>
                Change group name
            </h1>
            <Separator />
            <h1>
                Changing the name of a group chat changes it for everyone.
            </h1>
            <Input
                className='outline-0'
                onChange={(e)=>setNewName(e.target.value)}
            />
            <Button className='bg-blue-500'
            disabled={!newName}
             onClick={changeName}
            >
                Save
            </Button>
        </div>
    )
}

export default nameChanger
