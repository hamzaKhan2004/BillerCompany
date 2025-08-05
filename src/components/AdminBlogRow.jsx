import { FaEdit, FaTrash } from "react-icons/fa";
const BACKEND = "https://biller-backend-xdxp.onrender.com";

const AdminBlogRow = ({ blog, onDelete, onEdit }) => {
  const imageUrl = blog.coverImage
    ? blog.coverImage.startsWith("/uploads")
      ? BACKEND + blog.coverImage
      : blog.coverImage
    : null;

  return (
    <tr className="border-b hover:bg-[#f9fafd]">
      <td className="p-3">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={blog.title}
            className="w-16 h-12 object-cover rounded"
          />
        ) : (
          <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
            No Image
          </div>
        )}
      </td>
      <td className="p-3 font-semibold">{blog.title}</td>
      <td className="p-3 font-mono text-xs">{blog.slug}</td>
      <td className="p-3 text-xs">{blog.createdAt?.slice(0, 10)}</td>
      <td className="p-3 text-center">
        <button
          title="Edit"
          className="mx-1 text-xl text-[#1d8599] hover:text-[#006176]"
          onClick={() => onEdit(blog)}
        >
          <FaEdit />
        </button>
        <button
          title="Delete"
          className="mx-1 text-xl text-red-500 hover:text-red-700"
          onClick={() => onDelete(blog._id)}
        >
          <FaTrash />
        </button>
      </td>
    </tr>
  );
};

export default AdminBlogRow;
