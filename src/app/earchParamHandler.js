'use client';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SearchParamHandler({ onShowLogin }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const fromOtpless = searchParams.get("showSignup");
    if (fromOtpless === "true") {
      onShowLogin(true);
    }
  }, [searchParams, onShowLogin]);

  return null;
}
