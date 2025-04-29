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
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [district, setDistrict] = useState("");
  const [districts, setDistricts] = useState([]);
  const isGoogleUser = !!session?.user?.email;
  const [loading, setLoading] = useState(true); // new loading state


  useEffect(() => {
    const startTime = Date.now();
  
    const fetchData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("otpUser"));
        if (!storedUser && !session && status !== "loading") {
          router.push("/");
          return;
        }
  
        if (storedUser) {
          setUser(storedUser);
          setName(storedUser.name || "");
          setMobile(storedUser.mobile || "");
          setDistrict(storedUser.district || "");
          setEmail(storedUser.email || "");
          if (storedUser.photo && !storedUser.photo.startsWith("data:image")) {
            setProfileImage(`/uploads/${storedUser.photo}`);
          } else {
            setProfileImage("/pro.png");
          }
        } else if (session?.user?.email) {
          const res = await fetch(`http://147.93.106.153:5000/get-user-by-email/${session.user.email}`);
          const userData = await res.json();
          setUser({ email: session.user.email });
          setName(userData.name || session.user.name || "");
          setMobile(userData.mobile || "");
          setDistrict(userData.district || "");
        }
  
        const districtRes = await fetch("http://147.93.106.153:5000/districts");
        const districtData = await districtRes.json();
        setDistricts(districtData);
      } catch (err) {
        console.error("Profile load failed", err);
      } finally {
        const elapsed = Date.now() - startTime;
        const delay = Math.max(1000 - elapsed, 0);
        setTimeout(() => setLoading(false), delay);
      }
    };
  
    fetchData();
  }, [session, status, router]);
  

  const handleUpdate = async () => {
    if (!name || !mobile || !district) {
      alert("All fields are required!");
      return;
    }

    if (session?.user?.email) {
      // ✅ Save Google user to DB
      try {
        const res = await fetch("http://147.93.106.153:5000/save-google-user", {
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
        const res = await fetch(`http://147.93.106.153:5000/update-client/${user.userId}`, {
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
            disabled
            className="w-full p-3 pl-5 border border-gray-500 bg-white rounded-full text-[#170645] cursor-not-allowed"
          />
          <input
            type="text"
            placeholder="Contact"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            disabled
            className="w-full p-3 pl-5 border border-gray-500 bg-white rounded-full cursor-not-allowed text-[#170645]"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            disabled
            className="w-full p-3 pl-5 border border-gray-500 rounded-full bg-white text-[#170645] cursor-not-allowed"
          />

          <div className="relative w-full">
            <input
              type="text"
              placeholder="District"
              value={district}
              disabled
              className="w-full p-3 pl-5 border border-gray-500 rounded-full bg-white text-[#170645] cursor-not-allowed"
            />

          </div>

          {/* <button onClick={handleUpdate} className="w-full p-3 bg-[#170645] text-[#FFE100] rounded-full font-semibold">
            Update
          </button> */}
          <button
            className="w-full p-3 text-white rounded-full  font-semibold bg-red-600 font-normal mt-2"
            onClick={handleLogout}
          >
            {session ? "Logout from Google" : "Logout"}
          </button>
        </div>)}
    </div>
  );
};


export default Profile;
