"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "../../dashboard/components/Navbar";
import Footer from "../../dashboard/components/Footer";
import { FiShare, FiLink, FiDownload } from "react-icons/fi";
import JSZip from "jszip";
import Masonry from "react-masonry-css";
import API_URL from '@/app/api';

export default function AlbumViewer() {
  const { albumId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [albumName, setAlbumName] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const imagesPerPage = 16;
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const breakpointColumnsObj = {
    default: 4,
    1280: 3,
    768: 2,
    500: 1,
  };
  
  
  useEffect(() => {
    const handleClick = (e) => {
      const clickedInsideNavbar = document.querySelector("nav")?.contains(e.target);
      const clickedInsideFooter = document.querySelector("footer")?.contains(e.target);
  
      if (clickedInsideNavbar || clickedInsideFooter) {
        e.preventDefault();
        e.stopPropagation();
        alert("Navigation is currently disabled. Redirecting to home...");
        window.location.href = "/";
      }
    };
  
    document.addEventListener("click", handleClick, true); // Use capture phase
  
    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, []);
    
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await fetch(`${API_URL}/photos/${albumId}?page=${currentPage}&limit=${imagesPerPage}`);
        const photoData = await res.json();
setPhotos(photoData.photos);
setTotalPages(Math.ceil(photoData.total / imagesPerPage));

        const albumRes = await fetch(`${API_URL}/albums`);
const albumData = await albumRes.json();
const album = albumData.albums.find((a) => a._id === albumId);

        if (album) setAlbumName(album.name);
      } catch (error) {
        console.error("Error fetching album:", error);
      } finally {
        setLoading(false);
        setIsLoading(false);
      }
    };

    if (albumId) {
      fetchPhotos();
    }
  }, [albumId, currentPage]);

  
  

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

  const handleDownloadAll = async () => {
    if (selectedPhotos.length === 0) {
      alert("No photos selected");
      return;
    }
  
    setIsLoading(true);
    const zip = new JSZip();
  
    try {
      await Promise.all(
        selectedPhotos.map(async (photo, i) => {
          const response = await fetch(
            `${API_URL}/proxy-image?url=${encodeURIComponent(photo.image)}`
          );
          const blob = await response.blob();
          zip.file(`photo_${i + 1}.jpg`, blob);
        })
      );
  
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${albumName || "album"}.zip`;
      link.click();
      URL.revokeObjectURL(url);
  
      // ✅ Record download to MongoDB
      const localUser = JSON.parse(localStorage.getItem("otpUser"));
      const user = localUser; // Or include session.user fallback if needed
  
      if (user?.userId) {
        await fetch(`${API_URL}/record-download-history`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.userId,
            download: {
              title: albumName || "Downloaded Album",
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
    } catch (error) {
      console.error("Download failed", error);
      alert("Error while downloading");
    } finally {
      setIsLoading(false);
    }
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

  setIsLoading(true); // ✅ Show loader

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
        title: "Shared Images",
        files,
      });
    } else {
      alert("Sharing not supported on this browser/device.");
    }
  } catch (err) {
    console.error("Sharing failed:", err);
    alert("Sharing failed");
  } finally {
    setIsLoading(false); // ✅ Hide loader
  }
};


  if (loading) {
    return (
      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-white z-50">
                    <div className="flex flex-col items-center">
                      <div className="relative w-20 h-20">
                        {/* Circular Loading Spinner */}
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
                      <p className="mt-4 text-lg font-semibold text-gray-700">Searching Related Photo...</p>
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
      <div className="relative">
  <Navbar />
  <div
    className="absolute inset-0 z-50 cursor-not-allowed"
    style={{ pointerEvents: "all" }}
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      setShowLoginModal(true);
    }}
  ></div>
</div>

      <div className="p-4">
        <div className="relative w-full mb-4 flex items-center">
          <h1 className="text-3xl font-extrabold text-[#170645] absolute left-1/2 transform -translate-x-1/2">
            {albumName || "Shared Album"}
          </h1>
          <label className="ml-auto mr-3 flex items-center text-gray-600 cursor-pointer text-md">
            <input
              type="checkbox"
              className="mr-2 w-4 h-4 accent-[#170645]"
              checked={selectAll}
              onChange={handleSelectAll}
            />
            Select All
          </label>
        </div>

        {photos.length === 0 ? (
  <div className="flex justify-center items-center h-[50vh] w-full">
    <p className="text-3xl sm:text-5xl font-extrabold text-gray-400 text-center">
      No Photos Available
    </p>
  </div>
) : (

<Masonry
  breakpointCols={breakpointColumnsObj}
  className="my-masonry-grid"
  columnClassName="my-masonry-grid_column"
>
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
                  onClick={() => handleSelect(photo)}
                />
              </div>
            </div>
          ))}
        
        </Masonry>
        )}

        {totalPages > 1 && (
  <div className="flex justify-center mt-6 mb-4 space-x-4">
    <button
  onClick={async () => {
    if (currentPage === 1) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000)); // Minimum 1 second delay
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }}
  disabled={currentPage === 1}
  className="px-4 py-2 border rounded-lg bg-[#170645] text-yellow-500"
>
  {"<<"}
</button>

<span className="px-4 py-2 border rounded-lg bg-[#170645] text-yellow-500">
  Page {currentPage} of {totalPages}
</span>

<button
  onClick={async () => {
    if (currentPage === totalPages) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000)); // Minimum 1 second delay
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }}
  disabled={currentPage === totalPages}
  className="px-4 py-2 border text-sm rounded-lg text-yellow-500 bg-[#170645]"
>
  {">>"}
</button>

  </div>
)}

        {/* Floating Download Button */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex flex-col sm:flex-row gap-3 px-4 py-3 rounded-full">
  <button
    onClick={handleShareAll}
    className="min-w-[150px] px-4 py-2 bg-yellow-400 text-black rounded-full flex items-center justify-center gap-2 text-sm font-semibold shadow hover:shadow-md"
  >
    <FiShare size={18} /> Share<span className={`${selectedPhotos.length > 10 ? "text-red-600 font-bold" : "text-black font-semibold"}`}>
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

      </div>
      <div className="relative">
  <Footer />
  <div
    className="absolute inset-0 z-50 cursor-not-allowed"
    style={{ pointerEvents: "all" }}
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      setShowLoginModal(true);
    }}
  ></div>
</div>

{showLoginModal && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out">
    <div className="bg-white rounded-xl p-6 w-[90%] max-w-sm shadow-lg text-center fade-in-modal">
      <h2 className="text-lg font-bold mb-4 text-[#170645]">Authentication Required</h2>
      <p className="text-sm text-gray-700 mb-6">You're not signed in. Please log in to access this feature.</p>
      <button
        className="bg-[#170645] text-yellow-400 px-5 py-2 rounded-full font-semibold hover:bg-[#0e0433]"
        onClick={() => {
          setShowLoginModal(false);
          window.location.href = "/";
        }}
      >
        Login Now
      </button>
    </div>
  </div>
)}


      {isLoading && (
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


<style jsx>{`
  .fade-in-modal {
    animation: fadeInUp 0.3s ease-out forwards;
  }

  @keyframes fadeInUp {
    0% {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`}</style>


    </div>
  );
}
