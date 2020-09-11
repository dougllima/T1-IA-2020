import React, { useEffect, useState } from "react";
import Labirinto from "../Models/Labirinto";
import Solucao from "../Models/Solucao";
import { getRandomInt } from "./Util";
import labTeste from "../tests/labTeste1.json";

// Frescura do react pra poder acessar isso de pontos especificos da aplicação sem precisar passar por vários componentes
const { Provider, Consumer } = React.createContext({});

type AlgGenConfig = {
  maxGeracoes: number;
  tamSolucao: number;
  tamPopulacao: number;
  taxaMutacao: number;
  posicaoInicial: number[];
  posicaoFinal: number[];
};

const DEFAULT_CONFIG: AlgGenConfig = {
  maxGeracoes: 50,
  tamSolucao: 120,
  tamPopulacao: 20,
  taxaMutacao: 5,
  posicaoInicial: [0, 0],
  posicaoFinal: [11, 11],
};

const AlgGenProvider = (props) => {
  const [config, setConfig] = useState<AlgGenConfig>(DEFAULT_CONFIG);
  const [labirinto, setLabirinto] = useState<Labirinto>(
    new Labirinto(labTeste)
  );

  const [populacao, setPopulacao] = useState<Solucao[]>([]);
  const [populacaoIntermediaria, setPopulacaoIntermediaria] = useState<
    Solucao[]
  >([]);

  // Se mudar o labirinto, já procura qual a posição inicial (pra não ter que percorrer ele toda vez que for calcular aptidão)
  useEffect(() => {
    setConfig((config) => {
      return {
        ...config,
        posicaoInicial: labirinto.posicaoInicial(),
        posicaoFinal: labirinto.posicaoFinal(),
      };
    });
  }, [labirinto]);

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
   * Forma escolhida de calcular a aptidão:
   *  - Movimentos "impossiveis" são ignorados;
   *  - Valor da aptidão é definido pela distancia até a saida.
   *  - Como não busca a melhor solução, vou ignorar a quantidade de movimentos até sair.
   *
   * @param {Solucao} solucao
   */
  const calculaAptidao = (solucao: Solucao): Solucao => {
    let posicaoAtual = config.posicaoInicial;

    for (let i = 0; i < solucao.comandos.length; i++) {
      posicaoAtual = labirinto.caminhar(posicaoAtual, solucao.comandos[i]);
      if (labirinto[posicaoAtual[0]][posicaoAtual[1]] == Labirinto.ESPACOS.fim)
        break;
    }

    solucao.aptidao =
      config.posicaoFinal[0] -
      posicaoAtual[0] +
      (config.posicaoFinal[1] - posicaoAtual[1]);
    return solucao;
  };

  /**
   * Atribui a aptidão para cada solução da população atual.
   *
   */
  const atribuiAptidao = () => {
    setPopulacao((populacaoAtual) => {
      // Percorre todas soluções e calcula a aptidão de cada uma.
      return populacaoAtual.map((solucao) => calculaAptidao(solucao));
    });
  };

  /**
   * Identifica qual a melhor solução da população atual.
   *
   * @return {*}  {number} Indice da solução
   */
  const identificaMelhorLinha = (): number => {
    let melhorLinha = 0;
    for (let i = 0; i < populacao.length; i++) {
      if (populacao[i].aptidao < populacao[melhorLinha].aptidao) {
        melhorLinha = i;
      }
    }
    return melhorLinha;
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
        comandoNovo = Solucao.COMANDOS[getRandomInt(0, 3)];
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
        labirinto,
      }}
    >
      {props.children}
    </Provider>
  );
};

export { Consumer as AlgGenConsumer, AlgGenProvider };
