import { useEffect, useState } from "react";
import axios from "axios";
import BlogCard from "./BlogCard";

const BASE_URL = "https://biller-backend-xdxp.onrender.com";

const BlogContent = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/blogs`)
      .then((res) => {
        setBlogs(res.data || []);
        setLoading(false);
      })
      .catch(() => {
        setBlogs([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-full py-16">
      <h5 className="text-center uppercase text-[#1D8599] font-semibold text-xl">
        Our Blog
      </h5>
      <h1 className="text-center text-4xl font-bold my-6 text-[#001442]">
        Latest Tips & Articles on Hydration
      </h1>

      {loading ? (
        <div className="text-center text-lg text-[#1d8599]">
          Loading blogs...
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center text-gray-500">No blogs found.</div>
      ) : (
        <div className="flex justify-center gap-10 flex-wrap m-10">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogContent;
