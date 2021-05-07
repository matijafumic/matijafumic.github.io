import * as THREE from './three.module.js';
import { ARButton } from './ARButton.js';
import { GLTFLoader } from './GLTFLoader.js';

setTimeout(function() { $("#loader").fadeOut("slow"); }, 4000);

var scene, camera, renderer, controller, mixerBox, mixerShoe, clock;
var boxModel, shoeModelAnimated, shoeModelRed, shoeModelBlue, shoeModelBlack;
var actionBox, actionShoe, selectedShoe = "black", modelLoaded = false;

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

    preloadModels();

    const light = new THREE.AmbientLight( 0xffffff, 1);
    scene.add( light );

    document.body.appendChild( ARButton.createButton( renderer ) );

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
	if ( mixerBox ){
        mixerBox.update( delta );
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
    boxLoader.load( "./models/animatedBox-LowPoly.gltf", function ( gltf ) {
    boxModel = gltf.scene;
    mixerBox = new THREE.AnimationMixer( boxModel );
    actionBox = mixerBox.clipAction( gltf.animations[0] );
    actionBox.clampWhenFinished = true;
    actionBox.setLoop( THREE.LoopOnce );
    }, undefined, function ( error ) {
    console.error( error );
    } );
}

function preloadShoes(){
    const shoesLoader = new GLTFLoader();
   
    shoesLoader.load( "./models/animatedShoeLowPoly.gltf", function ( gltf ){
        shoeModelAnimated = gltf.scene;
        mixerShoe = new THREE.AnimationMixer( shoeModelAnimated );
        actionShoe = mixerShoe.clipAction( gltf.animations[0] );
        actionShoe.clampWhenFinished = true;
        actionShoe.setLoop( THREE.LoopOnce );
    }, undefined, function ( error ) {
    console.error( error );
    } );

    shoesLoader.load( "./models/redBlackLowPoly.gltf", function ( gltf ) {
        shoeModelRed = gltf.scene;
    }, undefined, function ( error ) {
    console.error( error );
    } );

    shoesLoader.load( "./models/whiteBlueLowPoly.gltf", function ( gltf ){
        shoeModelBlue = gltf.scene;
    }, undefined, function ( error ) {
    console.error( error );
    } );

    shoesLoader.load( "./models/blackLowPoly.gltf", function ( gltf ){
        shoeModelBlack = gltf.scene;
    }, undefined, function ( error ) {
    console.error( error );
    } );
}

function loadModel () {
    if(modelLoaded){
        scene.remove( boxModel );

        if(selectedShoe === "animated"){
            scene.remove( shoeModelAnimated );
        } else if(selectedShoe === "red"){
            scene.remove( shoeModelRed );
        } else if(selectedShoe === "blue"){
            scene.remove( shoeModelBlue );
        } else if(selectedShoe === "black"){
            scene.remove( shoeModelBlack );
        }
        modelLoaded = false;
    } else {
        boxModel.position.set(0, 0, -1).applyMatrix4( controller.matrixWorld );
        scene.add( boxModel );
        
        if(selectedShoe === "black"){
            shoeModelAnimated.position.set(0, 0, -1).applyMatrix4( controller.matrixWorld );
            scene.add( shoeModelAnimated );
            selectedShoe = "animated";
        } else if(selectedShoe === "animated"){
            shoeModelRed.position.set(0, 0, -1).applyMatrix4( controller.matrixWorld );
            scene.add( shoeModelRed );
            selectedShoe = "red";
        } else if(selectedShoe === "red"){
            shoeModelBlue.position.set(0, 0, -1).applyMatrix4( controller.matrixWorld );
            scene.add( shoeModelBlue );
            selectedShoe = "blue";
        } else if(selectedShoe === "blue"){
            shoeModelBlack.position.set(0, 0, -1).applyMatrix4( controller.matrixWorld );
            scene.add( shoeModelBlack );
            selectedShoe = "black";
        }      
        actionShoe.play();
        actionBox.play();
        modelLoaded = true;
    }
}