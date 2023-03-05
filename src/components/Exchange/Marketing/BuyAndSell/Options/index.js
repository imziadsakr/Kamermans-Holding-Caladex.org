



import React from 'react' ;

import { useEffect , useState, useContext } from 'react' ;
import { useWeb3React } from '@web3-react/core' ;

import Web3Context from '../../../../../store/web3-context';

import swal from 'sweetalert';

import { GetTokenOrderList } from '../../../../../redux/actions/trade';
import { GetExchangeOrderList } from '../../../../../redux/actions/order';
import { OrderLimit , OrderMarket} from '../../../../../redux/actions/order';
import { GetTokenPairList } from '../../../../../redux/actions/token';
import { GetTokenBalance } from '../../../../../redux/actions/balance' ;

import axios from 'axios' ;
import { PRIVATE_CALADEX_API, PUBLIC_API_URL, PUBULIC_EXCHANGE_RATE_API } from '../../../../../static/constants' ;

import {
    Box ,
    Grid ,
    TextField ,
    InputAdornment ,
    Button ,
    Slider
} from '@mui/material' ;

import { makeStyles } from '@mui/styles';
import { connect } from 'react-redux';
import token from '../../../../../redux/reducers/token';

const useStyles = makeStyles((theme) => ({
    root : {
        marginTop : "10px",
        padding : "20px",
        textAlign : "center",
        "& .MuiGrid-item" : {
            marginBottom : "15px"
        },
        "& .MuiButton-root" : {
            borderRadius : "15px",
            marginLeft : "5px",
            marginRight : "5px"
        }
    },
    btGp : {
        "& .MuiButton-root" : {
            borderRadius : "5px",
            marginLeft : "15px",
            marginRight : "15px" ,
            textTransform : "capitalize"
        }
    },
    gray : {
        color : "gray !important"
    },
    black : {
        color : "black !important"
    }
}));

const Options = (props) => {
    
    const classes = useStyles() ;

    // const { library, account , active } = useWeb3React() ;
    const web3Ctx = useContext(Web3Context);

    const [ exchangePrice , setExchangePrice ] = useState(0) ;
    const [ exchangeAmount, setExchangeAmount ] = useState(0) ;
    const [ exchangeType , setExchangeType ] = useState(false) ;
    const [ exchangeMarketPrice , setExchangeMarketPrice] = useState(0) ;
    const [ totalAmount , setTotalAmount ] = useState(0) ;
    const [ percentage , setPercentage ] = useState(100) ;
    const [ available , setAvailable ] = useState(0) ;

    const {
        tokenBalance,
        pairBalance,
        tradeToken,
        price,
        status ,
        methodType,
        handleChangePrice ,
        handlePriceType,
        GetTokenOrderList,
        GetExchangeOrderList,
        GetTokenPairList,
        GetTokenBalance,
        walletAddress
    } = props ;



    const handleExchangePrice = (e) => {
        setExchangePrice(e.target.value) ;
    }

    const handleExchangeAmount = (e) => {
        let percentage = Number(e.target.value) / totalAmount * 100 ;
        
        setPercentage(percentage) ;
        setExchangeAmount(e.target.value) ;
    }

    const handleExchangeType = (type) => {
        handlePriceType(type) ;
        setExchangeType(type);
    }

    const handleAmountPercentage = async (e) => {
        setExchangeAmount( Number(totalAmount) / 100 * e.target.value ) ;
        setPercentage(e.target.value);

        // let resRate = await axios.get(`${PUBULIC_EXCHANGE_RATE_API}${tradeToken.symbol}`) ;

        // setAvailable( Number(totalAmount) / 100 * e.target.value * resRate.data.data.rates["DAI"]);
        // setExchangePrice(Number(e.target.value / exchangePrice)) ;
    }

    const handleExchangeToken = async () => {

        if(!walletAddress){
            swal({
                title: "Warning",
                text: "Please, Connect with Metamask.",
                icon: "warning",
                timer: 2000,
                button: false
            }) ;

            return ;
        }

        // return alert(exchangePrice);
        // return alert(exchangeMarketPrice / 100 * 20);
        if(exchangeMarketPrice / 100 * 20 > exchangePrice){
            swal({
                title: "Warning",
                text: "Underflow Error",
                icon: "warning",
                timer: 2000,
                button: false
            }) ;

            setExchangePrice(exchangeMarketPrice / 100 * 20) ;

            return ;
        }

        if(exchangeMarketPrice / 100 * 500 < exchangePrice){
            swal({
                title: "Warning",
                text: "Overflow Error",
                icon: "warning",
                timer: 2000,
                button: false
            }) ;

            setExchangePrice(exchangeMarketPrice / 100 * 500) ;

            return ;
        }
        if(Number(exchangePrice * exchangeAmount) > totalAmount && !exchangeType){
            swal({
                title: "Warning",
                text: "Please, Deposit " + tradeToken.pair_type,
                icon: "warning",
                timer: 2000,
                button: false
            }) ;

            return ;
        }
        if(Number(exchangeAmount) > totalAmount && exchangeType) {
            swal({
                title: "Warning",
                text: "Please, Deposit " + tradeToken.symbol,
                icon: "warning",
                timer: 2000,
                button: false
            }) ;

            return ;
        }
        if(exchangeAmount * Number(tradeToken.price) === 0) {
            swal({
                title: "Warning",
                text: "Total Value Error",
                icon: "warning",
                timer: 2000,
                button: false
            }) ;
        }

        let orderType ;

        switch(exchangeType) {
            case false : 
                orderType = "buy" ;
                break ;
            case true :
                orderType = "sell" ;
                break ;
            default :
                break;
        }

        // alert(orderType) ;
        // alert(exchangeType) ;

        let resultAPI ;

        if(methodType === 1) {
            resultAPI = await OrderLimit(walletAddress , tradeToken._id , tradeToken.pair_type , exchangePrice , exchangeAmount , orderType) ;
        } else {
            resultAPI = await OrderLimit(walletAddress , tradeToken._id , tradeToken.pair_type , exchangePrice , exchangeAmount , orderType) ;
        }

        if(resultAPI) {
            await GetTokenOrderList(tradeToken._id , tradeToken.pair_type , "sell" ) ;
            await GetTokenOrderList(tradeToken._id , tradeToken.pair_type , "buy") ;
            await GetExchangeOrderList(walletAddress , "2022-01-01" , new Date().toISOString().substring(0,10),  tradeToken._id , tradeToken.pair_type ) ;
            await GetTokenPairList() ;

            swal({
                title: "Success",
                text: "Order Successfully!",
                icon: "success",
                timer: 2000,
                button: false
            }) ;
        } else {
            swal({
                title: "Fail",
                text: "Order Failed!",
                icon: "error",
                timer: 2000,
                buttons : false
            }) ;
        }

        GetTokenBalance(walletAddress, tradeToken.symbol,  'symbol') ;
        GetTokenBalance(walletAddress, tradeToken.pair_type , "pair") ;
        handleChangePrice(null) ;
    }
    useEffect(() => {
        if(status === "sell") setExchangeType(true);
        if(status === "buy") setExchangeType(false);

    } , [status]) ;

    useEffect(() => {
        setTotalAmount(0);
        setPercentage(100) ;
        if(exchangeType) {
            setAvailable(tokenBalance) ;
        } else {
            setAvailable(pairBalance) ;
        }
    } , [exchangeType]);

    useEffect(() => {
        setTotalAmount(0) ;
        setPercentage(100) ;
        setAvailable(0) ;

        if(tradeToken) {
            GetTokenBalance(walletAddress, tradeToken.symbol , "token") ;
            GetTokenBalance(walletAddress, tradeToken.pair_type , 'pair') ;
        }
    }, [tradeToken]) ;

    useEffect(async () => {
        if(!walletAddress) {
            setTotalAmount(0) ;
            return ;
        }
        if(tradeToken && walletAddress) {

            let symbol ;

            if(!exchangeType) {
                symbol = tradeToken.pair_type
            } else {
                symbol = tradeToken.symbol
            }
            
            let resId = await axios.post(`${PRIVATE_CALADEX_API}token/getbysymbol` , {
                symbol : symbol
            }) ;
            
            let res = await axios.post(`${PRIVATE_CALADEX_API}balance/getbalance` , {
                address  : walletAddress , 
                token_id : resId.data.data.data._id
            }) ;

            if(res.data.data.doc === null){

                    if(price !== null) {
                        setExchangePrice(price) ;
                        handleChangePrice(null) ;
                    } else {
                        if(!exchangeType){
                            setExchangePrice(tradeToken.market_buy_price) ;
                            setTotalAmount(0);
                            setExchangeAmount(0) ;
                        } else {
                            setExchangePrice(tradeToken.market_sell_price) ;
                        }
                    }
                setExchangeAmount(0) ;
            } else {

                if(!exchangeType){
                    console.log("***********************", tradeToken.market_buy_price) ;

                    setExchangeMarketPrice(tradeToken.market_buy_price) ;
                    
                    if(price) {
                        setExchangePrice(price) ;
                        handleChangePrice(null) ;
                    } else {
                        setExchangePrice(tradeToken.market_buy_price) ;
                    }

                    console.log("------------" , res) ;

                    setTotalAmount( res.data.data.doc.caladex_balance /  tradeToken.market_buy_price) ;
                    setExchangeAmount( res.data.data.doc.caladex_balance /  tradeToken.market_buy_price) ;
                    
                } else {
                    setExchangeMarketPrice( tradeToken.market_sell_price ) ;

                    if(price !== null) {
                        setExchangePrice(price
                            ) ;
                        handleChangePrice(null) ;
                    } else {
                        setExchangePrice( tradeToken.market_sell_price ) ;
                    }

                    setTotalAmount( res.data.data.doc.caladex_balance ) ;
                    setExchangeAmount( res.data.data.doc.caladex_balance ) ;
                }
                
            }
        }
    } , [tradeToken , walletAddress , exchangeType , methodType]) ;

    useEffect(() => {
        if( price !== null ) {
            setExchangePrice(price) ;
        }
    } , [price]) ;

    useEffect(() => {
        console.log(pairBalance ,  tokenBalance);
        if(exchangeType) {
            setTotalAmount(tokenBalance);
        } else {
            setTotalAmount(pairBalance / exchangePrice);
        }
    }, [pairBalance , tokenBalance]) ;
    
    return (
        <Box component={"div"} className={classes.root}>
            <Grid container>
                <Grid item xs={12} className={classes.btGp}>
                    <Grid container>
                        <Grid item xs={5}>
                            <Button variant={'contained'} size={"small"} fullWidth color={!exchangeType ? "primary" : "inherit"} onClick={() => handleExchangeType(false)}>Buy</Button>
                        </Grid>
                        <Grid item xs={1}>

                        </Grid>
                        <Grid item xs={5}>
                            <Button variant={'contained'} size={"small"} fullWidth color={exchangeType ? "secondary" : "inherit"} onClick={() => handleExchangeType(true)}>Sell</Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <TextField 
                        label={"Price"}
                        size={"small"}
                        type={"number"}
                        variant={"outlined"}
                        value={exchangePrice}
                        onChange={handleExchangePrice}
                        InputProps={{
                            endAdornment : <InputAdornment position={"end"}>{tradeToken ? tradeToken.pair_type : "..."}</InputAdornment> ,
                            inputProps: { 
                                // min : tradeToken ? tradeToken.price / 100 * 50 : 0,
                                // max : tradeToken ? tradeToken.price / 100 * 500 : 0
                                disabled : methodType ? (methodType === 1 ? false : true) : false,
                                className : methodType ? (methodType === 1 ? classes.black : classes.gray) : classes.black
                            } 
                        }}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField 
                        label={"Amount"}
                        size={"small"}
                        type={"number"}
                        variant={"outlined"}
                        value={exchangeAmount}
                        onChange={handleExchangeAmount}
                        InputProps={{
                            endAdornment : <InputAdornment position={"end"}>{tradeToken ? tradeToken.symbol : "..."}</InputAdornment>,
                            inputProps: { 
                                min: 0 
                            } 
                        }}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <Slider
                        size="small"
                        min={0}
                        max={100}
                        onChange={handleAmountPercentage}
                        value={percentage}
                        aria-label="Small"
                        valueLabelDisplay="auto"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField 
                        label={"Total"}
                        size={"small"}
                        type={"number"}
                        variant={"outlined"}
                        value={Number(exchangePrice * exchangeAmount).toFixed(18)}
                        InputProps={{
                            endAdornment : <InputAdornment position={"end"}>{tradeToken ? tradeToken.pair_type : "..."}</InputAdornment>
                        }}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField 
                        label={"Available"}
                        size={"small"}
                        type={"number"}
                        variant={"outlined"}
                        value={exchangeType ? tokenBalance : pairBalance}
                        InputProps={{
                            endAdornment : <InputAdornment position={"end"}>{exchangeType?tradeToken.symbol:tradeToken.pair_type}</InputAdornment>
                        }}
                        disabled
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    {
                        exchangeType ? <Button variant={"contained"} size={"small"}  color={"secondary"} fullWidth onClick={() => handleExchangeToken()}>
                            Sell { tradeToken ? tradeToken.symbol : ""}
                        </Button> : <Button variant={"contained"} size={"small"}   fullWidth onClick={() => handleExchangeToken()}>
                            Buy { tradeToken ? tradeToken.symbol : "..."}
                        </Button>
                    }
                    
                </Grid>
                {/* <Grid item xs={12} className={classes.btGp}>
                    <Button variant={'contained'} size={"small"} >Buy</Button>

                    <Button variant={'contained'} size={"small"}  color={"secondary"}>Sell</Button>
                </Grid> */}
            </Grid>
        </Box>
    )
}

const mapStateToProps = state => ({
    orderSellList : state.trade.orderSellList,
    orderBuyList : state.trade.orderBuyList,
    tokenBalance : state.balance.token_balance,
    pairBalance : state.balance.pair_balance,
    walletAddress : state.wallet.walletAddress
})
const mapDispatchToProps = {
    GetTokenOrderList,
    GetExchangeOrderList,
    GetTokenPairList,
    GetTokenBalance
}

export default connect(mapStateToProps , mapDispatchToProps) (Options) ;
// export default Options;