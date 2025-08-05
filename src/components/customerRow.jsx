import { FaUserCircle, FaEye, FaTrash } from "react-icons/fa";

const BACKEND = "https://biller-backend-xdxp.onrender.com";

const CustomerRow = ({ customer, onDelete, onViewDetail }) => (
  <tr className="border-b hover:bg-[#f9fafd]">
    <td className="p-3 text-center">
      {customer.avatar ? (
        <img
          src={
            customer.avatar.startsWith("/uploads")
              ? BACKEND + customer.avatar
              : customer.avatar
          }
          alt="avatar"
          className="w-11 h-11 object-cover rounded-full mx-auto border"
        />
      ) : (
        <FaUserCircle className="text-3xl text-[#1d8599] mx-auto" />
      )}
    </td>
    <td className="p-3 font-semibold">{customer.name}</td>
    <td className="p-3">{customer.email}</td>
    <td className="p-3">{customer.createdAt?.slice(0, 10)}</td>
    <td className="p-3">
      {customer.phone || <span className="text-gray-400">-</span>}
    </td>
    <td className="p-3">
      {customer.address?.city || <span className="text-gray-400">-</span>}
    </td>
    <td className="p-3 text-center">{customer.orderCount ?? "0"}</td>
    <td className="p-3 flex gap-3 justify-center items-center">
      <button
        title="View"
        onClick={() => onViewDetail(customer)}
        className="text-[#1d8599] hover:text-[#135a6d] text-lg cursor-pointer"
      >
        <FaEye />
      </button>
      <button
        title="Delete"
        onClick={() => onDelete(customer._id)}
        className="text-red-500 hover:text-red-700 text-lg cursor-pointer"
      >
        <FaTrash />
      </button>
    </td>
  </tr>
);

export default CustomerRow;
