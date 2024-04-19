import { Percent } from '@uniswap/sdk-core';
import JSBI from 'jsbi';
/**
 * @deprecated use FACTORY_ADDRESS_MAP instead
 */
export declare const FACTORY_ADDRESS = "0xeC2e9f996faF6CC2f1FD1199F9F3221961645B8b";
export declare const FACTORY_ADDRESS_MAP: {
    [chainId: number]: string;
};
export type  INIT_CODE_HASH = (chainId:number) => string;
export declare const MINIMUM_LIQUIDITY: JSBI;
export declare const ZERO: JSBI;
export declare const ONE: JSBI;
export declare const FIVE: JSBI;
export declare const _997: JSBI;
export declare const _1000: JSBI;
export declare const BASIS_POINTS: JSBI;
export declare const ZERO_PERCENT: Percent;
export declare const ONE_HUNDRED_PERCENT: Percent;
