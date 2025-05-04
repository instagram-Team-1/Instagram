import React from "react";
import imageCompression from "browser-image-compression";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { userDetailTypes } from "./atoms";

interface Props {
  e: React.ChangeEvent<HTMLInputElement>;
  location: string;
  username: string;
  maxWidthOrHeight: number;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

async function handleUploadToCloud({
  e,
  location,
  username,
  maxWidthOrHeight,
  setLoading,
}: Props) {
  const file = e.target?.files?.[0];
  if (!file) {
    console.error("Файл олдсонгүй.");
    return { photoURL: null };
  }

  const fileType = file.type;
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight,
    useWebWorker: true,
  };

  const storage = getStorage();
  const timestamp = Date.now();
  const storageRef = ref(
    storage,
    `${location}/${username}-${timestamp}-${file.name}`
  );

  let photoURL: string | null = null;

  if (
    fileType === "image/png" ||
    fileType === "image/jpg" ||
    fileType === "image/jpeg"
  ) {
    setLoading(true);
    try {
      const compressedFile = await imageCompression(file, options);
      await uploadBytes(storageRef, compressedFile);
      photoURL = await getDownloadURL(storageRef);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
  } else {
    console.warn("Зөвхөн .png, .jpg, .jpeg файлуудыг ашиглана уу.");
  }

  return { photoURL };
}

interface handleUploadImageProps {
  e: React.ChangeEvent<HTMLInputElement>;
  location: string;
  username: string;
  maxWidthOrHeight: number;
  chatRoomIDs: string[] | null;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setAddPhoto: React.Dispatch<React.SetStateAction<boolean>>;
  handleImgURLFunction: (props: {
    url: string;
    username: string;
    chatRoomIDs: string[] | null;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setAddPhoto: React.Dispatch<React.SetStateAction<boolean>>;
  }) => void;
}

function handleUploadImage({
  e,
  location,
  username,
  maxWidthOrHeight,
  chatRoomIDs,
  setLoading,
  setAddPhoto,
  handleImgURLFunction,
}: handleUploadImageProps) {
  async function handler() {
    const { photoURL } = await handleUploadToCloud({
      e,
      location,
      username,
      maxWidthOrHeight,
      setLoading,
    });

    if (photoURL) {
      handleImgURLFunction({
        url: photoURL,
        username,
        chatRoomIDs,
        setLoading,
        setAddPhoto,
      });
    } else {
      console.warn("Зураг байршуулахад алдаа гарлаа.");
    }
  }

  handler();
}

export default handleUploadImage;
