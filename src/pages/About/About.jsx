import Banner from "../../components/Banner";
import Features from "../../components/Features";
import FeaturesInfo from "../../components/FeaturesInfo";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import SmallBanner from "../../components/SmallBanner";
import { FaHandHoldingWater, FaFilter, FaRecycle } from "react-icons/fa";
import { GiMicroscope } from "react-icons/gi";

const About = () => {
  const title = "Who We Are";
  const p =
    "Our mission is to foster innovation, transparency, and community. We share thoughtful content and inspiring stories to help you make informed decisions and grow together.";
  const quote = `"Empowering ideas, enriching lives."`;

  const featuresData = [
    {
      featuresTitle: "Safe Water Handling",
      featuresDetails:
        "We ensure every drop is stored, processed, and delivered with utmost hygiene and care.",
      tag: FaHandHoldingWater,
    },
    {
      featuresTitle: "Advanced Filtration",
      featuresDetails:
        "Our multi-stage filtration process removes 99.9% of contaminants for crisp, clean water.",
      tag: FaFilter,
    },
    {
      featuresTitle: "Eco-Friendly Practices",
      featuresDetails:
        "We recycle used bottles and packaging to minimize our environmental footprint.",
      tag: FaRecycle,
    },
    {
      featuresTitle: "Microbial Testing",
      featuresDetails:
        "Regular lab testing under microscopes guarantees bacteria-free and mineral-rich water.",
      tag: GiMicroscope,
    },
  ];

  return (
    <div className="w-full  relative">
      <Navbar />
      <Banner title={title} p={p} quote={quote} />
      <FeaturesInfo />
      <SmallBanner />
      <div className="min-h-screen relative  w-full flex flex-col gap-5">
        <div className="top min-h-[20vh]   text-center ">
          <h5 className="my-6 uppercase font-semibold text-xl text-[#1D8599]">
            Our Features
          </h5>
          <h1 className="text-4xl font-bold w-1/3 mx-auto my-8 text-[#001442]">
            A Trusted Name in Bottled Water Industry
          </h1>
        </div>
        <div className="middle min-h-[30vh]   flex justify-center items-center gap-14 my-6 flex-wrap">
          {featuresData.map((features, index) => (
            <Features features={features} key={index} />
          ))}
        </div>
        {/* <div className="bottom min-h-[50vh]  ">
          <FeaturesInfo />
        </div> */}
      </div>
      <Footer />
    </div>
  );
};

export default About;
