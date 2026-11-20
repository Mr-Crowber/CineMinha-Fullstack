const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5266").replace(/\/$/, "");

export function assetUrl(path) {
  if (!path) return "";
  const cleanPath = String(path).trim();
  if (/^https?:\/\//i.test(cleanPath)) {
    try {
      const parsed = new URL(cleanPath);
      if (["localhost", "127.0.0.1", "0.0.0.0"].includes(parsed.hostname))
        return `${API_URL}${parsed.pathname}${parsed.search}`;
    } catch { /* Mantém URLs externas quando não for possível interpretá-las. */ }
    return cleanPath;
  }
  return `${API_URL}/${cleanPath.replace(/^\/+/, "")}`;
}
