export declare enum ChainId {
    MAINNET = 1,
    GOERLI = 5,
    SEPOLIA = 11155111,
    BIT_DEVNET = 6000,
    BIT_MAINNET = 6001
}
export declare const SUPPORTED_CHAINS: readonly [ChainId.MAINNET, ChainId.GOERLI, ChainId.SEPOLIA, ChainId.BIT_DEVNET, ChainId.BIT_MAINNET];
export declare type SupportedChainsType = typeof SUPPORTED_CHAINS[number];
export declare enum NativeCurrencyName {
    ETHER = "ETH",
    MATIC = "MATIC",
    CELO = "CELO",
    GNOSIS = "XDAI",
    MOONBEAM = "GLMR",
    BNB = "BNB",
    AVAX = "AVAX",
    ROOTSTOCK = "RBTC",
    BOUNCEBIT = "BB"
}
