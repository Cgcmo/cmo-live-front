'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

export default function TwitterPosts() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Load Twitter Widget.js once */}
      <Script
        src="https://platform.twitter.com/widgets.js"
        strategy="lazyOnload"
        onLoad={() => {
          if (window.twttr && window.twttr.widgets) {
            window.twttr.widgets.load();
          }
        }}
      />

      {/* Only show after client side render */}
      {isClient && (
        <>
          {/* Post 1 */}
          <blockquote className="twitter-tweet">
            <p lang="hi" dir="ltr">
              Live:- ह्यड्रोजन चलित ट्रकों को हरी झंडी दिखाकर रवाना करना
              <a href="https://t.co/3k6QC6kJGY"> https://t.co/3k6QC6kJGY </a>
            </p>
            &mdash; CMO Chhattisgarh (@ChhattisgarhCMO)
            <a href="https://twitter.com/ChhattisgarhCMO/status/1921098520481718591?ref_src=twsrc%5Etfw">
              May 10, 2025
            </a>
          </blockquote>

         
        </>
      )}
    </div>
  );
}
