

import React, { useEffect } from 'react' ;

import { useState  }  from 'react' ;

import { connect } from 'react-redux';

import {
    Box ,
    TableContainer ,
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableRow
} from '@mui/material' ;

import { makeStyles } from '@mui/styles';

import { GetTradingViewData } from '../../../../redux/actions/tradingview';

const useStyles = makeStyles(() => ({
    root : {
        '&::-webkit-scrollbar': {
            width: '8px',
            backgroundColor : "lightgray",
            borderRadius : "5px"
        },
        '&::-webkit-scrollbar-track': {
            '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'gray',
            borderRadius : "5px"
        },

        overflow : "hidden" ,
        overflowY : "scroll" ,
        boxSizing : "border-box" ,

        height : "calc(100vh - 192px)" ,
        
        ['@media (max-width : 1320px)'] : {
            height: 'calc(150vh - 265px)',
        },
        ['@media (max-width : 1000px)'] : {
            height: 'calc(100vh - 230px)',
        },

        "& .MuiTableCell-root" :{
            padding : "0px !important",
            textAlign : "center",
            fontSize : "11px" ,
            fontWeight : "bold" ,
            textAlign : "right" ,
            cursor : "pointer"
        }
    }
}));

const TokenInfoList = (props) => {

    const classes = useStyles() ;

    const {
        tokenPairList ,
        handleChangeTokenId , handleChangeToken , handlePairInfoVisible,
        GetTradingViewData
    } = props ;

    const headFields = [
        "Pair" ,
        "Price" ,
        "Volume" ,
        "24H"
    ];

    const onSelectToken = (index , item) => {
        handleChangeToken(item) ;
        handleChangeTokenId(index) ;
        handlePairInfoVisible() ;
        GetTradingViewData(item._id, item.pair_type);
        return ;
    }

    return (
        <Box component={"div"} className={classes.root} >
            <TableContainer sx={{paddingRight:"5px"}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {
                                headFields.map((field, index) => {
                                    return (
                                        <TableCell key={index}>{ field }</TableCell>
                                    )
                                })
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            tokenPairList.length !== 0 ? tokenPairList.map((item , index) => {
                                return (
                                    <TableRow key={index} onClick={() => onSelectToken(index , item)}>
                                        <TableCell>{item.symbol} / {item.pair_type}</TableCell>
                                        <TableCell sx={{color : Number(item.percentChange) <= 0 ? "#c74a4d" : "#3c868f"}} >{Number(item.price).toFixed(5)}</TableCell>
                                        <TableCell>{Number(item.volume24hr).toFixed(0)}</TableCell>
                                        <TableCell sx={{color : Number(item.percentChange) <= 0 ? "#c74a4d" : "#3c868f"}} >{item.percentChange}%</TableCell>
                                    </TableRow>
                                )
                            }) : <>
                            </>
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}


const mapStateToProps = state => ({
    tokenPairList : state.token.tokenPairList
})

const mapDispatchToProps = {
    GetTradingViewData
}

export default connect(mapStateToProps, mapDispatchToProps)(TokenInfoList) ;