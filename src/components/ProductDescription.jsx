const ProductDescription = ({ icon, title, description, reverse = false }) => {
  return (
    <div className="product-description-wrapper  bg-zinc-50 group p-5 rounded-xl shadow-md hover:shadow-lg  duration-200 transition-all]">
      <div
        className={`product-description flex items-center justify-between   gap-4 ${
          reverse ? "flex-row-reverse" : ""
        }`}
      >
        <div className="text w-[80%]">
          <h2 className="text-2xl md:text-xl font-semibold">{title}</h2>
          <p className="text-base text-gray-700">{description}</p>
        </div>
        <div className="icon">
          <div className="circle group-hover:rotate-360 h-[55px] w-[55px] flex items-center justify-center rounded-full bg-[#53a8b9] text-3xl text-white">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDescription;
