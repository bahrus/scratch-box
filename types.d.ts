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

}

export type Package = [ScratchBoxInfo]

