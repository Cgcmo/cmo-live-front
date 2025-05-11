

"use client";

import React, { useState, useEffect } from "react";
import Switch from "./Switch"; // Import your custom switch
import "./ToggleSwitch.css"; // Ensure styles are applied
import API_URL from '@/app/api';
import Loader from "./Loader";

export default function UsersTable({fetchAllStats}) {
  const [editIndex, setEditIndex] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [filter, setFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    district: "",
  }); 
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const [showLoader, setShowLoader] = useState(false);

const showLoadingScreen = () => {
  setShowLoader(true);
  const minTime = new Promise(resolve => setTimeout(resolve, 1000));
  const maxTime = new Promise(resolve => setTimeout(resolve, 10000));
  return Promise.race([minTime, maxTime]);
};

// inside useEffect or any fetch function:
useEffect(() => {
  const fetchData = async () => {
    await showLoadingScreen();
    await fetchUsers();   // Call fetchUsers after loading screen
    setShowLoader(false); // Hide loader
  };
  fetchData();
}, [currentPage]); // 🛠️ Now add [currentPage] dependency



  const toggleStatus = async (id, currentStatus) => {
    try {
      const response = await fetch(`${API_URL}/update-user/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: !currentStatus }),
      });
  
      if (response.ok) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === id ? { ...user, status: !currentStatus } : user
          )
        );
      } else {
        console.error("Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
  

  // const handleEdit = (index, user) => {
  //   setEditIndex(index);
  //   setEditedUser({ ...user });
  // };

  const handleInputChange = (e, field) => {
    setEditedUser({ ...editedUser, [field]: e.target.value });
  };

  // const handleSave = (index) => {
  //   users[index] = { ...editedUser };
  //   setEditIndex(null);
  // };

  const handleCancel = () => {
    setEditIndex(null);
  };


  const filteredUsers = users.filter(user => {
    if (filter === "All") return true;
    if (filter === "Admin") return user.role === "Admin";
    if (filter === "User") return user.role === "User";
    if (filter === "Limited Access") return !user.status;
    return true;
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  useEffect(() => {
    fetchUsers();
  }, []);

  
  // Fetch Users from Backend
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/users`);
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewStaff((prevStaff) => ({
      ...prevStaff,
      [name]: value,
    }));
  };

  const handleEdit = (index, user) => {
    setEditIndex(index);
    setEditedUser({ ...user });
  };

  // Handle Input Change in Editable Fields
  const handleEditChange = (e, field) => {
    setEditedUser((prevUser) => ({
      ...prevUser,
      [field]: e.target.value,
    }));
  };

  // ✅ Save Edited Data to Backend
  const handleSave = async (index) => {
    const { name, email, mobile, password, district } = editedUser;

  // ✅ 1. Check if all fields are filled
  if (!name || !email || !mobile || !district) {
    alert("All fields are required.");
    return;
  }

  // ✅ 2. Validate Mobile Number (10 digits, numbers only)
  const mobileRegex = /^\d{10}$/;
  if (!mobileRegex.test(mobile)) {
    alert("Mobile number must be exactly 10 digits and contain only numbers.");
    return;
  }

  // ✅ 3. Validate Email Format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    alert("Invalid email format. Please enter a valid email address.");
    return;
  }

  // ✅ 4. Validate Password (Only if it's being edited)
  if (password && password.length > 0) {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      alert(
        "Password must be at least 8 characters long, and include at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }
  }
    try {
      const response = await fetch(`${API_URL}/update-user/${editedUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedUser),
      });

      if (response.ok) {
        const updatedUsers = [...users];
        updatedUsers[index] = { ...editedUser };
        setUsers(updatedUsers);
        setEditIndex(null);
      } else {
        console.error("Failed to update user.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Submit Form to Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, mobile, password, district } = newStaff;

    // ✅ 1. Check if all fields are filled
    if (!name || !email || !mobile || !password || !district) {
      alert("All fields are required.");
      return;
    }
  
    // ✅ 2. Validate Mobile Number (10 digits, numbers only)
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobile)) {
      alert("Mobile number must be exactly 10 digits and contain only numbers.");
      return;
    }
  
    // ✅ 3. Validate Password
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
    if (!passwordRegex.test(password)) {
      alert(
        "Password must be at least 8 characters long, and include at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }
    try {
      const response = await fetch(`${API_URL}/add-staff`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStaff),
      });

      if (response.ok) {
        fetchUsers();
        fetchAllStats(); // Refresh user table
        setIsModalOpen(false);
        setNewStaff({ name: "", email: "", mobile: "", password: "", district: "" });
      } else {
        console.error("Failed to add staff");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="mt-4 overflow-x-auto">
      <div className="flex flex-col sm:flex-row justify-end items-center gap-4 mb-4 w-full sm:w-auto">
        {/* Filter Dropdown */}
        <div className="relative">
          <select
            className="border text-center border-gray-400 text-md rounded-full py-2 text-gray-700  w-full sm:w-auto"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ textAlign: "center", textAlignLast: "center" }}
          >
            <option value="All" style={{ textAlign: "center", textAlignLast: "center" }}>All</option>
            <option value="User" style={{ textAlign: "center", textAlignLast: "center" }} >User</option>
            <option value="Admin" style={{ textAlign: "center", textAlignLast: "center" }}>Admin</option>
            <option value="Limited Access" style={{ textAlign: "center", textAlignLast: "center" }}>Limited Access</option>
          </select>
        </div>
        {/* Add Staff Button */}
        <button className="bg-[#170645] text-md font text-yellow-400 px-[35px] py-2 rounded-full shadow-xxl w-full sm:w-auto" onClick={() => setIsModalOpen(true)} >
          Add Staff
        </button>
      </div>

      <table className="w-full border-collapse">
      <thead>
  <tr className="bg-[#D9D9D9] text-center text-[#170645] font-normal">
    <th className="p-2 border">No.</th>
    <th className="p-2 border">Full Name</th>
    <th className="p-2 border">Role</th>
    <th className="p-2 border">District</th>
    <th className="p-2 border">Mobile No.</th>
    <th className="p-2 border">Email Id</th>
    <th className="p-2 border">Action</th>
    <th className="p-2 border">Status</th>
  </tr>
</thead>

        <tbody>
          {filteredUsers.length > 0 ? (
           filteredUsers
           .slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage)
           .map((user, index) => (         
            <tr key={user._id || user.id || index} className="text-[#170645] text-center border-b">

                <td className="p-2">{index + 1}</td>
                <td className="p-2">{editIndex === index ? <input type="text" value={editedUser.name} onChange={(e) => handleInputChange(e, "name")} className="p-1 border border-gray-300 rounded w-full" /> : user.name}</td>
                <td className="p-2">{editIndex === index ? <input type="text" value={editedUser.role} onChange={(e) => handleInputChange(e, "role")} className="p-1 border border-gray-300 rounded w-full" /> : user.role}</td>
                <td className="p-2">{editIndex === index ? <input type="text" value={editedUser.district} onChange={(e) => handleInputChange(e, "district")} className="p-1 border border-gray-300 rounded w-full" /> : user.district}</td>
                <td className="p-2">{editIndex === index ? <input type="text" value={editedUser.mobile} onChange={(e) => handleInputChange(e, "mobile")} className="p-1 border border-gray-300 rounded w-full" /> : user.mobile}</td>
                <td className="p-2 max-w-[150px] truncate">{editIndex === index ? <input type="text" value={editedUser.email} onChange={(e) => handleInputChange(e, "email")} className="p-1 border border-gray-300 rounded w-full" /> : user.email}</td>
                <td className="p-2 flex justify-center items-center gap-2">{editIndex === index ? (<><button className="text-green-600 font-semibold" onClick={() => handleSave(index)}>Save</button><button className="text-red-600 font-semibold" onClick={handleCancel}>Cancel</button></>) : (<button className="flex items-center text-blue-600" onClick={() => handleEdit(index, user)}><img src="/edit-icon.png" alt="Edit" className="w-4 h-4 mr-1" />Edit</button>)}</td>
                <td className="p-2 text-center"><Switch checked={user.status} onChange={() => toggleStatus(user._id, user.status)} /></td>
              </tr>
              
            ))
            
          ) : (
            <tr>
              <td colSpan="8" className="p-[50px] text-center text-[#170645]">No data found for this filter</td>
            </tr>
          )}


        </tbody>
        
      </table>
              
{totalPages > 1 && (
  <div className="w-full flex justify-center mt-6 mb-4">
    <div className="flex items-center justify-center gap-4">
      {/* Previous Button */}
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className={`px-4 py-2 border rounded-lg bg-[#170645] text-yellow-500 transition-all ${
          currentPage === 1 ? " cursor-not-allowed" : ""
        }`}
      >
        {"<<"}
      </button>

      {/* Page Number */}
      <span className="px-4 py-2 border rounded-lg bg-[#170645] text-yellow-500">
        Page {currentPage} of {totalPages}
      </span>

      {/* Next Button */}
      <button
        onClick={() =>
          setCurrentPage((prev) => Math.min(prev + 1, totalPages))
        }
        disabled={currentPage === totalPages}
        className={`px-4 py-2 border rounded-lg bg-[#170645] text-yellow-500 transition-all ${
          currentPage === totalPages ? " cursor-not-allowed" : ""
        }`}
      >
        {">>"}
      </button>
    </div>
  </div>
)}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative bg-white p-6 rounded-2xl shadow-lg w-[90%] sm:w-[400px]">
            {/* Close Button */}
            <button
              className="absolute rounded-full bg-gray-300 w-[30px] h-[30px] top-4 right-4 text-gray-500 hover:text-black text-lg"
              onClick={() => setIsModalOpen(false)}
            >
              x
            </button>

            {/* Modal Title */}
            <h2 className="text-[27px] font-bold text-center text-[#170645] mb-4">
              Add Staff
            </h2>

            {/* Form Inputs */}
            <form onSubmit= {handleSubmit}>
              <input type="text" name="name" placeholder="Full Name" className="w-full p-3 text-sm border border-gray-400 text-[#170645] placeholder-[#170645] rounded-full mb-3 focus:outline-none" value={newStaff.name} onChange={handleChange} required />
              <input type="email" name="email" placeholder="Email" className="w-full p-3 text-sm border border-gray-400 text-[#170645] placeholder-[#170645] rounded-full mb-3 focus:outline-none" value={newStaff.email} onChange={handleChange} required/>
              <input type="tel"  name="mobile" placeholder="Mobile No." className="w-full text-sm p-3 border border-gray-400 text-[#170645] placeholder-[#170645] rounded-full mb-3 focus:outline-none" value={newStaff.mobile} onChange={handleChange} required maxLength="10" />
              <input type="password" name="password" placeholder="Password" className="w-full p-3 text-sm border-gray-400 text-[#170645] placeholder-[#170645] border rounded-full mb-3 focus:outline-none" value={newStaff.password} onChange={handleChange} required  />
              {/* Dropdowns */}
              <select  name="district" className="w-full p-3 border-gray-400 text-sm  text-[#170645] border rounded-full mb-3 bg-white focus:outline-none" value={newStaff.district} onChange={handleChange} required >
              <option value="">Select District</option>
              <option>Balod</option>
      <option>Baloda Bazar</option>
      <option>Balrampur</option>
      <option>Bastar</option>
      <option>Bemetara</option>
      <option>Bijapur</option>
      <option>Bilaspur</option>
      <option>Dantewada (South Bastar)</option>
      <option>Dhamtari</option>
      <option>Durg</option>
      <option>Gariaband</option>
      <option>Gaurela-Pendra-Marwahi</option>
      <option>Janjgir-Champa</option>
      <option>Jashpur</option>
      <option>Kabirdham (Kawardha)</option>
      <option>Kanker (North Bastar)</option>
      <option>Kondagaon</option>
      <option>Korba</option>
      <option>Koriya</option>
      <option>Mahasamund</option>
      <option>Mungeli</option>
      <option>Narayanpur</option>
      <option>Raigarh</option>
      <option>Raipur</option>
      <option>Rajnandgaon</option>
      <option>Sukma</option>
      <option>Surajpur</option>
      <option>Surguja</option>
              </select>
              {/* <select className="w-full p-3 text-sm text-[#170645] border-gray-400 border rounded-full mb-4 bg-white focus:outline-none">
                <option>Access</option>
              </select> */}
              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#170645] text-yellow-400 font-bold py-3 rounded-full hover:opacity-90"
                
              > Submit
              </button>
            </form>
          </div>
        </div>
      )}
      {showLoader && <Loader />}


    </div>



  );
}
