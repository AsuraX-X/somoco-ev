const Section = ({
  carName,
  carImage,
  spec1,
  spec1Value,
  spec2,
  spec2Value,
}: {
  carName: string;
  carImage: string;
  spec1: string;
  spec1Value: string;
  spec2: string;
  spec2Value: string;
}) => {
  return (
    <div className="h-screen">
      <div
        className="bg-cover bg-center h-full w-full text-white"
        style={{
          backgroundImage: `url(${carImage})`,
        }}
      >
        <div className="w-full h-full bg-black/40 flex flex-col items-center sm:items-start justify-end px-4 sm:px-16 py-10">
          <h1 className="text-4xl sm:text-6xl mb-10 font-bold font-family-cera-stencil">
            {carName}
          </h1>
          <div className="flex text-center sm:text-left  divide-x">
            <p className="text-xl pr-5">
              <span className="text-xs">
                {spec1} <br />
              </span>{" "}
              {spec1Value}
            </p>
            <p className="text-xl pl-5">
              <span className="text-xs">
                {spec2} <br />
              </span>{" "}
              {spec2Value}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Section;
