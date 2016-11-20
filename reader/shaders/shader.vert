attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;

uniform float du;
uniform float dv;
uniform float su;
uniform float sv;


void main() {
	
	if(aTextureCoord.x >= su*1.0/du && aTextureCoord.x <= (su+1.0)*1.0/du && aTextureCoord.y >= sv*1.0/dv && aTextureCoord.y <= (sv+1.0)*1.0/dv){
		gl_Position = uPMatrix * uMVMatrix * vec4( aVertexPosition + aVertexNormal*0.025, 1.0);
	}else{
		gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
	}

	vTextureCoord = aTextureCoord;
}

