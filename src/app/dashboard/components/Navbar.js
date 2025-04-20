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

  const handleFilterClick = () => {
    setShowFilter(!showFilter);
  };




  useEffect(() => {
    // Fetch Events
    fetch("https://cmo-back-livee.onrender.com/get-events")
      .then(res => res.json())
      .then(data => setEventList(data))
      .catch(err => console.error("Failed to fetch events:", err));

    // Fetch Categories (Departments)
    fetch("https://cmo-back-livee.onrender.com/departments")
      .then(res => res.json())
      .then(data => setCategoryList(data.map(d => d.name)))  // extract only names
      .catch(err => console.error("Failed to fetch departments:", err));

    // Fetch Districts
    fetch("https://cmo-back-livee.onrender.com/districts")
      .then(res => res.json())
      .then(data => setDistrictList(data.map(d => d.name)))
      .catch(err => console.error("Failed to fetch districts:", err));
  }, []);


  useEffect(() => {
    fetch("https://cmo-back-livee.onrender.com/search-suggestions")
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

      <div className="flex flex-col relative w-full max-w-[70vw] mx-auto px-2">        <div className="flex items-center border border-gray-300 rounded-full overflow-hidden bg-gray-100 h-[45px] px-3 z-10">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={handleChange}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full bg-transparent text-gray-700 outline-none px-2"
          />
          <button onClick={() => handleSearch()} className="text-gray-500">✕</button>
          <span className="text-gray-400 px-3">|</span>
          <button className="text-gray-600 text-base">
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
    </nav>
  );
}



