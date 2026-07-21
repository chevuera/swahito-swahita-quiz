const FALLBACK_HTML = "/index.html";

function isLikelyHtmlRequest(request) {
  const accept = request.headers.get("accept") || "";
  return accept.includes("text/html");
}

function buildAssetRequest(request, pathname) {
  const assetUrl = new URL(request.url);
  assetUrl.pathname = pathname;
  return new Request(assetUrl.toString(), request);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname === "/" ? FALLBACK_HTML : url.pathname;

    let response = await env.ASSETS.fetch(buildAssetRequest(request, pathname));
    if (response.status !== 404) {
      return response;
    }

    if (isLikelyHtmlRequest(request)) {
      response = await env.ASSETS.fetch(buildAssetRequest(request, FALLBACK_HTML));
      if (response.status !== 404) {
        return response;
      }
    }

    return new Response("Not found", { status: 404 });
  }
};
