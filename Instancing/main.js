import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const instanced = true;
let instancedMesh = null;
let nonInstancedMeshCollection = [];
const maxObjectsCount = 1000;

const renderer = new THREE.WebGLRenderer({ antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );
document.body.appendChild( renderer.domElement );

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const orbitControl = new OrbitControls( camera, renderer.domElement );

const scene = new THREE.Scene();
camera.position.set(40,40,40);
camera.lookAt(0,0,0);

const light1 = new THREE.PointLight('white', 2000);
light1.position.set(35,35,35);
scene.add(light1);

const geometry = new THREE.BoxGeometry(1,1,1);

const root = new THREE.Object3D;
scene.add(root);

let rayCaster = new THREE.Raycaster;
let pointer = new THREE.Vector2;

if (!instanced)
{
    for (let i = 0; i < maxObjectsCount; i++)
    {
        const material = new THREE.MeshStandardMaterial();
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = (Math.random() - 0.5) * 50;
        mesh.position.y = (Math.random() - 0.5) * 50;
        mesh.position.z = (Math.random() - 0.5) * 50;

        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;

        mesh.material.color = new THREE.Color(Math.random(), Math.random(), Math.random());
        root.add(mesh);
        nonInstancedMeshCollection.push(mesh);
    }
} else {
    const material = new THREE.MeshStandardMaterial();
    instancedMesh = new THREE.InstancedMesh(geometry, material, maxObjectsCount);
    root.add(instancedMesh);

    let dummy = new THREE.Object3D;
    dummy.matrixAutoUpdate = false;

    for (let i = 0; i < maxObjectsCount; i++)
    {
        dummy.position.x = (Math.random() - 0.5) * 50;
        dummy.position.y = (Math.random() - 0.5) * 50;
        dummy.position.z = (Math.random() - 0.5) * 50;

        dummy.rotation.x = Math.random() * Math.PI;
        dummy.rotation.y = Math.random() * Math.PI;

        dummy.updateMatrix();
        instancedMesh.setMatrixAt(i, dummy.matrix);
        instancedMesh.setColorAt(i, new THREE.Color(Math.random(), Math.random(), Math.random()));
    }
}

window.addEventListener('resize', () => {
    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

window.addEventListener('mousemove', (e) => {
    pointer.x = e.clientX / window.innerWidth * 2.0 - 1.0;
    pointer.y = -e.clientY / window.innerHeight * 2.0 + 1.0;
});

function updateRayCaster() {
    rayCaster.setFromCamera(pointer, camera);
    
    const intersects = rayCaster.intersectObjects(root.children);
    if (intersects.length) {
        const objectPicked = intersects[0].object;
        if (objectPicked.isInstancedMesh) {
            instancedMesh.setColorAt(intersects[0].instanceId, new THREE.Color('yellow'));
            instancedMesh.instanceColor.needsUpdate = true;
        }
        else {
            intersects[0].object.material.color.set('yellow');
        }
    }
}

function updateScene(deltaTime) {
    root.rotateOnAxis(new THREE.Vector3(0.0, 1.0, 0.0), deltaTime * 0.02);

    if (instanced) {
        const tempMatrix = new THREE.Matrix4;
        let dummy = new THREE.Object3D;
        dummy.matrixAutoUpdate = false;

        for (let i = 0; i < maxObjectsCount; i++) {
            instancedMesh.getMatrixAt(i, tempMatrix);
            tempMatrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
            
            dummy.rotation.x += deltaTime * 2;
            dummy.rotation.y += deltaTime * 2;

            dummy.updateMatrix();
            instancedMesh.setMatrixAt(i, dummy.matrix);
        }

        instancedMesh.instanceMatrix.needsUpdate = true;
    } else {
        for (let i = 0; i < maxObjectsCount; i++) {
            const mesh = nonInstancedMeshCollection[i];

            mesh.rotation.x += deltaTime * 2;
            mesh.rotation.y += deltaTime * 2;
        }
    }
}

const time = new THREE.Clock;
function render(timestamp)
{
    const deltaTime = time.getDelta();

    orbitControl.update(deltaTime);
    updateScene(deltaTime);
    updateRayCaster();

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(render);

