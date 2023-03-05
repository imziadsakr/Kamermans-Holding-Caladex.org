
const ActionTypes = {

    WalletConnectEvent : 'WalletConnectEvent',

    TokenInfoList : "TokenInfoList" ,



    SignUpUser : "SignUpUser" ,

    SetWalletAddress : "SetWalletAddress" ,
    GetWalletBalance : "GetWalletBalance" ,

    // Landing Page's TokenTable
    GetTokenLiquidityList : "GetTokenLiquidityList" ,
    GetTradeHistory : "GetTradeHistory" ,


    // Balances Page 's WalletMangement
    GetExchageRateToUSD : "GetExchageRateToUSD",
    GetTokenBalanceInfo : "GetTokenBalanceInfo" ,
    SetTokenBalance : "SetTokenBalance" ,


    //Token Listing Page
    AddTokenSuccess : "AddTokenSuccess" ,
    AddTokenError : "AddTokenError" ,
    ConfirmAddToken : "ConfirmAddToken" ,



    //Token Info Base page
    GetTokenInfoList : "GetTokenInfoList" ,


    //Earn Staking Page
    GetTokenStakeInfoList : "GetTokenStakeInfoList" ,


    // Exchange Page 
    GetTokenOrderSellList : "GetTokenOrderSellList" ,
    GetTokenOrderBuyList : "GetTokenOrderBuyList" ,
    GetTokenTradeList : "GetTokenTradeList" ,
    GetExchangeOrderList : "GetExchangeOrderList" ,
    GetTokenPairList : "GetTokenPairList" ,

    OrderLimit : "OrderLimit" ,
    OrderMarket : "OrderMarket" ,
    OrderError : "OrderError" ,

    // Orders Page
    GetOrderHistory : "GetOrderHistory" ,
    GetOrderTradeHistory : "GetOrderTradeHistory" ,

    //

    TokenBalance : "TokenBalance",
    PairBalance : "PairBalance" ,

    //

    GetTradingViewData : "GetTradingViewData",

    SetProvider : "SetProvider"
}

export default ActionTypes ;