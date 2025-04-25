"use client";
import React, { useEffect, useState } from 'react';
const Footer = () => {
    // Dynamic District List
    const [districts, setDistricts] = useState([]);

    useEffect(() => {
        fetch("https://0258-2409-4043-400-c70d-f18c-bef4-7b7d-6e83.ngrok-free.app/districts") // 🔁 Replace with actual domain (e.g., https://api.choicesay.com)
            .then((res) => res.json())
            .then((data) => {
                const names = data.map(d => d.name);
                setDistricts(names);
            })
            .catch((err) => console.error("Failed to fetch districts", err));
    }, []);
    // Dynamic Featured Links
    const featuredLinks = [
        { name: "Home", url: "#" },
        { name: "Copyright Policy", url: "/info/copyright-policy" },
    { name: "Disclaimer", url: "/info/disclaimer" },
    { name: "Site Map", url: "/info/site-map" },
        { name: "Hyperlink Policy", url: "#" },
        { name: "Privacy Policy", url: "#" },
        { name: "Terms And Conditions", url: "/info/terms-and-conditions" },
        { name: "Terms Of Use", url: "/info/terms-of-use" }
    ];

    // Dynamic Social Media Links
    const socialLinks = [
        { name: "Twitter", icon: "/twit.png", url: "#" },
        { name: "Facebook", icon: "/facebook 3.png", url: "#" },
        { name: "Instagram", icon: "/instagram (3) 2.png", url: "#" },
        { name: "YouTube", icon: "/youtube 1.png", url: "#" },
        { name: "LinkedIn", icon: "/linkedin (1) 1.png", url: "#" }
    ];

    return (
        <footer className="bg-gray-200 text-black pt-8">
            <div className="max-w-[1621px] mx-auto px-6 md:px-16">

                {/* District List */}
                <div className="border-b border-gray-400 pb-6 mb-6">
                    <h3 className="font-bold text-lg text-gray-800 mb-3">Districts List</h3>
                    <p className="text-sm text-gray-600 leading-relaxed flex flex-wrap gap-2">
                    {districts.map((district, index) => (
  <span key={index} className="flex items-center whitespace-nowrap">
    <a href={`/district/${district}`} className="hover:underline text-gray-600">
      {district}
    </a>
    {index !== districts.length - 1 && <span className="mx-2">|</span>}
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
                        {featuredLinks.map((link, index) => (
  <span key={index} className="flex items-center">
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:underline"
    >
      {link.name}
    </a>
    {index !== featuredLinks.length - 1 && <span className="mx-2">|</span>}
  </span>
))}

                        </div>
                    </div>

                    {/* Reach Us */}
                    <div>
                        <h3 className="font-bold text-lg text-gray-800 mb-3">Reach Us</h3>
                        <div className="text-sm text-gray-600 space-y-3">
                            <p className="flex items-center gap-3">
                                <img src="/location.png" alt="Location" className="w-[10px] h-auto md:w-[15px]" />
                                Directorate of Public Relations, Naya Raipur, Chhattisgarh, 492001
                            </p>
                            <p className="flex items-center gap-3">
                                <img src="/call.png" alt="Phone" className="w-[10px] h-auto md:w-[15px]" />
                                +91-771-2221614
                            </p>
                            <p className="flex items-center gap-3">
                                <img src="/mail.png" alt="Email" className="w-[10px] h-auto md:w-[15px]" />
                                dprcgh@gmail.com
                            </p>
                        </div>
                    </div>

                </div>

                {/* Horizontal Division */}
                <div className="border-b border-gray-400 my-6"></div>

                {/* Download App & Social Media */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-12">

                    {/* Download Our App */}
                    <div>
                        <h3 className="font-bold text-lg text-gray-800 mb-3 text-center md:text-left">Download Our App</h3>
                        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                            <img src="/play_store 1.png" alt="Google Play" className="w-[80px] sm:w-[120px] md:w-[150px] h-auto max-w-full" />
                            <img src="/IOS.png" alt="App Store" className="w-[80px] sm:w-[120px] md:w-[150px] h-auto max-w-full" />
                        </div>
                    </div>


                    {/* Logos */}
                    <div>
                        <div className="flex flex-wrap justify-center gap-4 mt-6">
                            <img src="/CG logo.webp" alt="Logo 1" className="w-[50px] md:w-[70px] h-auto" />
                            <img src="/digitalIndia 1.png" alt="Logo 2" className="w-[80px] md:w-[110px] h-auto" />
                            <img src="/mygov.png" alt="Logo 3" className="w-[80px] md:w-[110px] h-auto" />
                            <img src="/azadi-ka-amrit-mahotsav 1.png" alt="Logo 4" className="w-[80px] md:w-[110px] h-auto" />
                        </div>
                    </div>

                    {/* Follow Us */}
                    <div>
                        <h3 className="font-bold text-lg text-gray-800 mb-3 text-center md:text-left">Follow Us</h3>
                        <div className="flex gap-4 justify-center md:justify-start">
                            {socialLinks.map((social, index) => (
                                <a key={index} href={social.url}>
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
    );
};

export default Footer;
