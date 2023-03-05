

import ActionTypes from "../actions/actionTypes";

const INITIAL_STATE = {
    token_balance : 0,
    pair_balance : 0
}

export default (state = INITIAL_STATE, action={}) => {
    switch(action.type) {
        case ActionTypes.TokenBalance :
            return ({
                ...state,
                token_balance : action.payload
            })
        case ActionTypes.PairBalance : 
            return ({
                ...state,
                pair_balance : action.payload
            })
        default :
            return state ;
    }
}