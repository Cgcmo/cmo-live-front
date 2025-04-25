"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaChevronDown, FaSlidersH } from "react-icons/fa";
import debounce from "lodash.debounce";
import { FaSearch } from "react-icons/fa";
import { FiUser, FiLogOut } from "react-icons/fi";
import { signOut, useSession } from "next-auth/react";


export default function Navbar({ setShowGallery, setGalleryPhotos }) {
  const [showFilter, setShowFilter] = useState(false);
  const router = useRouter();
  const [eventList, setEventList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [allSuggestions, setAllSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);


  const handleFilterClick = () => {
    setShowFilter(!showFilter);
  };




  useEffect(() => {
    // Fetch Events
    fetch("https://b364-49-35-193-75.ngrok-free.app/get-events")
      .then(res => res.json())
      .then(data => setEventList(data))
      .catch(err => console.error("Failed to fetch events:", err));

    // Fetch Categories (Departments)
    fetch("https://b364-49-35-193-75.ngrok-free.app/departments")
      .then(res => res.json())
      .then(data => setCategoryList(data.map(d => d.name)))  // extract only names
      .catch(err => console.error("Failed to fetch departments:", err));

    // Fetch Districts
    fetch("https://b364-49-35-193-75.ngrok-free.app/districts")
      .then(res => res.json())
      .then(data => setDistrictList(data.map(d => d.name)))
      .catch(err => console.error("Failed to fetch districts:", err));
  }, []);


  useEffect(() => {
    fetch("https://b364-49-35-193-75.ngrok-free.app/search-suggestions")
      .then(res => res.json())
      .then(data => {
        const combined = [
          ...data.events.map(e => ({ type: "Event", name: e })),
          ...data.departments.map(d => ({ type: "Department", name: d })),
          ...data.districts.map(d => ({ type: "District", name: d })),
        ];
        setAllSuggestions(combined);
      });
  }, []);

  // Debounced input handler
  const debouncedSuggest = debounce((value) => {
    if (value.length === 0) {
      setSuggestions([]);
      return;
    }
    const filtered = allSuggestions.filter(s =>
      s.name.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filtered.slice(0, 10));
  }, 300);


  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value); // update immediately so input doesn't lag
    debouncedSuggest(value); // debounce only the suggestion logic
  };

  const handleSearch = (queryText = search) => {
    if (!queryText) return;
    router.push(`/search-results?q=${encodeURIComponent(queryText)}`);
  };

  const handleSuggestionClick = (name) => {
    setSearch(name);
    setSuggestions([]);
    handleSearch(name);
  };
  return (
    <nav className="w-full h-[80px] bg-white flex items-center px-4 md:px-6 shadow-md justify-between">
      {/* Left Section: Logo */}
      <button onClick={() => router.push("/dashboard")}>
        <img
          src="/CG logo.webp"
          alt="Logo"
          className="w-[72px] h-auto shrink-0 "
        />
      </button>

      <div className="flex flex-col relative w-full max-w-[70vw] mx-auto px-2">     
       <div className="flex items-center border border-gray-300 rounded-full overflow-hidden bg-gray-100 h-[45px] px-3 z-10">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={handleChange}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full bg-transparent text-gray-700 outline-none px-2"
          />
          <button  onClick={() => {
    setSearch("");
    setSuggestions([]); // optionally clear suggestions too
  }} className="text-gray-500">✕</button>
          <span className="text-gray-400 px-3">|</span>
          <button onClick={() => handleSearch()} className="text-gray-600 text-base">
            <FaSearch />
          </button>
        </div>

        {suggestions.length > 0 && (
          <div className="absolute top-[48px] left-0  bg-gray-100 border rounded-md shadow-md w-full z-20 max-h-60 overflow-auto">
            {suggestions.map((s, i) => (
              <div
                key={i}
                onClick={() => handleSuggestionClick(s.name)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between text-sm"
              >
                <span className="truncate text-black">{s.name}</span>
                <span className="text-xs text-blue-400">{s.type}</span>
              </div>
            ))}
          </div>
        )}
      </div>


      {/* Right Section: Buttons */}
      <div className="flex items-center gap-4">
        {/* Mobile View: Icons for Filter & Search */}
       




        {/* Search Button (Desktop Only) */}
        <>
  {/* Desktop Button */}
  <button
    onClick={() => { setShowGallery(false); router.push("/dashboard/uploadphoto") }}
    className="hidden sm:flex w-[160px] h-[45px] bg-[#170645] text-yellow-300 rounded-full shadow-lg items-center justify-center px-4 py-2 text-sm sm:text-base transition-all"
  >
    Search By Face
  </button>

  {/* Mobile Icon Button */}
  <button
  onClick={() => {
    setShowGallery(false);
    router.push("/dashboard/uploadphoto");
  }}
  className="flex sm:hidden w-10 h-10 rounded-full bg-[#170645] text-yellow-300 items-center justify-center"
  aria-label="Face Search"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-scan-face"
  >
    <path d="M3 7V5a2 2 0 0 1 2-2h2" />
    <path d="M17 3h2a2 2 0 0 1 2 2v2" />
    <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
    <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <path d="M9 9h.01" />
    <path d="M15 9h.01" />
  </svg>
</button>

</>



        {/* Profile Icon */}
        {/* <button onClick={() => router.push("/profile")} className="w-9 h-9 rounded-full border border-gray-300 overflow-hidden">
          <img src="/pro.png" alt="User Profile" className="w-full h-full object-cover" />
        </button> */}


      {/* Profile Dropdown */}
      <div className="relative">
  <button
    onClick={() => setShowDropdown(prev => !prev)}
    className="w-10 h-10 rounded-full border border-gray-300 overflow-hidden focus:outline-none"
  >
    <img src="/pro.png" alt="User Profile" className="w-full h-full object-cover" />
  </button>

  {showDropdown && (
  <>
    {/* Background dimming overlay */}
    <div
      className="fixed inset-0 bg-black bg-opacity-30 z-40"
      onClick={() => setShowDropdown(false)}
    ></div>

    {/* Dropdown itself */}
    <div className="absolute right-0 mt-3 w-[150px] bg-white border border-gray-100 rounded-xl shadow-xl z-50 text-sm py-2">
      <button
        onClick={() => {
          router.push("/profile");
          setShowDropdown(false);
        }}
        className="w-full flex items-center gap-2 px-4 py-2 text-gray-800 hover:bg-gray-100"
      >
        <FiUser className="text-[17px]" />
        <span className="font-medium">My Profile</span>
      </button>
      <hr className="my-1 border-gray-200" />
      <button
        onClick={async () => {
          setShowDropdown(false);
        
          // ✅ Clear credentials session
          localStorage.removeItem("otpUser");
        
          // ✅ Sign out Google session too (if it exists)
          await signOut({
            redirect: true,
            callbackUrl: "/"
          });
        }}
        
        className="w-full flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50"
      >
        <FiLogOut className="text-[17px]" />
        <span className="font-medium">Logout</span>
      </button>
    </div>
  </>
)}
</div>

      </div>
      {isLoadingSearch && (
          <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-white z-50">
          <div className="flex flex-col items-center">
            <div className="relative w-20 h-20">
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
            <p className="mt-4 text-lg font-semibold text-gray-700">
              Searching Related Photo...
            </p>
          </div>
          <div className="absolute bottom-10 text-center">
            <p className="text-lg font-bold text-gray-700">
              The latest <span className="text-black font-bold">AI</span> image search.
            </p>
          </div>
        </div>
        )}

    </nav>
  );
}



