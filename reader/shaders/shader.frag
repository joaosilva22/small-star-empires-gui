#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform float du;
uniform float dv;
uniform float su;
uniform float sv;
uniform vec4 c1;
uniform vec4 c2;
uniform vec4 cs;

void main() {
	if(vTextureCoord.x >= su*1.0/du && vTextureCoord.x <= (su+1.0)*1.0/du && vTextureCoord.y >= sv*1.0/dv && vTextureCoord.y <= (sv+1.0)*1.0/dv){
		gl_FragColor = texture2D(uSampler, vTextureCoord) * cs;
	}else if(mod(vTextureCoord.x,2.0/du) < 1.0/du){
		if(mod(vTextureCoord.y,2.0/dv) < 1.0/dv)
			gl_FragColor = texture2D(uSampler, vTextureCoord) * c1;
		else{
			gl_FragColor = texture2D(uSampler, vTextureCoord) * c2;
		}
	}else{
		if(mod(vTextureCoord.y,2.0/dv) < 1.0/dv){
			gl_FragColor = texture2D(uSampler, vTextureCoord) * c2;
		}else{
			gl_FragColor = texture2D(uSampler, vTextureCoord) * c1;
		}
	}
}


