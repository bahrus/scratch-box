//@ts-check

import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import {akaMethods, aka, builtInEmoji} from 'assign-gingerly/DX/emojis.js';

/** @import {FontFaceFeatureConfig} from './types/font-face-feature/types'; */
/** @import {EndUserProps} from './types'; */
/** @import {RoundaboutOptions} from './types/roundabout/types' */
/** @import {ElMakerConfig} from './types/el-maker/types' */

/**
 * @type {{ [K in keyof EndUserProps]: K }}
 */
const props = {
    value: 'value',
    name: 'name',
    disabled: 'disabled',
};

/**
 * @type {FontFaceFeatureConfig}
 */
const fontFaceFeatureConfig = {
    fontFamilies: [
        //latin-ext
        {
            name: 'Indie Flower',
            url: 'https://fonts.gstatic.com/s/indieflower/v24/m8JVjfNVeKWVnh3QMuKkFcZVZ0uH5dI.woff2',
            descriptors: {
                style: 'normal',
                weight: '400',
                unicodeRange: 'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF',
                //format: 'woff2',
            },
        },
        //latin
        {
            name: 'Indie Flower',
            url: 'https://fonts.gstatic.com/s/indieflower/v24/m8JVjfNVeKWVnh3QMuKkFcZVaUuH.woff2',
            descriptors: {
                style: 'normal',
                weight: '400',
                unicodeRange: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD'

            }
        }
    ],
};

/**
 * @type {RoundaboutOptions<EndUserProps, EndUserProps, EndUserProps>}
 */
const raConfig = {
    assignOptions: {
        akaMethods,
        withMethods: ['appendChild'],
        aka: {
            ...aka,
            '🔎': 'clone?.querySelector'
        },
    },
    merges: [
        {
            ifKeyIn: ['disabled'],
            assign: {
                '?.shadowRoot?.🔍?.input?.disabled': '?.disabled',
            }
        },
    ],
}

/** @type {ElMakerConfig<EndUserProps>} */
const features = {
    assignFeatures: {
        faceUp: {
            customData: {
                integrateWithRoundabout: true,
            }
        },
        truthSourcer: {},
        roundabout: {
            customData: {
                raConfig
            },
        },
        fontMgr: {
            customData: {
                fontFaceFeatureConfig
            }
        },
        templateMaker: {},

    },


}

export function render() {
    return JSON.stringify(features, null, 4);
}

const __filename = fileURLToPath(import.meta.url);
const outputFile = __filename.replace(/\.mjs$/, '.json');
writeFileSync(outputFile, render(), 'utf8');