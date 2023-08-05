var n = '', m = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/', a: any = n.charCodeAt.call.bind(n.charCodeAt)

export function myBtoa (s: string): string {
  for (var i = 0, q = s.length, r = n, w, x, y; i < q; w = (a(s, i++) << 16) + ((x = a(s, i++)) << 8) + ((y = a(s, i++)) || 0), r += (m[w >> 18] || n) + (m[(w & 258048) >> 12] || n) + (x ? m[(w & 4032) >> 6] : '=') + (y ? m[w & 63] : '=')); // don't touch ;
  return r
}

export function myBtoaFromArr (arr: Uint8Array): string {
  // https://stackoverflow.com/questions/12710001/how-to-convert-uint8-array-to-base64-encoded-string/62362724#62362724
  const padStart = (targetLength: number, padString: string, str: string): string => {
    return str.length >= targetLength ? str : new Array(targetLength - str.length + 1).join(padString) + str
  }
  function bin (f: number): string { return padStart(8, '0', f.toString(2)) } // convert num to 8-bit binary string
  const l = arr.length
  let result = ''

  for (let i = 0; i <= (l - 1) / 3; i++) {
    const c1 = i * 3 + 1 >= l // case when "=" is on end
    const c2 = i * 3 + 2 >= l // case when "=" is on end
    const chunk = bin(arr[3 * i]) + bin(c1 ? 0 : arr[3 * i + 1]) + bin(c2 ? 0 : arr[3 * i + 2])
    const match = chunk.match(/.{1,6}/g)
    let r: string[] = []
    if (match !== null) {
      r = match.map((x: string, j: number) => j === 3 && c2 ? '=' : (j === 2 && c1 ? '=' : m[+(`0b${x}`)]))
    }
    result += r.join('')
  }

  return result
}
