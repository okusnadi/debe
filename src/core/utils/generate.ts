/*/@ts-ignore
import * as uuidv4 from 'uuid4';

export let _generate =
  typeof window !== undefined && window['uuid4'] ? window['uuid4'] : uuidv4;*/
let _generate = e7;
export function setIdGenerator(generator: () => string) {
  _generate = generator as any;
}
export function generate() {
  return _generate();
}

var lut: string[] = [];
for (var i = 0; i < 256; i++) {
  lut[i] = (i < 16 ? '0' : '') + i.toString(16);
}
function e7() {
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
