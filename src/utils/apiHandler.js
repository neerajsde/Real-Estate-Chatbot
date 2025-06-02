export default async function apiHandler(pathname, method = "GET", body = null) {
  try {
    const headers = {};
    const options = {
      method,
      headers,
      credentials: "include",
    };

    // Handle request body
    if (method !== "GET" && body) {
      if (body instanceof FormData) {
        options.body = body;
      } else {
        headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(body);
      }
    }

    const baseUrl = import.meta.env.VITE_BASE_URL;
    const response = await fetch(`${baseUrl}${pathname}`, options);
    const result = await response.json();
    return result;

  } catch (error) {
    return { success: false, message: error.message };
  }
}
