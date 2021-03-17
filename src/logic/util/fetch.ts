
export const JSON_HEADERS = {
  'Content-Type': 'application/json'
};

type Method = "POST" | "GET" | "PUT" | "DELETE";
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
    if (resp.status >= 400) {
      //call was unsuccessful
      console.error(resp);
      throw Error(`Network Error(${resp.status}): ${method} ${url} failed`)
    }

    try {
      return (await resp.json()) as ReturnType;
    } catch (e) {
      console.error(resp);
      throw Error("Network Error: Unable to parse Json");
    }
  } catch (e) {
    console.error(`Network Error: Unable to call ${method} ${url}`);
    console.log(e);
    throw e;
  }
}
