const fetch = global.fetch || require("node-fetch");
(async () => {
  try {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test User",
        email: `testuser${Date.now()}@example.com`,
        password: "Passw0rd!",
      }),
    });
    const text = await res.text();
    console.log("status", res.status);
    console.log(text);
  } catch (err) {
    console.error("request error", err);
  }
})();
