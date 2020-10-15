import React, { useState } from "react";
import Labirinto from "../Models/Labirinto";
import labTeste from "../tests/labTeste1.json";

type ContextValue = {
  labirinto: Labirinto;
  setLabirinto?;
};

const LabirintoContext = React.createContext<ContextValue>({
  labirinto: new Labirinto(labTeste),
});

const LabirintoProvider = (props) => {
  const [labirinto, setLabirinto] = useState<Labirinto>(
    new Labirinto(labTeste)
  );

  return (
    <LabirintoContext.Provider value={{ labirinto, setLabirinto }}>
      {props.children}
    </LabirintoContext.Provider>
  );
};

export { LabirintoContext, LabirintoProvider };
