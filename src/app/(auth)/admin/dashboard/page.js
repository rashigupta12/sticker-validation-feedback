"use client";
import { useEffect, useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [languages, setLanguages] = useState([]);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [newLanguage, setNewLanguage] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/auth/admin/fetch-user");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteLanguage = (lang) => {
    const updatedLanguages = languages.filter((language) => language !== lang);
    setLanguages(updatedLanguages);
    updateUserLanguages([lang], "delete");
  };

  const handleAddLanguage = () => {
    const newLang = newLanguage.trim().toLowerCase();
    if (newLang && !languages.includes(newLang)) {
      setLanguages((prevLanguages) => [...prevLanguages, newLang]);
      updateUserLanguages([newLang], "add");
    }
    setNewLanguage("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && newLanguage.trim()) {
      handleAddLanguage();
    }
  };

  const updateUserLanguages = async (langs, action) => {
    try {
      const response = await fetch("/api/auth/admin/update-user-language", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: selectedUserId,
          languages: langs,
          action,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === selectedUserId
              ? {
                  ...user,
                  languages:
                    action === "delete"
                      ? languages.filter((lang) => !langs.includes(lang))
                      : [...languages, ...langs],
                }
              : user
          )
        );
        setMessage(`Languages updated successfully`);
      } else {
        setMessage(data.message || "Failed to update languages");
      }
    } catch (error) {
      setMessage("Failed to update languages");
      console.error("Error updating languages:", error);
    }
  };

  const handleUserDelete = async (userId) => {
    try {
      const response = await fetch("/api/auth/admin/delete-user", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      if (response.ok) {
        setUsers(users.filter((user) => user._id !== userId));
        setMessage(data.message);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Failed to delete user");
    }
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setUserToDelete(null);
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      handleUserDelete(userToDelete._id);
      closeDeleteModal();
    }
  };

  const startManagingLanguages = (user) => {
    setSelectedUserId(user._id);
    setLanguages(user.languages || []);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-900 dark:text-gray-100">
        Admin Dashboard
      </h1>

      <div className="overflow-x-auto bg-gray-50 dark:bg-gray-900 rounded-lg shadow-lg p-6">
        <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg">
          <thead className="bg-gradient-to-r from-gray-500 to-gray-500 text-white">
            <tr>
              <th className="py-3 px-6 border-b">Name</th>
              <th className="py-3 px-6 border-b">Email</th>
              <th className="py-3 px-6 border-b">Languages</th>
              <th className="py-3 px-6 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="hover:bg-inherit dark:hover:bg-inherit transition duration-200"
              >
                <td className="py-4 px-6 border-b text-gray-800 dark:text-gray-200">
                  {user.name}
                </td>
                <td className="py-4 px-6 border-b text-gray-800 dark:text-gray-200">
                  {user.email}
                </td>
                <td className="py-4 px-6 border-b">
                  {selectedUserId === user._id ? (
                    <div className="flex flex-col">
                      {languages.map((lang, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 mb-2"
                        >
                          <span className="bg-blue-100 text-black px-2 py-1  text-sm font-semibold">
                            {lang}
                          </span>
                          <button
                            onClick={() => handleDeleteLanguage(lang)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={newLanguage}
                          onChange={(e) => setNewLanguage(e.target.value)}
                          placeholder="Add new language"
                          className="px-3 py-2 border rounded-md w-full mb-2 bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                        <button
                          onClick={handleAddLanguage}
                          className="px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                        >
                          Add
                        </button>
                      </div>
                      <button
                        onClick={() => setSelectedUserId("")}
                        className="mt-2 px-4 py-2 bg-green-400 text-white rounded-lg hover:bg-green-600 transition duration-200"
                      >
                        Done
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-700 dark:text-gray-300">
                      {user.languages && user.languages.length > 0
                        ? user.languages.join(", ")
                        : "No languages assigned"}
                    </span>
                  )}
                </td>
                <td className="py-4 px-6 border-b">
                  <div className="flex space-x-2">
                    {selectedUserId !== user._id && (
                      <button
                        onClick={() => startManagingLanguages(user)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => openDeleteModal(user)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {message && (
        <p className="mt-4 text-center text-green-600 dark:text-green-400">
          {message}
        </p>
      )}

      {isModalOpen && (
       <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
       <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">
         <div className="flex justify-center mb-2">
           <FaExclamationTriangle className="text-red-500 text-5xl animate-pulse" />
         </div>
         <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 text-center">
           Confirm Delete
         </h2>
         <p className="text-gray-700 dark:text-gray-300 text-center">
           Are you sure you want to delete this account?
         </p>
         <div className="flex justify-center space-x-4">
           <button
             onClick={closeDeleteModal}
             className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-200"
           >
             Cancel
           </button>
           <button
             onClick={confirmDelete}
             className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
           >
             Delete
           </button>
         </div>
       </div>
     </div>
     
      )}
    </div>
  );
};

export default AdminDashboard;
