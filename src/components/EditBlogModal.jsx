/* eslint-disable no-unused-vars */
import { useState, useRef } from "react";
import { FaTimes } from "react-icons/fa";

// Cloudinary config (reuse what you use in AddBlog)
const UPLOAD_PRESET = "billerCompany"; // <--- Change this if needed
const CLOUD_NAME = "dlgn5wzsl";

const EditBlogModal = ({ blog, onClose, onSave }) => {
  const [form, setForm] = useState({
    ...blog,
    tags: Array.isArray(blog.tags)
      ? blog.tags
      : (blog.tags || "").split(",").map((t) => t.trim()),
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(
    blog.coverImage
      ? blog.coverImage.startsWith("/uploads")
        ? `https://biller-backend-xdxp.onrender.com${blog.coverImage}`
        : blog.coverImage
      : null
  );
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  // Handle text field changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // For tags (special, as array)
  const handleTagsChange = (e) => {
    setForm({
      ...form,
      tags: e.target.value.split(",").map((tag) => tag.trim()),
    });
  };

  // Handle image file picker
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };
  const handleUploadClick = () => {
    if (fileRef.current) fileRef.current.click();
  };

  // Uploads file to Cloudinary, returns the secure_url
  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: data }
      );
      const uploadRes = await res.json();
      return uploadRes.secure_url || "";
    } catch (err) {
      return "";
    }
  };

  // On submit, upload image if changed; pass only the URL to onSave
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let coverImageUrl = form.coverImage;
    if (image) {
      coverImageUrl = await uploadToCloudinary(image);
      if (!coverImageUrl) {
        alert("Failed to upload cover image.");
        setLoading(false);
        return;
      }
    }

    const updatedData = {
      ...form,
      coverImage: coverImageUrl,
      tags:
        typeof form.tags === "string"
          ? form.tags.split(",").map((t) => t.trim())
          : form.tags,
    };

    await onSave(blog._id, updatedData);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white rounded-xl shadow-xl max-w-3xl w-full p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-[#1d8599]"
          aria-label="Close"
        >
          <FaTimes size={24} />
        </button>

        <h2 className="text-2xl font-bold text-[#1d8599] mb-6">
          Edit Blog Post
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image upload and preview */}
          <div className="flex items-center gap-6">
            <div
              className="w-32 h-32 bg-slate-100 rounded-lg border-2 border-dashed border-[#bee2ec] cursor-pointer flex items-center justify-center relative overflow-hidden"
              onClick={handleUploadClick}
              title="Click to change cover image"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Cover Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl text-blue-300">+</span>
              )}
              {/* Hidden file input */}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileRef}
                onChange={handleImage}
                disabled={loading}
              />
            </div>
            <div className="text-blue-900 font-medium">
              Click box to upload/change cover image
            </div>
          </div>

          <input
            type="text"
            name="title"
            value={form.title || ""}
            onChange={handleChange}
            placeholder="Title"
            className="w-full border rounded px-3 py-2"
            required
          />

          <input
            type="text"
            name="slug"
            value={form.slug || ""}
            onChange={handleChange}
            placeholder="Slug"
            className="w-full border rounded px-3 py-2"
            required
          />

          <textarea
            name="content"
            value={form.content || ""}
            onChange={handleChange}
            placeholder="Content"
            className="w-full border rounded px-3 py-2 resize-none"
            rows={6}
            required
          />

          <input
            type="text"
            name="tags"
            value={
              Array.isArray(form.tags) ? form.tags.join(", ") : form.tags || ""
            }
            onChange={handleTagsChange}
            placeholder="Tags (comma separated)"
            className="w-full border rounded px-3 py-2"
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded bg-[#1d8599] text-white hover:bg-[#116279]"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlogModal;
