
type Method = "POST" | "GET" | "PUT" | "DELETE:;
export const fetchJson = async <ReturnType=unknown>(url: string, method: Method = "GET", body?: object, options: RequestInit={}) : Promise<ReturnType> => {
  try {
    const resp = await fetch(url, {
      ...options,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: JSON.stringify(body)
    });
    return (await resp.json()) as ReturnType;
  } catch (e) {
    console.error(`Network Error: Unable to call ${method} ${url}`);
    console.log(JSON.stringify(e.response.data));
    throw e;
  }
}
