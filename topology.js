import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// --- Configuration ---
const config = {
    complexity: 3,
    speed: 0.005,
    pulse: 0.5,
    color: 0xff6b00 // Your existing orange accent
};

// --- Setup Scene ---
const container = document.getElementById('topology-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// --- Controls ---
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = false;
controls.autoRotate = false;

// --- Mesh & Material ---
let geometry, material, mesh;

function createMesh(detail) {
    if (mesh) {
        geometry.dispose();
        scene.remove(mesh);
    }
    geometry = new THREE.IcosahedronGeometry(1.5, detail);
    material = new THREE.MeshBasicMaterial({
        color: config.color,
        wireframe: true,
        transparent: true,
        opacity: 0.7
    });
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
}

createMesh(config.complexity);

// --- UI Event Listeners ---
document.getElementById('complexity').addEventListener('input', (e) => {
    config.complexity = parseInt(e.target.value);
    createMesh(config.complexity);
});

document.getElementById('speed').addEventListener('input', (e) => {
    config.speed = parseFloat(e.target.value);
});

document.getElementById('deformation').addEventListener('input', (e) => {
    config.pulse = parseFloat(e.target.value);
});

// --- Animation Loop ---
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    if (mesh) {
        mesh.rotation.x += config.speed;
        mesh.rotation.y += config.speed * 1.2;
        const scale = 1 + (Math.sin(elapsedTime * 2) * 0.05 * config.pulse);
        mesh.scale.set(scale, scale, scale);
    }

    controls.update();
    renderer.render(scene, camera);
}

animate();

// --- Responsive Resizing ---
window.addEventListener('resize', () => {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});
