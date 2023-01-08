import {EndUserProps as BeBndEUP} from 'be-bound/types';
import {EndUserProps as BeDefEUP} from 'be-definitive/types';
import {EndUserProps as BeHeadedEUP} from 'be-headed/types';
import {beCloned, beMounted, TemplMgmtProps, TemplMgmtActions, } from 'trans-render/lib/mixins/TemplMgmt.js';
import {EndUserProps} from './types';

export const make = {
    ":host": {
        be: 'definitive',
        having: {
            config:{
                propDefaults: {
                    value: false
                }
            }
        } as BeDefEUP<EndUserProps & TemplMgmtProps, TemplMgmtActions>
    },
    input: {
        be: 'bound',
        having: {
            propBindings: [
                ["checked", "value"]
            ]
        } as BeBndEUP
    },
    template: {
        be: 'headed',
        having: {
            id: "fonts.gooleapis.com-css-family-indie-flower"
        } as BeHeadedEUP
    }
};