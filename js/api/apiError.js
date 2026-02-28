export async function apiError(fn, context = "Request failed") {
  try {
    return await fn();
  } catch (error) {
    console.error(context, error);
    throw error;
  }
}
