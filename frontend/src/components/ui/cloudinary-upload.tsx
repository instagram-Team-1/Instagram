export async function uploadToCloudinary(file: File): Promise<string | null> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "Story-Instagram");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dvfl0oxmj/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) return null;
  const data = await res.json();
  return data.secure_url;
}
