#version 120

uniform float uTime;       // Animation time
uniform float uAmp;        // Amplitude of the sine wave
uniform float uFreq;       // Frequency of the sine wave
uniform float uSpeed;      // Speed of the sine wave

varying vec2 vST;          // Texture coordinates
varying vec3 vN;           // Normal vector
varying vec3 vL;           // Vector from point to light
varying vec3 vE;           // Vector from point to eye


const vec3 LIGHTPOS = vec3(10.0, 10.0, 5.0); // Light position
const float PI = 3.14159265;
const float TWOPI = 2.0 * PI;
const float LENGTH = 5.0;                    // Salmon length

void main() {
    vST = gl_MultiTexCoord0.st;              // Pass texture coordinates

    vec3 vert = gl_Vertex.xyz;

    // Apply sine wave to the x-coordinate for left-right swing
    vert.x += uAmp * sin(TWOPI * ((uSpeed * uTime) + (uFreq * vert.z / LENGTH)));


    // Transform vertex position into eye coordinates
    vec4 ECposition = gl_ModelViewMatrix * vec4(vert, 1.0);

    // Pass vectors for lighting calculations
    vN = normalize(gl_NormalMatrix * gl_Normal);  // Normal vector
    vL = LIGHTPOS - ECposition.xyz;              // Light vector
    vE = vec3(0.0, 0.0, 0.0) - ECposition.xyz;   // Eye vector

    // Compute final position of the vertex
    gl_Position = gl_ModelViewProjectionMatrix * vec4(vert, 1.0);
}
