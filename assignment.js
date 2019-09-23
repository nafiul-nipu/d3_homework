
//Map dimensions (in pixels)
var width = 1000,
   height = 650;

//Map projection
var projection = d3.geo.albersUsa()
   .scale(1000)
   .translate([width/2,height/2]) //translate to center the map in view
   

//Generate paths based on projection
var path = d3.geo.path()
   .projection(projection);

//Create an SVG
var svg = d3.select("#map").append("svg")
   .attr("width", width)
   .attr("height", height)
   .style('border', '1px solid black');

//Group for the map features
var features = svg.append("g")
   .attr("class","features");

//Create zoom/pan listener
//Change [1,Infinity] to adjust the min/max zoom scale
var zoom = d3.behavior.zoom()
   .scaleExtent([1, Infinity])
   .on("zoom",zoomed);


//create tooltip to show male female death
var tooltip = d3.select('body #map')
    .append('div')
    .style('position', 'absolute')
    .style('padding', '0 10px')
    .style('background', 'white')
    .style('opacity', 0);






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
      .on('mouseover', function(d) {
         d3.json("freq_by_state.json",function(error,data) {
            if (error) return console.log(error); //unknown error, check the console
      
      
            for (var index = 0 ; index < data.length ; index++){
               if(d.properties.NAME == data[index].NAME){
      
                  d3.select('#clicked').html(d.properties.NAME +" = " + data[index].NAME)
                  tooltip.transition().duration(200)
                .style('opacity', .9)
              tooltip.html(
                '<div style="font-size: 2rem; font-weight: bold">' +
                  'Male: '+ data[index].males + '</div>'
              )
              .style('left', '10 px')
                .style('top', '10 px') 
                
            }             
           }
      
      });})
      .on('mouseout', function(d) {
         tooltip.html('')
         
       })    
   
      });

// Add optional onClick events for features here
// d.properties contains the attributes (e.g. d.properties.name, d.properties.population)
function clicked(d,i) {
  }


//Update map on zoom/pan
function zoomed() {
 features.attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")")
     .selectAll("path").style("stroke-width", 1 / zoom.scale() + "px" );
}