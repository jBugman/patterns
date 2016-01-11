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

var planeGeometry = new THREE.PlaneGeometry(512, 512);
var tex = generateRandomTexture();
var uniforms = {
    time: { type: "f", value: 0 },
    texture: { type: "t", value: tex}
};
var vertexShader = `
    varying vec2 vUv;
    varying vec2 pos;
    void main() {
        vUv = uv;
        pos = 2.0 * (uv - vec2(0.5, 0.5));
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;
var fragmentShader = `
    uniform float time;
    uniform sampler2D texture;
    varying vec2 vUv;
    varying vec2 pos;

    float speed = 0.1;
    float amp = 3.0 / 512.0;

    void main() {
        float dist = length(pos);
        if (dist < 0.9) {
            // float sinX = sin(speed * time);
            // float cosX = cos(speed * time);
            // float sinY = sin(speed * time);
            // mat2 rotationMatrix = mat2(cosX, -sinX, sinY, cosX);
            // vec2 rotatedUv = (pos * rotationMatrix + vec2(1, 1)) * 0.5;

            // vec2 offset = amp * vec2(cos(speed * time), sin(speed * time));
            float scale = 0.96; // 0.98 + 0.02 * sin(speed * time);
            vec2 offset = vec2(0.5, 0.5);
            vec4 overlay = texture2D(texture, pos * scale * 0.5 + offset);
            // vec4 rotated = texture2D(texture, rotatedUv);
            vec4 original = texture2D(texture, vUv);
            gl_FragColor = max(original, overlay);
        } else {
            gl_FragColor = vec4(0, 0, 0, 1.0);
        }
    }
`;

var animatedMaterial = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader:   vertexShader,
    fragmentShader: fragmentShader,
    transparent: true
});

var origin = new THREE.Mesh(planeGeometry, animatedMaterial);
origin.renderOrder = 0;
scene.add(origin);

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

function render() {
    requestAnimationFrame(render);

    uniforms.time.value += 0.01;

    renderer.render(scene, camera);
}
render();

}());
