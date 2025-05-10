import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Cargar la preferencia del usuario al iniciar
  useEffect(() => {
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(isDarkMode);
    applyDarkMode(isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    applyDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
  };

  const applyDarkMode = (isDarkMode: boolean) => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const spring = {
    type: "spring",
    stiffness: 700,
    damping: 30,
  };

  return (
    <motion.button
      onClick={toggleDarkMode}
      className={`rounded-full p-2.5 transition-colors focus:outline-none flex items-center justify-center ${
        darkMode
          ? "bg-indigo-800 hover:bg-indigo-700 shadow-inner"
          : "bg-yellow-100 hover:bg-yellow-200 shadow"
      }`}
      aria-label={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={spring}
    >
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: darkMode ? 360 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {darkMode ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Moon className="h-5 w-5 text-white" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Sun className="h-5 w-5 text-yellow-600" />
          </motion.div>
        )}
      </motion.div>
    </motion.button>
  );
};

export default DarkModeToggle;
