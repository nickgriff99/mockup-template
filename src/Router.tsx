import { useEffect, useState } from "react";
import { loadClientRegistry, isZodError } from "./clients";
import type { ClientLoadError, ClientRegistry } from "./clients";
import type { ClientConfig } from "./schema";

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

function ClientPage({ config }: { config: ClientConfig }) {
  // Section components come in a later stage; this just proves routing + data wiring.
  return (
    <div>
      <h1>{config.name}</h1>
      <p>{config.tagline}</p>
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
    page = config ? <ClientPage config={config} /> : <NotFound slug={slug} />;
  }

  return (
    <>
      {page}
      <DevErrorOverlay errors={errors} />
    </>
  );
}
