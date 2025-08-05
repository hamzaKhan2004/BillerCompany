const Banner = ({ title, p, quote }) => {
  return (
    <div className="banner-wrapper h-[92vh] w-full overflow-hidden bg-white md:bg-[#f7fdffbf]">
      {/* Video behind the curve */}
      <video
        className="gif-bg hidden lg:block"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        src="./vid1.mp4"
        style={{ objectFit: "cover" }}
      >
        <track kind="captions" />
      </video>
      {/* Main banner with mask */}
      <div className="banner h-full w-full px-4 md:px-10 flex flex-col relative">
        <div className="center mt-36 md:mt-40 max-w-2xl   md:text-left">
          <h1 className="text-6xl md:text-[80px] font-bold mb-4 text-[#1d8599]">
            {title}
          </h1>
          <p className="text-xl  md:text-2xl text-[#001442] w-full md:w-[550px]">
            {p}
          </p>
          <p className="text-base md:text-lg text-zinc-600 mt-4 italic">
            {quote}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Banner;
