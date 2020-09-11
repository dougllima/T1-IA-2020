import React, { useEffect, useState } from "react";
import Labirinto from "../Models/Labirinto";
import Solucao from "../Models/Solucao";
import { getRandomInt } from "./Util";
import labTeste from "../tests/labTeste1.json";

// Frescura do react pra poder acessar isso de pontos especificos da aplicação sem precisar passar por vários componentes
const { Provider, Consumer } = React.createContext({});

type AlgGenConfig = {
  tamSolucao: number;
  maxGeracoes: number;
  taxaMutacao: number;
  tamPopulacao: number;
  pontosDeCorte: number;

  posicaoFinal: number[];
  posicaoInicial: number[];
};

const DEFAULT_CONFIG: AlgGenConfig = {
  tamSolucao: 120,
  maxGeracoes: 50,
  taxaMutacao: 5,
  tamPopulacao: 20,
  pontosDeCorte: 1,

  posicaoFinal: [11, 11],
  posicaoInicial: [0, 0],
};

const AlgGenProvider = (props) => {
  const [config, setConfig] = useState<AlgGenConfig>(DEFAULT_CONFIG);
  const [labirinto, setLabirinto] = useState<Labirinto>(
    new Labirinto(labTeste)
  );

  const [geracoes, setGeracoes] = useState(new Array(config.maxGeracoes));
  const [populacao, setPopulacao] = useState<Solucao[]>([]);
  const [populacaoIntermediaria, setPopulacaoIntermediaria] = useState<
    Solucao[]
  >([]);

  // Se mudar o labirinto, já procura quais as posições inicial e final (pra não ter que percorrer ele toda vez que for calcular aptidão ou verificar se terminou)
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
    setGeracoes(new Array(config.maxGeracoes));
    setPopulacaoIntermediaria(new Array(config.tamPopulacao));
  };

  const run = () => {
    let geracaoAtual = 1;
    init();

    do {
      // Limpa população intermediaria.
      setPopulacaoIntermediaria(new Array(config.tamPopulacao));

      // Calcula a aptidão das soluções geradas.
      atribuiAptidao();

      // Coloca melhor solução na proxima geração.
      copiaMelhorSolucao();

      // Realiza o cruzamento
      crossOver();

      // Realiza a mutação
      if (geracaoAtual % config.taxaMutacao == 0) {
        mutacao();
      }

      // Passa a população intermediaria para a população atual.
      setPopulacao([...populacaoIntermediaria]);

      // Salva geração para exibição depois.
      setGeracoes((geracoesAtual) => {
        geracoesAtual[geracaoAtual] = populacao;
        return geracoesAtual;
      });

    } while (geracaoAtual <= config.maxGeracoes);
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
  const identificaMelhorSolucao = (): number => {
    let melhorLinha = 0;
    for (let i = 0; i < populacao.length; i++) {
      if (populacao[i].aptidao < populacao[melhorLinha].aptidao) {
        melhorLinha = i;
      }
    }
    return melhorLinha;
  };

  /**
   * Pega a melhor solução da população atual e salva na primeira posição da solução intermediaria.
   *
   */
  const copiaMelhorSolucao = () => {
    setPopulacaoIntermediaria((populacaoAtual) => {
      populacaoAtual[0] = populacao[identificaMelhorSolucao()];

      return populacaoAtual;
    });
  };

  /**
   * Realiza o torneio entre duas soluções aleatórias, escolhendo a melhor.
   *
   * @return {*} {number} Indice da solução escolhida
   */
  const torneio = (): number => {
    const linhaUm = getRandomInt(0, config.tamPopulacao);
    const linhaDois = getRandomInt(0, config.tamPopulacao);

    if (populacao[linhaUm].aptidao < populacao[linhaDois].aptidao) {
      return linhaUm;
    }
    return linhaDois;
  };

  /**
   * Realiza o cruzamento de duas soluções, e adiciona o resultado a população intermediaria.
   *
   */
  const crossOver = () => {
    for (let i = 1; i < config.tamPopulacao; i++) {
      const idxMae = torneio();
      const idxPai = torneio();

      setPopulacaoIntermediaria((populacaoAtual) => {
        const tamanhoCorte = Math.floor(
          config.tamSolucao / (config.pontosDeCorte + 1)
        );

        for (let j = 0; j < tamanhoCorte; j++) {
          for (let k = 0; k < config.pontosDeCorte; k++) {
            const posicao = j + tamanhoCorte * k;
            if (config.pontosDeCorte % 2 == 0) {
              populacaoAtual[i][posicao] = populacao[idxMae][posicao];
            } else {
              populacaoAtual[i][posicao] = populacao[idxPai][posicao];
            }
          }
        }

        return populacaoAtual;
      });
    }
  };

  /**
   * Muta um comando aleatório de uma solução aleatória da população intermediaria.
   *
   * @memberof AlgGenProvider
   */
  const mutacao = () => {
    setPopulacaoIntermediaria((populacaoAtual) => {
      const idxSolucao = getRandomInt(1, config.tamPopulacao - 1);
      const idxMutacao = getRandomInt(0, config.tamSolucao);

      const comandoAtual = populacaoAtual[idxSolucao].comandos[idxMutacao];
      let comandoNovo = "";

      do {
        comandoNovo = Solucao.COMANDOS[getRandomInt(0, 3)];
      } while (comandoAtual == comandoNovo);

      populacaoAtual[idxSolucao].comandos[idxMutacao] = comandoNovo;

      // Calcula nova aptidão com a solução mutada.
      populacaoAtual[idxSolucao] = calculaAptidao(populacaoAtual[idxSolucao]);
      return populacaoAtual;
    });
  };

  return (
    <Provider
      value={{
        run,
        config,
        geracoes,
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
