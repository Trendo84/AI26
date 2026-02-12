exports.handler = async function(event, context) {
  try {
    const res = await fetch("https://gamma-api.polymarket.com/markets?active=true&closed=false&limit=100&order=volume&ascending=false");
    if (!res.ok) throw new Error("API " + res.status);
    const data = await res.json();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
