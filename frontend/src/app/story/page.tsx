'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Image as ImageIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axios from 'axios';

const Page = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [tag, setTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [open, setOpen] = useState(false); // control dialog visibility

  useEffect(() => {
    const stored = localStorage.getItem('id');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCurrentUserId(parsed?.id || stored);
      } catch {
        setCurrentUserId(stored);
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert('Please select a file first');
    if (!currentUserId) return alert('User ID not found');

    setLoading(true);

    try {
      // Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'Covaar');
      formData.append('cloud_name', 'dmgo6vuuz');

      const cloudRes = await fetch(
        'https://api.cloudinary.com/v1_1/dmgo6vuuz/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      );

      const cloudData = await cloudRes.json();
      if (!cloudData.secure_url) throw new Error('Cloudinary upload failed');

      console.log('Cloudinary URL:', cloudData.secure_url);

      // Send to backend
      await axios.post('http://localhost:9000/api/auth/story', {
        owner: currentUserId,
        media: cloudData.secure_url,
        text: tag,
      });

      alert('Story added successfully!');
      setFile(null);
      setPreviewUrl(null);
      setTag('');
      setOpen(false); // close dialog after upload
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className='flex flex-row gap-[10px] items-center'>
          <Plus /> Create
        </DialogTrigger>

        <DialogContent className='bg-white/50 border-0 flex flex-col sm:flex-row justify-center items-center p-[30px] gap-6'>
          <div className='w-full max-w-[300px] flex flex-col items-center'>
            <ImageIcon className='text-black' />
            <h1 className='text-black font-semibold mt-2'>Drag photos and videos here</h1>

            <Input
              type="file"
              onChange={handleFileChange}
              className="border bg-white mt-4"
            />

            {previewUrl && (
              <div className="mt-4">
                <p className="text-sm text-black mb-1">Preview:</p>
                <img src={previewUrl} alt="Preview" className="w-40 rounded border" />
              </div>
            )}

            <Button
              onClick={handleUpload}
              className="mt-4 bg-blue-500 text-white"
              disabled={loading}
            >
              {loading ? 'Uploading...' : 'Add Story'}
            </Button>
          </div>

          <div className='w-full'>
            <p className='text-black'>Add tag</p>
            <Input
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className='border bg-white mt-2'
              placeholder='Enter a tag'
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
