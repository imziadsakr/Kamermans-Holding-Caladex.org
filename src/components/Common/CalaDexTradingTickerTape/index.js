



import React from 'react' ;

import { makeStyles } from '@mui/styles';

import { useEffect , useState} from 'react' ;

import PropTypes from 'prop-types' ;
import { connect } from 'react-redux';
import axios from 'axios';

import { GetTokenLiquidityList } from '../../../redux/actions/token' ;
import * as config from '../../../static/constants';

import {
  Box,
  CircularProgress
} from '@mui/material' ;

const useStyles = makeStyles({
    root : {
        width : "100%" ,
        borderBottom : "1px solid lightgray" ,
        borderTop : "1px solid lightgray" ,
        boxSizing: "borderBox",
        "& div" : {
          display: "block"
        },
        "& .ticker-tape" : {
          width: "100%" ,
          height: "2.5rem" ,
          margin: "0 auto 0"  ,
         
        } ,
        "& .ticker-tape-scroll" :  {
          overflow: "hidden" ,
          whiteSpace: "nowrap"
        } ,
       "& .ticker-tape-collection"  : {
          display: "tale-cell" ,
          position: "relative" ,
          left : props => `-${350 * props.tokenLiquidityList.length}px`,
          animation: `$ticker-tape-scrolling linear infinite running` ,
          animationDuration :  props => `${props.tokenLiquidityList.length * 7}s` ,
        } , 
        "& .ticker-tape-collection:hover" : {
          animationPlayState: "paused" , 
        } ,
       "& .ticker-tape-story" : {
          display: "inline-block" ,
          textAlign : "center" ,
          verticalAlign: "top" ,
          lineHeight: "2.5rem" ,
          borderRight : "1px solid lightgray" ,
          borderLeft : "1px solid lightgray" ,
          paddingLeft : "15px" ,
          paddingRight : "15px" ,
          // minWidth : "320px" ,
          width : "350px",
          "& :after" : {
            overflow: "hidden",
            textIndent: "-9999rem",
            fontSize: "0",
            lineHeight: "0",
            content: "line after",
            display: "inline-block" ,
            height: "1.875rem" ,
            marginBottom: "0.1875rem" ,
            borderRight: "1px solid black" ,
            verticalAlign: "middle",
          },
        } ,
        "& .ticker-tape-link" : {
          display: 'inline-block' ,
          padding: '0 1.25rem' ,
          color: "black"
        } ,
        "& a" : {
          textDecoration: "none" ,
          outline: 0
        },
    },
    tickerShortName : {
      fontSize : "15px" ,
      fontWeight: 700 ,
      color : "#131722",
      fontFamily: "Inter,-apple-system,BlinkMacSystemFont,San Francisco,Segoe UI,Roboto,Helvetica Neue,sans-serif"
    },
    tickerLast : {
      fontSize : "15px" ,
      fontFamily: "Inter,-apple-system,BlinkMacSystemFont,San Francisco,Segoe UI,Roboto,Helvetica Neue,sans-serif" ,
      color : "#131722"
    } ,
    tickerPtChange : {
      fontSize : "15px" ,
      fontFamily: "Inter,-apple-system,BlinkMacSystemFont,San Francisco,Segoe UI,Roboto,Helvetica Neue,sans-serif" ,
    },
    "@keyframes ticker-tape-scrolling" : {
        "0%" : {
          left: "0%"
        } ,
    },
    loading : {
      display:"flex !important" , 
      justifyContent:"center !important" , 
      alignItems:"center !important" , 
      height: "100%"
    }
});

let tokenTapeInfoTimer = null;
let tickerTimer = null ;

const CalaDexTradingTickerTape = (props) => {
    
  const { 
    GetTokenLiquidityList , tokenLiquidityList
  } = props ;
  
  const [tickerData, setTickerData] = useState([]) ;


  const classes = useStyles(props) ;

  const handleSetTickerData = (tickerData) => {
    setTickerData(tickerData) ;
  }

  const setTimerForTokenTapeInfoList =  async () => {
      tokenTapeInfoTimer = setInterval(async () => {
          await GetTokenLiquidityList("approved") ;
          return ;
      } , 15000 )
  }

  const GetTradingTicker = async () => {


    let resTokenInfo = await axios.post(`${config.PRIVATE_CALADEX_API}token/get` , {
      status : 'approved' ,
      search_str : ''
    }) ;

    if(resTokenInfo.data.data.data.length === 0 ){
        handleSetTickerData(null) ;
    }

        /// backend data
    let tokenInfoList = [] ;

    for(let element of resTokenInfo.data.data.data) {
        if(element.symbol === 'ETH' || element.symbol === 'DAI')
            continue;
        let pair_type_array = element.pair_type.split(",") ;
        for(let pair of pair_type_array) {
            switch(pair) {
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
              
              // console.log(filter) ;

              if(filter.length === 0) {
                tokenTickerList.push({
                  ...element,
                  market_buy_price : resToken.data.data.data[0].market_buy_price,
                  market_sell_price : resToken.data.data.data[0].market_sell_price,
                  price : resToken.data.data.data[0].price ,
                  last : resToken.data.data.data[0].last_price ,
                  percentChange : resToken.data.data.data[0].day_change ,
                })
              } else {
                let resToken = await axios.get(`${config.PUBULIC_EXCHANGE_RATE_API}${element.symbol}`) ;

                tokenTickerList.push({
                  price : filter[0].last,
                  percentChange : filter[0].bid_ask_spread_percentage,
                  _id : element._id ,
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
                last : resToken.data.data.data[0].last_price ,
                percentChange : resToken.data.data.data[0].day_change ,
              })
            }
          }

          handleSetTickerData(tokenTickerList) ;
  }

  useEffect(() => {
    GetTradingTicker() ;
    tickerTimer = setInterval(async () => {
        // GetTradingTicker() ;
    }, 100000);
  }, []) ;

  useEffect(() => {
    // console.log(tokenLiquidityList);
  }, [tokenLiquidityList]) ;
    useEffect(() => {
        return () => {
            clearInterval(tokenTapeInfoTimer) ;
        }
    } , [])

    useEffect(async () => {
      await GetTokenLiquidityList("approved") ;
      setTimerForTokenTapeInfoList("") ;
    } , []) ;

    return (
      <>
        <section className={classes.root}>
            <div className="ticker-tape">
                <div className="ticker-tape-scroll">
                    <div className="ticker-tape-collection" >
                      {
                        tickerData && ( tickerData.length !== 0 ? tickerData.map((element , index) => {
                          return(
                            <div className='ticker-tape-story' key={index} sx={{width:"33% !important"}}>
                              <a className="ticker-tap-link">
                                  <img src={`${config.PRIVATE_CALADEX_API}files/${element.logo_url}`} width={30} height={25} /> 
                                  &nbsp;&nbsp;
                                  <span className={classes.tickerShortName}>{element.symbol} / {element.pair_type}</span>
                                  &nbsp; <span className={classes.tickerLast} sx={{color : Number(element.price) <= 0.0 ? "#f7525f" : "#22ab94"}}>{Number(element.price) < 0.0 ? "-" : "+"}{Number(element.price).toFixed(4)}</span>
                                  &nbsp;&nbsp;<span className={classes.tickerPtChange} sx={{color : Number(element.percentChange) <= 0.0 ? "#f7525f" : "#22ab94"}}>( {Number(element.percentChange).toFixed(2)} %)</span>
                                {/* </span> */}
                              </a>
                            </div>
                          )
                        }):<Box component={"div"} className={classes.loading} >
                          <CircularProgress size={30}/>
                        </Box> )
                      }
                      {
                        tickerData && ( tickerData.length !== 0 ? tickerData.map((element , index) => {
                          return(
                            <div className='ticker-tape-story' key={index} sx={{width:"33% !important"}}>
                              <a href="ticker-tap-link">
                                {/* <span className={classes.tickerItem}> */}
                                  <img src={`${config.PRIVATE_CALADEX_API}files/${element.logo_url}`} width={30} height={25} /> 
                                  &nbsp;&nbsp;
                                  <span className={classes.tickerShortName}>{element.symbol} / {element.pair_type}</span>
                                  &nbsp; <span className={classes.tickerLast} sx={{color : Number(element.price) <= 0.0 ? "#f7525f" : "#22ab94"}}>{Number(element.price) < 0.0 ? "-" : "+"}{Number(element.price).toFixed(4)}</span>
                                  {/* &nbsp;&nbsp;{element.baseVolume} */}
                                  &nbsp;&nbsp;<span className={classes.tickerPtChange} sx={{color : Number(element.percentChange) <= 0.0 ? "#f7525f" : "#22ab94"}}>( {Number(element.percentChange).toFixed(2)} %)</span>
                                {/* </span> */}
                              </a>
                            </div>
                          )
                        }):<></> )
                      }
                      {
                        tickerData && ( tickerData.length !== 0 ? tickerData.map((element , index) => {
                          return(
                            <div className='ticker-tape-story' key={index} sx={{width:"33% !important"}}>
                              <a href="ticker-tap-link">
                                {/* <span className={classes.tickerItem}> */}
                                  <img src={`${config.PRIVATE_CALADEX_API}files/${element.logo_url}`} width={30} height={25} /> 
                                  &nbsp;&nbsp;
                                  <span className={classes.tickerShortName}>{element.symbol} / {element.pair_type}</span>
                                  &nbsp; <span className={classes.tickerLast} sx={{color : Number(element.price) <= 0.0 ? "#f7525f" : "#22ab94"}}>{Number(element.price) < 0.0 ? "-" : "+"}{Number(element.price).toFixed(4)}</span>
                                  {/* &nbsp;&nbsp;{element.baseVolume} */}
                                  &nbsp;&nbsp;<span className={classes.tickerPtChange} sx={{color : Number(element.percentChange) <= 0.0 ? "#f7525f" : "#22ab94"}}>( {Number(element.percentChange).toFixed(2)} %)</span>
                                {/* </span> */}
                              </a>
                            </div>
                          )
                        }):<></> )
                      }
                    </div>
                </div>
            </div>
        </section>
      </>
        
    )
}


CalaDexTradingTickerTape.propsType = {
  tokenLiquidityList : PropTypes.array.isRequired 
}

const mapStateToProps = (state) => ({
  tokenLiquidityList : state.token.tokenLiquidityList
})

const mapDispatchToProps = {
  GetTokenLiquidityList
}

export default connect(mapStateToProps , mapDispatchToProps)(CalaDexTradingTickerTape) ;