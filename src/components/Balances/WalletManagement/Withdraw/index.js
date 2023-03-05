
import React from 'react' ;

import { useState , useEffect , useMemo , useRef, useContext } from 'react' ;
import { connect } from 'react-redux';

import swal from 'sweetalert' ;

import Web3Context from '../../../../store/web3-context';
import web3 from '../../../../connection/web3';

import { useWeb3React } from "@web3-react/core";
import { ethers, providers } from 'ethers';
import { SetTokenBalance , ApproveToken } from '../../../../redux/actions/balance';

import {
    Dialog ,
    DialogTitle,
    DialogContent ,
    Grid,
    Button,
    InputAdornment ,
    TextField ,
    Box
} from '@mui/material' ;

import { makeStyles } from '@mui/styles';
import { PRIVATE_CALADEX_API } from '../../../../static/constants';

import { CALADEX_ADDR , BLOCK_CONFIRMATION_THRESHOLD} from '../../../../constants' ;
import CALADEX_ABI from '../../../../constants/abis/caladex.json' ;
import { toFixed } from '../../../../utils/helper';

const useStyles = makeStyles(() => ({
    root : {
        "& .MuiButton-root" :{
            textTransform : "capitalize" ,
        }
    },
    deposit : {
        backgroundColor : "#206bc4 !important"
    },
}));
const Withdraw = (props) => {

    const { open , handleClose , symbol , amount , logo_url , token_id , token_address, decimal , updateWithdrawTokensArray ,
            GetEthBalanceInfo ,
            GetTokenBalanceInfo , 
            SetTokenBalance, walletAddress, web3Provider } = props ;

    // const {  account, library } = useWeb3React();

    const web3Ctx = useContext(Web3Context);

    const [inputAmount , setInputAmount] = useState(0) ;

    const classes = useStyles() ;

    const CaladexContract = new ethers.Contract(CALADEX_ADDR, CALADEX_ABI, web3Provider.getSigner());
    const provider = providers.getDefaultProvider();

    const onWithdraw = async () => {
       if(isNaN( Number(inputAmount) ) || Number(inputAmount) <= 0 || inputAmount === "") {
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

        await updateWithdrawTokensArray(token_id , false) ;

        await handleClose() ;
        
        let resultTx = 0 ;

        if(symbol !== "ETH"){
            let result = await ApproveToken(walletAddress, inputAmount , token_address , symbol )  ;

            if(result === "Ok"){
                try {
                    let accountNonce = await provider.getTransactionCount(walletAddress);
                    accountNonce = '0x' + (accountNonce + 1).toString(16);

                    let txReceipt = await CaladexContract.withdraw(walletAddress , token_address, toFixed(Number(inputAmount) * 10 ** Number(decimal)).toString(), { nonce: accountNonce, gasLimit:70000 });
                    
                    await web3Provider.waitForTransaction(txReceipt.hash, BLOCK_CONFIRMATION_THRESHOLD);
                    var receipt = await provider.getTransactionReceipt(txReceipt.hash);
                    if(receipt.status === true) {
                        resultTx = 1;
                    }
                }
                catch (err) {
                    resultTx = "Withdraw Rejected."
                }
            } else {
                resultTx = 0 ;
            }
        } else {

            let result = await ApproveToken(walletAddress, inputAmount , null , "ETH")  ;
            
            if(result === "Ok") {
                try {
                    let accountNonce = await provider.getTransactionCount(walletAddress);
                    accountNonce = '0x' + (accountNonce + 1).toString(16);

                    let txReceipt = await CaladexContract.withdrawETH(walletAddress , ethers.utils.parseEther(inputAmount).toString(), { nonce : accountNonce , gasLimit : 70000 }) ;
                    
                    await web3Provider.waitForTransaction(txReceipt.hash, BLOCK_CONFIRMATION_THRESHOLD);
                    var receipt = await provider.getTransactionReceipt(txReceipt.hash);
                    if(receipt.status === true) {
                        resultTx = 1;
                    }
                }
                catch (err) {
                    resultTx = "Withdraw Rejected."
                }
            } else {
                resultTx = 0 ;
            }
        }
        
        if(resultTx === 1) await SetTokenBalance(walletAddress , token_id  , false , inputAmount) ;

        if(resultTx === 1) {
            swal({
                title: "SUCCESS",
                text: "Withdraw Successfully.",
                icon: "success",
                timer: 2000,
                button: false
            }) ;
        } else if(resultTx === 0 ) {
            swal({
                title: "Error",
                text: "Withdraw Failed.",
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

        await updateWithdrawTokensArray(token_id , true) ;
        
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
                <DialogTitle>Withdraw</DialogTitle>
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
                          <Button variant={'contained'} className={classes.deposit} onClick={async () => onWithdraw()}>Withdraw</Button>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </div>
    )
}

Withdraw.propsType = {
    
}
const mapStateToProps = state => ({
    walletAddress : state.wallet.walletAddress,
    web3Provider : state.wallet.web3Provider
})
const mapDispatchToProps = {
    SetTokenBalance
}

export default connect(mapStateToProps , mapDispatchToProps)(Withdraw) ;
