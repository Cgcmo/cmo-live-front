
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OtplessSignupPage() {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasRefreshed = sessionStorage.getItem('verification_refreshed');

      if (!hasRefreshed) {
        sessionStorage.setItem('verification_refreshed', 'true');
        window.location.reload();
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem('verification_refreshed');
    };
  }, []);
  
  useEffect(() => {
    // Wait a short time to ensure the SDK has loaded
    const timeout = setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.otpless = (user) => {
          const mobileFromOtpless = user?.identities?.find(
            (id) => id.identityType === "MOBILE" && id.verified
          )?.identityValue;
        
          const cleanedMobile = mobileFromOtpless?.replace(/^91/, "").trim();
        
          if (cleanedMobile && /^[6-9]\d{9}$/.test(cleanedMobile)) {
            localStorage.setItem("otplessUser", JSON.stringify({ mobile: cleanedMobile }));
          } else {
            alert("Verified mobile number not found.");
            return;
          }
        
          alert("✅ Signup successful!");
          router.push("/?showSignup=true");
        };
        
      }
    }, 10); // slight delay to ensure script loads

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      
      <div id="otpless-login-page"></div>
    </div>
  );
}
