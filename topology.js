// ============================================
// 3D Wireframe Topology — Hero Section
// Color: 0xff6b00 (orange accent)
// ============================================
(function() {
    if (typeof THREE === 'undefined') return;

    var container = document.getElementById('topology-container');
    if (!container) return;

    var config = {
        complexity: 3,
        speed: 0.005,
        pulse: 0.5,
        color: 0xff6b00
    };

    var scene = new THREE.Scene();
    var w = container.clientWidth || 400;
    var h = container.clientHeight || 400;

    var camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera.position.z = 5;

    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    var geometry, material, mesh;

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

    var complexityEl = document.getElementById('complexity');
    var speedEl = document.getElementById('speed');
    var deformationEl = document.getElementById('deformation');

    if (complexityEl) complexityEl.addEventListener('input', function(e) {
        config.complexity = parseInt(e.target.value);
        createMesh(config.complexity);
    });

    if (speedEl) speedEl.addEventListener('input', function(e) {
        config.speed = parseFloat(e.target.value);
    });

    if (deformationEl) deformationEl.addEventListener('input', function(e) {
        config.pulse = parseFloat(e.target.value);
    });

    var startTime = Date.now();

    function animate() {
        requestAnimationFrame(animate);
        var elapsed = (Date.now() - startTime) / 1000;

        if (mesh) {
            mesh.rotation.x += config.speed;
            mesh.rotation.y += config.speed * 1.2;
            var s = 1 + (Math.sin(elapsed * 2) * 0.05 * config.pulse);
            mesh.scale.set(s, s, s);
        }

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', function() {
        var nw = container.clientWidth;
        var nh = container.clientHeight;
        if (nw === 0 || nh === 0) return;
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh);
    });
})();
