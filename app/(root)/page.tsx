import Hero from "@/components/Home/Hero";
import Sections from "@/components/Home/Sections";

export const metadata = {
  title: "SOMOCO EV — Home",
  description:
    "SOMOCO EV — Electric vehicles, products and company information.",
};

const Home = () => {
  return (
    <div>
      <Hero />
      <Sections />
    </div>
  );
};

export default Home;
