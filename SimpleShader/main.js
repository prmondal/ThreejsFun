import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0,5,0);
camera.lookAt(0,0,0);

const renderer = new THREE.WebGLRenderer({ antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );
document.body.appendChild( renderer.domElement );

const vertexShader = `
    uniform float displacement;

    void main() {
        vec3 vPosition = position + displacement * normal;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);
    }
`;

const fragmentShader = `
    uniform float time;
    uniform vec2 resolution;
    
    void main() {
        vec2 st = gl_FragCoord.xy/resolution;
        gl_FragColor = vec4(1.0, sin(time*st.x), sin(time*st.y), 1.0);
    }
`;

const ballGeometry = new THREE.SphereGeometry( .5, 32, 16 ); 
const ballMaterial =  new THREE.ShaderMaterial({
    uniforms: {
        time: {
            value: 0
        },
        resolution: {
            value: {
                x: null,
                y: null
            }
        },
        displacement: {
            value: 0
        }
    },
    fragmentShader: fragmentShader,
    vertexShader: vertexShader
});
const ball = new THREE.Mesh( ballGeometry, ballMaterial );
scene.add(ball);

function render(timestamp)
{
    ballMaterial.uniforms.time.value = timestamp / 1000;

    ballMaterial.uniforms.resolution.value.x = window.innerWidth;
    ballMaterial.uniforms.resolution.value.y = window.innerHeight;

    ballMaterial.uniforms.displacement.value = Math.abs(Math.sin(timestamp/2000));

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(render);

window.addEventListener('resize', () => {
    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});