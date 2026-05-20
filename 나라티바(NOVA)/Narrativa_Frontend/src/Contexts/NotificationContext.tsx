import React, { createContext, useContext, useState, ReactNode } from "react";

type NotificationContextType = {
  isNotificationsOn: boolean;
  toggleNotifications: () => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [isNotificationsOn, setIsNotificationsOn] = useState(true);

  const toggleNotifications = () => {
    setIsNotificationsOn((prev) => {
      console.log("isNotificationsOn: ", !prev);
      return !prev;
    });
  };

  return (
    <NotificationContext.Provider
      value={{ isNotificationsOn, toggleNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
