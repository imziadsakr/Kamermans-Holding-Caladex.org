



import ActionTypes from '../actions/actionTypes' ;

const INITIAL_STATE = {
    isConnected : false ,
    address : '' ,
    balance : 0 ,
    web3Provider : null,
    walletAddress : null
}

export default (state=INITIAL_STATE , action={}) => {

    switch(action.type) {
        case ActionTypes.WalletConnectEvent :
            return ({
                ...state , 
                walletAddress : action.payload.walletAddress ,
                web3Provider : action.payload.web3Provider
            })
        default :
            return state ; 
    }
}