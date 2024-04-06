import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(2, 2, 2);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader;
let texture = textureLoader.load('./texture/crate_diffuse.png');
texture.colorSpace = THREE.SRGBColorSpace;

const BoxGeometry = new THREE.BoxGeometry(1, 1, 1);
const matrial = new THREE.MeshStandardMaterial({
    map: texture
});
const cube = new THREE.Mesh(BoxGeometry, matrial);
scene.add(cube);


const light1 = new THREE.PointLight('orange', 50);
light1.position.set(2, 2, 2);
scene.add(light1);

const time = new THREE.Clock;
function render(timestamp) {
    const delta = time.getDelta();
    renderer.render(scene, camera);

    cube.rotation.y += 2 * delta;
}

renderer.setAnimationLoop(render);

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});