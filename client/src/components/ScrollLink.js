import { Link, useLocation } from "react-router-dom";

function normalizePath(path) {
  if (typeof path !== "string") return "";
  return path.replace(/\/$/, "") || "/";
}

export default function ScrollLink({ to, onClick, ...props }) {
  const location = useLocation();
  const targetPath = typeof to === "string" ? to : (to?.pathname ?? "");

  const handleClick = (e) => {
    if (normalizePath(location.pathname) === normalizePath(targetPath)) {
      e.preventDefault();
      window.scrollTo(0, 0);
    }
    onClick?.(e);
  };

  return <Link to={to} onClick={handleClick} {...props} />;
}
