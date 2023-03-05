

import React, { useEffect } from 'react' ;

import { useState, useContext  } from 'react' ;
import { useWeb3React } from '@web3-react/core';
import { connect } from 'react-redux';

import Web3Context from '../../../store/web3-context.js';

import { makeStyles } from '@mui/styles';

import {
    Button, CircularProgress ,
    Paper ,
    TableContainer ,
    Table ,
    TableHead,
    TableBody ,
    TableRow ,
    TableCell,
    TablePagination,
} from '@mui/material' ;
import swal from 'sweetalert' ;

import StakingDialog from '../StakingDialog/index.js';
import StakingUnStake from '../StakingUnStake/index.js';

import axios from 'axios' ;
import { PRIVATE_CALADEX_API , PUBULIC_EXCHANGE_RATE_API } from '../../../static/constants.js';
import { RemoveTokenStakeLog , GetStakeDateTime , GetStakingInfo } from '../../../redux/actions/stake.js';
import { GetTokenBalanceInfo } from '../../../redux/actions/token.js';
import { getItem, setItem } from '../../../utils/helper.js';

const useStyles = makeStyles((theme) => ({
    root : {
        
        marginTop : theme.spacing(4) + " !important" ,
        "& button" : {
            color : "white" ,
            width : "130px" ,
            fontWeight : "bold"
        },
        "& .MuiTableHead-root" : {
            backgroundColor : "#f2f2f2 !important" ,
            "& .MuiTableCell-root" : {
                backgroundColor : "#f2f2f2 !important" ,
                fontSize : "0.625rem" ,
                color : "black",
                fontWeight : "bold" ,
                textAlign : "center"
            }
        },
        "& .MuiTableBody-root" : {
            "& .MuiTableRow-root:nth-child(even)" : {
                backgroundColor : "#f2f2f2 !important"
            },
            "& .MuiTableCell-root" : {
                textAlign : "center"
            }
        },
        "& .MuiTablePagination-root" : {
            "& .MuiTablePagination-selectLabel" : {
                margin : "0px !important" ,
                fontWeight : "bold"
            },
            "& .MuiTablePagination-displayedRows" : {
                margin : "0px !important" ,
                fontWeight : "bold"
            }
        } ,
    },
    actionBtn : {
        backgroundColor : "#f59f00 !important"
    } ,
})) ;

const StakingInfoList = (props) => {

    const { tokenStakeInfoList , GetTokenStakeInfoList , coinType, walletAddress  } = props ;
    const web3Ctx = useContext(Web3Context);
    // const {active , account , library } = useWeb3React() ;

    const classes = useStyles() ;

    const [open, setOpen] = useState(false);
    const [open1 , setOpen1] = useState(false) ;

    const [isStaking , setIsStaking] = useState(false) ;
    const [whichButton, setWhichButton] = useState(1) ;
    const [symbol , setSymbol] = useState('') ;
    const [logo_url , setLogoUrl] = useState('') ;
    const [est_apy , setEstApy] = useState('') ;
    const [stake_id , setStakeId] = useState(0) ;
    const [token_id , setTokenId] = useState(null) ;
    const [token_address , setTokenAddress] = useState(null) ;
    const [current_token , setCurrentToken] = useState(null) ;
    const [isLoadedPage , setIsLoadedPage] = useState(false) ;
    const [stake_date , setStakeDate] = useState(null) ;
    const [stakelog_id , setStakeLogId ] = useState(null) ;
    const [estUSDAmount , setEstUSDAmount] = useState(null) ;
    const [estTokenAmount , setEstTokenAmount] = useState(null) ;
    const [tokenInfo , setTokenInfo] = useState(null) ;
 
    const [loading_tokens_array , setLoaingTokensArray] = useState({}) ;
    
    const [balance , setTokenBalance] = useState(0) ;

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };


    const handleOpen1 = () => setOpen1(true) ;
    const handleClose1 = () => setOpen1(false) ;
    
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const updateLoadingStakeArray = async (token_id , value) => {

        let tmp = JSON.parse(getItem('stakeArray')) ;

        tmp[token_id] = value ;

        await setItem('stakeArray' , JSON.stringify(tmp)) ;

    }

    const onViewStakingInfo = async ( logo_url , symbol , _id , est_apy , token_address , token_id , balance  ,stakelog_id  , whichButton=1) => {

        let stake_date = await GetStakeDateTime() ;

        let stakeInfo = await GetStakingInfo( stakelog_id.stakelog_id ) ;

        let stakeDate = stake_date ;

        stakeDate = stakeDate.split(',') ;

        let ymd = stakeDate[0].split('/') ;

        ymd = ymd[2] + "-" + ymd[1] + "-" + ymd[0] ;

        let tmpDuration =  ( new Date(ymd + stakeDate[1]).getTime() - new Date( stakeInfo.begin_date ).getTime() ) ;

        tmpDuration = tmpDuration / 24 / 60 / 60 / 1000 ;

        let exchangeRate ;

        await axios.get(`${PUBULIC_EXCHANGE_RATE_API}${stakelog_id.token_id.symbol}`)
        .then(res => {
            exchangeRate = res.data.data.rates.USD ;
        })
        .catch(err => {
            exchangeRate = 0 ;
        })

        let EstUSDAmount = Number(( Number(stakeInfo.amount) * stakelog_id.est_apy * Number(tmpDuration) / 365 / 100 ).toFixed(10) * exchangeRate).toFixed(10) ;
        let EstTokenAmount = ( Number(stakeInfo.amount) * stakelog_id.est_apy * Number(tmpDuration) / 365 / 100 ).toFixed(10) ;

        setEstUSDAmount(EstUSDAmount) ;
        setEstTokenAmount(EstTokenAmount) ;
        setStakeDate(stake_date) ;
        setLogoUrl(logo_url) ;
        setSymbol(symbol) ;
        setStakeId(_id) ;
        setTokenId(token_id) ;
        setEstApy(est_apy) ;
        setTokenAddress(token_address) ;
        setTokenBalance(balance) ;
        setCurrentToken(stakeInfo) ;
        setTokenInfo(stakelog_id) ;
        setIsStaking(true) ;
        setWhichButton(whichButton) ;
        
        handleOpen() ;

    }

    const onStake = async (logo_url , symbol , _id , est_apy , token_address , token_id , balance , token_info ) => {

        let stake_date = await GetStakeDateTime() ;

        setStakeDate(stake_date) ;
        setLogoUrl(logo_url) ;
        setSymbol(symbol) ;
        setStakeId(_id) ;
        setTokenId(token_id) ;
        setEstApy(est_apy) ;
        setTokenAddress(token_address) ;
        setTokenBalance(balance) ;
        setCurrentToken(token_info) ;
        setIsStaking(false) ;
        setWhichButton(1);

        if( !walletAddress ){
            swal({
                title: "Warning",
                text: "Please connect to your Metamask.",
                icon: "warning",
                timer: 2000,
                button: false
            }) ;
        } else {
            handleOpen() ;
        }
    }

    const onUnStake = async (address , stakelog_id ,  token_id  , token_info) => {

        // setStakeDate(stake_date) ;
        setCurrentToken(token_info) ;
        setTokenId(token_id);

        let stake_date = await GetStakeDateTime() ;

        let stakeDate = stake_date ;

        stakeDate = stakeDate.split(',') ;

        let ymd = stakeDate[0].split('/') ;

        ymd = ymd[2] + "-" + ymd[1] + "-" + ymd[0] ;

        let stakeInfo = await GetStakingInfo( token_info.stakelog_id ) ;
    
        let tmpDuration =  ( new Date(ymd + stakeDate[1]).getTime() - new Date( stakeInfo.begin_date ).getTime() ) ;

        tmpDuration = tmpDuration / 24 / 60 / 60 / 1000 ;

        let exchangeRate ;

        await axios.get(`${PUBULIC_EXCHANGE_RATE_API}${token_info.token_id.symbol}`)
        .then(res => {
            exchangeRate = res.data.data.rates.USD ;
        })
        .catch(err => {
            exchangeRate = 0 ;
        })

        let EstTokenAmount = ( Number(stakeInfo.amount) * token_info.est_apy * Number(tmpDuration) / 365 / 100 ).toFixed(10) ;
        let EstUSDAmount = Number(( Number(stakeInfo.amount) * token_info.est_apy * Number(tmpDuration) / 365 / 100 ).toFixed(10) * exchangeRate).toFixed(10) ;
        
        const isOk = await swal({
            title: "Are you sure?",
            text: "Are you sure you wish to unstake? \n You will forfeit all interest. \n" +  EstTokenAmount  + " " + token_info.token_id.symbol + " / " +  EstUSDAmount + " USD",
            icon: "warning",
            buttons: [
              'No, I am not sure!',
              'Yes, I am sure!'
            ],
        }) ;
        // console.log(isOk) ;
        if(isOk){

            await updateLoadingStakeArray(token_id , false) ;

            // setLoaingTokensArray(JSON.parse(getItem('stakeArray'))) ;
            await GetTokenStakeInfoList(walletAddress , "get" , "" ) ;
        
            let result = await RemoveTokenStakeLog(address , token_info.stakelog_id) ;

            await updateLoadingStakeArray(token_id , true) ;

            // await setLoaingTokensArray(JSON.parse(getItem('stakeArray'))) ;
            await GetTokenStakeInfoList(walletAddress , "get" , "") ;

            if(result === "Ok"){

                swal({
                    title: "Success",
                    text: "UnStake Successfully.",
                    icon: "success",
                    timer: 2000,
                    button: false
                }) ;
            } else {
                swal({
                    title: "Error",
                    text: "Unstake Failed.",
                    icon: "error",
                    timer: 2000,
                    button: false
                }) ;
            }

            await  GetTokenBalanceInfo(walletAddress, "") ;
        }
    }

    useEffect(async () => {

        if(isLoadedPage) {
            if(getItem('pageIndex') === "4") {
                await setLoaingTokensArray(JSON.parse(getItem('stakeArray'))) ;
            }
            await GetTokenStakeInfoList(walletAddress , "get" , "") ;
            await GetTokenBalanceInfo(walletAddress  , "") ;
        }
    } , [getItem('stakeArray')]) ;
    
    useEffect(async () => {

        if(walletAddress && tokenStakeInfoList.length !== 0) {

            if(!getItem('stakeArray')){
                // console.log("first") ;

                let tmp = {} ;

                await tokenStakeInfoList.map(element => {
                    tmp[element.token_id._id] = true ;
                }) ;

                await setItem('stakeArray' , JSON.stringify(tmp)) ;

                await setLoaingTokensArray(tmp) ;
            
            } else {
                await setLoaingTokensArray(JSON.parse(getItem('stakeArray'))) ;
            }
            
            setIsLoadedPage(true) ;
        }
    } , [tokenStakeInfoList]) ;

    useEffect(async () => {

        if(!getItem('pageIndex')) {
            setItem('pageIndex' , '4') ;
            return ;
        }

        if(walletAddress && getItem('pageIndex') === "4") {
            await GetTokenStakeInfoList(walletAddress , "get" , "") ;
            await GetTokenBalanceInfo(walletAddress , "" ) ;
        }
    } , [getItem('pageIndex') , walletAddress]) ;

    return (
        <div className={classes.root}>
     
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell style={{textAlign:"left"}}>COIN</TableCell>
                                <TableCell>PRODUCT</TableCell>
                                <TableCell>EST.APY</TableCell>
                                <TableCell>DURATION</TableCell>
                                <TableCell>STATE</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {
                            tokenStakeInfoList !== "No Available Information." ? (   (tokenStakeInfoList.length !== 0 && Object.keys(loading_tokens_array).length !== 0)   ? tokenStakeInfoList.map((element, index) => {
                                switch(coinType){
                                    case 1:
                                        if(element.is_popular_coin){
                                            return (
                                                <TableRow key={index}>
                                                    <TableCell style={{textAlign:"left"}}>
                                                        <img src={`${PRIVATE_CALADEX_API}files/${element.token_id.logo_url}`} alt="no image." width="30px" height="25px"/>
                                                        &nbsp;&nbsp;
                                                        {element.token_id.symbol}
                                                    </TableCell>
                                                    <TableCell className={element.is_stake ? "text-danger" : ""}>
                                                        {/* {element.product} */}
                                                        {element.is_stake ? "staking" : element.product}
                                                    </TableCell>
                                                    <TableCell className={element.Est === "--" ? "text-primary" : "text-success"}>
                                                        {element.est_apy} %
                                                    </TableCell>
                                                    <TableCell>
                                                        { element.duration === "--" ? "--" : Number(element.duration).toFixed(0) + " days"}
                                                    </TableCell>
                                                    <TableCell>
                                                        {
                                                           !element.is_stake ? <Button variant='contained' className={classes.actionBtn} onClick={() => onStake(element.token_id.logo_url , element.token_id.symbol , element._id , element.est_apy , element.token_id.address,  element.token_id._id ,element.balance , element )} disabled={loading_tokens_array[element.token_id._id] === true ? false : true}>
                                                                {  loading_tokens_array[element.token_id._id] === true ? "Stake" : <><CircularProgress size={20} style={{color : "white"}}/>...Stake</> }
                                                            </Button>
                                                            : <>
                                                                <Button variant='contained' className={classes.actionBtn} onClick={() => onViewStakingInfo(element.token_id.logo_url , element.token_id.symbol , element._id , element.est_apy , element.token_id.address,  element.token_id._id ,element.balance , element ) } >
                                                                    Staked
                                                                </Button>
                                                                &nbsp;&nbsp;
                                                                {/* <Button variant='contained' className={classes.actionBtn} onClick={() => onUnStake(account , element.stakelog_id , element.token_id._id , element)} disabled={loading_tokens_array[element.token_id._id] === true ? false : true}>
                                                                    {  loading_tokens_array[element.token_id._id] === true ? "UnStake" : <><CircularProgress size={20} style={{color : "white"}}/>...UnStake</> }
                                                                </Button> */}
                                                                <Button variant='contained' className={classes.actionBtn} onClick={() => onViewStakingInfo(element.token_id.logo_url , element.token_id.symbol , element._id , element.est_apy , element.token_id.address,  element.token_id._id ,element.balance , element , 2)} disabled={loading_tokens_array[element.token_id._id] === true ? false : true}>
                                                                    {  loading_tokens_array[element.token_id._id] === true ? "UnStake" : <><CircularProgress size={20} style={{color : "white"}}/>...UnStake</> }
                                                                </Button>
                                                            </>
                                                        }
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        }
                                        break ;
                                    case 2 :
                                        if(element.is_best_for_beginners){
                                            return (
                                                <TableRow key={index}>
                                                    <TableCell style={{textAlign:"left"}}>
                                                        <img src={`${PRIVATE_CALADEX_API}files/${element.token_id.logo_url}`} alt="no image." width="30px" height="25px"/>
                                                        &nbsp;&nbsp;
                                                        {element.token_id.symbol}
                                                    </TableCell>
                                                    <TableCell className={element.is_stake ? "text-danger" : ""}>
                                                        {/* {element.product} */}
                                                        {element.is_stake ? "staking" : element.product}
                                                    </TableCell>
                                                    <TableCell className={element.Est === "--" ? "text-primary" : "text-success"}>
                                                        {element.est_apy} %
                                                    </TableCell>
                                                    <TableCell>
                                                        { element.duration === "--" ? "--" : Number(element.duration).toFixed(0) + " days"}
                                                    </TableCell>
                                                    <TableCell>
                                                    {
                                                        !element.is_stake ? <Button variant='contained' className={classes.actionBtn} onClick={() => onStake(element.token_id.logo_url , element.token_id.symbol , element._id , element.est_apy , element.token_id.address,  element.token_id._id ,element.balance , element )} disabled={loading_tokens_array[element.token_id._id] === true ? false : true}>
                                                            {  loading_tokens_array[element.token_id._id] === true ? "Stake" : <><CircularProgress size={20} style={{color : "white"}}/>...Stake</> }
                                                        </Button>
                                                        : <>
                                                            <Button variant='contained' className={classes.actionBtn} onClick={() => onViewStakingInfo(element.token_id.logo_url , element.token_id.symbol , element._id , element.est_apy , element.token_id.address,  element.token_id._id ,element.balance , element ) } >
                                                                Staked
                                                            </Button>
                                                            &nbsp;&nbsp;
                                                            <Button variant='contained' className={classes.actionBtn} onClick={() => onUnStake(walletAddress , element.stakelog_id , element.token_id.address, element)} disabled={loading_tokens_array[element.token_id._id] === true ? false : true}>
                                                                {  loading_tokens_array[element.token_id._id] === true ? "UnStake" : <><CircularProgress size={20} style={{color : "white"}}/>...UnStake</> }
                                                            </Button>
                                                        </>
                                                    }
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        }
                                        break ;
                                    case 3 :
                                        if(element.is_new_listing){
                                            return (
                                                <TableRow key={index}>
                                                    <TableCell style={{textAlign:"left"}}>
                                                        <img src={`${PRIVATE_CALADEX_API}files/${element.token_id.logo_url}`} alt="no image." width="30px" height="25px"/>
                                                        &nbsp;&nbsp;
                                                        {element.token_id.symbol}
                                                    </TableCell>
                                                    <TableCell className={element.is_stake ? "text-danger" : ""}>
                                                        {/* {element.product} */}
                                                        {element.is_stake ? "staking" : element.product}
                                                    </TableCell>
                                                    <TableCell className={element.Est === "--" ? "text-primary" : "text-success"}>
                                                        {element.est_apy} %
                                                    </TableCell>
                                                    <TableCell>
                                                       { element.duration === "--" ? "--" : Number(element.duration).toFixed(0) + " days"}
                                                    </TableCell>
                                                    <TableCell>
                                                    {
                                                        !element.is_stake ? <Button variant='contained' className={classes.actionBtn} onClick={() => onStake(element.token_id.logo_url , element.token_id.symbol , element._id , element.est_apy , element.token_id.address,  element.token_id._id ,element.balance , element )} disabled={loading_tokens_array[element.token_id._id] === true ? false : true}>
                                                            {  loading_tokens_array[element.token_id._id] === true ? "Stake" : <><CircularProgress size={20} style={{color : "white"}}/>...Stake</> }
                                                        </Button>
                                                        : <>
                                                            <Button variant='contained' className={classes.actionBtn} onClick={() => onViewStakingInfo(element.token_id.logo_url , element.token_id.symbol , element._id , element.est_apy , element.token_id.address,  element.token_id._id ,element.balance , element ) } >
                                                                Staked
                                                            </Button>
                                                            &nbsp;&nbsp;
                                                            <Button variant='contained' className={classes.actionBtn} onClick={() => onUnStake(walletAddress , element.stakelog_id , element.token_id.address, element)} disabled={loading_tokens_array[element.token_id._id] === true ? false : true}>
                                                                {  loading_tokens_array[element.token_id._id] === true ? "UnStake" : <><CircularProgress size={20} style={{color : "white"}}/>...UnStake</> }
                                                            </Button>
                                                        </>
                                                    }
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        }
                                        break ;
                                    default :
                                        break ;
                                }
                            }) : <TableRow>
                                <TableCell colSpan={5}>
                                    <CircularProgress size={30} />
                                </TableCell>
                            </TableRow> ) : <TableRow>
                                <TableCell colSpan={5}>
                                    No Available Informations.
                                </TableCell>
                            </TableRow>
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={tokenStakeInfoList.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>

        {
            token_address === null && !isStaking ? <></> :
            <StakingDialog 
                account={walletAddress}
                open = {open}
                logo_url = {logo_url}
                stake_id = {stake_id}
                symbol = {symbol}
                est_apy={est_apy}
                token_address={token_address}
                token_id={token_id}
                current_token={current_token}
                stake_date={stake_date}
                isStaking={isStaking}
                whichButton ={whichButton}
                updateLoadingStakeArray={updateLoadingStakeArray}
                balance={balance}
                handleClose = {handleClose}
                GetTokenStakeInfoList={GetTokenStakeInfoList}
                onUnStake={onUnStake}
                estUSDAmount={estUSDAmount}
                estTokenAmount={estTokenAmount}
                tokenInfo={tokenInfo}
            />
        }
        </div>
    )
}
const mapStateToProps = (state) => ({
    walletAddress : state.wallet.walletAddress
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps , mapDispatchToProps)(StakingInfoList) ;