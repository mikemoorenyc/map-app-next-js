"use client"
import { createContext,  useState } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [stack, setStack] = useState([]);

  const setActive = (id) =>
    setStack((prev) => [...prev.filter((x) => x !== id), id]);

  const removeActive = (id) =>
    setStack((prev) => prev.filter((x) => x !== id));

  const getTop = () => stack[stack.length - 1];

  return (
    <ModalContext.Provider value={{ setActive, removeActive, getTop }}>
      {children}
    </ModalContext.Provider>
  );
};
export default ModalContext

