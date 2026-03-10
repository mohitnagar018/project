import fetch from "node-fetch";

const apiKey = process.env.GOOGLE_API_KEY;
const endpoint = `https://generativelanguage.googleapis.com/v1beta2/models?key=${apiKey}`;

async function listModels() {
  const res = await fetch(endpoint);
  const data = await res.json();
  console.log(data);
}

listModels();