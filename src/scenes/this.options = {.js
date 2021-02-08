	this.options = {
			material: {
				color: 0xec431f,
				metalness: 0.1,
				roughness: 0.1,
				emissive: 0.1,
				emissiveIntensity: 0.1,
				clearcoat: 0.1,
				clearCoatRoughness: 0.1,
				reflectivity: 0.1,
				aoMapintensity: 0.1
			}
		}
		this.gui = new dat.GUI()
		console.log('GUIDE:', this.gui)

		const material = this.gui.addFolder('material')
		material
			.addColor(this.options.material, 'color')
	.onChange( value => changeColor( value ) )
			
		material
			.add(this.options.material, 'metalness', 0.1, 1)
			.onChange(value => changeMetalness(value))
		material.add(this.options.material, 'roughness', 0.1, 1).listen()
		material.add(this.options.material, 'emissive', 0.1, 1).listen()
		material.add(this.options.material, 'emissiveIntensity', 0.1, 1).listen()
		material.add(this.options.material, 'emissiveIntensity', 0.1, 1).listen()
		material.add(this.options.material, 'clearcoat', 0.1, 1).listen()
		material.add(this.options.material, 'clearCoatRoughness', 0.1, 1).listen()
		material.add(this.options.material, 'reflectivity', 0.1, 1).listen()
		material.add(this.options.material, 'aoMapintensity', 0.1, 1).listen()
		material.open()

		//Control Functions
		const changeColor = color => {
			this.material.color.set(color)
		}
		const changeMetalness = value => {
			console.log( this.material )
			












			// Setting the scene

var scene = new THREE.Scene();

// Camera Object

var camera = new THREE.PerspectiveCamera(4, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 75;
camera.position.x = 50;
camera.position.y = 50;
camera.lookAt(scene.position);
camera.updateMatrixWorld();

// Render Object


var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Making the cube

var geometry = new THREE.BoxGeometry(5, 5, 5, 5, 5, 5);
var material = new THREE.MeshDepthMaterial({
  opacity: 0.1,
  blending: THREE.NormalBlending, 
  depthTest: true,

});



var cube = new THREE.Mesh(geometry, material);

scene.add(cube);



// Options to be added to the GUI

var options = {
  velx: 0,
  vely: 0,
  camera: {
    speed: 0.0001
  },
  stop: function() {
    this.velx = 0;
    this.vely = 0;
  },
  reset: function() {
    this.velx = 0.1;
    this.vely = 0.1;
    camera.position.z = 75;
    camera.position.x = 0;
    camera.position.y = 0;
    cube.scale.x = 1;
    cube.scale.y = 1;
    cube.scale.z = 1;
    cube.material.wireframe = true;
  }
};

// DAT.GUI Related Stuff

var gui = new dat.GUI();

var cam = gui.addFolder('Camera');
cam.add(options.camera, 'speed', 0, 0.0010).listen();
cam.add(camera.position, 'y', 0, 100).listen();
cam.open();

var velocity = gui.addFolder('Velocity');
velocity.add(options, 'velx', -0.2, 0.2).name('X').listen();
velocity.add(options, 'vely', -0.2, 0.2).name('Y').listen();
velocity.open();

var box = gui.addFolder('Cube');
box.add(cube.scale, 'x', 0, 3).name('Width').listen();
box.add(cube.scale, 'y', 0, 3).name('Height').listen();
box.add(cube.scale, 'z', 0, 3).name('Length').listen();
box.add(cube.material, 'wireframe').listen();
box.open();

gui.add(options, 'stop');
gui.add(options, 'reset');

// Rendering the animation   

var render = function() {

  requestAnimationFrame(render);

  var timer = Date.now() * options.camera.speed;
  camera.position.x = Math.cos(timer) * 100;
  camera.position.z = Math.sin(timer) * 100;
  camera.lookAt(scene.position); 
  camera.updateMatrixWorld();

  cube.rotation.x += options.velx;
  cube.rotation.y += options.vely;

  renderer.render(scene, camera);

};
render();
		}