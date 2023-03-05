
import React, { useRef, useContext } from 'react' ;

import { useEffect, useMemo, useState } from 'react';

import Web3Context from '../../../../store/web3-context';
import axios from 'axios' ;
import { PUBULIC_EXCHANGE_RATE_API } from '../../../../static/constants';
import { useWeb3React } from "@web3-react/core";
import { ethers, providers } from 'ethers';
import { SetTokenBalance } from '../../../../redux/actions/balance';

import PropTypes from 'prop-types' ;

import swal from 'sweetalert' ;

import {
    Dialog ,
    DialogTitle,
    DialogContent ,
    Grid,
    Button,
    InputAdornment ,
    TextField ,
    Box ,
    CircularProgress
} from '@mui/material' ;

import { makeStyles } from '@mui/styles';
import { PRIVATE_CALADEX_API } from '../../../../static/constants';

import { CALADEX_ADDR , DAI_ADDR  , injected , BLOCK_CONFIRMATION_THRESHOLD} from '../../../../constants' ;
import CALADEX_ABI from '../../../../constants/abis/caladex.json' ;
import TOKEN_ABI from '../../../../constants/abis/token.json';
import { connect } from 'react-redux';
import { toFixed } from '../../../../utils/helper';

import web3 from '../../../../connection/web3';

const useStyles = makeStyles(() => ({
    root : {

        "& .MuiButton-root" :{
            textTransform : "capitalize" ,
        }
    },
    deposit : {
        backgroundColor : "#f76707 !important"
    }
}));
const Deposit = (props) => {

    const { open , handleClose , symbol , amount , logo_url , token_id , token_address, decimal , updateDepositTokensArray ,
            GetEthBalanceInfo ,
            GetTokenBalanceInfo , 
            SetTokenBalance, walletAddress, web3Provider } = props ;
    
    // const { active, account, chainId, library, activate } = useWeb3React();
    
    const provider = providers.getDefaultProvider();

    const [inputAmount , setInputAmount] = useState(0) ;

    const CaladexContract = new ethers.Contract(CALADEX_ADDR, CALADEX_ABI, web3Provider.getSigner());
    const TokenContract = new ethers.Contract(token_address, TOKEN_ABI, web3Provider.getSigner());

    const classes = useStyles() ;

    const onDeposit = async () => {
       if(isNaN( Number(inputAmount) ) || inputAmount === "" || Number(inputAmount) <= 0) {
            return swal({
                title: "WARNING",
                text: "Invalid amount type.",
                icon: "warning",
                timer: 2000,
                button: false
            }) ;
       }
       if(Number(inputAmount) > amount) {
            return swal({
                title: "WARNING",
                text: "Insufficient tokens.",
                icon: "warning",
                timer: 2000,
                button: false
            })
       }

        await handleClose() ;

        await updateDepositTokensArray(token_id , false) ;

        let resultTx = 0 ;

        if(symbol !== "ETH") {

            try {
                let accountNonce = await provider.getTransactionCount(walletAddress);
                accountNonce = '0x' + (accountNonce + 1).toString(16);
                // console.log(TokenContract);
                let txReceipt = await TokenContract.approve(CALADEX_ADDR,  toFixed(Number(inputAmount) * 10 ** Number(decimal)).toString(), { nonce: accountNonce, gasLimit:70000 });
                await web3Provider.waitForTransaction(txReceipt.hash, BLOCK_CONFIRMATION_THRESHOLD);

                try {
                    accountNonce = await provider.getTransactionCount(walletAddress);
                    accountNonce = '0x' + (accountNonce + 1).toString(16);
                    // console.log(accountNonce, token_address,  toFixed(Number(inputAmount) * 10 ** Number(decimal)).toString());
                    txReceipt = await CaladexContract.deposit(token_address, toFixed(Number(inputAmount) * 10 ** Number(decimal)).toString(), { nonce: accountNonce, gasLimit:70000 });
                    await web3Provider.waitForTransaction(txReceipt.hash, BLOCK_CONFIRMATION_THRESHOLD);
                    var receipt = await provider.getTransactionReceipt(txReceipt.hash);
                    if(receipt.status === true) {
                        resultTx = 1;
                    }
                }
                catch (err) {
                    resultTx = "Deposit Rejected."
                }
            }
            catch(err) {
                resultTx = "Approval Rejected." ;
            }

        } else {
            let ethValue = ethers.utils.parseEther(inputAmount)  ;
           
            try {
                let accountNonce = await provider.getTransactionCount(walletAddress);
                accountNonce = '0x' + (accountNonce + 1).toString(16);

                let txReceipt = await CaladexContract.depositETH({ nonce: accountNonce, gasLimit:70000 , value : ethValue });
            
                await web3Provider.waitForTransaction(txReceipt.hash, BLOCK_CONFIRMATION_THRESHOLD);
                var receipt = await provider.getTransactionReceipt(txReceipt.hash);
                if(receipt.status === true) {
                    resultTx = 1;
                }
            }
            catch (err) {
                resultTx = "Deposit Rejected." ;
            }
               
        }
        
        if(resultTx === 1) await SetTokenBalance(walletAddress , token_id  ,true , inputAmount) ;

        if(resultTx === 1) {
            swal({
                title: "SUCCESS",
                text: "Deposit successfully.",
                icon: "success",
                timer: 2000,
                button: false
            }) ;
        } else if(resultTx === 0 ) {
            swal({
                title: "ERROR",
                text: "Deposit Failed.",
                icon: "error",
                timer: 2000,
                button: false
            }) ;
        } else {
            swal({
                title: "WARNING",
                text: resultTx,
                icon: "warning",
                timer: 2000,
                button: false
            }) ;
        }

        await updateDepositTokensArray(token_id , true) ;

        return ;
    }

    return (
        <div >
            <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    className={classes.root}
            >
                <DialogTitle>Deposit</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} style={{display:"flex" , alignItems:"flex-end"}}>
                            <Grid container>
                                <Grid item xs={2} style={{display:"flex" , alignItems:"flex-end" , padding:"0px"}}>
                                    <Box component={"span"} style={{fontWeight:"bold"}}>Amount</Box>
                                </Grid>
                                <Grid item xs={10}>
                                    <TextField
                                        id="input-with-icon-textfield"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="start">
                                                    <img src={`${PRIVATE_CALADEX_API}files/${logo_url}`} width={30} height={25}/>
                                                    &nbsp;<Box component="span" style={{fontWeight:"bold"}}>{symbol}</Box> 
                                                    &nbsp;&nbsp;&nbsp;<Box component="span" style={{fontWeight:"bold" , color : "#f76707"}}>Max</Box>
                                                </InputAdornment>
                                            ),
                                        }}
                                        variant="standard"
                                        onChange={(e) => setInputAmount(e.target.value)}
                                        placeholder={amount.toString()}
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} className={classes.btnGroup} style={{textAlign:"right"}}>
                          <Button variant={'contained'} className={classes.deposit} onClick={async () => onDeposit()}>Deposit</Button>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </div>
    )
}

Deposit.propsType = {
    
}
const mapStateToProps = state => ({
    walletAddress : state.wallet.walletAddress,
    web3Provider : state.wallet.web3Provider
})
const mapDispatchToProps = {
    SetTokenBalance
}

export default connect(mapStateToProps , mapDispatchToProps)(Deposit) ;