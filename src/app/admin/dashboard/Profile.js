

"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import API_URL from '@/app/api';
import Loader from "./Loader";

export default function Profile() {
  const [user, setUser] = useState({
    name: "",
    district: "",
    mobile: "",
  });
  const [districts, setDistricts] = useState([]); // Store districts list
  const router = useRouter();

  const [showLoader, setShowLoader] = useState(false);

const showLoadingScreen = () => {
  setShowLoader(true);
  const minTime = new Promise(resolve => setTimeout(resolve, 1000));
  const maxTime = new Promise(resolve => setTimeout(resolve, 10000));
  return Promise.race([minTime, maxTime]);
};

// inside useEffect or any fetch function:
useEffect(() => {
  const fetchData = async () => {
    await showLoadingScreen();
    // your API fetch here
    setShowLoader(false); // hide loader after fetch
  };
  fetchData();
}, []);

  useEffect(() => {
    const userId = Cookies.get("loggedInUserId");
    if (!userId) {
      alert("User not logged in!");
      router.push("/"); // Redirect to login page
      return;
    }

    // Fetch user details
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/users`);
        const users = await response.json();
        const loggedUser = users.find((u) => u._id === userId);

        if (loggedUser) {
          setUser({
            name: loggedUser.name,
            district: loggedUser.district,
            mobile: loggedUser.mobile,
          });
        } else {
          alert("User details not found!");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    // Fetch list of districts
    const fetchDistricts = async () => {
      try {
        const response = await fetch(`${API_URL}/districts`);
        const data = await response.json();
        setDistricts(data);
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    };

    fetchUserDetails();
    fetchDistricts();
  }, []);

  const handleUpdate = async () => {
    const userId = Cookies.get("loggedInUserId");
    if (!userId) return;

    try {
      const response = await fetch(`${API_URL}/update-user/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Profile updated successfully!");
      } else {
        alert(result.error || "Update failed!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleLogout = () => {
    Cookies.remove("loggedInUserId");
    // Cookies.remove("adminLoggedIn");
    //  ✅ Completely prevent Back/Forward navigation after logout
    window.history.replaceState(null, null, "/admin");
    window.history.pushState(null, null, "/admin");

    // ✅ Reload the page to fully reset session state
    setTimeout(() => {
      window.location.href = "/admin"; // Full reload ensures session is cleared
    }, 100);
  };

  return (
    <div className="flex items-center justify-center h-auto bg-white">
      <div className="p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-[#170645]">Profile Update</h2>
        <p className="text-center text-gray-600">Update Below Detail</p>

        {/* Name Input */}
        <div className="mt-4">
          <input
            type="text"
            placeholder="Enter Name"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            className="w-full mt-2 p-3 pl-5 border border-gray-500 rounded-full text-[#170645] focus:outline-none focus:ring-2 focus:ring-[#170645]"
          />
        </div>

        {/* Mobile Input */}
        <div className="mt-4">
          <input
            type="text"
            placeholder="Contact"
            value={user.mobile}
            onChange={(e) => setUser({ ...user, mobile: e.target.value })}
            className="w-full mt-2 p-3 pl-5 border border-gray-500 rounded-full text-[#170645] focus:outline-none focus:ring-2 focus:ring-[#170645]"
          />
        </div>

        {/* District Dropdown */}
        <div className="mt-4 relative">
          <select
            value={user.district}
            onChange={(e) => setUser({ ...user, district: e.target.value })}
            className="appearance-none w-full mt-2 p-3 pl-5 pr-10 border border-gray-500 rounded-full text-[#170645] focus:outline-none focus:ring-2 focus:ring-[#170645]"
          >
            <option value="" disabled>Select District</option>
            {districts.map((dist, index) => (
              <option key={index} value={dist.name}>
                {dist.name}
              </option>
            ))}
          </select>

          {/* Custom dropdown arrow */}
          <div className="pointer-events-none absolute inset-y-0 pt-2 right-4 flex items-center text-[#170645]">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Update Button */}
        <button
          onClick={handleUpdate}
          className="w-full mt-6 bg-[#170645] text-yellow-400 font-bold p-3 rounded-full hover:bg-indigo-800 transition duration-300"
        >
          Update
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full mt-3 text-red-600 text-center font-medium hover:underline"
        >
          Logout
        </button>
      </div>
      {showLoader && <Loader />}
    </div>
  );
}
