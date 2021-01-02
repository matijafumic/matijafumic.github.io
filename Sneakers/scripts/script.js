import * as THREE from './three.module.js';
import { ARButton } from './ARButton.js';
import { GLTFLoader } from './GLTFLoader.js';

var scene, camera, renderer, controller, mixer, clock;
var boxModel, shoeModelRed, shoeModelGreen, shoeModelBlue, action, selectedShoe, modelLoaded = false;

init();
animate();

function init() {
    scene = new THREE.Scene();
    clock = new THREE.Clock();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    renderer = new THREE.WebGLRenderer( {antialias: true, alpha: true} );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.xr.enabled = true;
    document.body.appendChild( renderer.domElement );

    const light = new THREE.AmbientLight( 0xffffff, 1);
    scene.add( light );

    document.body.appendChild( ARButton.createButton( renderer ) );
    
    preloadModels();

    controller = renderer.xr.getController( 0 );
    controller.addEventListener( 'select', loadModel );
    scene.add( controller );
    window.addEventListener("resize", onWindowResize, false);
}

function animate() {
    renderer.setAnimationLoop( render );
}

function render() {
    var delta = clock.getDelta();
	if ( mixer ){
        mixer.update( delta );
    }
    renderer.render( scene, camera );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function preloadModels(){
    preloadBox();
    preloadShoes();
}

function preloadBox(){
    const boxLoader = new GLTFLoader();
    boxLoader.load( "./models/Box-Animated.gltf", function ( gltf ) {
    boxModel = gltf.scene;
    boxModel.scale.set(0.03, 0.03, 0.03);
    boxModel.rotation.set(0, 0, 0);
    mixer = new THREE.AnimationMixer( boxModel );
    action = mixer.clipAction( gltf.animations[0] );
    action.clampWhenFinished = true;
    action.setLoop( THREE.LoopOnce );
    }, undefined, function ( error ) {
    console.error( error );
    } );
}

function preloadShoes(){
    const shoesLoader = new GLTFLoader();
   
    shoesLoader.load( "./models/shoeRed.gltf", function ( gltf ){
        shoeModelRed = gltf.scene;
        shoeModelRed.scale.set(0.7, 0.7, 0.7);
        shoeModelRed.rotation.set(0, 1.57079633, 0);
    }, undefined, function ( error ) {
    console.error( error );
    } );

    shoesLoader.load( "./models/shoeGreen.gltf", function ( gltf ) {
        shoeModelGreen = gltf.scene;
        shoeModelGreen.scale.set(0.7, 0.7, 0.7);
        shoeModelGreen.rotation.set(0, 1.57079633, 0);
    }, undefined, function ( error ) {
    console.error( error );
    } );

    shoesLoader.load( "./models/shoeBlue.gltf", function ( gltf ){
        shoeModelBlue = gltf.scene;
        shoeModelBlue.scale.set(0.7, 0.7, 0.7);
        shoeModelBlue.rotation.set(0, 1.57079633, 0);
    }, undefined, function ( error ) {
    console.error( error );
    } );
}

function loadModel () {
    if(modelLoaded){
        scene.remove( boxModel );
        action.reset();
        action.paused = true;

        if(selectedShoe === "red"){
            scene.remove( shoeModelRed );
        } else if(selectedShoe === "green"){
            scene.remove( shoeModelGreen );
        } else if(selectedShoe === "blue"){
            scene.remove( shoeModelBlue );
        }
        modelLoaded = false;
    } else {
        boxModel.position.set(0, 0, -1).applyMatrix4( controller.matrixWorld );
        scene.add( boxModel );
        
        if(document.getElementById("rbRed").checked){
            shoeModelRed.position.set(-0.02, 0, -1).applyMatrix4( controller.matrixWorld );
            scene.add( shoeModelRed );
            selectedShoe = "red";
        } else if(document.getElementById("rbGreen").checked){
            shoeModelGreen.position.set(-0.02, 0, -1).applyMatrix4( controller.matrixWorld );
            scene.add( shoeModelGreen );
            selectedShoe = "green";
        } else if(document.getElementById("rbBlue").checked){
            shoeModelBlue.position.set(-0.02, 0, -1).applyMatrix4( controller.matrixWorld );
            scene.add( shoeModelBlue );
            selectedShoe = "blue";
        }
        action.paused = false;
        action.play();
        modelLoaded = true;
    }
}
