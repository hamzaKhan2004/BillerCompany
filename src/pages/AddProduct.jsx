/* eslint-disable no-unused-vars */
// export default AddProduct;
import { useContext, useState, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";

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

const AddProduct = () => {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    brand: "",
    type: "",
    size: "",
    // material: "",
    deliveryCharge: "",
    price: "",
    mrp: "",
    inStock: "",
    description: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedSlug, setGeneratedSlug] = useState("");

  const fileRef = useRef();

  if (loading) return <Spinner />;
  if (!user?.isAdmin)
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-lg font-semibold text-red-500">
        Only admin can access this page.
      </div>
    );

  // Handle form changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle image selection
  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : "");
  };

  // Handle image upload input click
  const handleUploadClick = () => fileRef.current?.click();

  // Auto-generate slug based on title and brand (if empty)
  const handleTitleOrBrand = (e) => {
    const { name, value } = e.target;
    const nextForm = { ...form, [name]: value };
    if ((name === "title" || name === "brand") && !form.slug) {
      nextForm.slug = (
        (name === "title" ? value : form.title) +
        "-" +
        (name === "brand" ? value : form.brand)
      )
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/-+$/, "");
    }
    setForm(nextForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    let imageUrl = ""; // Will store the Cloudinary URL

    // 1. First, upload the image to Cloudinary if there is an image selected
    if (image) {
      const imageFormData = new FormData();
      imageFormData.append("file", image);
      imageFormData.append("upload_preset", "billerCompany"); // Replace with your actual preset
      imageFormData.append("cloud_name", "dlgn5wzsl"); // Replace with your actual preset

      try {
        const uploadResponse = await fetch(
          "https://api.cloudinary.com/v1_1/dlgn5wzsl/image/upload",
          {
            method: "POST",
            body: imageFormData,
          }
        );
        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.secure_url;
        if (!imageUrl) {
          setMsg("Image upload failed. Please try again.");
          setLoading(false);
          return;
        }
      } catch (uploadErr) {
        setMsg("Image upload failed. Please try again.");
        setLoading(false);
        return;
      }
    }

    // 2. Generate the final slug
    const titleSlug = form.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/-+$/, "");
    const finalSlug =
      titleSlug + "-" + form.brand.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    setGeneratedSlug(finalSlug);

    // 3. Prepare product data to send to backend (as JSON now, not FormData)
    const productData = {
      ...form,
      slug: finalSlug,
      image: imageUrl, // Use the Cloudinary URL!
    };

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://biller-backend-xdxp.onrender.com/api/products",
        productData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Product added successfully!");
      setForm({
        title: "",
        slug: "",
        brand: "",
        type: "",
        size: "",
        deliveryCharge: "",
        price: "",
        mrp: "",
        inStock: "",
        description: "",
      });
      setImage(null);
      setImagePreview("");
      setLoading(false);
      if (fileRef.current) fileRef.current.value = null;
    } catch (err) {
      setMsg(
        err?.response?.data?.message ||
          "Failed to add product. Please try again."
      );
      setLoading(false);
    }
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
            Add New Product
          </h2>
          {/* Image upload */}
          <div className="flex flex-col items-center">
            <div
              className="w-32 h-32 bg-slate-100 rounded-lg border-2 border-dashed border-[#8fdbe7] cursor-pointer flex items-center justify-center hover:bg-[#f0fbff] transition"
              onClick={handleUploadClick}
              title="Click to select image"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="preview"
                  className="object-cover w-full h-full rounded-lg"
                />
              ) : (
                <span className="text-[#a7d4de] text-3xl">+</span>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                ref={fileRef}
                className="hidden"
              />
            </div>
            <span className="text-xs text-[#1d8599] mt-1">
              Click the box to select an image
            </span>
          </div>
          {/* Product title */}
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleTitleOrBrand}
            placeholder="Product Name"
            className="w-full border border-[#c3ecff] px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#1d8599]"
            required
          />
          {/* Slug */}
          {/* <input
            type="text"
            name="slug"
            value={form.slug}
            onChange={handleChange}
            placeholder="Slug (for filtering, unique)"
            className="w-full border border-[#e7e8e7] px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#1d8599]"
            required
          /> */}
          {/* Brand */}
          <select
            name="brand"
            value={form.brand}
            onChange={handleTitleOrBrand}
            className="w-full border border-[#c3ecff] px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#1d8599]"
            required
          >
            <option value="">Select Brand</option>
            {BRAND_OPTIONS.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
          {/* Type / Category */}
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full border border-[#c3ecff] px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#1d8599]"
            required
          >
            <option value="">Select Product Type</option>
            {TYPE_OPTIONS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          {/* Size/Capacity */}
          <select
            name="size"
            value={form.size}
            onChange={handleChange}
            className="w-full border border-[#c3ecff] px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#1d8599]"
            required
          >
            <option value="">Select Size/Capacity</option>
            {SIZE_OPTIONS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          {/* Material */}
          {/* <select
            name="material"
            value={form.material}
            onChange={handleChange}
            className="w-full border border-[#c3ecff] px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#1d8599]"
            required={!form.type.toLowerCase().includes("purifier")}
          >
            <option value="">Select Material</option>
            {MATERIAL_OPTIONS.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select> */}
          {/* Add this: deliveryCharge number input */}
          <input
            type="number"
            min="0"
            step="0.01"
            name="deliveryCharge"
            value={form.deliveryCharge}
            onChange={handleChange}
            placeholder="Delivery Charge (₹)"
            className="w-full border border-[#c3ecff] px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#1d8599]"
            required
          />
          {/* Price and MRP */}
          <div className="flex gap-4">
            <input
              type="number"
              min="0"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Selling Price"
              className="w-1/2 border border-[#bee6ee] px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#1d8599]"
              required
            />
            <input
              type="number"
              min="0"
              name="mrp"
              value={form.mrp}
              onChange={handleChange}
              placeholder="MRP (optional)"
              className="w-1/2 border border-[#bee6ee] px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#1d8599]"
            />
          </div>
          {/* In stock */}
          <input
            type="number"
            min="0"
            name="inStock"
            value={form.inStock}
            onChange={handleChange}
            placeholder="Stock Quantity"
            className="w-full border border-[#c3ecff] px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#1d8599]"
            required
          />
          {/* Description */}
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border border-[#c3ecff] px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#1d8599] resize-none"
            rows={4}
            required
          ></textarea>
          {/* Submit button */}
          <button
            disabled={loading}
            className={`w-full py-2 rounded font-semibold text-white bg-[#1d8599] hover:bg-[#116279] transition
              ${loading ? "opacity-60 cursor-not-allowed" : ""}
            `}
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
          {msg && (
            <div className="text-center text-sm mt-2 text-[#24ba5b]">{msg}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
