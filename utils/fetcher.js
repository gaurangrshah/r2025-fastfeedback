export default async function fetcher(url, token) {
  // ❌  const res = await fetch(...args);
  const res = await fetch(url, {
    method: 'GET',
    // include token from request with headers
    headers: new Headers({ 'Content-Type': 'application/json', token }),
    credentials: 'same-origin',
  });

  return res.json();
}
