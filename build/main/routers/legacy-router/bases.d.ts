import { ChainId, Token } from '@uniswap/sdk-core';
import { ITokenProvider } from '../../providers/token-provider';
declare type ChainTokenList = {
    readonly [chainId in ChainId]: Token[];
};
export declare const BASES_TO_CHECK_TRADES_AGAINST: (_tokenProvider: ITokenProvider) => ChainTokenList;
export declare const ADDITIONAL_BASES: (tokenProvider: ITokenProvider) => Promise<{
    1?: {
        [tokenAddress: string]: Token[];
    } | undefined;
    5?: {
        [tokenAddress: string]: Token[];
    } | undefined;
    11155111?: {
        [tokenAddress: string]: Token[];
    } | undefined;
    6000?: {
        [tokenAddress: string]: Token[];
    } | undefined;
    6001?: {
        [tokenAddress: string]: Token[];
    } | undefined;
}>;
/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export declare const CUSTOM_BASES: (tokenProvider: ITokenProvider) => Promise<{
    1?: {
        [tokenAddress: string]: Token[];
    } | undefined;
    5?: {
        [tokenAddress: string]: Token[];
    } | undefined;
    11155111?: {
        [tokenAddress: string]: Token[];
    } | undefined;
    6000?: {
        [tokenAddress: string]: Token[];
    } | undefined;
    6001?: {
        [tokenAddress: string]: Token[];
    } | undefined;
}>;
export {};
