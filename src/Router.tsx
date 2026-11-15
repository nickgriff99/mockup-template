import { useEffect, useState } from "react";
import { preload, preinit } from "react-dom";
import { loadClientRegistry, isZodError } from "./clients";
import type { ClientLoadError, ClientRegistry } from "./clients";
import type { ClientConfig } from "./schema";
import { warnIfThemeContrastFails } from "./lib/contrast";
import { googleFontsHref } from "./lib/fonts";
import { Header } from "./sections/Header";
import { Hero } from "./sections/Hero";
import { QuickInfoBar } from "./sections/QuickInfoBar";
import { Offerings } from "./sections/Offerings";
import { About } from "./sections/About";
import { Reviews } from "./sections/Reviews";
import { Gallery } from "./sections/Gallery";
import { HoursLocation } from "./sections/HoursLocation";
import { FinalCTA } from "./sections/FinalCTA";
import { Footer } from "./sections/Footer";
import { StickyMobileCTA } from "./components/StickyMobileCTA";

// Strip leading/trailing slashes to get the slug. "" means root (owner listing page).
export function getSlugFromPathname(pathname: string): string {
  return pathname.replace(/^\/+/, "").replace(/\/+$/, "");
}

function DevErrorOverlay({ errors }: { errors: ClientLoadError[] }) {
  if (errors.length === 0) return null;
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        maxHeight: "40vh",
        overflowY: "auto",
        background: "#1a0000",
        color: "#ffb4b4",
        fontFamily: "monospace",
        fontSize: "0.85rem",
        padding: "1rem",
        zIndex: 9999,
        borderTop: "2px solid #ff4444",
      }}
    >
      <strong>
        {errors.length} client config{errors.length > 1 ? "s" : ""} failed to
        load (dev only):
      </strong>
      {errors.map(({ slug, error }) => (
        <div key={slug} style={{ marginTop: "0.5rem" }}>
          <div>src/clients/{slug}.ts</div>
          {isZodError(error) ? (
            <ul>
              {error.issues.map((issue, i) => (
                <li key={i}>
                  {issue.path.join(".") || "(root)"}: {issue.message}
                </li>
              ))}
            </ul>
          ) : (
            <div>{String(error)}</div>
          )}
        </div>
      ))}
    </div>
  );
}

function OwnerListing({ clients }: { clients: Map<string, ClientConfig> }) {
  const slugs = [...clients.keys()];
  return (
    <div>
      <h1>Clients</h1>
      {slugs.length === 0 ? (
        <p>No clients yet.</p>
      ) : (
        <ul>
          {slugs.map((slug) => (
            <li key={slug}>
              <a href={`/${slug}`}>{slug}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Pure so the theme-wiring fix is verifiable without a DOM/browser: given a
// config, these are the exact CSS custom properties that re-skin the page.
export function buildThemeStyle(config: ClientConfig): React.CSSProperties {
  return {
    "--color-primary": config.theme.primary,
    "--color-accent": config.theme.accent,
    "--color-background": config.theme.background,
    "--color-text": config.theme.text,
    "--font-heading": `"${config.theme.fontHeading}", ui-sans-serif, system-ui, sans-serif`,
    "--font-body": `"${config.theme.fontBody}", ui-sans-serif, system-ui, sans-serif`,
  } as React.CSSProperties;
}

function ClientPage({ slug, config }: { slug: string; config: ClientConfig }) {
  useEffect(() => {
    if (import.meta.env.DEV) {
      warnIfThemeContrastFails(slug, config.theme.text, config.theme.background);
    }
  }, [slug, config]);

  // Hero image is the LCP element — preload it as soon as its per-client URL is known.
  preload(config.heroImage.src, { as: "image", fetchPriority: "high" });
  // Load this client's font pairing (display=swap avoids invisible-text flash);
  // preinit dedupes by href so re-renders don't re-fetch.
  preinit(googleFontsHref(config.theme.fontHeading, config.theme.fontBody), {
    as: "style",
  });

  return (
    <div style={buildThemeStyle(config)} className="pb-20 md:pb-0">
      {/* pb-20 reserves space for StickyMobileCTA (fixed, mobile-only) so it
          doesn't overlap Footer content once it appears past the hero. */}
      <Header config={config} />
      <main>
        <Hero config={config} />
        <QuickInfoBar config={config} />
        <Offerings config={config} />
        <About config={config} />
        <Reviews config={config} />
        <Gallery config={config} />
        <HoursLocation config={config} />
        <FinalCTA config={config} />
      </main>
      <Footer config={config} />
      <StickyMobileCTA config={config} />
    </div>
  );
}

function NotFound({ slug }: { slug: string }) {
  return <p>No client found for "{slug}".</p>;
}

export function Router() {
  const [registry, setRegistry] = useState<ClientRegistry | null>(null);

  useEffect(() => {
    loadClientRegistry().then(setRegistry);
  }, []);

  if (!registry) return null;

  const slug = getSlugFromPathname(window.location.pathname);
  const errors = import.meta.env.DEV ? registry.errors : [];

  let page: React.ReactNode;
  if (slug === "") {
    page = <OwnerListing clients={registry.clients} />;
  } else {
    const config = registry.clients.get(slug);
    page = config ? (
      <ClientPage slug={slug} config={config} />
    ) : (
      <NotFound slug={slug} />
    );
  }

  return (
    <>
      {page}
      <DevErrorOverlay errors={errors} />
    </>
  );
}
