
import React, { useCallback, useEffect, useState, useContext } from "react";

import { connect } from 'react-redux';

import WalletConnectProvider from "@walletconnect/web3-provider";
import WalletLink from "walletlink";

import Web3Modal from 'web3modal';
import { isMobile } from 'react-device-detect';

import swal from "sweetalert";

import { providers } from "ethers";

import supportedChains from "./chains";

import {
    Button
} from '@mui/material';

import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

import { WalletConnectEvent } from "../../redux/actions/wallet";


const getChainData = (chainId) => {
    if (!chainId) {
        return null;
    }

    const chainData = supportedChains.filter(chain => chain.chain_id === chainId)[0];

    if (!chainData) {
        throw new Error('ChainId missing or not supported');
    }

    const API_KEY = 'f957dcc0cb6c430f9d32c2c085762bdf';

    if (chainData.rpc_url.includes('infura.io') && chainData.rpc_url.includes('%API_KEY%') && API_KEY) {
        const rpcUrl = chainData.rpc_url.replace('%API_KEY%', API_KEY);

        return {
            ...chainData,
            rpc_url: rpcUrl
        };
    }

    return chainData;
}

const INFURA_ID = 'f957dcc0cb6c430f9d32c2c085762bdf';

const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider,
        options: {
            infuraId: INFURA_ID
        },
    },
    'custom-walletlink': {
        display: {
            logo: 'https://play-lh.googleusercontent.com/PjoJoG27miSglVBXoXrxBSLveV6e3EeBPpNY55aiUUBM9Q1RCETKCOqdOkX2ZydqVf0',
            name: 'Coinbase',
            description: 'Connect to Coinbase Wallet (not Coinbase App)'
        },
        options: {
            appName: 'Coinbase',
            networkUrl: `https://mainnet.infura.io/v3/${INFURA_ID}`,
            chainId: 1
        },
        package: WalletLink,
        connector: async (_, options) => {
            const { appName, networkUrl, chainId } = options;

            const walletLink = new WalletLink({
                appName
            });
            const provider = walletLink.makeWeb3Provider(networkUrl, chainId);
            await provider.enable();

            return provider;
        }
    }
}

let web3Modal;

if (typeof window !== 'undefined') {
    web3Modal = new Web3Modal({
        network: 'mainnet',
        cacheProvider: true,
        providerOptions
    })
}

const WalletConnect = (props) => {

    // const { library ,  active, activate, deactivate, account} = useWeb3React() ; 

    // const [ walletAddress, setWalletAddress ] = useState(null) ;
    // const [ web3Provider, setWeb3Provider ] = useState(null) ;
    const [chainId, setChainId] = useState(null);

    // const web3Ctx = useContext(Web3Context);

    const {
        netType,
        setNetType,
        web3Provider,
        walletAddress,
        WalletConnectEvent
    } = props;

    const [provider, setProvider] = useState(null);

    const connect = useCallback(async () => {
        // This is the initial `provider` that is returned when
        // using web3Modal to connect. Can be MetaMask or WalletConnect.
        const provider = await web3Modal.connect();

        // We plug the initial `provider` into ethers.js and get back
        // a Web3Provider. This will add on methods from ethers.js and
        // event listeners such as `.on()` will be different.
        const web3Provider = new providers.Web3Provider(provider);
        const signer = web3Provider.getSigner();
        const address = await signer.getAddress();
        const network = await web3Provider.getNetwork();
        setChainId(network.chainId);
        setProvider(provider);
        
        WalletConnectEvent({
            web3Provider: web3Provider,
            walletAddress: address
        });
    }, []);

    const disconnect = useCallback(async () => {
        if (!await swal({
            title: "Are you sure?",
            text: "Are you sure that you want to disconnect?",
            icon: "warning",
            buttons: [
                'No, I am not sure!',
                'Yes, I am sure!'
            ],
        })) return;

        await web3Modal.clearCachedProvider();

        if (provider?.disconnect && typeof provider.disconnect === 'function') {
            await provider.disconnect();
        }

        // setWeb3Provider(null) ;
        // setWalletAddress(null) ;
        setChainId(null);
        setProvider(null);

        console.log("wallet disconnect");

        WalletConnectEvent({
            web3Provider: null,
            walletAddress: null
        });

    }, [connect]);

    useEffect(() => {
        if (web3Modal.cacheProvider) {
            connect();
        }
    }, [connect]);

    const allowEthereumNetwork = async() => {

        try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: `0x${Number(1).toString(16)}` }],
            });
        } catch (e) {
            if (e.code === 4902) {
                    try {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [
                                {
                                    chainId: `0x${Number(1).toString(16)}`,
                                    chainName: 'Ethereum',
                                    nativeCurrency: {
                                        name: 'Ethereum',
                                        symbol: 'ETH', // 2-6 characters long
                                        decimals: 18
                                    },
                                    blockExplorerUrls: ['https://etherscan.io'],
                                    rpcUrls: ['https://mainnet.infura.io/v3/f957dcc0cb6c430f9d32c2c085762bdf'],
                                },
                            ],
                        });
                    } catch (addError) {
                    console.error(addError);
                }
            }
            if(e.code === 4001) {
                setNetType('pol');
                allowPolygonNetwork();
            }
        }
    }

    const allowPolygonNetwork = async() => {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${Number(137).toString(16)}`, }],
            });
        } catch (e) {
            if (e.code === 4902) {
                try {
                    await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainId: `0x${Number(137).toString(16)}`,
                            chainName: 'Matic',
                            nativeCurrency: {
                                name: 'Matic Mainnet',
                                symbol: 'MATIC', // 2-6 characters long
                                decimals: 18
                            },
                            blockExplorerUrls: ['https://explorer.matic.network/'],
                            rpcUrls: ['https://rpc-mainnet.maticvigil.com/'],
                        },
                    ],
                    });
                } catch (addError) {
                    console.error(addError);
                    console.log("bbbb");
                }
            }
            if(e.code === 4001) {
                setNetType('eth');
                allowEthereumNetwork();
            }
        }
    }
    useEffect(async () => {
        
        if(netType === 'eth'){
            await allowEthereumNetwork();
        }

        if(netType === 'pol'){
            await allowPolygonNetwork();
        }
    }, [netType])

    useEffect(() => {
        if (!isMobile) {
            if (walletAddress) {
                // setWalletAddress(account) ;
            } else {
                // setWalletAddress(null) ;
                // WalletConnectEvent({
                //     web3Provider : null,
                //     walletAddress : null
                // }) ;
            }
        }
    }, [walletAddress]);

    useEffect(() => {
        if (provider?.on) {
            const handleAccountsChanged = (accounts) => {
                console.log('accountsChanged', accounts);
            }

            const handleChainChanged = (_hexChainId) => {
                window.location.reload();
            }

            const handleDisconnect = (error) => {
                console.log('disconnect', error);
                disconnect();
            }

            provider.on('accountChanged', handleAccountsChanged);
            provider.on('chainChanged', handleChainChanged);
            provider.on('disconnect', handleDisconnect);

            return () => {
                if (provider.removeListener) {
                    provider.removeListener('accountChanged', handleAccountsChanged);
                    provider.removeListener('chainChanged', handleChainChanged);
                    provider.removeListener('disconnect', handleDisconnect);
                }
            }
        }
    }, [provider, disconnect]);

    const chainData = getChainData(chainId);

    return (
        <>
            <Button variant="contained" onClick={walletAddress ? disconnect : connect}>
                <AccountBalanceWalletIcon /> &nbsp;
                {walletAddress ? ' ( ' + walletAddress.slice(0, 6) + "..." + walletAddress.slice(walletAddress.length - 4, walletAddress.length) + " )" : "  Connect"}
            </Button>
        </>
    )
}
const mapStateToProps = state => ({
    web3Provider: state.wallet.web3Provider,
    walletAddress: state.wallet.walletAddress
})

const mapDispatchToProps = {
    WalletConnectEvent
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletConnect);