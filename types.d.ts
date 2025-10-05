import {SimpleWCInfo} from './ts-refs/wc-info/SimpleWCInfo';

export interface EndUserProps{
    /**
     * The value of the checkbox, that gets submitted with the form.
     */
    value: boolean;
    /**
     * Name of the checkbox, that gets submitted with the form.
     */
    name: string;
}

export interface AP extends EndUserProps{}

export interface Actions {
    
}

export abstract class ScratchBoxInfo implements SimpleWCInfo {
    src: './root.mjs';
    tagName: 'scratch-box';
    props: EndUserProps;
    name: 'scratch-box'; 
    description: 'scratch-box is a web component wrapper around the ["CUSTOM ANIMATED CHECKBOXES" codepen](https://codepen.io/SaraSoueidan/pen/40433575e3d0d026c7d9c00eb45522a1?editors=1100) by Sara Soueidan';
    homepage: 'https://github.com/bahrus/scratch-box'; 
    license: 'MIT'; 

}

export type Package = [ScratchBoxInfo]

