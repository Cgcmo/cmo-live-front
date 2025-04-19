// 'use client';

// import { useEffect } from 'react';
// import { useSearchParams } from 'next/navigation';

// export default function SearchParamHandler({ onShowLogin }) {
//   const searchParams = useSearchParams();

//   useEffect(() => {
//     const fromOtpless = searchParams.get("showSignup");
//     if (fromOtpless === "true") {
//       onShowLogin(true);
//     }
//   }, [searchParams, onShowLogin]);

//   return null;
// }


'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SearchParamHandler({ onShowLogin }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const showSignup = searchParams.get("showSignup");
    const showLogin = searchParams.get("showLogin");

    if (showSignup === "true" || showLogin === "true") {
      onShowLogin(true); // ✅ Always show AuthPage when either is true
    }
  }, [searchParams, onShowLogin]);

  return null;
}
