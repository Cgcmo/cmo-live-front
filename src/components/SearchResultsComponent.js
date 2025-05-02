"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/app/dashboard/components/Navbar";
import Footer from "@/app/dashboard/components/Footer";
import { FiDownload } from "react-icons/fi";
import { FiShare } from "react-icons/fi";
import { useRouter } from "next/navigation";
import API_URL from '@/app/api';
import { useSession } from "next-auth/react";


export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const router = useRouter();
  const [photos, setPhotos] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const { data: session } = useSession();


  useEffect(() => {
    if (!query) return;
  
    setLoading(true); // already present
  
    fetch(`${API_URL}/master-search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    })
      .then((res) => res.json())
      .then((data) => {
        setPhotos(data.photos || []);
        setLoading(false);
  
        // ✅ Remove search loader from navbar
        if (window) {
          const navLoader = document.querySelector(".search-loader");
          if (navLoader) navLoader.remove();
        }
      })
      .catch((err) => {
        console.error("Search error:", err);
        setLoading(false);
      });
  }, [query]);
  

  const handleSelect = (photo) => {
    setSelectedPhotos((prev) =>
      prev.includes(photo)
        ? prev.filter((p) => p !== photo)
        : [...prev, photo]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedPhotos([]);
    } else {
      setSelectedPhotos(photos);
    }
    setSelectAll(!selectAll);
  };

  const handleShareAll = async () => {
    if (selectedPhotos.length === 0) {
      alert("No images selected!");
      return;
    }
  
    if (selectedPhotos.length > 10) {
      alert("You can only share up to 10 images at once.");
      return;
    }
  
    setIsDownloading(true);
  
    try {
      const files = await Promise.all(
        selectedPhotos.map(async (photo, index) => {
          const response = await fetch(`${API_URL}/proxy-image?url=${encodeURIComponent(photo.image)}`);
          const blob = await response.blob();
          return new File([blob], `image_${index + 1}.jpg`, { type: blob.type });
        })
      );
  
      if (navigator.canShare && navigator.canShare({ files })) {
        await navigator.share({
          title: "Check out these images!",
          text: "Shared via CMO AI!",
          files,
        });
      } else {
        alert("Sharing files is not supported on your device or browser.");
      }
    } catch (err) {
      console.error("Error sharing files:", err);
      alert("Error sharing images.");
    } finally {
      setIsDownloading(false);
    }
  };
  

  const handleDownloadAll = async () => {
    if (selectedPhotos.length === 0) {
      alert("No images selected!");
      return;
    }
  
    setIsDownloading(true);
    const start = Date.now();
  
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
  
      // Instead of treating photo.image as base64, fetch it properly
      await Promise.all(selectedPhotos.map(async (photo, index) => {
        const response = await fetch(`${API_URL}/proxy-image?url=${encodeURIComponent(photo.image)}`);
        const blob = await response.blob();
        zip.file(`image_${index + 1}.jpg`, blob);
      }));
  
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
  
      const link = document.createElement("a");
      link.href = url;
      link.download = "selected_images.zip";
      document.body.appendChild(link);
      link.click();
      const localUser = JSON.parse(localStorage.getItem("otpUser"));
const sessionUser = session?.user;
const user = localUser || sessionUser;

if (user?.userId) {
  await fetch(`${API_URL}/record-download-history`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: user.userId,
      download: {
        title: "Custom Download", // backend will replace with album name
        image: selectedPhotos[0]?.image || "",
        photoCount: selectedPhotos.length,
        date: new Date().toLocaleDateString("en-GB"),
        photoUrls: selectedPhotos.map((p) => p.image),
      },
    }),
  }).catch((err) =>
    console.error("❌ Failed to record download history to DB:", err)
  );
}

      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to prepare download. Please try again.");
    } finally {
      const elapsed = Date.now() - start;
      const delay = Math.max(0, 1000 - elapsed);
      setTimeout(() => setIsDownloading(false), delay);
    }
  };
  

  if (!query)
    return <p className="text-center mt-10">No search query provided.</p>;

  if (loading) {
    return (
      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-white z-50">
        <div className="flex flex-col items-center">
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
          <p className="mt-4 text-lg font-semibold text-gray-700">
            Searching Related Photo...
          </p>
        </div>
        <div className="absolute bottom-10 text-center">
          <p className="text-lg font-bold text-gray-700">
            The latest <span className="text-black font-bold">AI</span> image search.
          </p>
        </div>
      </div>
    );
  }
  

  return (
    <div className="min-h-screen bg-white relative ">
      <Navbar setShowGallery={() => {}}  />
      <div >
        {/* Header */}
        <div className="flex justify-between items-center w-full px-4 py-3 top-0 z-30">
        <button
  onClick={() => router.push("/dashboard")}
  className="flex items-center gap-2 text-[#170645] px-4 py-1 font-normal rounded-lg text-sm sm:text-base"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
  <span>Back</span>
</button>

        <h1 className="text-center w-full font-extrabold text-xl sm:text-xl text-[#170645]">
  <span className="block sm:inline">Search Results</span>{" "}
  <span className="block sm:inline">for</span>{" "}
  <span className="block sm:inline">"{query}"</span>
</h1>

          <label className="flex items-center whitespace-nowrap gap-2 text-[#170645] font-semibold text-sm sm:text-base cursor-pointer">
            <input
              type="checkbox"
              className="mr-2 w-4 h-4 accent-[#170645]"
              checked={selectAll}
              onChange={handleSelectAll}
            />
            Select All
          </label>
        </div>

        {/* Gallery */}
        {photos.length === 0 ? (
          <p className="text-center text-gray-600 mt-6">No related photos found.</p>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 mt-4">
            {photos.map((photo, i) => (
              <div
                key={i}
                className="break-inside-avoid bg-white p-2 rounded-[30px] border-2 border-transparent hover:border-[#0084FF] hover:shadow-md"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    className="absolute top-4 right-4 z-10 w-4 h-4 accent-[#170645]"
                    checked={selectedPhotos.includes(photo)}
                    onChange={() => handleSelect(photo)}
                  />
                  <img
                    src={photo.image}
                    alt={`Photo ${i + 1}`}
                    className="w-full rounded-[30px]"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Floating Download Button */}
        {photos.length > 0 && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex flex-col sm:flex-row gap-3 px-4 py-3 rounded-full">
          <button
            onClick={handleShareAll}
            className="min-w-[150px] px-4 py-2 bg-yellow-400 text-black rounded-full flex items-center justify-center gap-2 text-sm font-semibold shadow hover:shadow-md"
          >
            <FiShare size={18} /> Share <span
    className={`${
      selectedPhotos.length > 10 ? "text-red-600 font-bold" : "text-black font-semibold"
    }`}
  >
    ({selectedPhotos.length}/10)
  </span>
          </button>
                      <button
              onClick={handleDownloadAll}
              className="min-w-[150px] px-4 py-2 bg-[#170645] text-yellow-500 rounded-full flex items-center justify-center gap-2 text-sm font-semibold shadow hover:shadow-md"
            >
              <FiDownload size={18} /> Download
            </button>
          </div>
        )}
      </div>
      {isDownloading && (
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
      <Footer />
    </div>
  );
}
