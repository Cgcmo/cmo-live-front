"use client";
import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, BarChart2, Users, Image, User } from 'lucide-react';
import './ToggleSwitch.css';
import CustomBarChart from './CustomBarChart';
import ModalPopup from "./ModalPopup";
import DistrictsTab from "./DistrictsTab";
import DepartmentsTab from "./DepartmentsTab";
import Profile from "./Profile";
import UsersTable from "./UsersTable";
import AllPhotos from "./AllPhotos";
import Navbar from './Navbar';
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios"
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import BannerTab from "./BannerTab"
import Footer from "./Footer";


function App() {
  const [search, setSearch] = useState("");
  const [currentTab, setCurrentTab] = useState("All Events");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [totalEvents, setTotalEvents] = useState(0);
  const [userName, setUserName] = useState("");
  const [percentage, setPercentage] = useState(null);
  const [albums, setAlbums] = useState([]);

  const Switch = ({ checked, onChange }) => {
    return (
      <label className="switch">
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className="slider"></span>
      </label>
    );
  };

  const fetchAlbums = async () => {
    try {
      const response = await fetch("https://5f64-2409-4043-400-c70d-f18c-bef4-7b7d-6e83.ngrok-free.app/albums");
      if (!response.ok) {
        throw new Error("Failed to fetch albums");
      }
      const data = await response.json();
      setAlbums(data.albums || []); // fallback to empty array if undefined

    } catch (error) {
      console.error("Error fetching albums:", error);
    }
  };


  const fetchAllStats = async () => {
    try {
      const [userRes, albumRes, photoRes, downloadRes] = await Promise.all([
        axios.get("https://5f64-2409-4043-400-c70d-f18c-bef4-7b7d-6e83.ngrok-free.app/count-users"),
        axios.get("https://5f64-2409-4043-400-c70d-f18c-bef4-7b7d-6e83.ngrok-free.app/count-albums"),
        axios.get("https://5f64-2409-4043-400-c70d-f18c-bef4-7b7d-6e83.ngrok-free.app/count-photos"),
        axios.get("https://5f64-2409-4043-400-c70d-f18c-bef4-7b7d-6e83.ngrok-free.app/get-download-count"),
      ]);

      const totalUsers = userRes.data.total_users;
      const totalAlbums = albumRes.data.total_albums;
      const totalPhotos = photoRes.data.total_photos;
      const totalDownloads = downloadRes.data.count || 0;

      setStats([
        { label: "Total User", count: totalUsers.toString(), image: "/tuser.png", bg: "#A889FC80" },
        { label: "Total Download", count: totalDownloads.toString(), image: "/tdownload.png", bg: "#A1C181" },
        { label: "Total Image", count: totalPhotos.toString(), image: "/timage.png", bg: "#90C0F6" },
        { label: "Total Event", count: totalAlbums.toString(), image: "/tevent.png", bg: "#F6CB90" },
      ]);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchAllStats();
  }, []);
  useEffect(() => {
    const fetchDownloadCount = async () => {
      try {
        const res = await fetch("https://5f64-2409-4043-400-c70d-f18c-bef4-7b7d-6e83.ngrok-free.app/get-download-count");
        const data = await res.json();
        const downloadCount = data.count || 0;

        setStats(prev =>
          prev.map(stat =>
            stat.label === "Total Download"
              ? { ...stat, count: downloadCount.toString() }
              : stat
          )
        );
      } catch (err) {
        console.error("Failed to fetch download count:", err);
      }
    };

    fetchDownloadCount(); // initial fetch

    const interval = setInterval(fetchDownloadCount, 10000); // 🔁 update every 10s

    return () => clearInterval(interval); // cleanup
  }, []);


  const [stats, setStats] = useState([
    { label: "Total User", count: "0", image: "/tuser.png", bg: "#A889FC80" },
    { label: "Total Download", count: "0", image: "/tdownload.png", bg: "#A1C181" },
    { label: "Total Image", count: "0", image: "/timage.png", bg: "#90C0F6" },
    { label: "Total Event", count: "0", image: "/tevent.png", bg: "#F6CB90" },
  ]);

  useEffect(() => {
    const fetchDownloadCount = async () => {
      try {
        const res = await fetch("https://5f64-2409-4043-400-c70d-f18c-bef4-7b7d-6e83.ngrok-free.app/get-download-count");
        const data = await res.json();
        const downloadCount = data.count || 0;

        setStats(prev =>
          prev.map(stat =>
            stat.label === "Total Download"
              ? { ...stat, count: downloadCount.toString() }
              : stat
          )
        );
      } catch (err) {
        console.error("Failed to fetch download count:", err);
      }
    };

    fetchDownloadCount();
  }, []);

  const toggleStatus = (id) => {
    setUsers((users) =>
      users.map((user) =>
        user.id === id ? { ...user, status: !user.status } : user
      )
    );
  };



  useEffect(() => {
    const storedUser = localStorage.getItem("otpUser");
    if (storedUser) {
      const userObj = JSON.parse(storedUser);
      setUserName(userObj.name || "User");
    }
  }, []);


  useEffect(() => {
    const checkAuth = () => {
      const adminLoggedIn = Cookies.get("adminLoggedIn");
      if (!adminLoggedIn) {
        router.push("/admin"); // Redirect to login page
      } else {
        setIsAuthenticated(true);
      }
    };

    // ✅ Always check authentication on page load
    checkAuth();

    // ✅ Prevent the browser from caching this page (important!)
    window.onbeforeunload = () => {
      Cookies.remove("adminLoggedIn", { path: "/admin" }); // Ensure logout when closing tab
    };

    // ✅ Detect Forward/Back navigation and check authentication
    window.addEventListener("popstate", checkAuth);

    return () => {
      window.removeEventListener("popstate", checkAuth);
    };
  }, []);

  if (!isAuthenticated) {
    return null; // Prevent rendering if not authenticated
  }

  const renderChange = () => {
    if (percentage === null) return null;

    const isPositive = percentage >= 0;
    const color = isPositive ? "text-green-600" : "text-red-600";
    const arrow = isPositive ? "↑" : "↓"; // or use <ArrowUpRight /> component

    return (
      <p className={`${color} font-semibold`}>
        {Math.abs(percentage)}% {arrow}
      </p>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar search={search} setSearch={setSearch} setShowFilter={setShowFilter} setShowGallery={setShowGallery} fetchAlbums={fetchAlbums}
        fetchAllStats={fetchAllStats} />

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
      <div className="bg-gradient-to-b from-[#1a0645] via-[#170645] to-[#000000ee] text-white p-6 md:p-12 flex flex-col md:flex-row justify-between items-center rounded-b-[30px] md:rounded-b-[100px]">
        <div className="text-center md:text-left mb-8 md:mb-0">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">Welcome To CMO Gallery</h1>
          <p className="text-2xl sm:text-3xl md:text-4xl font-thin mt-2 mb-4">Here's Everything You Need To Know To Get Started.</p>
          <p className="text-xl sm:text-2xl font-semibold mt-16">
            Hello, <span style={{ color: '#FFE100' }}>{userName} </span></p>

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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mx-auto mt-[50px]">
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
            {/* <p className="text-green-600 font-semibold">75% ↑</p> */}
            {renderChange()}
          </div>
          <CustomBarChart onPercentageChange={setPercentage} />
        </div>
      </div>

      {/* Tabs & Gallery */}
      <div className="p-4 sm:p-6">
        {/* Tab Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center border-b pb-2 gap-4">
          <div className="flex space-x-4 sm:space-x-8 overflow-x-auto pb-2 sm:pb-0">
            {["All Events", "All Users", "Profile Update", "Districts", "Department", ].map((tab) => (
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


        </div>


        {currentTab === "All Events" && <AllPhotos albums={albums}
          setAlbums={setAlbums} fetchAlbums={fetchAlbums} fetchAllStats={fetchAllStats} />}
        {/* All Users Tab Content */}
        {/* Show UsersTable when the "All Users" tab is active */}


        {currentTab === "All Users" && (
          <UsersTable fetchAllStats={fetchAllStats} toggleStatus={toggleStatus} />
        )}


        {/* Profile Update Tab Content */}
        {currentTab === "Profile Update" && <Profile />}



        {/* Districts Tab Content */}
        {currentTab === "Districts" && (
          <div >
            {/* District Name Input and Add Button */}
            <DistrictsTab />
          </div>
        )}

        {currentTab === "Department" && <DepartmentsTab />}

        {currentTab === "Banner" && <BannerTab />}

      </div>
      <Footer />
    </div>
  );
}

export default App;


