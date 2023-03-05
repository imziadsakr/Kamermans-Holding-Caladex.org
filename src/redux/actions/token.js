
import axios from 'axios' ;
import ActionTypes from './actionTypes';
import * as config from "../../static/constants" ;
import { convertBalance, json2array } from '../../utils/helper';

// import Web3 from 'web3' ;
// import { getAddressBalances } from "eth-balance-checker/lib/web3";

import { getTokensBalance } from '@mycrypto/eth-scan';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider' ;

// Get a Web3 provider from somewhere
// const web3 = new Web3;

// const web3 = new Web3('https://ropsten.infura.io/v3/f957dcc0cb6c430f9d32c2c085762bdf') ;
const web3 = new Web3('https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161') ;


export const AddToken = (fn) => async dispatch => {
    try {
        // let fn = new FormData() ;

        const res = await axios.post(`${config.PRIVATE_CALADEX_API}token/add` , fn) ;

        if(res.data.status === "success") {
            dispatch({
                type : ActionTypes.AddTokenSuccess ,
                payload : "SUCCESS"
            })
        } else {
            dispatch({
                type : ActionTypes.AddTokenError ,
                payload : "ERROR"
            })
        }
    }
    catch (err) {
        dispatch({
            type : ActionTypes.AddTokenError ,
            payload : "ERROR"
        })
    }
}


export const ConfirmAddToken = (confirmMessage) => async dispatch => {
    dispatch({
        type : ActionTypes.ConfirmAddToken ,
        payload : confirmMessage
    })
}

export const GetTokenInfoList = (status = "" , pair_type="" , token_symbol = "" ) => async dispatch => {
    
    if(status === "") {
        dispatch({
            type : ActionTypes.GetTokenInfoList ,
            payload : []
        }) ;

        return ;
    }

    try {
        
        let jsonBody ;
        if(pair_type === "") {
            jsonBody = {
                status : status ,
                search_str : token_symbol
            }
        } else {
            jsonBody = {
                status : status ,
                pair_type : pair_type ,
                search_str : token_symbol
            }
        }
        let res = await axios.post(`${config.PRIVATE_CALADEX_API}token/get` , jsonBody) ;

        if(res.data.data.data.length === 0 ){
            return dispatch({
                type : ActionTypes.GetTokenInfoList ,
                payload : ['No Avaliable Informations.']
            });
        }

        let tokenInfoList = [] ;

        for(let element of res.data.data.data) {
            if(element.symbol === 'ETH' || element.symbol === 'DAI')
                continue;
            let pair_type_array = element.pair_type.split(",") ;
            for(let pair of pair_type_array) {
                switch(pair_type) {
                    case "ETH" : 
                        if(pair === "ETH") {
                            await tokenInfoList.push({
                                ...element ,
                                pair_type : pair
                            })
                        }
                        break ;
                    case "DAI" :
                        if(pair === "DAI") {
                            await tokenInfoList.push({
                                ...element ,
                                pair_type : pair
                            })
                        }
                        break ;
                    default :
                        await tokenInfoList.push({
                            ...element ,
                            pair_type : pair
                        })
                        break ;
                }
            }
        }

        let resTether = await axios.get(`https://api.coingecko.com/api/v3/coins/tether/tickers`) ;

        let resEther = await axios.get(`https://api.coingecko.com/api/v3/coins/ethereum/tickers`) ;
        let resDai = await axios.get(`https://api.coingecko.com/api/v3/coins/dai/tickers`) ;

        let tokenTickerList = [] ;

        for (let element of tokenInfoList ){
            let resToken = await axios.post(`${config.PRIVATE_CALADEX_API}tokenInfo/getOne`,{
                token_id : element._id ,
                pair_token : element.pair_type
            }) ;

            if(resToken.data.data.data[0].market_buy_price === 0 || resToken.data.data.data[0].market_sell_price === 0) {
              let filter = resTether.data.tickers.filter(list => list.base === element.symbol && list.target === element.pair_type ) ;

              if(filter.length === 0) {
                filter = resEther.data.tickers.filter(list => list.base === element.symbol && list.target === element.pair_type ) ;
              }
              if(filter.length === 0) {
                filter = resDai.data.tickers.filter(list => list.base === element.symbol && list.target === element.pair_type ) ;
              }
              
              if(filter.length === 0) {
                  console.log(element) ;
                tokenTickerList.push({
                  ...element,
                  market_buy_price : resToken.data.data.data[0].market_buy_price,
                  market_sell_price : resToken.data.data.data[0].market_sell_price,
                  price : resToken.data.data.data[0].price ,
                  volume : resToken.data.data.data[0].volume,
                  last : resToken.data.data.data[0].last_price ,
                  percentChange : resToken.data.data.data[0].day_change ,
                })
              } else {
                let resToken = await axios.get(`${config.PUBULIC_EXCHANGE_RATE_API}${element.symbol}`) ;

                tokenTickerList.push({
                  price : filter[0].last,
                  percentChange : filter[0].bid_ask_spread_percentage,
                  volume : filter[0].volume ,
                  _id : element._id ,
                  name : element.name ,
                  symbol : element.symbol ,
                  pair_type : element.pair_type ,
                  logo_url : element.logo_url ,
                  market_buy_price : resToken.data.data.rates[element.pair_type],
                  market_sell_price : resToken.data.data.rates[element.pair_type]
                })
              }
            } else {
                tokenTickerList.push({
                    ...element,
                    market_buy_price : resToken.data.data.data[0].market_buy_price,
                    market_sell_price : resToken.data.data.data[0].market_sell_price,
                    price : resToken.data.data.data[0].price ,
                    volume : resToken.data.data.data[0].volume,
                    last : resToken.data.data.data[0].last_price ,
                    percentChange : resToken.data.data.data[0].day_change ,
                  })
            }
          }

        dispatch({
            type : ActionTypes.GetTokenInfoList ,
            payload : tokenTickerList
        })

    }
    catch (err) {
        console.log(err) ;
    }
}

export const GetTokenLiquidityList = (status = "" , pair_type="" , token_symbol = "") => async dispatch => {
    
    if(status === "") {
        dispatch({
            type : ActionTypes.GetTokenLiquidityList ,
            payload : []
        }) ;

        return ;
    }

    try {
        let jsonBody ;

        if(pair_type === "") {
            jsonBody = {
                status : status ,
                search_str : token_symbol ,
            }
        } else {
            jsonBody = {
                status : status ,
                search_str : token_symbol ,
                pair_type : pair_type
            }
        }
        let resTokenInfo = await axios.post(`${config.PRIVATE_CALADEX_API}token/get` , jsonBody) ;

        if(resTokenInfo.data.data.data.length === 0 ){
            return dispatch({
                type : ActionTypes.GetTokenLiquidityList ,
                payload : ['No Avaliable Informations.']
            });
        }

        /// backend data
        let tokenInfoList = [] ;

        for(let element of resTokenInfo.data.data.data) {
            if(element.symbol === 'ETH' || element.symbol === 'DAI')
                continue;
            let pair_type_array = element.pair_type.split(",") ;
            for(let pair of pair_type_array) {
                switch(pair_type) {
                    case "ETH" : 
                        if(pair === "ETH") {
                            await tokenInfoList.push({
                                ...element ,
                                pair_type : pair
                            })
                        }
                        break ;
                    case "DAI" :
                        if(pair === "DAI") {
                            await tokenInfoList.push({
                                ...element ,
                                pair_type : pair
                            })
                        }
                        break ;
                    default :
                        await tokenInfoList.push({
                            ...element ,
                            pair_type : pair
                        })
                        break ;
                }
            }
        }

        // third party data
        let resTicker = await axios.get(`${config.PUBLIC_API_URL}command=returnTicker`) ;

        let tokenLiquidityList = [] ;

        for (let element of tokenInfoList ){
            let resToken = await axios.post(`${config.PRIVATE_CALADEX_API}tokenInfo/getOne`,{
                token_id : element._id ,
                pair_token : element.pair_type
            }) ;

            if(resToken.data.data.data[0].market_buy_price === 0 || resToken.data.data.data[0].market_sell_price === 0) {
                if ( typeof resTicker.data[element.pair_type + "_" + element.symbol] === "undefined" && typeof resTicker.data[element.symbol + "_" + element.pair_type] === "undefined" ){

                    await tokenLiquidityList.push({
                        ...element ,
                        market_buy_price : resToken.data.data.data[0].market_buy_price,
                        market_sell_price : resToken.data.data.data[0].market_sell_price,
                        price : resToken.data.data.data[0].price ,
                        last : resToken.data.data.data[0].last_price ,
                        percentChange : resToken.data.data.data[0].day_change ,
                        high24hr : resToken.data.data.data[0].day_high ,
                        low24hr : resToken.data.data.data[0].day_low ,
                        volume24hr : resToken.data.data.data[0].volume ,
                        total24hr : 0 ,
                    })
                } 
                else if (typeof resTicker.data[element.pair_type + "_" + element.symbol] !== "undefined") {
    
                        let resToken = await axios.get(`${config.PUBULIC_EXCHANGE_RATE_API}${element.symbol}`) ;
    
                        await tokenLiquidityList.push({
                            ...resTicker.data[element.pair_type + "_" + element.symbol] ,
                            _id : element._id ,
                            symbol : element.symbol ,
                            pair_type : element.pair_type ,
                            logo_url : element.logo_url ,
                            total24hr : resTicker.data[element.pair_type + "_" + element.symbol].quoteVolume * resToken.data.data.rates.USD ,
                            price : resToken.data.data.rates[element.pair_type] ,
                            market_buy_price : resToken.data.data.rates[element.pair_type],
                            market_sell_price : resToken.data.data.rates[element.pair_type]
                        })                
                    } else {
                        let resToken = await axios.get(`${config.PUBULIC_EXCHANGE_RATE_API}${element.symbol}`) ;
    
                        let low24hr = Number( resTicker.data[element.symbol + "_" + element.pair_type].low24hr ) ;
                        let high24hr = Number(resTicker.data[element.symbol + "_" + element.pair_type].high24hr) ;
                        let last = Number(resTicker.data[element.symbol + "_" + element.pair_type].last) ;

                        await tokenLiquidityList.push({
                            ...resTicker.data[element.symbol + "_" + element.pair_type] ,
                            _id : element._id ,
                            last : last === 0 ? 0 : 1 / last ,
                            low24hr : low24hr === 0 ? 0 : 1 / low24hr ,
                            high24hr : high24hr === 0 ? 0 : 1 / high24hr ,
                            symbol : element.symbol ,
                            pair_type : element.pair_type ,
                            logo_url : element.logo_url ,
                            total24hr : resTicker.data[element.symbol + "_" + element.pair_type].quoteVolume * resToken.data.data.rates.USD ,
                            price : resToken.data.data.rates[element.pair_type] ,
                            market_buy_price :  resToken.data.data.rates[element.pair_type],
                            market_sell_price : Number(resToken.data.data.rates[element.pair_type])  
                        })      
                }
            } else {
                // console.log(element) ;
                // console.log({
                //     ...element ,
                //     price : resToken.data.data.data.price ,
                //     market_buy_price : resToken.data.data.data.market_buy_price,
                //     market_sell_price : resToken.data.data.data.market_sell_price,
                //     last : resToken.data.data.data.last_price ,
                //     percentChange : resToken.data.data.data.day_change ,
                //     high24hr : resToken.data.data.data.day_high ,
                //     low24hr : resToken.data.data.data.day_low ,
                //     volume24hr : resToken.data.data.data.volume ,
                //     total24hr : 0 ,
                // }) ;
                // console.log(resToken.data.data.data) ;
                // console.log(resToken.data.data.data[0]["day_change"]) ;

                await tokenLiquidityList.push({
                    ...element ,
                    price : resToken.data.data.data[0].price ,
                    market_buy_price : resToken.data.data.data[0].market_buy_price,
                    market_sell_price : resToken.data.data.data[0].market_sell_price,
                    last : resToken.data.data.data[0].last_price ,
                    percentChange : resToken.data.data.data[0].day_change ,
                    high24hr : resToken.data.data.data[0].day_high ,
                    low24hr : resToken.data.data.data[0].day_low ,
                    volume24hr : resToken.data.data.data[0].volume ,
                    total24hr : 0 ,
                })
            }
        }
        
        await dispatch({
            type : ActionTypes.GetTokenLiquidityList ,
            payload : tokenLiquidityList 
        })
    }
    catch(err) {
        console.log(err) ;
    }
}


export const GetTokenBalanceInfo = (account , search_token) => async dispatch => {

    try {
        let jsonRequestBody  = {
            status : "approved" ,
            search_str : search_token
        }

        let resTokenInfo = await axios.post(`${config.PRIVATE_CALADEX_API}token/get` , jsonRequestBody) ;

        if(resTokenInfo.data.data.data.length === 0) {
            return dispatch({
                type : ActionTypes.GetTokenBalanceInfo ,
                payload : []
            });
        }

        let tokenBaseInfoList = resTokenInfo.data.data.data ;

        let tokenAddresses = [] ;
        let tokenDecimals = {} ;


        for(let element of resTokenInfo.data.data.data) {
            await tokenAddresses.push(element.address) ;
            tokenDecimals[element.address] = element.decimal ;
        }

        let tokenRateInfoList = new Object() ;

        for(let element of tokenBaseInfoList){
            try {
                if(element.symbol === "CAX") {
                    let resToken = await axios.post(`${config.PRIVATE_CALADEX_API}tokenInfo/getOne`,{
                        token_id : element._id ,
                        pair_token : "DAI"
                    }) ;
                    let resPairRate = await axios.get(`${config.PUBULIC_EXCHANGE_RATE_API}DAI`) ;
                    tokenRateInfoList[element.address] = {
                        ...element, 
                        rate :  resToken.data.data.data[0].price * resPairRate.data.data.rates.USD,
                        orderOfCaladex : 0 ,
                        balanceOfCaladex : 0
                    } ;
                    continue;
                }
                let res = await axios.get(`${config.PUBULIC_EXCHANGE_RATE_API}${element.symbol}`) ;

                tokenRateInfoList[element.address] = {
                    ...element, 
                    rate :  res.data.data.rates.USD ,
                    orderOfCaladex : 0 ,
                    balanceOfCaladex : 0
                } ;
            }
            catch (err) {
                tokenRateInfoList[element.address] = {
                    ...element, 
                    rate :  0 ,
                    orderOfCaladex : 0 ,
                    balanceOfCaladex : 0
                } ;
            }
        }

        let tokenBalances = [] ;
      
        await getTokensBalance(web3, account, tokenAddresses)
        .then( (balances) => {
            tokenBalances = balances ;
        })
        .catch(err => {

        });

        let tokenBalanceInfo = [] ;

        for(let address in tokenRateInfoList) {
            tokenRateInfoList[address] = {
                ...tokenRateInfoList[address] ,
                balanceOfwallet : convertBalance( tokenBalances[address] , tokenDecimals[address] ) 
                
            }
        }

        let resTokenBalancesOfCaladex = await axios.post(`${config.PRIVATE_CALADEX_API}balance/get/${account}`) ;

        for(let element of resTokenBalancesOfCaladex.data.data.doc) {
            if(typeof tokenRateInfoList[element.token_id.address] !== "undefined"){
                tokenRateInfoList[element.token_id.address] = {
                    ...tokenRateInfoList[element.token_id.address] ,
                    balanceOfCaladex : element.caladex_balance ,
                    orderOfCaladex : element.order_balance
                }
            }
        }

        tokenBalanceInfo = await json2array(tokenRateInfoList) ;

        dispatch({
            type : ActionTypes.GetTokenBalanceInfo ,
            payload : tokenBalanceInfo 
        })
    }
    catch (err) {
        console.log(err) ;
    }
}

// export const GetTokenPairInfoList = () => async dispatch => {

//     try
//     {
//         let pair_type = "ETH" ;

//         let tokenPairInfoList = [] ;

//         let resTokenInfo = await axios.post(`${config.PRIVATE_CALADEX_API}token/get` , {
//             status : "approved" ,
//             search_str : ""
//         }) ;

//         let resThirdParty = await axios.get(`${config.PUBLIC_API_URL}command=returnTicker`) ;

//         for(let element of resTokenInfo) {
//             resThirdParty[]
//             tokenPairInfoList
//         }

//         console.log(resThirdParty) ;
//         console.log(resTokenInfo);
//     }
//     catch(err) {
//         console.log(err) ;
//     }
// }

export const GetTokenPairList = () => async dispatch => {
    try {
        // third party data
        let resTicker = await axios.get(`${config.PUBLIC_API_URL}command=returnTicker`) ;

        let tokenPairList = [] ;

        let resToken = await axios.post(`${config.PRIVATE_CALADEX_API}tokenInfo/getOne`,{
            
        }) ;

        for (let element of resToken.data.data.data ){
           
            if(element.market_buy_price === 0 || element.market_sell_price === 0) {
                if ( typeof resTicker.data[element.pair_token + "_" + element.token_id.symbol] === "undefined" && typeof resTicker.data[element.token_id.symbol + "_" + element.pair_token] === "undefined" ){

                    // console.log(Number(element.price)) ;

                    await tokenPairList.push({
                        ...element.token_id ,
                        pair_type : element.pair_token,
                        market_buy_price : element.market_buy_price,
                        market_sell_price : element.market_sell_price,
                        price : element.price ,
                        last : element.last_price ,
                        percentChange : element.day_change ,
                        high24hr : element.day_high ,
                        low24hr : element.day_low ,
                        volume24hr : element.volume ,
                        total24hr : 0 ,
                    })
                } 
                else if (typeof resTicker.data[element.pair_token + "_" + element.token_id.symbol] !== "undefined") {
    
                        let resToken = await axios.get(`${config.PUBULIC_EXCHANGE_RATE_API}${element.token_id.symbol}`) ;
    

                        await tokenPairList.push({
                            ...resTicker.data[element.pair_token + "_" + element.token_id.symbol] ,
                            _id : element.token_id._id ,
                            symbol : element.token_id.symbol ,
                            pair_type : element.pair_token ,
                            logo_url : element.token_id.logo_url ,
                            total24hr : resTicker.data[element.pair_token + "_" + element.token_id.symbol].quoteVolume * resToken.data.data.rates.USD ,
                            price : resToken.data.data.rates[element.pair_token] ,
                            market_buy_price : resToken.data.data.rates[element.pair_token],
                            market_sell_price : resToken.data.data.rates[element.pair_token]
                        })                
                    } else {
                        let resToken = await axios.get(`${config.PUBULIC_EXCHANGE_RATE_API}${element.token_id.symbol}`) ;
    
                        let low24hr = Number( resTicker.data[element.token_id.symbol + "_" + element.pair_token].low24hr ) ;
                        let high24hr = Number(resTicker.data[element.token_id.symbol + "_" + element.pair_token].high24hr) ;
                        let last = Number(resTicker.data[element.token_id.symbol + "_" + element.pair_token].last) ;

                        // console.log(element.token_id.symbol , element.pair_token) ;
                        // console.log( resToken.data.data.rates[element.symbol])

                        await tokenPairList.push({
                            ...resTicker.data[element.token_id.symbol + "_" + element.pair_token] ,
                            _id : element.token_id._id ,
                            last : last === 0 ? 0 : 1 / last ,
                            low24hr : low24hr === 0 ? 0 : 1 / low24hr ,
                            high24hr : high24hr === 0 ? 0 : 1 / high24hr ,
                            symbol : element.token_id.symbol ,
                            pair_type : element.pair_token ,
                            logo_url : element.token_id.logo_url ,
                            total24hr : resTicker.data[element.token_id.symbol + "_" + element.pair_token].quoteVolume * resToken.data.data.rates.USD ,
                            price : resToken.data.data.rates[element.pair_token] ,
                            market_buy_price :  resToken.data.data.rates[element.pair_token],
                            market_sell_price : Number(resToken.data.data.rates[element.pair_token])  
                        })      
                }
            } else {
                // console.log(element) ;
                // console.log(element.pair_token, element.token_id.symbol) ;

                await tokenPairList.push({
                    ...element.token_id ,
                    pair_type : element.pair_token,
                    symbol : element.token_id.symbol,
                    price : element.price ,
                    market_buy_price : element.market_buy_price,
                    market_sell_price : element.market_sell_price,
                    last : element.last_price ,
                    percentChange : element.day_change ,
                    high24hr : element.day_high ,
                    low24hr : element.day_low ,
                    volume24hr : element.volume ,
                    total24hr : 0 ,
                })
            }
        }
        
        // console.log(tokenPairList);

        await dispatch({
            type : ActionTypes.GetTokenPairList ,
            payload :  tokenPairList
        })
    }
    catch(err) {
        console.log(err) ;
    }
}