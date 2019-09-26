//Map dimensions (in pixels)
var width = 1000,
    height = 650;

//Map projection
var projection = d3.geoAlbersUsa()
    .scale(1217.0349143484525)
    .translate([width/2,height/2]) //translate to center the map in view

//Generate paths based on projection
var path = d3.geoPath()
    .projection(projection);


//Create an SVG
var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style('border', '1px solid black');

//append Div for tootlip to svg
var div = d3.select("#map")
            .append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);

//Group for the map features
var features = svg.append("g")
    .attr("class","features");

//Create zoom/pan listener
//Change [1,Infinity] to adjust the min/max zoom scale
var zoom = d3.zoom()
    .scaleExtent([1, Infinity])
    .on("zoom",zoomed);

svg.call(zoom);


d3.json("us-states-final.geojson").then(function(geodata) {
  

  //adding color to the states
    //taking the values of all death
    var death_together = [];
    for (var i = 0; i<geodata.features.length; i++) {
        death_together[i] = (geodata.features[i].properties.males + geodata.features[i].properties.females );
        //d3.select('#check').html(death_together);
    }

    //cheking the values
    d3.select('#check').html(d3.max(death_together) + "    " + d3.min(death_together));


    var color_states = d3.scaleQuantize()
                            .domain([d3.min(death_together),d3.mean(death_together), d3.max(death_together)])
                            .range(["rgb(254,229,217)","rgb(252,174,145)","rgb(251,106,74)","rgb(222,45,38)","rgb(165,15,21)"]);
    //d3.select('#check').html(d3.max(death_together) + "  <===>  "+ d3.min(death_together));
    d3.select('#check').html(d3.median(death_together));
    d3.select('#check2').html(death_together);
    // d3.select('geodata.features.state').style('fill', color_states);


  //Create a path for each map feature in the data
  features.selectAll("path")
    .data(geodata.features)
    .enter()
    .append("path")
    .attr("d",path)
    .style("fill", function(d,i){
        var value = death_together[i];
        //d3.select('#check').html(value);
        if(value){
            return color_states(value);
        }
        
    })
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
    div.html('State: ' + d.properties.name + '<br> Males: ' + d.properties.males + '<br> Females: ' + d.properties.females)
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