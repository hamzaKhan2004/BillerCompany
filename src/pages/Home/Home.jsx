import Banner from "../../components/Banner";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import SmallBanner from "../../components/SmallBanner";
import ClientReview from "./ClientReview";
import HomeContent from "../../components/BlogContent";
import HomeMiddle from "./HomeMiddle";
import HomeProDetail from "./HomeProDetail";
import HomeProducts from "./HomeProducts";

const Home = () => {
  const title = "Welcome to Biller";
  const p = "Pure water, pure trust.";
  const quote =
    "Thousands have lived without love, not one without water. — W. H. Auden";

  return (
    <div className="w-full  relative ">
      <Navbar />
      <Banner title={title} p={p} quote={quote} />
      <HomeMiddle />
      <HomeProDetail />
      <HomeProducts />
      <SmallBanner />
      <HomeContent />
      <ClientReview />
      <Footer />
    </div>
  );
};
export default Home;
