import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <div className="w-[300px] bg-white shadow-xl rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      <img
        src={product.image}
        alt={product.title}
        className="h-56 w-full  object-fill"
      />
      <div className="p-4 flex flex-col gap-2 text-center">
        <div className="text-xl font-semibold text-[#1d8599]">
          ₹{product.price}
        </div>
        <h2 className="text-lg font-bold text-gray-800 truncate">
          {product.title}
        </h2>
        <p className="text-sm text-gray-600 line-clamp-2">
          {product.description}
        </p>

        <Link
          to={`/product/${product.slug ? product.slug : product._id}`}
          className="mt-2 cursor-pointer bg-[#1d8599] text-white rounded-full py-2 px-4 hover:bg-[#166b78] transition duration-300"
        >
          View More Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
