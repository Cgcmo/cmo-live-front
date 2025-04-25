
"use client";
import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, BarChart2, Users, Image, User } from 'lucide-react';
import './ToggleSwitch.css';
import CustomBarChart from './CustomBarChart';
import ModalPopup from "./ModalPopup";
import Profile from "./Profile";
import EventCard from "./EventCard";
import AllPhotos from "./AllPhotos";
import Navbar from '@/app/dashboard/components/Navbar';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Footer from "@/app/dashboard/components/Footer";


function App() {
  const [search, setSearch] = useState("");
  const [currentTab, setCurrentTab] = useState("All Photos");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [percentageChange, setPercentageChange] = useState(null);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [otpUser, setOtpUser] = useState(null);
  const userName = session?.user?.name || otpUser?.name || "";
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const [users, setUsers] = useState([]);
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("otpUser");

      if (status === "loading") return;

      if (!storedUser && status === "unauthenticated") {
        router.replace("/"); // 🔐 Redirect to home/login
      } else {
        setOtpUser(JSON.parse(storedUser)); // ✅ Allow access
      }
    };

    checkAuth(); // Run immediately
    window.addEventListener("storage", checkAuth); // Handle logout from other tabs

    return () => window.removeEventListener("storage", checkAuth);
  }, [status, router]);


  const eventNames = ["Rajyotsava", "Mahtarivandan Yojna", "Mor Awas Mor Adhikar"];

  const handleDownload = () => {
    if (selectedImages.length === 0) {
      alert("No images selected for download.");
      return;
    }
    setIsDownloading(true); // Show loader
    const startTime = Date.now();

    selectedImages.forEach((image) => {
      const link = document.createElement("a");
      link.href = image; // Assuming image URLs are valid direct links
      link.download = image.split("/").pop(); // Extract filename from URL
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });

    const elapsed = Date.now() - startTime;
    const delay = Math.max(1000 - elapsed, 0); // At least 1 sec
  
    setTimeout(() => {
      setIsDownloading(false); // Hide loader after delay
    }, delay);
  };

  const Switch = ({ checked, onChange }) => {
    return (
      <label className="switch">
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className="slider"></span>
      </label>
    );
  };

  const handleSelectAll = (event) => {
    setIsSelectAll(event.target.checked);
  };


  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.district.toLowerCase().includes(search.toLowerCase()) ||
    user.mobile.includes(search) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const [stats, setStats] = useState([
    // { label: "Total User", count: "0", image: "/tuser.png", bg: "#A889FC80" },
    { label: "Total Image", count: "0", image: "/timage.png", bg: "#90C0F6" },
    { label: "Total Download", count: "0", image: "/tdownload.png", bg: "#A1C181" },
    // { label: "Total Event", count: "0", image: "/tevent.png", bg: "#F6CB90" },
  ]);


  const toggleStatus = (id) => {
    setUsers((users) =>
      users.map((user) =>
        user.id === id ? { ...user, status: !user.status } : user
      )
    );
  };

  const fetchAllStats = async () => {
    try {
      const [userRes, albumRes, photoRes] = await Promise.all([
        fetch("https://5f64-2409-4043-400-c70d-f18c-bef4-7b7d-6e83.ngrok-free.app/count-users"),
        fetch("https://5f64-2409-4043-400-c70d-f18c-bef4-7b7d-6e83.ngrok-free.app/count-albums"),
        fetch("https://5f64-2409-4043-400-c70d-f18c-bef4-7b7d-6e83.ngrok-free.app/count-photos"),
      ]);
  
      const totalUsers = (await userRes.json()).total_users;
      const totalAlbums = (await albumRes.json()).total_albums;
      const totalPhotos = (await photoRes.json()).total_photos;
      const localDownloads = JSON.parse(localStorage.getItem("downloadHistory") || "[]").length;
  
      setStats([
        // { label: "Total User", count: totalUsers.toString(), image: "/tuser.png", bg: "#A889FC80" },
        { label: "Total Image", count: totalPhotos.toString(), image: "/timage.png", bg: "#90C0F6" },
        { label: "Total Download", count: localDownloads.toString(), image: "/tdownload.png", bg: "#A1C181" },
        // { label: "Total Event", count: totalAlbums.toString(), image: "/tevent.png", bg: "#F6CB90" },
      ]);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };
  



  useEffect(() => {
    const loadPageData = async () => {
      await fetchAllStats(); // load stats
      setIsPageLoading(false); // ✅ end page loader
    };
    loadPageData();
  }, []);
  

  // useEffect(() => {
  //   fetchAllStats();
  // }, []);

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
                      <p className="mt-4 text-lg font-semibold text-gray-700">Search Your Photos With AI...</p>
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
      {/* Navbar */}
      <Navbar search={search} setSearch={setSearch} setShowFilter={setShowFilter} setShowGallery={setShowGallery} />

      {/* Filter Modal */}
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

      {/* Hero Section */}

      <div className="relative bg-gradient-to-b from-[#1a0645] via-[#170645] to-[#000000ee] text-white p-6 md:p-12 flex flex-col md:flex-row justify-between items-center rounded-b-[30px] md:rounded-b-[100px]">

        {/* ✅ Back Button inside Hero */}
        <button
          onClick={() => router.push("/dashboard")}
          className="absolute top-4 left-4 text-[white] px-4 py-1.5  text-md font-semibold flex items-center gap-2"
        >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
        viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg> <span>Back</span>
        </button>
        <div className="text-center md:text-left mb-8 md:mb-0">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">Welcome To CMO Gallery</h1>
          <p className="text-2xl sm:text-3xl md:text-4xl font-thin mt-2 mb-4">Here's Everything You Need To Know To Get Started.</p>
          {userName && (
            <p className="text-xl sm:text-2xl font-semibold mt-16">Hello , <span style={{ color: '#FFE100' }}>{userName}</span></p>
          )}

        </div>
        <img
          src="/CM.png"
          alt="admin"
          className="w-[200px] h-[220px] sm:w-[280px] sm:h-[300px] md:w-[345px] md:h-[365px] drop-shadow-lg transition-transform duration-300 hover:scale-105 object-cover"
          style={{
            WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
            maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
          }}
        />
      </div>

      {/* Stats and Graph Section */}
      <div className="p-4 sm:p-6 flex flex-col lg:flex-row gap-6">
        {/* Stats Section */}
        <div className="flex flex-col flex-1">
          <h2 className="text-2xl font-semibold text-[#170645] mb-4 text-center lg:text-left">Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mx-auto my-auto">
            {stats.map((item, index) => (
              <div
                key={index}
                className="w-full h-full max-w-[200px] h-[200px] aspect-square mx-auto rounded-[25px] flex flex-col items-center justify-center shadow-md transition-all duration-300 hover:scale-105 transform transition-transform duration-300"
                style={{ backgroundColor: item.bg }}
              >
                <div className="w-8 h-8 mb-2 mt-2 flex items-center justify-center">
                  <img src={item.image} alt="Stat Icon" className="w-[20px] h-[20px]" />
                </div>
                <p className="text-lg font-bold text-[#170645]">{item.count}</p>
                <h3 className="text-md mb-2 ml-4 mr-4 font-normal text-[#170645]">{item.label}</h3>
              </div>
            ))}
          </div>
        </div>


        {/* Chart Section */}
        <div className="flex-1 mt-8 lg:mt-0">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-[#170645]">Total User</h2>
            {percentageChange !== null && (
              <p className={`font-semibold ${percentageChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                {Math.abs(percentageChange)}% {percentageChange >= 0 ? "↑" : "↓"}
              </p>
            )}
          </div>
          <CustomBarChart onPercentageChange={setPercentageChange} />
        </div>

      </div>

      {/* Tabs & Gallery */}
      <div className="p-4 sm:p-6">
        {/* Tab Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center border-b pb-2 gap-4">
          <div className="flex space-x-4 sm:space-x-8 overflow-x-auto pb-2 sm:pb-0">
            {["All Photos", "My Downloads", "Profile Update"].map((tab) => (
              <button
                key={tab}
                className={`px-3 sm:px-4 py-2 font-semibold text-[#170645] whitespace-nowrap ${currentTab === tab ? "border-b-2 border-[#170645] font-bold" : "font-light"
                  }`}
                onClick={() => setCurrentTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {currentTab === "All Photos" && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:ml-auto">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="selectAll"
                  className="w-4 h-4 cursor-pointer accent-[#170645]"
                  onChange={handleSelectAll}
                  checked={isSelectAll}
                />
                <label htmlFor="selectAll" className="text-sm cursor-pointer text-[#686868]">Select All</label>
              </div>
              <button
                className="bg-[#170645] text-[#FFE100] w-full sm:w-[174px] h-[40px] sm:h-[54px] rounded-lg font-normal"
                onClick={handleDownload}
              >
                Download
              </button>
            </div>
          )}
        </div>


        {currentTab === "All Photos" && <AllPhotos isSelectAll={isSelectAll} setSelectedImages={setSelectedImages} />}

        {/* My Downloads Tab Content */}

        {currentTab === "My Downloads" && (
          <EventCard />
        )}

        {/* Profile Update Tab Content */}
        {currentTab === "Profile Update" && <Profile />}


      </div>
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

export default App;


