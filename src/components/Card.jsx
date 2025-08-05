import { Link } from "react-router-dom";
const Card = ({ product }) => (
  <div className="bg-white rounded shadow-md p-4">
    <img
      src={product.image}
      alt={product.title}
      className="h-40 w-full object-contain"
    />
    <h2 className="font-semibold mt-2 text-dark">{product.title}</h2>
    <p className="text-primary font-bold">${product.price}</p>
    <Link to={`/product/${product.id}`} className="text-accent">
      View
    </Link>
  </div>
);
export default Card;
