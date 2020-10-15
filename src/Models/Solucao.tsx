import { getRandomInt } from "../logic/Util";

export default class Solucao {
  static COMANDOS = ["U", "D", "L", "R"];

  comandos: string[];
  idxComandosFalhos: number [];
  idxComandoFinal: number = -1;
  aptidao: number = Infinity;

  constructor(tamanhoSolucao: number = 120, randomizar: Boolean = false) {
    //Inicializa uma solução com valores aleatórios.
    this.comandos = new Array(tamanhoSolucao);
    this.idxComandosFalhos = [];
    if (randomizar)
      for (let i = 0; i < this.comandos.length; i++) {
        this.comandos[i] = Solucao.COMANDOS[getRandomInt(0, 3)];
      }
  }
}
