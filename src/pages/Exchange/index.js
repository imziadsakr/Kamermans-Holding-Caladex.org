

import React, { useEffect } from 'react' ;

//___________ hook ____________
import { useState } from 'react' ;
import { useWeb3React } from '@web3-react/core';

import { connect } from 'react-redux';
import { GetTokenPairList } from '../../redux/actions/token' ;

// ________ components ___________
import CoinBanner from '../../components/Exchange/CoinBanner';

import OrderBook from '../../components/Exchange/OrderBook' ;
import CalaDexTradingTickerTape from '../../components/Common/CalaDexTradingTickerTape';
import CalaDexTradingWidget from '../../components/Exchange/CalaDexTradingWidget';
import Marketing from '../../components/Exchange/Marketing' ;
import Trade from '../../components/Exchange/Trade';
import TradingView from '../../components/Exchange/TradingView';
import RecentOrder from '../../components/Exchange/RecentOrder';
import TokenList from '../../components/Exchange/TokenList' ;

// ____________ style ____________________
import {
    Grid ,
    useMediaQuery ,
} from '@mui/material' ;

import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    root : {
     
    }
}));

let tokenPairListTimer ;
// _____________ Exchange function component _________________
const Exchange = (props) => {
    
    const isXs = useMediaQuery("(min-width : 1320px)") ;
    const isXsContainer = useMediaQuery("(min-width : 1000px)") ;

    const classes = useStyles() ;

    const {
        tokenLiquidityList,
        tokenPairList,
        GetTokenPairList
    } = props ;

    const [ isLoading , setIsLoading ]  = useState(false) ;
    const [ tradeToken , setTradeToken ] = useState(null) ;
    const [ price , handleChangePrice ] = useState(null) ;
    const [ status , handleChangeStatus ] = useState(null) ;
    const [ tokenId , handleChangeTokenId ] = useState(null) ;
    const [ isVisible , setIsVisible ] = useState(false) ;
    const [methodType , setMethodType] = useState(1) ;
    const [priceType, setPriceType] = useState(false) ;

    const handlePriceType = (type) => {
        setPriceType(type) ;
    }
    const handlePairInfoVisible = () => {
        setIsVisible(!isVisible) ;
    }

    const handleChangeToken = (trade_token) => {

        if( !tradeToken ) {
            setTradeToken(trade_token) ;
            return ;
        } else {
            console.log("tdfdfdfdfdf") ;
            setTradeToken(trade_token);
        }
    }

    const handleTokenPairListTimer= () => {
        clearInterval(tokenPairListTimer) ;
        tokenPairListTimer = setTimeout(async () => {
            GetTokenPairList() ;
        }, 15000) ;
    }

    useEffect(() => {
        GetTokenPairList();
        handleTokenPairListTimer() ;

        return () => {
            clearInterval(tokenPairListTimer) ;
        }
    }, []) ;

    // useEffect(() => {
    //     // alert(tokenLiquidityList.length) ;
    //     if(!isLoading && tokenLiquidityList.length !== 0) {
    //         // alert("dfsadf") ;
    //         setTradeToken(tokenLiquidityList[0]) ;
    //         setIsLoading(true) ;
    //     }
    // } , [tokenLiquidityList]) ;

    useEffect(() => {
        // alert(tokenLiquidityList.length) ;
        if(!isLoading && tokenPairList.length !== 0) {
            // alert("dfsadf") ;
            setTradeToken(tokenPairList[0]) ;
            handleChangeTokenId(0) ;
            setIsLoading(true) ;

        }
    } , [tokenPairList]) ;

    useEffect(() => {
        // console.log(tokenPairList);
    },[tokenPairList])

    return (
        <>
            <CoinBanner 
                tokenId={tokenId}
                handlePairInfoVisible={handlePairInfoVisible}
            />

            <Grid container className={classes.root}>
                <Grid item xs ={12} sm={isXsContainer ? 3 : 12} sx={{position:"relative !important", border : '1px solid lightgrey',}} >
                    <Marketing 
                        tradeToken = {tradeToken}
                        price={price}
                        status={status}
                        handleChangePrice={handleChangePrice}
                        setMethodType={setMethodType}
                        methodType={methodType}
                        handlePriceType={handlePriceType}
                    />
                    {
                        isVisible ?  <TokenList 
                            handleChangeTokenId={handleChangeTokenId}
                            handleChangeToken={handleChangeToken}
                            handlePairInfoVisible={handlePairInfoVisible}
                        /> :<>
                        </>
                    }
                </Grid> 
                <Grid item xs={12} sm={isXsContainer ? 9 : 12}>
                    <Grid container>
                        <Grid item xs={12} sm={isXsContainer ? 4.5 : 12}>
                            <OrderBook 
                                tradeToken = {tradeToken}
                                handleChangePrice={handleChangePrice}
                                handleChangeStatus={handleChangeStatus}
                                tokenId={tokenId}
                                setMethodType={setMethodType}
                                priceType={priceType}
                            />
                        </Grid>
                        <Grid item xs={12} sm={isXsContainer ? 7.5 : 12}>
                            <Grid container>
                                <Grid item xs={12}>
                                    <CalaDexTradingTickerTape/>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container>
                                        <Grid item xs={12} sm={isXs ? 7 : 12 }>
                                            <Grid container>
                                                <Grid item xs={12}>
                                                    {/* <TradingView 
                                                        tradeToken={tradeToken}
                                                    /> */}
                                                    <CalaDexTradingWidget 
                                                        tokenId = {tokenId}
                                                    />
                                                    {/* <TradingWidget /> */}
                                                </Grid>
                                                <Grid item xs={12}>
                                                    {/* <TokenExchangeWiget /> */}
                                                    {/* <Marketing /> */}
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} sm={isXs ? 5 : 12}>
                                            <Grid container>
                                                <Grid item xs={12}>
                                                    {/* <TokenPriceTable /> */}
                                                    {/* <Table1 /> */}
                                                </Grid>
                                                <Grid item xs={12}>
                                                    {/* <Table2 /> */}
                                                    {/* <TradeHistoryTable /> */}
                                                    <Trade 
                                                        tradeToken={tradeToken}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        {
                                            isXs &&
                                            <Grid item xs={12}>
                                                <RecentOrder 
                                                    tradeToken={tradeToken}
                                                />
                                            </Grid>
                                        }
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        {
                            !isXs &&
                            <Grid item xs={12}>
                                <RecentOrder 
                                    tradeToken={tradeToken}
                                />
                            </Grid>
                        }
                    </Grid>
                </Grid>
            </Grid>
            {/* <Grid container>
                <Grid item xs={12}>
                    <OrderCrpyto />
                </Grid>
            </Grid> */}
        </>
    )
}

const mapStateToProps = state => ({
    tokenPairList : state.token.tokenPairList,
    tokenLiquidityList : state.token.tokenLiquidityList
});

const mapDispatchToProps = {
    GetTokenPairList
}

export default connect(mapStateToProps , mapDispatchToProps)(Exchange) ;
// export default Exchange ;