import React, { useEffect, useState } from "react";
import Labirinto from "../Models/Labirinto";
import Solucao from "../Models/Solucao";
import { getRandomInt } from "./Util";
import labTeste from "../tests/labTeste1.json";
import { GeneticoConfig } from "../Models/Configs";

type ContextValue = {
  run?;
  config: GeneticoConfig;
  running?: Boolean;
  resultado?;
  populacao?: Solucao[];
  labirinto?: Labirinto;
  setConfig?;
  setLabirinto?;
};

const DEFAULT_CONFIG: GeneticoConfig = {
  tamSolucao: 120,
  tamGeracoes: 50,
  tamPopulacao: 50,
  
  taxaMutacao: 2,
  qntMutacoes: 5,
  tamMutacoes: 20,

  funcAptidao: 0,
  pontosDeCorte: 1,

  posicaoFinal: [11, 11],
  posicaoInicial: [0, 0],
};

// Frescura do react pra poder acessar isso de pontos especificos da aplicação sem precisar passar por vários componentes
const GeneticoContext = React.createContext<ContextValue>({
  config: DEFAULT_CONFIG,
});

const GeneticoProvider = (props) => {
  const [config, setConfig] = useState<GeneticoConfig>(DEFAULT_CONFIG);
  const [labirinto, setLabirinto] = useState<Labirinto>(
    new Labirinto(labTeste)
  );
  const [resultado, setResultado] = useState<any[]>([]);

  let running = false;
  let geracaoAtual = 0;
  let geracoes = new Array(config.tamGeracoes);
  let populacao = new Array(config.tamPopulacao);
  let populacaoIntermediaria = new Array(config.tamPopulacao);

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
    for (let i = 0; i < populacao.length; i++) {
      populacao[i] = new Solucao(config.tamSolucao, true);
    }
    geracoes = new Array(config.tamGeracoes);
    geracaoAtual = 0;
  };

  const run = () => {
    if (!running) {
      running = true;
      init();

      console.count("Iniciando gerações");
      do {
        // Limpa população intermediaria.
        //console.count("Limpa população intermediaria.");
        for (let j = 0; j < config.tamPopulacao; j++) {
          populacaoIntermediaria[j] = new Solucao(config.tamSolucao);
        }

        // Calcula a aptidão das soluções geradas.
        //console.count("Calcula a aptidão das soluções geradas.");
        atribuiAptidao();

        //Salva a população atual para exibição depois.
        geracoes[geracaoAtual] = [...populacao];

        // Coloca melhor solução na proxima geração.
        //console.count("Coloca melhor solução na proxima geração.");
        copiaMelhorSolucao();

        // Realiza o cruzamento
        //console.count("Realiza o Cruzamento");
        crossOver();

        // Realiza a mutação
        //console.count("Realiza a Mutação")
        if (geracaoAtual % config.taxaMutacao === 0) {
          mutacao();
        }

        // Passa a população intermediaria para a população atual.
        populacao = [...populacaoIntermediaria];

        geracaoAtual = geracaoAtual + 1;
      } while (geracaoAtual < config.tamGeracoes);
      setResultado((res) => geracoes);
      running = false;
      console.log(
        geracoes.map(
          (value: Solucao[], index) =>
            value.map((e) => e.aptidao) + " - " + index
        )
      );
    }
  };

  /**
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
      if (
        labirinto.labirinto[posicaoAtual[0]][posicaoAtual[1]] ===
        Labirinto.ESPACOS.fim
      )
        break;
    }

    solucao.aptidao =
      config.posicaoFinal[0] -
      posicaoAtual[0] +
      (config.posicaoFinal[1] - posicaoAtual[1]);
    return solucao;
  };

  /**
   * - Valor base da aptidão é definido pela distancia até a saida.
   * - Movimentos "impossiveis" fazem a solução parar.
   * - A quantidade de comandos que faltaram ser executados é somada a apitidão
   * (Para descartar soluções que "dão problema cedo")
   *
   * @param {Solucao} solucao
   */
  const calculaAptidaoRefinado = (solucao: Solucao): Solucao => {
    let posicaoAtual = config.posicaoInicial;

    for (let i = 0; i < solucao.comandos.length; i++) {
      const novaPosicao = labirinto.caminhar(posicaoAtual, solucao.comandos[i]);

      if (
        novaPosicao[0] === posicaoAtual[0] &&
        novaPosicao[1] === posicaoAtual[1]
      ) {
      }
      if (
        labirinto.labirinto[posicaoAtual[0]][posicaoAtual[1]] ===
        Labirinto.ESPACOS.fim
      )
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
    populacao.map((solucao) => {
      if (config.funcAptidao === 0) return calculaAptidao(solucao);
      else return calculaAptidaoRefinado(solucao);
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
    populacaoIntermediaria[0] = { ...populacao[identificaMelhorSolucao()] };
  };

  /**
   * Realiza o torneio entre duas soluções aleatórias, escolhendo a melhor.
   *
   * @return {*} {number} Indice da solução escolhida
   */
  const torneio = (): number => {
    const linhaUm = getRandomInt(0, config.tamPopulacao - 1);
    const linhaDois = getRandomInt(0, config.tamPopulacao - 1);

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

      const tamanhoCorte = Math.floor(
        config.tamSolucao / (config.pontosDeCorte + 1)
      );

      for (let j = 0; j < tamanhoCorte; j++) {
        for (let k = 0; k <= config.pontosDeCorte; k++) {
          const posicao = j + tamanhoCorte * k;
          if (k % 2 === 0) {
            populacaoIntermediaria[i].comandos[posicao] =
              populacao[idxMae].comandos[posicao];
          } else {
            populacaoIntermediaria[i].comandos[posicao] =
              populacao[idxPai].comandos[posicao];
          }
        }
      }
    }
  };

  /**
   * Muta um comando aleatório de uma solução aleatória da população intermediaria.
   *
   * @memberof AlgGenProvider
   */
  const mutacao = () => {
    for (let j = 0; j < config.qntMutacoes; j++) {
      const idxSolucao = getRandomInt(1, config.tamPopulacao - 1);

      for (let i = 0; i < config.tamMutacoes; i++) {
        const idxMutacao = getRandomInt(0, config.tamSolucao);

        const comandoAtual =
          populacaoIntermediaria[idxSolucao].comandos[idxMutacao];
        let comandoNovo = "";

        do {
          comandoNovo = Solucao.COMANDOS[getRandomInt(0, 3)];
        } while (comandoAtual === comandoNovo);

        populacaoIntermediaria[idxSolucao].comandos[idxMutacao] = comandoNovo;
      }
    }
  };

  return (
    <GeneticoContext.Provider
      value={{
        run,
        config,
        resultado,
        setConfig,
        populacao,
        setLabirinto,
        labirinto,
      }}
    >
      {props.children}
    </GeneticoContext.Provider>
  );
};

export { GeneticoProvider, GeneticoContext };
