import { Card } from "../components/Card";
import { SectionWrapper } from "../components/SectionWrapper";
import type { ClientConfig } from "../schema";

export function Offerings({ config }: { config: ClientConfig }) {
  if (!config.offerings || config.offerings.length === 0) return null;

  return (
    <SectionWrapper>
      <h2 className="text-fluid-h2 font-bold text-brand-text">
        Services & Pricing
      </h2>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {config.offerings.map((offering) => (
          <Card key={offering.name}>
            <h3 className="text-lg font-semibold text-brand-text">
              {offering.name}
            </h3>
            {offering.description && (
              <p className="mt-2 text-brand-text/80">{offering.description}</p>
            )}
            {offering.price && (
              <p className="mt-3 font-medium text-brand-primary">
                {offering.price}
              </p>
            )}
          </Card>
        ))}
      </div>
    </SectionWrapper>
  );
}
