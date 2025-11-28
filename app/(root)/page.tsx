import FinanceSection from "@/components/Home/FinanceSection";
import Hero from "@/components/Home/Hero";
import Ready from "@/components/Home/Ready";
import Why from "@/components/Home/Why";

export const metadata = {
  title: "SOMOCO EV — Home",
  description:
    "SOMOCO EV — Electric vehicles, products and company information.",
};

const Home = () => {
  return (
    <div>
      <Hero />
      <Why />
      <Ready />
      {/* <FinanceSection /> */}
    </div>
  );
};

export default Home;
