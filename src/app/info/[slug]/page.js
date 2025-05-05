"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function InfoPage() {
  const params = useParams();
  const [menuOpen, setMenuOpen] = useState(false)
  const [isHindi, setIsHindi] = useState(false);
  const [fontSize, setFontSize] = useState(18);

  const featuredLinks = [
   { name: "Home", url: "/" },
   { name: "Copyright Policy", url: "/info/copyright-policy" },
   { name: "Disclaimer", url: "/info/disclaimer" },
   { name: "Site Map", url: "/info/site-map" },
   { name: "Hyperlink Policy", url: "/info/hyperlink-policy" },
   { name: "Privacy Policy", url: "/info/privacy-policy" },
   { name: "Terms And Conditions", url: "/info/terms-and-conditions" },
   { name: "Terms Of Use", url: "/info/terms-of-use" },
 ];

 function renderBoldContent(text) {
   return text.split("**").map((part, index) =>
     index % 2 === 1 ? (
       <span key={index} className="font-semibold text-[#222]">
         {part}
       </span>
     ) : (
       <span key={index} className="text-gray-800">
         {part}
       </span>
     )
   );
 }

 const contentHindi = {
   "copyright-policy": {
     title: "कॉपीराइट नीति",
     content: `
 nbdigital.online पर होस्ट की गई सभी सामग्री — जैसे चित्र, वीडियो और टेक्स्ट — पूरी तरह से मुख्यमंत्री कार्यालय (CMO), छत्तीसगढ़, भारत सरकार की संपत्ति है।
 
 1. **मालिकाना हक:**
    - इस वेबसाइट पर मौजूद सभी फोटोग्राफ, वीडियो और लिखित सामग्री भारतीय कॉपीराइट कानूनों द्वारा संरक्षित हैं।
    - बौद्धिक संपदा अधिकार पूरी तरह से CMO छत्तीसगढ़ के पास हैं।
 
 2. **उपयोग दिशा-निर्देश:**
    - उपयोगकर्ता केवल व्यक्तिगत और गैर-व्यावसायिक उद्देश्य के लिए सामग्री देख, डाउनलोड और साझा कर सकते हैं।
    - बिना लिखित अनुमति के पुनरुत्पादन, पुनर्वितरण या व्यावसायिक उपयोग सख्त वर्जित है।
 
 3. **उल्लंघन की रिपोर्टिंग:**
    - यदि आपको लगे कि इस साइट की सामग्री का दुरुपयोग हो रहा है, तो कृपया dprcgh@gmail.com पर तुरंत रिपोर्ट करें।
 
 4. **कानूनी कार्रवाई:**
    - किसी भी प्रकार का अनधिकृत व्यावसायिक उपयोग या शोषण भारतीय कानूनों के तहत कानूनी कार्रवाई को जन्म दे सकता है।
     `,
   },
 
   disclaimer: {
     title: "अस्वीकरण",
     content: `
 nbdigital.online, जो मुख्यमंत्री कार्यालय, छत्तीसगढ़ द्वारा संचालित एक एआई आधारित प्लेटफॉर्म है, केवल सूचना एवं सुविधा के उद्देश्य से सेवाएं प्रदान करता है।
 
 1. **सटीकता और विश्वसनीयता:**
    - हमारी प्रणाली FaceNet AI तकनीक पर आधारित है, लेकिन इसकी सटीकता की पूर्ण गारंटी नहीं दी जा सकती।
    - यदि कोई सटीक मिलान नहीं मिलता है, तो संबंधित तस्वीरों का विस्तारित सेट दिखाया जा सकता है।
 
 2. **दायित्व सीमा:**
    - CMO छत्तीसगढ़ किसी भी गलत उपयोग, गलत व्याख्या, या आशय विरुद्ध उपयोग की ज़िम्मेदारी नहीं लेता।
    - सामग्री का उपयोग उपयोगकर्ता की ज़िम्मेदारी पर निर्भर करता है।
 
 3. **उपयोगकर्ता की जिम्मेदारी:**
    - उपयोगकर्ता से अपेक्षा की जाती है कि वे इस प्लेटफॉर्म की गोपनीयता और प्रामाणिकता को बनाए रखें।
 
 4. **तकनीकी समस्याएं:**
    - साइट की उपलब्धता सुनिश्चित करने के लिए हर संभव प्रयास किया जाता है, लेकिन अनियोजित तकनीकी समस्याएं हो सकती हैं।
     `,
   },
 
   "site-map": {
     title: "साइट मैप",
     content: `
 यह साइट मैप nbdigital.online की संपूर्ण संरचना को दिखाता है ताकि उपयोगकर्ता प्रभावी रूप से नेविगेट कर सकें:
 
 1) **उपयोगकर्ता दृश्य**
 - एल्बम और जिलों की तस्वीरें
 - डैशबोर्ड और प्रोफाइल
 - अपलोड, खोज, गैलरी, स्विच व्यू
 
 2) **प्रमाणीकरण और सुरक्षा**
 - पासवर्ड रीसेट
 - सत्यापन
 - लॉगिन पेज
 
 3) **सामान्य**
 - होमपेज
 - वीडियो प्लेयर
 - सूचना पेज
 - सर्च परिणाम
     `,
   },
 
   "privacy-policy": {
     title: "गोपनीयता नीति",
     content: `
 यह नीति nbdigital.online पर आपकी व्यक्तिगत जानकारी कैसे एकत्र, उपयोग और सुरक्षित रखी जाती है, इसका विवरण देती है।
 
 1. **संग्रहीत जानकारी:**
    - नाम, मोबाइल नंबर, ईमेल, जिला
    - अस्थायी रूप से अपलोड की गई फेस फोटो (एआई मिलान के लिए)
    - डिवाइस और सेशन लॉग्स
 
 2. **उपयोग:**
    - अनुभव को वैयक्तिक बनाना और AI सटीकता बढ़ाना
    - डेटा कभी बेचा या किराए पर नहीं दिया जाएगा
 
 3. **सुरक्षा:**
    - डेटा भारतीय कानूनों के अनुसार संरक्षित है
    - एन्क्रिप्शन और एक्सेस कंट्रोल का उपयोग किया जाता है
 
 4. **थर्ड पार्टी सेवाएं:**
    - एनालिटिक्स टूल्स का सीमित उपयोग
    - कानूनी आवश्यकता के बिना कोई साझेदारी नहीं
 
 5. **उपयोगकर्ता अधिकार:**
    - डेटा हटाने या संशोधन का अनुरोध dprcgh@gmail.com पर करें।
     `,
   },
 
   "hyperlink-policy": {
     title: "हाइपरलिंक नीति",
     content: `
 nbdigital.online पर बाहरी वेबसाइटों के लिंक केवल सुविधा के लिए दिए गए हैं।
 
 1. **बाहरी लिंक अस्वीकरण:**
    - हम किसी भी थर्ड पार्टी साइट की सटीकता या सुरक्षा की गारंटी नहीं देते।
 
 2. **हमारी साइट से लिंक करना:**
    - अन्य साइटें हमारी होमपेज या सार्वजनिक पेज से लिंक कर सकती हैं।
    - लिंक भ्रामक या अनुमोदन का संकेत नहीं होना चाहिए।
 
 3. **पूर्व अनुमति की आवश्यकता नहीं:**
    - सार्वजनिक जानकारी से लिंक करने के लिए अनुमति की आवश्यकता नहीं है।
    - लोगो या ग्राफिक्स के उपयोग हेतु अनुमति आवश्यक है।
 
 4. **अनावश्यक लिंक हटाने का अनुरोध:**
    - किसी अनुचित लिंक की सूचना dprcgh@gmail.com पर दें।
     `,
   },
 
   "terms-of-use": {
     title: "उपयोग की शर्तें",
     content: `
 nbdigital.online के सभी उपयोगकर्ता निम्नलिखित शर्तों का पालन करेंगे:
 
 1. **नैतिक उपयोग:**
    - प्लेटफॉर्म का उपयोग केवल सार्वजनिक कार्यक्रमों में खींची गई तस्वीरों को खोजने के लिए होना चाहिए।
 
 2. **गोपनीयता और डेटा अखंडता:**
    - लॉगिन विवरण गोपनीय रखें।
    - किसी भी उल्लंघन की तुरंत रिपोर्ट करें।
 
 3. **सामग्री सहभागिता:**
    - फ़ोटो को डाउनलोड या साझा करना केवल व्यक्तिगत उपयोग के लिए।
    - छवियों को गलत तरीके से संपादित करना मना है।
 
 4. **कानूनी अनुपालन:**
    - सभी भारतीय साइबर और गोपनीयता कानूनों का पालन अनिवार्य है।
    - उल्लंघन की स्थिति में कानूनी कार्रवाई हो सकती है।
     `,
   },
 
   "terms-and-conditions": {
     title: "नियम और शर्तें",
     content: `
 nbdigital.online का उपयोग करने से, उपयोगकर्ता निम्नलिखित शर्तों को स्वीकार करते हैं:
 
 1. **पंजीकरण:**
    - उपयोगकर्ताओं को सही जानकारी देनी होगी जैसे नाम, ईमेल, मोबाइल आदि।
 
 2. **सुरक्षा:**
    - मजबूत पासवर्ड रखें और किसी भी संदेहास्पद गतिविधि की रिपोर्ट करें।
 
 3. **अनुमत उपयोग:**
    - फ़ोटो केवल व्यक्तिगत उपयोग के लिए डाउनलोड और साझा किए जा सकते हैं।
 
 4. **प्रतिबंधित गतिविधियां:**
    - अनधिकृत वितरण, वाणिज्यिक उपयोग, या प्लेटफ़ॉर्म के दुरुपयोग पर रोक है।
 
 5. **उल्लंघन के परिणाम:**
    - खाता निलंबन या समाप्ति, और कानूनी कार्यवाही हो सकती है।
     `,
   },
 };

 
  const content = {
    "copyright-policy": {
      title: "Copyright Policy",
      content: `
All content, including images, videos, and text hosted on nbdigital.online, is owned exclusively by the Chief Minister's Office (CMO), Chhattisgarh, Government of India.

1. **Ownership:**
   - All photographs, videos, and written content on this website are protected by Indian copyright laws.
   - Intellectual property rights exclusively belong to CMO Chhattisgarh.

2. **Usage Guidelines:**
   - Users may view, download, and share content strictly for personal and non-commercial purposes.
   - Reproduction, redistribution, or commercial exploitation of content without written consent from CMO Chhattisgarh is strictly prohibited.

3. **Reporting Violations:**
   - If you believe content on this site is being misused elsewhere, please report it immediately at dprcgh@gmail.com.

4. **Legal Action:**
   - Unauthorized commercial or exploitative use may result in legal action under applicable Indian laws.
      `,
    },

    disclaimer: {
      title: "Disclaimer",
      content: `
The content and services provided by nbdigital.online, an AI-based platform maintained by the Chief Minister's Office, Chhattisgarh, are intended solely for the public's convenience and informational purposes.

1. **Accuracy and Reliability:**
   - While our platform uses advanced FaceNet AI technology for face recognition and retrieval, accuracy cannot always be guaranteed.
   - If no exact match is found, the system may display broader photo results to help users locate relevant images.

2. **Liability Limitation:**
   - CMO Chhattisgarh does not assume liability for misuse, misinterpretation, or any unintended use of images retrieved from this website.
   - Users bear full responsibility for how retrieved content is used or shared.

3. **User Responsibility:**
   - Users are encouraged to ethically utilize and protect the privacy and integrity of all images obtained from this platform.

4. **Technical Issues:**
   - While every effort is made to ensure website availability, we do not guarantee uninterrupted service due to maintenance, updates, or technical issues beyond our control.
      `,
    },

    "site-map": {
      title: "Site Map",
      content: `
The following is a comprehensive map of the structure and content of nbdigital.online, designed to help users navigate effectively:

1) **User Views**

- **Albums and Districts:**
  - Album Photos ("/album/:albumId")
  - District Photos ("/district/:districtName")

- **Dashboard:**
  - Main Dashboard
  - Search Interface
  - Upload Photos
  - Footer Component
  - Navbar Component
  - Rolling Date Picker
  - Upload Photo Modal

- **Profile Section:**
  - Profile Main View
  - All Photos
  - Custom Bar Chart
  - Event Cards
  - Gallery Modal
  - Modal Popup
  - Profile Edit
  - Switch View

2) **User Authentication and Security**

- Forgot Password
- Reset Password Form
- Verification Page
- Authentication Page

3) **General and Miscellaneous**

- Home Page
- Layout and Structure
- Informational Pages ("/info/:slug")
- Search Results
- Search Bar
- Search Parameter Handling
- Session Wrapper
- Embedded Video Player
      `,
    },

    "terms-and-conditions": {
      title: "Terms and Conditions",
      content: `
By accessing or registering on nbdigital.online, users explicitly agree to the following terms and conditions established by the Chief Minister's Office, Chhattisgarh:

1. **User Registration:**
   - Users must provide truthful and accurate information including their name, mobile number, email address, and district.
   - All personal data is securely stored in compliance with applicable data protection laws.

2. **Account Security:**
   - Users must create strong, confidential passwords that are stored securely in hashed form.
   - Users must immediately report unauthorized account access or security breaches.

3. **Permitted Usage:**
   - Users may download, share, and copy photo links responsibly and ethically for personal use only.

4. **Prohibited Activities:**
   - Unauthorized distribution, commercial exploitation, or misuse of images and content is strictly forbidden.
   - Users are prohibited from using this platform in ways that could compromise its functionality or security.

5. **Consequences of Violations:**
   - Violating these terms may result in account suspension or termination, and potential legal action.
      `,
    },

    "terms-of-use": {
      title: "Terms of Use",
      content: `
All users of nbdigital.online agree to adhere to the following conditions to ensure the ethical and secure operation of our AI-based services provided by the Chief Minister's Office, Chhattisgarh:

1. **Ethical Usage:**
   - Users must use the AI facial recognition responsibly to find photos taken at public events with the Chief Minister.
   - Any inappropriate, malicious, or harmful use of the platform and its content is strictly prohibited.

2. **Data Integrity and Privacy:**
   - Users are expected to maintain the confidentiality of their login credentials.
   - Any detected compromise must be reported immediately for appropriate measures.

3. **Content Interaction:**
   - Users can interact by downloading and sharing photos or photo links, strictly for non-commercial purposes.
   - Editing or altering images in a way that compromises authenticity or privacy is prohibited.

4. **Legal Compliance:**
   - Users must comply with all applicable Indian laws regarding data privacy, intellectual property, and cybersecurity.
   - Misuse, unauthorized sharing, or redistribution of protected content may result in legal proceedings and penalties.
      `,
    },
"privacy-policy": {
  title: "Privacy Policy",
  content: `
This Privacy Policy outlines how we collect, use, and protect your personal data when you visit and interact with nbdigital.online.

1. **Information We Collect:**
   - Name, mobile number, email, district (during account creation or submissions).
   - Face photos uploaded for AI-based matching (temporarily processed, not stored).
   - Device and session logs (IP address, browser info, access times) for analytics.

2. **Usage of Data:**
   - To personalize content and improve user experience.
   - To support AI image search accuracy and validation.
   - We do not sell or rent your data.

3. **Storage and Security:**
   - All data is stored securely in compliance with Indian data protection laws.
   - We use encryption, access control, and regular monitoring to protect data.

4. **Third-Party Services:**
   - We may use analytics tools or storage providers that comply with security regulations.
   - No third-party has access to your personal data unless legally required.

5. **User Rights:**
   - You may request data deletion or correction via dprcgh@gmail.com.
   - By using this platform, you consent to this policy.

For questions, contact: dprcgh@gmail.com
  `,
},

"hyperlink-policy": {
  title: "Hyperlink Policy",
  content: `
Links to external websites and platforms are provided for user convenience on nbdigital.online.

1. **External Link Disclaimer:**
   - We do not control or guarantee the accuracy, relevance, or security of third-party sites linked on our platform.
   - Clicking such links will take you outside our domain.

2. **Linking to Our Website:**
   - Other websites may link to our homepage or specific public pages.
   - Linking should not misrepresent our endorsement or mislead users.

3. **No Prior Permission Required:**
   - No prior permission is required for linking to public information hosted on nbdigital.online.
   - However, for use of content (logos, text, or graphics), formal permission must be obtained.

4. **Removal of Unintended Links:**
   - If you find any inappropriate links, report them to dprcgh@gmail.com.

This policy may be updated without prior notice.
  `,
},

  };

  const pageContent = isHindi ? contentHindi[params.slug] : content[params.slug];

  

  if (!pageContent) {
    return (
      <main className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-4 text-black">Page Not Found</h1>
        <p className="text-gray-600">Sorry, the page you're looking for does not exist.</p>
      </main>
    );
  }

  

  return (
   <div className="bg-[#170645] text-white min-h-screen flex flex-col">
     {/* Navbar */}
     <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 sm:px-6 py-2 bg-[#170645] shadow-md">
       {/* Left: Logo */}
                    <div className="flex items-center">
                    <Link href="/" className="flex items-center">
  <Image
    src="/Group 833.png"
    alt="Logo"
    width={71}
    height={71}
    className="rounded-full cursor-pointer"
  />
</Link>
                    </div>
      
      
      
                    {/* Hamburger Icon on Mobile */}
                    <div className=" flex items-center space-x-3 sm:hidden relative z-50">
                      
                      <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="text-white focus:outline-none"
                      >
                        <svg
                          className="w-8 h-8"
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
                        className="bg-white text-[#170645] px-4 h-[45px] rounded-full text-md"
                        onClick={() => setIsHindi(!isHindi)}
                      >
                        A<sub>अ</sub> {isHindi ? 'Eng' : 'Hindi'}
                      </button>
      
                      <div className="bg-white text-[#170645] px-4 h-[45px] rounded-full text-md flex space-x-2">
                        <button onClick={() => setFontSize((prev) => Math.min(prev + 2, 24))}>A+</button>
                        <button onClick={() => setFontSize((prev) => Math.max(prev - 2, 12))}>A-</button>
                      </div>
                    </div>
                    {menuOpen && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-30"
                onClick={() => setMenuOpen(false)}
              ></div>
            )}

            {/* Mobile Dropdown Menu (positioned below nav) */}
            {menuOpen && (
              <div className="fixed top-20 right-0 w-[30vw] px-4 py-4 flex flex-col items-end space-y-3  z-40">
                {/* Language Toggle */}
                <button
                  className="bg-white text-[#170645] w-full max-w-[260px] py-2 rounded-full text-sm font-medium"
                  onClick={() => setIsHindi(!isHindi)}
                >
                  A<sub className="text-xs">अ</sub> {isHindi ? 'Eng' : 'Hindi'}
                </button>

                {/* Font Size Controls */}
                <div className="bg-white text-[#170645] w-full max-w-[260px] py-2 rounded-full text-sm font-medium flex justify-around">
                  <button onClick={() => setFontSize((prev) => Math.min(prev + 2, 24))}>A+</button>
                  <button onClick={() => setFontSize((prev) => Math.max(prev - 2, 12))}>A-</button>
                </div>

               
              </div>
            )}
                  </nav>

     {/* Page Content */}
     <main className="flex-grow pt-24 max-w-5xl mx-auto py-16 px-6 md:px-12 bg-white text-black">

       {pageContent ? (
         <>
           <h1 className="text-4xl font-bold mt-10 mb-8">{pageContent.title}</h1>
           <div
  className="whitespace-pre-line leading-relaxed"
  style={{ fontSize: `${fontSize}px` }}
>
           {renderBoldContent(pageContent.content)}
           </div>
         </>
       ) : (
         <>
           <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
           <p className="text-gray-600">Sorry, the page you're looking for does not exist.</p>
         </>
       )}
     </main>

     {/* Footer */}
     <footer className="bg-gray-200 text-black py-8">

       <div className="max-w-[1621px] mx-auto px-6 md:px-16">

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
   </div>
 );
}
