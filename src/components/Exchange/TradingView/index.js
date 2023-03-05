

import React, { useEffect } from 'react' ;

import { useState } from 'react' ;

import { PUBLIC_API_URL } from '../../../static/constants';

import axios from 'axios' ;

// import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets' ;
import TradingViewWidget from 'react-tradingview-widget';

import {
    Box
} from '@mui/material' ;

import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    root : {
        width : "100%" ,
        borderBottom : "1px solid gray" ,
        paddingBottom : "1px" ,
        height : "calc(50vh - 48px)" ,
        minHeight : "calc(50vh - 48px)"
    } ,
}));

const TradingView = (props) => {
    
    const classes = useStyles() ;
    const [symbol, setSymbol] = useState(null) ;

    const {
        tradeToken
    } = props ;

    useEffect(async () => {
        if(tradeToken) {
            try {
                if(tradeToken.symbol === "DAI" && tradeToken.pair_type === "ETH"){
                    setSymbol(tradeToken.pair_type + tradeToken.symbol) ;
                    return ;
                }
                setSymbol(tradeToken.symbol + tradeToken.pair_type) ;
            } catch(err) {

            }
        }
    } , [tradeToken]) ;

    return (
        <Box component={"div"} className={classes.root}>
            <TradingViewWidget
                hide_legend
                allow_symbol_change={false}
                symbol={'POLONIEX:' + ( symbol || "ETHDAI" )}
                locale="en"
                autosize
            />
        </Box>
    )
}

export default TradingView ;