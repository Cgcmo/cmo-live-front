// components/ResetPasswordForm.js
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResetPasswordForm({ mobile }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);



  const handleSubmit = async () => {
    if (!password.trim()) return alert("Please enter a new password.");

    const isValid = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);
    if (!isValid) {
      return alert("Password must be at least 8 characters, include a letter, number, and symbol.");
    }

    try {
      const res = await fetch("http://147.93.106.153:5000/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, newPassword: password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.removeItem("resetMobile");

        // ✅ Show success, then redirect to login screen
        alert("✅ Password reset successful! Please sign in.");
        router.push("/?showLogin=true");
      } else {
        alert(data.error || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="bg-white shadow-xl shadow-[0_4px_10px_rgba(0,0,0,0.12)] p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold text-center mb-4 text-[#170645]">Reset Your Password</h2>
        <p className="text-center mb-2 text-[#170645]">Mobile: +91 {mobile}</p>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter new password"
            className="w-full border rounded-full p-3 text-[#170645] bg-white border border-gray-300  mb-4 pr-12 text-sm placeholder:text-gray-400 shadow-md  focus:border-[#170645]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-[#170645] hover:text-black transition duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`h-5 w-5 transition-transform duration-300 ${showPassword ? "rotate-0" : "rotate-180 opacity-80"
                }`}
            >
              {showPassword ? (
                <>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </>
              ) : (
                <>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.977 9.977 0 013.008-4.525m3.224-1.885A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.973 9.973 0 01-4.117 5.225"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3l18 18"
                  />
                </>
              )}
            </svg>
          </button>
        </div>


        <button
          onClick={handleSubmit}
          className="w-full bg-[#170645] text-yellow-400 p-3 rounded-full font-bold"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
