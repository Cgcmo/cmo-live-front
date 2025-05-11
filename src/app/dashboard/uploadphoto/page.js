
"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Image from "next/image";
import { FiShare, FiLink, FiDownload } from "react-icons/fi";
import Footer from "../components/Footer";
import JSZip from "jszip";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import API_URL from '@/app/api';


export default function UploadPhoto() {
  const [selectedDate, setSelectedDate] = useState("");
  const [file, setFile] = useState(null);
  const [showGallery, setShowGallery] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 16;
  const [selectAll, setSelectAll] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [events, setEvents] = useState([]);
  const [images, setImages] = useState([]);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [otpUser, setOtpUser] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [loadedImages, setLoadedImages] = useState(0);
  const [loaderStartTime, setLoaderStartTime] = useState(null);


  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      if (!selectedFile.type.startsWith("image/")) {
        alert("Please upload a valid image file (jpg, png, jpeg etc.)");
        event.target.value = ""; // Reset file input
        setFile(null);
        return;
      }
      setFile(selectedFile);
    }
  };
  
  useEffect(() => {
    const totalOnPage = Math.min(
      imagesPerPage,
      images.length - (currentPage - 1) * imagesPerPage
    );
  
    if (!showGallery || totalOnPage <= 0) return;
  
    setLoadedImages(0);
    setIsDownloading(true);
    setLoaderStartTime(Date.now());
  }, [currentPage, showGallery, images.length]);
  
  

  useEffect(() => {
    if (!showGallery || !loaderStartTime) return;
  
    const totalOnPage = Math.min(
      imagesPerPage,
      images.length - (currentPage - 1) * imagesPerPage
    );
  
    if (loadedImages < totalOnPage || totalOnPage === 0) return;
  
    const elapsed = Date.now() - loaderStartTime;
    const delay = Math.max(0, 1000 - elapsed);
  
    const timeout = setTimeout(() => {
      setIsDownloading(false);
    }, delay);
  
    return () => clearTimeout(timeout);
  }, [loadedImages, loaderStartTime, showGallery, currentPage, images.length]);
  
  
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkAccess = () => {
      const storedUser = localStorage.getItem("otpUser");

      if (status === "loading") return;

      if (status === "authenticated" || storedUser) {
        if (storedUser) {
          setOtpUser(JSON.parse(storedUser));
        }
        setTimeout(() => {
          setIsPageLoading(false);
        }, 500); // 500ms extra delay to let the page UI fully load smoothly
        
      } else {
        router.replace("/");
        setTimeout(() => {
          setIsPageLoading(false);
        }, 500); // 500ms extra delay to let the page UI fully load smoothly
        
      }
    };

    checkAccess();
  }, [status, router]);

  useEffect(() => {
    fetchEventsByDate(""); // ✅ Load latest 10 events on initial load
  }, []);
  

  // const handleProceed = async () => {
  //   const eventSelect = document.querySelector("select").value;
  //   const selectedDate = document.querySelector('input[type="date"]').value;
  
  //   if (!eventSelect && !selectedDate && !file) {
  //     alert("Please select an event, a date, or upload a photo.");
  //     return;
  //   }
  
  //   setIsLoading(true);
  
  //   try {
  //     let eventPhotos = [];
  //     let datePhotos = [];
  //     let uploadPhotos = [];
  
  //     if (eventSelect && eventSelect !== "Select Event") {
  //       const eventResponse = await fetch(`${API_URL}/fetch-album-photos`, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         mode: "cors",
  //         body: JSON.stringify({ eventName: eventSelect }),
  //       });
  //       const eventData = await eventResponse.json();
  //       if (eventResponse.ok) {
  //         eventPhotos = eventData.photos;
  //       } else {
  //         console.warn("Event API:", eventData.error || "No photos found.");
  //       }
  //     }
  
  //     if (selectedDate) {
  //       const dateResponse = await fetch(`${API_URL}/fetch-photos-by-date`, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         mode: "cors",
  //         body: JSON.stringify({ date: selectedDate }),
  //       });
  //       const dateData = await dateResponse.json();
  //       if (dateResponse.ok) {
  //         datePhotos = dateData.photos;
  //       } else {
  //         console.warn("Date API:", dateData.error || "No photos found.");
  //       }
  //     }
  
  //     if (file) {
  //       const formData = new FormData();
  //       formData.append("image", file); // append raw image
  
  //       const uploadResponse = await fetch(`${API_URL}/search-by-upload`, {
  //         method: "POST",
  //         body: formData, // no headers — browser sets them for FormData
  //       });
  
  //       const uploadData = await uploadResponse.json();
  //       if (uploadResponse.ok) {
  //         uploadPhotos = uploadData.photos;
  //       } else {
  //         console.warn("Upload API:", uploadData.error || "No photos found.");
  //       }
  //     }
  
  //     // Merge all photo sources and remove duplicates by photo_id
  //     const mergedPhotos = [...new Map([
  //       ...eventPhotos,
  //       ...datePhotos,
  //       ...uploadPhotos
  //     ].map(photo => [photo.photo_id, photo])).values()];
  
  //     if (mergedPhotos.length > 0) {
  //       setShowGallery(true);
  //       setImages(mergedPhotos);
  //       setTotalPages(Math.ceil(mergedPhotos.length / imagesPerPage));
  //       setCurrentPage(1);
  //     } else {
  //       alert("No photos found for the selected filters. If Searching with Photo Make sure Face is clear");
  //       setFile(null);
  //       setSelectedDate("");
  //       document.querySelector("select").value = "";
  //     }
  
      
  //   }  catch (error) {
  //     console.error("Error fetching photos:", error);
  //     alert("Failed to fetch photos.");
  //   } finally {
  //     setIsLoading(false); // ✅ This will always run
  //   }
  // };
  const handleProceed = async () => {
    if (!file) {
      alert("Please upload a photo.");
      return;
    }
  
    setIsLoading(true);
  
    try {
      const formData = new FormData();
      formData.append("image", file);
  
      const uploadResponse = await fetch(`${API_URL}/search-by-upload`, {
        method: "POST",
        body: formData,
      });
  
      const uploadData = await uploadResponse.json();
      if (uploadResponse.ok) {
        if (uploadData.photos.length > 0) {
          setShowGallery(true);
          setImages(uploadData.photos);
          setTotalPages(Math.ceil(uploadData.photos.length / imagesPerPage));
          setCurrentPage(1);
        } else {
          alert("No photos found. Please use a clearer photo.");
          setFile(null);
        }
      } else {
        console.warn("Upload API:", uploadData.error || "No photos found.");
        alert(uploadData.error || "Failed to find matching photos. Please upload a clear photo.");
        setFile(null);
      }      
    } catch (error) {
      console.error("Error fetching photos:", error);
      alert("Failed to fetch photos.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownload = (src) => {
    const link = document.createElement("a");
    link.href = src;
    link.download = src.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadC = async () => {
    try {
      await fetch(`${API_URL}/increment-download-count`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      // Now proceed with the actual download logic...
      console.log("Download count incremented!");

    } catch (err) {
      console.error("Failed to update download count:", err);
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

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedImages([]);
    } else {
      setSelectedImages(images.map((img) => img.image));  // ✅ Only URLs
    }
    setSelectAll(!selectAll);
  };


  // Handle Single Select
  const handleImageSelect = (src) => {
    setSelectedImages((prev) => {
      if (prev.includes(src)) {
        return prev.filter((img) => img !== src);
      }
      return [...prev, src];
    });

    setSelectAll(selectedImages.length + 1 === images.length);
  };



  const handleDownloadAll = async () => {
    if (selectedImages.length === 0) {
      alert("No images selected!");
      return;
    }

    setIsDownloading(true);

    try {
      const zip = new JSZip();

      await Promise.all(selectedImages.map(async (url, index) => {
        try {
          if (!url.startsWith("http")) {
            console.warn("Skipping invalid URL:", url);
            return; // Skip non-URLs
          }
          const response = await fetch(`${API_URL}/proxy-image?url=${encodeURIComponent(url)}`);
          if (!response.ok) {
            console.warn("Skipping fetch failed:", url);
            return;
          }
          const blob = await response.blob();
          zip.file(`image_${index + 1}.jpg`, blob);
        } catch (err) {
          console.warn("Error fetching single image:", url, err);
        }
      }));

      const blob = await zip.generateAsync({ type: "blob" });
      const zipUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = zipUrl;
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
            title: "Custom Download", // or dynamically assign a custom name
            image: selectedImages[0], // use the first selected image
            photoCount: selectedImages.length,
            date: new Date().toLocaleDateString("en-GB"),
            photoUrls: selectedImages,
          },
        }),
      }).catch((err) =>
        console.error("❌ Failed to record download history to DB:", err)
      );
    }
      document.body.removeChild(link);

      URL.revokeObjectURL(zipUrl);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download images.");
    } finally {
      setIsDownloading(false);
    }
  };


  // Copy All Selected Links
  const handleCopyAllLinks = () => {
    if (selectedImages.length === 0) return alert("No images selected!");
    const links = selectedImages.map((src) => window.location.origin + src).join("\n");
    navigator.clipboard.writeText(links).then(() => alert("All links copied!"));
  };

  // Share Selected Images
  const handleShareAll = async () => {
    if (selectedImages.length === 0) {
      alert("No images selected!");
      return;
    }

    // ✅ Add limit for sharing
    if (selectedImages.length > 10) {
      alert("Please select up to 10 images at a time for sharing.");
      return;
    }

    setIsDownloading(true);

    try {
      const files = await Promise.all(selectedImages.map(async (url, index) => {
        const response = await fetch(`${API_URL}/proxy-image?url=${encodeURIComponent(url)}`);
        const blob = await response.blob();
        return new File([blob], `image_${index + 1}.jpg`, { type: blob.type });
      }));

      if (navigator.canShare && navigator.canShare({ files })) {
        await navigator.share({
          title: "Check out these images!",
          text: "Shared via Your CMO AI app!",
          files,
        });
      } else {
        alert("Sharing not supported on this device.");
      }
    } catch (err) {
      console.error("Error sharing images:", err);
      alert("Error sharing images.");
    } finally {
      setIsDownloading(false);
    }
  };



  const [totalPages, setTotalPages] = useState(1);


  const fetchEventsByDate = async (date) => {
    try {
      const response = await fetch(`${API_URL}/events-by-date`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date }), // Pass empty string if no date
      });
  
      const data = await response.json();
      if (response.ok) {
        setEvents(data); // Will be latest 10 if no date, or filtered events if date is present
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error("Error fetching events by date:", error);
      setEvents([]);
    }
  };
  
  useEffect(() => {
    if (!isDownloading) return;
  
    const fallback = setTimeout(() => {
      setIsDownloading(false);
    }, 5000); // fallback stop after 5 seconds
  
    return () => clearTimeout(fallback);
  }, [isDownloading]);
  
  useEffect(() => {
    if (!showGallery) {
      setFile(null);         // ✅ Clear uploaded image
      setSelectedDate("");   // ✅ (Optional) Clear date
      // Reset dropdown manually if needed
    }
  }, [showGallery]);
  
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
          <p className="mt-4 text-lg font-semibold text-gray-700">Search Your Photo With AI...</p>
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
    <div className="items-center min-h-screen bg-white font-sans">
      <Navbar setShowGallery={setShowGallery} />
      {!showGallery ? (
        <>
          {/* Back Button full screen top-left */}
          <div className="w-full flex justify-start px-4 py-3">
          <button
  onClick={() => {
    if (showGallery) {
      setShowGallery(false); // ✅ if showing gallery, go back to upload form
      setSelectedImages([]);
      setSelectAll(false);
    } else {
      router.push("/dashboard"); // ✅ if on upload form, go back to dashboard
    }
  }}
  className="flex items-center gap-2 text-[#170645] font-semibold text-base"
>
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
    viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
  <span>Back</span>
</button>

          </div>
          <div className="flex flex-col items-center min-h-screen bg-white font-sans">

            <h1 className="text-3xl font-extrabold text-[#170645]">Upload Photo</h1>
            {/* <p className="text-sm text-[#170645] mt-1">& Event Details</p>
            <div className="flex items-center w-full max-w-md mt-4">
              <hr className="flex-grow border-gray-300" />
              <p className="mx-4 text-gray-500">Event Details</p>
              <hr className="flex-grow border-gray-300" />
            </div> */}

            <div className="w-full max-w-md mt-2">
              <div className="p-4  bg-white">
                {/* <div className="relative w-full mb-4">
                  <p className="text-sm font-medium ml-2 text-gray-600 mb-2">Select Date</p>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      fetchEventsByDate(e.target.value);  // ✅ Fetch events for selected date
                    }}
                    className="w-full p-3 border border-gray-300 rounded-full text-[#170645] bg-white focus:outline-none"
                  />
                  <span className="absolute right-4 top-4 text-gray-400"></span>
                </div>

                <div className="relative w-full">
                  <select
                    className="w-full p-3 border border-gray-300 rounded-full appearance-none text-[#170645] bg-white focus:outline-none"
                  >
                    <option value="">Select Event By Category </option>
                    {events.length === 0 ? (
                      <option value="">No Events Available for this date</option>
                    ) : (
                      events.map((event, index) => (
                        <option key={index} value={event}>
                          {event}
                        </option>
                      ))
                    )}
                  </select>

                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                    <svg
                      className="w-4 h-4 text-[#170645]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div> */}
                {/* <div className="flex items-center w-full max-w-md mt-7 mb-6">
                  <hr className="flex-grow border-gray-300" />
                  <p className="mx-4 text-gray-500">Upload Photo</p>
                  <hr className="flex-grow border-gray-300" />
                </div> */}
                <p className="text-red-600 text-sm font-semibold my-4 text-center">
  Dont use photos with filters, heavy editing, or blurred backgrounds.
</p>

                {/* <label
                  htmlFor="file-upload"
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const droppedFile = e.dataTransfer.files[0];
                    if (droppedFile) {
                      if (!droppedFile.type.startsWith("image/")) {
                        alert("Please upload a valid image file (jpg, png, jpeg etc.)");
                        return;
                      }
                      setFile(droppedFile);
                    }
                  }}
                  className={`flex flex-row items-center justify-center w-full p-4 border border-gray-400 rounded-full cursor-pointer text-gray-600 mt-4 bg-white transform transition-all duration-300 ${isDragging ? "scale-105 border border-[#170645] bg-blue-100" : "hover:bg-gray-200"
                    }`}
                >
                  <svg
  width="22"
  height="22"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  className="mr-2"
>
  <path
    d="M9 10C10.1046 10 11 9.10457 11 8C11 6.89543 10.1046 6 9 6C7.89543 6 7 6.89543 7 8C7 9.10457 7.89543 10 9 10Z"
    stroke="#292D32"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
  <path
    d="M13 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V10"
    stroke="#292D32"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
  <path
    d="M18 8V2L20 4"
    stroke="#292D32"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
  <path
    d="M18 2L16 4"
    stroke="#292D32"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
  <path
    d="M2.67004 18.9501L7.60004 15.6401C8.39004 15.1101 9.53004 15.1701 10.24 15.7801L10.57 16.0701C11.35 16.7401 12.61 16.7401 13.39 16.0701L17.55 12.5001C18.33 11.8301 19.59 11.8301 20.37 12.5001L22 13.9001"
    stroke="#292D32"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
</svg>

                  <p className="text-sm text-[#170645] font-semibold">Drag An Image Here Or Upload A File</p>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                 */}
<label
  htmlFor="file-upload"
  onDragOver={(e) => {
    e.preventDefault();
    setIsDragging(true);
  }}
  onDragLeave={(e) => {
    e.preventDefault();
    setIsDragging(false);
  }}
  onDrop={(e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      if (!droppedFile.type.startsWith("image/")) {
        alert("Please upload a valid image file (jpg, png, jpeg etc.)");
        return;
      }
      setFile(droppedFile);
    }
  }}
  className={`flex flex-col items-center justify-center w-full max-w-2xl p-10 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-500 ease-in-out ${
    isDragging ? "border-[#170645] border-[2px] bg-blue-50" : "border-[#170645] bg-white  border-[2px] hover:bg-gray-50"
  }`}  
>
  {/* Smiley Upload Icon */}
  <img
  src="/face icon CMO.svg"
  alt="Upload Icon"
  className="w-25 h-20 mb-4"
/>

  {/* Text Instructions */}
  <p className="text-sm text-[#170645] font-semibold mb-1">Drag An Image Here</p>
  <p className="text-sm text-[#170645] font-semibold mb-1">Or Upload A Photo</p>
  <p className="text-sm text-[#170645] font-semibold">
    Or{" "}
    <span className="text-green-600 font-semibold hover:underline">
      Browse
    </span>{" "}
    Image On Your Computer
  </p>

  {/* Hidden File Input */}
  <input
    id="file-upload"
    type="file"
    accept="image/*"
    className="hidden"
    onChange={handleFileChange}
  />
</label>

                {file && <p className="text-sm mt-2 text-gray-600 text-center">{file.name}</p>}
                <button onClick={handleProceed} className="w-full mt-6 bg-[#170645] text-yellow-500 py-3 rounded-full text-lg font-semibold shadow-md hover:shadow-lg transition-all">Proceed</button>
                {isLoading && (
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

              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="w-full p-4 mt-6">
          <div className="relative w-full mb-4 flex items-center">
            <button
              onClick={() => {
                setShowGallery(false);
                setSelectedImages([]);
                setSelectAll(false);
              }}
              className="flex items-center gap-2 text-[#170645] rounded-lg px-4 py-1 font-semibold text-base"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back</span>
            </button>
            {/* Title: Centered */}
            <h1 className="text-3xl font-extrabold text-[#170645] absolute left-1/2 transform -translate-x-1/2">
              Related Image Searches
            </h1>

            {/* Select All Checkbox: Right-aligned */}
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
          <div className="flex flex-col sm:flex-row sm:justify-between items-center w-full mb-4">
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex flex-col sm:flex-row gap-3 px-4 py-3 rounded-full ">
              <button
                onClick={handleShareAll}
                className="min-w-[150px] px-4 py-2 bg-yellow-400 text-black rounded-full flex items-center justify-center gap-2 text-sm font-semibold shadow hover:shadow-md"
              >
                <FiShare size={18} /> Share <span className={`${selectedImages.length > 10 ? "text-red-600 font-bold" : "text-black font-semibold"
                  }`}>

                  {selectedImages.length}/10
                </span>
              </button>
              <button

                onClick={() => { handleDownloadAll(); }}
                className="min-w-[150px] px-4 py-2 bg-[#170645] text-yellow-500 rounded-full flex items-center justify-center gap-2 text-sm font-semibold shadow hover:shadow-md"
              >
                <FiDownload size={18} /> Download
              </button>
            </div>
          </div>
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 mt-4">
            {images
              .slice((currentPage - 1) * imagesPerPage, currentPage * imagesPerPage)
              .map((image, index) => (
                <div key={index} className="break-inside-avoid bg-white p-2 rounded-[30px] transition 
               border-2 border-transparent hover:border-[#0084FF] hover:shadow-md">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="absolute top-4 right-4 z-10 w-4 h-4 accent-[#170645]"
                      checked={selectedImages.includes(image.image)}
                      onChange={() => handleImageSelect(image.image)}
                    />
                    <img src={image.image} alt={image.title} onClick={() => handleImageSelect(image.image)}  onLoad={() => setLoadedImages((prev) => prev + 1)}  onError={() => setLoadedImages((prev) => prev + 1)} className="w-full rounded-[30px]" />
                  </div>
                </div>
              ))}
          </div>
          {totalPages > 1 && (
            <>
              <div className="flex justify-center mt-6 mb-4 space-x-4">
                <button
                   onClick={() => {
                    setIsDownloading(true);
                    setLoadedImages(0);
                    setLoaderStartTime(Date.now());
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
                  onClick={() => {
                    setIsDownloading(true);
                    setLoadedImages(0);
                    setLoaderStartTime(Date.now());
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                  }}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded-lg bg-[#170645] text-yellow-500"
                >
                  {">>"}
                </button>
              </div>

              {/* Spacer below pagination to avoid overlap */}
              <div className="h-20" />
            </>
          )}

        </div >

      )}


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


