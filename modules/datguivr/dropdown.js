import createTextLabel from './textlabel';
import createInteraction from './interaction';
import * as Colors from './colors';
import * as Layout from './layout';
import * as SharedMaterials from './sharedmaterials';
import * as Grab from './grab';

export default function createCheckbox( {
  guiState,
  textCreator,
  object,
  propertyName = 'undefined',
  initialValue = false,
  options = [],
  width = Layout.PANEL_WIDTH,
  height = Layout.PANEL_HEIGHT,
  depth = Layout.PANEL_DEPTH
} = {} ){

  const DROPDOWN_WIDTH = width * 0.5 - Layout.PANEL_MARGIN;
  const DROPDOWN_HEIGHT = height - Layout.PANEL_MARGIN;
  const DROPDOWN_DEPTH = depth;
  const DROPDOWN_OPTION_HEIGHT = height - Layout.PANEL_MARGIN * 1.8;
  const DROPDOWN_MARGIN = Layout.PANEL_MARGIN;

  const group = new THREE.Group();

  const panel = Layout.createPanel( width, height, depth );
  group.add( panel );

  group.hitscan = [ panel ];

  const labelInteractions = [];
  const optionLabels = [];

  //  find actually which label is selected
  const initialLabel = Object.keys(options).find( function( optionName ){
    return object[propertyName] === options[ optionName ];
  });

  function createOption( labelText, isOption ){
    const label = createTextLabel( textCreator, labelText, DROPDOWN_WIDTH, depth, Colors.DROPDOWN_FG_COLOR, Colors.DROPDOWN_BG_COLOR )
    group.hitscan.push( label.back );
    const labelInteraction = createInteraction( guiState, label.back );
    labelInteractions.push( labelInteraction );
    optionLabels.push( label );


    if( isOption ){
      labelInteraction.events.on( 'onPressed', function(){
        selectedLabel.setString( labelText );
        object[ propertyName ] = options[ labelText ];
        collapseOptions();
        if( onChangedCB ){
          onChangedCB( object[ propertyName ] );
        }
      });
    }
    else{
      labelInteraction.events.on( 'onPressed', function(){
        openOptions();
      })
    }
    label.isOption = isOption;
    return label;
  }

  function collapseOptions(){
    optionLabels.forEach( function( label ){
      if( label.isOption ){
        label.visible = false;
        label.back.visible = false;
      }
    });
  }

  function openOptions(){
    optionLabels.forEach( function( label ){
      if( label.isOption ){
        label.visible = true;
        label.back.visible = true;
      }
    });
  }

  //  base option
  const selectedLabel = createOption( initialLabel, false );
  selectedLabel.position.x = Layout.PANEL_MARGIN + width * 0.5;
  selectedLabel.position.z = depth;

  selectedLabel.add((function createDownArrow(){
    const w = 0.015;
    const h = 0.03;
    const sh = new THREE.Shape();
    sh.moveTo(0,0);
    sh.lineTo(-w,h);
    sh.lineTo(w,h);
    sh.lineTo(0,0);

    const geo = new THREE.ShapeGeometry( sh );
    Colors.colorizeGeometry( geo, Colors.DROPDOWN_FG_COLOR );
    geo.translate( DROPDOWN_WIDTH - w * 4, -DROPDOWN_HEIGHT * 0.5 + h * 0.5 , depth * 1.01 );

    return new THREE.Mesh( geo, SharedMaterials.PANEL );
  })());

  selectedLabel.add( ...Object.keys(options).map( function( optionName, index ){
    const optionLabel = createOption( optionName, true );
    optionLabel.position.y = -DROPDOWN_MARGIN - (index+1) * ( DROPDOWN_OPTION_HEIGHT );
    optionLabel.position.z = depth;
    return optionLabel;
  }));

  collapseOptions();

  const descriptorLabel = textCreator.create( propertyName );
  descriptorLabel.position.x = Layout.PANEL_LABEL_TEXT_MARGIN;
  descriptorLabel.position.z = depth;
  descriptorLabel.position.y = -0.03;

  const controllerID = Layout.createControllerIDBox( height, Colors.CONTROLLER_ID_SLIDER );
  controllerID.position.z = depth;

  panel.add( descriptorLabel, controllerID, selectedLabel );


  updateView();

  function updateView(){

    labelInteractions.forEach( function( interaction, index ){
      const label = optionLabels[ index ];
      if( label.isOption ){
        if( interaction.hovering() ){
          Colors.colorizeGeometry( label.back.geometry, Colors.HIGHLIGHT_COLOR );
        }
        else{
          Colors.colorizeGeometry( label.back.geometry, Colors.DROPDOWN_BG_COLOR );
        }
      }
    });
  }

  let onChangedCB;
  let onFinishChangeCB;

  group.onChange = function( callback ){
    onChangedCB = callback;
    return group;
  };

  const grabInteraction = Grab.create( { group, panel, guiState } );

  group.update = function( inputObjects ){
    labelInteractions.forEach( function( labelInteraction ){
      labelInteraction.update( inputObjects );
    });
    grabInteraction.update( inputObjects );
    updateView();
  };


  return group;
}