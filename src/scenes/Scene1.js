import {
	Scene,
	Color,
	DirectionalLight,
	HemisphereLight,
	SpotLight,
	SpotLightHelper,
	Group,
	Fog,
	AxesHelper,
	CubeTextureLoader,
	AnimationMixer,
	CubeCamera,
	TextureLoader,
	SpriteMaterial,
	Sprite,
	Raycaster,
	Clock,
	AudioListener,
	Audio,
	AudioLoader,
	VideoTexture,
	PlaneBufferGeometry,
	Mesh,
	MeshBasicMaterial
} from 'three'
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

import SpriteImage from '../objects/Sprite'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as dat from 'dat.gui'

import * as TWEEN from '@tweenjs/tween.js/dist/tween.umd'
import PlaneCreator from '../objects/Floor'
import Observer, { EVENTS } from '../Observer'
import UserInterface from '../objects/UserInterface'

class Scene1 extends Scene {
	constructor (camera, renderer,manager) {
		super()
		this.manager = manager
		console.log("Manager:",manager);
		this.isUpdating = true
		this.isLoading = true
		this.camera = camera
		this.renderer = renderer
		this.gameOver = false
		this.events()
		this.skyBox()
		this.create()
		this.raycaster = new Raycaster()
		this.bottleHeight = 500
		this.selectedObject = []
		console.log('this.children', this.children)

		
		this.assets = {
			floor: false,
			bottle: false
		}

		this.mouseData = {
			x: 0,
			y: 0
		}
		this.fog = new Fog( 0x000000, 1000, 5000 )

		//helpers
		this.clock = new Clock()
		// const axesHelper = new AxesHelper(100000)
		// this.add(axesHelper)
	}
	skyBox () {
		const urls = [
			'src/assets/arte3d/Skybox/px.jpg',
			'src/assets/arte3d/Skybox/nx.jpg',
			'src/assets/arte3d/Skybox/py.jpg',
			'src/assets/arte3d/Skybox/ny.jpg',
			'src/assets/arte3d/Skybox/pz.jpg',
			'src/assets/arte3d/Skybox/nz.jpg'
		]
		let loader = new CubeTextureLoader()
		this.background = loader.load(urls)
		// this.environment = loader.load(urls)
	}

	create () {
		// const pisoFalso = new PlaneCreator( { height: 1000000, width: 1000000 } )
		// this.add( pisoFalso )
		this.userInterface = new UserInterface()
		//Video
		this.video = document.getElementById('video')

		const texture = new VideoTexture(video)
		const geometryVideo = new PlaneBufferGeometry(16, 9)
		geometryVideo.scale(0.5, 0.5, 0.5)
		const materialVideo = new MeshBasicMaterial({ map: texture })
		this.videoFrame = new Mesh(geometryVideo, materialVideo)
		console.log('this.videoFrame', this.videoFrame, texture)
		// this.videoFrame.lookAt( this.camera.position );
		// this.videoFrame.scale.set( 100, 100, 100 )
		this.videoFrame.position.set(0, 500, -500)
		this.add(this.videoFrame)

		//Sounding
		this.listener = new AudioListener()
		this.add(this.listener)

		// create a global audio source
		this.sound = new Audio(this.listener)

		// load a sound and set it as the Audio object's buffer
		this.audioLoader = new AudioLoader(this.manager)
		this.audioLoader.load('src/assets/Audio/openbottle.wav', buffer => {
			this.sound.setBuffer(buffer)
			this.sound.setLoop(false)
			this.sound.setVolume(0.5)
		})

		//Sprites
		const map = new TextureLoader(this.manager).load(
			'src/assets/assets2d/UI/destapar.png'
		)
		const material = new SpriteMaterial({ map: map })
		this.spriteInstruction = new Sprite(material)
		this.spriteInstruction.scale.set(300, 100, 100)
		this.spriteInstruction.position.set(300, 300, 0)
		this.spriteInstruction.visible = false
		this.add(this.spriteInstruction)
		console.log('sprite:', this.spriteInstruction)

		const mapRow = new TextureLoader().load(
			'src/assets/assets2d/UI/Flecha.png'
		)
		const materialRow = new SpriteMaterial({ map: mapRow })
		this.spriteRow = new Sprite(materialRow)
		this.spriteRow.scale.set(50, 50, 50)
		this.spriteRow.position.set(0, 300, 0)
		this.spriteRow.visible = false

		this.add(this.spriteRow)

		this.loader = new GLTFLoader()
		this.dracoLoader = new DRACOLoader();
		this.dracoLoader.setDecoderPath("../gltf/");

	this.loader.setDRACOLoader( this.dracoLoader );

		this.loader.load(
			'src/assets/arte3d/botella/scene.gltf',
			gltf => {
				this.mixer = new AnimationMixer(gltf.scene)
				this.animationBottle = this.mixer.clipAction(gltf.animations[0])
				this.animationBottle.repetitions = 1
				this.animationBottle.clampWhenFinished = true
				gltf.scene.position.set(150, 0, 0)
				gltf.scene.scale.set(500, this.bottleHeight, 500)
				this.bottle = gltf
				console.log('this.bottle', this.bottle)
				this.add(gltf.scene)
				this.assets.bottle = true

				this.liquidoBotella = gltf.scene.getObjectByName(
					'Beer_Liquid',
					true
				)
				this.liquidoBotella2 = gltf.scene.getObjectByName(
					'Liquid_Beer_Liquid_0',
					true
				)
				console.log("this.liquidoBotella2: ",this.liquidoBotella,this.liquidoBotella2);

				this.botellaCristal = gltf.scene.getObjectByName(
					'Bottle_Beer_Bottle_0',
					true
				)
				this.destapadorMadera = gltf.scene.getObjectByName(
					'BottleOpener002_W_BottleOpener_wood_0',
					true
				)
				this.destapadorMetal = gltf.scene.getObjectByName(
					'BottleOpener001_W_BottleOpener_0',
					true
				)
				this.corcholata = gltf.scene.getObjectByName('0', true)
				this.destapadorMadera.visible = false
				this.destapadorMetal.visible = false

				this.etiqueta = gltf.scene.getObjectByName(
					'Label_Beer_Label_0',
					true
				)
				console.log('this.etiqueta: ', this.etiqueta)
				console.log('liquidoBotella: ', this.liquidoBotella)
				this.addSelectedObject(this.liquidoBotella)
				this.addSelectedObject(this.destapador)
				this.addSelectedObject(this.etiqueta)
				this.addSelectedObject(this.botellaCristal)
				console.log('this.selectedObject:', this.selectedObject)

				this.camaraBotella = new CubeCamera(1, 1000, 5000)
				this.camaraBotella.position.set(150, 2000, 0)
				this.add(this.camaraBotella)
				console.log( 'SDFASDF', this.botellaCristal )
				// this.botellaCristal.material.depthWrite = true
				this.liquidoBotella2.material.depthWrite = true
				this.botellaCristal.material.envMap = this.camaraBotella.renderTarget
				this.botellaCristal.material.metalness = 1
				console.log("Botela ",this.botellaCristal);

				Observer.emit(EVENTS.START)
			},
			undefined,
			function (error) {
				console.error(error, 'Errorddd')
			}
		)
		this.loader.load(
			'src/assets/arte3d/Piso/scene.gltf',
			gltf => {
				gltf.scene.position.set(8, -10, 0)
				gltf.scene.scale.set(300, 300, 300)
				this.floor = gltf
				console.log('this.floor', this.floor)
				this.add(this.floor.scene)
				this.assets.floor = true
			},
			undefined,
			function (error) {
				console.error(error, 'Errorddd')
			}
		)

		//Evento

		//luces
		this.ambientLight = new HemisphereLight(0xffffbb, 0x080820, 1)
		this.add(this.ambientLight)


		const options = {
			camara: {
				color: 0xec431f,
				intensity: 0.1,
			}
		}

		const gui = new dat.GUI()

		const materialFolder = gui.addFolder('material')
		materialFolder
			.addColor(options.camara, 'color')
			.onChange( value => changeColor( value ) )
		
				materialFolder
			.add(options.camara, 'intensity', 0.1, 30)
			.onChange(value => changeIntensity(value))

		const changeColor = color => {
			this.ambientLight.color.set(color)
		}
		const changeIntensity = intensity => {
			this.ambientLight.intensity = intensity
		}


		this.directionallight = new DirectionalLight(0xffd56b, 1)
		
		this.spotLight = new SpotLight(0xffffff, 50)
		this.spotLight.position.set(0, 1300, -10)

		this.add(this.directionallight,this.spotLight)

		// // spotLight.castShadow = true;

	}
	addSelectedObject (object) {
		this.selectedObject.push(object)
	}
	events () {
		Observer.on(EVENTS.START, () => {
			const tween_bottle = new TWEEN.Tween(this.bottle.scene.scale)
				.to(
					{
						x: 1000,
						y: 1000,
						z: 1000
					},
					5000
				)
				.easing(TWEEN.Easing.Quadratic.Out)
				.onComplete(() => {
					this.spriteInstruction.visible = true
					this.spriteRow.visible = true
					this.isUpdating = false
				})
			const tween_bottle_position = new TWEEN.Tween(
				this.bottle.scene.position
			)
				.to(
					{
						x: 80,
						y: 0,
						z: 0
					},
					5000
				)
				.easing(TWEEN.Easing.Quadratic.Out)
			setTimeout(() => {
				tween_bottle.start()
				tween_bottle_position.start()
				// tween_directionalLight.start()
			}, 1000)
		})
		Observer.on(EVENTS.MOUSE_MOVE, event => {
			this.mouseData.x = (event.clientX / window.innerWidth) * 2 - 1
			this.mouseData.y = -(event.clientY / window.innerHeight) * 2 + 1
		})
		Observer.on(EVENTS.CHANGE_COLOR, event => {

			this.liquidoBotella2.material.metalness = 1
			const tween_label_color = new TWEEN.Tween(
				this.liquidoBotella2.material.color
			)
				.to(
					{
						b: 100,
						g: 100,
						r: 100
					},
					1000
				)
				.easing(TWEEN.Easing.Quadratic.Out)
			tween_label_color.start()
		})
		Observer.on(EVENTS.REVERSE_COLOR, event => {
			const tween_label_color = new TWEEN.Tween(
				this.etiqueta.material.color
			)
				.to(
					{
						b: 1,
						g: 1,
						r: 1
					},
					1000
				)
				.easing(TWEEN.Easing.Quadratic.Out)
			tween_label_color.start()
		})
		//TWEEN VIDEO
		Observer.on(EVENTS.SHOW_VIDEO, event => {
			const tween_video_size = new TWEEN.Tween(this.videoFrame.scale)
				.to(
					{
						x: 100,
						y: 100,
						z: 100
					},
					1000
				)
				.easing(TWEEN.Easing.Quadratic.Out)
			tween_video_size.start()
		})
		Observer.on(EVENTS.HIDE_VIDEO, event => {
			const tween_video_size = new TWEEN.Tween(this.videoFrame.scale)
				.to(
					{
						x: 0,
						y: 0,
						z: 0
					},
					1000
				)
				.easing(TWEEN.Easing.Quadratic.Out)
			tween_video_size.start()
		})
		Observer.on(EVENTS.CLICK, () => {
			// if (this.gameOver) {
			// 	return
			// }
			this.gameOver = true

			this.raycaster.setFromCamera(this.mouseData, this.camera)
			const intersects = this.raycaster.intersectObjects(
				this.children,
				true
			)
			const nameIntersect = intersects[0].object.name
			console.log('nameIntersect:', nameIntersect)
			if (intersects.length > 0) {
				if (
					nameIntersect === '0'
				) {
					this.destapadorMadera.visible = true
					this.destapadorMetal.visible = true
					this.animationBottle.play()
					Observer.emit(EVENTS.UNCAP_BOTTLE)

					setTimeout(() => {
						console.log('this.sound: ', this.sound)
						this.sound.play()
					}, 1680)
					setTimeout(() => {
						this.destapadorMadera.visible = false
						this.destapadorMetal.visible = false
						this.corcholata.visible = false
					}, 4500)
				}
			}
		})

		Observer.on(EVENTS.UNCAP_BOTTLE, () => {
			this.spriteRow.visible = false
			this.spriteInstruction.visible = false
		})
	}

	onMouseMove (event) {
		event.preventDefault()
		this.mouseData.x = (event.clientX / window.innerWidth) * 2 - 1
		this.mouseData.y = -(event.clientY / window.innerHeight) * 2 + 1
	}

	update () {
		this.camaraBotella.updateCubeMap(this.renderer, this.camera)
		
		if (this.isUpdating) {
			this.directionallight.intensity += 0.04
		}
		// this.firework.animate()
		for (const key in this.assets) {
			const element = this.assets[key]
			if (!element) return
			this.isLoading = false
		}
		if (!this.isLoading) {
			Observer.emit(EVENTS.LOADED)
		}
		TWEEN.update()

		// this.PlanoTexto.update()
		if (!this.game_over) {
		}
		const delta = this.clock.getDelta()
		if (this.mixer) {
			this.mixer.update(delta)
		}
	}
}

export default Scene1
