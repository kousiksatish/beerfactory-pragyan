   // a cross reference of area names to text to be shown for each area
    var  xref = {
        fact1: "YOUR FACTORY'S NAME<br>FACTORY STORY<br>FACTORY DETAILS",
        // fact2: scope.store.products[0].orders[x.key-1].order_no,
        // 1: scope.store.products[0].orders[x.key-1].order_no,
        // 2: scope.store.products[0].orders[x.key-1].order_no
    };
    var path='static/images/map1.gif' ;




//for changing level of factory
function myFunction(level) {
    switch(level){

        case 1: path = 'static/images/map1.gif';
            break;
        case 2: path='static/images/map2.jpg' ;
            break;
        case 3: path='static/images/map3.jpg';
            break;
        case 4: path='static/images/map4.jpg' ;
            break;
        
    }
   
    image.mapster('set',false,'fact1');
    image.mapster('set',true,'fact1', { altImage: path } );
   
}

    var hovered = "fact1";
    var image = $('#map1');
var newToolTip = "default";

//for black and white retailers    

function off(n){    
       
        image.mapster('set',true,n);      
            
}



//for colored retailers
function on(n){
    
       
        image.mapster('set',false,n);  
    
            
}

var pathcol = 'black';
    /*
function colorretailers(){
     // var pathcol = ['black','black','black','black','black','black','black','black','black','black','black','black','black','black','black'];
        var $element = $('#right_half');
var scope = angular.element($element).scope();
    
        var unlocked;
        for(var i = 0; i<14; i++){
            unlocked = scope.store.products[0].orders[i].zone;
             console.log("UNLOCKED", i,unlocked);
            if (unlocked == 1) pathcol[i] = path;
        else pathcol[i] = 'black';
        }
}*/

function mapp(){
            /*for(var i = 1; i<4; i++){
                image.mapster({
                    altImages:{
            color: 'static/images/map1.gif',
            black: 'static/images/mapblack.gif'
        },
        render_highlight: {strokeWidth: 1,strokeOpacity: 0.8,strokeColor: "3320FF",stroke: true,fillOpacity: 0.4,fillColor: "d42e16"},
singleSelect: false,
        mapKey: 'name',
        selected:true,
        isSelectable: false,
        fillOpacity: 1,
                    areas: [{
                        key: i,
                        render_select:{altImage:'color'},
                    }]
                });
            }
            for(var j=4;j<16;j++){
                image.mapster({
                    altImages:{
            color: 'static/images/map1.gif',
            black: 'static/images/mapblack.gif'
        },
        render_highlight: {strokeWidth: 1,strokeOpacity: 0.8,strokeColor: "3320FF",stroke: true,fillOpacity: 0.4,fillColor: "d42e16"},
        singleSelect: false,
        mapKey: 'name',
        selected:true,
        isSelectable: false,
        fillOpacity: 1,
                    areas: [{
                        key: j,
                        render_select:{altImage:'black'},
                    }]
                });}
        //     image.mapster('set_options',{
        //         altImages:{
        //     color: 'static/images/map1.gif',
        //     black: 'static/images/mapblack.gif'
        // },
        //         areas: [{
        //             key:'1',
        //             render_select: { altImage : path}
        //         }]
        //     })*/
        // colorretailers();
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
        areas: [
                {

                    key: 'fact1',
                    render_select : { altImage : path},
                    toolTip: "FACTORY 1"
                    
                    
               },
               {

                    key: 'fact2',
                    render_select : { altImage : path},
                    toolTip: "FACTORY 2"
                    
               },
               {
                    key:'1',
                    render_select : {altImage:'color'}
               },
               {
                    key: '2',
                    render_select : {altImage : 'color'}
               },
               {
                    key: '3',
                    render_select : {altImage : 'color'}
               }],    
        onMouseover: function(x) {
            if(x.key<4){
        var $element = $('#right_half');
        var scope = angular.element($element).scope();
        var ret = scope.store.products[0].orders[x.key-1];
        hovered = ret.name+"<br>POPULARITY<br>DEMAND:"+ret.order_no;
        // xref[x.key] = "<table><tr><th>NAME</th><th>DEMAND</th></tr><tr><td>"+scope.store.products[0].orders[x.key-1].from+"</td><td>"+scope.store.products[0].orders[x.key-1].order_no+"</td></tr></table>";
        xref[x.key] = ret.name+"<br>STORYYYY FOR 5 LINES?<br>2<br>3<br>4<br>5<br>POPULARITY<br>DEMAND: "+ret.order_no+"<br>SUPPLIED: <input id='tono' type='number' value='"+ret.to_no+"' ng-model='store.supplyValues[$index]'></input><br><button class='btn btn-default' value='confirm' onclick='confirmorder("+x.key+")'>CONFIRM</button>";
    }
        else if(x.key<15){
            hovered = "KEEP PLAYING TO UNLOCK!"
            xref[x.key] = "RETAILER "+x.key+" NOT UNLOCKED YET!<br>KEEP PLAYING TO UNLOCK THEM!<br>";
        }
        else if(x.key=='fact1'){
            hovered = "FACTORY 1";
        }
        else if(x.key=='fact2'){
            hovered = "FACTORY 2";
        }

                 image.mapster('set_options', { 
                areas: [{
                    key: x.key,
                    toolTip: hovered,
                    
                    // toolTip: x.key
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