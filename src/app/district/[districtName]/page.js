
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Masonry from "react-masonry-css";
import Navbar from "@/app/dashboard/components/Navbar";
import Footer from "@/app/dashboard/components/Footer";
import { FiShare, FiLink, FiDownload } from "react-icons/fi";
import { useRouter } from "next/navigation";
import API_URL from '@/app/api';

export default function DistrictGalleryPage() {
  const { districtName } = useParams();
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [albumPhotos, setAlbumPhotos] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const imagesPerPage = 16;
  const router = useRouter();



  // useEffect(() => {
  //   const timer = setTimeout(() => setIsPageLoading(false), 1000);
  //   return () => clearTimeout(timer);
  // }, []);

  
  useEffect(() => {
    if (districtName) {
      setCurrentPage(1);
    }
  }, [districtName]);
  
  // Second: only fetch albums when districtName is valid AND currentPage is set
  useEffect(() => {
    if (!districtName || !currentPage) return;
    fetchDistrictAlbums();
  }, [districtName, currentPage]);

  const fetchDistrictAlbums = async () => {
    try {
      // setIsLoading(true);
      const res = await fetch(
        `${API_URL}/albums-by-district?name=${districtName}&page=${currentPage}&limit=${imagesPerPage}`
      );
      const data = await res.json();
      setAlbums(data.albums || []);
      setTotalPages(Math.ceil((data.total || 0) / imagesPerPage));
    } catch (err) {
      console.error("Failed to fetch district albums", err);
    } finally {
      setIsPageLoading(false);
    }
  };

  const fetchPhotos = async (album) => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_URL}/photos/${album._id}?page=${currentPage}&limit=${imagesPerPage}`);
      const data = await res.json();
      if (data.length === 0) return alert("This album is empty");
      setSelectedAlbum(album);
      setAlbumPhotos(data.photos);
      setTotalPages(Math.ceil((data.total || 0) / imagesPerPage));
    } catch (err) {
      console.error("Failed to fetch album photos", err);
    } finally {
      setIsLoading(false);
    }
  };


  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedImages(!selectAll ? albumPhotos.map(p => p.image) : []);
  };

  const handleImageSelect = (img) => {
    setSelectedImages(prev =>
      prev.includes(img) ? prev.filter(i => i !== img) : [...prev, img]
    );
  };

  const handleCopyLink = (src) => {
    navigator.clipboard.writeText(window.location.origin + src)
      .then(() => alert("Image link copied!"))
      .catch((err) => console.error("Failed to copy: ", err));
  };

  const handleShare = (src) => {
    if (navigator.share) {
      navigator.share({
        title: "Check out this album!",
        url: window.location.origin + src
      }).catch((error) => console.error("Error sharing:", error));
    } else {
      alert("Sharing is not supported in your browser.");
    }
  };

  const handleDownloadAlbum = async (album) => {
    if (!album || !album._id) return;
  
    try {
      setIsLoading(true);
  
      const response = await fetch(`${API_URL}/photos/${album._id}?limit=0`);
      const data = await response.json();
      const photos = data.photos;
  
      if (!Array.isArray(photos) || photos.length === 0) {
        alert("No photos to download in this album.");
        return;
      }
  
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
  
      await Promise.all(photos.map(async (photo, index) => {
        const response = await fetch(`${API_URL}/proxy-image?url=${encodeURIComponent(photo.image)}`);
        const blob = await response.blob();
        zip.file(`${album.name}_${index + 1}.jpg`, blob);
      }));
  
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
  
      const link = document.createElement("a");
      link.href = url;
      link.download = `${album.name}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading album:", error);
      alert("❌ Failed to download album.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownloadAll = async () => {
    if (selectedImages.length === 0) {
      alert("No images selected!");
      return;
    }
  
    setIsLoading(true);
    const startTime = Date.now();
  
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
  
      await Promise.all(selectedImages.map(async (url, index) => {
        const response = await fetch(`${API_URL}/proxy-image?url=${encodeURIComponent(photo.image)}`)
        const blob = await response.blob();
        zip.file(`image_${index + 1}.jpg`, blob);
      }));
  
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
  
      const link = document.createElement("a");
      link.href = url;
      link.download = "selected_images.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download all error:", error);
      alert("❌ Failed to download selected images.");
    } finally {
      const elapsedTime = Date.now() - startTime;
      const delay = Math.max(0, 1000 - elapsedTime);
      setTimeout(() => {
        setIsLoading(false);
      }, delay);
    }
  };
  
  const handleShareAll = async () => {
    if (selectedImages.length === 0) {
      alert("No images selected!");
      return;
    }
  
    if (selectedImages.length > 10) {
      alert("You can only share up to 10 images at once.");
      return;
    }
  
    setIsLoading(true);
  
    try {
      const files = await Promise.all(
        selectedImages.map(async (url, index) => {
          const response = await fetch(`${API_URL}/proxy-image?url=${encodeURIComponent(url)}`);
          const blob = await response.blob();
          return new File([blob], `image_${index + 1}.jpg`, { type: blob.type });
        })
      );
  
      if (navigator.canShare && navigator.canShare({ files })) {
        await navigator.share({
          title: "Check out these images!",
          text: "Shared via Choicesay!",
          files,
        });
      } else {
        alert("Sharing files is not supported on your device or browser.");
      }
    } catch (error) {
      console.error("Error sharing files:", error);
      alert("Error sharing images.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const breakpointColumnsObj = {
    default: 4,
    1280: 3,
    768: 2,
    500: 1,
  };


  

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-4 px-4">
        {selectedAlbum ? (
          <div className="flex items-center justify-between flex-wrap gap-4 sm:px-1 mt-6 mb-4">
            <button
              onClick={() => {
                setSelectedAlbum(null);
                setSelectedImages([]);
                setSelectAll(false);
                setCurrentPage(1); // reset page
                fetchDistrictAlbums(); // ✅ re-fetch albums to reset totalPages correctly
              }}
              className="flex items-center gap-2 text-[#170645]  py-1 font-normal rounded-lg text-sm sm:text-base"            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back</span>
            </button>

            <h2 className="text-center font-extrabold text-xl sm:text-3xl text-[#170645] flex-1 truncate max-w-full">
              {selectedAlbum.name}
            </h2>

            <label className="flex items-center gap-2 text-[#170645] font-semibold text-sm sm:text-base cursor-pointer">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="accent-[#170645] w-4 h-4"
              />
              <span>Select All</span>
            </label>
          </div>
        ) : (
          <div className="flex items-center justify-between flex-wrap gap-4 sm:px-1 mt-6 mb-4">
    {/* Back Button absolutely positioned on the left */}
    <button
      onClick={() => router.push("/dashboard")}
      className="flex items-center gap-2 text-[#170645] py-1 font-normal rounded-lg text-sm sm:text-base"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
        viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      <span>Back </span>
    </button>

    {/* Center Heading */}
    <h2 className="text-center font-extrabold text-xl sm:text-3xl text-[#170645] flex-1 truncate max-w-full">
      Albums in {decodeURIComponent(districtName)}
    </h2>
    <div className="flex items-center gap-2 text-[#170645] font-semibold text-sm sm:text-base cursor-pointer"></div>
  </div>
        )}

        {!selectedAlbum && albums.length === 0 ? (
          <div className="flex justify-center items-center h-[60vh] w-full">
            <p className="text-3xl sm:text-5xl font-extrabold text-gray-400 text-center">
              No Album Found
            </p>
          </div>
        ) : (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid mt-4"
            columnClassName="my-masonry-grid_column"
          >
            {selectedAlbum
              ? albumPhotos.map((photo, index) => (
                <div
                  key={index}
                  className="break-inside-avoid bg-white p-4 rounded-lg group transition-all duration-300 cursor-pointer"
                >
                  
                  <div className="relative rounded-[30px] overflow-hidden">
                    <input
                      type="checkbox"
                      className="absolute top-4 right-4 z-10 w-4 h-4 accent-[#170645]"
                      checked={selectedImages.includes(photo.image)}
                      onChange={() => handleImageSelect(photo.image)}
                    />
                    <img
                      src={photo.image}
                      alt={`Photo ${index + 1}`}
                      className="w-full rounded-[30px] transition-all duration-300 group-hover:brightness-75"
                    />
                  </div>
                </div>
                          
              ))
              : albums.map((album, index) => (
                <div
                  key={index}
                  onClick={() => fetchPhotos(album)}
                  className="break-inside-avoid bg-white p-4 rounded-lg group transition-all duration-300 cursor-pointer"
                >
                  <div className="relative rounded-[30px] overflow-hidden">
                    <img
                      src={album.cover}
                      alt={album.name}
                      className="w-full rounded-[30px] transition-all duration-300 group-hover:brightness-75"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-between items-end p-4 rounded-[30px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="text-left">
                        <span className="text-white font-extrabold text-4xl leading-none block">{album.name}</span>
                        <span className="text-white font-semibold text-lg block mt-[-5px]">Click to view</span>
                      </div>
                      <span className="text-white text-lg font-medium">{album.date}</span>
                    </div>
                  </div>
                  <h3 className="text-[20px] font-bold capitalize text-black mt-2 p-2 rounded-md">
                    {album.name}
                  </h3>
                  <div className="flex justify-start space-x-3 ml-2">
                    <button onClick={(e) => { e.stopPropagation(); handleShare(`/album/${album._id}`); }} className="border border-gray-500 p-[6px] rounded-full hover:bg-gray-300">
                      <FiShare size={16} className="text-gray-500" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleCopyLink(`/album/${album._id}`); }} className="border border-gray-500 p-[6px] rounded-full hover:bg-gray-300">
                      <FiLink size={16} className="text-gray-500" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDownloadAlbum(album); }} className="border border-gray-500 p-[6px] rounded-full hover:bg-gray-300">
                      <FiDownload size={16} className="text-gray-500" />
                    </button>
                  </div>
                </div>
              ))}

          </Masonry>
        )}

        {selectedAlbum && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex flex-col sm:flex-row gap-3 px-4 py-3 rounded-full">
            <button onClick={handleShareAll} className="min-w-[150px] px-4 py-2 bg-yellow-400 text-black rounded-full flex items-center justify-center gap-2 text-sm font-semibold shadow hover:shadow-md">
              <FiShare size={18} /> Share <span className={`${selectedImages.length > 10 ? "text-red-600 font-bold" : "text-black font-semibold"}`}>
        ({selectedImages.length}/10)
      </span>
            </button>
            <button onClick={handleDownloadAll} className="min-w-[150px] px-4 py-2 bg-[#170645] text-yellow-500 rounded-full flex items-center justify-center gap-2 text-sm font-semibold shadow hover:shadow-md">
              <FiDownload size={18} /> Download
            </button>
          </div>
        )}
      </div>

      {totalPages > 1 && (
  <div className="w-full text-center mt-6 mb-4">
  <div className="inline-flex space-x-4">
    <button
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
      className="px-4 py-2 border rounded-lg bg-[#170645] text-yellow-500"
    >
      {"<<"}
    </button>
    <span className="px-4 py-2 border rounded-lg bg-[#170645] text-yellow-500">
      Page {currentPage} of {totalPages}
    </span>
    <button
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
      className="px-4 py-2 border rounded-lg bg-[#170645] text-yellow-500"
    >
      {">>"}
    </button>
  </div>
</div>

)}

      <Footer />

      {isPageLoading && (
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
    </div>
  );
}