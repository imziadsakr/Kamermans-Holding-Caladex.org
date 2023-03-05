import  React from 'react';

import { useState , useEffect , useRef} from 'react' ;
import PropTypes from 'prop-types' ;

import TokenSearch from '../../Common/TokenSearch';
import { GetTokenLiquidityList } from '../../../redux/actions/token' ;

import TokenLiquidityList from './TokenLiquidityList';

import { getItem, setItem } from '../../../utils/helper';

import {makeStyles} from '@mui/styles' ;

import {
    Box ,
    Tab ,
    Grid ,
    Button ,
    useMediaQuery
} from '@mui/material' ;

import {
    TabContext ,
    TabList ,
    TabPanel
} from '@mui/lab' ;
import { connect } from 'react-redux';

let tokenInfoTimer ;

const useStyles = makeStyles((theme) => ({
    root : {
        marginTop : theme.spacing(5) ,
        marginLeft : "5% !important" ,
        marginRight : "5% !important" ,
        border : "1px solid lightgray" ,
        "& .MuiTabPanel-root" :{
            padding : "0px",
        },
        "& .MuiGrid-container" : {
            marginTop : "0px" ,
            marginLeft : theme.spacing(2)
        },
        "& .MuiButton-root" : {
            width : "170px" ,
            borderRadius : "0px" ,
            fontWeight : "bold"
        },
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
    btnGroup : {
        marginTop : "20px !important" ,
        marginLeft : "5px !important"
    }
}));

const TokenLiquidityTable = (props) => {
    const { GetTokenLiquidityList ,  tokenLiquidityList , isOffTimer } = props ;

    const searchCtrl = useRef(null) ;
    const [value, setValue] = useState('1');
    const [tokenInfoIndex , setTokenInfoIndex ] = useState(1) ;
    const [searchTokenSymbol , setSearchTokenSymbol] = useState("") ;

    const classes = useStyles() ;

    const isXs = useMediaQuery("(min-width : 640px)") ;

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const getTokenInfoByTab = async (token_symbol = "") => {

        if( tokenInfoIndex === 1 ) {
            await GetTokenLiquidityList("approved" , "" , token_symbol) ;
        }
        if( tokenInfoIndex === 2 ) {
            await GetTokenLiquidityList("approved" , "ETH" , token_symbol) ;
        }
        if( tokenInfoIndex === 3 ) {
            await GetTokenLiquidityList("approved" , "DAI" , token_symbol) ;
        }
    }

    const setTimerForTokenInfoList =  async (searchStr) => {
        clearInterval(tokenInfoTimer) ;

        tokenInfoTimer = setInterval(async () => {
            if( Number( getItem('pageIndex') ) !== 0 ){
                clearInterval(tokenInfoTimer) ;
                return ;
            }
            await getTokenInfoByTab(searchStr) ;
            return ;
        } , 8000 )
    }

    const searchForMoreTokens = async (token_symbol) => {
        await setSearchTokenSymbol(token_symbol) ;

        await getTokenInfoByTab(token_symbol) ;

        await setTimerForTokenInfoList(token_symbol) ;
    }

    const tokenInfoIndexChanged = async (index) => {
        await GetTokenLiquidityList() ;

        await setSearchTokenSymbol("") ;

        searchCtrl.current.value = "" ;

        if(index === 1 ) {
             GetTokenLiquidityList("approved" , "" ) ; 
             setTokenInfoIndex(1) ;

             return ;
        }
        if(index === 2 ) {
            GetTokenLiquidityList("approved" , "ETH" ) ; 
            setTokenInfoIndex(2) ;

            return ;
        }
        if(index === 3 ) {
            GetTokenLiquidityList("approved" , "DAI" ) ; 
            setTokenInfoIndex(3) ;

            return ;
        }

        return ;
    }

    useEffect(() => {
        clearInterval(tokenInfoTimer) ;
    } , [isOffTimer]);

    useEffect(async () =>  {
        if(!getItem('pageIndex')){
            setItem('pageIndex' , "0") ;
            return ;
        }
        await GetTokenLiquidityList("approved"  ) ;
        setTimerForTokenInfoList("") ;

    } , [getItem('pageIndex')]);

    useEffect(async () => {
        setTimerForTokenInfoList("") ;
    } , [tokenInfoIndex]) ;

    useEffect(() => {
        
    }, []) ;

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
                        <Grid container className={classes.btnGroup} spacing={"10px"}>
                            <Grid  item xs={isXs ? "auto" : 12}>
                                <Button variant={tokenInfoIndex === 1 ? "contained" : "outlined"} color="primary" onClick={() =>  tokenInfoIndexChanged(1) }>
                                    All
                                </Button>
                            </Grid>
                            <Grid  item xs={isXs ? "auto" : 12}>
                                <Button variant={tokenInfoIndex === 2 ? "contained" : "outlined"} color="primary" onClick={() => tokenInfoIndexChanged(2) } >
                                    ETH
                                </Button>
                            </Grid>
                            <Grid  item xs={isXs ? "auto" : 12}>
                                <Button variant={tokenInfoIndex === 3 ? "contained" : "outlined"} color="primary" onClick={() =>  tokenInfoIndexChanged(3) } >
                                    DAI
                                </Button>   
                            </Grid>
                        </Grid>
                        <TokenLiquidityList tokenLiquidityList={tokenLiquidityList}/>
                    </TabPanel>
                </TabContext>
            </Box>
        </div>
        
    );
}

TokenLiquidityTable.propsType = {
    tokenLiquidityList : PropTypes.array.isRequired ,
}

const mapStateToProps = state => ({
    tokenLiquidityList : state.token.tokenLiquidityList ,
})

const mapDispatchToProps = {
    GetTokenLiquidityList ,
}

export default connect(mapStateToProps , mapDispatchToProps)(TokenLiquidityTable) ;