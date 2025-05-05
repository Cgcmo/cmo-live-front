import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useEffect } from "react";
import API_URL from '@/app/api';


export default function BannerTab() {
  const [bannerTitle, setBannerTitle] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
const [isUploading, setIsUploading] = useState(false);
const [banners, setBanners] = useState([]);
const [showLoader, setShowLoader] = useState(false);

useEffect(() => {
  let timeout;
  if (isUploading) {
    setShowLoader(true);
    timeout = setTimeout(() => {
      setShowLoader(false);
    }, 10000); // max 10 sec
  } else {
    setTimeout(() => {
      setShowLoader(false);
    }, 1000); // min 1 sec
  }

  return () => clearTimeout(timeout);
}, [isUploading]);


const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this banner?")) return;

  try {
    const response = await fetch(`${API_URL}/delete-banner/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      alert("Failed to delete");
      return;
    }

    setBanners(banners.filter((b) => b.id !== id));
    alert("✅ Banner deleted successfully!");
  } catch (err) {
    console.error(err);
    alert("Error deleting banner");
  }
};


  useEffect(() => {
    fetch("http://localhost:5000/get-banners")
      .then((res) => res.json())
      .then((data) => setBanners(data));
  }, []);
  

  return (
    <div className="flex flex-col lg:flex-row lg:gap-6 mt-4">
      {/* Left: Upload Banner */}
      <div className="w-full h-full max-h-[600px] lg:w-3/5 mb-2">
      <h2 className="text-[#170645] text-xl font-bold mb-2">Banner</h2>
      <div className="bg-[#ECECEC] p-6 rounded-[20px] shadow border border-gray-200">
        <label className="block text-sm sm:text-base font-semibold text-[#170645] ml-2 mb-2">
          Banner Title
        </label>
        <input
          type="text"
          placeholder="Enter Banner Title"
          value={bannerTitle}
          onChange={(e) => setBannerTitle(e.target.value)}
          className="w-full placeholder:font-medium text-center sm:text-left p-3 border border-gray-300 rounded-full text-[#170645] focus:outline-[#170645] placeholder-[#170645] mb-4"
        />

<label className="block text-sm sm:text-base font-semibold text-[#170645] mb-2">
  Upload New Image:
</label>

<div
  className="border-2 border-dashed rounded-[20px] bg-white p-6 flex flex-col items-center justify-center text-center text-[#170645] cursor-pointer hover:shadow-md transition"
  onClick={() => document.getElementById("bannerImageInput").click()}
>
<svg
  width="32"
  height="32"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  className="mb-2"
>
  <path
    d="M9 10C10.1046 10 11 9.10457 11 8C11 6.89543 10.1046 6 9 6C7.89543 6 7 6.89543 7 8C7 9.10457 7.89543 10 9 10Z"
    stroke="#170645"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
  <path
    d="M13 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V10"
    stroke="#170645"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
  <path
    d="M18 8V2L20 4"
    stroke="#170645"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
  <path
    d="M18 2L16 4"
    stroke="#170645"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
  <path
    d="M2.67004 18.9501L7.60004 15.6401C8.39004 15.1101 9.53004 15.1701 10.24 15.7801L10.57 16.0701C11.35 16.7401 12.61 16.7401 13.39 16.0701L17.55 12.5001C18.33 11.8301 19.59 11.8301 20.37 12.5001L22 13.9001"
    stroke="#170645"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
</svg>

  <p className="text-sm font-semibold">Click Or Drag & Drop To Upload Image</p>
  <p className="text-xs text-gray-500">PNG, JPG, JPEG (Recommended 800x400, Max 5MB)</p>
</div>

<input
  type="file"
  id="bannerImageInput"
  accept="image/png, image/jpg, image/jpeg"
  className="hidden"
  onChange={(e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result;
      const img = new Image();
      img.src = base64Data;

      setIsUploading(true); // already exists
const start = Date.now();

img.onload = () => {
  const duration = () => Math.max(1000 - (Date.now() - start), 0); // minimum 1 sec delay

  const aspectRatio = img.width / img.height;
  const isCloseTo2x1 = aspectRatio > 1.9 && aspectRatio < 2.1;

  if (!isCloseTo2x1) {
    const proceed = confirm(`This Image size is ${img.width}x${img.height}, recommended size is 800x400 or atlest in ratio of 2:1`);
    if (!proceed) {
      setTimeout(() => setIsUploading(false), duration());
      return;
    }
  }

  setTimeout(() => {
    setSelectedImage({
      title: bannerTitle || "Untitled Banner",
      size: (file.size / 1024).toFixed(1) + "kb",
      image: base64Data,
    });
    setIsUploading(false);
  }, duration());
};

    };

    reader.readAsDataURL(file);
  }}
/>



       {/* Uploading Preview Styled Like Reference Image */}
       {selectedImage && (
  <div className="bg-white p-4 rounded-[20px] shadow-sm mt-4 mb-4 relative">
    {/* ❌ Close Icon */}
    <FaTimes
      className="absolute top-3 right-3 text-red-500 cursor-pointer hover:scale-110 transition"
      onClick={() => {
        setSelectedImage(null);
        document.getElementById("bannerImageInput").value = "";
      }}
    />

    <div className="flex items-center gap-3">
      <div className="relative">
        <img
          src={selectedImage.image}
          alt="Preview"
          className="w-14 h-14 rounded-lg object-cover"
        />
        {!isUploading && (
          <span className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow-sm">
            <FaCheck />
          </span>
        )}
      </div>
      <div className="text-[#170645]">
        <p className="font-semibold">{selectedImage.title}</p>
        <p className="text-sm text-gray-600">{selectedImage.size}</p>
      </div>
    </div>

    <div className="mt-2 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
      <div
        className={`h-1 transition-all duration-700 ${
          isUploading ? "w-3/4 bg-green-400 animate-pulse" : "w-full bg-green-500"
        }`}
      ></div>
    </div>
  </div>
)}


<button

className="w-[30vw] mx-auto block bg-[#170645] mt-4 text-[#FFE100] py-3 rounded-full font-semibold shadow hover:shadow-lg transition"
onClick={async () => {
  if (!selectedImage || !bannerTitle) {
    alert("Please enter title and upload image first.");
    return;
  }

  const start = Date.now();
  setIsUploading(true);

  try {
    const base64 = selectedImage.image; // ✅ Don’t remove the header;

    const response = await fetch(`${API_URL}/upload-banner`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: bannerTitle,
        image: base64,
        size: selectedImage.size,
      }),
    });

    const data = await response.json();
    const delay = Math.max(1000 - (Date.now() - start), 0); // enforce 1 sec minimum

    setTimeout(() => {
      setIsUploading(false);
      if (!response.ok) {
        alert("❌ Upload failed: " + (data.error || "Unknown error"));
        return;
      }


    if (!response.ok) {
      alert("❌ Upload failed: " + (data.error || "Unknown error"));
      return;
    }

    const newBanner = {
      id: Date.now(),
      title: bannerTitle,
      size: selectedImage.size,
      date: new Date().toLocaleDateString("en-IN"),
      image: data.url,
    };

   setBanners([newBanner, ...banners]);
      setSelectedImage(null);
      setBannerTitle("");
      document.getElementById("bannerImageInput").value = "";
      alert("✅ Banner uploaded successfully!");
    }, delay);
  } catch (error) {
    setIsUploading(false);
    alert("❌ Upload failed");
    console.error(error);
  }
}}


>
  Submit
</button>

      </div>
      </div>

      {/* Right Section Heading */}
      <div className="w-full lg:w-2/5 mb-2">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-[#170645] text-xl font-bold">Active Banners</h2>
        <span className="text-sm font-semibold text-[#170645]">Total | {banners.length}</span>
      </div>
  {/* Right: Banner List */}
  <div className="bg-[#ECECEC] h-full max-h-[370px] p-6 rounded-[20px] shadow border border-gray-200 overflow-y-scroll scrollbar-hide">

          {banners.map((banner) => (
          <div
            key={banner.id}
            className="flex items-center gap-2 my-3 bg-white p-2 rounded-[10px] shadow-sm"
          >
            <img src={banner.image} alt={banner.title} className="w-10 h-10 rounded-lg object-cover" />
            <div className="flex-1">
              <p className="text-sm text-[#170645] font-medium">{banner.title}</p>
              <p className="text-xs text-gray-500">{banner.size}</p>
              <p className="text-xs text-gray-400">{banner.date}</p>
            </div>
            <FaTrash
              className="text-red-500 cursor-pointer hover:scale-110"
              onClick={() => handleDelete(banner.id)}
            />
          </div>
        ))}
      </div>
      </div>
      
      {isUploading && (
 <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-black bg-opacity-30 z-[9999] backdrop-blur-sm">
 <div className="flex flex-col items-center p-6 rounded-2xl">
   {/* Spinner */}
   <div className="relative w-20 h-20">
     <svg
       aria-hidden="true"
       className="absolute inset-0 w-20 h-20 animate-spin text-gray-300"
       viewBox="0 0 100 101"
       fill="none"
       xmlns="http://www.w3.org/2000/svg"
     >
       <path
         d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
         fill="currentColor"
       />
       <path
         d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
         fill="#170645"
       />
     </svg>
   </div>

   {/* Loading Text */}

   <p className="mt-6 text-lg font-bold text-white">
     The latest <span className="text-[#170645] font-bold">AI</span> Based Photo Gallery App.
   </p>
 </div>
</div>
)}

    </div>
  );
}
