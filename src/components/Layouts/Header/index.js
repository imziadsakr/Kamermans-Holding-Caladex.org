import React, { useEffect, useState , useContext , useCallback} from 'react';

import { connect } from 'react-redux';

import PropTypes, { element } from 'prop-types' ;

import { useWeb3React } from "@web3-react/core";

import { GetWalletBalance, SetWalletAddress } from '../../../redux/actions/wallet' ;

import { removeItem, setItem , isMetaMaskInstalled, getItem } from '../../../utils/helper';

import { Link, useNavigate } from 'react-router-dom' ;
import WalletConnect from '../../../pages/WalletConnect';
import { magicEthereum, magicMatic, ethWeb3, maticWeb3 } from '../../../pages/WalletConnect/magic';

import { makeStyles } from '@mui/styles';

import clsx from 'clsx' ;

import swal from 'sweetalert' ;

import MenuIcon from '@mui/icons-material/Menu' ;
import NotificationsIcon from '@mui/icons-material/Notifications';
import CloseIcon from '@mui/icons-material/Close';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

import {
    AppBar ,
    Toolbar ,
    IconButton ,
    Typography ,
    Button ,
    Hidden,
    Drawer ,
    List , 
    ListItem,
    Divider,
    Grid ,
    useMediaQuery ,
    Box,
    Select,
    FormControl,
    InputLabel,
    MenuItem,
} from '@mui/material' ;

import LogoImage from "../../../assets/logo.png";

import TokenListing from '../../Common/TokenListing';
import LanguageSelector from './LanguageSelector';

import { Text, LanguageContext } from '../../../utils/Language';

// import web3 from '../../../connection/web3';
// import Web3Context from '../../../store/web3-context';

import { ethers, providers } from 'ethers';


const useStyles = makeStyles((theme) => ({
  root: {
    // position:"fixed" ,
    // width : "100%" ,
    flexGrow: 1,
    // zIndex : 3000 ,
    boxShadow : "none !important" ,
    paddingTop : "0px !important" ,
    marginTop : "0px !important" ,
    "& .MuiAppBar-root" : {
      boxShadow : "none !important"
    },
    "& .MuiDrawer-paper": {
      width : "100% !important",
      marginTop: "60px !important" ,
      backgroundColor : theme.palette.primary.main + " !important"
    } ,
    "& .MuiOutlinedInput-root" : {
      height : '40px',
    },
    "& .MuiInputLabel-root" : {
      bottom : 23,
    },
  },
  appbar : {
    zIndex: theme.zIndex.drawer + 1 ,
  },
  toolbar: {
    justifyContent : "space-between" ,
    alignItems: 'flex-end',
    paddingTop: "0px !important",
    paddingLeft : "5.578px !important" ,
    backgroundColor : theme.palette.background.default,
    minHeight : "61px !important" ,
  },
  logo : {
    height : 30,
    paddingLeft : "20px"
  },
  menuBar : {
    display : "flex" ,
    justifyContent : "space-between !important" ,
  },
  itemGroup : {
    justifyContent : "flex-start" ,
  },
  itemActive : {
    height: '52px',
    display: 'flex',
    alignItems: 'center',
    borderBottom: '2px solid ' + theme.palette.primary.main,
    paddingTop : "5px !important" ,
  },
  itemInActive : {
    height: '52px',
    display: 'flex',
    alignItems: 'center',
    borderBottom: '2px solid white',
    paddingTop : "5px !important" ,
  },
  item: {
    flexGrow: 1,
    color : theme.palette.primary.main ,
    cursor : "pointer" ,
    paddingLeft : theme.spacing(2) ,
    paddingRight : theme.spacing(2) ,
    display : "flex" ,
    alignItems : "flex-end" ,
    fontSize : 14 ,
    textDecoration : 'none' ,
    fontFamily : "Montserrat, sans-serif" ,
    '&:hover' : {
      textDecoration : "none",
      color : "red",
    } ,
    '&:focus' : {
      textDecoration : "none",
      color : theme.palette.primary.main,
    } ,
  },

  btnItemGroup : {
    display : "flex" ,
    justifyContent : "flex-end" ,
    alignItems : "center" ,
  } ,
  btnItem : {
    border : "1px solid lightgray" 
  },
  notificationButton : {
    color : theme.palette.primary.main ,
    cursor : "pointer" ,
    fontSize : "16px !important",
  } ,
  drawerItem: {
    color : theme.palette.background.default,
    cursor : "pointer" ,
    padding : "0px" ,
    textDecoration : 'none' ,
    fontWeight: 'bold' ,
    fontSize : "20px" ,
    height : "430px !important" ,
    '&:hover' : {
      textDecoration : "none",
      color : "white",
    } ,
    '& .MuiListItem-root' :{
        height : "50px"
    }
  },
  drawerMenuBar : {
    "& .MuiListItem-root" : {
      height : "50px" ,
      color : "white !important"
    },
    "& .MuiButton-root" : {
      color : "white" ,
      border : "1px solid white" ,
      borderRadius : "30px" ,
    },
    "& svg" : {
      color : "white !important"
    },
    "& a" : {
      textDecoration : "none" ,
      color : "white"
    }
  }
}));


const Header = (props) => {
 
  const { walletAddress } = props ;
  const [ethBalance , setEthBalance] = useState(0.0) ;

  // console.log(walletAddress);
  const provider = providers.getDefaultProvider();
  // fetch token balance using library
  // const _fetchTokenBalance = async () => {
  //     const ans = await provider.getBalance(walletAddress);
  //     return ans;
  // }
  // const getAccountBalance = async () => {
  //     _fetchTokenBalance().then((bal) => setEthBalance(bal.toString()));
  // }

  const { dictionary ,  userLanguage} = useContext(LanguageContext);
  
  const classes = useStyles();
  const navigate = useNavigate() ;

  let isDrawerWalletBtn = useMediaQuery("(min-width:1093px)") ;
  let isXs = useMediaQuery("(min-width : 1280px)") ;
  let isDrawerMenuItem = useMediaQuery("(min-width : 930px)");

  const [isVisibleTokenListing , setVisibleTokenListing] = useState(false) ;

  const [isMobileDrawerOpen , setIsMobileDrawerOpen] = useState(false) ;
  const [itemIndex , setItemIndex] = useState(getItem('pageIndex')) ;

  const [open, setOpen] = useState(false);
  const [netType, setNetType] = useState('eth');
  const [magic, setMagic] = useState('ethereum');

  const web3 = magic.network === 'ethereum' ? ethWeb3 : maticWeb3;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  const handleMobileDrawerOpen =  () => {
    setIsMobileDrawerOpen(!isMobileDrawerOpen) ;
  }
  // pseudocode to just display the relevant code snippet
  // const fetchBalance = (address) => {
  //   web3.eth.getBalance(address)
  // }

  const handleChange = (event) => {
    
    // event.target.value === 'eth' ? setMagic(magicEthereum) : setMagic(magicMatic);
    // fetchBalance(walletAddress);
    setNetType(event.target.value);
  };

  const menuItems = [
      {
          name: dictionary.exchange,
          link: '/exchange',
          index : 1 ,
      },
      {
          name : dictionary.tokenlisting ,
          link: '/token-listing',
          index : 2 ,
      },
      {
          name: dictionary.tokeninfobase,
          link: '/token-info-base',
          index : 3 ,
      },
      {
          name: dictionary.earnstaking,
          link: '/earn-staking',
          index : 4 ,
      },
      {
        name: dictionary.balances,
        link: '/balances',
        index : 5 ,
      },
      {
        name: dictionary.orders,
        link: '/orders',
        index : 6 ,
      },
      // {
      //   name: "Calahex",
      //   link: '/Calahex',
      //   index : 7 ,
      // },
  ];

  useEffect(() => {
    if(isVisibleTokenListing) {
      document.body.style.overflow = "hidden" ;
      setVisibleTokenListing(false) ;
    } else {
      document.body.style.overflow = "visible" ;
    }
  } , [isVisibleTokenListing]) ;

  useEffect(() => {
    if(isMobileDrawerOpen) {
      document.body.style.overflow = "hidden" ;
    } else {
      document.body.style.overflow = "visible" ;
    }
  } , [isMobileDrawerOpen]) ;

  useEffect(() => {
    
    let url = window.location.pathname ;

    if(url.search('exchange') >= 0 ) {
        setItem("pageIndex" , "1") ;
        setItemIndex(1) ;
        return ;
    }
    if(url.search('token-info-base') >= 0) {
        setItem("pageIndex" , "3") ;
        setItemIndex(3) ;
        return ;
    }
    if(url.search('earn-staking') >= 0){
        setItem("pageIndex" , "4") ;
        setItemIndex(4) ;
        return ;
    }
    if(url.search('balances') >= 0) {
        setItem("pageIndex" , "6") ;
        setItemIndex(6) ;
        return ;
    }
    if(url.search('orders') >= 0) {
        setItem("pageIndex" , "7") ;
        setItemIndex(7) ;
        return ;
    }

    setItem('pageIndex' , '0') ;
    setItemIndex(0) ;
  } , [navigate])

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appbar}>
        <Toolbar className={classes.toolbar}>
            <Link to="/" onClick={() => { setItem('pageIndex' , '0' ); }} >
              <img  src={LogoImage} 
                    alt='Main Logo'
                    className={classes.logo} />

            </Link>
            <Grid container sx={{display :"flex" , justifyContent : isDrawerMenuItem ?  "space-between" : "flex-end"}}>
              <Grid item className={clsx(classes.itemGroup)} sx={{display: isDrawerMenuItem ? "flex" : "none"}}>
                    {
                      menuItems.map((element) => {
                        if(element.index === 2){
                          return(
                            <div key={element.index}>
                              <div  className={itemIndex === element.index ? classes.itemActive : classes.itemInActive}  onClick={handleOpen}>
                                  <span  className={classes.item}>
                                    {dictionary.tokenlisting}
                                  </span>
                                  
                              </div>
                            </div>
                          )
                        }
                        if(element.index < 5 && element.index !== 2){
                          return (
                            <div key={element.index}>
                              <Typography noWrap className={ itemIndex === element.index ? classes.itemActive : classes.itemInActive}>
                                  <Link className={classes.item}
                                      to={element.link}
                                      onClick={() => { setItem('pageIndex' , element.index)}}
                                  >
                                    {element.name}
                                  </Link>
                              </Typography>
                            </div>
                          )
                        }
                      })
                    }
                    <div>
                      <Typography noWrap className={ itemIndex === 5 ? classes.itemActive : classes.itemInActive}>
                          <Box component={"a"}  className={classes.item}
                              href={"http://calahex.com"}
                              target="_blank"
                              onClick={() => { setItem('pageIndex' , 7);  }}
                          >
                            Calahex
                          </Box>
                      </Typography>
                    </div>    
              </Grid>
              <Grid item xs={'auto'} className={classes.btnItemGroup}>
                  <Box component={"div"} sx={{display : isXs && walletAddress ? "flex" : "none"}}>
                      <Link to={"/balances"}>
                        <Box component={"button"} className={ clsx( classes.btnItem ,  itemIndex === 6 ? " btn btn-primary " : " btn btn-outline-secondary" )   } onClick={() => { setItem('pageIndex' , "6"); }}>
                          {dictionary.balances}
                        </Box>
                      </Link> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  
                      <Link to={"/orders"}>
                        <Box component={"button"} className={ clsx( classes.btnItem ,  itemIndex === 7 ? " btn btn-primary" : " btn btn-outline-secondary" )  } onClick={() => { setItem('pageIndex' , "7");}}>
                          {dictionary.orders}
                        </Box>
                      </Link>&nbsp;&nbsp;
                
                  </Box>
                  <NotificationsIcon className={classes.notificationButton}/>
                  &nbsp;&nbsp;
                  <LanguageSelector />
                  &nbsp;&nbsp;
                  
                  {/* <FormControl sx={{width : '120px',mr:2}}>
                    <InputLabel id="demo-simple-select-label">Ethereum</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={age}
                      label="Ethereum"
                      onChange={handleChange}
                    >
                      <MenuItem value={'eth'}>Ethereum</MenuItem>
                      <MenuItem value={'pol'}>Polygon</MenuItem>
                    </Select>
                  </FormControl> */}

                  <FormControl variant="standard" sx={{width : '100px', mr : 2}}>
                      <Select
                          value={netType}
                          onChange={handleChange}
                          disableUnderline
                      >
                          <MenuItem value={'eth'} className={classes.menuItem}>Ethereum</MenuItem>
                          <MenuItem value={'pol'} className={classes.menuItem}>Polygon</MenuItem>
                      </Select>
                  </FormControl>

                  <Hidden mdDown mdUp={isDrawerWalletBtn ? false : true}>
                    <WalletConnect 
                      netType = {netType}
                      setNetType = {setNetType}
                    />
                  </Hidden>
                
                  <Hidden mdUp={isXs ? true : false} >
                    <IconButton
                      aria-label="open drawer"
                      edge="end"
                      onClick={handleMobileDrawerOpen}
                    >
                      <MenuIcon />
                    </IconButton>
                </Hidden>
              </Grid>
            </Grid>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="persistent"
        anchor="right"
        open={isMobileDrawerOpen}
      >
        <List className={classes.drawerMenuBar}>
          <ListItem sx={{display:"flex" , justifyContent: "flex-end" }}>
                <IconButton
                  aria-label="open drawer"
                  onClick={handleMobileDrawerOpen}
                >
                  <CloseIcon />
                </IconButton>
          </ListItem>
          <Divider />
          {   menuItems.map( (element) => {
                  if( element.name === "Token Listing" ) {
                    if(!isDrawerMenuItem) {
                      return (
                        <div key={element.name}>
                          <ListItem button onClick={handleOpen }>
                                <Box component={'span'} >
                                  Token Listing
                                </Box>
                          </ListItem>
                        
                          <Divider />
                        </div>
                      )
                    }
                  }
                  else if(element.index < 5){
                    if(!isDrawerMenuItem){
                      return(
                        <div key={element.name}>
                          <Link className={classes.drawerItem}
                            to={element.link}
                            onClick = {() => setItem("pageIndex" , element.index)}
                          >
                            <Box component={"div"}>
                              <ListItem button onClick={handleMobileDrawerOpen} >
                                <Typography noWrap>
                                  
                                    {element.name}
                                  
                                </Typography>
                              </ListItem>
                            </Box>
                          </Link>
                          <Divider />
                        </div>
                      )
                    }
                  } else 
                    if(!isXs && walletAddress){
                      return(
                        <div key={element.name} >
                          <Link className={classes.drawerItem}
                            to={element.link}
                            onClick = {() => setItem("pageIndex" , element.index)}
                          >
                            <Box component={"div"}>
                              <ListItem button onClick={handleMobileDrawerOpen} >
                                <Typography noWrap>
                                  
                                    {element.name}
                                  
                                </Typography>
                              </ListItem>
                            </Box>
                          </Link>
                          <Divider />
                        </div>
                      )
                    }
                  })
          }
          {
             !isDrawerMenuItem ? <div key={element.name} >
              <ListItem button>
                <Box component={"a"}  
                  href={"http://calahex.com"}
                  target="_blank"
                  onClick={() => { setItem('pageIndex' , 7);  }} 
                >
                  Calahex
                </Box>
              </ListItem>
            
              <Divider />
            </div> : <></>
          }
          
          {
            !isDrawerWalletBtn ? <>
              <ListItem onClick={handleMobileDrawerOpen}>
                <WalletConnect />
              </ListItem></> : <></>
          }
        </List>
      </Drawer>
      <TokenListing 
        open = {open}
        handleClose = {handleClose}
      />
    </div>
  );
}

Header.propsType = {
  walletAddress : PropTypes.string.isRequired ,
}
const mapStateToProps = state => ({
  walletAddress : state.wallet.walletAddress
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps , mapDispatchToProps)(Header) ;