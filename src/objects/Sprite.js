import {
	NodeMaterialLoader,
	NodeMaterialLoaderUtils
} from 'three/examples/jsm/loaders/NodeMaterialLoader'

import {
	NodeFrame,
	SpriteNodeMaterial,
	MathNode,
	OperatorNode,
	TextureNode,
	Vector2Node,
	TimerNode,
	FunctionNode,
	PositionNode,
	UVNode
} from 'three/examples/jsm/nodes/Nodes'
import { Clock, TextureLoader, RepeatWrapping,Sprite} from 'three'

class SpriteImage {
	constructor (url, scene) {
		this.scene = scene
		this.spriteWidth = 20
		this.spriteHeight = 20
		this.clock = new Clock()
		this.frame = new NodeFrame()
		this.library = {}
		this.walkingManTextureURL = '../assets/textures/texture.png'
		this.init()
	}
	init () {
		// https://openclipart.org/detail/239883/walking-man-sprite-sheet

		this.walkingManTexture = new TextureLoader().load(
			this.walkingManTextureURL
		)
		this.walkingManTexture.wrapS = this.walkingManTexture.wrapT = RepeatWrapping

		this.library[this.walkingManTextureURL] = this.walkingManTexture

		// horizontal sprite-sheet animator

		function createHorizontalSpriteSheetNode (hCount, speed) {
			const speedNode = new Vector2Node(speed, 0) // frame per second
			const scale = new Vector2Node(1 / hCount, 1) // 8 horizontal images in sprite-sheet

			const uvTimer = new OperatorNode(
				new TimerNode(),
				speedNode,
				OperatorNode.MUL
			)

			const uvIntegerTimer = new MathNode(uvTimer, MathNode.FLOOR)

			const uvFrameOffset = new OperatorNode(
				uvIntegerTimer,
				scale,
				OperatorNode.MUL
			)

			const uvScale = new OperatorNode(
				new UVNode(),
				scale,
				OperatorNode.MUL
			)

			const uvFrame = new OperatorNode(
				uvScale,
				uvFrameOffset,
				OperatorNode.ADD
			)

			return uvFrame
		}

		// sprites

		this.sprite2 = new Sprite(new SpriteNodeMaterial())

		
		this.sprite2.position.x = 30
		this.sprite2.scale.x = this.spriteWidth
		this.sprite2.scale.y = this.spriteHeight
		this.sprite2.material.color = new TextureNode(this.walkingManTexture)
		this.sprite2.material.color.uv = createHorizontalSpriteSheetNode(8, 30)
		this.sprite2.material.color = new MathNode(
			this.sprite2.material.color,
			MathNode.INVERT
		)
		
		this.sprite2.material.spherical = false // look at camera horizontally only, very used in vegetation
		// horizontal zigzag sprite
		this.sprite2.material.position = new OperatorNode(
			new OperatorNode(
				new MathNode(new TimerNode(3), MathNode.SIN), // 3 is speed (time scale)
				new Vector2Node(0.3, 0), // horizontal scale (position)
				OperatorNode.MUL
			),
			new PositionNode(),
			OperatorNode.ADD
		)

		this.spriteToJSON(this.sprite2)
	}

	spriteToJSON (sprite) {
		// serialize

		const json = sprite.material.toJSON()

		// replace uuid to url (facilitates the load of textures using url otherside uuid)

		NodeMaterialLoaderUtils.replaceUUID(
			json,
			this.walkingManTexture,
			this.walkingManTextureURL
		)

		// deserialize

		const material = new NodeMaterialLoader(null, this.library).parse(json)

		// replace material

		sprite.material.dispose()

		sprite.material = material
	}
	animate () {
		const delta = this.clock.getDelta()

		// update material animation and/or gpu calcs (pre-renderer)
		this.frame.update(delta).updateNode(this.sprite2.material)

		// rotate sprite
	}
}

export default SpriteImage
