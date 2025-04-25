
// "use client";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { FaChevronDown, FaBars, FaTimes, FaUser, FaSlidersH, FaSearch } from "react-icons/fa";
// import { FiShare, FiLink, FiDownload } from "react-icons/fi";
// import { FaGooglePlay, FaApple, FaMapMarkerAlt, FaFacebookF, FaInstagram, FaYoutube, FaLinkedinIn, FaTwitter, FaPhone, FaEnvelope } from "react-icons/fa";
// import Footer from "./components/Footer";
// import Navbar from "./components/Navbar";
// import UploadPhotoModal from "./components/UploadPhotoModal";
// import { useSession, signOut } from "next-auth/react";
// import Masonry from 'react-masonry-css';
// import { useSearchParams } from "next/navigation";

// const images = [];





// export default function Homepage() {
//   const router = useRouter();

//   const [search, setSearch] = useState("");
//   const [showFilter, setShowFilter] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const imagesPerPage = 16;
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [showGallery, setShowGallery] = useState(false);
//   const [albums, setAlbums] = useState([]);
//   const [selectedAlbum, setSelectedAlbum] = useState(null);
//   const [albumPhotos, setAlbumPhotos] = useState([]);
//   const [selectAll, setSelectAll] = useState(false);
//   const [selectedImages, setSelectedImages] = useState([]);
//   const { data: session, status } = useSession();
//   const [otpUser, setOtpUser] = useState(null);
//   const breakpointColumnsObj = {
//     default: 4,
//     1280: 3,
//     768: 2,
//     500: 1
//   };


//   useEffect(() => {
//     const storedUser = localStorage.getItem("otpUser");

//     if (status === "loading") return; // wait for NextAuth check

//     if (!storedUser && status === "unauthenticated") {
//       router.push("/"); // ❌ No OTP user & not logged in via Google
//     } else {
//       setOtpUser(JSON.parse(storedUser)); // ✅ Load OTP user (if any)
//       fetchAlbums(); // ✅ Continue as logged in
//     }
//   }, [status]);

//   const fetchAlbums = async () => {
//     try {
//       const res = await fetch("https://c07c-49-35-193-75.ngrok-free.app/albums");
//       const data = await res.json();
//       setAlbums(data);
//     } catch (err) {
//       console.error("Error fetching albums:", err);
//     }
//   };


//   const fetchPhotos = async (album) => {
//     try {
//       const res = await fetch(`https://c07c-49-35-193-75.ngrok-free.app/photos/${album._id}`);
//       const data = await res.json();

//       if (data.length === 0) {
//         alert("This album is empty");
//         return;
//       }

//       setSelectedAlbum(album);
//       setAlbumPhotos(data);
//     } catch (err) {
//       console.error("Error fetching photos:", err);
//     }
//   };


//   const filteredImages = images.filter((img) =>
//     img.title.toLowerCase().includes(search.toLowerCase())
//   );


//   // Pagination logic
//   const indexOfLastImage = currentPage * imagesPerPage;
//   const indexOfFirstImage = indexOfLastImage - imagesPerPage;
//   const currentImages = filteredImages.slice(indexOfFirstImage, indexOfLastImage);
//   const totalItems = selectedAlbum ? albumPhotos.length : albums.length;
//   const totalPages = Math.ceil(totalItems / imagesPerPage);

//   const handleScroll = () => {
//     if (
//       window.innerHeight + document.documentElement.scrollTop + 100 >=
//       document.documentElement.offsetHeight
//     ) {
//       setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
//     }
//   };

//   const handleDownload = (src) => {
//     const link = document.createElement("a");
//     link.href = src;
//     link.download = src.split("/").pop();
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // Copy Image Link Function
//   const handleCopyLink = (src) => {
//     navigator.clipboard.writeText(window.location.origin + src)
//       .then(() => alert("Image link copied!"))
//       .catch((err) => console.error("Failed to copy: ", err));
//   };

//   // Share Image Function
//   const handleShare = (src) => {
//     if (navigator.share) {
//       navigator.share({
//         title: "Check out this image!",
//         text: "Look at this image from our gallery.",
//         url: window.location.origin + src
//       }).catch((error) => console.error("Error sharing:", error));
//     } else {
//       alert("Sharing is not supported in your browser.");
//     }
//   };

//   const saveToDownloadHistory = (newItem) => {
//     let history = JSON.parse(localStorage.getItem("downloadHistory") || "[]");

//     // Remove duplicate if any
//     history = history.filter((item) => item.title !== newItem.title);
//     history.unshift(newItem); // Add new item at top

//     let success = false;
//     while (!success && history.length > 0) {
//       try {
//         localStorage.setItem("downloadHistory", JSON.stringify(history));
//         success = true;
//       } catch (e) {
//         if (e.name === "QuotaExceededError") {
//           history.pop(); // Remove oldest and retry
//         } else {
//           console.error("Error saving history:", e);
//           break;
//         }
//       }
//     }
//   };


//   const handleDownloadAlbum = async (album) => {
//     if (!album || !album._id) return;

//     try {
//       const response = await fetch(`https://c07c-49-35-193-75.ngrok-free.app/photos/${album._id}`);
//       if (!response.ok) throw new Error("Failed to fetch photos");
//       const photos = await response.json();

//       if (photos.length === 0) {
//         alert("No photos to download in this album.");
//         return;
//       }

//       const JSZip = (await import("jszip")).default;
//       const zip = new JSZip();

//       photos.forEach((photo, index) => {
//         const base64Data = photo.image.split(",")[1];
//         zip.file(`${album.name}_photo_${index + 1}.jpg`, base64Data, { base64: true });
//       });

//       const content = await zip.generateAsync({ type: "blob" });
//       const link = document.createElement("a");
//       link.href = URL.createObjectURL(content);
//       link.download = `${album.name}.zip`;
//       link.click();
//       const historyItem = {
//         image: `data:image/jpeg;base64,${album.cover}`, // first image as thumbnail
//         title: album.name,
//         lastDownload: new Date().toLocaleDateString("en-GB"), // e.g., 07/04/2025
//         photoCount: photos.length,
//       };

//       saveToDownloadHistory(historyItem);

//     } catch (error) {
//       console.error("Error downloading album:", error);
//     }
//   };


//   const handleSelectAll = () => {
//     if (selectAll) {
//       setSelectedImages([]);
//     } else {
//       setSelectedImages(albumPhotos.map((img) => img.image));
//     }
//     setSelectAll(!selectAll);
//   };

//   const handleImageSelect = (src) => {
//     setSelectedImages((prev) =>
//       prev.includes(src) ? prev.filter((img) => img !== src) : [...prev, src]
//     );
//     setSelectAll(selectedImages.length + 1 === albumPhotos.length);
//   };

//   const handleDownloadAll = async () => {
//     if (selectedImages.length === 0) {
//       alert("No images selected!");
//       return;
//     }

//     const JSZip = (await import("jszip")).default;
//     const zip = new JSZip();

//     selectedImages.forEach((dataUrl, index) => {
//       const base64 = dataUrl.split(",")[1];
//       zip.file(`image_${index + 1}.jpg`, base64, { base64: true });
//     });

//     const blob = await zip.generateAsync({ type: "blob" });
//     const url = URL.createObjectURL(blob);

//     const link = document.createElement("a");
//     link.href = url;
//     link.download = "selected_images.zip";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);

//     URL.revokeObjectURL(url);
//   };

//   const handleShareAll = async () => {
//     if (selectedImages.length === 0) return alert("No images selected!");

//     const files = selectedImages.map((dataUrl, index) => {
//       const byteString = atob(dataUrl.split(",")[1]);
//       const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];
//       const ab = new ArrayBuffer(byteString.length);
//       const ia = new Uint8Array(ab);
//       for (let i = 0; i < byteString.length; i++) {
//         ia[i] = byteString.charCodeAt(i);
//       }
//       return new File([ab], `image_${index + 1}.jpg`, { type: mimeString });
//     });

//     if (navigator.canShare && navigator.canShare({ files })) {
//       try {
//         await navigator.share({
//           title: "Check out these images!",
//           text: "Shared via choicesay!",
//           files,
//         });
//       } catch (err) {
//         console.error("Error sharing files:", err);
//         alert("Error sharing images.");
//       }
//     } else {
//       alert("Sharing files is not supported on your device or browser.");
//     }
//   };


//   return (
//     <div className="min-h-screen bg-white">
//       <Navbar search={search} setSearch={setSearch} setShowFilter={setShowFilter} setIsModalOpen={setIsModalOpen} setShowGallery={setShowGallery} />


//       <div className="pt-4">


//         {selectedAlbum !== null && (
//           <div className="flex justify-between items-center w-full px-4 py-3 top-0 z-30">
//             <button
//               onClick={() => {
//                 setSelectedAlbum(null);
//                 setSelectedImages([]);
//                 setSelectAll(false);
//               }}
//               className="flex items-center gap-2 text-[#170645] px-4 py-1 font-normal rounded-lg text-sm sm:text-base"
//             >
//                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
//         viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//         <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
//       </svg>
//       <span>Back</span>
//             </button>


//             <h2 className="text-center font-extrabold text-xl sm:text-3xl text-[#170645] truncate max-w-[50%]">
//               {selectedAlbum.name}
//             </h2>

//             <label className="flex items-center gap-2 text-[#170645] font-semibold text-sm sm:text-base cursor-pointer">
//               <input
//                 type="checkbox"
//                 checked={selectAll}
//                 onChange={handleSelectAll}
//                 className="accent-[#170645] w-4 h-4"
//               />
//               <span>Select All</span>
//             </label>

//           </div>
//         )}


// {/* Show Title on Top When Event Albums Are Showing */}
// {selectedAlbum === null && (
//   <div className="flex items-center justify-between px-6 mb-5 sm:px-12 mt-5">
//     <h2 className="text-center w-full font-extrabold text-2xl sm:text-3xl text-[#170645]">
//       Related Event Search
//     </h2>
//     {/* <button
//   onClick={() => setShowFilter(true)}
//   className="flex items-center gap-2 px-4 py-[6px] border border-gray-300 text-gray-600 rounded-full hover:bg-gray-100 transition-all text-sm sm:text-base"
// >
//   <FaSlidersH size={16} />
//   <span>Filter</span>
// </button> */}

//   </div>
// )}


//         {selectedAlbum === null
//           ? (<Masonry
//             breakpointCols={breakpointColumnsObj}
//             className="my-masonry-grid"
//             columnClassName="my-masonry-grid_column"
//           >
//             {albums.slice(indexOfFirstImage, indexOfLastImage).map((album, index) => (
//               <div
//                 key={index}
//                 onClick={() => fetchPhotos(album)}
//                 className="break-inside-avoid bg-white p-4 rounded-lg group transition-all duration-300 cursor-pointer"
//               >
//                 <div className="relative rounded-[30px] overflow-hidden">
//                   <img
//                     src={`data:image/jpeg;base64,${album.cover}`}
//                     alt={album.name}
//                     className="w-full rounded-[30px] transition-all duration-300 group-hover:brightness-75"
//                   />
//                   <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-between items-end p-4 rounded-[30px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                     <div className="text-left">
//                       <span className="text-white font-extrabold text-4xl leading-none block">{album.name}</span>
//                       <span className="text-white font-semibold text-lg block mt-[-5px]">Click to view</span>
//                     </div>
//                     <span className="text-white text-lg font-medium">{album.date}</span>
//                   </div>
//                 </div>
//                 <h3 className="text-[20px] font-bold capitalize text-black mt-2 p-2 rounded-md">
//                   {album.name}
//                 </h3>
//                 {/* Share / Copy / Download Buttons */}
//                 <div className="flex justify-start space-x-3 ml-2">
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleShare(`/album/${album._id}`);
//                     }}
//                     className=" border border-gray-500 p-[6px] rounded-full hover:bg-gray-300 "
//                   >
//                     <FiShare size={16} className="text-gray-500 " />
//                   </button>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleCopyLink(`/album/${album._id}`);
//                     }}
//                     className="border border-gray-500 p-[6px] rounded-full hover:bg-gray-300"
//                   >
//                     <FiLink size={16} className="text-gray-500" />
//                   </button>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleDownloadAlbum(album);
//                     }}
//                     className="border border-gray-500 p-[6px] rounded-full hover:bg-gray-300"
//                   >
//                     <FiDownload size={16} className="text-gray-500 " />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </Masonry>)
//           : (
//             <>
//               <Masonry
//                 breakpointCols={breakpointColumnsObj}
//                 className="my-masonry-grid"
//                 columnClassName="my-masonry-grid_column"
//               >
//                 {albumPhotos
//                   .slice(indexOfFirstImage, indexOfLastImage)
//                   .map((photo, index) => (
//                     <div
//                       key={index}
//                       className="break-inside-avoid bg-white p-4 rounded-lg group transition-all duration-300 cursor-pointer "
//                     >

//                       <div className="relative rounded-[30px] overflow-hidden">
//                         <input
//                           type="checkbox"
//                           className="absolute top-4 right-4 z-10 w-4 h-4 accent-[#170645]"
//                           checked={selectedImages.includes(photo.image)}
//                           onChange={() => handleImageSelect(photo.image)}
//                         />
//                         <img
//                           src={photo.image}
//                           alt={`Photo ${index + 1}`}
//                           className="rounded-[20px] mb-4"
//                         />

//                       </div>
//                     </div>
//                   ))}
//               </Masonry>

//               <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex flex-col sm:flex-row gap-3 px-4 py-3 rounded-full">
//                 <button
//                   onClick={handleShareAll}
//                   className="min-w-[150px] px-4 py-2 bg-yellow-400 text-black rounded-full flex items-center justify-center gap-2 text-sm font-semibold shadow hover:shadow-md"
//                 >
//                   <FiShare size={18} /> Share
//                 </button>
//                 <button
//                   onClick={handleDownloadAll}
//                   className="min-w-[150px] px-4 py-2 bg-[#170645] text-yellow-500 rounded-full flex items-center justify-center gap-2 text-sm font-semibold shadow hover:shadow-md"
//                 >
//                   <FiDownload size={18} /> Download
//                 </button>
//               </div>

//             </>
//           )}


//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex justify-center mt-6 mb-4 space-x-4">
//             {/* Previous Button */}
//             <button
//               onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//               disabled={currentPage === 1}
//               className="px-4 py-2 border rounded-lg bg-[#170645] text-yellow-500"
//             >
//               {"<<"}
//             </button>

//             {/* Page Number Display */}
//             <span className="px-4 py-2 border rounded-lg bg-[#170645] text-yellow-500">
//               Page {currentPage} of {totalPages}
//             </span>

//             {/* Next Button */}
//             <button
//               onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//               disabled={currentPage === totalPages}
//               className="px-4 py-2 border text-sm rounded-lg text-yellow-500 bg-[#170645] "
//             >
//               {">>"}
//             </button>
//           </div>
//         )}


//         {showFilter && (
//           <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-10 p-4">
//             <div className="bg-white p-4 sm:p-6 rounded-[30px] shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//               {/* Close Button */}
//               <div className="flex justify-between mb-4">
//                 <button
//                   onClick={() => setShowFilter(false)}
//                   className="text-xl text-gray-500"
//                 >
//                   ✖
//                 </button>
//                 <button
//                   onClick={() => {
//                     document
//                       .querySelectorAll('input[type="checkbox"]')
//                       .forEach((checkbox) => (checkbox.checked = false));
//                     document
//                       .querySelectorAll('input[type="date"]')
//                       .forEach((input) => (input.value = ""));
//                   }}
//                   className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
//                 >
//                   Clear All
//                 </button>
//               </div>

//               {/* Event Section */}
//               <div>
//                 <p className="text-lg font-semibold mb-2 text-black">Event</p>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 text-gray-600">
//                   {[
//                     "Azadi Ka Amrit Mahotsav",
//                     "Rajim Kumbh Mela",
//                     "Rajutsav 2025",
//                     "Harihar Chhattisgarh",
//                     "Mahatari Vandan Yojna",
//                     "Chhattisgarh Yojna",
//                   ].map((event, index) => (
//                     <label
//                       key={index}
//                       className="flex items-center gap-2 bg-gray-100 p-2 rounded-full border border-gray-300 hover:border-[#170645] cursor-pointer text-sm sm:text-base"
//                     >
//                       <input type="checkbox" className="w-4 h-4" />
//                       <span className="truncate">{event}</span>
//                     </label>
//                   ))}
//                 </div>
//                 <div className="border-b border-gray-300 my-4"></div>
//               </div>

//               {/* Category Section */}
//               <div className="mt-2">
//                 <p className="text-lg font-semibold mb-2 text-black">Category</p>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 text-gray-600">
//                   {[
//                     "Azadi Ka Amrit Mahotsav",
//                     "Rajim Kumbh Mela",
//                     "Rajutsav 2025",
//                     "Harihar Chhattisgarh",
//                     "Mahatari Vandan Yojna",
//                     "Chhattisgarh Yojna",
//                     "Ujjwala Yojna",
//                   ].map((category, index) => (
//                     <label
//                       key={index}
//                       className="flex items-center gap-2 bg-gray-100 p-2 rounded-full border border-gray-300 hover:border-[#170645] cursor-pointer text-sm sm:text-base"
//                     >
//                       <input type="checkbox" className="w-4 h-4" />
//                       <span className="truncate">{category}</span>
//                     </label>
//                   ))}
//                 </div>
//                 <div className="border-b border-gray-300 my-4"></div>
//               </div>

//               {/* District Section */}
//               <div className="mt-2">
//                 <p className="text-lg font-semibold mb-2 text-black">Districts</p>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 text-gray-600">
//                   {[
//                     "Balod", "Sukma", "Dantewada", "Bastar", "Kondagaon", "Narayanpur", "Kanker",
//                     "Kawardha", "Baloda Bazar", "Balrampur", "Bemetara", "Bijapur", "Bilaspur",
//                     "Dhamtari", "Durg", "Gariaband", "Gaurela-Pendra-Marwahi", "Janjgir-Champa",
//                     "Jashpur", "Korba", "Koriya", "Mahasamund", "Mungeli", "Raigarh", "Raipur",
//                     "Rajnandgaon", "Surajpur", "Surguja",
//                   ].map((district, index) => (
//                     <label
//                       key={index}
//                       className="flex items-center gap-2 bg-gray-100 p-2 rounded-full border border-gray-300 hover:border-[#170645] cursor-pointer text-sm sm:text-base"
//                     >
//                       <input type="checkbox" className="w-4 h-4" />
//                       <span className="truncate">{district}</span>
//                     </label>
//                   ))}
//                 </div>
//                 <div className="border-b border-gray-300 my-4"></div>
//               </div>

//               {/* Date Range Section */}
//               <div className="mt-4">
//                 <p className="text-lg font-semibold mb-2 text-black">Date</p>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-600">Date From</label>
//                     <input
//                       type="date"
//                       className="border p-2 w-full rounded-md text-gray-600"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-600">Date To</label>
//                     <input
//                       type="date"
//                       className="border p-2 w-full rounded-md text-gray-600"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//         <Footer />
//       </div>
//     </div>
//   );
// }










"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaChevronDown, FaBars, FaTimes, FaUser, FaSlidersH, FaSearch } from "react-icons/fa";
import { FiShare, FiLink, FiDownload } from "react-icons/fi";
import { FaGooglePlay, FaApple, FaMapMarkerAlt, FaFacebookF, FaInstagram, FaYoutube, FaLinkedinIn, FaTwitter, FaPhone, FaEnvelope } from "react-icons/fa";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import UploadPhotoModal from "./components/UploadPhotoModal";
import { useSession, signOut } from "next-auth/react";
import Masonry from 'react-masonry-css';
import { useSearchParams } from "next/navigation";

const images = [];





export default function Homepage() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const imagesPerPage = 16;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [albumPhotos, setAlbumPhotos] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const { data: session, status } = useSession();
  const [otpUser, setOtpUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const breakpointColumnsObj = {
    default: 4,
    1280: 3,
    768: 2,
    500: 1
  };
  const [isPageLoading, setIsPageLoading] = useState(true);


  useEffect(() => {
    const storedUser = localStorage.getItem("otpUser");

    if (status === "loading") return; // wait for NextAuth check

    if (!storedUser && status === "unauthenticated") {
      router.push("/"); // ❌ No OTP user & not logged in via Google
    } else {
      setOtpUser(JSON.parse(storedUser)); // ✅ Load OTP user (if any)
      fetchAlbums(); // ✅ Continue as logged in
    }
  }, [status]);

  const fetchAlbums = async (page = 1) => {
    try {
      const res = await fetch(`https://c07c-49-35-193-75.ngrok-free.app/albums?page=${page}&limit=${imagesPerPage}`);
      const data = await res.json();
      setAlbums(data.albums);
      setTotalPages(Math.ceil(data.total / imagesPerPage));
    } catch (err) {
      console.error("Error fetching albums:", err);
    } finally {
      setIsPageLoading(false); // ✅ Only hide loader after fetch
    }
  };
  


  const fetchPhotos = async (album, page = 1) => {
    try {
      setIsLoading(true);
      const res = await fetch(`https://c07c-49-35-193-75.ngrok-free.app/photos/${album._id}?page=${page}&limit=${imagesPerPage}`);
      const data = await res.json();

      if (data.photos.length === 0) {
        alert("This album is empty");
        return;
      }

      setSelectedAlbum(album);
      setAlbumPhotos(data.photos);
      setTotalPages(Math.ceil(data.total / imagesPerPage));
    } catch (err) {
      console.error("Error fetching photos:", err);
    } finally {
      setTimeout(() => setIsLoading(false), 500); // smooth loader delay
    }
  };


  const filteredImages = images.filter((img) =>
    img.title.toLowerCase().includes(search.toLowerCase())
  );


  // Pagination logic
  // const indexOfLastImage = currentPage * imagesPerPage;
  // const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  // const currentImages = filteredImages.slice(indexOfFirstImage, indexOfLastImage);
  // const totalItems = selectedAlbum ? albumPhotos.length : albums.length;
  // const totalPages = Math.ceil(totalItems / imagesPerPage);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 100 >=
      document.documentElement.offsetHeight
    ) {
      setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    }
  };

  // const handleDownload = (src) => {
  //   const link = document.createElement("a");
  //   link.href = src;
  //   link.download = src.split("/").pop();
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  const handleDownload = (src) => {
    setIsLoading(true);
    const startTime = Date.now();

    try {
      const link = document.createElement("a");
      link.href = src;
      link.download = src.split("/").pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Single image download error:", error);
      alert("❌ Failed to download image.");
    } finally {
      const elapsedTime = Date.now() - startTime;
      const delay = Math.max(0, 1000 - elapsedTime);
      setTimeout(() => {
        setIsLoading(false);
      }, delay);
    }
  };

  // Copy Image Link Function
  const handleCopyLink = (src) => {
    navigator.clipboard.writeText(window.location.origin + src)
      .then(() => alert("Image link copied!"))
      .catch((err) => console.error("Failed to copy: ", err));
  };

  // Share Image Function
  const handleShare = (src) => {
    if (navigator.share) {
      navigator.share({
        title: "Check out this image!",
        text: "Look at this image from our gallery.",
        url: window.location.origin + src
      }).catch((error) => console.error("Error sharing:", error));
    } else {
      alert("Sharing is not supported in your browser.");
    }
  };

  const saveToDownloadHistory = (newItem) => {
    let history = JSON.parse(localStorage.getItem("downloadHistory") || "[]");

    // Remove duplicate if any
    history = history.filter((item) => item.title !== newItem.title);
    history.unshift(newItem); // Add new item at top

    let success = false;
    while (!success && history.length > 0) {
      try {
        localStorage.setItem("downloadHistory", JSON.stringify(history));
        success = true;
      } catch (e) {
        if (e.name === "QuotaExceededError") {
          history.pop(); // Remove oldest and retry
        } else {
          console.error("Error saving history:", e);
          break;
        }
      }
    }
  };


  const handleDownloadAlbum = async (album) => {
    if (!album || !album._id) return;

    try {
      setIsLoading(true);
      const response = await fetch(`https://c07c-49-35-193-75.ngrok-free.app/photos/${album._id}`);
      if (!response.ok) throw new Error("Failed to fetch photos");
      const photos = await response.json();

      if (photos.length === 0) {
        alert("No photos to download in this album.");
        return;
      }

      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      photos.forEach((photo, index) => {
        const base64Data = photo.image.split(",")[1];
        zip.file(`${album.name}_photo_${index + 1}.jpg`, base64Data, { base64: true });
      });

      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = `${album.name}.zip`;
      link.click();
      const historyItem = {
        image: `data:image/jpeg;base64,${album.cover}`, // first image as thumbnail
        title: album.name,
        lastDownload: new Date().toLocaleDateString("en-GB"), // e.g., 07/04/2025
        photoCount: photos.length,
      };

      saveToDownloadHistory(historyItem);

    } catch (error) {
      console.error("Error downloading album:", error);
    } finally {
      setIsLoading(false); // ✅ Always hide loader!
    }
  };


  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedImages([]);
    } else {
      setSelectedImages(albumPhotos.map((img) => img.image));
    }
    setSelectAll(!selectAll);
  };

  const handleImageSelect = (src) => {
    setSelectedImages((prev) =>
      prev.includes(src) ? prev.filter((img) => img !== src) : [...prev, src]
    );
    setSelectAll(selectedImages.length + 1 === albumPhotos.length);
  };

  // const handleDownloadAll = async () => {
  //   if (selectedImages.length === 0) {
  //     alert("No images selected!");
  //     return;
  //   }

  //   const JSZip = (await import("jszip")).default;
  //   const zip = new JSZip();

  //   selectedImages.forEach((dataUrl, index) => {
  //     const base64 = dataUrl.split(",")[1];
  //     zip.file(`image_${index + 1}.jpg`, base64, { base64: true });
  //   });

  //   const blob = await zip.generateAsync({ type: "blob" });
  //   const url = URL.createObjectURL(blob);

  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.download = "selected_images.zip";
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);

  //   URL.revokeObjectURL(url);
  // };

  const handleDownloadAll = async () => {
    if (selectedImages.length === 0) {
      alert("No images selected!");
      return;
    }

    setIsLoading(true);
    const startTime = Date.now(); // ⏱️ Mark the start time

    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      selectedImages.forEach((dataUrl, index) => {
        const base64 = dataUrl.split(",")[1];
        zip.file(`image_${index + 1}.jpg`, base64, { base64: true });
      });

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
      const delay = Math.max(0, 1000 - elapsedTime); // minimum 1 sec

      setTimeout(() => {
        setIsLoading(false); // hide loader after delay
      }, delay);
    }
  };


  const handleShareAll = async () => {
    if (selectedImages.length === 0) return alert("No images selected!");

    const files = selectedImages.map((dataUrl, index) => {
      const byteString = atob(dataUrl.split(",")[1]);
      const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new File([ab], `image_${index + 1}.jpg`, { type: mimeString });
    });

    if (navigator.canShare && navigator.canShare({ files })) {
      try {
        await navigator.share({
          title: "Check out these images!",
          text: "Shared via choicesay!",
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

  useEffect(() => {
    if (!selectedAlbum) fetchAlbums(currentPage);
    else fetchPhotos(selectedAlbum, currentPage);
  }, [currentPage]);


  if (isPageLoading) {
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
    <div className="min-h-screen bg-white">
      <Navbar search={search} setSearch={setSearch} setShowFilter={setShowFilter} setIsModalOpen={setIsModalOpen} setShowGallery={setShowGallery} />


      <div className="pt-4">


        {selectedAlbum !== null && (
          <div className="flex justify-between items-center w-full px-4 py-3 top-0 z-30">
            <button
              onClick={() => {
                setIsLoading(true); // start loader
                setSelectedAlbum(null);
                setSelectedImages([]);
                setSelectAll(false);
                setTimeout(() => setIsLoading(false), 500);
              }}
              className="flex items-center gap-2 text-[#170645] px-4 py-1 font-normal rounded-lg text-sm sm:text-base"
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
        )}


        {/* Show Title on Top When Event Albums Are Showing */}
        {selectedAlbum === null && (
          <div className="flex items-center justify-between px-6 mb-5 sm:px-12 mt-5">
            <h2 className="text-center w-full font-extrabold text-2xl sm:text-3xl text-[#170645]">
              Select Photo Album And Search Your Photo Through AI
            </h2>
            {/* <button
  onClick={() => setShowFilter(true)}
  className="flex items-center gap-2 px-4 py-[6px] border border-gray-300 text-gray-600 rounded-full hover:bg-gray-100 transition-all text-sm sm:text-base"
>
  <FaSlidersH size={16} />
  <span>Filter</span>
</button> */}

          </div>
        )}


        {selectedAlbum === null
          ? (<Masonry
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
                {/* Share / Copy / Download Buttons */}
                <div className="flex justify-start space-x-3 ml-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(`/album/${album._id}`);
                    }}
                    className=" border border-gray-500 p-[6px] rounded-full hover:bg-gray-300 "
                  >
                    <FiShare size={16} className="text-gray-500 " />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyLink(`/album/${album._id}`);
                    }}
                    className="border border-gray-500 p-[6px] rounded-full hover:bg-gray-300"
                  >
                    <FiLink size={16} className="text-gray-500" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadAlbum(album);
                    }}
                    className="border border-gray-500 p-[6px] rounded-full hover:bg-gray-300"
                  >
                    <FiDownload size={16} className="text-gray-500 " />
                  </button>
                </div>
              </div>
            ))}
          </Masonry>)
          : (
            <>
              <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
              >
                {albumPhotos.map((photo, index) => (
                  <div
                    key={index}
                    className="break-inside-avoid bg-white p-4 rounded-lg group transition-all duration-300 cursor-pointer "
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
                        className="rounded-[20px] mb-4"
                      />

                    </div>
                  </div>
                ))}
              </Masonry>

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

            </>
          )}


        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 mb-4 space-x-4">
            {/* Previous Button */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-lg bg-[#170645] text-yellow-500"
            >
              {"<<"}
            </button>

            {/* Page Number Display */}
            <span className="px-4 py-2 border rounded-lg bg-[#170645] text-yellow-500">
              Page {currentPage} of {totalPages}
            </span>

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border text-sm rounded-lg text-yellow-500 bg-[#170645] "
            >
              {">>"}
            </button>
          </div>
        )}


        {showFilter && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-10 p-4">
            <div className="bg-white p-4 sm:p-6 rounded-[30px] shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              {/* Close Button */}
              <div className="flex justify-between mb-4">
                <button
                  onClick={() => setShowFilter(false)}
                  className="text-xl text-gray-500"
                >
                  ✖
                </button>
                <button
                  onClick={() => {
                    document
                      .querySelectorAll('input[type="checkbox"]')
                      .forEach((checkbox) => (checkbox.checked = false));
                    document
                      .querySelectorAll('input[type="date"]')
                      .forEach((input) => (input.value = ""));
                  }}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
                >
                  Clear All
                </button>
              </div>

              {/* Event Section */}
              <div>
                <p className="text-lg font-semibold mb-2 text-black">Event</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 text-gray-600">
                  {[
                    "Azadi Ka Amrit Mahotsav",
                    "Rajim Kumbh Mela",
                    "Rajutsav 2025",
                    "Harihar Chhattisgarh",
                    "Mahatari Vandan Yojna",
                    "Chhattisgarh Yojna",
                  ].map((event, index) => (
                    <label
                      key={index}
                      className="flex items-center gap-2 bg-gray-100 p-2 rounded-full border border-gray-300 hover:border-[#170645] cursor-pointer text-sm sm:text-base"
                    >
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="truncate">{event}</span>
                    </label>
                  ))}
                </div>
                <div className="border-b border-gray-300 my-4"></div>
              </div>

              {/* Category Section */}
              <div className="mt-2">
                <p className="text-lg font-semibold mb-2 text-black">Category</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 text-gray-600">
                  {[
                    "Azadi Ka Amrit Mahotsav",
                    "Rajim Kumbh Mela",
                    "Rajutsav 2025",
                    "Harihar Chhattisgarh",
                    "Mahatari Vandan Yojna",
                    "Chhattisgarh Yojna",
                    "Ujjwala Yojna",
                  ].map((category, index) => (
                    <label
                      key={index}
                      className="flex items-center gap-2 bg-gray-100 p-2 rounded-full border border-gray-300 hover:border-[#170645] cursor-pointer text-sm sm:text-base"
                    >
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="truncate">{category}</span>
                    </label>
                  ))}
                </div>
                <div className="border-b border-gray-300 my-4"></div>
              </div>

              {/* District Section */}
              <div className="mt-2">
                <p className="text-lg font-semibold mb-2 text-black">Districts</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 text-gray-600">
                  {[
                    "Balod", "Sukma", "Dantewada", "Bastar", "Kondagaon", "Narayanpur", "Kanker",
                    "Kawardha", "Baloda Bazar", "Balrampur", "Bemetara", "Bijapur", "Bilaspur",
                    "Dhamtari", "Durg", "Gariaband", "Gaurela-Pendra-Marwahi", "Janjgir-Champa",
                    "Jashpur", "Korba", "Koriya", "Mahasamund", "Mungeli", "Raigarh", "Raipur",
                    "Rajnandgaon", "Surajpur", "Surguja",
                  ].map((district, index) => (
                    <label
                      key={index}
                      className="flex items-center gap-2 bg-gray-100 p-2 rounded-full border border-gray-300 hover:border-[#170645] cursor-pointer text-sm sm:text-base"
                    >
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="truncate">{district}</span>
                    </label>
                  ))}
                </div>
                <div className="border-b border-gray-300 my-4"></div>
              </div>

              {/* Date Range Section */}
              <div className="mt-4">
                <p className="text-lg font-semibold mb-2 text-black">Date</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Date From</label>
                    <input
                      type="date"
                      className="border p-2 w-full rounded-md text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Date To</label>
                    <input
                      type="date"
                      className="border p-2 w-full rounded-md text-gray-600"
                    />
                  </div>
                </div>
              </div>
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

        <Footer />
      </div>
    </div>
  );
}
