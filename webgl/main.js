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

var bg = new THREE.Mesh(
    new THREE.PlaneGeometry(500, 500),
    new THREE.MeshBasicMaterial({color: 0xffffff})
);
scene.add(bg);

var mask = new THREE.Mesh(
    new THREE.RingGeometry(220, 400, 50),
    new THREE.MeshBasicMaterial({color: 0x000000, transparent: true})
);
mask.renderOrder = 2;
scene.add(mask);

var planeGeometry = new THREE.PlaneGeometry(512, 512);
var tempMaterial = new THREE.MeshBasicMaterial({color: 0x000000, transparent: true});

var origin = new THREE.Mesh(planeGeometry, tempMaterial);
origin.renderOrder = 0;
scene.add(origin);

var overlay = new THREE.Mesh(planeGeometry, tempMaterial);
overlay.renderOrder = 1;
scene.add(overlay);

// overlay.rotation.z = 0.01;
overlay.scale.x = 0.96;
overlay.scale.y = 0.96;

function textureInit(texture) {
    var mat = new THREE.MeshBasicMaterial({map: texture, transparent: true});
    origin.material = mat;
    overlay.material = mat;
}

var loader = new THREE.TextureLoader();
loader.load('original.png', textureInit);

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
