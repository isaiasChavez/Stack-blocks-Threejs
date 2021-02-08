import { BoxBufferGeometry, Mesh, MeshStandardMaterial } from 'three'
import * as dat from 'dat.gui'
class BoxCreator extends Mesh {
	constructor ({ width, height, alt = 40, color }) {
		super()
		this.geometry = new BoxBufferGeometry(width, alt, height)
		this.material = new MeshStandardMaterial({
			color,
			flatShading: true,
			roughness: 0.15
		})
		this.material.color.convertLinearToSRGB()

		//VARIABLES PROPIAS
		this.color = color
		this.dimension = { width, height }
	}
}

export default BoxCreator
