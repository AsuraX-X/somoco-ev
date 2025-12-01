// import FinanceSection from "@/components/Home/FinanceSection";
import Hero from "@/components/Home/Hero";
import Ready from "@/components/Home/Ready";
import Why from "@/components/Home/Why";
import Image from "next/image";

export const metadata = {
  title: "SOMOCO EV — Home",
  description:
    "SOMOCO EV — Electric vehicles, products and company information.",
};

const Home = () => {
  return (
    <div className="relative flex items-center justify-center h-screen w-full">
      {/* <Hero />
      <Why />
      <Ready />
      <FinanceSection /> */}
      <Image
        src={
          "https://images.unsplash.com/photo-1665127771643-0bc02014da61?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1164"
        }
        alt="EV"
        fill
        unoptimized
        className="object-cover"
      />
      <div className="w-fit h-fit flex flex-col bg-white/1 p-8 items-center shadow justify-center backdrop-blur-xs rounded-lg">
        <h1 id="title" className="font-family-cera-stencil text-6xl capitalize">
          Drive the future
        </h1>
        <p className="">Empowering Mobility in Ghana</p>
      </div>
    </div>
  );
};

export default Home;
