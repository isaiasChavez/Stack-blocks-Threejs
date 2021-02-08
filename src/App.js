import {
	WebGLRenderer,
	sRGBEncoding,
	PerspectiveCamera,
	LoadingManager,

	PMREMGenerator,
	UnsignedByteType 
} from 'three'

import {RGBELoader} from './code/RGBLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Observer, { EVENTS } from './Observer'
// import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import * as TWEEN from '@tweenjs/tween.js/dist/tween.umd'
import Scene1 from './scenes/Scene1'

export class App {
	constructor (container) {
		this.container = container

		this.camera_pan_up = 30
		this.camera_y = 200

		// ## Camera's config
		this.camera = new PerspectiveCamera(
			35,
			this.container.clientWidth / this.container.clientHeight,
			0.1,
			10000
		)
		this.camera.position.set(-2000, 3000, 1000)
		this.camera.lookAt(1000, 3000, 0)

		// ## Renderer's config
		this.renderer = new WebGLRenderer({
			antialias: true
		})

		this.manager = new LoadingManager()

		this.manager.onStart = function (url, itemsLoaded, itemsTotal) {
			console.log('=============================================')
			console.log(
				'Started loading file: ' +
					url +
					'.\nLoaded ' +
					itemsLoaded +
					' of ' +
					itemsTotal +
					' files.'
			)
			console.log('=============================================')
		}

		this.scene = new Scene1(this.camera, this.renderer, this.manager)


		

		 // const pmremGenerator = new PMREMGenerator(this.renderer)
			// pmremGenerator.compileEquirectangularShader()

		// new RGBELoader().setDataType(UnsignedByteType)
		// .load('./assets/arte3d/HDRI/Env360.hdr', texture => {
		// 		const envMap = pmremGenerator.fromEquirectangular(texture).texture
		// 		this.scene.background = envMap;
		// 		this.scene.environment = envMap
		// 	})

		this.renderer.setPixelRatio(window.devicePixelRatio)
		this.renderer.gammaOutput = true
		//ORBIT_CONTROLS
		this.orbitControl = new OrbitControls(
			this.camera,
			this.renderer.domElement
		)
		this.orbitControl.maxPolarAngle = (Math.PI / 2) * 0.98
		// this.orbitControl.enableDamping = true
		// this.orbitControl.rotateSpeed = 0.8


		this.orbitControl.update()

		// sRGBEncoding
		this.renderer.outputEncoding = sRGBEncoding

		// ## Light's config
		this.renderer.physicallyCorrectLights = true

		this.container.appendChild(this.renderer.domElement)
		this.onResize()
		this.render()
		this.events()
	}
	events () {
		Observer.on(EVENTS.START, () => {
			const camera_zoom_in = new TWEEN.Tween(this.camera.position)
				.to({ x: 500, y: 500, z: 900 }, 8000)
				.easing(TWEEN.Easing.Sinusoidal.In)
				.onUpdate(() => {
					this.camera.updateProjectionMatrix()
				})
			camera_zoom_in.start()
		})
	}
	onResize () {
		this.renderer.setSize(
			this.container.clientWidth,
			this.container.clientHeight
		)
		this.camera.aspect =
			this.container.clientWidth / this.container.clientHeight
		this.camera.left = this.container.clientWidth / -2
		this.camera.right = this.container.clientWidth / 2
		this.camera.top = this.container.clientHeight / 2
		this.camera.bottom = this.container.clientHeight / -2

		this.camera.updateProjectionMatrix()
	}

	render () {
		this.renderer.render(this.scene, this.camera)

		// Updates here
		this.scene.update()
		this.orbitControl.update()

		this.renderer.setAnimationLoop(() => this.render())
	}
}
