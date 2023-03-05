


import React from 'react' ;
import {connect} from 'react-redux';
import { useNavigate } from 'react-router-dom' ;
import { useWeb3React } from '@web3-react/core' ;

import GridViewIcon from '@mui/icons-material/GridView';

import swal from 'sweetalert' ;
import clsx from 'clsx';

import {
    Box,
    Grid ,
    Stack
} from '@mui/material' ;

import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
    root : {
        height : "30px" ,
        display : "flex" ,
        alignItems : "flex-end" ,
        paddingLeft : "30px",
        paddingRight : "30px",
        borderBottom : "1px solid gray"
    },
    tab : {
        paddingLeft : "10px" ,
        paddingRight :"10px" ,
        fontWeight : "bold" ,
        cursor : "grab"
    },
    active : {
        borderBottom : "1px solid blue"
    } ,
    stack : {
        width : "100%"
    }
}));

const RecentSelectBox = (props) => {
    
    // const { active } = useWeb3React() ;

    const classes = useStyles() ;

    const {
        historyIndex,
        handleHistoryIndex,
        walletAddress
    } = props ;

    const navigate = useNavigate() ;

    const goToMoreOrder = () => {
        if(!walletAddress){
            swal({
                title : "Warning" ,
                text : "You have to connect to metamask." ,
                icon : "warning" ,
                timer : 2000 ,
                button : false
            })
        } else navigate("/orders") ;
    }

    return (
        <Box component={"div"} className={classes.root}>
            <Stack flexDirection={"row"}  className={classes.stack}>
                <Box className={ clsx(classes.tab , historyIndex === 0 && classes.active) } onClick={() => handleHistoryIndex(0)}>
                    Open Order
                </Box>
                <Box  className={ clsx(classes.tab , historyIndex === 1 && classes.active) } onClick={() => handleHistoryIndex(1)}>
                    Order History
                </Box>
                <Box className={ clsx(classes.tab , historyIndex === 2 && classes.active) } onClick={() => handleHistoryIndex(2)}>
                    Funds
                </Box>
                {/* <Box component={"div"} onClick={() => goToMoreOrder()}>
                    <GridViewIcon /> More
                </Box> */}
            </Stack>
        </Box>
    )
}


const mapStateToProps = state => ({
    walletAddress : state.wallet.walletAddress
})
const mapDispatchToProps = {

}
export default connect(mapStateToProps, mapDispatchToProps)(RecentSelectBox) ;