"use client";

import { useRouter } from "next/navigation";

import { useState, useEffect } from "react";

const Profile = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState("/pro.png");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [district, setDistrict] = useState("");
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    // fetch user from localStorage (already exists)
    const storedUser = JSON.parse(localStorage.getItem("otpUser"));
    if (!storedUser) {
      router.push("/");
      return;
    }

    setUser(storedUser);
    setName(storedUser.name || "");
    setMobile(storedUser.mobile || "");
    setDistrict(storedUser.district || "");

    if (storedUser.photo && !storedUser.photo.startsWith("data:image")) {
      setProfileImage(`/uploads/${storedUser.photo}`);
    } else {
      setProfileImage("/pro.png");
    }

    // fetch districts
    fetch("http://127.0.0.1:5000/districts")
      .then((res) => res.json())
      .then((data) => setDistricts(data))
      .catch((err) => console.error("Failed to load districts", err));
  }, [router]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("otpUser"));
    if (!storedUser) {
      router.push("/"); // not logged in
      return;
    }

    setUser(storedUser);
    setName(storedUser.name || "");
    setMobile(storedUser.mobile || "");
    setDistrict(storedUser.district || "");

    // If photo is a base64 string, fallback to default image
    if (storedUser.photo && !storedUser.photo.startsWith("data:image")) {
      setProfileImage(`/uploads/${storedUser.photo}`); // assuming photo filename is saved (e.g., xyz.jpg)
    } else {
      setProfileImage("/pro.png");
    }
  }, [router]);

  const handleUpdate = async () => {
    if (!user) return;

    try {
      const res = await fetch(`http://127.0.0.1:5000/update-client/${user.userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          mobile,
          district,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        alert("Profile updated successfully!");
        // Update localStorage
        const updatedUser = {
          ...user,
          name,
          mobile,
          district,
        };
        localStorage.setItem("otpUser", JSON.stringify(updatedUser));
        setUser(updatedUser);
      } else {
        alert(result.error || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Something went wrong.");
    }
  };

  const handleLogout = () => {
    // ✅ Remove OTP user info and any custom tokens
    localStorage.removeItem("otpUser");
    localStorage.removeItem("authToken");
    sessionStorage.clear();

    // ✅ Prevent navigating back
    window.history.pushState(null, null, "/");
    window.addEventListener("popstate", () => {
      window.history.pushState(null, null, "/");
    });

    // ✅ Redirect to login and reload the app
    window.location.href = "/";
  };


  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };



  return (
    <div className="mt-4 p-6 rounded-lg max-w-md mx-auto text-center">
      <h2 className="text-2xl font-bold text-[#170645]">Profile Update</h2>
      <p className="text-[#170645] mb-4">Update Below Detail</p>
      {/* <div className="relative w-20 h-20 mx-auto mb-4">
        <img
          src={profileImage}
          alt="Profile"
          className="w-20 h-20 rounded-full border"
        /> */}
      {/* <label
  htmlFor="file-upload"
  className="absolute bottom-0 right-0 bg-white p-1 rounded-full border shadow cursor-pointer"
>
  <input
    id="file-upload"
    type="file"
    accept="image/*"
    className="hidden"
    onChange={handleImageUpload}
  />
  <img src="/Group 737.png" alt="Edit" className="w-5 h-5" />
</label> */}

      {/* </div> */}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border rounded-full text-[#170645] focus:outline-none"
        />
        <input
          type="text"
          placeholder="Contact"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className="w-full p-3 border rounded-full focus:outline-none text-[#170645]"
        />
        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="w-full p-3 border text-[#170645] rounded-full focus:outline-none"
        >
          <option value="">Select District</option>
          {districts.map((d, index) => (
            <option key={index} value={d.name}>
              {d.name}
            </option>
          ))}
        </select>

        <button onClick={handleUpdate} className="w-full p-3 bg-[#170645] text-[#FFE100] rounded-full font-semibold">
          Update
        </button>
        <button
          className="w-full p-3 text-red-600 font-normal mt-2"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};


export default Profile;
