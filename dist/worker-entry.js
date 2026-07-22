const FALLBACK_HTML = "/index.html";

function wantsHtml(request) {
  const accept = request.headers.get("accept") || "";
  return accept.includes("text/html");
}

function assetRequest(request, pathname) {
  const url = new URL(request.url);
  url.pathname = pathname;
  return new Request(url.toString(), request);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname === "/" ? FALLBACK_HTML : url.pathname;

    let response = await env.ASSETS.fetch(assetRequest(request, pathname));
    if (response.status !== 404) {
      return response;
    }

    if (wantsHtml(request)) {
      response = await env.ASSETS.fetch(assetRequest(request, FALLBACK_HTML));
      if (response.status !== 404) {
        return response;
      }
    }

    return new Response("Not found", { status: 404 });
  }
};
