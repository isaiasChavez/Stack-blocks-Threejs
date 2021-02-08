import {PlaneGeometry,MeshStandardMaterial,Mesh,MathUtils,FogExp2} from 'three'
// import * as dat from 'dat.gui'
class FloorCreator extends Mesh {
	constructor ({ width, height, color }) {
		super()
		this.geometry = new PlaneGeometry( width, height, 1, 1 );
		this.material = new MeshStandardMaterial({
			color: 0x000000,
			flatShading: true,
			roughness: 0.15
		})
  this.material.color.convertLinearToSRGB()
		this.rotation.x = MathUtils.degToRad(-90) 
		this.position.y = -500 

		//VARIABLES PROPIAS
		this.color = color
		this.dimension = { width, height }
	}
	update () {
		console.log("object");
	}
}

export default FloorCreator
