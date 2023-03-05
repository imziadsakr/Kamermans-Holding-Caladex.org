


import React, { useEffect } from 'react' ;

import { useState } from 'react' ;

import { connect } from 'react-redux';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

//_____________styles_______________
import {
    Box, 
    CircularProgress, 
    Grid ,
} from '@mui/material' ;

import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    root : {
        backgroundColor : theme.palette.primary.main ,
        display : "flex",
        alignItems : "center" ,

        "& .MuiGrid-item" : {
            display : "flex" ,
            flexDirection : "column" ,
            justifyContent : "center" ,
            alignItems : "flex-end" ,
            paddingLeft: "15px" ,
            paddingRight : "15px",
            paddingTop : "5px" ,
            paddingBottom : "5px" ,
        } ,
        "& .MuiInputBase-root" : {
            color : "white !important" ,
            textAlign : "right" ,
            fontSize : "14px" ,
        },
        "& .MuiSvgIcon-root" :{
            color : "white !important"
        }
    } ,
    label : {
        paddingBottom : "5px" ,
        color : "#8fb5fc" ,
        fontSize : "11px" ,
    } ,
    trade : {
        display : "flex" ,
        alignItems : "center" ,
        justifyContent : "flex-end" ,
        fontSize : "14px" ,
        color : "white" ,
    },
    loading : {
        display : 'flex !important',
        justifyContent : 'center !important',
        alignItems : 'center !important',
        textAlign : 'center !important',

        "& .MuiCircularProgress-svg" : {
            color : 'white !important'
        },
        height : '55.5px !important'
    }
})) ;

//___________component_________________
const CoinBanner = (props) => {

    const { 
        tokenPairList ,
        tokenId ,
        handlePairInfoVisible ,
     } = props ;

    const classes = useStyles() ;

    const [ icon , setIcon ] = useState(0) ;

    const labelList = [
        {
            index : "last" ,
            label : "Last Price"
        } ,
        {
            index : "percentChange" ,
            label : "24h Change"
        },
        {
            index : "low24hr" ,
            label : "24h Low"
        },
        {
            index : "high24hr" ,
            label : "24h High"
        } ,
        {
            index : "volume24hr" ,
            label : "Volume"
        }
    ]

    const handleChangeIcon = () => {
        setIcon(!icon) ;
    }

    const onClickToken = () => {
        handlePairInfoVisible() ;
        handleChangeIcon() ;
    }

    return (
        <Box className={classes.root}>
            <Grid container>
                {
                    tokenId === null && <Grid item xs={12} className={classes.loading}>
                        <CircularProgress size={30}/>
                    </Grid>
                }
                {
                    tokenId !== null &&  <>
                        <Grid item xs={3} >
                            <Box className={classes.trade} sx={{cursor : "pointer"}} onClick={onClickToken}>
                                {
                                    tokenId !== null && tokenPairList.length !== 0 ? <>
                                        { tokenPairList[tokenId].symbol + " / " + tokenPairList[tokenId].pair_type} 
                                        { icon ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                                    </> :<></>
                                }
                            </Box>
                            <Box className={classes.label} sx={{marginRight : "24px"}}>
                                DAI
                            </Box>
                        </Grid>
                        {
                            tokenId !== null && tokenPairList.length !== 0 ? 
                                labelList.map(( item , index ) => {
                                    return (
                                        <Grid item key={index}>
                                            <Box className={classes.label}>
                                                { item.label }
                                            </Box>
                                            <Box className={classes.trade}>
                                                { tokenPairList[tokenId][item.index] }{index === 1 ? '%' : ''}
                                            </Box>
                                        </Grid>
                                    )
                                })
                            : <>
                            </>
                        }
                    </>
                }
                
            </Grid>
        </Box>
    )
}

const mapStateToProps = state => ({
    tokenPairList : state.token.tokenPairList
})

export default connect(mapStateToProps)(CoinBanner) ;