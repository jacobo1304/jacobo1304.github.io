import { useState, useEffect } from "react";
import { DarkModeSwitch } from "react-toggle-dark-mode";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const dark = stored !== "light";
    setIsDark(dark);
    document.documentElement.classList.toggle("light", !dark);
  }, []);

  const handleToggle = (checked: boolean) => {
    setIsDark(checked);
    document.documentElement.classList.toggle("light", !checked);
    localStorage.setItem("theme", checked ? "dark" : "light");
  };

  return (
    <DarkModeSwitch
      checked={isDark}
      onChange={handleToggle}
      size={22}
      sunColor="#ffa84d"
      moonColor="#ffa84d"
      style={{ transition: "transform 0.3s ease" }}
    />
  );
}
