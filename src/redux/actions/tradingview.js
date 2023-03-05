


import axios from 'axios' ;
import { PRIVATE_CALADEX_API } from '../../static/constants';
import ActionTypes from './actionTypes' ;

export const GetTradingViewData = (token_id, pair_token) => async dispatch => {
    try {
        let res = await axios.post(`${PRIVATE_CALADEX_API}tradingview/get` , {
            token_id : token_id,
            pair_token : pair_token
        }) ;
        if(res.status === 200) {
            return dispatch({
                type : ActionTypes.GetTradingViewData,
                payload : res.data.data.data.information
            });
        }
    } catch(err) {
        console.log(err) ;
    }
}