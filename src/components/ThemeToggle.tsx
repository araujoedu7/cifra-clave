'use client';

export default function ThemeToggle() {
  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="text-gray-600 dark:text-gray-300 hover:text-primary transition"
    >
      Alternar Modo
    </button>
  );
}