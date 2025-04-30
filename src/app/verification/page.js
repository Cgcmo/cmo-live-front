
// 'use client';
// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';

// export default function OtplessSignupPage() {
//   const router = useRouter();
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const hasRefreshed = sessionStorage.getItem('verification_refreshed');

//       if (!hasRefreshed) {
//         sessionStorage.setItem('verification_refreshed', 'true');
//         window.location.reload();
//       }
//     }
//   }, []);

//   useEffect(() => {
//     return () => {
//       sessionStorage.removeItem('verification_refreshed');
//     };
//   }, []);
  
//   useEffect(() => {
//     // Wait a short time to ensure the SDK has loaded
//     const timeout = setTimeout(() => {
//       if (typeof window !== 'undefined') {
//         window.otpless = (user) => {
//           const mobileFromOtpless = user?.identities?.find(
//             (id) => id.identityType === "MOBILE" && id.verified
//           )?.identityValue;
        
//           const cleanedMobile = mobileFromOtpless?.replace(/^91/, "").trim();
        
//           if (cleanedMobile && /^[6-9]\d{9}$/.test(cleanedMobile)) {
//             localStorage.setItem("otplessUser", JSON.stringify({ mobile: cleanedMobile }));
//           } else {
//             alert("Verified mobile number not found.");
//             return;
//           }
        
//           alert("✅ Signup successful!");
//           router.push("/?showSignup=true");
//         };
        
//       }
//     }, 10); // slight delay to ensure script loads

//     return () => clearTimeout(timeout);
//   }, [router]);

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center">
      
//       <div id="otpless-login-page"></div>
//     </div>
//   );
// }




// /app/verification/page.js
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ResetPasswordForm from '../forgot-password/ResetPasswordForm'; // ✅ update path if needed
import API_URL from '@/app/api';

export default function VerificationPage() {
  const router = useRouter();
  const [mode, setMode] = useState(null);
  const [verifiedMobile, setVerifiedMobile] = useState(null);

  useEffect(() => {
    const m = new URLSearchParams(window.location.search).get("mode");
    setMode(m);

    const storedMobile = localStorage.getItem("resetMobile");
    if (m === "reset" && storedMobile) {
      setVerifiedMobile(storedMobile);
    }

    const timeout = setTimeout(() => {
      window.otpless = (user) => {
        const mobile = user?.identities?.find(
          (id) => id.identityType === "MOBILE" && id.verified
        )?.identityValue?.replace(/^91/, "").trim();

        if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) {
          alert("❌ Verified mobile number not found");
          return;
        }

        if (m === "reset") {
          // check user existence
          fetch(`${API_URL}/check-user-exists`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mobile }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.exists) {
                localStorage.setItem("resetMobile", mobile);
                setVerifiedMobile(mobile);
              } else {
                alert("❌ This number is not registered.");
                router.push("/");
              }
            })
            .catch(() => {
              alert("Something went wrong. Try again.");
              router.push("/");
            });
        } else {
          // default signup behavior
          localStorage.setItem("otplessUser", JSON.stringify({ mobile }));
          router.push("/?showSignup=true");
        }
      };
    }, 10);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
       <button
    onClick={() => router.push("/?showLogin=true")}
    className="absolute top-5 left-5 text-[#170645] hover:text-black font-semibold flex items-center gap-2"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
      viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
    <span>Back</span>
  </button>
      {mode === "reset" && verifiedMobile ? (
        <ResetPasswordForm mobile={verifiedMobile} />
      ) : (
        <div id="otpless-login-page"></div>
      )}
    </div>
  );
}
