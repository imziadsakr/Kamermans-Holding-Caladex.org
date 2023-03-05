import React, { useEffect , useRef } from 'react' ;

import WalletConnect from '../../../pages/WalletConnect';

import MetamaskImg from '../../../assets/metamask.jpg';

import {
    Box ,
    Button,
    Grid
} from '@mui/material' ;

import { makeStyles } from '@mui/styles';

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
        backgroundColor : "white" ,
        display : "flex" ,
        flexDirection :"column" ,
        justifyContent : "center" ,
        alignItems : "center" ,
        width : '100%' ,
        height : "calc(100vh - 122px)" ,
        ['@media (max-width : 1320px)'] : {
            height: 'calc(150vh - 195px)',
        },
        ['@media (max-width : 1000px)'] : {
            height: 'calc(100vh - 160px)',
        }
    }
}));

const WalletConnectPn = () => {

    const classes = useStyles() ;


    return (
        <Box component={"div"} className={classes.root} >
            <Box component={"div"} sx={{marginBottom : "15px"}}>
                <img src={MetamaskImg} width={70} height={70} />
            </Box>
            <Box comonent={"div"}>
                {/* <Button variant='contained' onClick={connectToWallet}>Connect Wallet</Button> */}
                <WalletConnect />
            </Box>
        </Box>
    )
}

export default WalletConnectPn ;