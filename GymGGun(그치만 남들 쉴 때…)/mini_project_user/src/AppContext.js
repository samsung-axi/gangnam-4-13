import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isToggled, setIsToggled] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [name, setName] = useState("ㅁㅁㅁ");

  const toggle = () => setIsToggled((prev) => !prev);

  return (
    <AppContext.Provider value={{ isToggled, setIsToggled, toggle, imageData, name, setName, setImageData }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
