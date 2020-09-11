import React, { useEffect, useState } from "react";
import Solucao from "../Models/Solucao";
import { getRandomInt } from "./util";


// Frescura do react pra poder acessar isso de pontos especificos da aplicação sem precisar passar por vários componentes
const { Provider, Consumer } = React.createContext({});

type AlgGenConfig = {
  maxGeracoes: number;
  tamSolucao: number;
  tamPopulacao: number;
  taxaMutacao: number;
};

const DEFAULT_CONFIG: AlgGenConfig = {
  maxGeracoes: 50,
  tamSolucao: 120,
  tamPopulacao: 20,
  taxaMutacao: 5,
};

const AlgGenProvider = (props) => {
  const [config, setConfig] = useState<AlgGenConfig>(DEFAULT_CONFIG);
  const [labirinto, setLabirinto] = useState<string[][]>([]);

  const [populacao, setPopulacao] = useState<Solucao[]>([]);
  const [populacaoIntermediaria, setPopulacaoIntermediaria] = useState<
    Solucao[]
  >([]);

  /**
   * Inicializa a população com soluções aleatórias.
   *
   * @memberof AlgGenProvider
   */
  const init = () => {
    setPopulacao(
      new Array(config.tamPopulacao).fill(new Solucao(config.tamSolucao))
    );
    setPopulacaoIntermediaria(new Array(config.tamPopulacao));
  };

  /**
   * Muta um comando aleatório de uma solução aleatória
   *
   * @memberof AlgGenProvider
   */
  const mutacao = () => {
    // Atualiza a populacao intermediaria com base no seu valor atual
    // (pega a população intermediaria atual, aplica a mutação e salva ela novamente, frescuras do react)
    setPopulacaoIntermediaria((populacaoAtual) => {
      const idxSolucao = getRandomInt(1, config.tamPopulacao - 1);
      const idxMutacao = getRandomInt(0, config.tamSolucao);

      const comandoAtual = populacaoAtual[idxSolucao].comandos[idxMutacao];
      let comandoNovo = "";

      do {
        comandoNovo = Solucao.COMANDOS_POSSIVEIS[getRandomInt(0, 3)];
      } while (comandoAtual == comandoNovo);

      populacaoAtual[idxSolucao].comandos[idxMutacao] = comandoNovo;
      return populacaoAtual;
    });
  };

  return (
    <Provider
      value={{
        config,
        setConfig,
        populacao,
        setLabirinto,
        labirinto
      }}
    >
      {props.children}
    </Provider>
  );
};

export { Consumer as AlgGenConsumer, AlgGenProvider };
