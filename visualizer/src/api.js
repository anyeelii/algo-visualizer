export async function runAlgorithm(category, name, body) {
  const baseUrl = "http://localhost:8000/api";
  const url = `${baseUrl}/${category}-searches/${name}/`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}