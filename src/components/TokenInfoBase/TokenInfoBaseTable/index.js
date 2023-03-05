import React from 'react';

import { useEffect , useState , useRef } from 'react' ;

import { getItem, setItem } from '../../../utils/helper';

import TokenInfoList from './TokenInfoList';
import TokenSearch from '../../Common/TokenSearch';

import { makeStyles } from '@mui/styles' ;

import { GetTokenInfoList } from '../../../redux/actions/token' ;

import {
    Box ,
    Tab ,
    Grid ,
    Button,
    useMediaQuery,
} from '@mui/material' ;

import {
    TabContext ,
    TabList ,
    TabPanel
} from '@mui/lab' ;
import { connect } from 'react-redux';

let tokenInfoBaseTimer ;

const useStyles = makeStyles((theme) => ({
    root : {
        border : "1px solid lightgray" ,
        "& .MuiTabPanel-root" : {
            padding : "0px !important" ,
            paddingTop : "50px !important" 
        } ,
        "& .MuiButton-root" : {
            width : "170px" ,
            borderRadius : "0px" ,
            fontWeight : "bold"
        }
    } ,
    tabBar : {
        borderBottom: '1px solid lightgrey',
        display:'flex',
        justifyContent : 'space-between',
        ['@media (max-width : 640px)'] : {
            display : 'block',
            borderBottom: 'none',
        }
    },
    tabLabel : {
        fontWeight : 'bold !important' ,
    },
    "& .css-46bh2p-MuiCardContent-root" :{
        padding : "0px !important"
    } ,
    btnGroup : {
        marginLeft : theme.spacing(2) + " !important"
    }
}));

const TokenInfoBaseTable = (props) => {

    const { GetTokenInfoList , tokenInfoList } = props ;

    const searchCtrl = useRef(null) ;
    const [value, setValue] = useState('1');
    const [tokenInfoIndex , setTokenInfoIndex ] = useState(1) ;
    const [searchTokenSymbol , setSearchTokenSymbol] = useState("") ;

    const classes = useStyles() ;

    const isXs = useMediaQuery("(min-width : 710px)") ;

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const getTokenInfoByTab = async (token_symbol="") => {

        if( tokenInfoIndex === 1 ) {
            await GetTokenInfoList("approved" , "" , token_symbol) ;
        }
        if( tokenInfoIndex === 2 ) {
            await GetTokenInfoList("approved" , "ETH" , token_symbol) ;
        }
        if( tokenInfoIndex === 3 ) {
            await GetTokenInfoList("approved" , "DAI" , token_symbol) ;
        }
    }

    const setTimerForTokenInfoList =  async (searchStr) => {
        clearInterval(tokenInfoBaseTimer) ;

        tokenInfoBaseTimer = setInterval(async () => {
            if( Number( getItem('pageIndex') ) !== 3 ){
                clearInterval(tokenInfoBaseTimer) ;
                return ;
            }
            await getTokenInfoByTab(searchStr) ;
            return ;
        } , 15000 )
    }

    const searchForMoreTokens = async (token_symbol) => {
        await setSearchTokenSymbol(token_symbol) ;

        await getTokenInfoByTab(token_symbol) ;

        await setTimerForTokenInfoList(token_symbol) ;
    }

    const tokenInfoIndexChanged = async (index) => {
        await GetTokenInfoList() ;

        await setSearchTokenSymbol("") ;

        searchCtrl.current.value = "" ;

        if(index === 1 ) {
             await GetTokenInfoList("approved" , "" ) ; 
             setTokenInfoIndex(1) ;

             return ;
        }
        if(index === 2 ) {
            await GetTokenInfoList("approved" , "ETH" ) ; 
            setTokenInfoIndex(2) ;

            return ;
        }
        if(index === 3 ) {
            await GetTokenInfoList("approved" , "DAI" ) ; 
            setTokenInfoIndex(3) ;
            return ;
        }

        return ;
    }

    useEffect(async () =>  {
        if(!getItem('pageIndex')){
            setItem('pageIndex' , "3") ;
            return ;
        }

        if(!tokenInfoIndex){
            return ;
        }
        await GetTokenInfoList("approved" , "") ;

        await setTimerForTokenInfoList("") ;

    } , [getItem('pageIndex')]);

    useEffect(async () => {
        if( tokenInfoIndex) {
            await setTimerForTokenInfoList("") ;
        }
    } , [tokenInfoIndex]) ;

    return (
            <div className={classes.root}>
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={value}>
                        <Box className={classes.tabBar}>
                            <TabList onChange={handleChange} aria-label="lab API tabs example">
                                <Tab className={classes.tabLabel} label="Top Volume" value="1" />
                            </TabList>
                            <TokenSearch 
                                searchForMoreTokens={searchForMoreTokens}
                                searchCtrl={searchCtrl}
                            />
                        </Box>
                        <TabPanel value="1">
                            <Grid container spacing={3} className={classes.btnGroup}>
                                <Grid  item xs={isXs ? 'auto' : 12}>
                                    <Button variant={tokenInfoIndex === 1 ? "contained" : "outlined"} color="primary" onClick={() =>  tokenInfoIndexChanged(1) }>
                                        All
                                    </Button>
                                </Grid>
                                <Grid  item xs={isXs ? 'auto' : 12}>
                                    <Button variant={tokenInfoIndex === 2 ? "contained" : "outlined"} color="primary" onClick={() => tokenInfoIndexChanged(2) } >
                                        ETH
                                    </Button>
                                </Grid>
                                <Grid  item xs={isXs ? 'auto' : 12}>
                                    <Button variant={tokenInfoIndex === 3 ? "contained" : "outlined"} color="primary" onClick={() =>  tokenInfoIndexChanged(3) } >
                                        DAI
                                    </Button>   
                                </Grid>
                            </Grid>
                            <TokenInfoList tokenInfoList={tokenInfoList} />
                        </TabPanel>
                    </TabContext>
                </Box>
            </div>
            
    );
}


const mapStateToProps = state => ({
    tokenInfoList : state.token.tokenInfoList 
})
const mapDispatchToProps = {
    GetTokenInfoList
}
export default connect(mapStateToProps , mapDispatchToProps)(TokenInfoBaseTable) ;