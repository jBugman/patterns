(function() {
"use strict";

var scene = new THREE.Scene();
var camera = new THREE.OrthographicCamera(
    window.innerWidth / -2,
    window.innerWidth / 2,
    window.innerHeight / 2,
    window.innerHeight / -2,
    0.1,
    1000
);
camera.position.z = 1;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.antialias = true;
document.body.appendChild(renderer.domElement);

var mask = new THREE.Mesh(
    new THREE.RingGeometry(220, 400, 50),
    new THREE.MeshBasicMaterial({color: 0x000000, transparent: true})
);
mask.renderOrder = 2;
scene.add(mask);

var planeGeometry = new THREE.PlaneGeometry(512, 512);
var tex = generateRandomTexture();
var randomMaterial = new THREE.MeshBasicMaterial({map: tex, transparent: true});

var origin = new THREE.Mesh(planeGeometry, randomMaterial);
origin.renderOrder = 0;
scene.add(origin);

var overlay = new THREE.Mesh(planeGeometry, randomMaterial);
overlay.renderOrder = 1;
scene.add(overlay);

// overlay.rotation.z = 0.1;
overlay.scale.x = 0.96;
overlay.scale.y = 0.96;

function generateRandomTexture() {
    var w = 512;
    var h = 512;
    var pixels = new Uint8Array(w * h * 4);
    for (var i = 0; i < w * h; i++) {
        pixels[4 * i + 0] = 0xFF;
        pixels[4 * i + 1] = 0xFF;
        pixels[4 * i + 2] = 0xFF;
        pixels[4 * i + 3] = (Math.random() < 0.25) ? 0xFF : 0x00;
    }
    var tex = new THREE.DataTexture(pixels, w, h, THREE.RGBAFormat);
    tex.needsUpdate = true;
    return tex;
}

var frameNumber = 0;
function render() {
    requestAnimationFrame(render);

    var t = frameNumber / 180 * Math.PI;
    overlay.position.x = 3 * Math.cos(t);
    overlay.position.y = 3 * Math.sin(t);
    overlay.rotation.z = 0.1 * Math.cos(t);
    frameNumber += 1;

    renderer.render(scene, camera);
}
render();

}());
