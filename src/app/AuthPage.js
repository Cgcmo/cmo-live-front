"use client";
import { Poppins } from "next/font/google";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import API_URL from '@/app/api';

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins", // CSS Variable for Tailwind
});
export default function AuthPage({ setShowLoginPage }) {
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
  const searchParams = useSearchParams();
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [OTPlessSignin, setOTPlessSignin] = useState(null);
  const [token, setToken] = useState(null);
  const [otpSessionMobile, setOtpSessionMobile] = useState("");
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1); // 1 = mobile, 2 = OTP, 3 = new password
  const [forgotOtpSessionMobile, setForgotOtpSessionMobile] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [readyToRender, setReadyToRender] = useState(false);

  


useEffect(() => {
  if (status === "loading") return; // wait for session check

  const isReturningFromClosedTab = session?.user?.email?.includes("gmail.com");
  if (isReturningFromClosedTab) {
    signOut({ redirect: false }).then(() => {
      setReadyToRender(true); // render only after logout
    });
  } else {
    setReadyToRender(true); // no Google session? show UI now
  }
}, [status, session]);


useEffect(() => {
  const handleVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      if (session?.user?.email?.includes("gmail.com")) {
        signOut({ redirect: false });
      }
    }
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);
  return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
}, [session]);

  

  
  useEffect(() => {
    const callback = (eventCallback) => {
      if (eventCallback.responseType === "ONETAP") {
        const { response } = eventCallback;
        console.log("✅ OTP verified successfully:", response.token);
        setToken(response.token);
        // handleSignupAfterOtp();
      } else if (eventCallback.responseType === "FAILED") {
        console.error("❌ OTP verification failed", eventCallback.response);
        alert("OTP Verification Failed. Try again.");
      }
    };
  
    const tryInitializeOTPless = () => {
      if (typeof window !== "undefined" && window.OTPless) {
        console.log("✅ OTPless SDK is now available");
        const signin = new window.OTPless(callback);
        setOTPlessSignin(signin);
      } else {
        console.log("⏳ Waiting for OTPless SDK...");
        setTimeout(tryInitializeOTPless, 300); // try again in 300ms
      }
    };
  
    tryInitializeOTPless();
  }, []);
  
  
  useEffect(() => {
    fetch(`${API_URL}/districts`)
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
      if (showOTP) {
        setShowOTP(false);      // ✅ Hide OTP input
        setShowSignup(true);    // ✅ Show Signup form again
      } else if (showSignup) {
        setShowSignup(false);   // ✅ Go back to login form
      } else {
        setShowLoginPage(false); // ✅ If already in login, go back to homepage
      }
    };
  
    window.addEventListener("popstate", handleBackButton);
    return () => window.removeEventListener("popstate", handleBackButton);
  }, [showOTP, showSignup, setShowLoginPage]);
  

  useEffect(() => {
    fetch(`${API_URL}/record-visit`, {
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
      const res = await fetch(`${API_URL}/complete-signup`, {
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
      const res = await fetch(`${API_URL}/client-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, password })
      });
  
      const contentType = res.headers.get("content-type");
  
      if (!res.ok) {
        if (contentType && contentType.includes("application/json")) {
          const error = await res.json();
          alert(error.error || "Login failed.");
        } else {
          const errorText = await res.text();
          console.error("Server responded with:", errorText);
          alert("Server error. Try again later.");
        }
        return; // ❌ stop here if not OK
      }
  
      const result = await res.json();  // ✅ Now safe
  
      // ✅ Now process successful login
      localStorage.setItem("otpUser", JSON.stringify(result));
      router.push("/dashboard");
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
      console.log("🔵 Verifying OTP...");
      await OTPlessSignin.verify({
        channel: "PHONE",
        phone: verifiedMobile || otpSessionMobile,
        otp: enteredOTP,
        countryCode: "+91",
      });
  
      console.log("✅ OTP verified. Now completing signup...");
  
      // ✅ instead of calling /complete-signup again here,
      // directly call the correct function
      await handleSignupAfterOtp();
  
    } catch (err) {
      console.error("❌ Error during OTP verification or signup:", err);
      alert("Something went wrong. Try again.");
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


  useEffect(() => {
    const showSignup = searchParams.get("showSignup");
  
    if (showSignup === "true") {
      setShowSignup(true); // ✅ AuthPage will now render Signup form
    }
  }, [searchParams]);

  
  useEffect(() => {
    const signupFromLocal = localStorage.getItem("showSignup");
    if (signupFromLocal === "true") {
      setShowSignup(true);
      localStorage.removeItem("showSignup"); // 🧹 Clean after using
    }
  }, []);
  
  
  useEffect(() => {
    const url = new URL(window.location.href);
    const hasLoginOrSignup = url.searchParams.get("showSignup") || url.searchParams.get("showLogin");
  
    if (hasLoginOrSignup) {
      url.searchParams.delete("showSignup");
      url.searchParams.delete("showLogin");
      window.history.replaceState({}, "", url.pathname); // ✅ Removes query from address bar
    }
  }, []);
  
  const sendOtpBeforeSignup = async () => {
    if (!fullName.trim() || !email.trim() || !selectedDistrict || !password.trim() || !/^[6-9]\d{9}$/.test(mobile)) {
      alert("Please fill all fields properly.");
      return;
    }
  
    if (!OTPlessSignin) {
      alert("OTP Service not ready. Please wait 2 seconds and try again.");
      return;
    }
  
    try {

      const checkRes = await fetch(`${API_URL}/check-user-exists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile,
          email,
        }),
      });
  
      const checkResult = await checkRes.json();
  
      if (!checkRes.ok) {
        alert(checkResult.error || "Something went wrong. Try again.");
        return; // ❌ stop further if mobile/email already exists
      }
      
      // 📩 Send OTP to user's mobile
      await OTPlessSignin.initiate({
        channel: "PHONE",
        phone: mobile,
        countryCode: "+91",
      });
      console.log("📩 OTP Sent to", mobile);
      setOtpSessionMobile(mobile); // Save mobile during OTP session
      setShowOTP(true); // Now show OTP input box
    } catch (err) {
      console.error("❌ Error sending OTP", err);
      alert("Failed to send OTP. Try again.");
    }
  };
  

  const handleSignupAfterOtp = async () => {
    const mobileNumber = verifiedMobile || otpSessionMobile;
  
  
    try {
      const res = await fetch(`${API_URL}/complete-signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Otpless-Mobile": mobileNumber,
          "X-Otpless-Token": token,
        },
        body: JSON.stringify({
          name: fullName,
          email,
          password,
          district: selectedDistrict,
        }),
      });
  
      const result = await res.json();
  
      if (res.ok) {
        alert("✅ Signup successful!");
        setShowSignup(false);     // ✅ Switch to Signin Form
        setShowOTP(false);        // ✅ Hide OTP Form
        setOtp(["", "", "", "", "", ""]);  // ✅ Clear OTP Inputs
        setMobile(mobileNumber);  // ✅ Fill mobile field automatically
        setPassword("");          // ✅ Clear password field
      } else {
        alert(result.error || "Signup failed.");
      }
    } catch (err) {
      console.error("❌ Signup error:", err);
      alert("Something went wrong. Try again.");
    }
  };
  

  const handleForgotPasswordSendOtp = async () => {
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return alert("Please enter a valid 10-digit mobile number.");
    }
  
    if (!OTPlessSignin) {
      return alert("OTP Service not ready. Please wait a moment.");
    }
  
    try {
      // 🔥 CHECK mobile existence properly BEFORE sending OTP
      const checkRes = await fetch(`${API_URL}/check-user-exists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: mobile, email: "dummy@email.com" }),
      });
  
      const checkResult = await checkRes.json();
  
      if (checkRes.status === 409) {
        // ✅ 409 means mobile exists (already registered) --> GOOD
        console.log("✅ Mobile exists, sending OTP...");
      } else {
        alert("This mobile number is not registered.");
        return;
      }
  
      // 🟰 Now safe to send OTP using Otpless
      await OTPlessSignin.initiate({
        channel: "PHONE",
        phone: mobile,
        countryCode: "+91",
      });
  
      console.log("📩 OTP Sent to", mobile);
      setForgotOtpSessionMobile(mobile);
      setForgotPasswordStep(2); // Move to OTP step
    } catch (err) {
      console.error("❌ Error during mobile check or sending OTP:", err);
      alert("Something went wrong. Try again.");
    }
  };
  

  const handleForgotPasswordVerifyOtp = async () => {
    if (!otp.every((digit) => digit !== "")) {
      return alert("Please enter the complete OTP.");
    }
  
    const enteredOTP = otp.join("");
  
    try {
      await OTPlessSignin.verify({
        channel: "PHONE",
        phone: forgotOtpSessionMobile,
        otp: enteredOTP,
        countryCode: "+91",
      });
  
      console.log("✅ OTP Verified Successfully");
      setForgotPasswordStep(3); // Move to New Password Step
    } catch (err) {
      console.error("❌ Error verifying OTP:", err);
      alert("OTP verification failed. Please try again.");
    }
  };
  
  const handleResetPasswordSubmit = async () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      return alert("Please fill all fields.");
    }
  
    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match.");
    }
  
    if (newPassword.length < 8) {
      return alert("Password must be at least 8 characters long.");
    }
  
    try {
      const res = await fetch(`${API_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile: forgotOtpSessionMobile,
          newPassword: newPassword,
        }),
      });
  
      const result = await res.json();
  
      if (res.ok) {
        alert("✅ Password changed successfully! Please login.");
        setForgotPasswordMode(false);
        setForgotPasswordStep(1);
        setOtp(["", "", "", "", "", ""]);
        setMobile("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        alert(result.error || "Password reset failed.");
      }
    } catch (err) {
      console.error("❌ Error resetting password:", err);
      alert("Something went wrong. Try again.");
    }
  };
  
  if (!readyToRender) {
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
    <div className="flex flex-col md:flex-row w-full h-screen bg-gray-100">
      {(showSignup || !session) && (
  <button
  onClick={() => {
    if (forgotPasswordMode) {
      setForgotPasswordMode(false); // ✅ Exit Forgot Password mode
      setForgotPasswordStep(1); // ✅ Reset to Step 1
    } else if (showOTP) {
      setShowOTP(false);    // ✅ Hide OTP
      setShowSignup(true);  // ✅ Show Signup again
    } else if (showSignup) {
      setShowSignup(false); // ✅ Hide Signup, go to Login
    } else {
      setShowLoginPage(false); // ✅ If already in login, go back to homepage
    }
  }}
  
    className="absolute top-6 left-4 text-[#170645] hover:text-black font-semibold flex items-center gap-2 z-50"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
      viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
    <span>Back</span>
  </button>
)}

      {/* Left Side: Login Box */}

      <div className="w-full md:w-1/3 flex flex-col items-center justify-center p-6 md:p-12">
        <img src="/CG logo.webp" alt="Logo" className="w-24 h-24 mb-4" />
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-[516px]">
        {forgotPasswordMode ? (
  <>
    {forgotPasswordStep === 1 && (
      <div className="text-center">
        <h2 className="text-2xl pt-2 font-bold text-[#170645]">Reset Your Password</h2>
        <p className="text-[#170645] pt-2 mt-2">Enter your registered mobile number</p>
        <input
          type="text"
          placeholder="Mobile No."
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className="border w-full p-3 rounded-full mt-4 text-[#170645]"
        />
        <button
          onClick={handleForgotPasswordSendOtp}
          className="w-full bg-[#170645] text-yellow-400 p-3 mt-4 rounded-full text-lg font-bold"
        >
          Proceed
        </button>
      </div>
    )}
    {forgotPasswordStep === 2 && (
      <div className="text-center">
        <h2 className="text-2xl pt-2 font-bold text-[#170645]">Enter OTP</h2>
        <p className="text-[#170645] pt-2 mt-2">OTP sent to {forgotOtpSessionMobile}</p>
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
        <button
          onClick={handleForgotPasswordVerifyOtp}
          className="w-full bg-[#170645] text-yellow-400 p-3 mt-4 rounded-full text-lg font-bold"
        >
          Verify
        </button>
      </div>
    )}
    {forgotPasswordStep === 3 && (
      <div className="text-center">
        <h2 className="text-2xl pt-2 font-bold text-[#170645]">Set New Password</h2>
        <p className="text-[#170645] pt-2 mt-2">Mobile: {forgotOtpSessionMobile}</p>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="border w-full p-3 rounded-full mt-4 text-[#170645]"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="border w-full p-3 rounded-full mt-4 text-[#170645]"
        />
        <button
          onClick={handleResetPasswordSubmit}
          className="w-full bg-[#170645] text-yellow-400 p-3 mt-4 rounded-full text-lg font-bold"
        >
          Change Password
        </button>
      </div>
    )}
  </>
) :session ? (
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
              <div className="flex items-center my-4">
                <hr className="flex-grow border-gray-300" />
                {/* <span className="px-3 text-[#908AA0] text-sm">Or, Sign Up With Your Email</span> */}
                <hr className="flex-grow border-gray-300" />
              </div>
              <div className="flex gap-2">
                <input type="text" placeholder="Full Name" value={fullName}
                  onChange={(e) => setFullName(e.target.value)} className="border w-1/2 p-3 h-11 rounded-full placeholder-[#170645] text-[#170645]" />
                <input
  type="text"
  value={verifiedMobile || mobile}
  onChange={(e) => {
    if (!verifiedMobile) setMobile(e.target.value); // allow edit only if not verified
  }}
  readOnly={!!verifiedMobile}
  placeholder="Mobile No."
  className={`border w-1/2 p-3 h-11 rounded-full text-[#170645] bg-white ${verifiedMobile ? "opacity-60 cursor-not-allowed" : ""}`}
/>




              </div>
              <input type="email" value={email}
                onChange={(e) => setEmail(e.target.value)} placeholder="Email Id" className="border w-full p-3 h-11 rounded-full mt-3 placeholder-[#170645] text-[#170645]" />
             <div className="relative w-full">
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="border w-full p-3 h-11 rounded-full mt-3 text-[#170645] appearance-none bg-white "
              >
                <option value="">Select District</option>
                {districts.map((d, index) => (
                  <option key={index} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
    <svg
      className="w-4 h-4 mt-3 text-[#170645]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  </div>
</div>
              {/* <input type="password" placeholder="Create Your Password" value={password}
                onChange={(e) => setPassword(e.target.value)} className="border h-11 w-full p-3 rounded-lg mt-3 placeholder-[#170645] text-[#170645]" /> */}
              <div className="relative mt-3">
  <input
    type={showSignupPassword ? "text" : "password"}
    placeholder="Create Your Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="border h-11 w-full p-3 rounded-full placeholder-[#170645] text-[#170645] pr-10"
  />
  <button
    type="button"
    onClick={() => setShowSignupPassword(!showSignupPassword)}
    className="absolute right-3 top-3 text-[#170645] hover:text-black"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-5 w-5"
    >
      {showSignupPassword ? (
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

              <button onClick={sendOtpBeforeSignup} 
                className="w-full h-11 bg-[#170645] text-[#FFE100] px-3 rounded-full mt-4 text-lg font-bold">
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
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Mobile No."
                value={mobile}
                onChange={(e) => {
                  const input = e.target.value;
                  if (/^\d*$/.test(input)) {
                    setMobile(input);
                  }
                }}
                className="border w-full p-2 rounded-full mb-4 text-[#170645]"
              />
              <div className="relative mb-4">
  <input
    type={showLoginPassword ? "text" : "password"}
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="border w-full p-2 rounded-full text-[#170645] pr-10"
  />
  <button
    type="button"
    onClick={() => setShowLoginPassword(!showLoginPassword)}
    className="absolute right-3 top-2 text-[#170645] hover:text-black"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-5 w-5"
    >
      {showLoginPassword ? (
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


              <button onClick={handleSignIn} className="w-full bg-[#170645] text-yellow-400 p-2 rounded-full">
                Sign In
              </button>
              <p className="text-center text-[#170645] text-sm mt-3">
              <span
    className="cursor-pointer font-semibold"
    onClick={() => {
      setForgotPasswordMode(true);
      setForgotPasswordStep(1);
    }}
  >
    Forgot Password?
  </span>
</p>

              <p className="text-center text-[#170645] text-sm mt-3">
                Not Registered Yet? <span className="text-[#170645] font-bold cursor-pointer"  onClick={() => {
    setShowSignup(true);  // ✅ Open Signup form
  }}>Register Now</span>
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


