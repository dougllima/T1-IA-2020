import { getRandomInt } from "../logic/util";

export default class Solucao {
  static COMANDOS_POSSIVEIS = ["U", "D", "L", "R"];

  comandos: string[];
  aptidao?: number;

  constructor(tamanhoSolucao: number = 120) {
    //Inicializa uma solução com valores aleatórios.
    this.comandos = new Array(tamanhoSolucao).fill(
      Solucao.COMANDOS_POSSIVEIS[getRandomInt(0, 3)]
    );
  }
}
