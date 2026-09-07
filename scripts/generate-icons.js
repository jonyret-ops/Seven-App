import fs from 'fs';
import zlib from 'zlib';

function createCRC32Table() {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  return table;
}

const crcTable = createCRC32Table();
function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const typeAndData = chunk.subarray(4, 8 + len);
  chunk.writeUInt32BE(crc32(typeAndData), 8 + len);
  return chunk;
}

function generatePng(width, height, isMaskable = false) {
  const buffer = Buffer.alloc(width * height * 4);

  const cx = width / 2;
  const cy = height / 2;
  const trackRadius = width * 0.35;
  const trackWidth = width * 0.055;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      // Distance from center
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background: Deep dark navy-slate gradient #1E2533 (top) to #0A0D14 (bottom)
      const gy = y / height;
      let r = Math.floor(30 * (1 - gy) + 10 * gy);
      let g = Math.floor(37 * (1 - gy) + 13 * gy);
      let b = Math.floor(51 * (1 - gy) + 20 * gy);
      let a = 255;

      // If not maskable, rounded squircle corners
      if (!isMaskable) {
        const cornerR = width * 0.22;
        const inCornerX = x < cornerR ? cornerR - x : (x > width - cornerR ? x - (width - cornerR) : 0);
        const inCornerY = y < cornerR ? cornerR - y : (y > height - cornerR ? y - (height - cornerR) : 0);
        if (inCornerX > 0 && inCornerY > 0) {
          const cornerDist = Math.sqrt(inCornerX * inCornerX + inCornerY * inCornerY);
          if (cornerDist > cornerR) {
            // Outside rounded rect
            buffer[idx] = 0;
            buffer[idx + 1] = 0;
            buffer[idx + 2] = 0;
            buffer[idx + 3] = 0;
            continue;
          }
        }
      }

      // Background track circle (#1F2937)
      if (Math.abs(dist - trackRadius) < trackWidth / 2) {
        r = 31; g = 41; b = 55;
      }

      // Electric Blue progress arc from -90 deg (top) to around 170 deg clockwise
      const angle = Math.atan2(dy, dx); // -PI to PI (-PI/2 is top)
      let normAngle = angle + Math.PI / 2;
      if (normAngle < 0) normAngle += Math.PI * 2;

      // Arc spans ~70% (0 to 4.4 rad)
      if (normAngle < 4.4 && Math.abs(dist - trackRadius) < trackWidth * 0.6) {
        // Electric blue gradient #38BDF8 (56, 189, 248) to #2563EB (37, 99, 235)
        const t = normAngle / 4.4;
        r = Math.floor(56 * (1 - t) + 37 * t);
        g = Math.floor(189 * (1 - t) + 99 * t);
        b = Math.floor(248 * (1 - t) + 235 * t);
      }

      // Glowing dot near top-right (angle 0 rad relative to center: x = cx + trackRadius, y = cy)
      const dotDx = x - (cx + trackRadius);
      const dotDy = y - cy;
      const dotDist = Math.sqrt(dotDx * dotDx + dotDy * dotDy);
      if (dotDist < trackWidth * 0.7) {
        r = 56; g = 189; b = 248;
      }

      // Center numeral 7
      // Normalize coords to [-1, 1] relative to center
      const nx = dx / (width * 0.22);
      const ny = dy / (height * 0.22);

      // Top bar of 7: ny between -0.7 and -0.4, nx between -0.55 and 0.55
      const inTopBar = ny >= -0.7 && ny <= -0.4 && nx >= -0.55 && nx <= 0.55;
      
      // Diagonal stem of 7: line from (0.55, -0.4) down-left to (-0.2, 0.75)
      // Line equation: nx approx 0.55 - (ny + 0.4) * (0.75 / 1.15)
      const stemCenterX = 0.55 - (ny + 0.4) * 0.65;
      const inStem = ny >= -0.5 && ny <= 0.75 && Math.abs(nx - stemCenterX) <= 0.16;

      if (inTopBar || inStem) {
        r = 255; g = 255; b = 255;
      }

      buffer[idx] = r;
      buffer[idx + 1] = g;
      buffer[idx + 2] = b;
      buffer[idx + 3] = a;
    }
  }

  // Convert to PNG scanlines with filter byte 0
  const rowSize = width * 4;
  const rawData = Buffer.alloc(height * (1 + rowSize));
  for (let y = 0; y < height; y++) {
    rawData[y * (1 + rowSize)] = 0; // Filter None
    buffer.copy(rawData, y * (1 + rowSize) + 1, y * rowSize, (y + 1) * rowSize);
  }

  const compressed = zlib.deflateSync(rawData);

  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;  // bit depth
  ihdrData[9] = 6;  // RGBA color type
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  const ihdr = makeChunk('IHDR', ihdrData);
  const idat = makeChunk('IDAT', compressed);
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

const icons = [
  { name: 'public/pwa-192x192.png', size: 192, maskable: false },
  { name: 'public/pwa-512x512.png', size: 512, maskable: false },
  { name: 'public/pwa-maskable-512x512.png', size: 512, maskable: true },
  { name: 'public/apple-touch-icon.png', size: 180, maskable: false },
  { name: 'public/favicon.png', size: 32, maskable: false },
];

for (const icon of icons) {
  const png = generatePng(icon.size, icon.size, icon.maskable);
  fs.writeFileSync(icon.name, png);
  console.log(`Generated ${icon.name} (${icon.size}x${icon.size})`);
}
