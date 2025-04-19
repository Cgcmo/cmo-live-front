'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ResetPasswordForm from './ResetPasswordForm';

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
          fetch("https://3211-2409-4043-400-c70d-b58e-5c61-b8a5-dfdc.ngrok-free.app/check-user-exists", {
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
      {mode === "reset" && verifiedMobile ? (
        <ResetPasswordForm mobile={verifiedMobile} />
      ) : (
        <div id="otpless-login-page"></div>
      )}
    </div>
  );
}
