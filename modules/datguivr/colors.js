export const DEFAULT_COLOR = 0x2FA1D6;
export const HIGHLIGHT_COLOR = 0x0FC3FF;
export const INTERACTION_COLOR = 0x07ABF7;
export const EMISSIVE_COLOR = 0x222222;
export const HIGHLIGHT_EMISSIVE_COLOR = 0x999999;
export const OUTLINE_COLOR = 0x999999;
export const DEFAULT_BACK = 0x131313
export const HIGHLIGHT_BACK = 0x494949;
export const INACTIVE_COLOR = 0x161829;
export const CONTROLLER_ID_SLIDER = 0x2fa1d6;
export const CONTROLLER_ID_CHECKBOX = 0x806787;
export const CONTROLLER_ID_BUTTON = 0xe61d5f;
export const CONTROLLER_ID_TEXT = 0x1ed36f;

export function colorizeGeometry( geometry, color ){
  geometry.faces.forEach( function(face){
    face.color.setHex(color);
  });
  geometry.colorsNeedUpdate = true;
  return geometry;
}