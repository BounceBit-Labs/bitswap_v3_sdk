import { ChainId } from '@uniswap/sdk-core';
import { DAI_GOERLI, DAI_MAINNET, DAI_SEPOLIA, USD_BIT_MAINNET, USDC_GOERLI, USDC_MAINNET, USDC_SEPOLIA, USDT_BIT_DEVNET, USDT_GOERLI, USDT_MAINNET, WBTC_GOERLI, } from '../../../providers/token-provider';
// When adding new usd gas tokens, ensure the tokens are ordered
// from tokens with highest decimals to lowest decimals. For example,
// DAI_AVAX has 18 decimals and comes before USDC_AVAX which has 6 decimals.
export const usdGasTokensByChain = {
    [ChainId.MAINNET]: [DAI_MAINNET, USDC_MAINNET, USDT_MAINNET],
    [ChainId.GOERLI]: [DAI_GOERLI, USDC_GOERLI, USDT_GOERLI, WBTC_GOERLI],
    [ChainId.SEPOLIA]: [USDC_SEPOLIA, DAI_SEPOLIA],
    [ChainId.BIT_DEVNET]: [USDT_BIT_DEVNET],
    [ChainId.BIT_MAINNET]: [USD_BIT_MAINNET]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FzLW1vZGVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL3JvdXRlcnMvYWxwaGEtcm91dGVyL2dhcy1tb2RlbHMvZ2FzLW1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxPQUFPLEVBQVMsTUFBTSxtQkFBbUIsQ0FBQztBQUluRCxPQUFPLEVBQUMsVUFBVSxFQUNoQixXQUFXLEVBQ1gsV0FBVyxFQUNYLGVBQWUsRUFDZixXQUFXLEVBQ1gsWUFBWSxFQUNaLFlBQVksRUFDWixlQUFlLEVBQ2YsV0FBVyxFQUNYLFlBQVksRUFDWixXQUFXLEdBQ1osTUFBTSxtQ0FBbUMsQ0FBQztBQWUzQyxnRUFBZ0U7QUFDaEUscUVBQXFFO0FBQ3JFLDRFQUE0RTtBQUM1RSxNQUFNLENBQUMsTUFBTSxtQkFBbUIsR0FBdUM7SUFDckUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsWUFBWSxFQUFFLFlBQVksQ0FBQztJQUM1RCxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLFdBQVcsQ0FBQztJQUNyRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxXQUFXLENBQUM7SUFDOUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxlQUFlLENBQUM7SUFDdkMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEVBQUMsQ0FBQyxlQUFlLENBQUM7Q0FDeEMsQ0FBQztBQTRERjs7Ozs7Ozs7OztHQVVHO0FBQ0gsTUFBTSxPQUFnQixrQkFBa0I7Q0FRdkM7QUFFRDs7Ozs7Ozs7OztHQVVHO0FBQ0gsTUFBTSxPQUFnQix1QkFBdUI7Q0FhNUMifQ==