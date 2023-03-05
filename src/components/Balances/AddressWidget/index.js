

import React, { useEffect, useRef , useState, useContext } from 'react' ;

import { connect } from 'react-redux' ;

import { useWeb3React } from "@web3-react/core";

import styled from '@emotion/styled';

import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { 
    Card ,
    CardContent,
    Grid ,
    FormLabel ,
    useMediaQuery ,
    Button ,
    Box
} from '@mui/material';

import {
    MDBContainer ,
    MDBInputGroup,
} from "mdbreact";

import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

import { makeStyles } from '@mui/styles';

import Web3Context from '../../../store/web3-context';

import Web3 from 'web3' ;

const web3 = new Web3('https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161') ;

const BootstrapTooltip = styled( ({ className, ...props }) => (

    <Tooltip {...props} arrow classes={{ popper: className }} />
    ) ) ( ({ theme }) => ({
        [`& .${tooltipClasses.arrow}`]: {
        color: theme.palette.common.black,
        },
        [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.black,
        },
    }));

const useStyles = makeStyles((theme) => ({
    root : {
        "& .MuiPaper-root" : {
            border : "1px solid lightgray" ,
        } ,
        "& .MuiGrid-root" :{
            textAlign : "center"
        },
        "& input" : {
            fontSize : "14px"
        } ,
    },
    sendBtn : {
        backgroundColor : "#206bc4 !important" ,
    },
    receiveBtn : {
        backgroundColor : "#f76707 !important"
    },
    toolTip : {
        color : "white" ,
        position : "absolute",
        right : "0px" ,
        padding : "5px" ,
        opacity : "0"
    },
}));


const AddressWidget = (props) => {

    // const { active, account, chainId, library, activate  , deactivate} = useWeb3React();
    const web3Ctx  = useContext(Web3Context);
    const {walletAddress}  = props;

    const classes = useStyles() ;
    const addressCtrl = useRef(null) ;
    const [isCopied , setIsCopied] = useState(false) ;

    const isXs = useMediaQuery("(min-width : 645px)") ;

    useEffect(() =>{
        if(walletAddress) {
            if(addressCtrl) {
                addressCtrl.current.value = walletAddress ;
            }
        }
    } , [walletAddress]) ;

    const emitCopyEvent = () => {
        // addressCtrl.current.focus() ;
        setIsCopied(true) ;
        addressCtrl.current.select() ;
        document.execCommand("copy");
    }
    return (
        <div className={classes.root}>
            <Card>
                <CardContent>
                    <Grid container>
                        <Grid item xs={1}>
                            <FormLabel>
                                <AccountCircleOutlinedIcon />
                            </FormLabel>
                        </Grid>
                        <Grid item xs={isXs ? 10 : 11} >
                            <MDBContainer>
                                <MDBInputGroup
                                    containerClassName="mb-3"
                                    append={
                                        <BootstrapTooltip title={isCopied ? "Copied" : "Copy"} placement="right" >
                                            <Box component={"span"} className='input-group-text' onClick={() => emitCopyEvent()} onMouseLeave={() => setIsCopied(false)}>
                                                <ContentCopyIcon fontSize={"small"}  />
                                            </Box>
                                        </BootstrapTooltip>
                                    }
                                    inputs={
                                        <Box component={"input"} type="text" className="form-control"  id="address" ref={addressCtrl} readOnly/>
                                    }
                                />
                            </MDBContainer>
                        </Grid>
                        {/* <Grid item xs={isXs ? 4 : 12} >
                            <Grid container>
                                <Grid item xs={6}>
                                    <Button variant="contained" className={classes.sendBtn}>Send</Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button variant="contained" className={classes.receiveBtn}>Receive</Button>
                                </Grid>
                            </Grid>
                        </Grid> */}
                        {/* <Grid item xs={1} className={classes.btnContainer}>
                        </Grid> */}
                        <Grid item xs={1}>

                        </Grid>
                        {/* <Grid item sm={isXs ? 3 : 9.5} xs={9.5} className={classes.btnContainer} style={{textAlign : isXs ? "" : "right"}}>
                            <Button variant="contained" className={classes.sendBtn}>Send</Button>
                        
                            <Button variant="contained" className={classes.receiveBtn}>Receive</Button>
                        </Grid> */}
                    </Grid>

                    {/* <Grid container style={{marginTop : isXs ? "0px" : "15px"}}>
                        <Grid item xs={1}>

                        </Grid>
                        <Grid item xs={6} style={{textAlign : "left"}}>
                            <MDBContainer>
                                <span className="text-muted" style={{fontSize:"0.83333rem" , fontWeight:"bold"}}>
                                    Estimated Value
                                </span>
                            </MDBContainer>
                        </Grid>
                        <Grid item xs={5}>

                        </Grid>
                    </Grid> */}
                </CardContent>
            </Card>
        </div>
    )
}
const mapStateToProps = state => ({
    walletAddress : state.wallet.walletAddress
});
const mapDispatchToProps = {
}
 
export default connect(mapStateToProps , mapDispatchToProps)(AddressWidget) ;