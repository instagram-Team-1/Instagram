'use client'
import { useState } from 'react';
import { Settings } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { Button } from '@/components/ui/button';
import { House } from 'lucide-react';
import ChatDrawer from "../component/chatDrawer";
import { useRouter } from 'next/navigation';

const roomHeader = () => {
  const router = useRouter()
  const [showDrawer, setShowDrawer] = useState(false);
  const Home = () => {
    router.push('/Home')
  }
  return (
    <div className="w-full justify-between flex flex-row p-4">
      <House
        onClick={Home}
      />
      <Settings
        onClick={() => setShowDrawer(true)}
      />
      <AnimatePresence>
        {showDrawer && (
          <motion.div
            className="fixed top-0 right-0 h-full w-[300px] bg-gray-800 p-4 shadow-xl"
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Chat Drawer</h2>
              <Button variant="ghost" onClick={() => setShowDrawer(false)}>
                Close
              </Button>
            </div>
            <ChatDrawer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default roomHeader