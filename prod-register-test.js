const fetch = global.fetch || require("node-fetch");
(async () => {
  try {
    const startTime = Date.now();
    const timestamp = Date.now();
    const testName =`Prod Test ${timestamp}`;
    const res = await fetch(
      "https://travel-plans.onrender.com/api/auth/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: testName,
          email: `prodtest${Date.now()}@example.com`,
          password: "Passw0rd!",
        }),
      },
    );
    const text = await res.text();
    console.log("status", res.status);
    console.log(text);
  } catch (err) {
    console.error("request error", err.message || err);
  }
})();
