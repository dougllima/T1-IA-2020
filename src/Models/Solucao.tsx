import { getRandomInt } from "../logic/Util";

export default class Solucao {
  static COMANDOS = ["U", "D", "L", "R"];

  comandos: string[];
  aptidao: number = Infinity;

  constructor(tamanhoSolucao: number = 120) {
    //Inicializa uma solução com valores aleatórios.
    this.comandos = new Array(tamanhoSolucao).fill(
      Solucao.COMANDOS[getRandomInt(0, 3)]
    );
  }
}
