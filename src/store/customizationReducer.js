// project imports
import config from 'config';

// action - state management
import * as actionTypes from './actions';

// Matches MainLayout's theme.breakpoints.down('lg') (MUI default lg=1200, not
// customized in themes/index.js). Starting "opened" at the value it's about to
// be corrected to anyway avoids a forced open->close cycle on the very first
// mobile render — that immediate, pre-interaction close was leaving the
// Drawer's modal wrapper stuck mid-exit-transition: invisible, still
// full-screen, still pointer-events:auto, silently eating every tap on the
// page underneath it until the user's first manual toggle (see MainLayout
// and Sidebar for the matching noSsr fix on the same underlying mount race).
const startsOpen = typeof window === 'undefined' || window.innerWidth >= 1200;

export const initialState = {
    isOpen: [], // for active default menu
    fontFamily: config.fontFamily,
    borderRadius: config.borderRadius,
    opened: startsOpen
};

// ==============================|| CUSTOMIZATION REDUCER ||============================== //

const customizationReducer = (state = initialState, action) => {
    let id;
    switch (action.type) {
        case actionTypes.MENU_OPEN:
            id = action.id;
            return {
                ...state,
                isOpen: [id]
            };
        case actionTypes.SET_MENU:
            return {
                ...state,
                opened: action.opened
            };
        case actionTypes.SET_FONT_FAMILY:
            return {
                ...state,
                fontFamily: action.fontFamily
            };
        case actionTypes.SET_BORDER_RADIUS:
            return {
                ...state,
                borderRadius: action.borderRadius
            };
        default:
            return state;
    }
};

export default customizationReducer;
