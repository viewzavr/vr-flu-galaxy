// purpose: from given virus trajectories set created a subset, by given trajectory and time range
// input: virus trajectories in form: [ [traj1-coords],[traj2-coords],....[trajN-coords] ]

export function create( vz, opts )
{
  var obj = vz.createObj( opts );
  
  obj.setParam( "input",[] );
  obj.setParam( "output",[] );
  obj.setParamOption("input","internal",true);
  obj.setParamOption("output","internal",true);

  obj.addSlider( "start",1,0,1000,1,update );
  obj.addSlider( "len",1,0,1000,1,update );
  
  obj.addSlider( "start2",1,0,1000,1,update );
  obj.addSlider( "len2",1,0,1000,1,update );  
  
  obj.setParamOption( "start","title","start_trajectory" );
  obj.setParamOption( "start2","title","start_time" );
  obj.setParamOption( "len2","title","time_range" );

  obj.trackParam("input",function() {
    var l = obj.params.input.length;

    obj.addSlider( "start", obj.params.start,0,l,1 );
    obj.addSlider( "len",obj.params.len,0,l,1 );
    
    var l2 = (obj.params.input[0]?.length || 0)/6;
    obj.addSlider( "start2", obj.params.start2,0,l2,1 );
    obj.addSlider( "len2",obj.params.len2,0,l2,1 );
    
    update();
  } );


  function update() {
    //if (!Array.isArray(input))
    if (!obj.params.input) return;
    if (!obj.params.input.length) return;
    if (!obj.params.input.slice) return;
    
    // input это массив массивов шестерок чисел
    var output = [];
    var i2 =  Math.min( obj.params.start + obj.params.len, obj.params.input.length );
    for (var i=obj.params.start; i<i2; i++) {
        var vir = obj.params.input[i];
        var j2 =  Math.min( vir.length/6, obj.params.start2 + obj.params.len2 );
        for (var j=obj.params.start2; j<j2; j++) {
          var q = j*6;
          output.push( vir[q],vir[q+1],vir[q+2],vir[q+3],vir[q+4],vir[q+5] );
        }
    }

    //var output = obj.params.input.slice( obj.params.start, obj.params.start + obj.params.len );
    // что-то слишком много кода для этой одной главной строчки

    obj.setParam( "output",output );
  };
  
  obj.addCmd("inspect in debugger",() => {
    console.log( obj.params.output );
    debugger;
  });
  
  return obj;
}


export function setup( vz ) {

  vz.addItemType( "array-slice-2","A: array slice 2", function( opts ) {
    return create( vz, opts );
  } );

}