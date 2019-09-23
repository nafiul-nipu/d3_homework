
//Map dimensions (in pixels)
//var width = 1000,
      //height = 650;

//imported code from website bookmarked
//this code will help to resize the map with respect to browser
// var margin = {top: 10, left: 10, bottom: 10, right: 10}
//   , width = parseInt(d3.select('#map').style('width'))
//   , width = width - margin.left - margin.right
//   , mapRatio = .5
//   , height = width * mapRatio;


//Map projection
var projection = d3.geo.albersUsa()
   .scale(1100)
   //.translate([width/2,height/2]) //translate to center the map in view
   

//Generate paths based on projection
var path = d3.geo.path()
   .projection(projection);

//Create an SVG
var svg = d3.select("#map").append("svg")
   .attr("width", "100%")
   //.attr("height", height)
   .append('g')
   .style('border', '1px solid black');

//Group for the map features
var features = svg.append("g")
   .attr("class","features");

//Create zoom/pan listener
//Change [1,Infinity] to adjust the min/max zoom scale
var zoom = d3.behavior.zoom()
   .scaleExtent([1, Infinity])
   .on("zoom",zoomed);





svg.call(zoom);

d3.json("us-states.geojson",function(error,geodata) {
 if (error) return console.log(error); //unknown error, check the console
 





 //Create a path for each map feature in the data
   features.selectAll("path")
      .data(geodata.features)
      .enter()
      .append("path")
      .attr("d",path)
      .on("click",clicked)
   
});

// Add optional onClick events for features here
// d.properties contains the attributes (e.g. d.properties.name, d.properties.population)
function clicked(d,i) {
   d3.json("freq_by_state.json",function(error,data) {
      if (error) return console.log(error); //unknown error, check the console


      for (var index = 0 ; index < data.length ; index++){
         if(d.properties.NAME == data[index].NAME){

            d3.select('#clicked').html(d.properties.NAME +" = " + data[index].NAME);
         }

      }
      
     
     
        
     });

}


//Update map on zoom/pan
function zoomed() {
 features.attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")")
     .selectAll("path").style("stroke-width", 1 / zoom.scale() + "px" );
}





//when the browser resizes below code is for that
d3.select(window).on('resize', resize);
function resize() {
   d3.select("g").attr("transform", "scale(" + $("#container").width()/900 + ")");
   $("svg").height($("#container").width()*0.618);
}


// //resize function
// function resize() {
//    // adjust things when the window size changes
//    width = parseInt(d3.select('#map').style('width'));
//    width = width - margin.left - margin.right;
//    height = width * mapRatio;

//    // update projection
//    projection
//        .translate([width / 2, height / 2])
//        .scale(width);

//    // resize the map container
//    map
//        .style('width', width + 'px')
//        .style('height', height + 'px');

//    // resize the map
//    map.select('.land').attr('d', path);
//    map.selectAll('.state').attr('d', path);
// }
