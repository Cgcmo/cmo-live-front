

// import React, { useState , useEffect} from "react";
// import ModalPopup from "./ModalPopup"; // Importing Modal for 'Create Folder' functionality
// import GalleryModal from "./GalleryModal";
// import { FiShare, FiLink, FiDownload } from "react-icons/fi";
// import JSZip from "jszip";
// import { saveAs } from "file-saver";
// import API_URL from '@/app/api';

// const fetchImageAsBlob = async (url) => {
//   const response = await fetch(`${API_URL}/proxy-image?url=${encodeURIComponent(url)}`);
//   if (!response.ok) {
//     throw new Error(`Failed to fetch image: ${response.statusText}`);
//   }
//   return await response.blob();
// };

// const imagesPerPage = 16;

// const AllPhotos = ({  albums, setAlbums, currentTab, fetchAllStats } ) => {
//   const [selectedAlbum, setSelectedAlbum] = useState(null);
//   const [isFolderModalOpen, setIsFolderModalOpen] = useState(false); // Create Folder Modal state
//   const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [isDeleting, setIsDeleting] = useState(false);
  

//   // Albums with multiple images

//   useEffect(() => {
//     fetchAlbums();
    
//   }, []);

//   const fetchAlbums = async () => {
//     try {
//       const response = await fetch(`${API_URL}/albums`);
//       if (!response.ok) {
//         throw new Error("Failed to fetch albums");
//       }
//       const data = await response.json();
//       const safeArray = Array.isArray(data) ? data : data.albums || [];
//       setAlbums(safeArray);
//     } catch (error) {
//       console.error("Error fetching albums:", error);
//     }
//   };
  


//   const fetchPhotos = async (album) => {
//     if (!album || !album._id) return;
//     try {
//       const response = await fetch(`${API_URL}/photos/${album._id}`);
//       if (!response.ok) throw new Error("Failed to fetch photos");
//       const data = await response.json();
//       console.log("📸 Fetched Photos:", data);
  
//       const photos = data.photos || []; // ✅ correctly pick photos array
  
//       setSelectedAlbum({ ...album, images: photos.length > 0 ? photos : [] });
//     } catch (error) {
//       console.error("Error fetching photos:", error);
//       setSelectedAlbum({ ...album, images: [] });
//     }
//   };
  
//   const handleCreateAlbum = async (newAlbum) => {
//     try {
//       const response = await fetch(`${API_URL}/create-album`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(newAlbum),
//       });
//       if (response.ok) {
//         alert("Album created successfully");
//         const data = await response.json(); // ✅ Get response with message + album

//             setAlbums((prevAlbums) => [data.album, ...prevAlbums]); // ✅ Instantly update UI
            
//             alert(data.message); // ✅ Show success message
//             await fetchAlbums();       // ✅ auto-refresh album list
//       await fetchAllStats(); 
//             setIsFolderModalOpen(false);
//       } else {
//         alert("Failed to create album");
//       }
//     } catch (error) {
//       console.error("Error uploading file:", error);
//     }
//   };



//   const toggleSelection = (album) => {
//     console.log("🛠️ Selecting album:", album);

//     setSelectedItems((prev) =>
//         prev.some((item) => item._id === album._id)
//             ? prev.filter((item) => item._id !== album._id)  // Remove if already selected
//             : [...prev, album] // Add full album object
//     );
// };

// const togglePhotoSelection = (photo) => {
//   console.log("📷 Selecting photo:", photo);

//   setSelectedItems((prev) =>
//       prev.some((item) => item.photo_id === photo.photo_id)
//           ? prev.filter((item) => item.photo_id !== photo.photo_id) // Remove if already selected
//           : [...prev, photo] // Add full photo object
//   );
// };


// const handleSelectAll = () => {
//   if (selectedAlbum) {
//     // Photo Section: Select/Deselect All Photos
//     if (selectedItems.length === selectedAlbum.images.length) {
//       setSelectedItems([]);
//     } else {
//       setSelectedItems([...selectedAlbum.images]);
//     }
//   } else {
//     // Album Section: Fix selection issue by comparing actual IDs
//     const allAlbumIds = albums.map(album => album._id); 
//     const selectedAlbumIds = selectedItems.map(item => item._id); 

//     if (allAlbumIds.every(id => selectedAlbumIds.includes(id))) {
//       setSelectedItems([]); // Deselect all
//     } else {
//       setSelectedItems([...albums]); // Select all
//     }
//   }
// };

// const handleShare = (album) => {
//   if (!album || !album._id) return;
//   const shareData = {
//     title: album.name,
//     text: `Check out this album: ${album.name}`,
//     url: `${window.location.origin}/album/${album._id}`
//   };

//   if (navigator.share) {
//     navigator.share(shareData)
//       .then(() => console.log("Shared successfully"))
//       .catch((error) => console.error("Share failed:", error));
//   } else {
//     alert("Sharing is not supported in this browser.");
//   }
// };

// const handleCopyLink = (album) => {
//   if (!album || !album._id) return;
//   const link = `${window.location.origin}/album/${album._id}`;
//   navigator.clipboard.writeText(link)
//     .then(() => alert("Link copied to clipboard!"))
//     .catch((err) => console.error("Failed to copy link:", err));
// };

// const handleDownloadAlbum = async (album) => {
//   if (!album || !album._id) return;

//   try {
//     const response = await fetch(`${API_URL}/photos/${album._id}`);
//     if (!response.ok) throw new Error("Failed to fetch photos");
//     const data = await response.json();
//     const photos = data.photos || [];

//     if (photos.length === 0) {
//       alert("No photos to download in this album.");
//       return;
//     }

//     const zip = new JSZip();

//     for (let i = 0; i < photos.length; i++) {
//       const photo = photos[i];
//       const blob = await fetchImageAsBlob(photo.image);
//       zip.file(`${album.name}_photo_${i + 1}.jpg`, blob);
//     }

//     zip.generateAsync({ type: "blob" }).then((content) => {
//       const link = document.createElement("a");
//       link.href = URL.createObjectURL(content);
//       link.download = `${album.name}.zip`;
//       link.click();
//     });
//   } catch (error) {
//     console.error("Error downloading album:", error);
//   }
// };

  
// const handleDownload = async () => {
//   if (selectedItems.length === 0) return;

//   const zip = new JSZip();

//   for (const item of selectedItems) {
//     if (item.photo_id) {
//       const blob = await fetchImageAsBlob(item.image);
//       zip.file(`photo_${item.photo_id}.jpg`, blob);
//     } else if (item._id) {
//       try {
//         const response = await fetch(`${API_URL}/photos/${item._id}`);
//         if (!response.ok) throw new Error("Failed to fetch photos");
//         const data = await response.json();
//         const photos = data.photos || [];

//         for (let i = 0; i < photos.length; i++) {
//           const photo = photos[i];
//           const blob = await fetchImageAsBlob(photo.image);
//           zip.file(`${item.name}_photo_${i + 1}.jpg`, blob);
//         }

//       } catch (error) {
//         console.error("Error fetching photos for download:", error);
//       }
//     }
//   }

//   zip.generateAsync({ type: "blob" }).then((content) => {
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(content);
//     link.download = "download.zip";
//     link.click();
//   });
// };


//       const handleDelete = async () => {
//         if (selectedItems.length === 0) return;
//         setIsDeleting(true); 
//         try {
//           if (selectedAlbum) {
//             // Deleting selected photos inside an album
//             for (const photo of selectedItems) {
//               if (!photo.photo_id) {
//                 console.error("❌ Missing photo_id for:", photo);
//                 continue; // Skip invalid items
//               }

//               const response = await fetch(
//                 `${API_URL}/photo/${selectedAlbum._id}/${photo.photo_id}`,
//                 { method: "DELETE" }
//               );

//               if (!response.ok) {
//                 console.error("❌ Failed to delete photo:", response.statusText);
//               }
//             }
//             await fetchPhotos(selectedAlbum); // ✅ Refresh album after deletion
//           } else {
//             // Deleting albums
//             const response = await fetch(`${API_URL}/delete-albums`, {
//               method: "DELETE",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify({ albumIds: selectedItems.map((album) => album._id) }),
//             });

//             if (!response.ok) {
//               console.error("❌ Failed to delete albums:", response.statusText);
//             }

//             fetchAlbums(); // ✅ Refresh album list
//           }

//           setSelectedItems([]);
//         } catch (error) {
//           console.error("Error deleting:", error);
//           console.log("🛠️ Deleting photo with ID:", photo.photo_id, "from album:", selectedAlbum._id);

//         } finally {
//           setIsDeleting(false); // Stop spinner
//         }
//       };





//   return (
//     <div className="mt-4">
//       {/* If no album is selected, show album grid */}
//       <div className="flex justify-between items-center gap-4 mb-4 flex-wrap sm:flex-nowrap">
//   {/* Back button on left (only in photo gallery section) */}
//   {selectedAlbum && (
//     <button 
//       className="px-4 py-2 bg-[#170645] text-[#FFE100] rounded-lg flex items-center gap-2" 
//       onClick={() => setSelectedAlbum(null)}
//     >
//       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
//         viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//         <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
//       </svg>
//       <span>Back to Events</span>
//     </button>
//   )}

//   {/* Right-aligned button group */}
//   <div className="flex items-center gap-2 sm:ml-auto flex-wrap sm:flex-nowrap">
//     {/* Select All */}
//     <div className="flex items-center gap-3 ml-[23px] mr-2 shrink-0">
//       <input
//         type="checkbox"
//         id="selectAll"
//         className="w-4 h-4 accent-[#170645] cursor-pointer"
//         onChange={handleSelectAll}
//         checked={selectedItems.length === (selectedAlbum ? selectedAlbum.images.length : albums.length)}
//       />
//       <label htmlFor="selectAll" className="text-sm cursor-pointer text-[#686868]">
//         Select All
//       </label>
//     </div>

//     {/* Download Button (Fixed Width & Prevent Wrapping) */}
//     <button
//       className="bg-[#170645] text-[#FFE100] w-[150px] h-[40px] rounded-full font-normal whitespace-nowrap shrink-0"
//       onClick={handleDownload}
//     >
//       Download
//     </button>

//     {/* Delete Button (Prevent Wrapping) */}
//     <button
//   type="button"
//   disabled={isDeleting}
//   className={`w-[150px] h-[40px] rounded-full flex items-center justify-center gap-2 px-4 text-white font-medium 
//     ${isDeleting ? 'bg-rose-600 cursor-not-allowed' : 'border-2 border-red-500 text-red-500 hover:bg-red-100'}`}
//   onClick={handleDelete}
// >
//   {isDeleting ? (
//     <>
//       <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
//         <circle
//           className="opacity-25"
//           cx="12"
//           cy="12"
//           r="10"
//           stroke="currentColor"
//           strokeWidth="4"
//           fill="none"
//         />
//         <path
//           className="opacity-75"
//           fill="currentColor"
//           d="M4 12a8 8 0 018-8v4l4-4-4-4v4a8 8 0 100 16v-4l-4 4 4 4v-4a8 8 0 01-8-8z"
//         />
//       </svg>
//       Deleting
//     </>
//   ) : (
//     <>
//       <img src="/del_i.png" alt="Delete" className="w-6 h-6" />
//     </>
//   )}
// </button>

//   </div>
// </div>


//       {selectedAlbum === null ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-4">
//           {/* Create Folder Card */}
//           <div
//             onClick={() => setIsFolderModalOpen(true)}
//             className="relative flex justify-start items-end w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[404px] border border-[#686868] rounded-[32px] p-4 cursor-pointer hover:shadow-lg transition mt-4"
//           >
//             <div className="flex flex-col items-start text-left pl-4">
//               <img src="/Create_F.png" alt="Create Folder" className="w-[34px] h-[34px] mb-1" />
//               <p className="text-[#170645] text-[18px] font-medium mt-4 mb-1">Create Event</p>
//               <p className="text-[#686868] text-[14px] mt-1 mb-6">Example: New Event</p>
//             </div>
//           </div>

//           {/* Modal for Folder Creation */}
//           <ModalPopup isOpen={isFolderModalOpen} setIsOpen={setIsFolderModalOpen} fetchAlbums={fetchAlbums} onCreateAlbum={handleCreateAlbum} />

//           {/* Album Cards */}
//           {albums.map((album, i) => (
//             <div key={i} className="p-4 rounded-lg cursor-pointer"  onClick={() => fetchPhotos(album)}>
//               <div className="relative border border-[#686868] rounded-[32px] w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[404px] rounded-[25px] overflow-hidden">
              
//               <img src={album.cover} alt={album.name} className="w-full h-full object-fill rounded-[32px]" />
//               </div>
//               <div className="flex items-center gap-4 ml-1">
//               <input type="checkbox" className=" accent-[#170645] w-4 h-4 mt-2 border-2 border-gray-400 rounded-[25px] " onChange={() => toggleSelection(album)} onClick={(e) => e.stopPropagation()}  checked={selectedItems.some(item => item._id === album._id)}  />
//               <p className="text-start font-bold text-[18px] text-black mt-2">{album.name}</p>
//               </div>
//               <div className="flex justify-start space-x-4 mt-1 w-full">
//               {/* <input type="checkbox" className="appearance-none mt-2 w-[30px] h-[30px] border-2 border-gray-400 rounded-full checked:bg-blue-500 checked:border-blue-500 cursor-pointer transition-all" onChange={() => toggleSelection(album)} checked={selectedItems.includes(album)} /> */}
//                 <button onClick={(e) => { e.stopPropagation(); handleShare(album); }} className="mt-2 border border-gray-500 p-[6px] rounded-full hover:bg-gray-100">
//                 <FiShare size={15} className="text-gray-500 group-hover:text-white" />
//                 </button>
//                 <button  onClick={(e) => { e.stopPropagation(); handleCopyLink(album); }} className="mt-2 border border-gray-500 p-[6px] rounded-full hover:bg-gray-100">
//                 <FiLink size={15} className="text-gray-500 group-hover:text-white" />
//                 </button>
//                 <button  onClick={(e) => { e.stopPropagation(); handleDownloadAlbum(album); }} className="mt-2 border border-gray-500 p-[6px] rounded-full hover:bg-gray-100">
//                 <FiDownload size={15} className="text-gray-500 group-hover:text-white" />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         //photo section:

//         <div>
//           {/* <button className="mb-4 px-4 py-2 bg-[#170645] text-[#FFE100] rounded-lg" onClick={() => setSelectedAlbum(null)}>
//             ← Back to Events
//           </button> */}
//           <div className="grid grid-cols-2  max-[365px]:grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//             {/* Create Photo Gallery Box inside photo section */}
//             <div
//                onClick={() => setIsGalleryModalOpen(true)}
//               className="flex flex-col justify-end items-start pl-8 pb-6 w-full h-[180px] sm:h-[200px] md:h-[220px] lg:h-[250px] border border-gray-400 rounded-[25px] cursor-pointer hover:shadow-lg transition bg-white mt-2"
//             >
//               <img src="/Create_F.png" alt="Create" className="w-[27px] h-[27px] mb-2" />
//               <p className="text-[#170645] text-lg ">Create Photo Gallery</p>
//               <p className="text-gray-500 text-sm  ml-[1px] ">Max Size 5 MB</p>
//             </div>

//             {selectedAlbum?.images.map((photo, index) => (
//   <div 
//     key={index} 
//     className="p-1 relative rounded-[25px] border border-white border-[2px] overflow-hidden hover:border-[#0084FF] hover:shadow-md transition cursor-pointer"
//     onClick={() => togglePhotoSelection(photo)}   // ✅ Make entire box clickable
//   >
//     <input 
//       type="checkbox" 
//       className="accent-[#170645] absolute top-4 right-4 pointer-events-none"  // ✅ Disable checkbox pointer events
//       checked={selectedItems.some(item => item.photo_id === photo.photo_id)}  
//       readOnly  // ✅ prevent warning
//     />
//     <img  
//       src={photo.image} 
//       alt={`Photo ${index + 1}`} 
//       className="w-full h-[180px] sm:h-[200px] md:h-[220px] lg:h-[250px] object-cover rounded-[25px]" 
//       onError={(e) => console.error("Image load error", e.target.src)} 
//     />
//   </div>
// ))}

//           </div>
//         </div>
//       )}

//     <ModalPopup 
//         setIsOpen={setIsFolderModalOpen} 
//         onCreateAlbum={handleCreateAlbum} 
//         fetchAlbums={fetchAlbums}
//         fetchAllStats={fetchAllStats }
//         isOpen={isFolderModalOpen}
//       />
//     { selectedAlbum?._id && (
//         <GalleryModal isOpen={isGalleryModalOpen} setIsOpen={setIsGalleryModalOpen} albumId={selectedAlbum?._id} fetchPhotos={fetchPhotos} fetchAllStats={fetchAllStats} />
//       )}

//     </div>
//   );
// };

// export default AllPhotos;




import React, { useState , useEffect} from "react";
import ModalPopup from "./ModalPopup"; // Importing Modal for 'Create Folder' functionality
import GalleryModal from "./GalleryModal";
import { FiShare, FiLink, FiDownload } from "react-icons/fi";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import API_URL from '@/app/api';

const fetchImageAsBlob = async (url) => {
  const response = await fetch(`${API_URL}/proxy-image?url=${encodeURIComponent(url)}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }
  return await response.blob();
};

const imagesPerPage = 16;

const AllPhotos = ({  albums, setAlbums, currentTab, fetchAllStats } ) => {
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false); // Create Folder Modal state
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [albumPage, setAlbumPage] = useState(1);
const [photoPage, setPhotoPage] = useState(1);
const [totalAlbums, setTotalAlbums] = useState(0);
const [totalPhotos, setTotalPhotos] = useState(0);

const [showLoader, setShowLoader] = useState(false);


const handleAlbumClick = (album) => {
  setPhotoPage(1);
  fetchPhotos(album, 1);
};


const showLoadingScreen = () => {
  setShowLoader(true);

  const minTime = new Promise(resolve => setTimeout(resolve, 1000)); // Minimum 1 second
  const maxTime = new Promise((resolve) => setTimeout(resolve, 10000)); // Maximum 10 seconds

  return Promise.race([
    minTime,
    maxTime,
  ]);
};

  // Albums with multiple images

  useEffect(() => {
    fetchAlbums();
    
  }, []);

  const fetchAlbums = async (page = 1) => {
    await showLoadingScreen();
    try {
      const response = await fetch(`${API_URL}/albums?page=${page}&limit=${imagesPerPage}`);
      if (!response.ok) throw new Error("Failed to fetch albums");
      const data = await response.json();
      setAlbums(data.albums || []);
      setTotalAlbums(data.total || 0);
    } catch (error) {
      console.error("Error fetching albums:", error);
    } finally {
      setShowLoader(false);  // Hide loader after fetch complete
    }
  };
  
  
  


  const fetchPhotos = async (album, page = 1) => {
    if (!album || !album._id) return;
    await showLoadingScreen();
    try {
      const response = await fetch(`${API_URL}/photos/${album._id}?page=${page}&limit=${imagesPerPage}`);
      if (!response.ok) throw new Error("Failed to fetch photos");
      const data = await response.json();
      setSelectedAlbum({ ...album, images: data.photos || [] });
      setTotalPhotos(data.total || 0);
    } catch (error) {
      console.error("Error fetching photos:", error);
      setSelectedAlbum({ ...album, images: [] });
    } finally {
      setShowLoader(false);  // Hide loader after fetch complete
    }
  };
  
  

  const handleAlbumNextPage = () => {
    if (albumPage * imagesPerPage < totalAlbums) {
      setAlbumPage(prev => prev + 1);
      fetchAlbums(albumPage + 1);
    }
  };
  
  const handleAlbumPrevPage = () => {
    if (albumPage > 1) {
      setAlbumPage(prev => prev - 1);
      fetchAlbums(albumPage - 1);
    }
  };
  
  const handlePhotoNextPage = () => {
    if (photoPage * imagesPerPage < totalPhotos) {
      setPhotoPage(prev => prev + 1);
      fetchPhotos(selectedAlbum, photoPage + 1);
    }
  };
  
  const handlePhotoPrevPage = () => {
    if (photoPage > 1) {
      setPhotoPage(prev => prev - 1);
      fetchPhotos(selectedAlbum, photoPage - 1);
    }
  };

  
  const handleCreateAlbum = async (newAlbum) => {
    try {
      const response = await fetch(`${API_URL}/create-album`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAlbum),
      });
      if (response.ok) {
        alert("Album created successfully");
        const data = await response.json(); // ✅ Get response with message + album

            setAlbums((prevAlbums) => [data.album, ...prevAlbums]); // ✅ Instantly update UI
            
            alert(data.message); // ✅ Show success message
            await fetchAlbums();       // ✅ auto-refresh album list
      await fetchAllStats(); 
            setIsFolderModalOpen(false);
      } else {
        alert("Failed to create album");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };



  const toggleSelection = (album) => {
    console.log("🛠️ Selecting album:", album);

    setSelectedItems((prev) =>
        prev.some((item) => item._id === album._id)
            ? prev.filter((item) => item._id !== album._id)  // Remove if already selected
            : [...prev, album] // Add full album object
    );
};

const togglePhotoSelection = (photo) => {
  console.log("📷 Selecting photo:", photo);

  setSelectedItems((prev) =>
      prev.some((item) => item.photo_id === photo.photo_id)
          ? prev.filter((item) => item.photo_id !== photo.photo_id) // Remove if already selected
          : [...prev, photo] // Add full photo object
  );
};


const handleSelectAll = () => {
  if (selectedAlbum) {
    // Photo Section: Select/Deselect All Photos
    if (selectedItems.length === selectedAlbum.images.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems([...selectedAlbum.images]);
    }
  } else {
    // Album Section: Fix selection issue by comparing actual IDs
    const allAlbumIds = albums.map(album => album._id); 
    const selectedAlbumIds = selectedItems.map(item => item._id); 

    if (allAlbumIds.every(id => selectedAlbumIds.includes(id))) {
      setSelectedItems([]); // Deselect all
    } else {
      setSelectedItems([...albums]); // Select all
    }
  }
};

const handleShare = (album) => {
  if (!album || !album._id) return;
  const shareData = {
    title: album.name,
    text: `Check out this album: ${album.name}`,
    url: `${window.location.origin}/album/${album._id}`
  };

  if (navigator.share) {
    navigator.share(shareData)
      .then(() => console.log("Shared successfully"))
      .catch((error) => console.error("Share failed:", error));
  } else {
    alert("Sharing is not supported in this browser.");
  }
};

const handleCopyLink = (album) => {
  if (!album || !album._id) return;
  const link = `${window.location.origin}/album/${album._id}`;
  navigator.clipboard.writeText(link)
    .then(() => alert("Link copied to clipboard!"))
    .catch((err) => console.error("Failed to copy link:", err));
};

const handleDownloadAlbum = async (album) => {
  if (!album || !album._id) return;

  setShowLoader(true);   // Start loader
  const minTimer = new Promise(resolve => setTimeout(resolve, 1000)); // minimum 1 sec
  const maxTimer = new Promise(resolve => setTimeout(resolve, 10000)); // maximum 10 sec

  try {
    const response = await fetch(`${API_URL}/photos/${album._id}`);
    if (!response.ok) throw new Error("Failed to fetch photos");
    const data = await response.json();
    const photos = data.photos || [];

    if (photos.length === 0) {
      alert("No photos to download in this album.");
      return;
    }

    const zip = new JSZip();

    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      const blob = await fetchImageAsBlob(photo.image);
      zip.file(`${album.name}_photo_${i + 1}.jpg`, blob);
    }

    const content = await zip.generateAsync({ type: "blob" });
    await Promise.race([minTimer, maxTimer]);  // wait at least 1 sec, at most 10 sec
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = `${album.name}.zip`;
    link.click();
  } catch (error) {
    console.error("Error downloading album:", error);
  } finally {
    setShowLoader(false); // ✅ Hide loader after download complete
  }
};

  
const handleDownload = async () => {
  if (selectedItems.length === 0) return;

  setShowLoader(true);   // Start loader
  const minTimer = new Promise(resolve => setTimeout(resolve, 1000)); // minimum 1 sec
  const maxTimer = new Promise(resolve => setTimeout(resolve, 10000)); // maximum 10 sec

  const zip = new JSZip();

  try {
    for (const item of selectedItems) {
      if (item.photo_id) {
        const blob = await fetchImageAsBlob(item.image);
        zip.file(`photo_${item.photo_id}.jpg`, blob);
      } else if (item._id) {
        try {
          const response = await fetch(`${API_URL}/photos/${item._id}`);
          if (!response.ok) throw new Error("Failed to fetch photos");
          const data = await response.json();
          const photos = data.photos || [];

          for (let i = 0; i < photos.length; i++) {
            const photo = photos[i];
            const blob = await fetchImageAsBlob(photo.image);
            zip.file(`${item.name}_photo_${i + 1}.jpg`, blob);
          }

        } catch (error) {
          console.error("Error fetching photos for download:", error);
        }
      }
    }

    const content = await zip.generateAsync({ type: "blob" });
    await Promise.race([minTimer, maxTimer]);  // wait at least 1 sec, at most 10 sec
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = "download.zip";
    link.click();
  } catch (error) {
    console.error("Download error:", error);
  } finally {
    setShowLoader(false); // ✅ Hide loader after download complete
  }
};


      const handleDelete = async () => {
        if (selectedItems.length === 0) return;
        setIsDeleting(true); 
        try {
          if (selectedAlbum) {
            // Deleting selected photos inside an album
            for (const photo of selectedItems) {
              if (!photo.photo_id) {
                console.error("❌ Missing photo_id for:", photo);
                continue; // Skip invalid items
              }

              const response = await fetch(
                `${API_URL}/photo/${selectedAlbum._id}/${photo.photo_id}`,
                { method: "DELETE" }
              );

              if (!response.ok) {
                console.error("❌ Failed to delete photo:", response.statusText);
              }
            }
            await fetchPhotos(selectedAlbum); // ✅ Refresh album after deletion
          } else {
            // Deleting albums
            const response = await fetch(`${API_URL}/delete-albums`, {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ albumIds: selectedItems.map((album) => album._id) }),
            });

            if (!response.ok) {
              console.error("❌ Failed to delete albums:", response.statusText);
            }

            fetchAlbums(); // ✅ Refresh album list
          }

          setSelectedItems([]);
        } catch (error) {
          console.error("Error deleting:", error);
          console.log("🛠️ Deleting photo with ID:", photo.photo_id, "from album:", selectedAlbum._id);

        } finally {
          setIsDeleting(false); // Stop spinner
        }
      };





  return (
    <div className="mt-4">
      {/* If no album is selected, show album grid */}
      {showLoader && (
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

      <div className="flex justify-between items-center gap-4 mb-4 flex-wrap sm:flex-nowrap">
  {/* Back button on left (only in photo gallery section) */}
  {selectedAlbum && (
    <button 
      className="px-4 py-2 bg-[#170645] text-[#FFE100] rounded-lg flex items-center gap-2" 
      onClick={() => {
        setSelectedAlbum(null);
        setSelectedItems([]);
        setAlbumPage(1);
        fetchAlbums(1);
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
        viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      <span>Back to Events</span>
    </button>
  )}

  {/* Right-aligned button group */}
  <div className="flex items-center gap-2 sm:ml-auto flex-wrap sm:flex-nowrap">
    {/* Select All */}
    <div className="flex items-center gap-3 ml-[23px] mr-2 shrink-0">
      <input
        type="checkbox"
        id="selectAll"
        className="w-4 h-4 accent-[#170645] cursor-pointer"
        onChange={handleSelectAll}
        checked={selectedItems.length === (selectedAlbum ? selectedAlbum.images.length : albums.length)}
      />
      <label htmlFor="selectAll" className="text-sm cursor-pointer text-[#686868]">
        Select All
      </label>
    </div>

    {/* Download Button (Fixed Width & Prevent Wrapping) */}
    <button
      className="bg-[#170645] text-[#FFE100] w-[150px] h-[40px] rounded-full font-normal whitespace-nowrap shrink-0"
      onClick={handleDownload}
    >
      Download
    </button>

    {/* Delete Button (Prevent Wrapping) */}
    <button
  type="button"
  disabled={isDeleting}
  className={`w-[150px] h-[40px] rounded-full flex items-center justify-center gap-2 px-4 text-white font-medium 
    ${isDeleting ? 'bg-rose-600 cursor-not-allowed' : 'border-2 border-red-500 text-red-500 hover:bg-red-100'}`}
  onClick={handleDelete}
>
  {isDeleting ? (
    <>
      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4l4-4-4-4v4a8 8 0 100 16v-4l-4 4 4 4v-4a8 8 0 01-8-8z"
        />
      </svg>
      Deleting
    </>
  ) : (
    <>
      <img src="/del_i.png" alt="Delete" className="w-6 h-6" />
    </>
  )}
</button>

  </div>
</div>


      {selectedAlbum === null ? (
        <div className="flex flex-col items-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-4">
          {/* Create Folder Card */}
          <div
            onClick={() => setIsFolderModalOpen(true)}
            className="relative flex justify-start items-end w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[404px] border border-[#686868] rounded-[32px] p-4 cursor-pointer hover:shadow-lg transition mt-4"
          >
            <div className="flex flex-col items-start text-left pl-4">
              <img src="/Create_F.png" alt="Create Folder" className="w-[34px] h-[34px] mb-1" />
              <p className="text-[#170645] text-[18px] font-medium mt-4 mb-1">Create Event</p>
              <p className="text-[#686868] text-[14px] mt-1 mb-6">Example: New Event</p>
            </div>
          </div>

          {/* Modal for Folder Creation */}
          <ModalPopup isOpen={isFolderModalOpen} setIsOpen={setIsFolderModalOpen} fetchAlbums={fetchAlbums} onCreateAlbum={handleCreateAlbum} />

          {/* Album Cards */}
          {albums.map((album, i) => (
            <div key={i} className="p-4 rounded-lg cursor-pointer"  onClick={() => handleAlbumClick(album)}>
              <div className="relative border border-[#686868] rounded-[32px] w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[404px] rounded-[25px] overflow-hidden">
              
              <img src={album.cover} alt={album.name} className="w-full h-full object-fill rounded-[32px]" />
              </div>
              <div className="flex items-center gap-4 ml-1">
              <input type="checkbox" className=" accent-[#170645] w-4 h-4 mt-2 border-2 border-gray-400 rounded-[25px] " onChange={() => toggleSelection(album)} onClick={(e) => e.stopPropagation()}  checked={selectedItems.some(item => item._id === album._id)}  />
              <p className="text-start font-bold text-[18px] text-black mt-2">{album.name}</p>
              </div>
              <div className="flex justify-start space-x-4 mt-1 w-full">
              {/* <input type="checkbox" className="appearance-none mt-2 w-[30px] h-[30px] border-2 border-gray-400 rounded-full checked:bg-blue-500 checked:border-blue-500 cursor-pointer transition-all" onChange={() => toggleSelection(album)} checked={selectedItems.includes(album)} /> */}
                <button onClick={(e) => { e.stopPropagation(); handleShare(album); }} className="mt-2 border border-gray-500 p-[6px] rounded-full hover:bg-gray-100">
                <FiShare size={15} className="text-gray-500 group-hover:text-white" />
                </button>
                <button  onClick={(e) => { e.stopPropagation(); handleCopyLink(album); }} className="mt-2 border border-gray-500 p-[6px] rounded-full hover:bg-gray-100">
                <FiLink size={15} className="text-gray-500 group-hover:text-white" />
                </button>
                <button  onClick={(e) => { e.stopPropagation(); handleDownloadAlbum(album); }} className="mt-2 border border-gray-500 p-[6px] rounded-full hover:bg-gray-100">
                <FiDownload size={15} className="text-gray-500 group-hover:text-white" />
                </button>
              </div>
            </div>
          ))}
          </div>
          {albums.length > 0 && Math.ceil(totalAlbums / imagesPerPage) > 1 && (

                    <div className="flex justify-center items-center gap-4 mt-6">
                      <button
                        onClick={() => {
                          setAlbumPage((prev) => Math.max(prev - 1, 1));
                          fetchAlbums(albumPage - 1);
                        }}
                        disabled={albumPage === 1}
                        className="px-4 py-2 bg-[#170645] text-yellow-400 rounded"
                      >
                        {"<<"}
                      </button>
                      <span className="text-[#170645] py-2 font-semibold">
                        Page {albumPage} of {Math.ceil(totalAlbums / imagesPerPage)}
                      </span>
                      <button
                        onClick={() => {
                          setAlbumPage((prev) => Math.min(prev + 1, Math.ceil(totalAlbums / imagesPerPage)));
                          fetchAlbums(albumPage + 1);
                        }}
                        disabled={albumPage >= Math.ceil(totalAlbums / imagesPerPage)}
                        className="px-4 py-2 bg-[#170645] text-yellow-400 rounded"
                      >
                        {">>"}
                      </button>
                    </div>
                  )}
                  </div>
      ) : (
        //photo section:

        <div>
          {/* <button className="mb-4 px-4 py-2 bg-[#170645] text-[#FFE100] rounded-lg" onClick={() => setSelectedAlbum(null)}>
            ← Back to Events
          </button> */}
          <div className="grid grid-cols-2  max-[365px]:grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {/* Create Photo Gallery Box inside photo section */}
            <div
               onClick={() => setIsGalleryModalOpen(true)}
              className="flex flex-col justify-end items-start pl-8 pb-6 w-full h-[180px] sm:h-[200px] md:h-[220px] lg:h-[250px] border border-gray-400 rounded-[25px] cursor-pointer hover:shadow-lg transition bg-white mt-2"
            >
              <img src="/Create_F.png" alt="Create" className="w-[27px] h-[27px] mb-2" />
              <p className="text-[#170645] text-lg ">Create Photo Gallery</p>
              <p className="text-gray-500 text-sm  ml-[1px] ">Max Size 5 MB</p>
            </div>

            {selectedAlbum?.images.map((photo, index) => (
  <div 
    key={index} 
    className="p-1 relative rounded-[25px] border border-white border-[2px] overflow-hidden hover:border-[#0084FF] hover:shadow-md transition cursor-pointer"
    onClick={() => togglePhotoSelection(photo)}   // ✅ Make entire box clickable
  >
    <input 
      type="checkbox" 
      className="accent-[#170645] absolute top-4 right-4 pointer-events-none"  // ✅ Disable checkbox pointer events
      checked={selectedItems.some(item => item.photo_id === photo.photo_id)}  
      readOnly  // ✅ prevent warning
    />
    <img  
      src={photo.image} 
      alt={`Photo ${index + 1}`} 
      className="w-full h-[180px] sm:h-[200px] md:h-[220px] lg:h-[250px] object-cover rounded-[25px]" 
      onError={(e) => console.error("Image load error", e.target.src)} 
    />
  </div>
))}

          </div>
          {selectedAlbum?.images.length > 0 && Math.ceil(totalPhotos / imagesPerPage) > 1 && (

  <div className="flex justify-center items-center gap-4 mt-6">
    <button
      onClick={() => {
        setPhotoPage((prev) => Math.max(prev - 1, 1));
        fetchPhotos(selectedAlbum, photoPage - 1);
      }}
      disabled={photoPage === 1}
      className="px-4 py-2 bg-[#170645] text-yellow-400 rounded"
    >
      {"<<"}
    </button>
    <span className="text-[#170645] py-2 font-semibold">
      Page {photoPage} of {Math.ceil(totalPhotos / imagesPerPage)}
    </span>
    <button
      onClick={() => {
        setPhotoPage((prev) => Math.min(prev + 1, Math.ceil(totalPhotos / imagesPerPage)));
        fetchPhotos(selectedAlbum, photoPage + 1);
      }}
      disabled={photoPage >= Math.ceil(totalPhotos / imagesPerPage)}
      className="px-4 py-2 bg-[#170645] text-yellow-400 rounded"
    >
      {">>"}
    </button>
  </div>
)}


        </div>
      )}

    <ModalPopup 
        setIsOpen={setIsFolderModalOpen} 
        onCreateAlbum={handleCreateAlbum} 
        fetchAlbums={fetchAlbums}
        fetchAllStats={fetchAllStats }
        isOpen={isFolderModalOpen}
      />
    { selectedAlbum?._id && (
        <GalleryModal isOpen={isGalleryModalOpen} setIsOpen={setIsGalleryModalOpen} albumId={selectedAlbum?._id} fetchPhotos={fetchPhotos} fetchAllStats={fetchAllStats} />
      )}

    </div>
  );
};

export default AllPhotos;

