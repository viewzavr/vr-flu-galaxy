// purpose: load a json file and produce virus trajectories
// outputs:
//   data, trajectories coords in form [ [traj1-coords],[traj2-coords],....[trajN-coords] ] where each trajI-coords is a list in form [X,Y,Z,X,Y,Z,.....]
//   data_colors, trajectories colors in form [ [traj1-colors],[traj2-coords],....[trajN-colors] ]

export function setup( vz ) {
  vz.addItemType( "virs-load","Virs load", function( opts ) {
    return create( vz, opts );
  } );
}

// create function should return Viewzavr object
export function create( vz, opts ) {
  opts.name ||= "demoscene";
  var obj = vz.createObj( opts );

  function load(url) {

  if (!url) return;

  obj.setParam("state","loading");
  fetch(url).then( (res) => {
    res.json().then( (json) => {
      obj.setParam("state","parsing");    
      var dat = [];
      var colordat = [];
      for (var vir of json) {
        var lines = [];
        var colors = [];
        var color = [Math.random(),Math.random(),Math.random()];
        
        for (var i=0; i<vir.length-3; i+=3) {
          lines.push( vir[i], vir[i+1], vir[i+2],vir[i+3], vir[i+4], vir[i+5] );
          colors.push( color[0], color[1], color[2], color[0], color[1], color[2] );
        }
        dat.push( lines );
        colordat.push( colors );
      }

      obj.setParam("data",dat );
      obj.setParamOption("data","internal",true );
      obj.setParam("data_colors",colordat );
      obj.setParamOption("data_colors","internal",true );
      
      obj.setParam("state","done");    
//      console.log(dat);
    });
  });
  
  };
  
  //obj.addFile("virus-json-file", vz.getDir( import.meta.url )+"./virs.json", load );
  obj.addFile("virus-json-file", "", load );
  obj.addLabel("state","waiting");
  obj.setParam("data",[]);
  obj.setParam("data_colors",[]);
  obj.signalParam("virus-json-file");
  
//  vzPlayer.loadJson( vz.getDir( import.meta.url )+"./app.json" );

  return obj;
}
