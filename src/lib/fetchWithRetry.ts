export async function fetchWithRetry(
  input: RequestInfo,
  init?: RequestInit,
  retries = 3,
  delayMs = 1000
): Promise<Response> {
  try {
    const response = await fetch(input, init);

    if (response.status === 503 && retries > 0) {
      // espera exponencial antes de reintentar
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      return fetchWithRetry(input, init, retries - 1, delayMs * 2);
    }
    return response;
  } catch (err) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      return fetchWithRetry(input, init, retries - 1, delayMs * 2);
    }
    throw err;
  }
}
