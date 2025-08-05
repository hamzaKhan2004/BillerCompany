import React from "react";

const SmallBanner = () => {
  return (
    <div
      style={{ backgroundImage: "url('./banner.jpg')" }}
      className="w-full  h-[50vh] relative mt-5 bg-fixed"
    >
      <div className="overlay w-full h-full absolute top-0 left-0 bg-[#001442ae] flex flex-col md:flex-row justify-between items-center px-10 py-8">
        {/* Left Side - Text */}
        <div className="lft text-white max-w-xl ml-[10%] text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 md:mb-4">
            Water Delivery 2 km Free Service
          </h1>
          <p className="text-base md:text-lg">
            Experience the purity of fresh, clean water delivered straight to
            your doorstep. No delivery charges for the first 2 kilometers.
            Hydrate the smart way with AquaEdge!
          </p>
        </div>

        {/* Right Side - Image */}
        <div className="rgt mt-5 md:mt-10  mr-12">
          <img
            src="/d1.png" // Replace with your actual image path
            alt="Water Delivery"
            className="w-[350px] h-auto object-contain rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default SmallBanner;
