var plateScene = function() {
    "use strict";

    var renderer, scene, controls, camera;

    var createCube = function(size, texture) {
        var geometry = new THREE.CubeGeometry(size, size, size);

        var material;
        if (typeof texture === 'string') {
            material = new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture(texture, new THREE.SphericalReflectionMapping()),
                overdraw: true
            });
        } else {
            material = texture;
        }
        return new THREE.Mesh(geometry, material);
    };

    this.createTexture = function(texture) {
        return new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture(texture, new THREE.SphericalReflectionMapping()),
            overdraw: true
        });
    };

    var createBase = function(size, texture) {
        var geometry = new THREE.BoxGeometry(size * 4, size / 4, size * 4);

        var material;
        if (typeof texture === 'string') {
            material = new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture(texture, new THREE.SphericalReflectionMapping()),
                overdraw: true
            });
        } else {
            material = texture;
        }

        return new THREE.Mesh(geometry, material);
    };

    var addControls = function(thisCamera, domElement) {
        controls = new THREE.TrackballControls(thisCamera, domElement);

        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;

        controls.noZoom = false;
        controls.noPan = false;

        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;

        controls.keys = [65, 83, 68];

        controls.addEventListener('change', render);
    };

    var createCam = function() {
        // on initialise la camera que l’on place ensuite sur la scène
        var thisCamera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
        thisCamera.position.set(500, 200, 3000);

        return thisCamera;
    };

    var init = function(size) {
        camera = createCam();
        // on initialise le moteur de rendu
        renderer = new THREE.WebGLRenderer({
            alpha: true
        });

        // si WebGL ne fonctionne pas sur votre navigateur vous pouvez utiliser le moteur de rendu Canvas à la place
        // renderer = new THREE.CanvasRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('gl-container').appendChild(renderer.domElement);

        // on initialise la scène
        scene = new THREE.Scene();

        scene.add(camera);

        // on effectue le rendu de la scène
        renderer.render(scene, camera);

        addControls(camera, document.getElementById('gl-container'));
    };

    var animate = function() {
        requestAnimationFrame(animate);
        controls.update();
    };

    var render = function() {
        renderer.render(scene, camera);
    };

    this.init = function(size) {
        init(size);
        animate();
    };

    this.addCube = function(size, texture, x, y, z) {
        var cube = createCube(size, texture);
        cube.position.x = x * size - 3 * size / 2;
        cube.position.y = z * size + 5 * size / 8;
        cube.position.z = y * size - 3 * size / 2;
        scene.add(cube);
        renderer.render(scene, camera);
    };

    this.createBase = function(size, texture) {
        scene.add(createBase(size, texture));
        renderer.render(scene, camera);
    };
};

var plate = new plateScene();