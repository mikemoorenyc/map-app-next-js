"use client"
import { createContext,  useState ,ReactElement} from 'react';
type TModalContext = {
  setActive: Function,
  removeActive: Function,
  getTop:Function
}

const ModalContext = createContext<TModalContext>({
  setActive:()=>{},
  removeActive:()=>{},
  getTop:()=>{}
});

export const ModalProvider = ({ children }:{children:ReactElement[]|ReactElement}) => {
  const [stack, setStack] = useState<string[]>([]);

  const setActive = (id:string) =>
    setStack((prev) => [...prev.filter((x) => x !== id), id]);

  const removeActive = (id:string) =>
    setStack((prev) => prev.filter((x) => x !== id));

  const getTop = () => stack[stack.length - 1];

  return (
    <ModalContext.Provider value={{ setActive, removeActive, getTop }}>
      {children}
    </ModalContext.Provider>
  );
};
export default ModalContext

