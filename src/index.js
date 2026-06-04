export default {
  async fetch(request, env) {
    const type = request.headers.get("Type");
    const targetUrl = request.headers.get("url");
    const key = request.headers.get("proxy-access-key");

    // 🔐 Auth check
    if (!key || key !== env.ACCESS_KEY) {
      return new Response("Invalid access key", { status: 403 });
    }

    if (!type || !targetUrl) {
      return new Response("Missing Type or url header", { status: 400 });
    }

    let url;
    try {
      url = new URL(targetUrl);
    } catch {
      return new Response("Invalid URL", { status: 400 });
    }

    const method = type.toLowerCase();

    // 🌐 GET request
    if (method === "get") {
      const res = await fetch(url.toString(), {
        method: "GET",
        headers: request.headers
      });

      return new Response(await res.text(), {
        status: res.status,
        headers: res.headers
      });
    }

    // 📦 POST request
    if (method === "post") {
      const content = request.headers.get("content.key");

      const res = await fetch(url.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: content || ""
      });

      return new Response(await res.text(), {
        status: res.status,
        headers: res.headers
      });
    }

    return new Response("Type must be GET or POST", { status: 400 });
  }
};
