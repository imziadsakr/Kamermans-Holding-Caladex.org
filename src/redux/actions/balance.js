


import axios from 'axios' ;
import { PRIVATE_CALADEX_API } from '../../static/constants';
import ActionTypes from './actionTypes' ;

export const SetTokenBalance = (account , token_id , is_deposit , amount) => async dispatch => {

    try {
        let res = await axios.post(`${PRIVATE_CALADEX_API}balance/set` , {
            address : account ,
            token_id : token_id ,
            is_deposit : is_deposit ,
            amount : amount
        }) ;


        return ;
    }
    catch(err) {
        console.log(err) ;
    }
}

export const ApproveToken = async (account, amount , address , symbol ) => {
    try {

        let reqBody = {
            account : account,
            amount : amount ,
            symbol : symbol
        };

        if(address !== null) {
            reqBody = {
                ...reqBody ,
                address : address ,
            }
        }

        // console.log(reqBody) ;

        let res = await axios.post(`${PRIVATE_CALADEX_API}balance/withdraw` , reqBody) ;

        if(res.status === 201) {
            return "Error"
        } 

        return "Ok"
    } 
    catch(err) {
        console.log(err) ;
        return "Error" 
    }
}

export const GetTokenBalance = (account, symbol, token_type) => async dispatch => {
    try {
        let res = await axios.post(`${PRIVATE_CALADEX_API}balance/token` , {
            account : account,
            symbol : symbol
        }) ;
        if(res.status === 200) {
            if(token_type === 'token') {
                return dispatch({
                    type : ActionTypes.TokenBalance,
                    payload : res.data.data.doc ? res.data.data.doc.caladex_balance : 0
                })
            } else if (token_type === 'pair') {
                return dispatch({
                    type : ActionTypes.PairBalance ,
                    payload : res.data.data.doc ? res.data.data.doc.caladex_balance : 0
                })
            }
            
        }
    } catch(err) {
        console.log(err) ;
    }
}