import React from 'react' ;

import { useEffect, useState, useContext } from 'react' ;

import { connect} from 'react-redux';

import Web3Context from '../../../../store/web3-context';

import { useWeb3React } from '@web3-react/core';

import { PRIVATE_CALADEX_API, PUBULIC_EXCHANGE_RATE_API } from '../../../../static/constants';
import {
    Box,
    TableContainer,
    Table ,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    CircularProgress
} from '@mui/material' ;

import {makeStyles} from '@mui/styles' ;
import axios from 'axios';
import trade from '../../../../redux/reducers/trade';

const useStyles = makeStyles(() => ({
    root : {
        overflow : "hidden" ,
        overflowY : "scroll" ,
        maxHeight : "calc(50vh - 145px)" ,
        height : "calc(50vh - 145px)" ,

        "& .MuiTableCell-root" :{
            padding : "0px !important",
            textAlign : "center",
            fontSize : "11px" ,
            fontWeight : "bold"
        }
    }
}))
const Funds = (props) => {

    const classes = useStyles() ;

    // const { account, active } = useWeb3React() ;
    const web3Ctx = useContext(Web3Context);

    const {
        tradeToken,
        walletAddress
    } = props ;

    const [token , setToken] = useState(null) ;
    const [pair, setPair] = useState(null) ;
    const [tokenRate, setTokenRate] = useState(0) ;
    const [pairRate, setPairRate] = useState(0) ;

    const headFields = [
        "Token" ,
        "Total" ,
        "Available" ,
        "In Order",
        "USD value"
    ] ;

    useEffect(async () => {

        if(tradeToken && walletAddress) {
            let resToken = await axios.post(`${PRIVATE_CALADEX_API}balance/get` , {
                token_id : tradeToken._id,
                address : walletAddress
            }) ;

            let resId = await axios.post(`${PRIVATE_CALADEX_API}token/getbysymbol` , {
                symbol : tradeToken.pair_type
            }) ;

            console.log(resId);

            let resPair = await axios.post(`${PRIVATE_CALADEX_API}balance/get` , {
                token_id : resId.data.data.data._id,
                address : walletAddress
            })

            
            let resPairRate = await axios.get(`${PUBULIC_EXCHANGE_RATE_API}${tradeToken.pair_type}`) ;

            let resTokenRate;
            if(tradeToken.symbol === "CAX") {
                resTokenRate = await axios.post(`${PRIVATE_CALADEX_API}tokenInfo/getOne`,{
                    token_id : tradeToken._id ,
                    pair_token : tradeToken.pair_type
                }) ;
                resTokenRate = resTokenRate.data.data.data[0].price * resPairRate.data.data.rates.USD;
            } else {
                resTokenRate = await axios.get(`${PUBULIC_EXCHANGE_RATE_API}${tradeToken.symbol}`) ;
                resTokenRate = resTokenRate.data.data.rates.USD;
            }

            setTokenRate(resTokenRate) ;
            setPairRate(resPairRate.data.data.rates.USD) ;

            if(resToken.data.data.data.length === 0) {
                setToken({
                    caladex_balance : 0,
                    order_balance : 0
                })
            } else {
                setToken(resToken.data.data.data[0]) ;
            }
            
            if(resPair.data.data.data.length === 0) {
                setPair({
                    caladex_balance : 0,
                    order_balance : 0
                })
            } else {
                setPair(resPair.data.data.data[0]) ;
            }
            console.log("_____________ " , resToken.data.data.data) ;
            console.log('***************' , resPair.data.data.data) ;
        }        
    }, [tradeToken]) ;

    return (
        <Box className={classes.root}>
             <TableContainer>
               <Table>
                   <TableHead>
                       <TableRow>
                            {
                                headFields.map((item , index) => {
                                    return (
                                        <TableCell key={index}>
                                            { item }
                                        </TableCell>
                                    )
                                })
                            }
                       </TableRow>
                   </TableHead>
                   <TableBody>
                       {

                            token &&   <TableRow>
                                    <TableCell>{tradeToken.symbol}</TableCell>
                                    <TableCell>{Number( token.caladex_balance ) + Number(token.order_balance)}</TableCell>
                                    <TableCell>{Number( token.caladex_balance )}</TableCell>
                                    <TableCell>{Number( token.order_balance )}</TableCell>
                                    <TableCell>{(Number( token.caladex_balance ) + Number(token.order_balance)) * tokenRate}</TableCell>
                           </TableRow>
                       }

                        {

                            pair &&   <TableRow>
                                    <TableCell>{tradeToken.pair_type}</TableCell>
                                    <TableCell>{Number( pair.caladex_balance ) + Number(pair.order_balance)}</TableCell>
                                    <TableCell>{Number( pair.caladex_balance )}</TableCell>
                                    <TableCell>{Number( pair.order_balance )}</TableCell>
                                    <TableCell>{(Number( pair.caladex_balance ) + Number(pair.order_balance)) * pairRate}</TableCell>
                            </TableRow>
                        }
                   </TableBody>
               </Table>
           </TableContainer>
        </Box>
    )
}

const mapStateToProps = state => ({
    walletAddress : state.wallet.walletAddress
})
const mapDispatchToProps = {

}
export default connect(mapStateToProps, mapDispatchToProps)(Funds) ;