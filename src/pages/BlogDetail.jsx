/* eslint-disable no-unused-vars */
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Spinner from "../components/Spinner";
import Footer from "../components/Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://biller-backend-xdxp.onrender.com";

const BlogDetail = () => {
  const { slug, id } = useParams();
  const param = slug || id;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentPosts, setRecentPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        let res;
        // Try fetching blog by slug
        try {
          res = await axios.get(`${BASE_URL}/api/blogs/slug/${param}`);
        } catch {
          // Try by id fallback
          res = await axios.get(`${BASE_URL}/api/blogs/${param}`);
        }
        setBlog(res.data);

        // Fetch 4 most recent posts excluding current
        const allBlogsRes = await axios.get(`${BASE_URL}/api/blogs`);
        const others = allBlogsRes.data.filter((b) => b._id !== res.data._id);
        // Sort by creation date desc, then take 4
        const sorted = others.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setRecentPosts(sorted.slice(0, 4));
      } catch {
        setBlog(null);
      }
      setLoading(false);
    })();
  }, [param]);

  if (loading) return <Spinner />;

  if (!blog)
    return (
      <div className="text-center p-24 text-xl text-[#1d8599]">
        Blog not found.
      </div>
    );

  // Safe image URL check after blog loaded
  const imageUrl = blog.coverImage
    ? blog.coverImage.startsWith("/uploads")
      ? `${BASE_URL}${blog.coverImage}`
      : blog.coverImage
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#f7fdff]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
        {/* Main blog content */}
        <article className="md:col-span-2 bg-white shadow-xl rounded-xl p-8">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={blog.title}
              className="h-[400px] w-full object-cover mb-6 rounded"
            />
          )}
          <h1 className="text-4xl font-extrabold text-[#1d8599] mb-4">
            {blog.title}
          </h1>
          <p className="text-gray-400 text-sm mb-8">
            Posted on {blog.createdAt?.slice(0, 10)}
          </p>
          <div className="prose prose-lg text-gray-900 max-w-none">
            {blog.content.split("\n").map((para, i) => (
              <p key={i}>{para.trim()}</p>
            ))}
          </div>
          {blog.tags?.length > 0 && (
            <div className="mt-8 text-xs text-[#2e4870]">
              Tags:{" "}
              {blog.tags.map((t) => (
                <span key={t} className="mr-2 font-semibold">
                  #{t}
                </span>
              ))}
            </div>
          )}
          {/* Go Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="my-5 text-[#1d8599] border border-transparent hover:border-[#1d8599] w-34 text-center rounded-3xl py-2 hover:w-40 duration-500 transition-all cursor-pointer"
          >
            ← Go Back
          </button>
        </article>

        {/* Sidebar recent posts */}
        <aside className="bg-white rounded-xl shadow-xl p-6 sticky top-20 self-start h-max">
          <h2 className="text-2xl font-bold text-[#1d8599] mb-6">
            Recent Posts
          </h2>
          {recentPosts.length === 0 && (
            <p className="text-gray-400">No recent posts available.</p>
          )}
          <ul className="space-y-6">
            {recentPosts.map((post) => {
              const postImage = post.coverImage
                ? post.coverImage.startsWith("/uploads")
                  ? `${BASE_URL}${post.coverImage}`
                  : post.coverImage
                : null;
              return (
                <Link
                  to={`/blog/${post.slug || post._id}`}
                  key={post._id}
                  className="flex gap-4 items-center hover:bg-[#f0fbff] p-2 rounded cursor-pointer transition"
                  title={post.title}
                >
                  {postImage ? (
                    <img
                      src={postImage}
                      alt={post.title}
                      className="w-20 h-16 object-cover rounded flex-shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-400 flex-shrink-0">
                      No Image
                    </div>
                  )}

                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-[#136e8d] truncate">
                      {post.title}
                    </span>
                    <span className="text-xs text-gray-400">
                      {post.createdAt?.slice(0, 10)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </ul>
        </aside>
      </main>
      <Footer />
    </div>
  );
};

export default BlogDetail;
