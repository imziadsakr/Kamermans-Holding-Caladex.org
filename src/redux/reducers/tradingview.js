

import ActionTypes from "../actions/actionTypes";

const INITIAL_STATE = {
    trading_view_data : []
}

export default (state = INITIAL_STATE, action={}) => {
    switch(action.type) {
        case ActionTypes.GetTradingViewData :
            return ({
                ...state,
                trading_view_data : action.payload
            })
        default :
            return state ;
    }
}