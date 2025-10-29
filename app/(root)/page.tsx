import Section from "@/components/Home/Section";

export const metadata = {
  title: "SOMOCO EV — Home",
  description:
    "SOMOCO EV — Electric vehicles, products and company information.",
};

const Home = () => {
  return (
    <div>
      <Section
        carName="BYD Seagull"
        carImage="/seagull.webp"
        spec1="EPA EST. RANGE"
        spec1Value="Up to 405 Km"
        spec2="POWER"
        spec2Value="Up to 55 kw"
      />
      <Section
        carName="Xpeng G6"
        carImage="/xpeng.jpg"
        spec1="EPA EST. RANGE"
        spec1Value="Up to 427 Km"
        spec2="0–100 km/h (AWD)"
        spec2Value="In 4.13 s"
      />
      <Section
        carName="NIO ONVO L90"
        carImage="/l90.jpg"
        spec1="EPA EST. RANGE"
        spec1Value="Up to 570 Km"
        spec2="POWER"
        spec2Value="Up to 440 kw"
      />
      <Section
        carName="Tesla Model Y"
        carImage="/tesla.jpg"
        spec1="EPA EST. RANGE"
        spec1Value="Up to 321 Km"
        spec2="POWER"
        spec2Value="Up to 331kw"
      />
      <Section
        carName=""
        carImage="/charging.jpg"
        spec1=""
        spec1Value=""
        spec2=""
        spec2Value=""
      />
    </div>
  );
};

export default Home;
