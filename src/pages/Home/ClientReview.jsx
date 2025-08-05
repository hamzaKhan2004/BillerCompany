import { useState } from "react";
import { FaQuoteRight, FaStar, FaRegStar } from "react-icons/fa";
import { MdArrowForwardIos, MdArrowBackIosNew } from "react-icons/md";

const dummyImage = "https://i.ibb.co/7yF2Mmx/dummy-user.png";

const clients = [
  {
    name: "Anjali Mehra",
    profession: "Interior Designer",
    image: "",
    comment:
      "Absolutely love the quality and delivery service. Super fast and very hygienic.",
    rating: 5,
  },
  {
    name: "Rajiv Sharma",
    profession: "Corporate Trainer",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    comment: "They have maintained great standards in every delivery!",
    rating: 4,
  },
  {
    name: "Priya Soni",
    profession: "Nutritionist",
    image: "",
    comment:
      "One of the most reliable services I’ve ever used. Affordable and clean.",
    rating: 3,
  },
  {
    name: "Mohit Verma",
    profession: "Cafe Owner",
    image: "https://randomuser.me/api/portraits/men/12.jpg",
    comment:
      "All my regular water needs are sorted thanks to their subscription. Highly recommend!",
    rating: 5,
  },
];

const ClientReview = () => {
  const [startIndex, setStartIndex] = useState(0);
  const visibleClients = clients.slice(startIndex, startIndex + 2);

  const next = () => {
    if (startIndex + 2 < clients.length) setStartIndex(startIndex + 2);
  };

  const prev = () => {
    if (startIndex - 2 >= 0) setStartIndex(startIndex - 2);
  };

  return (
    <div className="w-full py-10 px-4  text-gray-800 relative">
      <h5 className="text-center uppercase text-[#1D8599] font-semibold text-xl">
        Testimonials
      </h5>
      <h1 className="text-center text-4xl font-bold my-6 text-[#001442]">
        What Our Clients Say
      </h1>

      <div className="relative flex justify-center items-center">
        {/* Left Arrow */}
        <button
          onClick={prev}
          disabled={startIndex === 0}
          className={`absolute left-6 z-10 p-2 cursor-pointer rounded-full transition ${
            startIndex === 0
              ? "bg-gray-300 text-white opacity-40 cursor-not-allowed"
              : "bg-[#1D8599] text-white hover:bg-[#166d7d]"
          }`}
        >
          <MdArrowBackIosNew size={24} />
        </button>

        {/* Client Cards */}
        <div className="flex gap-8 flex-wrap justify-center">
          {visibleClients.map((client, idx) => (
            <div
              key={idx}
              className="bg-white w-[350px] shadow-xl p-6 rounded-xl relative"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={client.image || dummyImage}
                  alt={client.name}
                  className="w-14 h-14 rounded-full object-cover border"
                />
                <div>
                  <h4 className="font-semibold text-lg">{client.name}</h4>
                  <p className="text-sm text-gray-500">{client.profession}</p>
                </div>
              </div>
              <div className="text-sm text-gray-700 relative pl-6 mb-3">
                <FaQuoteRight className="absolute top-0 left-0 text-[#1D8599]" />
                {client.comment}
              </div>
              {/* Star Rating */}
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) =>
                  i < client.rating ? (
                    <FaStar key={i} className="text-yellow-400" />
                  ) : (
                    <FaRegStar key={i} className="text-yellow-400" />
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={next}
          disabled={startIndex + 2 >= clients.length}
          className={`absolute right-6 cursor-pointer z-10 p-2 rounded-full transition ${
            startIndex + 2 >= clients.length
              ? "bg-gray-300 text-white opacity-40 cursor-not-allowed"
              : "bg-[#1D8599] text-white hover:bg-[#166d7d]"
          }`}
        >
          <MdArrowForwardIos size={24} />
        </button>
      </div>
    </div>
  );
};

export default ClientReview;
