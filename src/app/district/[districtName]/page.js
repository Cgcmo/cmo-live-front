// Updated DistrictGalleryPage.js with full UI and full functionality

"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Masonry from "react-masonry-css";
import Navbar from "@/app/dashboard/components/Navbar";
import Footer from "@/app/dashboard/components/Footer";
import { FiShare, FiLink, FiDownload } from "react-icons/fi";

export default function DistrictGalleryPage() {
  const { districtName } = useParams();
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [albumPhotos, setAlbumPhotos] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const imagesPerPage = 16;


  useEffect(() => {
    if (districtName) {
      setCurrentPage(1);
    }
  }, [districtName]);
  
  // Second: only fetch albums when districtName is valid AND currentPage is set
  useEffect(() => {
    if (!districtName || !currentPage) return; // prevent empty fetch
  
    const fetchDistrictAlbums = async () => {
      try {
        const res = await fetch(
          `https://c07c-49-35-193-75.ngrok-free.app/albums-by-district?name=${districtName}&page=${currentPage}&limit=${imagesPerPage}`
        );
        const data = await res.json();
        setAlbums(data.albums || []);
        setTotalPages(Math.ceil((data.total || 0) / imagesPerPage));
      } catch (err) {
        console.error("Failed to fetch district albums", err);
      }
    };
  
    fetchDistrictAlbums();
  }, [districtName, currentPage]);

  const fetchPhotos = async (album) => {
    try {
      const res = await fetch(`https://c07c-49-35-193-75.ngrok-free.app/photos/${album._id}`);
      const data = await res.json();
      if (data.length === 0) return alert("This album is empty");
      setSelectedAlbum(album);
      setAlbumPhotos(data.photos);
      setTotalPages(Math.ceil((data.total || 0) / imagesPerPage));
      
    } catch (err) {
      console.error("Failed to fetch album photos", err);
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
    try {
      const response = await fetch(`https://c07c-49-35-193-75.ngrok-free.app/photos/${album._id}`);
      const photos = await response.json();
      if (photos.length === 0) return alert("No photos to download in this album.");

      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      photos.forEach((photo, index) => {
        const base64 = photo.image.split(",")[1];
        zip.file(`${album.name}_${index + 1}.jpg`, base64, { base64: true });
      });

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${album.name}.zip`;
      link.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const handleDownloadAll = async () => {
    if (selectedImages.length === 0) return alert("No images selected!");
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();

    selectedImages.forEach((img, idx) => {
      const base64 = img.split(",")[1];
      zip.file(`image_${idx + 1}.jpg`, base64, { base64: true });
    });

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "selected_images.zip";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShareAll = async () => {
    if (selectedImages.length === 0) return alert("No images selected!");
    const files = selectedImages.map((dataUrl, index) => {
      const byteString = atob(dataUrl.split(",")[1]);
      const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
      return new File([ab], `image_${index + 1}.jpg`, { type: mimeString });
    });
    if (navigator.canShare && navigator.canShare({ files })) {
      try {
        await navigator.share({
          title: "Check out these images!",
          files,
        });
      } catch (err) {
        console.error("Error sharing files:", err);
        alert("Error sharing images.");
      }
    } else {
      alert("Sharing files is not supported on your device or browser.");
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
          <div className="flex justify-between items-center w-full px-4 py-3">
            <button
              onClick={() => {
                setSelectedAlbum(null);
                setSelectedImages([]);
                setSelectAll(false);
              }}
              className="text-[#170645] px-4 py-1 font-normal rounded-lg text-sm sm:text-base flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back</span>
            </button>

            <h2 className="text-center font-extrabold text-xl sm:text-3xl text-[#170645] truncate max-w-[50%]">
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
          <h2 className="text-center font-extrabold text-2xl sm:text-3xl text-[#170645] mt-4">
            Albums in {districtName}
          </h2>
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
                  className="break-inside-avoid p-2 bg-white rounded-xl group transition-all duration-300 relative"
                >
                  <input
                    type="checkbox"
                    checked={selectedImages.includes(photo.image)}
                    onChange={() => handleImageSelect(photo.image)}
                    className="absolute top-3 right-3 w-4 h-4 accent-[#170645] z-10"
                  />
                  <img
                    src={photo.image}
                    alt={`Photo ${index + 1}`}
                    className="rounded-xl"
                  />
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
                      src={`data:image/jpeg;base64,${album.cover}`}
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
              <FiShare size={18} /> Share
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
    </div>
  );
}