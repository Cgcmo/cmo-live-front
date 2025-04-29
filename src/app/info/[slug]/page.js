// "use client";

// import { useParams } from "next/navigation";

// export default function InfoPage() {
//   const params = useParams();

//   const content = {
//     "copyright-policy": {
//       title: "Copyright Policy",
//       content: `
// All content, including images, videos, and text hosted on nbdigital.online, is owned exclusively by the Chief Minister's Office (CMO), Chhattisgarh, Government of India.

// 1. **Ownership:**
//    - All photographs, videos, and written content on this website are protected by Indian copyright laws.
//    - Intellectual property rights exclusively belong to CMO Chhattisgarh.

// 2. **Usage Guidelines:**
//    - Users may view, download, and share content strictly for personal and non-commercial purposes.
//    - Reproduction, redistribution, or commercial exploitation of content without written consent from CMO Chhattisgarh is strictly prohibited.

// 3. **Reporting Violations:**
//    - If you believe content on this site is being misused elsewhere, please report it immediately at dprcgh@gmail.com.

// 4. **Legal Action:**
//    - Unauthorized commercial or exploitative use may result in legal action under applicable Indian laws.
//       `,
//     },

//     disclaimer: {
//       title: "Disclaimer",
//       content: `
// The content and services provided by nbdigital.online, an AI-based platform maintained by the Chief Minister's Office, Chhattisgarh, are intended solely for the public's convenience and informational purposes.

// 1. **Accuracy and Reliability:**
//    - While our platform uses advanced FaceNet AI technology for face recognition and retrieval, accuracy cannot always be guaranteed.
//    - If no exact match is found, the system may display broader photo results to help users locate relevant images.

// 2. **Liability Limitation:**
//    - CMO Chhattisgarh does not assume liability for misuse, misinterpretation, or any unintended use of images retrieved from this website.
//    - Users bear full responsibility for how retrieved content is used or shared.

// 3. **User Responsibility:**
//    - Users are encouraged to ethically utilize and protect the privacy and integrity of all images obtained from this platform.

// 4. **Technical Issues:**
//    - While every effort is made to ensure website availability, we do not guarantee uninterrupted service due to maintenance, updates, or technical issues beyond our control.
//       `,
//     },

//     "site-map": {
//       title: "Site Map",
//       content: `
// The following is a comprehensive map of the structure and content of nbdigital.online, designed to help users navigate effectively:

// 1) Admin Panel

// - **Dashboard:** Central admin controls and analytics
//   - All Photos
//   - Banner Tab
//   - Custom Bar Chart
//   - Departments Tab
//   - Districts Tab
//   - Footer Configuration
//   - Gallery Modal
//   - Modal Popup
//   - Navbar Customization
//   - Profile Management
//   - Search Component
//   - Switch Controls
//   - User Management (Users Table)

// - **Column Management:**
//   - Column 1
//   - Column 2
//   - Column 3

// 2) User Views

// - **Albums and Districts:**
//   - Album Photos ("/album/:albumId")
//   - District Photos ("/district/:districtName")

// - **Dashboard:**
//   - Main Dashboard
//   - Search Interface
//   - Upload Photos
//   - Footer Component
//   - Navbar Component
//   - Rolling Date Picker
//   - Upload Photo Modal

// - **Profile Section:**
//   - Profile Main View
//   - All Photos
//   - Custom Bar Chart
//   - Event Cards
//   - Gallery Modal
//   - Modal Popup
//   - Profile Edit
//   - Switch View

// 3) User Authentication and Security

// - Forgot Password
// - Reset Password Form
// - Verification Page
// - Authentication Page

// 4) General and Miscellaneous

// - Home Page
// - Layout and Structure
// - Informational Pages ("/info/:slug")
// - Search Results
// - Search Bar
// - Search Parameter Handling
// - Session Wrapper
// - Embedded Video Player
//       `,
//     },

//     "terms-and-conditions": {
//       title: "Terms and Conditions",
//       content: `
// By accessing or registering on nbdigital.online, users explicitly agree to the following terms and conditions established by the Chief Minister's Office, Chhattisgarh:

// 1. **User Registration:**
//    - Users must provide truthful and accurate information including their name, mobile number, email address, and district.
//    - All personal data is securely stored in compliance with applicable data protection laws.

// 2. **Account Security:**
//    - Users must create strong, confidential passwords that are stored securely in hashed form.
//    - Users must immediately report unauthorized account access or security breaches.

// 3. **Permitted Usage:**
//    - Users may download, share, and copy photo links responsibly and ethically for personal use only.

// 4. **Prohibited Activities:**
//    - Unauthorized distribution, commercial exploitation, or misuse of images and content is strictly forbidden.
//    - Users are prohibited from using this platform in ways that could compromise its functionality or security.

// 5. **Consequences of Violations:**
//    - Violating these terms may result in account suspension or termination, and potential legal action.
//       `,
//     },

//     "terms-of-use": {
//       title: "Terms of Use",
//       content: `
// All users of nbdigital.online agree to adhere to the following conditions to ensure the ethical and secure operation of our AI-based services provided by the Chief Minister's Office, Chhattisgarh:

// 1. **Ethical Usage:**
//    - Users must use the AI facial recognition responsibly to find photos taken at public events with the Chief Minister.
//    - Any inappropriate, malicious, or harmful use of the platform and its content is strictly prohibited.

// 2. **Data Integrity and Privacy:**
//    - Users are expected to maintain the confidentiality of their login credentials.
//    - Any detected compromise must be reported immediately for appropriate measures.

// 3. **Content Interaction:**
//    - Users can interact by downloading and sharing photos or photo links, strictly for non-commercial purposes.
//    - Editing or altering images in a way that compromises authenticity or privacy is prohibited.

// 4. **Legal Compliance:**
//    - Users must comply with all applicable Indian laws regarding data privacy, intellectual property, and cybersecurity.
//    - Misuse, unauthorized sharing, or redistribution of protected content may result in legal proceedings and penalties.
//       `,
//     },
//   };

//   const pageContent = content[params.slug];

//   if (!pageContent) {
//     return (
//       <main className="max-w-4xl mx-auto py-12 px-4">
//         <h1 className="text-3xl font-bold mb-4 text-black">Page Not Found</h1>
//         <p className="text-gray-600">Sorry, the page you're looking for does not exist.</p>
//       </main>
//     );
//   }

//   return (
//     <main className="max-w-5xl mx-auto py-16 px-6 md:px-12">
//       <h1 className="text-4xl font-bold mb-8 text-black">{pageContent.title}</h1>
//       <div className="text-black whitespace-pre-line leading-relaxed text-lg">
//         {pageContent.content}
//       </div>
//     </main>
//   );
// }
