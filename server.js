export default {
  async fetch(request, env) {
    const type = request.headers.get("Type");
    const targetUrl = request.headers.get("url");

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

    // 🔵 GET request
    if (method === "GET") {
      const res = await fetch(url.toString(), {
        method: "GET"
      });

      return new Response(await res.text(), {
        status: res.status,
        headers: res.headers
      });
    }

    // 🟢 POST request (uses content.key)
    if (method === "POST") {
      const content = request.headers.get("content.key");

      const res = await fetch(url.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: content ?? ""
      });

      return new Response(await res.text(), {
        status: res.status,
        headers: res.headers
      });
    }

    return new Response("Type must be GET or POST", { status: 400 });
  }
};
