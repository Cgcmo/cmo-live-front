"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Masonry from "react-masonry-css";
import Navbar from "@/app/dashboard/components/Navbar";
import Footer from "@/app/dashboard/components/Footer";

export default function DistrictGalleryPage() {
  const { districtName } = useParams();
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [albumPhotos, setAlbumPhotos] = useState([]);

  const fetchPhotos = async (album) => {
    try {
      const res = await fetch(`https://cmo-back-livee.onrender.com/photos/${album._id}`);
      const data = await res.json();
      if (data.length === 0) {
        alert("This album is empty");
        return;
      }
      setSelectedAlbum(album);
      setAlbumPhotos(data);
    } catch (err) {
      console.error("Failed to fetch photos", err);
    }
  };
  
  useEffect(() => {
    if (!districtName) return;

    const fetchDistrictAlbums = async () => {
      try {
        const res = await fetch(`http://localhost:5000/albums-by-district?name=${districtName}`);
        const data = await res.json();
        setAlbums(data);
      } catch (err) {
        console.error("Failed to fetch district albums", err);
      }
    };

    fetchDistrictAlbums();
  }, [districtName]);

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
        <h2 className="text-2xl font-bold mb-4 text-[#170645]">
          Albums in {districtName}
        </h2>

        {selectedAlbum && (
  <div className="px-4 py-2">
    <button
      onClick={() => {
        setSelectedAlbum(null);
        setAlbumPhotos([]);
      }}
      className="text-[#170645] px-4 py-1 font-normal rounded-lg text-sm sm:text-base"
    >
      ← Back to Albums
    </button>
  </div>
)}


        {selectedAlbum === null ? (
  <Masonry
    breakpointCols={breakpointColumnsObj}
    className="my-masonry-grid"
    columnClassName="my-masonry-grid_column"
  >
    {albums.map((album, index) => (
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
        </div>
        <h3 className="text-lg font-bold capitalize text-black mt-2">
          {album.name}
        </h3>
        <p className="text-gray-500 text-sm">{album.date}</p>
      </div>
    ))}
  </Masonry>
) : (
  <Masonry
    breakpointCols={breakpointColumnsObj}
    className="my-masonry-grid"
    columnClassName="my-masonry-grid_column"
  >
    {albumPhotos.map((photo, index) => (
      <div key={index} className="p-2">
        <img
          src={photo.image}
          alt={`Photo ${index + 1}`}
          className="w-full rounded-[30px]"
        />
      </div>
    ))}
  </Masonry>
)}

      </div>

      <Footer />
    </div>
  );
}
