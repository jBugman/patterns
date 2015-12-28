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
camera.zoom = 1.5;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var geometry = new THREE.BoxGeometry(512, 512, 1);
var cube = new THREE.Mesh(geometry);
scene.add(cube);

var textureInit = function (texture) {
    cube.material = new THREE.MeshBasicMaterial({map: texture});
};

var loader = new THREE.TextureLoader();
loader.load('original.png', textureInit);

function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
};
render();
