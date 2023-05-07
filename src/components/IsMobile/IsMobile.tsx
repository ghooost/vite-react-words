import { createContext, useEffect, useState } from "react";

type IsMobilResult = undefined | boolean;

export const IsMobileContext = createContext<IsMobilResult>(undefined);

type Props = {
  mobileWidth: number;
  children: JSX.Element;
};

export const IsMobile = ({ mobileWidth, children }: Props) => {
  const [isMobileValue, setIsMobileValue] = useState<IsMobilResult>(undefined);

  useEffect(() => {
    const resizer = () => {
      setIsMobileValue(window.innerWidth < mobileWidth);
    };
    window.addEventListener("resize", resizer);
    resizer();
    return () => window.removeEventListener("resize", resizer);
  }, [mobileWidth, setIsMobileValue]);

  return (
    <IsMobileContext.Provider value={isMobileValue}>
      {children}
    </IsMobileContext.Provider>
  );
};
