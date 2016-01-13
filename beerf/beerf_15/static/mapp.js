   // a cross reference of area names to text to be shown for each area
    var xref = {
        fact1: "<input type='text' value='f1'>name</input>",
        fact2: "<input type='text' value='f2'>name</input>",
        ret1: "<input type='text' value='r1'>name</input>",
        ret2: "<input type='text' value='r2'>name</input>"
    };

    var path='static/images/map1.gif' ;

//for black and white retailers    

function off(n){    
       
        image.mapster('set',true,'ret'+n);      
            
}



//for colored retailers
function on(n){
    
       
        image.mapster('set',false,'ret'+n);  
    
            
}


//for changing level of factory
function myFunction(level) {
    switch(level){

        case 1: path = 'static/images/map1.gif';

            break;
        case 2: path='static/images/map2.gif' ;
            break;
        case 3: path='static/images/map3.gif';
            break;
        case 4: path='static/images/map4.gif' ;
            break;
        
    }
   
    image.mapster('set',false,'fact1');
    image.mapster('set',true,'fact1', { altImage: path } );
   
}

    var hovered = "fact1";
    var image = $('#map1');
var newToolTip = "default";


function mapp(){

    

    image.mapster(
    {
        
        altImages:{
            color: 'static/images/map1.gif',
            black: 'static/images/mapblack.gif'
        },
        

        render_highlight: {strokeWidth: 1,strokeOpacity: 0.8,strokeColor: "3320FF",stroke: true,fillOpacity: 0.4,fillColor: "d42e16"},
        
        //stroke: true,
       // strokeColor: "3320FF",
       // strokeOpacity: 0.8,
        //strokeWidth: 4,
       
        singleSelect: false,
        mapKey: 'name',
        selected:true,
        isSelectable: false,
        fillOpacity: 1,
        render_select : { altImage : 'black'},
        areas: [{

                    key: 'fact1',
                    render_select : { altImage : path},
                    
                    
               },
               {

                    key: 'fact2',
                    render_select : { altImage : path},
                    
                    
               }],
        
                
        


    
        onMouseover: function(x) {
 hovered = x.key;

                 image.mapster('set_options', { 
                areas: [{
                    key: x.key,
                    toolTip: hovered
                    }]
                });
        },
        showToolTip: true,
        toolTipClose: ["tooltip-click", "area-click"],

        onClick:function (e) {
            $('#selections').html(xref[e.key]);
            
           

            
        }
});


}
mapp();