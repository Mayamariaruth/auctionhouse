// Fetch element from correct path
export function fetchPath(path) {
  const currentPath = window.location.pathname;

  let adjustedPath = path;

  // Remove html path
  if (currentPath.includes("/html/") && path.startsWith("html/")) {
    adjustedPath = path.replace(/^html\//, "");
  }

  return fetch(adjustedPath);
}
