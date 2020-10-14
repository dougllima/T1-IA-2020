export default class Labirinto {
  static ESPACOS = {
    inicio: "E",
    fim: "S",

    parede: "1",
    piso: "0",
  };

  labirinto: string[][] = [];

  constructor(labirinto?: string[][]) {
    if (labirinto) {
      this.labirinto = labirinto;
    }
  }

  caminhar = (posicao: number[], comando: string) => {
    let [xNovo, yNovo] = posicao;

    switch (comando) {
      case "U":
        xNovo = xNovo - 1;
        break;
      case "D":
        xNovo = xNovo + 1;
        break;
      case "L":
        yNovo = yNovo - 1;
        break;
      case "R":
        yNovo = yNovo + 1;
        break;
    }

    // Se a nova posição for inválida, desfaz o movimento
    if (!this.validaPosicao(xNovo, yNovo)) {
      xNovo = posicao[0];
      yNovo = posicao[1];
    }

    return [xNovo, yNovo];
  };

  validaPosicao = (x: number, y: number): Boolean => {
    // Verifica se ta tentando sair do tabuleiro
    if (x < 0 || y < 0) return false;
    if (x >= this.labirinto.length || y >= this.labirinto[x].length)
      return false;
    // Verifica se ta tentando andar por uma parede
    if (this.labirinto[x][y] === "1") return false;

    return true;
  };

  posicaoInicial = (): number[] => {
    for (let i = 0; i < this.labirinto.length; i++) {
      for (let j = 0; j < this.labirinto[i].length; j++) {
        if (this.labirinto[i][j] === Labirinto.ESPACOS.inicio) return [i, j];
      }
    }

    //Só pro typescript parar de incomodar por faltar return...
    return [0, 0];
  };

  posicaoFinal = (): number[] => {
    for (let i = 0; i < this.labirinto.length; i++) {
      for (let j = 0; j < this.labirinto[i].length; j++) {
        if (this.labirinto[i][j] === Labirinto.ESPACOS.fim) return [i, j];
      }
    }

    //Só pro typescript parar de incomodar por faltar return...
    return [0, 0];
  };
}
