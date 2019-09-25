//Map dimensions (in pixels)
var width = 1000,
    height = 650;

//Map projection
var projection = d3.geo.albersUsa()
    .scale(1217.0349143484525)
    .translate([width/2,height/2]) //translate to center the map in view

//Generate paths based on projection
var path = d3.geo.path()
    .projection(projection);


//Create an SVG
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style('border', '1px solid black');

//append Div for tootlip to svg
var div = d3.select("body")
            .append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);

//Group for the map features
var features = svg.append("g")
    .attr("class","features");

//Create zoom/pan listener
//Change [1,Infinity] to adjust the min/max zoom scale
var zoom = d3.behavior.zoom()
    .scaleExtent([1, Infinity])
    .on("zoom",zoomed);

svg.call(zoom);

d3.json("us-states-final.geojson",function(error,geodata) {
  if (error) return console.log(error); //unknown error, check the console

  //Create a path for each map feature in the data
  features.selectAll("path")
    .data(geodata.features)
    .enter()
    .append("path")
    .attr("d",path)
    .on("click",clicked)
    //showing values 
    .on('mouseover', mouseOver)
    .on('mouseout', mouseOut)
});

// Add optional onClick events for features here
// d.properties contains the attributes (e.g. d.properties.name, d.properties.population)
function clicked(d,i) {

}
//mouse over function
function mouseOver(d){
    div.transition().duration(200)
                    .style('opacity', .9)
    div.html('males: ' + d.properties.males + '<br> females: ' + d.properties.females
                + '<br> state: ' + d.properties.name)
        .style('left' , (d3.event.pageX) + 'px')
        .style('top', (d3.event.pageY - 28) + 'px')
}

//mouse out function
function mouseOut(d){
    div.transition().duration(500)
                    .style('opacity', 0)
}

//Update map on zoom/pan
function zoomed() {
  features.attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")")
      .selectAll("path").style("stroke-width", 1 / zoom.scale() + "px" );
}
//the end