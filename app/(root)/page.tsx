import Section from "@/components/Home/Section";

const Home = () => {
  return (
    <div>
      <Section
        carName="BYD Seagull"
        carImage="/seagull.jpg"
        spec1="EPA EST. RANGE"
        spec1Value="Up to 405 Km"
        spec2="POWER"
        spec2Value="Up to 55 kw"
      />
      <Section
        carName="Changan Deepal S07"
        carImage="/cdp.jpg"
        spec1="EPA EST. RANGE"
        spec1Value="Up to 475 Km"
        spec2="POWER"
        spec2Value="Up to 160 kw"
      />
      <Section
        carName="Zeeker 001"
        carImage="/zeeker.avif"
        spec1="EPA EST. RANGE"
        spec1Value="Up to 620 Km"
        spec2="POWER"
        spec2Value="Up to 400 kw"
      />
      <Section
        carName="BYD Song Plus"
        carImage="/songplus.jpg"
        spec1="EPA EST. RANGE"
        spec1Value="Up to 505 Km"
        spec2="HORSE POWER"
        spec2Value="Up to 218 Ps"
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
