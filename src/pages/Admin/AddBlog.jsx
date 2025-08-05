/* eslint-disable no-unused-vars */
import React, { useState, useContext, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import AdminSidebar from "../../components/AdminSidebar";
import { toast } from "react-toastify";

// Cloudinary credentials
const UPLOAD_PRESET = "billerCompany"; // Your unsigned preset, must exist on Cloudinary!
const CLOUD_NAME = "dlgn5wzsl";

const AddBlog = () => {
  const { user } = useContext(AuthContext);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    coverImage: "",
    tags: "",
  });
  const [loading, setLoading] = useState(false);

  // Ref for hidden file input
  const fileInputRef = useRef(null);

  if (!user || !user.isAdmin)
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-lg font-semibold text-red-500">
        Only admin can access this page.
      </div>
    );

  // Trigger file input click
  const handleFileClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  // Handle file selection and upload

  // Uploads file to Cloudinary and sets coverImage URL in state
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);
    data.append("cloud_name", CLOUD_NAME);

    try {
      setLoading(true);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );
      const uploadRes = await res.json();
      if (!uploadRes.secure_url) throw new Error();
      setForm((prev) => ({ ...prev, coverImage: uploadRes.secure_url }));
      toast.success("Image uploaded successfully!");
    } catch (err) {
      toast.error("Image upload failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://biller-backend-xdxp.onrender.com/api/blogs",
        {
          ...form,
          tags: form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Blog added!");
      setForm({ title: "", slug: "", content: "", coverImage: "", tags: "" });
    } catch (err) {
      toast.error("Failed to add blog");
    }
    setLoading(false);
  };

  return (
    <div className="w-full flex">
      <AdminSidebar />
      <div className="flex flex-1 justify-center items-center min-h-[80vh] bg-[#f7fdff]">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-2xl rounded-2xl px-8 py-5 my-16 w-full max-w-2xl space-y-6"
        >
          <h2 className="text-2xl font-bold text-[#1d8599] text-center mb-2">
            Add New Blog Post
          </h2>
          {/* Image upload */}
          <div className="flex flex-col items-center">
            <div
              className="w-32 h-32 bg-slate-100 rounded-lg border-2 border-dashed border-[#8fdbe7] cursor-pointer flex items-center justify-center hover:bg-[#f0fbff] transition"
              onClick={handleFileClick}
              title="Click to select image"
            >
              {form.coverImage ? (
                <img
                  src={
                    form.coverImage.startsWith("/uploads")
                      ? `https://biller-backend-xdxp.onrender.com${form.coverImage}`
                      : form.coverImage
                  }
                  alt="preview"
                  className="object-cover w-full h-full rounded-lg"
                />
              ) : (
                <span className="text-[#a7d4de] text-3xl">+</span>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
                disabled={loading}
              />
            </div>
            <span className="text-xs text-[#1d8599] mt-1">
              Click the box to select a cover image
            </span>
          </div>

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full border border-[#c3ecff] px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#1d8599]"
            required
          />
          <input
            name="slug"
            value={form.slug}
            onChange={handleChange}
            placeholder="Slug (optional, auto from title)"
            className="w-full border border-[#e7e8e7] px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#1d8599]"
          />
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="Content"
            className="w-full border border-[#c3ecff] px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#1d8599] resize-none"
            rows={6}
            required
          />
          <input
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="Tags (comma separated)"
            className="w-full border border-[#c3ecff] px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#1d8599]"
          />
          <button
            disabled={loading}
            className={`w-full py-2 rounded font-semibold text-white bg-[#1d8599] hover:bg-[#116279] transition
              ${loading ? "opacity-60 cursor-not-allowed" : ""}
            `}
          >
            {loading ? "Adding..." : "Add Blog"}
          </button>
          {msg && (
            <div className="text-center text-sm mt-2 text-[#24ba5b]">{msg}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddBlog;
