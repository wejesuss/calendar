export class ZeroPad {
  /**
   *
   * @param num The number to be padded
   * @param places The number of 'digits' `num` can reach considering the padding
   * @returns {string} `num` as a string with padded zeros
   */
  public pad (num: number, places: number = 2): string {
    return String(num).padStart(places, '0')
  }
}
