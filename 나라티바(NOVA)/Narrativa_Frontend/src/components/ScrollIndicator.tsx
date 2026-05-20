import { useState, useEffect } from "react";

const ScrollIndicator = () => {
  const [showScroll, setShowScroll] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = scrollHeight - 200;

      setShowScroll(scrollPosition < threshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!showScroll) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-10 bg-gray-800/80 text-white px-4 py-2 rounded-full backdrop-blur-sm animate-bounce flex justify-center items-center">
      ↓
    </div>
  );
};

export default ScrollIndicator;
