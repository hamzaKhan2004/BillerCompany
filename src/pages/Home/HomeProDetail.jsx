import ProductDescription from "../../components/ProductDescription";
import p6 from "../../assets/p6.png";
import { FaHandHoldingWater, FaRecycle, FaShieldAlt } from "react-icons/fa";
import { GiWaterDrop, GiHealthCapsule, GiCheckMark } from "react-icons/gi";

const HomeProDetail = () => {
  const leftDescriptions = [
    {
      title: "Pure Water Guaranteed",
      description: "Removes 99% of harmful substances ensuring safe drinking.",
      icon: <FaHandHoldingWater />,
    },
    {
      title: "Eco-Friendly Design",
      description:
        "Built with materials that support a sustainable environment.",
      icon: <FaRecycle />,
    },
    {
      title: "Advanced Filtration",
      description: "Multi-layer filtration for ultimate purification.",
      icon: <GiWaterDrop />,
    },
  ];

  const rightDescriptions = [
    {
      title: "Health-Focused",
      description: "Improves mineral balance and boosts immune defense.",
      icon: <GiHealthCapsule />,
    },
    {
      title: "Secure & Durable",
      description: "Robust design with leak-proof, long-lasting materials.",
      icon: <FaShieldAlt />,
    },
    {
      title: "Trusted by Thousands",
      description: "Rated highly by thousands of happy households.",
      icon: <GiCheckMark />,
    },
  ];

  return (
    <div className="w-full min-h-screen relative">
      <div className="top w-full overflow-hidden">
        <h5 className="my-4 uppercase font-semibold text-center text-xl text-[#1D8599]">
          Why Choose Us?
        </h5>
        <h1 className="text-6xl  md:w-1/2 font-bold w-full mx-auto my-6 text-center text-[#001442]">
          Protect Your Family With Best Water
        </h1>
      </div>

      <div className="bottom flex md:justify-center gap-10 my-10 flex-col items-center md:flex-row">
        {/* Left Descriptions */}
        <div className="product_descriptions w-[60vw] md:w-[25vw] flex flex-col gap-6 items-end justify-center">
          {leftDescriptions.map((desc, idx) => (
            <ProductDescription
              key={idx}
              icon={desc.icon}
              title={desc.title}
              description={desc.description}
            />
          ))}
        </div>

        {/* Product Image */}
        <div className="product_img flex justify-center items-center">
          <img
            src={p6}
            alt="product"
            className="object-center object-cover w-[350px] h-[650px]  drop-shadow-2xl drop-shadow-zinc-300 hover:drop-shadow-zinc-400 duration-500 transition-all"
          />
        </div>

        {/* Right Descriptions */}
        <div className="product_descriptions w-[60vw] md:w-[25vw] flex flex-col gap-6 items-start justify-center">
          {rightDescriptions.map((desc, idx) => (
            <ProductDescription
              key={idx}
              icon={desc.icon}
              title={desc.title}
              description={desc.description}
              reverse={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeProDetail;
