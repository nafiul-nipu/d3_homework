let usStatesGeojson, freqByAgeGroup, freqByCity, freqByState, city_lang_lon_info_csv;
let male_death = [];
let female_death = [];
let death_together = [];
let files = ["data/us-states-final.geojson", "data/freq_by_age_group.json", "data/freq_by_city.json", "data/freq_by_state.json", "data/freq_by_city.csv"];

let promises = [];

files.forEach(function (fileURL){
    if(fileURL.includes("csv")){
        promises.push(d3.csv(fileURL));
    }else{
        promises.push(d3.json(fileURL));
    }
});

Promise.all(promises).then(function (values){
    usStatesGeojson = values[0];
    freqByAgeGroup = values[1];
    freqByCity = values[2];
    freqByState = values[3];
    city_lang_lon_info_csv = values[4]
    mainFunction();
});

let mainFunction = function(){
    for(let i = 0 ; i < usStatesGeojson.features.length; i++){
        death_together[i] = (usStatesGeojson.features[i].properties.males + usStatesGeojson.features[i].properties.females);
        male_death[i] = usStatesGeojson.features[i].properties.males;
        female_death[i] = usStatesGeojson.features[i].properties.females;
    }
    map(usStatesGeojson, city_lang_lon_info_csv, death_together);
    let normalization = $("#normalization-select").val();
    let gender = $("#gender-select").val();
    $("#normalization-select").on("change", mapNormalization);
    $("#gender-select").on("change", genderSelected);
}

let mapNormalization = function (){
    normalization =  $("#normalization-select").val();
    console.log(normalization);    
}

let genderSelected = function (){
    gender = $("#gender-select").val();
    console.log(gender);
}

//windows event handler
window.addEventListener("resize", function(){
    map(usStatesGeojson,city_lang_lon_info_csv, death_together)
});





