import { ChainId, Token } from '@uniswap/sdk-core';
import { IMulticallProvider } from './multicall-provider';
import { ProviderConfig } from './provider';
/**
 * Provider for getting token data.
 *
 * @export
 * @interface ITokenProvider
 */
export interface ITokenProvider {
    /**
     * Gets the token at each address. Any addresses that are not valid ERC-20 are ignored.
     *
     * @param addresses The token addresses to get.
     * @param [providerConfig] The provider config.
     * @returns A token accessor with methods for accessing the tokens.
     */
    getTokens(addresses: string[], providerConfig?: ProviderConfig): Promise<TokenAccessor>;
}
export declare type TokenAccessor = {
    getTokenByAddress(address: string): Token | undefined;
    getTokenBySymbol(symbol: string): Token | undefined;
    getAllTokens: () => Token[];
};
export declare const USDC_MAINNET: Token;
export declare const USDT_MAINNET: Token;
export declare const WBTC_MAINNET: Token;
export declare const DAI_MAINNET: Token;
export declare const FEI_MAINNET: Token;
export declare const UNI_MAINNET: Token;
export declare const AAVE_MAINNET: Token;
export declare const LIDO_MAINNET: Token;
export declare const USDC_SEPOLIA: Token;
export declare const DAI_SEPOLIA: Token;
export declare const USDC_GOERLI: Token;
export declare const USDT_GOERLI: Token;
export declare const WBTC_GOERLI: Token;
export declare const DAI_GOERLI: Token;
export declare const UNI_GOERLI: Token;
export declare const USDT_BIT_DEVNET: Token;
export declare class TokenProvider implements ITokenProvider {
    private chainId;
    protected multicall2Provider: IMulticallProvider;
    constructor(chainId: ChainId, multicall2Provider: IMulticallProvider);
    private getTokenSymbol;
    private getTokenDecimals;
    getTokens(_addresses: string[], providerConfig?: ProviderConfig): Promise<TokenAccessor>;
}
export declare const DAI_ON: (chainId: ChainId) => Token;
export declare const USDT_ON: (chainId: ChainId) => Token;
export declare const USDC_ON: (chainId: ChainId) => Token;
export declare const WNATIVE_ON: (chainId: ChainId) => Token;
