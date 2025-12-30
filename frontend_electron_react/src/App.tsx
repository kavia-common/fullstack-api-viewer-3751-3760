import React, { useEffect, useMemo, useState } from "react";
import { getApiBaseUrl } from "./lib/apiBaseUrl";

type HelloResponse = {
  message?: string;
  [key: string]: unknown;
};

type LoadState =
  | { status: "idle" | "loading" }
  | { status: "error"; error: string }
  | { status: "success"; data: HelloResponse };

function formatError(err: unknown): string {
  if (err instanceof Error) return err.message;
  return typeof err === "string" ? err : "Unknown error";
}

async function fetchHello(apiBaseUrl: string, signal: AbortSignal): Promise<HelloResponse> {
  const url = `${apiBaseUrl}/hello`;
  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    mode: "cors",
    signal
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Request failed: ${res.status} ${res.statusText}${text ? ` - ${text}` : ""}`);
  }
  return (await res.json()) as HelloResponse;
}

// PUBLIC_INTERFACE
export default function App() {
  /** Main renderer UI: centered "Hello World" card + backend response. */
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
  const [state, setState] = useState<LoadState>({ status: "idle" });

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: "loading" });

    fetchHello(apiBaseUrl, controller.signal)
      .then((data) => setState({ status: "success", data }))
      .catch((err) => {
        if (controller.signal.aborted) return;
        setState({ status: "error", error: formatError(err) });
      });

    return () => controller.abort();
  }, [apiBaseUrl]);

  return (
    <div className="appRoot">
      <main className="centerStage">
        <section className="card" aria-label="Hello World card">
          <div className="cardHeader">
            <div className="badge" aria-hidden="true">
              API
            </div>
            <div className="titleBlock">
              <h1 className="title">Hello World</h1>
              <p className="subtitle">
                Ocean Professional • Fetching <code className="inlineCode">/hello</code> from{" "}
                <code className="inlineCode">{apiBaseUrl}</code>
              </p>
            </div>
          </div>

          <div className="divider" />

          <div className="content">
            {state.status === "loading" || state.status === "idle" ? (
              <div className="statusRow" role="status" aria-live="polite">
                <div className="spinner" aria-hidden="true" />
                <div>
                  <div className="statusTitle">Loading response…</div>
                  <div className="statusHint">If this hangs, ensure the backend exposes <code className="inlineCode">/hello</code> and is reachable.</div>
                </div>
              </div>
            ) : state.status === "error" ? (
              <div className="errorBox" role="alert">
                <div className="errorTitle">Could not load /hello</div>
                <div className="errorMessage">{state.error}</div>
                <div className="errorHint">
                  Tip: set <code className="inlineCode">window.env.API_BASE_URL</code> or <code className="inlineCode">API_BASE_URL</code> to the backend URL.
                </div>
              </div>
            ) : state.status === "success" ? (
              <>
                <div className="successRow">
                  <span className="pill">Success</span>
                  <span className="muted">Response JSON</span>
                </div>
                <pre className="jsonBlock">{JSON.stringify(state.data, null, 2)}</pre>
              </>
            ) : null}
          </div>

          <div className="cardFooter">
            <button
              className="button"
              type="button"
              onClick={() => {
                // Simple refresh mechanism
                const controller = new AbortController();
                setState({ status: "loading" });
                fetchHello(apiBaseUrl, controller.signal)
                  .then((data) => setState({ status: "success", data }))
                  .catch((err) => setState({ status: "error", error: formatError(err) }));
              }}
            >
              Refresh
            </button>
            <span className="footerNote">CORS: renderer uses standard <code className="inlineCode">fetch</code> with <code className="inlineCode">mode: "cors"</code>.</span>
          </div>
        </section>
      </main>
    </div>
  );
}
