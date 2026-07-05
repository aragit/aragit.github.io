import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ============================================
// COLOR CONFIG — Change this to rebrand
// Teal:       0x008080
// Dark Orange: 0x8B4513
// Dark Red:    0x8B0000
// ============================================
const config = {
    color: 0x008080,
    wireframeOpacity: 0.6,
    pulseSpeed: 0.8,
    pulseAmount: 0.08,
    rotateSpeed: 0.003,
    cameraZ: 3.5,
};

const container = document.getElementById('topology-container');
if (container) {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        50,
        container.clientWidth / container.clientHeight,
        0.1,
        100
    );
    camera.position.z = config.cameraZ;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(1.5, 3);
    const material = new THREE.MeshBasicMaterial({
        color: config.color,
        wireframe: true,
        transparent: true,
        opacity: config.wireframeOpacity,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.autoRotate = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    let time = 0;

    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;

        mesh.rotation.x += config.rotateSpeed;
        mesh.rotation.y += config.rotateSpeed * 0.7;

        const pulse = 1 + Math.sin(time * config.pulseSpeed) * config.pulseAmount;
        mesh.scale.set(pulse, pulse, pulse);

        controls.update();
        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        if (!container) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });
}
