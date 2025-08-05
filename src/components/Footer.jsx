import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#001442] text-white px-6 py-10 mt-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">
        <div className="flex items-center text-7xl">
          <h1>Biller</h1>
        </div>
        {/* About Us */}
        <div>
          <h3 className="text-xl font-semibold mb-4">About Us</h3>
          <p className="text-sm">
            We are committed to providing the highest quality water products and
            services to our customers, ensuring their health and satisfaction.
          </p>
        </div>
        {/* Contact Us */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
          <p>Email: billercompany077@gmail.com</p>
          <p>Phone: +91 74004 21975</p>
          <p>Address: Mumbai, India</p>
        </div>
        {/* Social Media */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
          <div className="flex gap-4 text-lg">
            <div className="flex gap-4 text-lg">
              <a
                href="https://www.instagram.com/biller_company_06/?igsh=MTUxc2M5dHdhazIwZA%3D%3D&utm_source=qr#"
                className="hover:text-gray-300"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://www.instagram.com/biller_company_06/?igsh=MTUxc2M5dHdhazIwZA%3D%3D&utm_source=qr#"
                className="hover:text-gray-300"
              >
                <FaTwitter />
              </a>
              <a
                href="https://www.instagram.com/biller_company_06/?igsh=MTUxc2M5dHdhazIwZA%3D%3D&utm_source=qr#"
                className="hover:text-gray-300"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.instagram.com/biller_company_06/?igsh=MTUxc2M5dHdhazIwZA%3D%3D&utm_source=qr#"
                className="hover:text-gray-300"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>
        {/* Legal Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Legal</h3>
          <ul className="text-sm space-y-2">
            <li>
              <a className="hover:underline" href="/return-policy">
                Return Policy
              </a>
            </li>
            <li>
              <a className="hover:underline" href="/refund-policy">
                Refund Policy
              </a>
            </li>
            <li>
              <a className="hover:underline" href="/privacy-policy">
                Privacy Policy
              </a>
            </li>
            <li>
              <a className="hover:underline" href="/disclaimer">
                Disclaimer
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white mt-8 pt-4 text-center text-sm">
        © {new Date().getFullYear()} Biller Company. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
