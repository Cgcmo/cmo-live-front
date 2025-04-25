"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "../../dashboard/components/Navbar";
import Footer from "../../dashboard/components/Footer";
import { FiShare, FiLink, FiDownload } from "react-icons/fi";
import JSZip from "jszip";

export default function AlbumViewer() {
  const { albumId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [albumName, setAlbumName] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await fetch(`https://5f64-2409-4043-400-c70d-f18c-bef4-7b7d-6e83.ngrok-free.app/photos/${albumId}`);
        const photoData = await res.json();
        setPhotos(photoData);

        const albumRes = await fetch("https://5f64-2409-4043-400-c70d-f18c-bef4-7b7d-6e83.ngrok-free.app/albums");
        const albumList = await albumRes.json();
        const album = albumList.find((a) => a._id === albumId);
        if (album) setAlbumName(album.name);
      } catch (error) {
        console.error("Error fetching album:", error);
      } finally {
        setLoading(false);
      }
    };

    if (albumId) fetchPhotos();
  }, [albumId]);

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
    if (selectedPhotos.length === 0) return alert("No photos selected");
    const zip = new JSZip();

    selectedPhotos.forEach((photo, i) => {
      const base64 = photo.image.split(",")[1];
      zip.file(`photo_${i + 1}.jpg`, base64, { base64: true });
    });

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${albumName || "album"}.zip`;
    link.click();
  };
  const handleShareAll = async () => {
    if (selectedPhotos.length === 0) return alert("No images selected!");
  
    const files = selectedPhotos.map((photo, index) => {
      const byteString = atob(photo.image.split(",")[1]);
      const mimeString = photo.image.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
      return new File([ab], `image_${index + 1}.jpg`, { type: mimeString });
    });
  
    if (navigator.canShare && navigator.canShare({ files })) {
      try {
        await navigator.share({
          title: "Shared Images",
          files,
        });
      } catch (err) {
        console.error("Sharing failed:", err);
        alert("Sharing failed");
      }
    } else {
      alert("Sharing not supported on this browser/device.");
    }
  };
  

  if (loading) return <div className="text-center text-black mt-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-white relative pb-24">
      <Navbar />
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

        {/* Floating Download Button */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex flex-col sm:flex-row gap-3 px-4 py-3 rounded-full">
  <button
    onClick={handleShareAll}
    className="min-w-[150px] px-4 py-2 bg-yellow-400 text-black rounded-full flex items-center justify-center gap-2 text-sm font-semibold shadow hover:shadow-md"
  >
    <FiShare size={18} /> Share
  </button>
  <button
    onClick={handleDownloadAll}
    className="min-w-[150px] px-4 py-2 bg-[#170645] text-yellow-500 rounded-full flex items-center justify-center gap-2 text-sm font-semibold shadow hover:shadow-md"
  >
    <FiDownload size={18} /> Download
  </button>
</div>

      </div>
      <Footer />
    </div>
  );
}
