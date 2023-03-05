
import React from 'react' ;

import { useEffect, useMemo, useState } from 'react';

import { useWeb3React } from "@web3-react/core";
import { ethers } from 'ethers';

import { connect } from 'react-redux' ;

import { PRIVATE_CALADEX_API } from '../../../static/constants' ;

import swal from 'sweetalert' ;

import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector ,
    TimelineContent,
    TimelineDot
} from '@mui/lab' ;

import {
    Dialog ,
    DialogTitle,
    DialogContent ,
    Modal ,
    Box ,
    TextField ,
    Grid,
    Divider ,
    Collapse ,
    Button ,
    InputAdornment ,
    Checkbox
} from '@mui/material' ;

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess' ;
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import RadioButtonUncheckedOutlinedIcon from '@mui/icons-material/RadioButtonUncheckedOutlined';

import { makeStyles } from '@mui/styles';
import { getItem  , formatDBDate} from '../../../utils/helper';

import { AddTokenStakeLog, GetStakeDateTime , RemoveTokenStakeLog} from '../../../redux/actions/stake';
import { GetTokenBalanceInfo } from '../../../redux/actions/token';

const useStyles = makeStyles(() => ({
    stakingDialog : {
        "& span" :{
            color : "#848c93" ,
            fontFamily : "BinancePlex, Arial, sans-serif !important" ,
        } ,
        "& .MuiDialogTitle-root" :{
             textAlign : "center"
         },
         "& .MuiDialogContent-root" : {
             '&::-webkit-scrollbar': {
                 width: '0.7em',
             },
             '&::-webkit-scrollbar-track': {
                 '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
             },
             '&::-webkit-scrollbar-thumb': {
                 backgroundColor: 'lightgray',
                 borderRadius : "5px"
             }
         },
        "& .MuiTimelineItem-root::before" : {
            left : "0px !important" ,
            flex: "none",
            padding:"0px !important" ,
        } ,
        "& .MuiTimelineItem-root" : {
             minHeight : "0px !important"
         } ,
        "& .MuiButton-root" : {
            color : "black" ,
            fontWeight : "bold" ,
            border : "2px solid #c98f06" ,
            textTransform : "capitalize" ,
            minWidth : "90px" ,
            "&:hover" : {
                backgroundColor : "#fef6d8" ,
                border : "2px solid #e1c226" ,
            },
            "&.Mui-expanded" : {
                 backgroundColor : "#fef6d8"
            }
         } ,
         "& .MuiTimelineContent-root" : {
             paddingTop : "0px !important" ,
             marginTop : "0px !important" ,
             height : "45px !important" ,
             fontSize : "14px !important" ,
         } , 
         "& .MuiTimelineDot-root" : {
             margin : "0px !important" ,
             backgroundColor : "#f9b40f" ,
         } ,
         "& .MuiTimelineConnector-root" : {
             backgroundColor : "#54cf9d" ,
             flex : "none" ,
             height : "calc( 100% - 10px)" ,
         },
         "& .MuiTimelineSeparator-root" : {
             width : "30px !important" ,
             display : "flex !important" ,
             flexDirection : "column !important" ,
             justifyContent : "space-between !important" ,
         }
    } ,
    subTitle : {
        marginTop : "15px !important" ,
        fontSize : "14px" ,
        fontWeight : 545
    },
    btnGroup : {
        display : "flex" ,
        justifyContent : "space-around" ,
        marginTop : "10px !important"
    } ,
    item : {
        marginTop : "10px !important" ,
        fontSize : "14px"
    } ,
    dateTime : {
        textAlign : "center !important"
    } ,
    noneDot : {
       marginLeft : "5px !important" ,
       marginRight : "5px !important" ,
       height : "100% !important"
    } ,
    collapse : {
        marginTop : "30px !important"
    },
    stakeBtn : {
        backgroundColor : "#c98f06 !important" ,
        border : "0px !important" ,
        width : "130px" ,
        fontSize : "15px !important" ,
        color : "white !important" ,
        textTransform : "uppercase !important" ,
        boxShadow : "(0px 1px 1px 0px)"
    } 
}));

let tokenStakeInfoTimer ;

const StakingUnStake = (props) => {

    const { 
        stakelog_id ,
        handleClose1,
        open1,
        logo_url ,
        stake_id ,
        symbol ,
        est_apy,
        token_address,
        token_id,
        current_token,
        stake_date ,
        onUnStake,
    } = props ;

    const [isVisibleSummary , setVisibleSummary] = useState(false) ;
    const [endDate , setEndDate] = useState() ;
    const [duration , setDuration] = useState(365) ;
    const [inputAmount , setInputAmount] = useState('') ;
    const [isAgree , setIsAgree] = useState(false) ;

    // const { active , account } = useWeb3React() ;

    const handleSummary = () => {
        setVisibleSummary(!isVisibleSummary) ;
    } ;

    const classes = useStyles() ;

    // useEffect(() => {
    //     let stakeDate = stake_date ;

    //     stakeDate = stakeDate.split(',') ;

    //     let ymd = stakeDate[0].split('/') ;

    //     ymd = ymd[2] + "-" + ymd[1] + "-" + ymd[0] ;

    //     let endDate = new Date( new Date(ymd + stakeDate[1]).getTime() + 24 * 60 * 60 * 1000 * Number(duration) );

    //     endDate = endDate.toLocaleString('en-GB') ;

    //     setEndDate(endDate) ;

    // } , [duration]) ;

  
    return (
        <div className={classes.root}>
            <Dialog
                    open={open1}
                    onClose={handleClose1}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    className={classes.stakingDialog}
            >
                <DialogTitle>{ "Staking" } {symbol}</DialogTitle>
                 <DialogContent>
                    <Grid container>
                    
                                <Grid item xs={12} className={classes.subTitle}>
                                        Amount Limit
                                </Grid>
                                <Grid item xs={12} className={classes.item}>
                                    <Box component={"span"}>
                                        Minimum : 
                                    </Box>
                                    { current_token ? current_token.minimum : ""} {symbol}
                                </Grid>
                                <Grid item xs={12} className={classes.item}>
                                    <Box component={"span"}>
                                        Maximum :
                                    </Box>
                                    { current_token ? current_token.maximum : ""} {symbol}
                                </Grid>
                         
                        <Divider />
                        <Grid item xs={12} className={classes.subTitle}>
                            
                                <Grid item xs={12} className={classes.collapse}>
                                    <Timeline>
                                        <TimelineItem >
                                            <TimelineSeparator>
                                                <TimelineDot />
                                                <TimelineConnector />
                                            </TimelineSeparator>
                                            <TimelineContent>
                                                <Grid container >
                                                    <Grid item xs={6}>
                                                        <Box component={"span"}>
                                                            Stake Date
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={6} className={classes.dateTime}>
                                                        {
                                                            // formatDBDate(current_token.begin_date)
                                                        }
                                                    </Grid>
                                                </Grid>
                                            </TimelineContent>
                                        </TimelineItem>
                                        <TimelineItem >
                                            <TimelineSeparator>
                                                <TimelineDot />
                                                {/* <TimelineConnector /> */}
                                            </TimelineSeparator>
                                            <TimelineContent >
                                                <Grid container >
                                                    <Grid item xs={6}>
                                                        <Box component={"span"}>
                                                            End Date
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={6} className={classes.dateTime}>
                                                        {
                                                            // formatDBDate(current_token.finish_date)
                                                        }
                                                    </Grid>
                                                </Grid>
                                            </TimelineContent>
                                        </TimelineItem>
                                      
                                    </Timeline>
                                </Grid>
                        </Grid>
                        <Divider />
                        <Grid item xs={12} className={classes.item} style={{display : "flex" , justifyContent:"space-between"}}>
                            <Box component={"span"}>
                                Est.APY
                            </Box>
                            {est_apy} %
                        </Grid>
                        <Grid item xs={12} className={classes.item} style={{display : "flex" , justifyContent:"space-between"}}>
                            <Box component={"span"}>
                                Estimated Interests <InfoIcon fontSize='20px'/>
                            </Box>
                            <Box component={"span"} style={{color : "#54cf9d" , fontWeight : "bold"}}>
                                {/* { Number(current_token.amount)  * est_apy * current_token.duration / 365 / 100} {symbol} */}
                            </Box>
                        </Grid>
                        
                    </Grid>
                </DialogContent>
            </Dialog>
        </div>
    )
}

const mapStateToProps = state => ({

})
const mapDispatchToProps = {
    AddTokenStakeLog ,
    GetStakeDateTime ,
    GetTokenBalanceInfo
}

export default connect(mapStateToProps , mapDispatchToProps)(StakingUnStake) ;