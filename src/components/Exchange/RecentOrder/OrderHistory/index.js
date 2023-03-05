


import React from 'react' ;

import { useEffect, useContext } from 'react' ;

import { connect } from 'react-redux';
import { GetExchangeOrderList, ClearOrder } from '../../../../redux/actions/order';
import { useWeb3React } from '@web3-react/core';

import Web3Context from '../../../../store/web3-context';

import { formatDBDate } from '../../../../utils/helper' ;

import swal from 'sweetalert' ;

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

import { makeStyles } from '@mui/styles';
import wallet from '../../../../redux/reducers/wallet';

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
        
    },
 
}));

let currentOrderTimer ;

const OrderHistory = (props) => {
    
    const classes = useStyles() ;

    // const { account, active } = useWeb3React() ;
    const web3Ctx = useContext(Web3Context);
    

    const {
        tradeToken ,
        exchangeOrderList , GetExchangeOrderList,
        ClearOrder,
        walletAddress
    } = props ;

    const headFields = [
        "DateTime",
        "Pair" ,
        "Side" ,
        "Price" ,
        "Amount" ,
        "Total",
    ]

    const setCurrentOrderTimer = () => {
        clearInterval(currentOrderTimer) ;

        const currentOrderTimer = setTimeout(async () => {
            // await GetOrderHistory()
        } , 15000) ; 
    }

    const handleClear = async (row) => {
        const isOk = await swal({
            title: "Are you sure?",
            text: "Are you sure you wish to clear order",
            icon: "error",
            buttons: [
              'No, I am not sure!',
              'Yes, I am sure!'
            ],
        });
        if(isOk){
            await GetExchangeOrderList(walletAddress, "2022-01-01" , new Date().toISOString().substring(0,10),  tradeToken._id , tradeToken.pair_type , true) ;
            await ClearOrder(row._id) ; 
            await GetExchangeOrderList(walletAddress, "2022-01-01" , new Date().toISOString().substring(0,10),  tradeToken._id , tradeToken.pair_type , true) ;
        }
    }

    useEffect(async () => {
        if(tradeToken && walletAddress) {
            console.log(tradeToken._id) ;
            console.log(tradeToken.pair_type) ;
            await GetExchangeOrderList(walletAddress , "2022-01-01" , new Date().toISOString().substring(0,10),  tradeToken._id , tradeToken.pair_type , true) ;
            // await GetOrderHistory

            // await setCurrentOrderTimer()
        }
    } , [tradeToken , walletAddress]) ;

    useEffect(() => {
        return () => {
            clearInterval(currentOrderTimer) ;
        }
    } , [])

    return (
        <Box component={"div"} className={classes.root}>
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
                           exchangeOrderList !== "No Available Informations." ? 
                           ( exchangeOrderList.length !== 0 ? exchangeOrderList.map( (row , index) => {
                               return (
                                   <TableRow key={index}>
                                       <TableCell sx={{textAlign : "center !important"}}>{formatDBDate(row.time)}</TableCell>
                                       <TableCell>{row.pair_token}</TableCell>
                                       <TableCell>{row.type}</TableCell>
                                       <TableCell sx={{color : row.type === "sell" ? "#c74a4d" : "#3c868f"}}>
                                           {Number(row.price).toFixed(5)}
                                        </TableCell>
                                       <TableCell>{Number(row.amount).toFixed(5)}</TableCell>
                                       <TableCell>{Number(row.amount*row.price).toFixed(5)}</TableCell>
                                   </TableRow>
                               )
                           }) : <TableRow>
                               <TableCell colSpan={7} >
                                   <CircularProgress size={20}/>
                               </TableCell>    
                           </TableRow> ) : <TableRow>
                               <TableCell colSpan={7} sx={{ textAlign:"center !important"}}>No Available Information</TableCell>
                           </TableRow> 
                       }
                   </TableBody>
               </Table>
           </TableContainer>
        </Box>
    )
}

const mapStateToProps = state => ({
    exchangeOrderList : state.order.exchangeOrderList,
    walletAddress : state.wallet.walletAddress
})

const mapDispatchToProps = {
    GetExchangeOrderList,
    ClearOrder
}

export default connect(mapStateToProps , mapDispatchToProps)(OrderHistory) ;