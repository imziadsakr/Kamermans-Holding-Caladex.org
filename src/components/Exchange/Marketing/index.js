

import React, { useState, useContext } from 'react' ;

import { useWeb3React } from '@web3-react/core';

import MarketSelectBox from './MarketSelectBox';
import BuyAndSell from './BuyAndSell' ;
import WalletConnectPn from '../WalletConnectPn';

import {
    Box
} from '@mui/material' ;

import { makeStyles } from '@mui/styles';
import { connect } from 'react-redux';

import Web3Context from '../../../store/web3-context';

const useStyles = makeStyles((theme) => ({
    root : {
        // maxHeight : "calc(50vh - 113.815px)" ,
        // height : "calc(50vh - 113.815px)" ,
    } ,
}));

const Marketing = (props) => {
    
    const classes = useStyles() ;

    // const { active } = useWeb3React() ;

    const web3Ctx = useContext(Web3Context);
    
    const {
        walletAddress
    } = props ;

    const  { 
        tradeToken , price , status , handleChangePrice ,
        methodType , setMethodType, handlePriceType
    } = props ;
    
    return (
        <Box component={"div"} className={classes.root}>
            <MarketSelectBox 
                setMethodType={setMethodType}
                methodType={methodType}
                handleChangePrice={handleChangePrice}
                tradeToken={tradeToken}
            />
            {
                walletAddress ? <BuyAndSell 
                    price={price}
                    tradeToken={tradeToken}
                    status={status}
                    handleChangePrice={handleChangePrice}
                    methodType={methodType}
                    handlePriceType={handlePriceType}
                /> : <WalletConnectPn 
                />
            }
            
        </Box>
    )
}

const mapStateToProps = state => ({
    walletAddress : state.wallet.walletAddress
})
const mapDispatchToProps = {

}
export default connect(mapStateToProps, mapDispatchToProps)(Marketing) ;