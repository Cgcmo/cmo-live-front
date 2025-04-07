
import React, { useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";
import { FiX } from "react-icons/fi";


const EventCard = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("downloadHistory") || "[]");
    setEvents(history);
  }, []);

  const handleRedownload = async (title) => {
    try {
      const response = await fetch("http://localhost:5000/fetch-album-photos", {
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
    </div>
  );
};

export default EventCard;
