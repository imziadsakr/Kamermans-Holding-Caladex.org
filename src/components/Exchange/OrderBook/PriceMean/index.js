


import React, { useEffect } from 'react' ;

import { connect } from 'react-redux';

import {
    Box
} from '@mui/material' ;


import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    root : {
        display : "flex" ,
        justifyContent : "center" ,
        alignItems : "center" ,
        height : "33px" ,
        fontSize : "14px" ,
        fontWeight : "bold" ,
        color : props => `${props.color}`
    }
}));

const PriceMean = (props) => {
    
    const classes = useStyles({color :  "#c74a4d"}) ;
    const {
        tokenPairList,tokenId,
        priceType
    } = props;

    useEffect(() => {
        console.log("*****",priceType) 
    } , [priceType]);
    return (
         <Box component={"div"} className={classes.root}>
            { tokenPairList[tokenId] && ( priceType === null ? tokenPairList[tokenId].price : ( priceType === true ? tokenPairList[tokenId].market_sell_price : tokenPairList[tokenId].market_buy_price ) )} 
            { tokenPairList[tokenId] ? tokenPairList[tokenId].pair_type : ""}
        </Box>
    )
}
const mapStateToProps = state => ({
    tokenPairList : state.token.tokenPairList
})

export default connect(mapStateToProps)(PriceMean) ;