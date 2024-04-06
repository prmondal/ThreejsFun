import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(3,3,3);
camera.lookAt(0,0,0);

const gridHelper = new THREE.GridHelper();
scene.add(gridHelper);

const renderer = new THREE.WebGLRenderer({ antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );
document.body.appendChild( renderer.domElement );

const cubeGroup = new THREE.Group;

const BoxGeometry = new THREE.BoxGeometry(1,1,1);
const matrial = new THREE.MeshStandardMaterial();
const cube = new THREE.Mesh(BoxGeometry, matrial);
cubeGroup.add(cube);

const wireframe = new THREE.WireframeGeometry(BoxGeometry);
const wireframeMaterial = new THREE.MeshStandardMaterial();
const line = new THREE.LineSegments(wireframe, wireframeMaterial);
cubeGroup.add(line);
cubeGroup.position.set(0,1.5,0);

scene.add(cubeGroup);

const points = new Float32Array([
    -5.0, 0.0, 5.0,
    5.0, 0.0, 5.0,
    5.0, 0.0, -5.0,
    -5.0, 0.0, -5.0
]);

const indices = [
    0,1,2,
    0,2,3
];

const groundPlaneGeometry = new THREE.BufferGeometry();
groundPlaneGeometry.setIndex(indices);
groundPlaneGeometry.setAttribute('position', new THREE.BufferAttribute(points, 3)); 
const groundPlaneMatrial = new THREE.MeshBasicMaterial({ color: 'green'});
const groundPlaneMesh = new THREE.Mesh(groundPlaneGeometry, groundPlaneMatrial);
groundPlaneMesh.matrixAutoUpdate = false;
scene.add(groundPlaneMesh);

const ballGeometry = new THREE.SphereGeometry( .5, 32, 16 ); 
const ballMaterial =  new THREE.MeshPhongMaterial({
    color: 0x777777,
    shininess: 500,
});
const ball = new THREE.Mesh( ballGeometry, ballMaterial );
scene.add(ball);

const light1 = new THREE.PointLight('red', 100);
light1.position.set(4,4,4);
scene.add(light1);

const time = new THREE.Clock;
function render(timestamp)
{
    const delta = time.getDelta();
    renderer.render(scene, camera);

    const speed = 2;
    cubeGroup.rotation.x += speed * delta;
	cubeGroup.rotation.y += speed * delta;
}

renderer.setAnimationLoop(render);

window.addEventListener('resize', () => {
    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});