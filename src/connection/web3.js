import Web3 from 'web3';

// import { isMobile } from 'react-device-detect';

// Web 3 connection
// console.log('Mobile', isMobile);
// const web3 = new Web3(isMobile ? 
//                     'https://api.infura.io/v1/jsonrpc/mainnet/9aa3d95b3bc440fa88ea12eaa4456161' :
//                     'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161') ;
const web3 = new Web3('https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161') ;
// console.log('window.ethereum:', window.ethereum);
// const web3 = new Web3() ;

export default web3;