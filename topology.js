// ============================================
// COLOR CONFIG — Change hex to rebrand
// Teal:       0x008080
// Dark Orange: 0x8B4513
// Dark Red:    0x8B0000
// ============================================
var TOPO_COLOR = 0x008080;

(function() {
    var container = document.getElementById('topology-container');
    if (!container || typeof THREE === 'undefined') return;

    var scene = new THREE.Scene();
    var w = container.clientWidth || 400;
    var h = container.clientHeight || 400;

    var camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    camera.position.z = 3.5;

    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    var geometry = new THREE.IcosahedronGeometry(1.5, 3);
    var material = new THREE.MeshBasicMaterial({
        color: TOPO_COLOR,
        wireframe: true,
        transparent: true,
        opacity: 0.55
    });
    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    var time = 0;

    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;
        mesh.rotation.x += 0.003;
        mesh.rotation.y += 0.002;
        var s = 1 + Math.sin(time * 0.8) * 0.06;
        mesh.scale.set(s, s, s);
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
