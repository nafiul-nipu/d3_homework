//Map dimensions (in pixels)
let marginn = {top : 10, left: 10, bottom: 10, right: 10};
  let width = document.getElementById("map").offsetWidth;
  width = width - marginn.left - marginn.right;
  let mapRatio = 0.5;
  let height = width * mapRatio;
   let padding = 40;

var tempColor; //temp var for storing the color of a path so that after mouse over it can go back to its original color
//Map projection
var projection = d3.geoAlbersUsa()
    .scale(width)
    .translate([width/2,height/2]) //translate to center the map in view

//Generate paths based on projection
var path = d3.geoPath()
    .projection(projection);


//Create an SVG
var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height)
    // .style('border', '3px solid black')
    // .style('display', 'block')
    // .style('margin', 'auto')
    // .attr('fill', '#2b8cbe');

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
// var zoom = d3.zoom()
//     // .extent([0,0], [width,height])
//     // .scaleExtent([1, Infinity])
//     .on("zoom",zoomed);

// svg.call(zoom)
//     .call(zoom.transform, d3.zoomIdentity  //Then apply the initial transform
//     .translate(width/2, height/2)
//     .scale(0.50));

var male_death = [];
var female_death = [];
var death_together = [];
var yScale, yAxis;
d3.json("data/us-states-final.geojson").then(function(geodata) {
  

  //adding color to the states
    //taking the values of all death
    
    for (var i = 0; i<geodata.features.length; i++) {
        death_together[i] = (geodata.features[i].properties.males + geodata.features[i].properties.females );
        male_death[i] = geodata.features[i].properties.males;
        female_death[i] = geodata.features[i].properties.females;
        //d3.select('#check').html(death_together);
    }

    //cheking the values
    //d3.select('#check').html(d3.max(death_together) + "    " + d3.min(death_together));


    var color_states = d3.scaleQuantize()
                            .domain([d3.min(death_together),579, d3.max(death_together)])
                            .range(["rgb(255,245,240)","rgb(254,224,210)"
                            ,"rgb(252,187,161)","rgb(252,146,114)","rgb(251,106,74)"
                            ,"rgb(239,59,44)","rgb(203,24,29)","rgb(153,0,13)"]);
    //d3.select('#check').html(d3.max(death_together) + "  <===>  "+ d3.min(death_together));
    //d3.select('#check').html(d3.median(death_together));
    //d3.select('#check2').html(death_together);
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


//code for showing the max and min death in a bar
yScale = d3.scaleLinear()
				.domain([d3.min(death_together), d3.max(death_together)])
                .range([height - padding, padding]);
//Define Y axis
yAxis = d3.axisLeft()
                .scale(yScale)
                .ticks(10);
//Create Y axis
svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis);

//by default will show the death together circles
cityCircle("together", death_together);

    

//clicking male and female button
$("#gender-select").on("change", function(){
    let gender = $("#gender-select").val();
    if (gender == "male"){
        console.log("male");
        maleClicked();
    }else if (gender == "female"){
        console.log("female");
        femaleClicked();
    }else{
        console.log("home")
        homeClicked();
    }
});

});

//circle
function cityCircle(toShow, genderData){
    d3.csv("data/freq_by_city.csv").then(function(cityData){
        let radiuScale = d3.scaleSqrt()
                            .domain([d3.min(genderData), d3.max(genderData)])
                            .range([1, 7]);

        let cityColor = d3.scaleOrdinal()
                                .domain([d3.min(genderData), d3.max(genderData)])
                                .range(d3.schemeSet3);


        console.log(toShow);
        console.log(genderData);

            features.selectAll("circle")
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
                if(toShow == "together"){
                    let altogether = d.males + d.females ;
                    console.log("together selected")
                    return (radiuScale(altogether));
                }else if(toShow == "male"){
                    console.log("male selected")
                    return (radiuScale(d.males));
                }else if (toShow == "female"){
                    console.log("female selected")
                    return (radiuScale(d.females));
                }
            })
            .style("fill", function(d){
                if(toShow == "together"){
                    let altogether = d.males + d.females ;
                    // console.log(altogether)
                    return (cityColor(altogether));
                }else if(toShow == "male"){
                    return (cityColor(d.males));
                }else if (toShow == "female"){
                    return (cityColor(d.females));
                }
            })

    });
}




// Add optional onClick events for features here
// d.properties contains the attributes (e.g. d.properties.name, d.properties.population)
function clicked(d,i) {
    
    //d3.select('#city').html(d.properties.name);
    d3.select('#bar').select('svg').remove();
    d3.select('#bar').select('h2').remove();
    d3.select('#bar').select('p').remove();
    d3.select('#pie').select('svg').remove();
    d3.select('#pie').select('h2').remove();
    d3.select('#pie').select('p').remove();
    console.log(d.properties.name);
    d3.json("data/freq_by_city.json").then(function(cityData) {
        
        var city_death = [];
        var city_name = [];
        var count = 0;
        for (var i = 0 ; i < cityData.length ; i++){
            
            if(d.properties.name == cityData[i].names){
                city_name[count] = cityData[i].city;
                city_death[count] = cityData[i].males + cityData[i].females;
                count ++ ;
            }
            
        }        
        console.log(count);
        //console.log(city_name);
        var w;
        if(count <= 30 ){
            w = 600;
        }else if(count >=30 && count <= 100){
            w = 700;
        }else if (count > 100 && count <= 150){
            w = 1000;
        }else if(count > 150 && count <= 250){
            w = 1200;
        }else{
            w = 1500;
        }
        //var w = 1000;
        var h = 250;

        var div2 = d3.select("#bar")
                        .append('div')
                        .attr('class', 'tooltip')
                        .style('opacity', 0);

        var xScaleBar = d3.scaleBand()
                            .domain(d3.range(city_death.length))
                            .rangeRound([0, w])
                            .paddingInner(0.05);
        
        var yScaleBar = d3.scaleLinear()
                            .domain([d3.min(city_death), d3.max(city_death)])
                            .range([0, w]);

        // d3.select('#bar').append('h2')
        //                 .html('<strong> State : ' + d.properties.name + '</strong>')
        //                 .style('text-align', 'center');
        // d3.select('#bar').append('p')
        //                 .html('<b>Bar Chart Showing Total Death Per City<br><em>  Hover Over The Bars </em> </b>')
        //                 .style('text-align', 'center');
        
        var svgBar = d3.select('#bar')
                        .append('svg')
                        .attr('width', w)
                        .attr('height', h)
                        .style('border', '2px solid black')
                        .style('display', 'block')
                        .style('margin', 'auto');
            
        
        svgBar.selectAll('rect').data(city_death)
                                .enter()
                                .append('rect')
                                .attr("x", function(d, i) {
                                    return xScaleBar(i);
                            })
                            .attr("y", function(d) {
                                    return h - yScaleBar(d);
                            })
                            .attr("width", xScaleBar.bandwidth())
                            .attr("height", function(d) {
                                    return yScaleBar(d);
                            })
                            .attr("fill", function(d) {
                                 return "rgb(0, 0, " + Math.round(d * 10) + ")";
                            })
                            .on("mouseover", function(d,i) {
             
                                div2.transition().duration(200)
                                .style('opacity', .9)
                                div2.html('<b> City: ' + city_name[i] + '<br> Death: ' + city_death[i] +  '</b>')
                                    .style('left' , (d3.event.pageX) + 'px')
                                    .style('top', (d3.event.pageY - 28) + 'px')
             
                            })
                            .on("mouseout", function() {
                            
                                 //Hide the tooltip
                                 div2.transition().duration(500)
                                    .style('opacity', 0)
                                 
                            })



        //pie chart for age group
        d3.json('data/freq_by_age_group.json').then(function(age){

            // d3.select('#pie').append('h2')
            //             .html('<b> Pie Chart Showing Statistics of Death By Age Group </b')
            //             .style('text-align', 'center');
            // d3.select('#pie').append('p')
            //             .html('<b> Hover Over The Pie Chart</b')
            //             .style('text-align', 'center');

            var div3 = d3.select("#pie")
                        .append('div')
                        .attr('class', 'tooltip')
                        .style('opacity', 0);

            //Width and height
                  var w_pie = 301;
                  var h_pie = 300;
                  var dataset = [];

                  for (var i = 0 ; i < age.length ; i++){
            
                    if(d.properties.name == age[i].name){
                        dataset = [age[i].under14, age[i].to17, age[i].over17];
                    }
                    
                }  
                console.log(dataset);
      
                  
      
                  var outerRadius = w_pie / 2;
                  var innerRadius = w_pie/4;
                  var arc = d3.arc()
                              .innerRadius(innerRadius)
                              .outerRadius(outerRadius);
                  
                  var pie = d3.pie();
                  
                  //Easy colors accessible via a 10-step ordinal scale
                //   var color = d3.scaleQuantize()
                //                 .domain([dataset[0],dataset[1],dataset[2]])
                //                 .range(["rgb(255,247,188)","rgb(254,196,79)"
                //                 ,"rgb(217,95,14)"]);

                  var color = d3.scaleOrdinal(d3.schemeCategory10);    
                  //Create SVG element
                  var svg_pie = d3.select("#pie")
                              .append("svg")
                              .attr("width", w_pie)
                              .attr("height", h_pie)
                              .style('border', '2px solid black')
                              .style('display', 'block')
                              .style('margin', 'auto');
                  
                  //Set up groups
                  var arcs = svg_pie.selectAll("g.arc")
                                .data(pie(dataset))
                                .enter()
                                .append("g")
                                .attr("class", "arc")
                                .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");
                  
                  //Draw arc paths
                  arcs.append("path")
                      .attr("fill", function(d, i) {
                          //console.log(i);
                          var value = dataset[i];
                          if (value){
                            return color(value);

                          }
                          
                      })
                      .attr("d", arc);
                  
                  //Labels
                  arcs.append("text")
                      .attr("transform", function(d) {
                          return "translate(" + arc.centroid(d) + ")";
                      })
                      .attr("text-anchor", "middle")
                      .text(function(d) {
                          return d.value;
                      });

                    arcs.on("mouseover", function() {
             
                        div2.transition().duration(200)
                        .style('opacity', .9)
                        div2.html('<b> Under 14: ' + dataset[0] + '<br> 14 to 17: ' + dataset[1] +'<br> Over 17: '+ dataset[2] +   '</b>')
                            .style('left' , (d3.event.pageX) + 'px')
                            .style('top', (d3.event.pageY - 28) + 'px')
     
                    })
                    .on("mouseout", function() {
                    
                         //Hide the tooltip
                         div2.transition().duration(500)
                            .style('opacity', 0)
                         
                    })
      
          });
        
    });

}
//mouse over function
function mouseOver(d){
    div.transition().duration(200)
                    .style('opacity', .9)
    div.html('<b> State: ' + d.properties.name + '<br> Males: ' + d.properties.males + '<br> Females: ' + d.properties.females + '</b>')
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
// function zoomed() {
//     //New offset array
//     var offset = [d3.event.transform.x, d3.event.transform.y];

//     //Calculate new scale
//     var newScale = d3.event.transform.k * 2000;

//     //Update projection with new offset and scale
//     projection.translate(offset)
//                 .scale(newScale);

//     //Update all paths and circles
//     svg.selectAll("path")
//         .attr("d", path);
// }


//male button click function
function maleClicked(){
    //d3.json("us-states-final.geojson").then(function(geodata) {
    // console.log(d3.min(male_death));
    // console.log(d3.max(male_death));
    var color_states = d3.scaleQuantize()
                            .domain([d3.min(male_death),637, d3.max(male_death)])
                            .range(["rgb(255,245,240)","rgb(254,224,210)"
                            ,"rgb(252,187,161)","rgb(252,146,114)","rgb(251,106,74)"
                            ,"rgb(239,59,44)","rgb(203,24,29)","rgb(153,0,13)"]);
    features.selectAll("path")
            .style("fill", function(d,i){
                   var value = male_death[i];
                    //d3.select('#check').html(value);
                   if(value){
                   return color_states(value);
                    }
                    //for showing the bar 
    
    
                                
            })
        //})
    
    cityCircle("male", male_death);

    yScale.domain([d3.min(male_death), d3.max(male_death)]);
        //Update Y axis
    svg.select(".y.axis")
        .transition()
        .duration(1000)
        .call(yAxis);

    
}
//female button click function
function femaleClicked(){
     //d3.json("us-states-final.geojson").then(function(geodata) {
        // console.log(d3.min(female_death));
        // console.log(d3.max(female_death));
        var color_states = d3.scaleQuantize()
                                .domain([d3.min(female_death), d3.max(female_death)])
                                .range(["rgb(255,245,240)","rgb(254,224,210)"
                                ,"rgb(252,187,161)","rgb(252,146,114)","rgb(251,106,74)"
                                ,"rgb(239,59,44)","rgb(203,24,29)","rgb(153,0,13)"]);
        features.selectAll("path")
                .style("fill", function(d,i){
                       var value = male_death[i];
                        //d3.select('#check').html(value);
                       if(value){
                       return color_states(value);
                        }
       
                })
            //})

        cityCircle("female", female_death);
        yScale.domain([d3.min(female_death), d3.max(female_death)]);
            //Update Y axis
        svg.select(".y.axis")
            .transition()
            .duration(1000)
            .call(yAxis);
}

function homeClicked(){
    //d3.json("us-states-final.geojson").then(function(geodata) {
        // console.log(d3.min(death_together));
        // console.log(d3.max(death_together));
        var color_states = d3.scaleQuantize()
                                .domain([d3.min(death_together),579, d3.max(death_together)])
                                .range(["rgb(255,245,240)","rgb(254,224,210)"
                                ,"rgb(252,187,161)","rgb(252,146,114)","rgb(251,106,74)"
                                ,"rgb(239,59,44)","rgb(203,24,29)","rgb(153,0,13)"]);
        features.selectAll("path")
                .style("fill", function(d,i){
                       var value = death_together[i];
                        //d3.select('#check').html(value);
                       if(value){
                       return color_states(value);
                        }
                            
                                    
                })
            //})

        cityCircle("together", death_together);
        yScale.domain([d3.min(death_together), d3.max(death_together)]);
            //Update Y axis
        svg.select(".y.axis")
            .transition()
            .duration(1000)
            .call(yAxis);
}


//the end