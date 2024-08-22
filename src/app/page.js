"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

const HelloPage = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedSubtitle, setSelectedSubtitle] = useState(null);

  const [titles, setTitles] = useState([]);
  const [filteredTitles, setFilteredTitles] = useState([]);
  const [filteredTags, setFilteredTags] = useState([]);
  const [filteredSubtitles, setFilteredSubtitles] = useState([]);

  const [images, setImages] = useState([]);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [filterStatus, setFilterStatus] = useState("N/A");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/auth/userLanguage");
        if (!response.ok) throw new Error("Failed to fetch user data");
        const data = await response.json();
        setUserData(data);
        if (data.length > 0) setSelectedLanguage(data[0]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchTitles = async () => {
      try {
        const response = await fetch("/api/auth/folders");
        if (!response.ok) throw new Error("Failed to fetch titles");
        const data = await response.json();
        setTitles(data.folders || []);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTitles();
  }, []);

  useEffect(() => {
    if (selectedLanguage && Array.isArray(titles)) {
      const filtered = titles
        .filter((title) => title.includes(selectedLanguage))
        .map((folder) => folder.split("/")[1])
        .filter((value, index, self) => self.indexOf(value) === index);

      setFilteredTitles(filtered);

      const subtitles = titles
        .filter((title) => title.includes(selectedLanguage))
        .map((folder) => folder.split("/")[2])
        .filter((value, index, self) => self.indexOf(value) === index);

      setFilteredSubtitles(subtitles);
    } else {
      setFilteredTitles([]);
      setFilteredSubtitles([]);
    }
  }, [selectedLanguage, titles]);

  useEffect(() => {
    if (selectedLanguage) {
      applyFilters(page, limit);
    }
  }, [
    selectedLanguage,
    selectedTitle,
    selectedTag,
    selectedSubtitle,
    filterStatus,
    page,
    limit,
  ]);

  const handleLanguageChange = (e) => {
    const language = e.target.value;
    setSelectedLanguage(language);
    setSelectedTitle(null);
    setSelectedTag(null);
    setSelectedSubtitle(null);
  };

  const handleTitleChange = (e) => {
    setSelectedTitle(e.target.value);
  };

  const handleFilterStatusChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const handleSubtitleChange = (e) => {
    setSelectedSubtitle(e.target.value);
  };

  const handleStatusChange = (uuid, newStatus) => {
    // Ensure the new status is neither 'Pass' nor 'Discard' if the current status is one of those
    const newStatusValue =
      newStatus === "Pass"
        ? "Pass"
        : newStatus === "Discard"
        ? "Discard"
        : "N/A";

    // Update the image status
    handleChange(uuid, "status", newStatusValue);
  };

  const applyFilters = async (page = 1, limit = 10) => {
    const params = new URLSearchParams();

    if (selectedLanguage) params.append("language", selectedLanguage);
    if (selectedTitle) params.append("title", selectedTitle);
    if (selectedTag) params.append("tag", selectedTag);
    if (selectedSubtitle) params.append("subtitle", selectedSubtitle);
    if (filterStatus === "Yes") params.append("pass", true);
    if (filterStatus === "No") params.append("discard", true);
    if (filterStatus === "N/A") params.append("unchecked", "true");

    params.append("page", page);
    params.append("limit", limit);

    try {
      const url = `/api/auth/images?${params.toString()}`;
      const response = await fetch(url);

      if (!response.ok) throw new Error("Failed to fetch images");

      const { data, pagination } = await response.json();

      // Filter out rows based on dropdown selection if 'N/A' is chosen
      const filteredData =
        filterStatus === "N/A"
          ? data.filter((image) => !image.pass && !image.discard)
          : data;
      setImages(filteredData);
      setPagination(pagination);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    applyFilters(newPage, limit);
  };

  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value, 10);
    setLimit(newLimit);
    applyFilters(page, newLimit);
  };

  const handleNoLanguage = () => {
    const email = "dataprotection@bobble.ai";
    const subject = "Assigning Language Request";
    const body = `Hello Bobble, please assign a language for sticker validation \n\nThank you.\n`;
    const emailUrl = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    const openMailClient = (url) => {
      const newWindow = window.open(url, "_blank");
      if (
        !newWindow ||
        newWindow.closed ||
        typeof newWindow.closed === "undefined"
      ) {
        window.location.href = emailUrl;
      }
    };

    if (
      navigator.userAgent.includes("Android") ||
      navigator.userAgent.includes("iPhone")
    ) {
      window.location.href = emailUrl;
    } else if (
      navigator.userAgent.includes("Windows") ||
      navigator.userAgent.includes("Macintosh")
    ) {
      if (
        navigator.userAgent.includes("Gmail") ||
        navigator.userAgent.includes("Chrome")
      ) {
        openMailClient(
          `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
            email
          )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
        );
      } else if (
        navigator.userAgent.includes("Outlook") ||
        navigator.userAgent.includes("Office")
      ) {
        openMailClient(
          `https://outlook.live.com/owa/?path=/mail/action/compose&to=${encodeURIComponent(
            email
          )}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
            body
          )}`
        );
      } else if (navigator.userAgent.includes("Yahoo")) {
        openMailClient(
          `https://compose.mail.yahoo.com/?to=${encodeURIComponent(
            email
          )}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
            body
          )}`
        );
      } else {
        window.location.href = emailUrl;
      }
    } else {
      window.location.href = emailUrl;
    }

  };

  const extractTag = (folder) => folder.split("/").slice(-3, -2)[0] || "";

  const handleChange = async (uuid, field, value) => {
    const updatedData = images.map((image) => {
      if (image.uuid === uuid) {
        let updatedFields = { [field]: value };

        if (field === "status") {
          updatedFields = {
            pass: value === "Pass",
            discard: value === "Discard",
          };
        }

        return { ...image, ...updatedFields };
      }
      return image;
    });

    setImages(updatedData);

    try {
      const response = await fetch(`/api/auth/images/${uuid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...updatedData.find((img) => img.uuid === uuid),
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update sticker");
      }
      const updatedSticker = await response.json();
      console.log("Sticker updated:", updatedSticker);
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  if (userData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-800 mb-4">
            No Language Assigned
          </p>
          <p className="text-lg text-gray-600 mb-8">
            Please contact the administrator to have a language assigned to your
            account.
          </p>
          <button
            onClick={handleNoLanguage}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300"
          >
            Contact Admin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center space-x-4 mb-4">
          <select
            className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-indigo-400"
            onChange={handleLanguageChange}
            value={selectedLanguage || ""}
            aria-label="Select Project"
          >
            <option value="" disabled>
              Select a Project
            </option>
            {userData.map((language, index) => (
              <option key={index} value={language}>
                {language}
              </option>
            ))}
          </select>

          <select
            className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-indigo-400"
            onChange={handleTitleChange}
            value={selectedTitle || ""}
            aria-label="Select Tag"
          >
            <option value="">Select a Tag</option>
            {filteredTitles.map((title, index) => (
              <option key={index} value={title}>
                {title}
              </option>
            ))}
          </select>

          <select
            className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-indigo-400"
            onChange={handleSubtitleChange}
            value={selectedSubtitle || ""}
            aria-label="Select Age/Gender"
          >
            <option value="">Select a Age/Gender</option>
            {filteredSubtitles.map((subtitle, index) => (
              <option key={index} value={subtitle}>
                {subtitle}
              </option>
            ))}
          </select>

          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center">
              <span className="ml-2 text-gray-800 dark:text-gray-100">
                Filter Status
              </span>
              <select
                className="ml-2 p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-indigo-400"
                onChange={handleFilterStatusChange}
                value={filterStatus}
                aria-label="Filter Status"
              >
                <option value="N/A">N/A</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </label>

            <label className="text-gray-800 dark:text-gray-100">
              Results per page:
              <select
                className="ml-2 p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-indigo-400"
                onChange={handleLimitChange}
                value={limit}
                aria-label="Results per page"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </label>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="p-3 text-center text-gray-600 dark:text-gray-300 font-semibold">
                  Image
                </th>
                <th className="p-3 text-center text-gray-600 dark:text-gray-300 font-semibold">
                  Tag
                </th>
                <th className="p-3 text-center text-gray-600 dark:text-gray-300 font-semibold">
                  Political
                </th>
                <th className="p-3 text-center text-gray-600 dark:text-gray-300 font-semibold">
                  Cultural
                </th>
                <th className="p-3 text-center text-gray-600 dark:text-gray-300 font-semibold">
                  Linguistic
                </th>
                <th className="p-3 text-center text-gray-600 dark:text-gray-300 font-semibold">
                  Demographics
                </th>
                <th className="p-3 text-center text-gray-600 dark:text-gray-300 font-semibold">
                  Status
                </th>
                <th className="p-3 text-center text-gray-600 dark:text-gray-300 font-semibold">
                  Comment
                </th>
              </tr>
            </thead>
            <tbody>
              {images.map((image) => (
                <tr
                  key={image.uuid}
                  className={`border-b border-gray-200 dark:border-gray-700 ${
                    image.pass
                      ? "bg-green-100 dark:bg-green-800"
                      : image.discard
                      ? "bg-red-100 dark:bg-red-800"
                      : ""
                  }`}
                >
                  <td className="p-3">
                    <Image
                      src={image.publicUrl}
                      alt={image.filename}
                      width={100}
                      height={100}
                      className="object-cover rounded-md border border-gray-300 dark:border-gray-700"
                    />
                  </td>
                  <td className="p-3 text-center">
                    {extractTag(image.folder)}
                  </td>

                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={image.political}
                      onChange={() =>
                        handleChange(image.uuid, "political", !image.political)
                      }
                      className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                      aria-label="Political"
                    />
                  </td>
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={image.cultural}
                      onChange={() =>
                        handleChange(image.uuid, "cultural", !image.cultural)
                      }
                      className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                      aria-label="Cultural"
                    />
                  </td>
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={image.linguistic}
                      onChange={() =>
                        handleChange(
                          image.uuid,
                          "linguistic",
                          !image.linguistic
                        )
                      }
                      className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                      aria-label="Linguistic"
                    />
                  </td>
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={image.demographics}
                      onChange={() =>
                        handleChange(
                          image.uuid,
                          "demographics",
                          !image.demographics
                        )
                      }
                      className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                      aria-label="Demographics"
                    />
                  </td>

                  <td className="p-3 text-center">
                    <select
                      className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-indigo-400"
                      value={
                        image.pass ? "Pass" : image.discard ? "Discard" : "N/A"
                      }
                      onChange={(e) =>
                        handleStatusChange(image.uuid, e.target.value)
                      }
                    >
                      <option value="N/A">N/A</option>
                      <option value="Pass">Yes</option>
                      <option value="Discard">No</option>
                    </select>
                  </td>
                  <td className="p-3 text-center">
                    <textarea
                      value={image.comment || ""}
                      onChange={(e) =>
                        handleChange(image.uuid, "comment", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                      placeholder="Enter your comment here..."
                      aria-label="Comment"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pagination && (
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg shadow-md hover:bg-gray-400 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-700 dark:text-gray-300">
              Page {page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= pagination.totalPages}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg shadow-md hover:bg-gray-400 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
      <div className="">
        <label className="text-gray-800 dark:text-gray-100">
          Results per page:
        </label>
        <select
          className="ml-5 p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-indigo-400"
          onChange={handleLimitChange}
          value={limit}
          aria-label="Results per page"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
    </div>
  );
};

export default HelloPage;
