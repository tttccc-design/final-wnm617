$(function(){

    //button id
    $("#changeColor").click(function(){
        $("#world2").css("background","linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)")

    });

});

var Colors = {
    white:0xffffff,
    blueDark:0x50C6E8,
    brown:0x3D0E00,
    pink:0xf25346,
    brownDark:0x001727,
    green:0x00213D,
    gray:0xFF1939,
    black:0x333333,
    yello:0xFCD52B,
    darkyello:0xB5A814,
    darkred:0xD72731,
    blue:0x48c6ef,
};

var scene, camera, fieldOfView, aspectRatio, nearObject, farObject, HEIGHT, WIDTH,
    renderer, container, controls;

function createScene() {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    scene = new THREE.Scene;

    scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);

    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 60;
    nearObject = 1;
    farObject = 10000;
    camera = new THREE.PerspectiveCamera(
        fieldOfView,
        aspectRatio,
        nearObject,
        farObject
    );

    camera.position.z = 60;
    controls = new THREE.OrbitControls(camera);
    controls.autoRotate = false;


    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });

    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true;

    container = document.getElementById('world2');
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', handleWindowResize, false);
}

function handleWindowResize() {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}

var ambientLight, hemisphereLight, shadowLight;

function createLights() {
    hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9)
    ambientLight = new THREE.AmbientLight(0xdc8874, .5);
    shadowLight = new THREE.DirectionalLight(0xffffff, .9);
    shadowLight.position.set(150, 350, 350);
    shadowLight.castShadow = true;
    shadowLight.shadow.camera.left = -400;
    shadowLight.shadow.camera.right = 400;
    shadowLight.shadow.camera.top = 400;
    shadowLight.shadow.camera.bottom = -400;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 1000;
    shadowLight.shadow.mapSize.width = 4096;
    shadowLight.shadow.mapSize.height = 4096;

    var ch = new THREE.CameraHelper(shadowLight.shadow.camera);

    scene.add(hemisphereLight);
    scene.add(shadowLight);
    scene.add(ambientLight);
}


var submarine;
var cabin;

var Submarine = function(){
    this.mesh = new THREE.Object3D();
    this.mesh.name = "submarine";

    // Cabin， 是 第一个图形, 只有 这个 起始 的 图形， 不用 管 其 position；
    var geomCabin = new THREE.BoxGeometry(140,80,50,10,10,10);
    var matCabin = new THREE.MeshPhongMaterial({color:Colors.yello, shading:THREE.FlatShading});
    cabin = new THREE.Mesh(geomCabin, matCabin); // 该 Mesh（）函数 是 把 上面 两个变量 geomCabin 与 matCabin 内容合并到一起！即 把 css效果加载到 模型上！
    cabin.castShadow = true;    //  用于设置 阴影；
    cabin.receiveShadow = true; //  用于设置 阴影；
    this.mesh.add(cabin);       //  该代码 表示 把 刚 画的 这个 cabin的 图形 add 到 我们的 mesh 中；下面 每画完 一个 图形， 都要 add 到 mesh中！

    // Front
    var geomFront = new THREE.BoxGeometry(20,80,50,0,1,1); // 我们的身体， 长 20，
    var matFront = new THREE.MeshPhongMaterial({color:Colors.blue, transparent:true, opacity:0.8, shading:THREE.FlatShading}); //可以给一系列的 css 属性；
    var engine = new THREE.Mesh(geomFront, matFront);
    geomFront.vertices[0].y-=20; //  一个立方体， 8 个点， 且 位置1是 固定， 在 数组为 0 - 7；
    geomFront.vertices[0].z-=10; // 根据前面 camera的设置， 值越小， 离我们 越近， 值越大， 离越远； 画坐标理解！
    geomFront.vertices[1].y-=20;
    geomFront.vertices[1].z+=10;
    geomFront.vertices[2].y+=20;
    geomFront.vertices[2].z-=10;
    geomFront.vertices[3].y+=20;
    geomFront.vertices[3].z+=10;
    engine.position.x = 80; // 要把这第二个图形，从原点向右推80；因为所有图形默认都是从原点坐标开始，且坐标原点是在x／y/z长度的 center位置！且默认的 所有图形会 重叠；我们第一个图形 x方向上长为 140， 所有在x轴 正方向上长为70， 所以第二个图形理论上要向右推70，但现在第二个图形自身x轴上长20，在x轴负方向上还有10，所以总共要推80！
    engine.castShadow = true;
    engine.receiveShadow = true;
    this.mesh.add(engine);

    // Back
    var geomBack = new THREE.BoxGeometry(30,80,50,1,1,1);
    var matBack = new THREE.MeshPhongMaterial({color:Colors.darkyello, shading:THREE.FlatShading});
    var engine = new THREE.Mesh(geomBack, matBack);
    geomBack.vertices[4].y-=20;
    geomBack.vertices[4].z+=10;
    geomBack.vertices[5].y-=20;
    geomBack.vertices[5].z-=10;
    geomBack.vertices[6].y+=20;
    geomBack.vertices[6].z+=10;
    geomBack.vertices[7].y+=20;
    geomBack.vertices[7].z-=10;
    engine.position.x = -85;  // position.x 单独设置 x 的属性！
    engine.castShadow = true;
    engine.receiveShadow = true;
    this.mesh.add(engine);

    // Top
    var geomTop = new THREE.BoxGeometry(50,30,40,10,10,10);
    var matTop = new THREE.MeshPhongMaterial({color:Colors.darkyello, shading:THREE.FlatShading});
    var top = new THREE.Mesh(geomTop, matTop);
    top.position.set(10,50,0); // position.set（）可以同时设置x, y, z 三属性！
    top.castShadow = true;
    top.receiveShadow = true;
    this.mesh.add(top);

    // Box
    var geomBox = new THREE.BoxGeometry(10,30,20,10,10,10);
    var matBox = new THREE.MeshPhongMaterial({color:Colors.darkyello, shading:THREE.FlatShading});
    var box = new THREE.Mesh(geomBox, matBox);
    box.position.set(10,70,0);
    box.castShadow = true;
    box.receiveShadow = true;
    this.mesh.add(box);

    // Box2
    var geomBox2 = new THREE.BoxGeometry(10,10,10,10,10,10);
    var matBox2 = new THREE.MeshPhongMaterial({color:Colors.white, shading:THREE.FlatShading});
    var box2 = new THREE.Mesh(geomBox2, matBox2);
    box2.position.set(15,80,0);
    box2.castShadow = true;
    box2.receiveShadow = true;
    this.mesh.add(box2);

    // Window
    var geomWindow = new THREE.CircleGeometry( 15, 32 );
    var matWindow = new THREE.MeshBasicMaterial( { color:Colors.blue} );
    var Window = new THREE.Mesh( geomWindow, matWindow );
    Window.position.set(30,5,28);
    Window.castShadow = true;
    Window.receiveShadow = true;
    this.mesh.add(Window);

    // Window2
    var geomWindow2 = new THREE.CircleGeometry( 15, 32 );
    var matWindow2 = new THREE.MeshBasicMaterial( { color:Colors.blue} );
    var Window2 = new THREE.Mesh( geomWindow2, matWindow2 );
    Window2.position.set(-30,5,28);
    Window2.castShadow = true;
    Window2.receiveShadow = true;
    this.mesh.add(Window2);



    // Window3
    var geomWindow3 = new THREE.CircleGeometry( 15, 32 );
    var matWindow3 = new THREE.MeshBasicMaterial( { color:Colors.blue} );
    var Window3 = new THREE.Mesh( geomWindow3, matWindow3 );
    Window3.position.set(30,5,-28);
    Window3.rotation.x = Math.PI ; // rotation 这里是 按 圆周率 来 算的!!! Math.PI是 转 180； Math.PI/2 是 转 90；
    Window3.castShadow = true;
    Window3.receiveShadow = true;
    this.mesh.add(Window3);


    // Window4
    var geomWindow4 = new THREE.CircleGeometry( 15, 32 );
    var matWindow4 = new THREE.MeshBasicMaterial( { color:Colors.blue} );
    var Window4 = new THREE.Mesh( geomWindow4, matWindow4 );
    Window4.position.set(-30,5,-28);
    Window4.rotation.x = Math.PI ;
    Window4.castShadow = true;
    Window4.receiveShadow = true;
    this.mesh.add(Window4);



    // Wings1
    var geomSideWing = new THREE.BoxGeometry(60,5,50,1,1,1);
    var matSideWing = new THREE.MeshPhongMaterial({color:Colors.darkyello, shading:THREE.FlatShading});
    var sideWing = new THREE.Mesh(geomSideWing, matSideWing);
    sideWing.position.set(0,-18,20);
    geomSideWing.vertices[0].x-=20;
    geomSideWing.vertices[2].x-=20;
    geomSideWing.vertices[5].x+=20;
    geomSideWing.vertices[7].x+=20;
    sideWing.castShadow = true;
    sideWing.receiveShadow = true;
    this.mesh.add(sideWing);


    // Wings2
    var geomSideWing2 = new THREE.BoxGeometry(60,5,50,1,1,1);
    var matSideWing2 = new THREE.MeshPhongMaterial({color:Colors.darkyello, shading:THREE.FlatShading});
    var sideWing2 = new THREE.Mesh(geomSideWing2, matSideWing2);
    sideWing2.position.set(0,-18,-20);
    geomSideWing2.vertices[1].x-=20;
    geomSideWing2.vertices[3].x-=20;
    geomSideWing2.vertices[4].x+=20;
    geomSideWing2.vertices[6].x+=20;
    sideWing2.castShadow = true;
    sideWing2.receiveShadow = true;
    this.mesh.add(sideWing2);


    //Propeller
    var geomPropeller = new THREE.BoxGeometry(20,10,10,1,1,1);
    geomPropeller.vertices[4].y-=5;
    geomPropeller.vertices[4].z+=5;
    geomPropeller.vertices[5].y-=5;
    geomPropeller.vertices[5].z-=5;
    geomPropeller.vertices[6].y+=5;
    geomPropeller.vertices[6].z+=5;
    geomPropeller.vertices[7].y+=5;
    geomPropeller.vertices[7].z-=5;
    var matPropeller = new THREE.MeshPhongMaterial({color:Colors.black, shading:THREE.FlatShading});
    this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
    this.propeller.castShadow = true;
    this.propeller.receiveShadow = true;

    //Blade
    var geomBlade = new THREE.BoxGeometry(1,65,10,1,1,1);
    var matBlade = new THREE.MeshPhongMaterial({color:Colors.brownDark, shading:THREE.FlatShading});
    var blade1 = new THREE.Mesh(geomBlade, matBlade);
    blade1.position.set(-6,0,0);
    blade1.castShadow = true;
    blade1.receiveShadow = true;

    var blade2 = blade1.clone();
    blade2.rotation.x = Math.PI/2;
    blade2.castShadow = true;
    blade2.receiveShadow = true;

    this.propeller.add(blade1);
    this.propeller.add(blade2);
    this.propeller.position.set(-105,0,0);
    this.mesh.add(this.propeller);

    var suspensionGeom = new THREE.BoxGeometry(4,20,4);
    suspensionGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,10,0))
    var suspensionMat = new THREE.MeshPhongMaterial({color:Colors.yello, shading:THREE.FlatShading});
    var suspension = new THREE.Mesh(suspensionGeom,suspensionMat);
    suspension.position.set(-35,-5,0);
    suspension.rotation.z = -.3;
    this.mesh.add(suspension);

    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

};

function createSubmarine(){
    submarine = new Submarine();
    submarine.mesh.scale.set(.25,.25,.25);
    scene.add(submarine.mesh);
}

function updateSubmarine(){

    submarine.propeller.rotation.x += 0.05;  // 控制 螺旋桨 的转速；
}


function loop(){
    submarine.mesh.rotation.y += .006;

    updateSubmarine();

    renderer.render(scene, camera);
    requestAnimationFrame(loop);
}

window.addEventListener('load', init, false);

function init(event){
    createScene();
    createLights();
    createSubmarine();

    loop();
}