import Banner from "../components/Banner";
import BlogContent from "../components/BlogContent";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const Blog = () => {
  const title = "Insights & Inspirations";
  const p =
    "Discover the latest trends, expert insights, and stories that inspire innovation and ignite creativity in our ever-evolving world.";
  const quote =
    "Sharing knowledge, sparking ideas, and nurturing growth one story at a time.";

  return (
    <div className="w-full  relative">
      <Navbar />
      <Banner title={title} p={p} quote={quote} />
      <BlogContent />
      <Footer />
    </div>
  );
};
export default Blog;
