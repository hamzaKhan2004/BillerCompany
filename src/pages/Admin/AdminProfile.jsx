/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import AdminSidebar from "../../components/AdminSidebar";
import Spinner from "../../components/Spinner";

const BASE_URL = "https://biller-backend-xdxp.onrender.com";

// Cloudinary setup
const UPLOAD_PRESET = "billerCompany"; // SET to your unsigned Cloudinary preset name
const CLOUD_NAME = "dlgn5wzsl";

const initialAddress = {
  line1: "",
  line2: "",
  city: "",
  state: "",
  zipcode: "",
  country: "",
};

const AdminProfile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({});
  const [address, setAddress] = useState(initialAddress);
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const fileRef = useRef();

  useEffect(() => {
    if (!user || !user.isAdmin) return;
    const token = localStorage.getItem("token");
    setLoading(true);
    axios
      .get(`${BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProfile(res.data);
        setForm({
          name: res.data.name,
          email: res.data.email,
          phone: res.data.address?.phone || res.data.phone || "",
        });
        setAddress({
          ...res.data.address,
          state: res.data.address?.state || "Maharashtra",
          country: res.data.address?.country || "India",
        });
        setAvatarPreview(
          res.data.avatar
            ? res.data.avatar.startsWith("/uploads")
              ? BASE_URL + res.data.avatar
              : res.data.avatar
            : ""
        );
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        toast.error("Failed to fetch profile.");
      });
  }, [user]);

  if (!user || !user.isAdmin) {
    return (
      <div className="text-center py-20 text-lg text-[#d14343]">
        Only admins can access this page.
      </div>
    );
  }

  if (loading) return <Spinner />;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    setAvatarPreview(file ? URL.createObjectURL(file) : "");
  };

  const triggerAvatarUpload = () => {
    fileRef.current?.click();
  };

  // Upload avatar image to Cloudinary, return URL or ""
  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);
    data.append("cloud_name", CLOUD_NAME);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    let avatarUrl = profile.avatar;

    if (avatar) {
      avatarUrl = await uploadToCloudinary(avatar);
      if (!avatarUrl) {
        toast.error("Avatar upload failed.");
        return;
      }
    }

    // Mirror phone into address object
    const addrToSend = { ...address, phone: form.phone };

    try {
      const res = await axios.put(
        `${BASE_URL}/api/users/me`,
        {
          ...form,
          address: addrToSend,
          avatar: avatarUrl,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProfile(res.data);
      setAvatar(null);
      toast.success("Admin profile updated successfully.");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed.");
    }
  };

  return (
    <div className="bg-[#f7fdff] min-h-screen flex">
      {/* Sidebar on left */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 max-w-3xl mx-auto bg-white my-5 rounded-2xl shadow-lg px-10 py-8">
        <h2 className="text-3xl font-bold text-[#1d8599] mb-8">
          Admin Profile
        </h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Avatar and name */}
          <div className="flex items-center gap-8">
            <div
              className="w-28 h-28 bg-gray-100 rounded-full border-4 border-yellow-200 flex items-center justify-center cursor-pointer"
              onClick={triggerAvatarUpload}
              title="Change Avatar"
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar Preview"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-5xl text-[#1d8599] font-bold">
                  {profile.name ? profile.name[0].toUpperCase() : "A"}
                </span>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileRef}
                onChange={handleAvatarChange}
                disabled={loading}
              />
            </div>
            <div>
              <p className="text-xl font-semibold">{profile.name}</p>
              <p className="text-gray-500">{profile.email}</p>
              <span className="text-sm bg-yellow-400 text-white text-center my-1.5 px-1 py-0.5 rounded">
                Admin
              </span>
              <p className="text-sm text-gray-400 mt-1">
                Click avatar to upload
              </p>
            </div>
          </div>

          {/* Other form inputs */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                name="name"
                value={form.name || ""}
                onChange={handleChange}
                required
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                name="email"
                value={form.email || ""}
                disabled
                className="border rounded px-3 py-2 w-full bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                name="phone"
                value={form.phone || ""}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                New Password
              </label>
              <input
                name="password"
                type="password"
                onChange={handleChange}
                placeholder="Leave blank to keep current"
                className="border rounded px-3 py-2 w-full"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="font-semibold text-lg text-[#1d8599] mb-2 block">
              Address
            </label>
            <textarea
              name="line1"
              rows={3}
              placeholder="Address Line 1"
              value={address.line1}
              onChange={handleAddressChange}
              className="w-full border rounded px-3 py-2 mb-3 resize-none"
            ></textarea>
            <textarea
              name="line2"
              rows={1}
              placeholder="Address Line 2"
              value={address.line2}
              onChange={handleAddressChange}
              className="w-full border rounded px-3 py-2 mb-3 resize-none"
            ></textarea>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <input
                name="city"
                type="text"
                placeholder="City"
                value={address.city}
                onChange={handleAddressChange}
                className="border rounded px-3 py-2"
                required
              />
              <input
                name="zipcode"
                type="text"
                placeholder="Pin / Zip Code"
                value={address.zipcode}
                onChange={handleAddressChange}
                className="border rounded px-3 py-2"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                name="state"
                type="text"
                value={address.state || "Maharashtra"}
                readOnly
                className="border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
              />
              <input
                name="country"
                type="text"
                value={address.country || "India"}
                readOnly
                className="border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Save button */}
          <button
            type="submit"
            className="bg-[#1d8599] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#186e99] transition"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminProfile;
