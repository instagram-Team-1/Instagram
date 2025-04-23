'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

const Jump = ({ pageName }: { pageName: string }) => {
  const router = useRouter()

  const jumpTo = () => {
    router.push(`/${pageName}`)
  }

  return (
    <div className='w-full max-w-[500px] flex justify-center items-center px-6 py-10 border border-white/50 rounded-xl'>
      <div className='w-fit flex items-center gap-2'>
        <p className='text-white text-center'>
          {pageName === 'login' ? "Don't have an account?" : "Have an account?"}
        </p>
        <p
          className='text-blue-500 hover:text-white cursor-pointer'
          onClick={jumpTo}
        >
          {pageName === 'login' ? 'Login' : 'Sign up'}
        </p>
      </div>
    </div>
  )
}

export default Jump
