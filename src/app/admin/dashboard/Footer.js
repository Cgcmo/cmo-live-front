import React, { useEffect, useState } from 'react';
import API_URL from '@/app/api';

const Footer = () => {
    // Dynamic District List
    const [districts, setDistricts] = useState([]);

    useEffect(() => {
        fetch(`${API_URL}/districts`) 
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
        { name: "Copyright Policy", url: "#" },
        { name: "Disclaimer", url: "#" },
        { name: "Site Map", url: "#" },
        { name: "Hyperlink Policy", url: "#" },
        { name: "Privacy Policy", url: "#" },
        { name: "Terms And Conditions", url: "#" },
        { name: "Terms Of Use", url: "#" }
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
                                <a
                                    href={`/district/${district}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline text-gray-600"
                                >
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
                                    <a href={link.url} className="hover:underline">{link.name}</a>
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
                  <h3 className="font-bold text-lg text-gray-800  text-center md:text-left">Download Our App</h3>
                  <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                    <img src="/play_store 1 (1).svg" alt="Google Play" className="w-[100px] sm:w-[120px] md:w-[150px] h-auto max-w-full" />
                    {/* <img src="/app_store 1.png" alt="App Store" className="w-[80px] sm:w-[120px] md:w-[150px] h-auto max-w-full" /> */}
                  </div>
                </div>

                {/* Logos */}
                <div>
                  <div className="flex flex-wrap justify-center gap-4 ml-4 mt-6">
                    <img src="/cggov.svg" alt="Logo 1" className="w-[50px] md:w-[70px] h-auto" />
                    <img src="/digitalIndia 1.svg" alt="Logo 2" className="w-[70px] md:w-[100px] h-auto" />
                    <img src="/mygov1.svg" alt="Logo 3" className="w-[70px] md:w-[100px] h-auto" />
                    <img src="/azadi-ka-amrit-mahotsav 1.svg" alt="Logo 4" className="w-[70px] md:w-[100px] h-auto" />
                  </div>
                </div>

                {/* Social Media */}
                <div>
                  <h3 className="font-bold text-lg text-gray-800 mb-3 text-center md:text-left">Follow Us</h3>
                  <div className="flex gap-4 justify-center md:justify-start">
                    {[
                      { name: "Twitter", icon: "/x.svg", url: "https://x.com/dprchhattisgarh" },
                      { name: "Facebook", icon: "/fb.svg", url: "https://www.facebook.com/DPRChhattisgarh" },
                      { name: "Instagram", icon: "/insta.svg", url: "https://www.instagram.com/dpr.chhattisgarh/" },
                      { name: "YouTube", icon: "/youtube 1 (1).svg", url: "https://www.youtube.com/@DPRChhattisgarh" }
                    ].map((social, index) => (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={social.icon}
                          alt={social.name}
                          className="w-[30px] md:w-[35px] h-auto max-w-full"
                        />
                      </a>
                    ))}
                  </div>
                </div>

              </div>

              {/* Footer Bottom */}
              <div className="w-full text-center py-4 ">
                <p className="text-sm text-gray-500">
                  © 2025 CMO Gallery | Initiative by <a href="https://dprcg.gov.in/" target="_blank" rel="noopener noreferrer" className="underline">DPR Chhattisgarh</a>
                </p>

              </div>

            </div>
        </footer>
    );
};

export default Footer;
