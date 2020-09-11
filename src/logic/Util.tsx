/**
 * Gera um inteiro entre min e max, ambos inclusos
 *
 * @param {number} min limite inferior 
 * @param {number} max limite superior
 * @return {*}  {number} 
 */
export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
