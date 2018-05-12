$(function() {
	
    $("#reset_button").click(function(){
    	location.reload();
    });

});
/*Reference: https://tympanus.net/codrops/2016/04/26/the-aviator-animating-basic-3d-scene-threejs/*/
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
	renderer, container;

var collidableMeshList = [];

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
	
	camera.position.x = -50;
	camera.position.z = 180;
	camera.position.y = 100;
	camera.rotation.y = 50;

	renderer = new THREE.WebGLRenderer({ 
		alpha: true, 
		antialias: true 
	});

	renderer.setSize(WIDTH, HEIGHT);	
	renderer.shadowMap.enabled = true;
	
	container = document.getElementById('world');
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

var mousePos={x:0, y:0};

function handleMouseMove(event) {
	var tx = -1 + (event.clientX / WIDTH)*2;
	var ty = 1 - (event.clientY / HEIGHT)*2;
	mousePos = {x:tx, y:ty};
}

function handleTouchMove(event) {
    event.preventDefault();
    var tx = -1 + (event.touches[0].pageX / WIDTH)*2;
    var ty = 1 - (event.touches[0].pageY / HEIGHT)*2;
    mousePos = {x:tx, y:ty};
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

var Ground = function(){
	var geom = new THREE.CylinderGeometry(600,650,400,40,10);
	geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
	geom.mergeVertices();
	var l = geom.vertices.length;

	this.waves = [];

	for (var i=0; i<l; i++){
		var v = geom.vertices[i];
		this.waves.push({y:v.y,
						 x:v.x,
						 z:v.z,
						 ang:Math.random()*Math.PI*2,	
						 amp:5 + Math.random()*15,
						 speed:0.016 + Math.random()*0.032
						});
	};
	var mat = new THREE.MeshPhongMaterial({
		color:Colors.green,
		opacity:.9,
		shading:THREE.FlatShading,
	});

	this.mesh = new THREE.Mesh(geom, mat);
	this.mesh.receiveShadow = true;
}

Ground.prototype.moveWaves = function (){	
	var verts = this.mesh.geometry.vertices;
	var l = verts.length;
	
	for (var i=0; i<l; i++){
		var v = verts[i];		
		var vprops = this.waves[i];		
		v.x = vprops.x + Math.cos(vprops.ang)*vprops.amp/2;
		v.y = vprops.y + Math.sin(vprops.ang)*vprops.amp/2;
		vprops.ang += vprops.speed;
	}
	this.mesh.geometry.verticesNeedUpdate=true;
	ground.mesh.rotation.z += .001;
}

var ground;

function createGround(){
	ground = new Ground();
	ground.mesh.position.y = -600;
	scene.add(ground.mesh);
}

var submarine;
var cabin;

var Submarine = function(){
	this.mesh = new THREE.Object3D();
	this.mesh.name = "submarine";

	// Cabin
	var geomCabin = new THREE.BoxGeometry(140,80,50,10,10,10);
	var matCabin = new THREE.MeshPhongMaterial({color:Colors.yello, shading:THREE.FlatShading});
	cabin = new THREE.Mesh(geomCabin, matCabin);
	cabin.castShadow = true;
	cabin.receiveShadow = true;
	this.mesh.add(cabin);

	// Front
	var geomFront = new THREE.BoxGeometry(20,80,50,0,1,1);
	var matFront = new THREE.MeshPhongMaterial({color:Colors.blue, transparent:true, opacity:0.8, shading:THREE.FlatShading});
	var engine = new THREE.Mesh(geomFront, matFront);
	geomFront.vertices[0].y-=20;
	geomFront.vertices[0].z-=20;
	geomFront.vertices[1].y-=20;
	geomFront.vertices[1].z+=20;
	geomFront.vertices[2].y+=20;
	geomFront.vertices[2].z-=20;
	geomFront.vertices[3].y+=20;
	geomFront.vertices[3].z+=20;
	engine.position.x = 80;
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
	engine.position.x = -85;
	engine.castShadow = true;
	engine.receiveShadow = true;
	this.mesh.add(engine);

	// Top
	var geomTop = new THREE.BoxGeometry(50,30,40,10,10,10);
	var matTop = new THREE.MeshPhongMaterial({color:Colors.darkyello, shading:THREE.FlatShading});
	var top = new THREE.Mesh(geomTop, matTop);
	top.position.set(10,50,0);
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

	// Wings
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
	submarine.mesh.position.y = 100;
	scene.add(submarine.mesh);
}

function updateSubmarine(){
	var targetY = normalize(mousePos.y,-.75,.75,25, 175);
	var targetX = normalize(mousePos.x,-.75,.75,-100, 100);
	
	submarine.mesh.position.y += (targetY-submarine.mesh.position.y)*0.1;
	submarine.mesh.rotation.z = (targetY-submarine.mesh.position.y)*0.0128;
	submarine.mesh.rotation.x = (submarine.mesh.position.y-targetY)*0.0064;

	submarine.propeller.rotation.x += 0.3;
}

var Trash = function(){
	this.mesh = new THREE.Object3D();	
	var geom = new THREE.CubeGeometry(10,10,10,10,10,10);
	var mat = new THREE.MeshPhongMaterial({
		color:Colors.pink,
	});
	var m = new THREE.Mesh(geom, mat);

	this.mesh.add(m);
	collidableMeshList.push(m);
}

var TrashSky = function (nTrashs){
	this.mesh = new THREE.Object3D();
	this.nTrashs = 70;
	var stepAngle2 = Math.PI*2 / this.nTrashs;

	for(var i=0; i<this.nTrashs; i++){
		var c = new Trash();	 
		var a = stepAngle2*i;
		var h = 1500 + Math.random()*130;

		c.mesh.position.y = Math.sin(a)*h;
		c.mesh.position.x = Math.cos(a)*h;
		c.mesh.rotation.z = a + Math.PI/2;

		this.mesh.add(c.mesh);

	}  
}

var trashsky;

function createTrash(){
	trashsky = new TrashSky();
	trashsky.mesh.position.y = -1450;
	scene.add(trashsky.mesh);
	//console.log(collidableMeshList);
}

var Cloud = function(){
	this.mesh = new THREE.Object3D();	
	var geom = new THREE.OctahedronGeometry( 3, 5 );
	var mat = new THREE.MeshPhongMaterial({
		color:Colors.white,
	});
	var m = new THREE.Mesh(geom, mat); 		
	this.mesh.add(m); 
}

var Sky = function(){
	this.mesh = new THREE.Object3D();	
	this.nClouds = 50;
	var stepAngle = Math.PI*2 / this.nClouds;
	
	for(var i=0; i<this.nClouds; i++){
		var c = new Cloud();
		var a = stepAngle*i;
		var h = 1500 + Math.random()*500;

		c.mesh.position.y = Math.sin(a)*h;
		c.mesh.position.x = Math.cos(a)*h;
		c.mesh.rotation.z = a + Math.PI/2;
		c.mesh.position.z = -600-Math.random()*400;
		
		var s = 1+Math.random()*2;
		c.mesh.scale.set(s,s,s);

		this.mesh.add(c.mesh); 
	}
}

var sky;

function createSky(){
	sky = new Sky();
	sky.mesh.position.y = -1350;
	scene.add(sky.mesh);
}

function normalize(v,vmin,vmax,tmin, tmax){
	var nv = Math.max(Math.min(v,vmax), vmin);
	var dv = vmax-vmin;
	var pc = (nv-vmin)/dv;
	var dt = tmax-tmin;
	var tv = tmin + (pc*dt);
	return tv;
}

function collision(){
	var oneTrash;
	var trashPos = new THREE.Vector3();
	var heroPos = submarine.mesh.position.clone();
	var score = $("#score").text();
	var score_int = parseInt(score);

	for (var i=0; i<this.collidableMeshList.length; i++){
		oneTrash = collidableMeshList[i];
		trashPos.setFromMatrixPosition( oneTrash.matrixWorld );

		if(trashPos.x>0 && trashPos.x<200 && trashPos.y>0){
			var xPoint = trashPos.x;
			var yPoint = trashPos.y - heroPos.y;

			if(xPoint > -30 && xPoint < 30 && yPoint <= 25 && yPoint >= -25){
				//console.log(score);
				collidableMeshList[i].scale.set(0,0,0);
				collidableMeshList.splice(i, 1);
				score_int = score_int + 5;
				$("#score").text(score_int);
			}
		}
	}
}

var timeout = false;

function countdownTimer(){
	document.getElementById('countdowntimer').innerHTML =
	  00 + ":" + 20;
	startTimer();

	function startTimer() {
	  var presentTime = document.getElementById('countdowntimer').innerHTML;
	  var timeArray = presentTime.split(/[:]+/);
	  var m = timeArray[0];
	  var s = checkSecond((timeArray[1] - 1));
	  if(s==59){m=m-1}
	  if(m<0){
	  	timeout = true;
	  	return;
	  }  
	  document.getElementById('countdowntimer').innerHTML =
	    m + ":" + s;
	  setTimeout(startTimer, 1000);
	}

	function checkSecond(sec) {
	  if (sec < 10 && sec >= 0) {sec = "0" + sec};
	  if (sec < 0) {sec = "59"};
	  return sec;
	}
}

var planeFallSpeed=.001;
var deltaTime = 500;
var speed = .0015;

function loop(){

	if(timeout == false){
		if(speed < .0045){
			speed = speed + .000005;
		}
		ground.mesh.rotation.z += speed;
		sky.mesh.rotation.z += speed;
		trashsky.mesh.rotation.z += speed;
		ground.moveWaves();
	}else{
		ground.mesh.rotation.z += .001;
		sky.mesh.rotation.z += .001;
		trashsky.mesh.rotation.z += .001;
		submarine.mesh.rotation.z += (-Math.PI/2 - submarine.mesh.rotation.z)*.0002*deltaTime;
	    submarine.mesh.rotation.x += 0.0003*deltaTime;
	    planeFallSpeed *= 1.05;
    	submarine.mesh.position.y -= planeFallSpeed*deltaTime;
    	setTimeout(function(){
    		$("#reset_button").css("visibility","visible");
    	}, 2000);
	}

	ground.moveWaves();
	updateSubmarine();
	
	renderer.render(scene, camera);
	requestAnimationFrame(loop);

	collision();
}

function init(event){
	createScene();
	createLights();
	createSubmarine();
	createGround();
	createSky();
	createTrash();
	countdownTimer();

	document.addEventListener('mousemove', handleMouseMove, false);
	document.addEventListener('touchmove', handleTouchMove, false);

	loop();
}

window.addEventListener('load', init, false);

