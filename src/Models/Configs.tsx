export type GeneticoConfig = {
  tamSolucao: number;
  tamGeracoes: number;
  tamPopulacao: number;

  taxaMutacao: number;
  tamMutacoes: number;
  qntMutacoes: number;

  pontosDeCorte: number;

  posicaoFinal: number[];
  posicaoInicial: number[];
};
