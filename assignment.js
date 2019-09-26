//Map dimensions (in pixels)
var width = 1000,
    height = 650;

var tempColor; //temp var for storing the color of a path so that after mouse over it can go back to its original color
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
    .style('border', '1px solid black')
    .attr('fill', '#2b8cbe');

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
    // .extent([0,0], [width,height])
    // .scaleExtent([1, Infinity])
    .on("zoom",zoomed);

svg.call(zoom)
    .call(zoom.transform, d3.zoomIdentity  //Then apply the initial transform
    .translate(width/2, height/2)
    .scale(0.50));


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
                            .domain([d3.min(death_together),579, d3.max(death_together)])
                            .range(["rgb(255,245,240)","rgb(254,224,210)"
                            ,"rgb(252,187,161)","rgb(252,146,114)","rgb(251,106,74)"
                            ,"rgb(239,59,44)","rgb(203,24,29)","rgb(153,0,13)"]);
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
    tempColor = this.style.fill
    d3.select(this).style('fill', '#a6bddb')
}

//mouse out function
function mouseOut(){
    div.transition().duration(500)
                    .style('opacity', 0)
    d3.select(this).style('fill', tempColor)
}

//Update map on zoom/pan
function zoomed() {
    //New offset array
    var offset = [d3.event.transform.x, d3.event.transform.y];

    //Calculate new scale
    var newScale = d3.event.transform.k * 2000;

    //Update projection with new offset and scale
    projection.translate(offset)
                .scale(newScale);

    //Update all paths and circles
    svg.selectAll("path")
        .attr("d", path);
}
//the end