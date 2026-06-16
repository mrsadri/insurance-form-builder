export const fa = (n: number | string) =>
  String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[+d])

export const formatJalaliDate = (y: number, m: number, d: number) =>
  fa(`${y}/${String(m).padStart(2, '0')}/${String(d).padStart(2, '0')}`)
