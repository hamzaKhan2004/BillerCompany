import { Link } from "react-router-dom";

const BlogCard = ({ blog }) => {
  const blogPath = `/blog/${blog.slug ? blog.slug : blog._id}`;
  const imageUrl = blog.coverImage
    ? blog.coverImage.startsWith("/uploads")
      ? `https://biller-backend-xdxp.onrender.com${blog.coverImage}`
      : blog.coverImage
    : null;
  return (
    <div className="max-w-[350px] bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl duration-300 ">
      {/* Wrap image in Link */}
      <Link to={blogPath} aria-label={`Read more about ${blog.title}`}>
        <img
          src={imageUrl}
          alt={blog.title}
          className="w-full h-52 object-fill cursor-pointer"
        />
      </Link>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">{blog.title}</h2>
        <p className="text-gray-600 text-sm mb-4">{blog.description}</p>
        {/* Wrap "Read More" text in Link */}
        <Link
          to={blogPath}
          className="text-[#1d8599] font-medium hover:underline"
        >
          Read More →
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
