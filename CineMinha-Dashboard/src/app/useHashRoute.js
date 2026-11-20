import { useEffect, useState } from "react";

export function useHashRoute() {
  const readPath = () => window.location.hash.replace(/^#/, "") || "/dashboard";
  const [path, setPath] = useState(readPath);

  useEffect(() => {
    const onChange = () => setPath(readPath());
    window.addEventListener("hashchange", onChange);
    if (!window.location.hash) window.location.hash = "/dashboard";
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  const navigate = (nextPath) => {
    const hash = `#${nextPath.startsWith("/") ? nextPath : `/${nextPath}`}`;
    if (window.location.hash !== hash) window.location.hash = hash;
    else setPath(nextPath);
  };

  return { path, navigate };
}
