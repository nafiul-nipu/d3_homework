let normalization = $("#normalization-select").val();
let gender = $("#gender-select").val();
$("#normalization-select").on("change", mapNormalization);
$("#gender-select").on("change", genderSelected);

function mapNormalization(){
    normalization =  $("#normalization-select").val();
    console.log(normalization);    
}

function genderSelected(){
    gender = $("#gender-select").val();
    console.log(gender);
}

