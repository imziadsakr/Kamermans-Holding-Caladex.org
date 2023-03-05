
import React, {useContext, useEffect} from 'react';

import web3 from './connection/web3';
import Web3Context from './store/web3-context';
// Suspense
import { Fragment ,  Suspense , lazy } from 'react' ;

// Theme
import { ThemeProvider , CssBaseline } from '@mui/material';
import theme from './utils/theme' ;

// Global Style
// import GlobalStyles from "./utils/globalstyles";

// Language 
import { LanguageProvider } from "./utils/Language";

// Pace
// import Pace from "./utils/Pace";

// Store
import { Provider } from 'react-redux' ;
import store from './redux';

// Router
import { BrowserRouter , Routes , Route } from 'react-router-dom';

import { WalletConnectEvent } from './redux/actions/wallet';

import "bootstrap/dist/css/bootstrap.min.css" ;
import "bootstrap/dist/js/bootstrap.min.js" ;

const MainComponent = lazy(() => import('./components/Main')) ;


const App = () => {

  // const web3Ctx = useContext(Web3Context);

  // useEffect(() => {
  //   if(!web3) {
  //     alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
  //     return;
  //   };

  //   window.ethereum.on('accountsChanged', async (accounts) => {
  //     const account = await web3Ctx.loadAccount(web3);
      
  //     WalletConnectEvent({
  //       web3Provider : null,
  //       walletAddress : account
  //     }) ;
  //   });

  //   // Metamask Event Subscription - Network changed
  //   window.ethereum.on('chainChanged', (chainId) => {
  //     window.location.reload();
  //   });
    
  // }, []);

  return (
    <BrowserRouter>
      <LanguageProvider>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {/* <GlobalStyles /> */}
            {/* <Pace color={theme.palette.primary.light} /> */}
            <Suspense fallback={<Fragment />} >
              <Routes>
                  <Route path="*" element={<MainComponent />} />
              </Routes>
            </Suspense>
          </ThemeProvider>
        </Provider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
