import React from "react";
import { FaShoppingCart } from "react-icons/fa";

function RemoveModal({ product, open, onCancel, onConfirm }) {
  if (!open) return null;
  // Prevent closing on click inside the modal
  const stop = (e) => e.stopPropagation();
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-xl shadow-lg p-7 w-full max-w-sm text-center relative animate-fade-in"
        onClick={stop}
      >
        <span
          className="absolute right-4 top-4 text-gray-400 cursor-pointer text-2xl"
          onClick={onCancel}
        >
          &times;
        </span>
        <div className="flex flex-col items-center mb-4">
          <FaShoppingCart className="text-[#1d8599] text-5xl mb-2" />
          <div className="font-semibold text-[#1d8599]">{product.title}</div>
        </div>
        <div className="mt-3 text-gray-800">
          Do you want to remove this product from cart?
        </div>
        <div className="mt-6 flex justify-around gap-4">
          <button
            className="bg-gray-200 px-5 py-2 rounded hover:bg-gray-300 font-medium text-gray-700"
            onClick={onCancel}
          >
            No
          </button>
          <button
            className="bg-red-500 px-5 py-2 rounded text-white font-semibold hover:bg-red-700"
            onClick={onConfirm}
          >
            Yes, Please
          </button>
        </div>
      </div>
    </div>
  );
}

export default RemoveModal;
