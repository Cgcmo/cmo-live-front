"use client";
import { Poppins } from "next/font/google";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins", // CSS Variable for Tailwind
});
export default function AuthPage() {
  const [showVideoThumbnail, setShowVideoThumbnail] = useState(false);
  const [mobile, setMobile] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = Array.from({ length: 6 }, () => useRef());
  const [showSignup, setShowSignup] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { data: session } = useSession();
  const router = useRouter();
  const [showVideoFrame, setShowVideoFrame] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [signupData, setSignupData] = useState({});
  const [showOtpless, setShowOtpless] = useState(false);
  const [verifiedMobile, setVerifiedMobile] = useState("");


  useEffect(() => {
    fetch("http://127.0.0.1:5000/districts")
      .then((res) => res.json())
      .then((data) => setDistricts(data))
      .catch((err) => console.error("Failed to fetch districts:", err));
  }, []);


  useEffect(() => {
    if (showSignup) {
      setShowVideoFrame(true);
    } else {
      setShowVideoFrame(false);
    }
  }, [showSignup]);

  useEffect(() => {
    const handleBackButton = () => {
      setShowOTP(false);
      setShowSignup(false);
    };

    window.addEventListener("popstate", handleBackButton);
    return () => window.removeEventListener("popstate", handleBackButton);
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/record-visit", {
      method: "POST"
    }).catch((err) => console.error("Failed to record visit:", err));
  }, []);

  const handleSignUp = async () => {
    let errors = [];

    if (!fullName.trim()) {
      errors.push("Full Name is required.");
    } else if (!/^[A-Za-z ]+$/.test(fullName)) {
      errors.push("Full Name should contain only alphabets.");
    }

    if (!mobile.trim()) {
      errors.push("Mobile number is required.");
    } else if (!/^[6-9]\d{9}$/.test(mobile)) {
      errors.push("Mobile number must be exactly 10 digits and start with 6-9.");
    }

    if (!email.trim()) {
      errors.push("Email is required.");
    } else if (!/^[\w.-]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email)) {
      errors.push("Please enter a valid email address.");
    }
    if (!selectedDistrict) {
      errors.push("Please select a district.");
    }

    if (!password.trim()) {
      errors.push("Password is required.");
    } else if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
      errors.push("Password must be at least 8 characters long and include a letter, a number, and a special character.");
    }

    if (errors.length > 0) return alert(errors.join("\n"));

    try {
      const res = await fetch("http://127.0.0.1:5000/complete-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          email,
          mobile,
          district: selectedDistrict,
          password
        })
      });

      const result = await res.json();

      if (res.ok) {
        alert("✅ Account created successfully! Please sign in.");
        setShowSignup(false); // 👈 Show sign-in screen
      } else {
        alert(result.error || "Signup failed.");
      }
    } catch (err) {
      alert("Something went wrong while signing up.");
      console.error(err);
    }
  };

  const handleSignIn = async () => {
    if (!mobile || !password) return alert("Mobile number and password are required.");
    if (!/^[6-9]\d{9}$/.test(mobile)) return alert("Invalid mobile number.");

    try {
      const res = await fetch("http://127.0.0.1:5000/client-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, password })
      });

      const result = await res.json();

      if (res.ok) {
        localStorage.setItem("otpUser", JSON.stringify(result));
        router.push("/dashboard");
      } else {
        alert(result.error || "Login failed.");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong during login.");
    }
  };

  const handleOTPChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to the next input field automatically
      if (value && index < otpRefs.length - 1) {
        otpRefs[index + 1].current.focus();
      }
    }
  };

  const handleOTPKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current.focus();
    }
  };

  const handleOTPSubmit = async () => {
    if (!otp.every((digit) => digit !== "")) {
      return alert("Please enter the complete OTP.");
    }

    const enteredOTP = otp.join("");

    try {
      const otpRes = await fetch("http://127.0.0.1:5000/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, otp: enteredOTP })
      });

      if (otpRes.ok && showSignup) {
        const regRes = await fetch("http://127.0.0.1:5000/complete-signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: signupData.name,
            email: signupData.email,
            password: signupData.password,
            district: signupData.district,
            mobile
          })
        });

        const result = await regRes.json();

        if (regRes.ok) {
          localStorage.setItem("otpUser", JSON.stringify(result));
          router.push("/dashboard");
        } else {
          alert(result.error || "Signup failed.");
        }
      } else {
        alert("OTP verification failed.");
      }
    } catch (err) {
      alert("Something went wrong while verifying OTP.");
      console.error(err);
    }
  };


  useEffect(() => {
    const interval = setInterval(() => {
      setShowVideoThumbnail((prev) => !prev); // Toggle state every 2 seconds
    }, 4000); // Total cycle duration: 4 seconds (2s fade-out + 2s fade-in)

    return () => clearInterval(interval);
  }, []);

  const col1DefaultImages = [
    "/ban-01.png",
    "/ban-02.png",
    "/ban-03.png",
  ];

  const col2DefaultImages = [
    "/ban-04.png",
    "/ban-03.png",
    "/ban-02.png",
  ];

  const col3DefaultImages = [
    "/ban-02.png",
    "/ban-04.png",
    "/ban-01.png",
  ];

  // State for each column, initialized with unique default images
  const [col1Images, setCol1Images] = useState(col1DefaultImages);
  const [col2Images, setCol2Images] = useState(col2DefaultImages);
  const [col3Images, setCol3Images] = useState(col3DefaultImages);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes scrollDownSlow {
        from { transform: translateY(-50%); }
        to { transform: translateY(0%); }
      }

      @keyframes scrollDownFast {
        from { transform: translateY(-50%); }
        to { transform: translateY(0%); }
      }

      @keyframes scrollUpMedium {
        from { transform: translateY(0%); }
        to { transform: translateY(-50%); }
      }

      .scroll-column {
        display: flex;
        flex-direction: column;
        gap: 10px;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
      }

      .col1 {
        animation-name: scrollDownSlow;
        animation-duration: 40s; /* Slow Speed */
      }

      .col2 {
        animation-name: scrollUpMedium;
        animation-duration: 30s; /* Medium Speed */
      }

      .col3 {
        animation-name: scrollDownFast;
        animation-duration: 20s; /* Fast Speed */
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromOtpless = params.get("showSignup");

    if (fromOtpless === "true") {
      setShowSignup(true);
      const otplessUser = JSON.parse(localStorage.getItem("otplessUser"));
      const cleanedMobile = otplessUser?.mobile || "";

      if (/^[6-9]\d{9}$/.test(cleanedMobile)) {
        setVerifiedMobile(cleanedMobile);
      }
    }
  }, []);




  return (
    <div className="flex flex-col md:flex-row w-full h-screen bg-gray-100">
      {/* Left Side: Login Box */}

      <div className="w-full md:w-1/3 flex flex-col items-center justify-center p-6 md:p-12">
        <img src="/CG logo.webp" alt="Logo" className="w-24 h-24 mb-4" />
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-[516px]">
          {session ? (
            <div className="text-center">
              <p className="text-xl font-bold text-[#170645]">Welcome, {session.user.name}</p>
              <img
                src={session.user.image}
                alt="Profile"
                className="w-12 h-12 rounded-full mx-auto mt-2"
              />
              <button
                onClick={() => signOut()}
                className="w-full bg-red-500 text-white p-3 mt-5 rounded-lg font-bold"
              >
                Logout
              </button>
            </div>
          ) : showOTP ? (
            <div className="text-center">
              <h2 className="text-2xl pt-2 font-bold text-[#170645]">Verification Code</h2>
              <p className="text-[#170645] pt-2 mt-2">We Have Sent The Verification Code To Your Mobile Number</p>
              <div className="flex justify-center gap-3 flex-wrap py-2 mt-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={otpRefs[index]}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    onKeyDown={(e) => handleOTPKeyDown(index, e)}
                    className="w-12 h-12 text-center border-[#908AA0] text-[#170645] text-xl border rounded"
                  />
                ))}
              </div>
              <button onClick={handleOTPSubmit} className="w-full bg-[#170645] text-yellow-400 p-3 mt-5 mb-4 rounded-full text-lg font-bold">
                Confirm
              </button>
            </div>
          ) : showSignup ? (
            <div>
              <h2 className="text-3xl font-bold text-center text-[#170645]">AI Based CMO Gallery</h2>
              <p className="text-center text-[#170645] text-lg mt-1">One Click Download</p>
              <button onClick={async () => {
                console.log("🔵 Google Sign-In button clicked");
                const result = await signIn("google", { callbackUrl: "/dashboard" }); // ✅ Redirect to Dashboard after login
                console.log("✅ Sign-in result:", result);
              }} className="flex items-center h-11 justify-center w-full border p-3 mt-4 rounded-lg hover:bg-gray-200" >
                <img src="/google pic.png" alt="Google" className="w-5 mr-2" />
                <p className="text-[#170645] font-normal">Sign Up With Google</p>
              </button>
              <div className="flex items-center my-4">
                <hr className="flex-grow border-gray-300" />
                <span className="px-3 text-[#908AA0] text-sm">Or, Sign Up With Your Email</span>
                <hr className="flex-grow border-gray-300" />
              </div>
              <div className="flex gap-2">
                <input type="text" placeholder="Full Name" value={fullName}
                  onChange={(e) => setFullName(e.target.value)} className="border w-1/2 p-3 h-11 rounded-lg placeholder-[#170645] text-[#170645]" />
                <input
                  type="text"
                  value={verifiedMobile}
                  readOnly
                  placeholder="Mobile No."
                  className={`border w-1/2 p-3 h-11 rounded-lg text-[#170645] bg-white ${verifiedMobile ? "opacity-60 cursor-not-allowed" : ""}`}
                />




              </div>
              <input type="email" value={email}
                onChange={(e) => setEmail(e.target.value)} placeholder="Email Id" className="border w-full p-3 h-11 rounded-lg mt-3 placeholder-[#170645] text-[#170645]" />
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="border w-full p-3 h-11 rounded-lg mt-3 text-[#170645]"
              >
                <option value="">Select District</option>
                {districts.map((d, index) => (
                  <option key={index} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>

              <input type="password" placeholder="Create Your Password" value={password}
                onChange={(e) => setPassword(e.target.value)} className="border h-11 w-full p-3 rounded-lg mt-3 placeholder-[#170645] text-[#170645]" />
              <button onClick={async () => {
                const errors = [];

                if (!fullName.trim()) errors.push("Full Name is required.");
                if (!email.trim()) errors.push("Email is required.");
                if (!selectedDistrict) errors.push("District is required.");
                if (!password.trim()) errors.push("Password is required.");
                if (!/^[6-9]\d{9}$/.test(verifiedMobile)) {
                  errors.push("Verified mobile number is invalid or missing.");
                }

                if (errors.length > 0) {
                  alert(errors.join("\n"));
                  return;
                }

                try {
                  const res = await fetch("http://127.0.0.1:5000/complete-signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      name: fullName,
                      email,
                      password,
                      district: selectedDistrict,
                      mobile: verifiedMobile  // ✅ only verified mobile sent
                    })
                  });

                  const result = await res.json();

                  if (res.ok) {
                    alert("✅ Signup successful!");
                    localStorage.removeItem("otplessUser");
                    setShowSignup(false);
                  } else {
                    alert(result.error || "Signup failed.");
                  }
                } catch (err) {
                  console.error("Signup error:", err);
                  alert("Something went wrong. Try again.");
                }
              }}
                className="w-full h-11 bg-[#170645] text-[#FFE100] px-3 rounded-lg mt-4 text-lg font-bold">
                Sign Up
              </button>
              <div className="flex justify-center gap-6 mt-4">
                <button className="text-[#170645] hover:underline text-sm">Customer Support</button>
                <button className="text-[#170645] hover:underline text-sm">Terms of Service</button>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-center text-[#170645]">AI Based CMO Gallery</h2>
              <p className="text-center text-[#170645]">One Click Download</p>
              <button className="flex items-center justify-center w-full border p-2 mt-4 rounded-full hover:bg-gray-200" onClick={() => signIn("google")}>
                <img src="/google pic.png" alt="Google" className="w-5 mr-2" onClick={async () => {
                  console.log("🔵 Google Sign-In button clicked");
                  const result = await signIn("google", { callbackUrl: "/dashboard" }); // ✅ Redirect to Dashboard after login
                  console.log("✅ Sign-in result:", result);
                }} />
                <p className="text-[#170645]">Sign In With Google</p>
              </button>
              <div className="flex items-center my-4">
                <hr className="flex-grow border-gray-300" />
                <span className="px-3 text-[#908AA0]">Or, Sign In With Phone No.</span>
                <hr className="flex-grow border-gray-300" />
              </div>
              <input
                type="text"
                placeholder="Mobile No."
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="border w-full p-2 rounded-full mb-4 text-[#170645]"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border w-full p-2 rounded-full mb-4 text-[#170645]"
              />

              <button onClick={handleSignIn} className="w-full bg-[#170645] text-yellow-400 p-2 rounded-full">
                Sign In
              </button>
              <p className="text-center text-[#170645] text-sm mt-3">
                Not Registered Yet? <span className="text-[#170645] font-bold cursor-pointer" onClick={() => router.push("/verification")}>Register Now</span>
              </p>
              <div className="flex justify-center gap-4 mt-4">
                <button className="text-[#170645] hover:underline">Customer Support</button>
                <button className="text-[#170645] hover:underline">Terms of Service</button>
              </div>
            </div>
          )}
        </div>
        <p className="text-center text-black ml-[-10px] mt-6">Initiative By DPR Chhattisgarh</p>
      </div>

      <div className="hidden md:flex md:w-2/3 relative overflow-hidden items-center">
        {showVideoFrame ? (
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-[50vw] max-w-[60vw] h-auto max-h-[80vh] aspect-[9/16] mt-12 rounded-tl-[50px] rounded-br-[50px] overflow-hidden shadow-lg">
              <video
                src="/ycm.mp4"
                autoPlay
                muted
                loop
                controls
                className="w-full h-full object-cover"
              />
            </div>
          </div>


        ) : (<div
          className="absolute w-full max-w-[656px] h-full top-0 bottom-0 left-1/2 transform -translate-x-1/2 rotate-[-1.32deg] transition-opacity duration-2000 ease-in-out"
        >


          <div className="grid grid-cols-3 gap-1">
            {/* Column 1 - Moves Down */}
            <div className="relative space-y-2 overflow-hidden">
              <div className="scroll-column col1">
                {[...col1Images, ...col1Images].map((src, index) => (
                  <img key={`col1-${index}`} src={src} alt={`Column 1 - ${index}`} className="w-[30vh] rounded-lg" />
                ))}
              </div>
            </div>

            {/* Column 2 - Moves Up */}
            <div className="relative space-y-2 overflow-hidden">
              <div className="scroll-column col2">
                {[...col2Images, ...col2Images].map((src, index) => (
                  <img key={`col2-${index}`} src={src} alt={`Column 2 - ${index}`} className="w-[30vh] rounded-lg" />
                ))}
              </div>
            </div>

            {/* Column 3 - Moves Down */}
            <div className="relative space-y-2 overflow-hidden">
              <div className="scroll-column col3">
                {[...col3Images, ...col3Images].map((src, index) => (
                  <img key={`col3-${index}`} src={src} alt={`Column 3 - ${index}`} className="w-[30vh] rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </div>
        )}
      </div>

    </div>
  );
}
