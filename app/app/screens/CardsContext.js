import React, { createContext, useState } from "react";

export const CardsContext = createContext();

export const CardsProvider = ({ children }) => {
  const [cards, setCards] = useState([]);
  const [finalStats, setFinalStats] = useState([]);

  return (
    <CardsContext.Provider value={{ cards, setCards, finalStats, setFinalStats }}>
      {children}
    </CardsContext.Provider>
  );
};