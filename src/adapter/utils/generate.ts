import * as id from 'nanoid';

let _generate = id;
export function setIdGenerator(generator: (size?: number) => string) {
  _generate = generator as any;
}
export function generate(size?: number) {
  return _generate(size);
}

let me =
  typeof window !== 'undefined'
    ? window
    : typeof self !== 'undefined'
    ? self
    : undefined;
if (me && typeof _generate !== 'function') {
  const crypto = me.crypto || me['msCrypto'];
  if (crypto) {
    const url =
      'Uint8ArdomValuesObj012345679BCDEFGHIJKLMNPQRSTWXYZ_cfghkpqvwxyz-';
    _generate = function(size: number) {
      size = size || 21;
      var id = '';
      var bytes = crypto.getRandomValues(new Uint8Array(size));
      while (0 < size--) {
        id += url[bytes[size] & 63];
      }
      return id;
    };
  }
}
/*
var lut: string[] = [];
for (var i = 0; i < 256; i++) {
  lut[i] = (i < 16 ? '0' : '') + i.toString(16);
}
function fastGuid() {
  var d0 = (Math.random() * 0xffffffff) | 0;
  var d1 = (Math.random() * 0xffffffff) | 0;
  var d2 = (Math.random() * 0xffffffff) | 0;
  var d3 = (Math.random() * 0xffffffff) | 0;
  return (
    lut[d0 & 0xff] +
    lut[(d0 >> 8) & 0xff] +
    lut[(d0 >> 16) & 0xff] +
    lut[(d0 >> 24) & 0xff] +
    '-' +
    lut[d1 & 0xff] +
    lut[(d1 >> 8) & 0xff] +
    '-' +
    lut[((d1 >> 16) & 0x0f) | 0x40] +
    lut[(d1 >> 24) & 0xff] +
    '-' +
    lut[(d2 & 0x3f) | 0x80] +
    lut[(d2 >> 8) & 0xff] +
    '-' +
    lut[(d2 >> 16) & 0xff] +
    lut[(d2 >> 24) & 0xff] +
    lut[d3 & 0xff] +
    lut[(d3 >> 8) & 0xff] +
    lut[(d3 >> 16) & 0xff] +
    lut[(d3 >> 24) & 0xff]
  );
}
*/
