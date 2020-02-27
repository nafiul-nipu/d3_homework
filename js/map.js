let map = function( data, genderData){
  let marginn = {top : 10, left: 10, bottom: 10, right: 10};
  let width = document.getElementById("map").offsetWidth;
  width = width - marginn.left - marginn.right;
  let mapRatio = 0.5;
  let height = width * mapRatio;

  let projection = d3.geoAlbersUsa()
                      .scale(width)
                      .translate([width / 2, height / 2]);

  let path = d3.geoPath()
                .projection(projection);
  
  let color = d3.scaleQuantize()
                .domain([d3.min(death_together), d3.max(death_together)])
                .range(["rgb(237,248,233)","rgb(186,228,179)","rgb(116,196,118)","rgb(49,163,84)","rgb(0,109,44)"]);

  let svg = d3.select("#map")
              .append("svg")
              .attr("width", width)
              .attr("height", height)

  //make the choropleth
  svg.selectAll("path")
      .data(data.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("fill", function(d, i){
        let value = death_together[i];
        if(value){
          return color(value);
        }else{
          return "#ccc";
        }
      });

  //make tha circle
  svg.selectAll("circle")
      .data(data.features)
      .enter()
      .append("circle")

  

}