/* eslint-disable no-unused-vars */
import { useState, useRef } from "react";
import { FaTimes } from "react-icons/fa";

const TYPE_OPTIONS = [
  "Bottle",
  "Can",
  "Purifier",
  "Accessory",
  "Dispenser",
  "Other",
];
const BRAND_OPTIONS = [
  "Bisleri",
  "Aquafina",
  "Kinley",
  "Self Brand",
  "PureIt",
  "Aquaguard",
  "Other",
];
const SIZE_OPTIONS = ["250ml", "500ml", "1L", "2L", "20L", "750ml", "Custom"];
const BACKEND = "https://biller-backend-xdxp.onrender.com";

// ======== SETUP ===========
// Set your Cloudinary upload_preset and cloud_name here!
const UPLOAD_PRESET = "billerCompany"; // <<< CHANGE THIS!
const CLOUD_NAME = "dlgn5wzsl"; // <<< Already set for your Cloudinary

const EditProductModal = ({ product, onClose, onSave }) => {
  const [form, setForm] = useState({
    ...product,
    deliveryCharge: product.deliveryCharge ?? 0,
  });
  const [image, setImage] = useState(null); // Holds File object if user selects new one
  const [preview, setPreview] = useState(
    form.image?.startsWith("/uploads") ? BACKEND + form.image : form.image
  );
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    // For deliveryCharge, store as float
    if (name === "deliveryCharge") {
      setForm({ ...form, [name]: parseFloat(value) || 0 });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : "");
  };
  const handleUploadClick = () => fileRef.current?.click();

  // Uploads image to Cloudinary and returns URL, or empty string on fail
  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);
    data.append("cloud_name", CLOUD_NAME);
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );
      const uploadRes = await res.json();
      return uploadRes.secure_url || "";
    } catch (err) {
      return "";
    }
  };

  // Handles update submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let imageUrl = form.image;

    if (image) {
      // New image selected — upload to Cloudinary
      imageUrl = await uploadToCloudinary(image);
      if (!imageUrl) {
        alert("Failed to upload image");
        setLoading(false);
        return;
      }
    }

    // Compose the updated product object
    const updateData = {
      ...form,
      image: imageUrl,
    };

    await onSave(product._id, updateData);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-2xl text-gray-500 hover:text-[#1d8599]"
          aria-label="Close"
        >
          <FaTimes />
        </button>
        <h2 className="text-xl font-bold mb-5 text-[#1d8599]">Edit Product</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex gap-4 items-center">
            <div
              className="w-28 h-28 rounded-md bg-slate-100 border-2 border-dashed border-[#bee6ee] flex items-center justify-center cursor-pointer"
              onClick={handleUploadClick}
            >
              {preview ? (
                <img
                  src={preview}
                  className="w-full h-full object-cover rounded"
                  alt="preview"
                />
              ) : (
                <span className="text-[#a7d4de] text-3xl">+</span>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileRef}
                onChange={handleImage}
              />
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="border rounded px-3 py-2"
                placeholder="Title"
                required
              />
              <input
                name="slug"
                value={form.slug}
                onChange={handleChange}
                className="border rounded px-3 py-2"
                placeholder="Slug"
                required
              />
              <select
                name="brand"
                value={form.brand}
                onChange={handleChange}
                className="border rounded px-3 py-2"
                required
              >
                <option value="">Brand</option>
                {BRAND_OPTIONS.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="border rounded px-3 py-2"
                required
              >
                <option value="">Type</option>
                {TYPE_OPTIONS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              <select
                name="size"
                value={form.size}
                onChange={handleChange}
                className="border rounded px-3 py-2"
                required
              >
                <option value="">Size</option>
                {SIZE_OPTIONS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <input
                type="number"
                min="0"
                step="0.01"
                name="deliveryCharge"
                value={form.deliveryCharge}
                onChange={handleChange}
                className="border rounded px-3 py-2"
                placeholder="Delivery Charge (₹)"
                required
              />
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                min="0"
                className="border rounded px-3 py-2"
                placeholder="Price"
                required
              />
              <input
                type="number"
                name="mrp"
                value={form.mrp || ""}
                onChange={handleChange}
                min="0"
                className="border rounded px-3 py-2"
                placeholder="MRP (optional)"
              />
              <input
                type="number"
                name="inStock"
                value={form.inStock}
                onChange={handleChange}
                min="0"
                className="border rounded px-3 py-2"
                placeholder="Stock"
                required
              />
            </div>
          </div>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            rows={3}
            placeholder="Description"
            required
          />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-100 text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded bg-[#1d8599] text-white font-bold hover:bg-[#116279] disabled:opacity-60"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default EditProductModal;
