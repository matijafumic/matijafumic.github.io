setTimeout(function() { $("#loader").fadeOut("slow"); }, 4000);

/* modelChange();

function modelChange () {

    // If burgerChecked is true, remove an instance of ribs model and vice versa
    var burgerChecked = true;
    var ribsChecked = false;
    // Used to see if there already is an instance of model loaded to prevent two same models from loading
    var burgerCount = 1;
    var ribsCount = 0;

    $(document).ready(function(){
        $("input[type=radio][name=model]").click(function() {

            if (this.value == "burger") {
                if(ribsChecked){
                    var element = document.getElementById("ribsEntity");
                    element.parentNode.removeChild(element)
                    ribsChecked = false;
                    ribsCount--;
                }
                if(burgerCount == 1){
                    return;
                }else {
                    $("#showModel").append('<a-entity id="burgerEntity" gltf-model="#Burger" position="0 0 0" scale="0.02 0.02 0.02" rotation="0 90 0"></a-entity>');
                    burgerChecked = true;
                    burgerCount++;
                }       
            }
    
            else if (this.value == "ribs") {
                if(burgerChecked){
                    var element = document.getElementById("burgerEntity");
                    element.parentNode.removeChild(element)
                    burgerChecked = false;
                    burgerCount--;
                }
                if(ribsCount == 1){
                    return;
                }else {
                    $("#showModel").append('<a-entity id="ribsEntity" gltf-model="#Ribs" position="0 0 0" scale="0.05 0.05 0.05" rotation="0 90 0"></a-entity>');
                    ribsChecked = true;
                    ribsCount++;
                }
              
            }
        });
    })
} */

var i = 0;
var models = ['<a-entity id="Entity" gltf-model="#Burger" position="0 0 0" scale="0.05 0.05 0.05" rotation="0 90 0"></a-entity>', 
              '<a-entity id="Entity" gltf-model="#Ribs" position="0 0 0" scale="0.05 0.05 0.05" rotation="0 90 0"></a-entity>'];

function mySlide(param)
{
    if(param === 'next')
    {
        i++;
        if(i === models.length){ i = models.length - 1; }
    }else{
        i--;
        if(i < 0){ i = 0; }
    }
    var element = document.getElementById("Entity");
    element.parentNode.removeChild(element)
    $("#showModel").append(models[i]);
}
