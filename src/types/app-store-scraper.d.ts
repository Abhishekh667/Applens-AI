// Minimal type declaration for the untyped CommonJS `app-store-scraper` package.
// We only use a small, best-effort slice of its API.
declare module "app-store-scraper" {
  interface AppOptions {
    id?: number;
    appId?: string;
    country?: string;
    lang?: string;
  }
  interface AppResult {
    subtitle?: string;
    [key: string]: unknown;
  }
  const store: {
    app(opts: AppOptions): Promise<AppResult>;
  };
  export default store;
}
