import { Parameter } from "@/app/vehicles/[id]/page";

const ParameterSection = ({
  title,
  parameters,
}: {
  title: string;
  parameters?: Parameter[];
}) => {
  if (!parameters || parameters.length === 0) return null;

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold font-family-cera-stencil text-secondary mb-4">
        {title}
      </h3>
      <div className="flex flex-col gap-4">
        {parameters.map((param, index) => (
          <div
            key={index}
            className="bg-white/5 border border-white/10 rounded-lg p-4"
          >
            <dt className="text-white/70 text-sm mb-1">{param.name}</dt>
            <dd className="text-white font-semibold">{param.value}</dd>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParameterSection;
