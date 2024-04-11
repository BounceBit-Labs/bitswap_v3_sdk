"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IOnChainGasModelFactory = exports.IV2GasModelFactory = exports.usdGasTokensByChain = void 0;
const sdk_core_1 = require("@uniswap/sdk-core");
const token_provider_1 = require("../../../providers/token-provider");
// When adding new usd gas tokens, ensure the tokens are ordered
// from tokens with highest decimals to lowest decimals. For example,
// DAI_AVAX has 18 decimals and comes before USDC_AVAX which has 6 decimals.
exports.usdGasTokensByChain = {
    [sdk_core_1.ChainId.MAINNET]: [token_provider_1.DAI_MAINNET, token_provider_1.USDC_MAINNET, token_provider_1.USDT_MAINNET],
    [sdk_core_1.ChainId.GOERLI]: [token_provider_1.DAI_GOERLI, token_provider_1.USDC_GOERLI, token_provider_1.USDT_GOERLI, token_provider_1.WBTC_GOERLI],
    [sdk_core_1.ChainId.SEPOLIA]: [token_provider_1.USDC_SEPOLIA, token_provider_1.DAI_SEPOLIA],
    [sdk_core_1.ChainId.BIT_DEVNET]: [token_provider_1.USDT_BIT_DEVNET]
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
class IV2GasModelFactory {
}
exports.IV2GasModelFactory = IV2GasModelFactory;
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
class IOnChainGasModelFactory {
}
exports.IOnChainGasModelFactory = IOnChainGasModelFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FzLW1vZGVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL3JvdXRlcnMvYWxwaGEtcm91dGVyL2dhcy1tb2RlbHMvZ2FzLW1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGdEQUFtRDtBQUluRCxzRUFVMkM7QUFlM0MsZ0VBQWdFO0FBQ2hFLHFFQUFxRTtBQUNyRSw0RUFBNEU7QUFDL0QsUUFBQSxtQkFBbUIsR0FBdUM7SUFDckUsQ0FBQyxrQkFBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsNEJBQVcsRUFBRSw2QkFBWSxFQUFFLDZCQUFZLENBQUM7SUFDNUQsQ0FBQyxrQkFBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsMkJBQVUsRUFBRSw0QkFBVyxFQUFFLDRCQUFXLEVBQUUsNEJBQVcsQ0FBQztJQUNyRSxDQUFDLGtCQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyw2QkFBWSxFQUFFLDRCQUFXLENBQUM7SUFDOUMsQ0FBQyxrQkFBTyxDQUFDLFVBQVUsQ0FBQyxFQUFDLENBQUMsZ0NBQWUsQ0FBQztDQUN2QyxDQUFDO0FBNERGOzs7Ozs7Ozs7O0dBVUc7QUFDSCxNQUFzQixrQkFBa0I7Q0FRdkM7QUFSRCxnREFRQztBQUVEOzs7Ozs7Ozs7O0dBVUc7QUFDSCxNQUFzQix1QkFBdUI7Q0FhNUM7QUFiRCwwREFhQyJ9