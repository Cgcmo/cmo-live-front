import React, { useState, useEffect } from "react";
import GalleryModal from "./GalleryModal";

const AllPhotos = ({ isSelectAll, setSelectedImages: updateSelectedImages }) => {
  const [selected, setSelected] = useState([]);
  const [albums, setAlbums] = useState([{ images: [] }]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 16; // photos per page
  const [loading, setLoading] = useState(true);
  const handleSaveImages = (newImages) => {
    setAlbums((prevAlbums) => [
      { images: [...prevAlbums.flatMap(album => album.images), ...newImages] },
    ]);
  };

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true); // Start loader
  
        const startTime = Date.now();
  
        const response = await fetch(`https://c07c-49-35-193-75.ngrok-free.app/fetch-all-photos?page=${currentPage}&limit=${limit}`);
        const data = await response.json();
  
        const imageUrls = data.photos.map((item) => {
          const img = item.image;
          return img.startsWith("data:image") ? img : `data:image/jpeg;base64,${img}`;
        });
  
        setAlbums([{ images: imageUrls }]);
        setTotalPages(Math.ceil(data.total / limit));
  
        // Ensure loader stays for at least 1 second
        const elapsed = Date.now() - startTime;
        const delay = Math.max(1000 - elapsed, 0);
        setTimeout(() => setLoading(false), delay);
      } catch (error) {
        console.error("Failed to fetch photos:", error);
        setLoading(false); // In case of error
      }
    };
  
    fetchPhotos();
  }, [currentPage]);
  
  

  const toggleImageSelection = (image) => {
    setSelected((prevSelected) =>
      prevSelected.includes(image)
        ? prevSelected.filter((img) => img !== image)
        : [...prevSelected, image]
    );
  };

  // Handle 'Select All' functionality
  useEffect(() => {
    if (isSelectAll) {
      const allImages = albums.flatMap(album => album.images);
      setSelected(allImages);
      if (updateSelectedImages) updateSelectedImages(allImages);
    } else {
      setSelected([]);
      if (updateSelectedImages) updateSelectedImages([]);
    }
  }, [isSelectAll, albums, updateSelectedImages]);

  useEffect(() => {
    if (updateSelectedImages) updateSelectedImages(selected);
  }, [selected, updateSelectedImages]);

  return (
    <div className="mt-4 h-[500px] overflow-y-auto">
     {loading ? (
        <div className="flex justify-center items-center h-full">
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
                              </div>
      ) : (
        <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {albums.flatMap(album => album.images).map((image, index) => (
          <div key={index} className="relative p-1 rounded-3xl border border-white border-[2px] overflow-hidden hover:border-[#0084FF] hover:shadow-md transition hover:rounded-3xl">
            <input
              type="checkbox"
              className="absolute top-4 right-4 w-4 h-4 cursor-pointer accent-[#170645]"
              checked={selected.includes(image)}
              onChange={() => toggleImageSelection(image)}
            />
            <img
              src={image}
              alt={`Photo ${index + 1}`}
              className="w-full h-[180px] sm:h-[200px] md:h-[220px] lg:h-[250px] object-cover rounded-[25px] cursor-pointer"
              onClick={() => toggleImageSelection(image)}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4 gap-4">
  <button
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
    className="px-4 py-2 bg-[#170645] text-yellow-400 rounded"
  >
   {"<<"}
  </button>
  <span className="text-[#170645] py-2 font-semibold">
    Page {currentPage} of {totalPages}
  </span>
  <button
    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
    disabled={currentPage === totalPages}
    className="px-4 py-2 bg-[#170645] text-yellow-400 rounded"
  >
     {">>"}
  </button>
</div>
</>
      )}
    </div>
  );
};

export default AllPhotos;
