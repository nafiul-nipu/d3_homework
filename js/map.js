let map = function( data, cityData, genderData){
  d3.select("#map").select("svg").remove();
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
                .domain([d3.min(genderData), d3.max(genderData)])
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
        let value = genderData[i];
        if(value){
          return color(value);
        }else{
          return "#ccc";
        }
      });

  //make tha circle
  //getting the coordinates of a city for the state circle
  // console.log(cityData)
  // console.log(d3.max(function(d){
  //   return d.males
  // }))

  let radiuScale = d3.scaleSqrt()
                      .domain([0, 97])
                      .range([1, 20]);

  svg.selectAll("circle")
      .data(cityData)
      .enter()
      .append("circle")
      .attr("cx", function(d) {
        return projection([d.lng, d.lat])[0];
      })
      .attr("cy", function(d) {
        return projection([d.lng, d.lat])[1];
      })
      .attr("r", function(d){
        return (5)
      })
      .style("fill", "yellow")


  

}