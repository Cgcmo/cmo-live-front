import React, { useState } from "react";
import API_URL from '@/app/api';

const GalleryModal = ({ isOpen, setIsOpen, albumId, fetchPhotos, fetchAllStats }) => {

  const [loading, setLoading] = useState(false);  // ✅ Track loading state
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [rejectedFiles, setRejectedFiles] = useState([]);


  if (!isOpen) return null;


  const handleImageUpload = (event) => {
  setSelectedFiles([...event.target.files]);
};

const handleSave = async () => {
  if (!selectedFiles.length) {
    alert("Please upload images before saving.");
    return;
  }

  setLoading(true);
  setRejectedFiles([]); // Clear previously rejected images

  const formData = new FormData();
  selectedFiles.forEach((file) => {
    formData.append("photos", file);
  });

  try {
    const response = await fetch(`${API_URL}/upload-gallery/${albumId}`, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      // Match rejected file names to File objects
      if (result.rejected && result.rejected.length > 0) {
        const rejectedSet = new Set(result.rejected);
        const rejected = selectedFiles.filter(file => rejectedSet.has(file.name));
        setRejectedFiles(rejected);

        alert(`${result.rejected.length} image(s) skipped due to no clear face.`);
        setSelectedFiles([]);
      } else {
        alert("Photos uploaded successfully");
        setIsOpen(false);
        setSelectedFiles([]);   // ✅ Clear uploaded files
        setRejectedFiles([]);
      }

      fetchPhotos({ _id: albumId });
      fetchAllStats();

    } else {
      alert("Failed to upload photos");
    }
  } catch (error) {
    console.error("Error uploading photos:", error);
  } finally {
    setLoading(false);
  }
};

  // ✅ Fix: Define removeImage function
  const removeImage = (index) => {
    setSelectedFiles((prevImages) => prevImages.filter((_, i) => i !== index));
  };


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ">
      <div className="bg-white rounded-[20px] w-full max-w-[130vh] h-full max-h-[80vh] p-[40px] relative flex flex-col">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-600 text-xl"
          onClick={() => {
            setIsOpen(false);          // ❌ Close modal
            setSelectedFiles([]);      // ✅ Clear uploaded images
            setRejectedFiles([]);      // ✅ Clear rejected previews
          }}
        >
          ✕
        </button>

        <div className="overflow-y-auto flex-1">
        {/* Modal Header */}
        <h2 className="text-center text-2xl font-bold text-[#170645] mb-1">
          Upload Your Photo Gallery
        </h2>
        <p className="text-center text-[#170645] mb-5">
          Choose an image that will appear everywhere in our app.
        </p>

        {rejectedFiles.length > 0 && (
  <>
    <p className="text-red-600 text-center mt-6 font-bold">Rejected Images (No Face Detected)</p>
    <div className="grid grid-cols-5 gap-2 my-2 bg-red-100 rounded-lg p-4">
      {rejectedFiles.map((file, index) => (
        <div key={index} className="relative w-20 h-20">
          <img
            src={URL.createObjectURL(file)}
            alt={`Rejected ${index + 1}`}
            className="w-20 h-20 object-cover rounded-lg border border-red-400"
          />
        </div>
      ))}
    </div>
  </>
)}

        <p className="text-black mb-3  flex justify-center  font-bold">Upload New Images</p>

        {/* Image Upload Box */}
        <label
          htmlFor="fileInput"
          className="border-dashed border-2 border-gray-400 rounded-lg py-12 text-center block cursor-pointer hover:bg-gray-100 transition"
        >
          <p className="text-[#170645]">Click or Drag & Drop To Upload Multiple Images</p>
          <p className="text-gray-400 text-sm">PNG, JPG, JPEG (Max 250KB per image)</p>
        </label>
        <input
          id="fileInput"
          type="file"
          accept="image/png, image/jpeg"
          multiple
          className="hidden"
          onChange={handleImageUpload}
        />

        {/* Uploaded Images Preview */}
        <div className="mt-8">
          <p className="text-black flex justify-center font-bold">Uploaded Images</p>
          <div className="grid grid-cols-5 gap-2 mt-4 bg-gray-200 rounded-lg p-8 relative">
          {selectedFiles.map((file, index) => (
              <div key={index} className="relative w-20 h-20">
                <img src={URL.createObjectURL(file)}
                  alt={`Uploaded ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-lg border"
                />
                <button
                  className="absolute top-1 right-1  bg-red-500 text-white text-xs px-1 rounded-full"
                  onClick={() => removeImage(index)}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
        

        {/* Save Button */}
        <div className="text-center mt-6">
          <button
            className="bg-[#170645] text-[#FFE100] px-6 py-3 w-full max-w-[50vh] rounded-full text-lg"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Save Now"}
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryModal;
