var plateScene = function() {
    "use strict";

    var renderer
    var scene;
    var controls;
    var camera;
    var dom;
    var dummies = [];
    var rotating;
    var mouseButtonDown;
    var lastHover = null;
    var playCallback = function(x, y, me) {};
    var endGame = false;
    var rotationInitialPosition = {
        x: 0,
        y: 0
    };
    var _this = this;

    var getXY = function(event) {
        if (typeof event.x !== 'undefined') {
            return {
                x: event.x,
                y: event.y,
                offsetX: event.offsetX,
                offsetY: event.offsetY
            }
        };
        return {
            x: event.pageX - event.target.offsetLeft,
            y: event.pageY - event.target.offsetTop,
            offsetX: event.pageX,
            offsetY: event.pageY
        };
    }

    var createCube = function(size, texture) {
        var geometry = new THREE.CubeGeometry(size, size, size);

        var material;
        if (typeof texture === 'string') {
            material = new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture(texture, new THREE.SphericalReflectionMapping(), function() {
                    renderer.render(scene, camera);
                }),
                overdraw: true
            });
        } else {
            material = texture;
        }
        return new THREE.Mesh(geometry, material);
    };

    var createMark = function(texture) {
        var geometry = new THREE.CubeGeometry(30, 30, 30);

        var material;
        if (typeof texture === 'string') {
            material = new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture(texture, new THREE.SphericalReflectionMapping(), function() {
                    renderer.render(scene, camera);
                }),
                overdraw: true
            });
        } else {
            material = texture;
        }

        return new THREE.Mesh(geometry, material);
    };

    this.createTexture = function(texture) {
        return new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture(texture, new THREE.SphericalReflectionMapping(), function() {
                renderer.render(scene, camera);
            }),
            overdraw: true
        });
    };

    var createBase = function(size, texture) {
        var geometry = new THREE.BoxGeometry(size * 4, size / 4, size * 4);

        var material;
        if (typeof texture === 'string') {
            material = new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture(texture, new THREE.SphericalReflectionMapping(), function() {
                    renderer.render(scene, camera);
                }),
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
        thisCamera.position.set(500, 1500, 1000);

        return thisCamera;
    };

    var init = function(size, dom) {
        camera = createCam();
        // on initialise le moteur de rendu
        renderer = new THREE.WebGLRenderer({
            alpha: true
        });

        // si WebGL ne fonctionne pas sur votre navigateur vous pouvez utiliser le moteur de rendu Canvas à la place
        // renderer = new THREE.CanvasRenderer();
        //renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setSize(dom.clientWidth, dom.clientHeight);
        document.getElementById('gl-container').appendChild(renderer.domElement);

        // on initialise la scène
        scene = new THREE.Scene();

        scene.add(camera);

        // on effectue le rendu de la scène
        renderer.render(scene, camera);

        addControls(camera, dom);
    };

    var animate = function() {
        requestAnimationFrame(animate);
        controls.update();
    };

    var render = function() {
        renderer.render(scene, camera);
    };

    var checkOver = function(event) {
        {
            if (endGame) {
                return;
            }

            var mouse = new THREE.Vector2();
            event.preventDefault();

            var coord = getXY(event);

            if (mouseButtonDown) {
                var distance = (rotationInitialPosition.x - coord.x) * (rotationInitialPosition.x - coord.x) + (rotationInitialPosition.y - coord.y) * (rotationInitialPosition.y - coord.y);
                if (distance > 10) {
                    rotating = true;
                }
            } else {
                rotating = false;
            }

            mouse.x = (coord.offsetX / controls.screen.width) * 2 - 1;
            mouse.y = -(coord.offsetY / controls.screen.height) * 2 + 1;

            //var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5).unproject(camera);
            var vector = new THREE.Vector3(mouse.x, mouse.y, 0.01).unproject(camera);
            var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

            var intersects = raycaster.intersectObjects(dummies);

            if (intersects.length > 0) {
                clearDummies();
                intersects[0].object.material.opacity = 0.6;
                lastHover = intersects[0].object;
                renderer.render(scene, camera);
            } else {
                lastHover = null;
                clearDummies();
                renderer.render(scene, camera);
            }
        }
    };

    var selectItem = function(event) {
        if (endGame) {
            return;
        }
        if ((lastHover) && (!rotating) && (lastHover.name)) {
            var matches = lastHover.name.match(/dummy_(\d*)-(\d*)/);
            playCallback(matches[1], matches[2], _this);
        }
        mouseButtonDown = false;
    }

    var getDummies = function() {
        var objects = [];
        var elements = scene.children;
        for (var i in elements) {
            if (elements[i].name.indexOf('dummy_') === 0) {
                objects.push(elements[i]);
            }
        }
        return objects;
    }

    var clearDummies = function() {
        for (var i in dummies) {
            dummies[i].material.opacity = 0;
        }
    }

    this.end = function() {
        endGame = true;
    }

    this.setPlayCallback = function(callback) {
        playCallback = callback;
    }

    this.init = function(size) {
        dom = document.getElementById('gl-container');
        this.dom = dom;
        init(size, this.dom);
        animate();
        this.controls = controls;
        var x = [];
        for (var i = 0; i < 4; i++) {
            var y = [];
            for (var j = 0; j < 4; j++) {
                this.addDummyCube(size, i, j, 0);
            }
            x.push(y);
        }
        this.dom.addEventListener('mousemove', checkOver, false);
        this.dom.addEventListener('mouseup', selectItem, false);
        this.dom.addEventListener('mousedown', function(event) {
            mouseButtonDown = true;
            var coord = getXY(event);
            rotationInitialPosition = {
                x: coord.x,
                y: coord.y
            }
        }, false);
    };

    this.addCube = function(size, texture, x, y, z) {
        var cube = createCube(size, texture);
        cube.position.x = x * size - 3 * size / 2;
        cube.position.y = z * size + 5 * size / 8;
        cube.position.z = y * size - 3 * size / 2;
        scene.add(cube);
        renderer.render(scene, camera);
        return cube;
    };

    this.highlightWinner = function(data) {
        var material;
        for (var i in data) {
            if (!data[i].highlight) {
                data[i].data.mesh.material.opacity = 0.3;
                data[i].data.mesh.material.transparent = true;
            }
        }
        renderer.render(scene, camera);
    }

    this.addDummyCube = function(size, x, y, z) {
        var sphereMaterial = new THREE.MeshLambertMaterial({
            color: 0xfa8258,
            transparent: true,
            opacity: 0
        });
        var cube = createCube(size, sphereMaterial);
        cube.position.x = x * size - 3 * size / 2;
        cube.position.y = z * size + 5 * size / 8;
        cube.position.z = y * size - 3 * size / 2;
        cube.name = 'dummy_' + x + '-' + y;
        scene.add(cube);
        renderer.render(scene, camera);
        dummies = getDummies();
        return cube;
    };

    this.removeDummyCube = function(x, y) {
        var elements = scene.children;
        for (var i in elements) {
            if (elements[i].name === 'dummy_' + x + '-' + y) {
                scene.remove(elements[i]);
            }
        }
        renderer.render(scene, camera);
        dummies = getDummies();
    }

    this.createBase = function(size, texture) {
        scene.add(createBase(size, texture));

        renderer.render(scene, camera);
    };
};

var plate = new plateScene();