import { FaEdit, FaTrash } from "react-icons/fa";
const BACKEND = "https://biller-backend-xdxp.onrender.com";
const AdminProductRow = ({ product, onDelete, onEdit }) => (
  <tr className="border-b hover:bg-[#f9fafd]">
    <td className="p-3">
      <img
        src={
          product.image?.startsWith("/uploads")
            ? BACKEND + product.image
            : product.image
        }
        alt={product.title}
        className="w-14 h-14 object-cover rounded"
      />
    </td>
    <td className="p-3 font-bold">{product.title}</td>
    <td className="p-3">{product.brand}</td>
    <td className="p-3">{product.type}</td>
    <td className="p-3">{product.size}</td>
    <td className="p-3">{product.material}</td>
    <td className="p-3 text-green-700 font-semibold">₹{product.price}</td>
    <td className="p-3">{product.mrp ? `₹${product.mrp}` : "-"}</td>
    <td className="p-3">{product.inStock}</td>
    <td className="p-3 font-mono text-xs">{product.slug}</td>
    <td className="p-3 text-xs">{product.createdAt?.slice(0, 10)}</td>
    <td className="p-3 text-center">
      <button
        title="Edit"
        className="mx-1 text-xl text-[#1d8599] hover:text-[#006176]"
        onClick={() => onEdit(product)}
      >
        <FaEdit />
      </button>
      <button
        title="Delete"
        className="mx-1 text-xl text-red-500 hover:text-red-700"
        onClick={() => onDelete(product._id)}
      >
        <FaTrash />
      </button>
    </td>
  </tr>
);
export default AdminProductRow;
