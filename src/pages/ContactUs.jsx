/* eslint-disable no-unused-vars */
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";
import { BsFillTelephoneFill } from "react-icons/bs";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";

const ContactUs = () => {
  const { user } = useContext(AuthContext);
  // For form state and feedback
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const [sent, setSent] = useState(false);

  // Prefill form with user details (if available)
  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://biller-backend-xdxp.onrender.com/api/contact",
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Thank you for your feedback! We’ll get back to you soon.");
      setForm({ ...form, subject: "", message: "" }); // keep contact prefilled, clear message
    } catch {
      toast.error("Failed to send. Try again later.");
    }
    setLoading(false);
  };

  return (
    <div className="w-full relative bg-white min-h-screen flex flex-col">
      <Navbar />
      {/* Banner */}
      <div className="relative w-full h-[60vh] flex items-center justify-center  overflow-hidden">
        {/* background image */}
        <img
          src="https://demo.htmlcodex.com/3402/drinking-water-website-template/img/breadcrumb.jpg"
          alt="Drinking Water"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#1d2b4a4f]" />
        {/* Title */}
        <h1 className="relative text-[#fff] text-4xl md:text-5xl font-bold text-center z-10">
          Contact Us
        </h1>
      </div>

      {/* Main Section */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 py-14 px-6">
        {/* Left: Contact Form */}
        <div className="flex flex-col gap-2 shadow-xl  p-3 rounded-2xl ">
          <h3 className="text-2xl font-semibold" style={{ color: "#53A8B9" }}>
            Let’s Connect
          </h3>
          <h1
            className="text-3xl md:text-4xl font-bold"
            style={{ color: "#001442" }}
          >
            Send Your Message
          </h1>
          <p className="text-gray-600 mb-6">
            We'd love to hear from you! Whether you have a question, feedback or
            simply want to connect, our team is here to help. Fill out the form
            and we'll be in touch soon.
          </p>
          <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#53A8B9]"
              disabled={!user}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#53A8B9]"
              disabled={!user}
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#53A8B9]"
              disabled={!user}
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={form.subject}
              onChange={handleChange}
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#53A8B9]"
              disabled={!user}
            />
            <textarea
              name="message"
              placeholder="Message"
              rows={5}
              value={form.message}
              onChange={handleChange}
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#53A8B9]"
              disabled={!user}
              required
            />
            <button
              type="submit"
              disabled={!user || loading}
              className={
                "mt-2 inline-block bg-[#53A8B9] hover:bg-[#407385] text-white rounded px-6 py-2 font-semibold transition-colors duration-200" +
                (!user || loading ? " opacity-50 cursor-not-allowed" : "")
              }
            >
              {loading ? "Sending..." : "Submit"}
            </button>
            {!user && (
              <div className="text-red-500 text-sm font-medium">
                Please login to submit the contact form.
              </div>
            )}
          </form>
        </div>

        {/* Right: Contact Info */}
        <div className="flex flex-col gap-7 justify-center">
          {/* Address (full width in its flex column) */}
          <div className="group w-full flex items-start gap-4 rounded-lg shadow-lg hover:shadow-xl duration-200 bg-zinc-50 p-4 mb-4">
            <span className="group-hover:rotate-360 flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-[#53A8B9] text-white text-2xl transition-transform duration-500">
              <FaLocationDot />
            </span>
            <div>
              <h4 className="font-semibold text-lg text-[#001442] mb-1">
                Our Address
              </h4>
              <p className="text-gray-600">
                Shop No. 472, Plot No. A/2-472, Near Pooja Bar, Sector-21,
                Turbhe, Navi Mumbai - 400 703.
              </p>
            </div>
          </div>

          {/* Mail + Phone in a row on desktop, stack on mobile */}
          <div className="w-full flex flex-col md:flex-row gap-4">
            {/* Mail */}
            <div className="group flex-1 flex items-start gap-4 rounded-lg shadow-lg hover:shadow-xl duration-200 bg-zinc-50 p-4">
              <span
                className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-[#53A8B9] text-white text-2xl transition-transform duration-500 group-hover:rotate-360"
                style={{ transition: "transform 0.5s" }}
              >
                <IoIosMail />
              </span>
              <div>
                <h4 className="font-semibold text-lg text-[#001442] mb-1">
                  Mail Us
                </h4>
                <p className="text-gray-600">billercompany077@gmail.com</p>
              </div>
            </div>
            {/* Phone */}
            <div className="group flex-1 flex items-start gap-4 rounded-lg shadow-lg hover:shadow-xl duration-200 bg-zinc-50 p-4">
              <span
                className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-[#53A8B9] text-white text-2xl transition-transform duration-500 group-hover:rotate-360"
                style={{ transition: "transform 0.5s" }}
              >
                <BsFillTelephoneFill />
              </span>
              <div>
                <h4 className="font-semibold text-lg text-[#001442] mb-1">
                  Phone no.
                </h4>
                <p className="text-gray-600">7400421975</p>
              </div>
            </div>
          </div>

          {/* Map Embed */}
          <div className="mt-2 rounded-md overflow-hidden shadow-xl ">
            <iframe
              title="Navi Mumbai Map"
              src="https://www.openstreetmap.org/export/embed.html?bbox=72.99403285980226%2C19.021862282388825%2C73.03219413757326%2C19.05371906632748&amp;layer=mapnik"
              className="w-full h-72"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            {/* <div className="text-xs text-center bg-[#53A8B9] text-white py-1">
              Navi Mumbai, Maharashtra
            </div> */}
          </div>
        </div>
      </div>
      <Footer />
      {/* Icon rotate animation styles */}
      <style>{`
        .hover\\:rotate-360:hover {
          transform: rotate(360deg);
        }
      `}</style>
    </div>
  );
};

export default ContactUs;
