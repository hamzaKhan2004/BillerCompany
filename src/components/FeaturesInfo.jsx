import { Link } from "react-router-dom";

const FeaturesInfo = () => {
  return (
    <div className="features-info-wrapper min-h-56 w-full my-5">
      <div className="features-info-wrapper h-full w-3/4 flex gap-5 mx-auto flex-wrap md:flex-nowrap">
        <div className="lft h-full w-full md:w-1/2 p-5 relative">
          <img
            src="https://i.pinimg.com/736x/c0/3f/54/c03f544515e51be77d33afda488d0406.jpg"
            alt=""
            className="object-cover object-center md:h-[500px] w-[440px] mx-auto my-5"
          />
        </div>
        {/* Right Side (Info) */}
        <div className="w-full md:w-1/2 flex flex-col justify-start md:py-10">
          <h5 className="mb-3 md:my-6 uppercase font-semibold text-xl text-[#1D8599]">
            About Us
          </h5>
          <h1 className="text-5xl md:text-7xl font-bold text-[#001442]  mb-6 capitalize tracking-tight leading-14">
            we deliver the quality water.
          </h1>
          <p className="text-zinc-700  text-lg my-3">
            Pure, clean water is not just a necessity—it's the foundation of
            good health. Our water goes through rigorous filtration and quality
            testing to ensure every drop you drink is safe, refreshing, and
            nutrient-rich.
          </p>
          <ul className="list-disc pl-5 text-zinc-600 my-2">
            <li>Triple-filtered and mineral-balanced for maximum purity</li>
            <li>Delivered in BPA-free, eco-friendly packaging</li>
            <li>Tested regularly to meet international quality standards</li>
          </ul>
          <Link
            to={"/shop"}
            className="my-5 text-[#1d8599] border md:border-transparent hover:border-[#1d8599] w-34 text-center rounded-3xl py-2 hover:w-40 duration-500 transition-all"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturesInfo;
