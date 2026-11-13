import { Button } from "../components/Button";
import type { ClientConfig } from "../schema";

export function Header({ config }: { config: ClientConfig }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-text/10 bg-brand-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <div className="flex min-w-0 items-center gap-3">
          {config.logo && (
            <img
              src={config.logo.src}
              alt={config.logo.alt}
              className="h-10 w-auto object-contain"
            />
          )}
          <span className="truncate text-xl font-bold text-brand-text">
            {config.name}
          </span>
        </div>
        <Button href={`tel:${config.phone}`} className="shrink-0">
          Call Now
        </Button>
      </div>
    </header>
  );
}
