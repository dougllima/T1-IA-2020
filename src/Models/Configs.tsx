export type GeneticoConfig = {
  tamSolucao: number;
  tamGeracoes: number;
  tamPopulacao: number;

  taxaMutacao: number;
  qntMutacoes: number;
  tamMutacoes: number;

  funcAptidao: 0 | 1;
  pontosDeCorte: number;

  posicaoFinal: number[];
  posicaoInicial: number[];
};
