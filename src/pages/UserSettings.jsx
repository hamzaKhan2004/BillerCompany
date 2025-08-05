/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import axios from "axios";

const BASE_URL = "https://biller-backend-xdxp.onrender.com";

// Cloudinary config
const UPLOAD_PRESET = "billerCompany";
const CLOUD_NAME = "dlgn5wzsl";

const initialAddress = {
  line1: "",
  line2: "",
  city: "",
  state: "",
  zipcode: "",
  country: "",
};

const UserSettings = () => {
  const { user, login } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const [address, setAddress] = useState(initialAddress);
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const fileRef = useRef();

  // Fetch current info on mount (latest info)
  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem("token");
    axios
      .get(`${BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProfile(res.data);
        setForm({
          name: res.data.name,
          email: res.data.email,
          phone: res.data.phone || res.data.address.phone,
        });
        setAddress({
          ...res.data.address,
          state: res.data.address?.state || "Maharashtra",
          country: res.data.address?.country || "India",
        });

        setAvatarPreview(
          res.data.avatar
            ? res.data.avatar.startsWith("/uploads")
              ? `${BASE_URL}${res.data.avatar}`
              : res.data.avatar
            : ""
        );
        setLoading(false);
      });
  }, [user]);

  if (!user)
    return (
      <div className="text-center py-20 text-lg text-[#1d8599]">
        Please login to access settings.
      </div>
    );
  if (loading) return <Spinner />;

  // Handlers
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleAddress = (e) =>
    setAddress({ ...address, [e.target.name]: e.target.value });

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    setAvatarPreview(file ? URL.createObjectURL(file) : "");
  };
  const handleAvatarUpload = () => fileRef.current?.click();

  // --- CLOUDINARY upload
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
    let avatarUrl = profile?.avatar;

    // If user selected a new image, upload first to cloudinary
    if (avatar) {
      avatarUrl = await uploadToCloudinary(avatar);
      if (!avatarUrl) {
        toast.error("Avatar upload failed.");
        return;
      }
    }

    // Mirror phone in both form and address
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
      setEdit(false);
      toast.success("Profile updated!");
      // If user changed their name/email, can trigger a login refresh if wanted:
      // login(res.data.email, ...);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

  const handleAddressChange = (e) => {
    setAddress((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="bg-[#f7fdff] min-h-screen w-full flex flex-col">
      <Navbar />
      <div className="max-w-3xl mx-auto bg-white my-12 rounded-2xl shadow-lg px-10 py-8">
        <h2 className="text-3xl font-bold text-[#1d8599] mb-8">
          Account Settings
        </h2>
        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Profile picture */}
          <div className="flex items-center gap-8">
            <div
              className="w-28 h-28 bg-gray-100 rounded-full flex items-center justify-center border-4 border-[#e2f0fd] cursor-pointer"
              onClick={handleAvatarUpload}
              title="Click to change avatar"
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="avatar"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-5xl text-[#1d8599] font-bold">
                  {user?.name?.[0]?.toUpperCase()}
                </span>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleAvatar}
                className="hidden"
              />
            </div>
            <div>
              <div className="text-lg font-bold">{profile?.name}</div>
              <div className="text-sm text-gray-500">{profile?.email}</div>
              <div className="text-xs text-gray-400 mt-1">
                Click avatar to update
              </div>
            </div>
          </div>

          {/* Name, Email, Phone */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                name="name"
                className="w-full border rounded px-3 py-2"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                name="email"
                className="w-full border rounded px-3 py-2"
                value={form.email}
                onChange={handleChange}
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                name="phone"
                className="w-full border rounded px-3 py-2"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="Leave blank to keep current"
                className="w-full border rounded px-3 py-2"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block mb-2 font-semibold text-[#1d8599]">
              Shipping Address
            </label>

            <textarea
              name="line1"
              rows={3}
              placeholder="Address Line 1"
              value={address.line1}
              onChange={handleAddressChange}
              className="w-full border rounded px-3 py-2 mb-3 resize-none"
            />

            <textarea
              name="line2"
              rows={3}
              placeholder="Address Line 2"
              value={address.line2}
              onChange={handleAddressChange}
              className="w-full border rounded px-3 py-2 mb-3 resize-none"
            />

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

            <div className="grid grid-cols-2 gap-4 mb-5">
              <input
                name="state"
                type="text"
                value={address.state || "Maharashtra"}
                readOnly
                className="border rounded bg-gray-100 px-3 py-2 cursor-not-allowed"
              />
              <input
                name="country"
                type="text"
                value={address.country || "India"}
                readOnly
                className="border rounded bg-gray-100 px-3 py-2 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="bg-[#1d8599] text-white px-8 py-2 rounded-full font-semibold hover:bg-[#18677b] transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserSettings;
