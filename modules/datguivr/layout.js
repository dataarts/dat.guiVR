import * as SharedMaterials from './sharedmaterials';
import * as Colors from './colors';

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

export function createPanel( width, height, depth ){
  const panel = new THREE.Mesh( new THREE.BoxGeometry( width, height, depth ), SharedMaterials.PANEL );
  panel.geometry.translate( width * 0.5, 0, 0 );
  Colors.colorizeGeometry( panel.geometry, Colors.DEFAULT_BACK );
  return panel;
}

export function createControllerIDBox( height, color ){
  const panel = new THREE.Mesh( new THREE.BoxGeometry( CONTROLLER_ID_WIDTH, height, CONTROLLER_ID_DEPTH ), SharedMaterials.PANEL );
  panel.geometry.translate( CONTROLLER_ID_WIDTH * 0.5, 0, 0 );
  Colors.colorizeGeometry( panel.geometry, color );
  return panel;
}

export const PANEL_WIDTH = 1.0;
export const PANEL_HEIGHT = 0.07;
export const PANEL_DEPTH = 0.01;
export const PANEL_SPACING = 0.002;
export const PANEL_MARGIN = 0.005;
export const PANEL_LABEL_TEXT_MARGIN = 0.06;
export const PANEL_VALUE_TEXT_MARGIN = 0.02;
export const CONTROLLER_ID_WIDTH = 0.02;
export const CONTROLLER_ID_DEPTH = 0.005;