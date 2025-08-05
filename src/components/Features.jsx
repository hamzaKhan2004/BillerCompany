import { Link } from "react-router-dom";

const Features = ({ features }) => {
  return (
    <div className="w-[220px] group h-[260px] rounded shadow-lg hover:shadow-xl duration-200 flex flex-col bg-zinc-50 justify-center items-center gap-2 py-2 text-center">
      <div className="circle group-hover:rotate-360 h-[55px] w-[55px] flex items-center justify-center rounded-full bg-[#53a8b9] text-3xl text-white">
        {<features.tag />}
      </div>
      <h3 className="text-base font-semibold">{features.featuresTitle}</h3>
      <p className="line-clamp-3  tracking-tight leading-4.5 text-sm px-0.5">
        {features.featuresDetails}
      </p>
      <Link className="hover:text-[#1D8599] my-2">Read More </Link>
    </div>
  );
};

export default Features;
