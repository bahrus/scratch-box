import { define } from "trans-render/define.js";
import { createTemplate } from "xtal-element/utils.js";
const mainTemplate = createTemplate(/* html */ `
<style>
    :host{
        display:block;
        background-color: HSL(250, 22%, 41%);
        padding: 1vw;
    }
    .checkbox-wrapper {
  position: relative;
  
  margin: .5em 1em;
  font-size: 3em;
  color: #eee;
  font-family: Indie Flower;
}

svg { 
  width: 1em;
  height: 1em;
  position: absolute;
  left: 0.5em; 
  top: .3em;
  border: 2px solid #eee;
}

label {
  display: block;
  padding: .25em .5em .25em 2em;
  position: relative;
  cursor: pointer;
  
}

input[type="checkbox"] {
  opacity: 0;
  position: absolute;
  left: .75em;
  top: .75em;
}

label svg path {
  transition: stroke-dashoffset .4s linear;
}

input[type="checkbox"]:checked ~ label svg {
  border-color: #111;
}

input[type="checkbox"]:checked ~ label svg path {
  stroke-dashoffset: 0;
  stroke: currentColor;
}

input[type="checkbox"] ~ label svg path {
  stroke: #eee;
}

input[type="checkbox"]:checked ~ label {
  color: #111;
  text-decoration: line-through;
}

input[type="checkbox"]:focus ~ label {
  outline: 2px solid black;
}

</style>
<div class="checkbox-wrapper">
  <!--  length of the path is 270px -->
  <input type="checkbox" id="option"/>
  <label for="option"><slot name="labelTxt"></slot>
  <svg viewBox="0 0 60 40" aria-hidden="true" focusable="false"><path d="M21,2 C13.4580219,4.16027394 1.62349378,18.3117469 3,19 C9.03653312,22.0182666 25.2482171,10.3758914 30,8 C32.9363621,6.53181896 41.321398,1.67860195 39,4 C36.1186011,6.8813989 3.11316157,27.1131616 5,29 C10.3223659,34.3223659 30.6434647,19.7426141 35,18 C41.2281047,15.5087581 46.3445303,13.6554697 46,14 C42.8258073,17.1741927 36.9154967,19.650702 33,22 C30.3136243,23.6118254 17,31.162498 17,34 C17,40.4724865 54,12.4064021 54,17 C54,23.7416728 34,27.2286213 34,37" stroke-width="4" fill="none" stroke-dasharray="270" stroke-dashoffset="270" ></path></svg>
  </label>
</div>
`);
export class ScratchBox extends HTMLElement {
    static get is() {
        return "scratch-box";
    }
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.appendChild(mainTemplate.content.cloneNode(true));
    }
}
define(ScratchBox);
