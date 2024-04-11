import { ChainId } from '@uniswap/sdk-core';
import { DAI_GOERLI, DAI_MAINNET, DAI_SEPOLIA, USDC_GOERLI, USDC_MAINNET, USDC_SEPOLIA, USDT_GOERLI, USDT_MAINNET, WBTC_GOERLI, } from '../../../providers/token-provider';
// When adding new usd gas tokens, ensure the tokens are ordered
// from tokens with highest decimals to lowest decimals. For example,
// DAI_AVAX has 18 decimals and comes before USDC_AVAX which has 6 decimals.
export const usdGasTokensByChain = {
    [ChainId.MAINNET]: [DAI_MAINNET, USDC_MAINNET, USDT_MAINNET],
    [ChainId.GOERLI]: [DAI_GOERLI, USDC_GOERLI, USDT_GOERLI, WBTC_GOERLI],
    [ChainId.SEPOLIA]: [USDC_SEPOLIA, DAI_SEPOLIA],
};
/**
 * Factory for building gas models that can be used with any route to generate
 * gas estimates.
 *
 * Factory model is used so that any supporting data can be fetched once and
 * returned as part of the model.
 *
 * @export
 * @abstract
 * @class IV2GasModelFactory
 */
export class IV2GasModelFactory {
}
/**
 * Factory for building gas models that can be used with any route to generate
 * gas estimates.
 *
 * Factory model is used so that any supporting data can be fetched once and
 * returned as part of the model.
 *
 * @export
 * @abstract
 * @class IOnChainGasModelFactory
 */
export class IOnChainGasModelFactory {
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FzLW1vZGVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL3JvdXRlcnMvYWxwaGEtcm91dGVyL2dhcy1tb2RlbHMvZ2FzLW1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxPQUFPLEVBQVMsTUFBTSxtQkFBbUIsQ0FBQztBQUluRCxPQUFPLEVBQUMsVUFBVSxFQUNoQixXQUFXLEVBQ1gsV0FBVyxFQUNYLFdBQVcsRUFDWCxZQUFZLEVBQ1osWUFBWSxFQUNaLFdBQVcsRUFDWCxZQUFZLEVBQ1osV0FBVyxHQUNaLE1BQU0sbUNBQW1DLENBQUM7QUFlM0MsZ0VBQWdFO0FBQ2hFLHFFQUFxRTtBQUNyRSw0RUFBNEU7QUFDNUUsTUFBTSxDQUFDLE1BQU0sbUJBQW1CLEdBQXVDO0lBQ3JFLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLFlBQVksRUFBRSxZQUFZLENBQUM7SUFDNUQsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxXQUFXLENBQUM7SUFDckUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsV0FBVyxDQUFDO0NBQy9DLENBQUM7QUE0REY7Ozs7Ozs7Ozs7R0FVRztBQUNILE1BQU0sT0FBZ0Isa0JBQWtCO0NBUXZDO0FBRUQ7Ozs7Ozs7Ozs7R0FVRztBQUNILE1BQU0sT0FBZ0IsdUJBQXVCO0NBYTVDIn0=