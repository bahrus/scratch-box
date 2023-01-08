import {EndUserProps as BeDefEUP} from 'be-definitive/types';
import {EndUserProps as BeHeadedEUP} from 'be-headed/types';
import {beCloned, beMounted, TemplMgmtProps, TemplMgmtActions, } from 'trans-render/lib/mixins/TemplMgmt.js';
import {EndUserProps} from './types';

export const make = {
    ":host": {
        be: 'definitive',
        having: {

        } as BeDefEUP<EndUserProps & TemplMgmtProps, TemplMgmtActions>
    },
    template: {
        be: 'headed',
        having: {
            id: "fonts.gooleapis.com-css-family-indie-flower"
        } as BeHeadedEUP
    }
};