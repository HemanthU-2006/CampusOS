import '@testing-library/jest-dom';
import zlib from 'node:zlib';
import { Transform } from 'node:stream';

// Polyfill Node 22+ zlib.createZstdDecompress for undici / jsdom compatibility on Node < 22.12
if (typeof (zlib as any).createZstdDecompress !== 'function') {
  (zlib as any).createZstdDecompress = function () {
    return new Transform({
      transform(chunk, _enc, cb) {
        cb(null, chunk);
      },
    });
  };
}
if (!(zlib as any).constants) {
  (zlib as any).constants = {};
}
if (typeof (zlib as any).constants.ZSTD_d_windowLogMax === 'undefined') {
  (zlib as any).constants.ZSTD_d_windowLogMax = 23;
}
