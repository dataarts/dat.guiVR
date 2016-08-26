export function alignLeft( obj ){
  if( obj instanceof THREE.Mesh ){
    obj.geometry.computeBoundingBox();
    const width = obj.geometry.boundingBox.max.x - obj.geometry.boundingBox.max.y;
    obj.geometry.translate( width, 0, 0 );
    return obj;
  }
  else if( obj instanceof THREE.Geometry ){
    obj.computeBoundingBox();
    const width = obj.boundingBox.max.x - obj.boundingBox.max.y;
    obj.translate( width, 0, 0 );
    return obj;
  }
}

export const PANEL_WIDTH = 1.0;
export const PANEL_HEIGHT = 0.07;
export const PANEL_DEPTH = 0.01;
export const PANEL_SPACING = 0.02;
export const PANEL_MARGIN = 0.005;
export const PANEL_TEXT_MARGIN = 0.02;