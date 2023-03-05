


import ActionTypes from '../actions/actionTypes' ;

const INITIAL_STATE = {
    message : "IDLE" ,
    tokenInfoList : [] ,
    tokenLiquidityList : [] ,
    tokenBalanceInfo : [],
    tokenPairList: []
}

export default (state=INITIAL_STATE , action) => {
    switch(action.type){
        case ActionTypes.AddTokenSuccess :
            return ({
                ...state ,
                message : "SUCCESS"
            })
        case ActionTypes.AddTokenError :
            return ({
                ...state,
                message : "ERROR"
            })
        case ActionTypes.ConfirmAddToken : 
            return ({
                ...state ,
                message : "IDLE"
            })
        case ActionTypes.GetTokenInfoList :
            return ({
                ...state ,
                tokenInfoList : action.payload
            })
        case ActionTypes.GetTokenLiquidityList :
            return ({
                ...state ,
                tokenLiquidityList : action.payload
            })
        case ActionTypes.GetTokenBalanceInfo : 
            return ({
                ...state,
                tokenBalanceInfo : action.payload
            });
        case ActionTypes.GetTokenPairList :
            return ({
                ...state,
                tokenPairList : action.payload
            })
        default :
            return state ;
    }
}
