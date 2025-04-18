"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";

const Profile = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState("/pro.png");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [district, setDistrict] = useState("");
  const [districts, setDistricts] = useState([]);
  const isGoogleUser = !!session?.user?.email;

  useEffect(() => {
    // fetch user from localStorage (already exists)
    const storedUser = JSON.parse(localStorage.getItem("otpUser"));
    if (!storedUser && !session && status !== "loading") {
      router.push("/"); // ❌ neither credential nor Google logged in
      return;
    }

    if (storedUser) {
      setUser(storedUser);
      setName(storedUser.name || "");
      setMobile(storedUser.mobile || "");
      setDistrict(storedUser.district || "");
      setDistrict(storedUser.district || "");

      if (storedUser.photo && !storedUser.photo.startsWith("data:image")) {
        setProfileImage(`/uploads/${storedUser.photo}`);
      } else {
        setProfileImage("/pro.png");
      }
    } else if (session?.user?.email) {
      // ✅ Fetch from DB for Google user
      fetch(`https://cmo-back-livee.onrender.com/get-user-by-email/${session.user.email}`)
        .then((res) => res.json())
        .then((userData) => {
          setUser({ email: session.user.email });
          setName(userData.name || session.user.name || "");
          setMobile(userData.mobile || "");
          setDistrict(userData.district || "");
        })
        .catch((err) => console.error("Failed to fetch Google user data", err));
    }

    fetch("https://cmo-back-livee.onrender.com/districts")
      .then((res) => res.json())
      .then((data) => setDistricts(data))
      .catch((err) => console.error("Failed to load districts", err));
  }, [session, status, router]);


  const handleUpdate = async () => {
    if (!name || !mobile || !district) {
      alert("All fields are required!");
      return;
    }

    if (session?.user?.email) {
      // ✅ Save Google user to DB
      try {
        const res = await fetch("https://cmo-back-livee.onrender.com/save-google-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email: session.user.email,
            mobile,
            district,
            authType: "google",
          }),
        });

        const result = await res.json();
        if (res.ok) {
          alert("Google user profile saved successfully!");
        } else {
          alert(result.error || "Something went wrong.");
        }
      } catch (error) {
        console.error("Error saving Google user:", error);
        alert("Network error!");
      }
    } else {
      try {
        const res = await fetch(`https://cmo-back-livee.onrender.com/update-client/${user.userId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, mobile, district }),
        });

        const result = await res.json();

        if (res.ok) {
          alert("Profile updated successfully!");
          const updatedUser = { ...user, name, mobile, district };
          localStorage.setItem("otpUser", JSON.stringify(updatedUser));
          setUser(updatedUser);
        } else {
          alert(result.error || "Failed to update profile.");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        alert("Something went wrong.");
      }
    }
  };


  const handleLogout = () => {
    localStorage.removeItem("otpUser");
    localStorage.removeItem("authToken");
    sessionStorage.clear();

    if (session) {
      signOut({ callbackUrl: "/" });
    } else {
      window.history.pushState(null, null, "/");
      window.addEventListener("popstate", () => {
        window.history.pushState(null, null, "/");
      });
      window.location.href = "/";
    }
  };


  return (
    <div className="mt-4 p-6 rounded-lg max-w-md mx-auto text-center">
      <h2 className="text-2xl font-bold text-[#170645]">Profile Update</h2>
      <p className="text-[#170645] mb-4">{isGoogleUser ? "Your Google Account" : "Update Below Detail"}</p>
      {isGoogleUser ? (
        <div className="space-y-4 p-4">
          <div className="w-full flex justify-center">
            <img
              src={session.user.image}
              alt="Profile"
              className="w-28 h-28 rounded-full border-2 border-[#170645]"
            />
          </div>

          <input
            type="text"
            value={session.user.name}
            disabled
            className="w-full p-3 pl-5 border border-gray-500 rounded-full text-[#170645] bg-white cursor-not-allowed"
          />
          <input
            type="email"
            value={session.user.email}
            disabled
            className="w-full p-3 pl-5 border border-gray-500 bg-white text-[#170645] rounded-full focus:outline-none cursor-not-allowed"
          />

          <button
            onClick={handleLogout}
            className="w-full p-3 text-white rounded-full  font-semibold bg-red-600 font-normal mt-2"
          >
            Logout from Google
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 pl-5 border border-gray-500 rounded-full text-[#170645] focus:outline-none"
          />
          <input
            type="text"
            placeholder="Contact"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full p-3 pl-5 border border-gray-500 rounded-full focus:outline-none text-[#170645]"
          />
          <div className="relative w-full">
  <select
    value={district}
    onChange={(e) => setDistrict(e.target.value)}
    className="appearance-none w-full p-3 pl-5 pr-10 border border-gray-500 text-[#170645] rounded-full focus:outline-none"
  >
    <option value="">Select District</option>
    {districts.map((d, index) => (
      <option key={index} value={d.name}>
        {d.name}
      </option>
    ))}
  </select>

  {/* Custom arrow */}
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
</div>


          <button onClick={handleUpdate} className="w-full p-3 bg-[#170645] text-[#FFE100] rounded-full font-semibold">
            Update
          </button>
          <button
            className="w-full p-3 text-red-600 font-normal mt-2"
            onClick={handleLogout}
          >
            {session ? "Logout from Google" : "Logout"}
          </button>
        </div>)}
    </div>
  );
};


export default Profile;
