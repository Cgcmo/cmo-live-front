
import React, { useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";
import { FiX } from "react-icons/fi";


const EventCard = () => {
  const [events, setEvents] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const history = JSON.parse(localStorage.getItem("downloadHistory") || "[]");
    setEvents(history);
    setTimeout(() => setLoading(false), 500);
  }, []);

  const handleRedownload = async (title) => {
    setIsDownloading(true);
  
  const startTime = Date.now();

    try {
      const response = await fetch("https://b364-49-35-193-75.ngrok-free.app/fetch-album-photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventName: title }),
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error fetching album photos");
  
      const photos = data.photos;
      if (!photos.length) return alert("No photos found for this album.");
  
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
  
      photos.forEach((photo, index) => {
        const imageBase64 = photo.image.startsWith("data:image")
          ? photo.image.split(",")[1]
          : photo.image;
  
        const extension = photo.image.includes("image/png") ? "png" : "jpg";
        zip.file(`${title}_photo_${index + 1}.${extension}`, imageBase64, { base64: true });
      });
  
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
  
      const link = document.createElement("a");
      link.href = url;
      link.download = `${title}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      URL.revokeObjectURL(url);
     } catch (err) {
    console.error("❌ Redownload failed:", err);
    alert("Redownload failed.");
  } finally {
    const elapsed = Date.now() - startTime;
    const delay = Math.max(1000 - elapsed, 0);
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadingTitle("");
    }, delay);
  }
  };
  
  
  const handleDelete = (index) => {
    const updated = [...events];
    updated.splice(index, 1);
    setEvents(updated);
    localStorage.setItem("downloadHistory", JSON.stringify(updated));
  };

  if (events.length === 0) {
    return (
      <div className="p-6 text-center text-gray-600">
        No download history found.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mt-4 p-6 rounded-lg max-w-md mx-auto text-center bg-white ">
        <div className="flex justify-center items-center h-[250px]">
          <div className="relative w-16 h-16">
            <svg
              aria-hidden="true"
              className="absolute inset-0 w-16 h-16 animate-spin text-gray-300"
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
      </div>
    );
  }
  

  return (
    <div className="p-6 space-y-4">
      {events.map((event, index) => (
        <div key={index} className="flex items-center justify-between p-4 bg-gray-200 rounded-2xl shadow-md max-w-screen mx-auto">
           {/* Left Side: Image + Text */}
           <div className="flex items-center">
            {/* Image Section */}
          <img
            src={event.image} 
            alt={event.title}
            className="w-[107px] h-[97px] rounded-lg object-cover"
          />

          {/* Text Content */}
          <div className="ml-8">
            <h2 className="text-lg text-black font-bold">{event.title}</h2>
            <p className="text-sm font-semibold text-[#170645]">
              <span className="font-semibold text-[#170645]">Last Download :</span> {event.lastDownload}
            </p>
            <p className="text-[#170645] text-sm font-semibold mt-1">{event.photoCount} Photos</p>
          </div>
        </div>
        {/* Right Side: Buttons */}
        <div className="flex space-x-2">
        <button
  onClick={() => handleRedownload(event.title)}
  className="text-green-600 hover:text-green-800 p-2 rounded-full"
  title="Download Album"
>
  <FiDownload size={25} />
</button>

<button
  onClick={() => handleDelete(index)}
  className="text-red-600 hover:text-red-800 p-2 rounded-full"
  title="Delete History"
>
  <FiX size={25} />
</button>

          </div>
        </div>
        
        
      ))}
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
    </div>
  );
};

export default EventCard;
