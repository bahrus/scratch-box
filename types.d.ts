import {SimpleWCInfo} from 'may-it-be/SimpleWCInfo';

export interface EndUserProps{
    value: boolean;
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

