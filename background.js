
/** 1. BACKGROUND INIT
*******************************************************************/

function init_backgrounds() {

	var error_msg = "Error! No background is set or something went wrong";

	if(is_mobile_device == true && option_hero_background_mode_mobile != "match") {
		option_hero_background_mode = option_hero_background_mode_mobile;
	}
	
	function url_var_handling() {
		let searchParams = new URLSearchParams(window.location.search);
		if(searchParams.has('bg')) option_hero_background_mode = searchParams.get('bg');
	} url_var_handling();

	switch(option_hero_background_mode) {

		case "color":colorBackground(); break;
		case "square": squareBackground(); break;
		case "twisted": twistedBackground(); break;
		case "asteroids":  asteroidsBackground(); break;
		case "circle": circleBackground(); break;
		case "lines": linesBackground(); break;
		default: alert(error_msg); console.log(error_msg); break;	
	
	}

} init_backgrounds();



/** 2. COLOR BACKGROUND
*******************************************************************/

function colorBackground() {

	$("body").append('<div class="bg-color" style="background-color:' + option_hero_background_color_bg + '"></div>');

}



/** 4. ASTERIODS BACKGROUND
*******************************************************************/

function asteroidsBackground() {

	var renderer = new THREE.WebGLRenderer({antialias:true});
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.shadowMap.enabled = false;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.shadowMap.needsUpdate = true;
	renderer.domElement.id = 'canvas-asteroids';

	document.getElementById("main").appendChild( renderer.domElement );
	window.addEventListener('resize', onWindowResize, false);

	function onWindowResize() {
		
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
		
	}

	var camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 500 );
	var scene = new THREE.Scene();
	var cameraRange = 3;

	scene.fog = new THREE.Fog(option_hero_background_asteroids_bg_color, 2.5, 3.5);

	//-------------------------------------------------------------- SCENE

	var sceneGruop = new THREE.Object3D();
	var particularGruop = new THREE.Object3D();
	var modularGruop = new THREE.Object3D();

	function generateParticle(num) {

		var amp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;

		var gmaterial = new THREE.MeshStandardMaterial({

		  color: option_hero_background_asteroids_particle_color,
		  side: THREE.DoubleSide

		});

		var gparticular = new THREE.CircleGeometry(0.2, 5);
	  
		for (var i = 1; i < num; i++) {

		  var pscale = 0.001 + Math.abs(mathRandom(0.03));
		  var particular = new THREE.Mesh(gparticular, gmaterial);
		  particular.position.set(mathRandom(amp), mathRandom(amp), mathRandom(amp));
		  particular.rotation.set(mathRandom(), mathRandom(), mathRandom());
		  particular.scale.set(pscale, pscale, pscale);
		  particular.speedValue = mathRandom(1);
		  particularGruop.add(particular);

		}

	} generateParticle(200, 2);

	sceneGruop.add(particularGruop);
	scene.add(modularGruop);
	scene.add(sceneGruop);

	function mathRandom() {

		var num = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
		var setNumber = -Math.random() * num + Math.random() * num;

		return setNumber;

	}

	//------------------------------------------------------------- INIT

	function init() {

		for (var i = 0; i<30; i++) {

			var geometry = new THREE.IcosahedronGeometry(1);
			var material = new THREE.MeshStandardMaterial({flatShading :THREE.FlatShading, color:option_hero_background_asteroids_cube_color, transparent:false, opacity:1, wireframe:false});
			var cube = new THREE.Mesh(geometry, material);
			cube.speedRotation = Math.random() * 0.1;
			cube.positionX = mathRandom();
			cube.positionY = mathRandom();
			cube.positionZ = mathRandom();
			cube.castShadow = true;
			cube.receiveShadow = true;
			
			var newScaleValue = mathRandom(0.3);
			
			cube.scale.set(newScaleValue,newScaleValue,newScaleValue);
			
			cube.rotation.x = mathRandom(180 * Math.PI / 180);
			cube.rotation.y = mathRandom(180 * Math.PI / 180);
			cube.rotation.z = mathRandom(180 * Math.PI / 180);
			
			cube.position.set(cube.positionX, cube.positionY, cube.positionZ);
			modularGruop.add(cube);

		}

	}

	//------------------------------------------------------------- CAMERA

	camera.position.set(0, 0, cameraRange);

	//------------------------------------------------------------- SCENE

	var light = new THREE.SpotLight(option_hero_background_asteroids_spotlight_color, option_hero_background_asteroids_spotlight_intensity);
	light.position.set(5, 5, 2);
	light.castShadow = true;
	light.shadow.mapSize.width = 10000;
	light.shadow.mapSize.height = light.shadow.mapSize.width;
	light.penumbra = 0.5;

	var lightBack = new THREE.PointLight(option_hero_background_asteroids_pointlight_color, option_hero_background_asteroids_pointlight_intensity);
	lightBack.position.set(0, -3, -1);

	var rectLight = new THREE.RectAreaLight(option_hero_background_asteroids_rectarealight_color, option_hero_background_asteroids_rectarealight_intensity,  2, 2);
	rectLight.position.set( 0, 0, 1 );
	rectLight.lookAt( 0, 0, 0 );

	scene.add(light);
	scene.add(lightBack);
	scene.add(rectLight)


	//------------------------------------------------------------- MOUSE

	var mouse = new THREE.Vector2();

	function onMouseMove(event) {

		event.preventDefault();
		mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

	} window.addEventListener('mousemove', onMouseMove, false);


	//------------------------------------------------------------- ANIMATING

	var uSpeed = 0.01;

	function animate() {

		var time = performance.now() * 0.0003;
		requestAnimationFrame(animate);
		
		for (var i = 0, l = particularGruop.children.length; i<l; i++) {

			var newObject = particularGruop.children[i];
			newObject.rotation.x += newObject.speedValue/10;
			newObject.rotation.y += newObject.speedValue/10;
			newObject.rotation.z += newObject.speedValue/10;

		};
		
		for (var i = 0, l = modularGruop.children.length; i<l; i++) {

			var newCubes = modularGruop.children[i];
			newCubes.rotation.x += 0.008;
			newCubes.rotation.y += 0.005;
			newCubes.rotation.z += 0.003;
			
			newCubes.position.x = Math.sin(time * newCubes.positionZ) * newCubes.positionY;
			newCubes.position.y = Math.cos(time * newCubes.positionX) * newCubes.positionZ;
			newCubes.position.z = Math.sin(time * newCubes.positionY) * newCubes.positionX;

		}
		
		particularGruop.rotation.y += 0.005;
		modularGruop.rotation.y -= ((mouse.x * 4) + modularGruop.rotation.y) * uSpeed;
		modularGruop.rotation.x -= ((-mouse.y * 4) + modularGruop.rotation.x) * uSpeed;
		camera.lookAt(scene.position);
		renderer.render( scene, camera );  

	}

	animate();
	init();

	$("#canvas-asteroids").css("opacity",option_hero_background_asteroids_scene_opacity);
	$("body").append('<div class="bg-color" style="background-color:' + option_hero_background_asteroids_bg_color + '"></div>');

}


