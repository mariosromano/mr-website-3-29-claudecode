const CLOUDINARY_BASE = 'https://res.cloudinary.com/dtlodxxio/image/upload';
const VIDEO_BASE = 'https://res.cloudinary.com/dtlodxxio/video/upload';

export const images = {
  lakeBacklight: { id: 'Lake_Backlight_Feature_Wall_with_Model_touch_bdzoxn', v: 'v1765939772', ext: 'jpg' },
  flameHospitality: { id: 'flame-hospitality_h9crvd', v: 'v1769212741', ext: 'png' },
  billowBacklight: { id: 'billow-backlight_w4hjru', v: 'v1769147362', ext: 'jpg' },
  blueFacade: { id: 'blue_-facade-_soldier-VA_-_Large_rc45wv', v: 'v1765771518', ext: 'png' },
  morongoCasino: { id: 'Morongo_Casino_-_Medium_w9ymlt', v: 'v1765939772', ext: 'jpg' },
  seattleV2: { id: 'Seattle-V2-tile-02_bvcqwc', v: '', ext: 'png' },
  brickWaterfeature: { id: 'Brick_waterfeature_05_copy_kewkyh', v: '', ext: 'png' },
  laxAmericanAirlines: { id: 'LAX_American_Airlines_-_Large_nlbf8w', v: 'v1765939857', ext: 'jpg' },
  capitalOneArena: { id: 'Capital_One_Arena_-_Large_ule5uh', v: 'v1765773871', ext: 'png' },
  finsExterior: { id: 'Fins_exterior_white_gcccvq', v: '', ext: 'jpg' },
  bloomFree: { id: 'Bloom-free_reo20n', v: 'v1769147350', ext: 'jpg' },
  fingerprint: { id: 'Fingerprint_-_Large_udpxci', v: 'v1769147366', ext: 'jpg' },
} as const;

export type ImageKey = keyof typeof images;

export function cloudinaryUrl(key: ImageKey, width: number = 800): string {
  const img = images[key];
  const v = img.v ? `${img.v}/` : '';
  return `${CLOUDINARY_BASE}/q_auto,f_auto,w_${width}/${v}${img.id}.${img.ext}`;
}

export const installVideo = `${VIDEO_BASE}/q_auto,w_720/v1765772971/install_MR-LAX_720_-_puzzle_video_-_720_x_1280_m2ewcs.mp4`;
