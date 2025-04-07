import React, { useState } from "react";

const BannerTab = () => {
  const [title, setTitle] = useState("");
  const [banners, setBanners] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const newBanner = {
        id: Date.now(),
        title: title || "Enter Banner Title",
        image: reader.result,
        size: (file.size / 1024).toFixed(0) + "kb",
        date: new Date().toLocaleDateString(),
      };
      setBanners([newBanner, ...banners]);
      setTitle("");
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = (id) => {
    setBanners(banners.filter((banner) => banner.id !== id));
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-4 p-4">
      {/* Left: Upload Section */}
      <div className="w-full lg:w-2/3 bg-[#f5f5f5] p-6 rounded-xl">
        <h2 className="text-lg font-bold mb-4">Banner</h2>

        <label className="block mb-2 font-semibold">Banner Title</label>
        <input
          type="text"
          placeholder="Enter Banner Title"
          className="w-full p-3 rounded-full border focus:outline-none mb-4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label className="block mb-2 font-semibold">Upload New Image:</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4 text-center">
          <input
            type="file"
            className="hidden"
            id="fileUpload"
            onChange={handleFileChange}
            accept="image/png, image/jpeg"
          />
          <label htmlFor="fileUpload" className="cursor-pointer text-[#170645] font-semibold">
            Click Or Drag & Drop To Upload Image
          </label>
          <p className="text-sm text-gray-500">PNG, JPG, JPEG (Max 250kb Per Image)</p>
        </div>

        {/* Preview */}
        {banners[0] && (
          <div className="bg-white p-2 rounded-lg shadow-sm mb-4 flex items-center gap-4">
            <img
              src={banners[0].image}
              alt="preview"
              className="w-12 h-12 rounded-md object-cover"
            />
            <div className="flex-1">
              <p className="font-medium text-sm text-black">{banners[0].title}</p>
              <p className="text-xs text-gray-500">{banners[0].size}</p>
              <div className="w-full bg-gray-200 h-1 rounded mt-1">
              <div className="bg-green-500 h-1 rounded w-full"></div>
              </div>
            </div>
          </div>
        )}

        <button className="w-full bg-[#170645] text-yellow-300 font-semibold py-2 rounded-full">
          Submit
        </button>
      </div>

      {/* Right: Active Banners List */}
      <div className="w-full lg:w-1/3">
        <div className="bg-[#f5f5f5] rounded-xl p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Active Banners</h2>
            <span className="text-sm font-medium">Total Banner {banners.length}</span>
          </div>

          <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
            {banners.map((banner) => (
              <div
                key={banner.id}
                className="flex items-center gap-4 bg-white p-3 rounded-lg shadow-sm"
              >
                <img
                  src={banner.image}
                  alt="banner"
                  className="w-12 h-12 rounded-md object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {banner.title}
                  </p>
                  <p className="text-xs text-gray-500">{banner.size}</p>
                </div>
                <button
                  onClick={() => handleDelete(banner.id)}
                  className="text-red-500 hover:text-red-700 text-xl"
                >
                  🗑️
                </button>
              </div>
            ))}

            {banners.length === 0 && (
              <p className="text-sm text-gray-400">No banners uploaded yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerTab;