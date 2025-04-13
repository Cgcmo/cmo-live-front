'use client'
import { Suspense } from 'react'
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import VideoPlayer from './VideoPlayer';
const SearchBar = dynamic(() => import('./SearchBar'), { ssr: false });
import React from 'react';
import AuthPage from './AuthPage'; // ✅ Correct for default export
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation'; // add at the top
import { Suspense } from 'react';
import SearchParamHandler from './SearchParamHandler';

const arc1Images = ['share.png', 'heart.png'];
const arc2Images = ['download.png', 'smily.png', 'gallery.png'];



export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const mainVideoRef = useRef(null);
  const [mainPlaying, setMainPlaying] = useState(false);
  const [showLoginPage, setShowLoginPage] = useState(false);
  const [fontSize, setFontSize] = useState(16); // default font size
  const [isHindi, setIsHindi] = useState(false);
  const router = useRouter();


  // Put this early inside your component before useState
  const videoData = [
    { src: '/videos/clip1.mp4', title: isHindi ? 'छत्तीसगढ़ विजन 2030' : 'Chhattisgarh Vision 2030' },
    { src: '/videos/clip2.mp4', title: isHindi ? 'सीएमओ मीट झलकियां' : 'CMO Meet Highlights' },
    { src: '/videos/clip3.mp4', title: isHindi ? 'युवा पैनल' : 'Youth Panel' },
    { src: '/videos/clip4.mp4', title: isHindi ? 'स्मार्ट सिटी लॉन्च' : 'Smart City Launch' },
  ];


  // Now this will work correctly
  const [mainVideo, setMainVideo] = useState(videoData[0]);
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);
  // default to first video



  const [arc1Points, setArc1Points] = useState([]);
  const [arc2Points, setArc2Points] = useState([]);

  const arc1Ref = useRef(null);
  const arc2Ref = useRef(null);
  const getResponsiveSize = () => {
    if (typeof window === 'undefined') return 32; // default for SSR

    const width = window.innerWidth;

    if (width < 480) return 28;    // Mobile
    if (width < 768) return 36;    // Tablet
    if (width < 1024) return 44;   // Small Desktop
    return 48;                     // Large Desktop
  };

  const [emojiSize, setEmojiSize] = useState(getResponsiveSize());

  useEffect(() => {
    const getArcPoints = (path, imageArray) => {
      if (!path) return [];

      const length = path.getTotalLength();
      return imageArray.map((_, idx) => {
        const pct = (idx + 1) / (imageArray.length + 1);
        return path.getPointAtLength(length * pct);
      });
    };

    if (arc1Ref.current) {
      setArc1Points(getArcPoints(arc1Ref.current, arc1Images));
    }

    if (arc2Ref.current) {
      setArc2Points(getArcPoints(arc2Ref.current, arc2Images));
    }
  }, []); // ✅ empty dependency array - only run once




  useEffect(() => {
    const updateSize = () => setEmojiSize(getResponsiveSize());

    updateSize(); // initial
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);




  useEffect(() => {
    if (showLoginPage) {
      // Push a new entry to browser history when login page is shown
      window.history.pushState({ login: true }, '');

      // When user presses back, set showLoginPage to false
      const handlePopState = (e) => {
        setShowLoginPage(false);
      };

      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [showLoginPage]);

  const searchParams = useSearchParams();

useEffect(() => {
  const fromOtpless = searchParams.get("showSignup");
  if (fromOtpless === "true") {
    setShowLoginPage(true); // ✅ Show the AuthPage
    // No need to use `setShowSignup(true)` here, AuthPage will handle it via URL param
  }
}, []);

  return (
    <>
     <Suspense fallback={null}>
      <SearchParamHandler onShowLogin={setShowLoginPage} />
    </Suspense>
      {showLoginPage ? (
        <AuthPage />
      ) : (
        <div className="bg-[#170645] text-white">
          <nav className="flex items-center justify-between px-4 sm:px-6 py-3">
            {/* Left: Logo */}
            <div className="flex items-center">
              <Image
                src="/Group 833.png"
                alt="Logo"
                width={45}
                height={45}
                className="rounded-full"
              />
            </div>

            {/* Hamburger Icon on Mobile */}
            <div className="sm:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-white focus:outline-none"
              >
                {/* Hamburger Icon */}
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {menuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>

            {/* Right Controls (Hidden on Mobile) */}
            <div className="hidden sm:flex items-center space-x-3">
            <button
  className="bg-white text-[#170645] px-3 py-1 rounded-full text-sm"
  onClick={() => setIsHindi(!isHindi)}
>
  A<sub>अ</sub> {isHindi ? 'Eng' : 'Hindi'}
</button>


              <div className="bg-white text-[#170645] px-3 py-1 rounded-full text-sm flex space-x-2">
                <button onClick={() => setFontSize((prev) => Math.min(prev + 2, 24))}>A+</button>
                <button onClick={() => setFontSize((prev) => Math.max(prev - 2, 12))}>A-</button>
              </div>


              <button onClick={() => setShowLoginPage(true)} className="bg-yellow-400 text-[#170645] px-4 py-1 rounded-full font-medium flex items-center space-x-1">
                <span>👤</span>
                <span>Login</span>
              </button>
            </div>
          </nav>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="sm:hidden px-4 pb-4 space-y-2">
              <button
  className="bg-white text-[#170645] px-3 py-1 rounded-full text-sm"
  onClick={() => setIsHindi(!isHindi)}
>
  A<sub>अ</sub> {isHindi ? 'Eng' : 'Hindi'}
</button>


              <div className="bg-white text-[#170645] w-full py-2 rounded-full text-sm flex justify-around">
                <button onClick={() => setFontSize((prev) => Math.min(prev + 2, 24))}>A+</button>
                <button onClick={() => setFontSize((prev) => Math.max(prev - 2, 12))}>A-</button>
              </div>


              <button onClick={() => setShowLoginPage(true)} className="bg-yellow-400 text-[#170645] w-full py-2 rounded-full font-medium flex items-center justify-center space-x-1">
                <span>👤</span>
                <span>Login</span>
              </button>
            </div>
          )}




          <div className="relative w-full h-auto sm:h-[30px] md:h-[60px]">
            <svg viewBox="0 0 1440 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto absolute top-0 left-0 pointer-events-none z-0">
              {/* Draw arcs */}
              <path
                ref={arc1Ref}
                d="M0,380 Q720,-120 1440,380"
                stroke="white"
                strokeWidth="1.5"
                fill="transparent"
                opacity="0.1"
              />
              <path
                ref={arc2Ref}
                d="M0,180 Q720,-80 1440,180"
                stroke="white"
                strokeWidth="1.5"
                fill="transparent"
                opacity="0.1"
              />

              {arc1Points.map((pt, idx) =>
                arc1Images[idx] ? (
                  <image
                    key={`arc1-${idx}`}
                    href={`/${arc1Images[idx]}`}
                    x={pt.x - emojiSize / 2}
                    y={pt.y - emojiSize / 2}
                    width={emojiSize}
                    height={emojiSize}
                  />

                ) : null
              )}

              {arc2Points.map((pt, idx) =>
                arc2Images[idx] ? (
                  <image
                    key={`arc2-${idx}`}
                    href={`/${arc2Images[idx]}`}
                    x={pt.x - emojiSize / 2}
                    y={pt.y - emojiSize / 2}
                    width={emojiSize}
                    height={emojiSize}
                  />
                ) : null
              )}


            </svg>

          </div>

          {/* Hero Section */}
          <div className="relative text-center px-1 pt-60  z-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-snug max-w-3xl mx-auto">
            {isHindi ? 'छत्तीसगढ़ की पहली ' : 'Chhattisgarh First '}{' '}
              <span className="inline-block align-middle">
                <button
                  className="group relative outline-0 bg-sky-200 [--sz-btn:52px] mt-[-10px] [--space:calc(var(--sz-btn)/5.5)] [--gen-sz:calc(var(--space)*2)] [--sz-text:calc(var(--sz-btn)-var(--gen-sz))] h-[var(--sz-btn)] w-[var(--sz-btn)] border border-solid border-transparent rounded-xl flex items-center justify-center aspect-square cursor-pointer transition-transform duration-200 active:scale-[0.95] bg-[linear-gradient(45deg,#efad21,#ffd60f)] [box-shadow:#3c40434d_0_1px_2px_0,#3c404326_0_2px_6px_2px,#0000004d_0_30px_60px_-30px,#34343459_0_-2px_6px_0_inset]"
                >
                  <svg
                    className="animate-pulse absolute z-10 overflow-visible transition-all duration-300 text-[#ffea50] group-hover:text-white top-[calc(var(--sz-text)/7)] left-[calc(var(--sz-text)/7)] h-[var(--gen-sz)] w-[var(--gen-sz)] group-hover:h-[var(--sz-text)] group-hover:w-[var(--sz-text)] group-hover:left-[calc(var(--sz-text)/4)] group-hover:top-[calc(calc(var(--gen-sz))/2)]"
                    stroke="none"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z"
                    ></path>
                  </svg>
                  <span
                    className="[font-size:var(--sz-text)] font-extrabold leading-none text-white transition-all duration-200 group-hover:opacity-0"
                  >
                    AI
                  </span>
                </button>

              </span >{' '}<br></br>
              {isHindi ? 'आधारित सीएमओ चित्र खोज मंच' : 'Based CMO Image Search Platform'}
            </h1>

            <div className="relative mx-auto mt-8 max-w-md w-full flex justify-center">
              <SearchBar />
            </div>

            <div className="relative w-full overflow-hidden mt-12">
  <div className="photo-marquee whitespace-nowrap flex items-center gap-6 px-4">
    {[...Array(2)].map((_, loopIdx) => (
      [201, 202, 203, 204, 205,].map((img, idx) => (
        <Image
          key={`${loopIdx}-${img}`}
          src={`/${img}.png`}
          alt={`img-${img}`}
          width={326}
          height={404}
          className="rounded-[25px] object-cover max-w-[326px] h-[404px] mt-4 transform transition duration-300"
          style={{ rotate: idx % 2 === 0 ? '3deg' : '-3deg' , marginBottom: '-60px'}}
        />
      ))
    ))}
  </div>
  <style>{`
  @keyframes scroll-loop {
    0% {
      transform: translateX(0%);
    }
    100% {
      transform: translateX(-50%);
    }
  }

  .marquee-track {
    animation: scroll-loop 30s linear infinite;
    width: max-content;
  }

  @keyframes scroll-photos {
    0% {
      transform: translateX(0%);
    }
    100% {
      transform: translateX(-50%);
    }
  }

  .photo-marquee {
    animation: scroll-photos 40s linear infinite;
    width: max-content;
  }

  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
`}</style>

</div>



          </div>



          {/* video section */}
          <section className="px-4 sm:px-6 md:px-8 py-12 bg-white text-[#170645]">
            <h2 className="text-center text-xl sm:text-2xl md:text-3xl font-semibold mb-8">
            {isHindi ? 'लेटेस्ट ' : 'Latest '} <span className="bg-yellow-300 px-1 rounded">{isHindi ? 'वीडियो' : 'Videos'}</span>
            </h2>

            <div className="grid lg:grid-cols-3 gap-6 w-full px-2 sm:px-4 lg:px-6">

              {/* Left Large Video */}
              <div className="lg:col-span-2">
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <div className="aspect-video w-full">
                    <div className="relative w-full h-full group">
                      <VideoPlayer
                        key={mainVideo.src} // Important for re-mounting on change
                        src={mainVideo.src}
                        title={mainVideo.title}
                        aspect="aspect-video"
                        variant="main"
                        autoPlay={shouldAutoPlay}
                      />


                      {/* <source src="/videos/main.mp4" type="video/mp4" /> */}


                    </div>
                  </div>
                </div>
              </div>

              {/* Right: 2x2 grid on large, vertical on mobile */}
              <div className="grid grid-cols-2 gap-4 lg:mt-12">
                {videoData.map((video, idx) => (

                  <div
                    key={idx}
                    className="rounded-2xl overflow-hidden relative group cursor-pointer hover:opacity-90 transition"
                  >
                    <VideoPlayer
                      src={video.src}
                      title={video.title}
                      aspect="aspect-[4/3]"
                      variant="small"
                      onClick={() => {
                        setMainVideo(video);
                        setShouldAutoPlay(true); // now autoplay
                      }}


                    />
                  </div>
                ))}


              </div>
            </div>
          </section>
          {/* vidoe seciton ended */}



          {/* Chief Minister Section */}
          <section className="relative py-12 px-4 sm:px-6 md:px-12">
            {/* Background Split */}
            <div className="absolute inset-0 flex">
              <div className="w-1/3 bg-white"></div>
              <div className="w-2/3 bg-[#e9e1fe]"></div>
            </div>

            {/* Foreground Content */}
            <div className="relative max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 z-10">
              {/* Left: Image */}
              <div className="w-full lg:w-1/2 flex  justify-center">
                <img
                  src="/cm.jpeg" // Place this image in /public
                  alt="Shri Vishnu Deo Sai"
                  className="rounded-2xl w-full w-[30vw] h-[70vh] object-cover shadow-lg"
                />
              </div>

              {/* Right: Text */}
              <div className="w-full lg:w-1/2 text-center lg:text-left">
                <p style={{ fontSize: `${fontSize}px` }} className="text-lg text-gray-800 font-medium mb-2">
                {isHindi ? 'आपके ' : 'Know Your '}{' '}
                  <span style={{ fontSize: `${fontSize}px` }} className="bg-yellow-300 px-2 py-0.5 rounded-sm font-bold text-black">
                  {isHindi ? 'मुख्यमंत्री' : 'Chief Minister'}
                  </span>
                </p>
                <h2 style={{ fontSize: `${fontSize}px` }} className="text-2xl sm:text-3xl font-bold text-[#170645] mb-4">
                {isHindi ? 'श्री विष्णुदेव साय' : 'Shri Vishnu Deo Sai'}
                </h2>
                <p style={{ fontSize: `${fontSize}px` }} className="text-gray-800 leading-relaxed mb-3">
                {isHindi
                    ? '21 फरवरी 1964 को जन्मे, वे छत्तीसगढ़ के वर्तमान और चौथे मुख्यमंत्री हैं। वे इस पद को संभालने वाले पहले आदिवासी नेता हैं। वे 2020 से 2022 तक भारतीय जनता पार्टी, छत्तीसगढ़ के अध्यक्ष भी रह चुके हैं और वर्तमान में कुनकुरी से विधायक हैं।'
                    : 'Born 21 February 1964, he is an Indian politician currently serving as the 4th Chief Minister of Chhattisgarh. He is the first tribal leader to hold the post. He also served as President of Bharatiya Janata Party, Chhattisgarh from 2020 until 2022. He currently represents Kunkuri in the Chhattisgarh Legislative Assembly.'}
                </p>
                <p style={{ fontSize: `${fontSize}px` }}  className="text-gray-800 leading-relaxed mb-3">
                {isHindi
                    ? 'श्री विष्णुदेव साय का जन्म जशपुर जिले के बगिया गांव में एक कृषक परिवार में श्री राम प्रसाद साय और श्रीमती जशमणी देवी के घर हुआ था। उन्होंने 1991 में श्रीमती कौशल्या देवी से विवाह किया।'
                    : 'Shri Vishnu Deo Sai was born in a farmer\'s family in Bagia village of Jashpur District to Shri Ram Prasad Sai and Smt. Jashmani Devi on 21 February 1964. He married Kaushalya Devi in 1991.'}
                </p>
                <p style={{ fontSize: `${fontSize}px` }} className="text-gray-800 leading-relaxed">
                {isHindi
                    ? '13 दिसंबर 2023 को, श्री विष्णुदेव साय ने रायपुर के साइंस कॉलेज ग्राउंड में छत्तीसगढ़ के मुख्यमंत्री पद की शपथ ली।'
                    : 'On 13 December 2023, Shri Vishnu Deo Sai took oath as Chief Minister of Chhattisgarh at the Science College Ground in Raipur.'}
                </p>
              </div>
            </div>
          </section>




          {/* AI Upload Info Section */}
          <section className="bg-black text-white py-16 px-4 sm:px-8 md:px-16">
            <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12">

              {/* Left Content */}
              <div className="w-full md:w-1/2">
                <h2 style={{ fontSize: `${fontSize}px` }} className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-snug mb-4">
                {isHindi
    ? 'अपनी तस्वीरों को' : 'Discover Perfect Image Matches With'}{' '}
                  <span
                    className="text-black px-4 py-1 rounded-sm font-bold inline-block"
                    style={{
                      backgroundImage: "url('/bgy.png')", // Place this image in public folder
                      backgroundSize: 'contain',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                      fontSize: `${fontSize}px` ,
                    }}
                  >
                    AI-Powered
                  </span>{' '}
                  {isHindi ? 'तकनिकी से खोजें' : 'Uploads'} :
                </h2>

                <p style={{ fontSize: `${fontSize}px` }} className="text-gray-300 mb-6">
                {isHindi
    ? 'अपनी छवि अपलोड करें और हमारी एआई तकनीक से मिलती-जुलती तस्वीरें तुरंत पाएं।'
    : 'Upload your image and let our AI technology work its magic. Our advanced image recognition system scans the ImgAR dataset to find the most accurate and relevant matches to your uploaded image.'}
                </p>

                <h3 style={{ fontSize: `${fontSize}px` }} className="text-lg sm:text-xl font-bold mb-4">{isHindi ? 'कैसे काम करता है:' : 'How It Works:'}</h3>
                <ul className="space-y-3 text-gray-200">
                  <li className="flex items-start gap-2">
                    <img src="/arrow.png" alt="arrow" className="w-[20px] h-[20px] mt-[2px] mr-2" />
                    <span style={{ fontSize: `${fontSize}px` }} > {isHindi ? 'तस्वीर अपलोड करें: ड्रैग-एंड-ड्रॉप या फाइल चुनें।' : 'Upload an image: Drag and drop or choose from your files.'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <img src="/arrow.png" alt="arrow" className="w-[20px] h-[20px] mt-[3px] mr-2" />
                    <span style={{ fontSize: `${fontSize}px` }}> {isHindi ? 'एआई विश्लेषण: हमारी प्रणाली तस्वीर का विश्लेषण करती है।' : 'AI Analysis: Our AI scans and analyzes the image, identifying key features, colors, and patterns.'}.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <img src="/arrow.png" alt="arrow" className="w-[20px] h-[20px] mt-[3px] mr-2" />
                    <span style={{ fontSize: `${fontSize}px` }}>{isHindi ? 'सटीक मिलान पाएं: आपकी तस्वीर से मिलती छवियों की सूची तुरंत पाएं।' : 'Find Exact Matches: Receive a curated set of matching images in seconds.'}</span>
                  </li>
                </ul>

                <button onClick={() => router.push('/verification')} style={{ fontSize: `${fontSize}px` }} className="mt-8 border border-yellow-400 text-yellow-400 px-14 py-4 rounded-full hover:bg-yellow-400 hover:text-black transition">
                {isHindi ? 'रजिस्टर करें' : 'Register Now'}
                </button>
              </div>

              {/* Right Image */}
              <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
                <img
                  src="/Ai.gif" // Save your glowing face image as this
                  alt="AI Face Recognition"
                  className="w-[50vw] w-full"
                />
                {/* <p className="text-xs mt-2 text-gray-400 tracking-wider uppercase">
        Face recognition is under way...
      </p> */}
              </div>
            </div>
          </section>

          {/* Trending Social Media Section */}
          <section className="py-12 px-4 sm:px-6 md:px-12 bg-white text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#170645]">
            {isHindi ? 'ट्रेंडिंग' : 'Trending'}{' '}
              <span
                className="inline-block font-bold text-black px-3 py-1"
                style={{
                  backgroundImage: "url('/bgy.png')",
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                }}
              >
               {isHindi ? 'सोशल मीडिया' : 'Social Media'}
              </span>
            </h2>

            {/* Social Media Cards */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
              {/* Twitter */}
              <div className="flex flex-col items-center">
                <div className="text-[#170645] text-2xl font-semibold flex items-center gap-2 mb-2">
                  <img src="/x.png" alt="Twitter" className="w-[35px] h-[35px]" />
                  <span>Twitter</span>
                </div>

                <div className="relative border-[10px] border-black rounded-[39px] overflow-hidden w-full max-w-[280px]">
                  {/* Background Image */}
                  <img
                    src="/twitter.png"
                    alt="Twitter Post"
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay Image */}
                  <img
                    src="/jansam.png"
                    alt="Overlay"
                    className="absolute mt-5 top-0 left-0 w-full max-w-[253px] h-full max-h-[100px] object-cover animate-y-vibe "
                  />
                </div>
              </div>

              <style jsx>{`
  @keyframes y-rotate-vibe {
      0% {
      transform: rotateY(0deg);
    }
    20% {
      transform: rotateY(400deg);
    }
    22% {
      transform: rotateY(320deg); /* Recoil */
    }
    24% {
      transform: rotateY(380deg);
    }
    26% {
      transform: rotateY(340deg); /* Recoil */
    }
    28% {
      transform: rotateY(360deg); /* Settle back */
    }

    100% {
      transform: rotateY(360deg); /* Hold */
    }
  }
  .animate-y-vibe {
    animation: y-rotate-vibe 6s ease-in-out infinite;
    transform-style: preserve-3d;
    backface-visibility: hidden;
  }
    

`}</style>


              {/* Instagram */}
              <div className="flex flex-col items-center">
                <div className="text-[#170645] text-2xl font-semibold flex items-center gap-2 mb-2">
                  <img src="/insta.png" alt="Instagram" className="w-[40px] h-[40px]" />
                  <span>Instagram</span>
                </div>
                <div className="border-[10px] border-black rounded-[39px] overflow-hidden w-full max-w-[280px]">
                  <img
                    src="/instagram.png"
                    alt="Instagram Post"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Facebook */}
              <div className="flex flex-col items-center">
                <div className="text-[#170645] text-2xl font-semibold flex items-center gap-2 mb-2">
                  <img src="/fb.png" alt="Facebook" className="w-[41px] h-[41px]" />
                  <span>Facebook</span>
                </div>
                <div className="border-[10px] border-black rounded-[39px] overflow-hidden w-full max-w-[280px]">
                  <img
                    src="/facebk.png"
                    alt="Facebook Post"
                    className="object-cover "
                  />
                </div>
              </div>
            </div>

          </section>


          {/* Department Logos Section */}
          {/* Department Logos Scrolling Section */}
          <section className="py-12 bg-white overflow-hidden">
            <div className="relative w-full">
              <div className="marquee-track whitespace-nowrap flex items-center gap-12 px-4">
                {[...Array(2)].map((_, i) => (
                  <React.Fragment key={i}>
                    <img src="/Group 833.png" alt="Logo 1" className="h-[20vh] w-[12vw] object-contain" />
                    <img src="/1 91.png" alt="Logo 2" className="h-[20vh] w-[10vw] object-contain" />
                    <img src="/2 25.png" alt="Logo 3" className="h-[20vh] w-[10vw] object-contain" />
                    <img src="/3 8.png" alt="Logo 4" className="h-[20vh] w-[10vw] object-contain" />
                    <img src="/44.png" alt="Logo 5" className="h-[20vh] w-[10vw] object-contain" />
                    <img src="/6 1.png" alt="Logo 6" className="h-[20vh] w-[10vw] object-contain" />
                    <img src="/7 7.png" alt="Logo 7" className="h-[20vh] w-[10vw] object-contain" />
                  </React.Fragment>
                ))}
              </div>
            </div>

          </section>


          {/* Footer Section */}
          <footer className="bg-gray-200 text-black py-8 ">
            <div className="max-w-[1621px] mx-auto px-6 md:px-16">

              {/* Districts List */}
              <div className="border-b border-gray-400 pb-6 mb-6">
                <h3 className="font-bold text-lg text-gray-800 mb-3">Districts List</h3>
                <p className="text-sm text-gray-600 leading-relaxed flex flex-wrap gap-2">
                  {[
                    "Bijapur", "Sukma", "Dantewada", "Bastar", "Kondagaon", "Narayanpur", "Kanker", "Kawardha", "Balod",
                    "Rajnandgaon", "Durg", "Bemetara", "Dhamtari", "Gariaband", "Raipur", "Baloda Bazar", "Mahasamund",
                    "Bilaspur", "Mungeli", "Korba", "Janjgir-Champa", "Raigarh", "Jashpur", "Korea", "Surajpur", "Surguja", "Balrampur"
                  ].map((district, index, arr) => (
                    <span key={index} className="flex items-center whitespace-nowrap">
                      {district}
                      {index !== arr.length - 1 && <span className="mx-2">|</span>}
                    </span>
                  ))}
                </p>
              </div>

              {/* Featured Links & Reach Us */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-16">

                {/* Featured Links */}
                <div>
                  <h3 className="font-bold text-lg text-gray-800 mb-3">Featured Links</h3>
                  <div className="text-sm text-gray-600 flex flex-wrap gap-x-2 gap-y-2">
                    {[
                      "Home", "Copyright Policy", "Disclaimer", "Site Map",
                      "Hyperlink Policy", "Privacy Policy", "Terms And Conditions", "Terms Of Use"
                    ].map((name, index, arr) => (
                      <span key={index} className="flex items-center">
                        <a href="#" className="hover:underline">{name}</a>
                        {index !== arr.length - 1 && <span className="mx-2">|</span>}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Reach Us */}
                <div>
                  <h3 className="font-bold text-lg text-gray-800 mb-3">Reach Us</h3>
                  <div className="text-sm text-gray-600 space-y-3">
                    <p className="flex items-center gap-3">
                      <img src="/loc.png" alt="Location" className="w-[10px] h-auto md:w-[15px]" />
                      Directorate of Public Relations, Naya Raipur, Chhattisgarh, 492001
                    </p>
                    <p className="flex items-center gap-3">
                      <img src="/cal.png" alt="Phone" className="w-[10px] h-auto md:w-[15px]" />
                      +91-771-2221614
                    </p>
                    <p className="flex items-center gap-3">
                      <img src="/mai.png" alt="Email" className="w-[10px] h-auto md:w-[15px]" />
                      dprcgh@gmail.com
                    </p>
                  </div>
                </div>

              </div>

              {/* Horizontal Divider */}
              <div className="border-b border-gray-400 my-6"></div>

              {/* App, Logos, Social */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-12">

                {/* Download Our App */}
                <div>
                  <h3 className="font-bold text-lg text-gray-800 mb-3 text-center md:text-left">Download Our App</h3>
                  <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                    <img src="/play_store 1 (1).png" alt="Google Play" className="w-[80px] sm:w-[120px] md:w-[150px] h-auto max-w-full" />
                    <img src="/app_store 1.png" alt="App Store" className="w-[80px] sm:w-[120px] md:w-[150px] h-auto max-w-full" />
                  </div>
                </div>

                {/* Logos */}
                <div>
                  <div className="flex flex-wrap justify-center gap-4 mt-6">
                    <img src="/Group 833.png" alt="Logo 1" className="w-[40px] md:w-[60px] h-auto" />
                    <img src="/digitalIndia 1 (1).png" alt="Logo 2" className="w-[60px] md:w-[90px] h-auto" />
                    <img src="/mygov1.png" alt="Logo 3" className="w-[60px] md:w-[90px] h-auto" />
                    <img src="/azadi-ka-amrit-mahotsav 1 (1).png" alt="Logo 4" className="w-[60px] md:w-[90px] h-auto" />
                  </div>
                </div>

                {/* Social Media */}
                <div>
                  <h3 className="font-bold text-lg text-gray-800 mb-3 text-center md:text-left">Follow Us</h3>
                  <div className="flex gap-4 justify-center md:justify-start">
                    {[
                      { name: "Twitter", icon: "/x.png" },
                      { name: "Facebook", icon: "/fb.png" },
                      { name: "Instagram", icon: "/insta.png" },
                      { name: "YouTube", icon: "/youtube 1 (1).png" },
                      { name: "LinkedIn", icon: "/linkedin (1) 1 (1).png" }
                    ].map((social, index) => (
                      <a key={index} href="#">
                        <img src={social.icon} alt={social.name} className="w-[30px] md:w-[40px] h-auto max-w-full" />
                      </a>
                    ))}
                  </div>
                </div>

              </div>

              {/* Footer Bottom */}
              <div className="w-full text-center py-4 mt-8">
                <p className="text-sm text-gray-500">
                  © 2025 CMO Gallery | Initiative by DPR Chhattisgarh
                </p>
              </div>

            </div>
          </footer>



          <style>{`
 @keyframes scroll-loop {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}

.marquee-track {
  animation: scroll-loop 30s linear infinite;
  width: max-content;
}

`}</style>




          <style>{`
        
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>




        </div>
      )}
    </>
  );
}
