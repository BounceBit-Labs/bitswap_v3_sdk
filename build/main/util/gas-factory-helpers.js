"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSwapRouteFromExisting = exports.calculateGasUsed = exports.getL2ToL1GasUsed = exports.calculateOptimismToL1FeeFromCalldata = exports.calculateArbitrumToL1FeeFromCalldata = exports.getGasCostInQuoteToken = exports.getGasCostInNativeCurrency = exports.getGasCostInUSD = exports.getHighestLiquidityV3USDPool = exports.getHighestLiquidityV3NativePool = exports.getV2NativePool = void 0;
const bignumber_1 = require("@ethersproject/bignumber");
const router_sdk_1 = require("@uniswap/router-sdk");
const sdk_core_1 = require("@uniswap/sdk-core");
const v3_sdk_1 = require("@uniswap/v3-sdk");
const jsbi_1 = __importDefault(require("jsbi"));
const lodash_1 = __importDefault(require("lodash"));
const routers_1 = require("../routers");
const util_1 = require("../util");
const methodParameters_1 = require("./methodParameters");
async function getV2NativePool(token, poolProvider, providerConfig) {
    const chainId = token.chainId;
    const weth = util_1.WRAPPED_NATIVE_CURRENCY[chainId];
    const poolAccessor = await poolProvider.getPools([[weth, token]], providerConfig);
    const pool = poolAccessor.getPool(weth, token);
    if (!pool || pool.reserve0.equalTo(0) || pool.reserve1.equalTo(0)) {
        util_1.log.error({
            weth,
            token,
            reserve0: pool === null || pool === void 0 ? void 0 : pool.reserve0.toExact(),
            reserve1: pool === null || pool === void 0 ? void 0 : pool.reserve1.toExact(),
        }, `Could not find a valid WETH V2 pool with ${token.symbol} for computing gas costs.`);
        return null;
    }
    return pool;
}
exports.getV2NativePool = getV2NativePool;
async function getHighestLiquidityV3NativePool(token, poolProvider, providerConfig) {
    const nativeCurrency = util_1.WRAPPED_NATIVE_CURRENCY[token.chainId];
    const nativePools = (0, lodash_1.default)([
        v3_sdk_1.FeeAmount.HIGH,
        v3_sdk_1.FeeAmount.MEDIUM,
        v3_sdk_1.FeeAmount.LOW,
        v3_sdk_1.FeeAmount.LOWEST,
    ])
        .map((feeAmount) => {
        return [nativeCurrency, token, feeAmount];
    })
        .value();
    const poolAccessor = await poolProvider.getPools(nativePools, providerConfig);
    const pools = (0, lodash_1.default)([
        v3_sdk_1.FeeAmount.HIGH,
        v3_sdk_1.FeeAmount.MEDIUM,
        v3_sdk_1.FeeAmount.LOW,
        v3_sdk_1.FeeAmount.LOWEST,
    ])
        .map((feeAmount) => {
        return poolAccessor.getPool(nativeCurrency, token, feeAmount);
    })
        .compact()
        .value();
    if (pools.length == 0) {
        util_1.log.error({ pools }, `Could not find a ${nativeCurrency.symbol} pool with ${token.symbol} for computing gas costs.`);
        return null;
    }
    const maxPool = pools.reduce((prev, current) => {
        return jsbi_1.default.greaterThan(prev.liquidity, current.liquidity) ? prev : current;
    });
    return maxPool;
}
exports.getHighestLiquidityV3NativePool = getHighestLiquidityV3NativePool;
async function getHighestLiquidityV3USDPool(
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
chainId, 
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
poolProvider, 
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
providerConfig) {
    // const usdTokens = usdGasTokensByChain[chainId];
    // const wrappedCurrency = WRAPPED_NATIVE_CURRENCY[chainId]!;
    // if (!usdTokens) {
    //   throw new Error(
    //     `Could not find a USD token for computing gas costs on ${chainId}`
    //   );
    // }
    // const usdPools = _([
    //   FeeAmount.HIGH,
    //   FeeAmount.MEDIUM,
    //   FeeAmount.LOW,
    //   FeeAmount.LOWEST,
    // ])
    //   .flatMap((feeAmount) => {
    //     return _.map<Token, [Token, Token, FeeAmount]>(usdTokens, (usdToken) => [
    //       wrappedCurrency,
    //       usdToken,
    //       feeAmount,
    //     ]);
    //   })
    //   .value();
    // const poolAccessor = await poolProvider.getPools(usdPools, providerConfig);
    // const pools = _([
    //   FeeAmount.HIGH,
    //   FeeAmount.MEDIUM,
    //   FeeAmount.LOW,
    //   FeeAmount.LOWEST,
    // ])
    //   .flatMap((feeAmount) => {
    //     const pools = [];
    //     for (const usdToken of usdTokens) {
    //       const pool = poolAccessor.getPool(wrappedCurrency, usdToken, feeAmount);
    //       if (pool) {
    //         pools.push(pool);
    //       }
    //     }
    //     return pools;
    //   })
    //   .compact()
    //   .value();
    // if (pools.length == 0) {
    //   const message = `Could not find a USD/${wrappedCurrency.symbol} pool for computing gas costs.`;
    //   log.error({ pools }, message);
    //   throw new Error(message);
    // }
    // const maxPool = pools.reduce((prev, current) => {
    //   return JSBI.greaterThan(prev.liquidity, current.liquidity) ? prev : current;
    // });
    // return maxPool;
    return JSON.parse('{"token0":{"chainId":6000,"decimals":18,"symbol":"WBB","name":"Wrapped BB","isNative":false,"isToken":true,"address":"0x2Fe2C332E5F72F0AC76e82BaDD8261B8FbcFDFe3"},"token1":{"chainId":6000,"decimals":18,"symbol":"TOKEN1","name":"Token1","isNative":false,"isToken":true,"address":"0x94F97Eb85f56Ad0364da734b8c9fC7893573aAc2"},"fee":10000,"sqrtRatioX96":[747417047,249988863,299562288],"liquidity":[857697650,353606788],"tickCurrent":-108715,"tickDataProvider":{}}');
}
exports.getHighestLiquidityV3USDPool = getHighestLiquidityV3USDPool;
function getGasCostInUSD(usdPool, costNativeCurrency) {
    const nativeCurrency = costNativeCurrency.currency;
    // convert fee into usd
    const nativeTokenPrice = usdPool.token0.address == nativeCurrency.address
        ? usdPool.token0Price
        : usdPool.token1Price;
    const gasCostUSD = nativeTokenPrice.quote(costNativeCurrency);
    return gasCostUSD;
}
exports.getGasCostInUSD = getGasCostInUSD;
function getGasCostInNativeCurrency(nativeCurrency, gasCostInWei) {
    // wrap fee to native currency
    const costNativeCurrency = sdk_core_1.CurrencyAmount.fromRawAmount(nativeCurrency, gasCostInWei.toString());
    return costNativeCurrency;
}
exports.getGasCostInNativeCurrency = getGasCostInNativeCurrency;
async function getGasCostInQuoteToken(quoteToken, nativePool, costNativeCurrency) {
    const nativeTokenPrice = nativePool.token0.address == quoteToken.address
        ? nativePool.token1Price
        : nativePool.token0Price;
    const gasCostQuoteToken = nativeTokenPrice.quote(costNativeCurrency);
    return gasCostQuoteToken;
}
exports.getGasCostInQuoteToken = getGasCostInQuoteToken;
function calculateArbitrumToL1FeeFromCalldata(calldata, gasData) {
    const { perL2TxFee, perL1CalldataFee } = gasData;
    // calculates gas amounts based on bytes of calldata, use 0 as overhead.
    const l1GasUsed = getL2ToL1GasUsed(calldata, bignumber_1.BigNumber.from(0));
    // multiply by the fee per calldata and add the flat l2 fee
    let l1Fee = l1GasUsed.mul(perL1CalldataFee);
    l1Fee = l1Fee.add(perL2TxFee);
    return [l1GasUsed, l1Fee];
}
exports.calculateArbitrumToL1FeeFromCalldata = calculateArbitrumToL1FeeFromCalldata;
function calculateOptimismToL1FeeFromCalldata(calldata, gasData) {
    const { l1BaseFee, scalar, decimals, overhead } = gasData;
    const l1GasUsed = getL2ToL1GasUsed(calldata, overhead);
    // l1BaseFee is L1 Gas Price on etherscan
    const l1Fee = l1GasUsed.mul(l1BaseFee);
    const unscaled = l1Fee.mul(scalar);
    // scaled = unscaled / (10 ** decimals)
    const scaledConversion = bignumber_1.BigNumber.from(10).pow(decimals);
    const scaled = unscaled.div(scaledConversion);
    return [l1GasUsed, scaled];
}
exports.calculateOptimismToL1FeeFromCalldata = calculateOptimismToL1FeeFromCalldata;
// based on the code from the optimism OVM_GasPriceOracle contract
function getL2ToL1GasUsed(data, overhead) {
    // data is hex encoded
    const dataArr = data.slice(2).match(/.{1,2}/g);
    const numBytes = dataArr.length;
    let count = 0;
    for (let i = 0; i < numBytes; i += 1) {
        const byte = parseInt(dataArr[i], 16);
        if (byte == 0) {
            count += 4;
        }
        else {
            count += 16;
        }
    }
    const unsigned = overhead.add(count);
    const signedConversion = 68 * 16;
    return unsigned.add(signedConversion);
}
exports.getL2ToL1GasUsed = getL2ToL1GasUsed;
async function calculateGasUsed(chainId, route, simulatedGasUsed, v2PoolProvider, v3PoolProvider, providerConfig) {
    const quoteToken = route.quote.currency.wrapped;
    const gasPriceWei = route.gasPriceWei;
    // calculate L2 to L1 security fee if relevant
    const l2toL1FeeInWei = bignumber_1.BigNumber.from(0);
    // add l2 to l1 fee and wrap fee to native currency
    const gasCostInWei = gasPriceWei.mul(simulatedGasUsed).add(l2toL1FeeInWei);
    const nativeCurrency = util_1.WRAPPED_NATIVE_CURRENCY[chainId];
    const costNativeCurrency = getGasCostInNativeCurrency(nativeCurrency, gasCostInWei);
    const usdPool = await getHighestLiquidityV3USDPool(chainId, v3PoolProvider, providerConfig);
    const gasCostUSD = await getGasCostInUSD(usdPool, costNativeCurrency);
    let gasCostQuoteToken = costNativeCurrency;
    // get fee in terms of quote token
    if (!quoteToken.equals(nativeCurrency)) {
        const nativePools = await Promise.all([
            getHighestLiquidityV3NativePool(quoteToken, v3PoolProvider, providerConfig),
            getV2NativePool(quoteToken, v2PoolProvider, providerConfig),
        ]);
        const nativePool = nativePools.find((pool) => pool !== null);
        if (!nativePool) {
            util_1.log.info('Could not find any V2 or V3 pools to convert the cost into the quote token');
            gasCostQuoteToken = sdk_core_1.CurrencyAmount.fromRawAmount(quoteToken, 0);
        }
        else {
            gasCostQuoteToken = await getGasCostInQuoteToken(quoteToken, nativePool, costNativeCurrency);
        }
    }
    // Adjust quote for gas fees
    let quoteGasAdjusted;
    if (route.trade.tradeType == sdk_core_1.TradeType.EXACT_OUTPUT) {
        // Exact output - need more of tokenIn to get the desired amount of tokenOut
        quoteGasAdjusted = route.quote.add(gasCostQuoteToken);
    }
    else {
        // Exact input - can get less of tokenOut due to fees
        quoteGasAdjusted = route.quote.subtract(gasCostQuoteToken);
    }
    return {
        estimatedGasUsedUSD: gasCostUSD,
        estimatedGasUsedQuoteToken: gasCostQuoteToken,
        quoteGasAdjusted: quoteGasAdjusted,
    };
}
exports.calculateGasUsed = calculateGasUsed;
function initSwapRouteFromExisting(swapRoute, v2PoolProvider, v3PoolProvider, portionProvider, quoteGasAdjusted, estimatedGasUsed, estimatedGasUsedQuoteToken, estimatedGasUsedUSD, swapOptions) {
    const currencyIn = swapRoute.trade.inputAmount.currency;
    const currencyOut = swapRoute.trade.outputAmount.currency;
    const tradeType = swapRoute.trade.tradeType.valueOf()
        ? sdk_core_1.TradeType.EXACT_OUTPUT
        : sdk_core_1.TradeType.EXACT_INPUT;
    const routesWithValidQuote = swapRoute.route.map((route) => {
        switch (route.protocol) {
            case router_sdk_1.Protocol.V3:
                return new routers_1.V3RouteWithValidQuote({
                    amount: sdk_core_1.CurrencyAmount.fromFractionalAmount(route.amount.currency, route.amount.numerator, route.amount.denominator),
                    rawQuote: bignumber_1.BigNumber.from(route.rawQuote),
                    sqrtPriceX96AfterList: route.sqrtPriceX96AfterList.map((num) => bignumber_1.BigNumber.from(num)),
                    initializedTicksCrossedList: [...route.initializedTicksCrossedList],
                    quoterGasEstimate: bignumber_1.BigNumber.from(route.gasEstimate),
                    percent: route.percent,
                    route: route.route,
                    gasModel: route.gasModel,
                    quoteToken: new sdk_core_1.Token(currencyIn.chainId, route.quoteToken.address, route.quoteToken.decimals, route.quoteToken.symbol, route.quoteToken.name),
                    tradeType: tradeType,
                    v3PoolProvider: v3PoolProvider,
                });
            case router_sdk_1.Protocol.V2:
                return new routers_1.V2RouteWithValidQuote({
                    amount: sdk_core_1.CurrencyAmount.fromFractionalAmount(route.amount.currency, route.amount.numerator, route.amount.denominator),
                    rawQuote: bignumber_1.BigNumber.from(route.rawQuote),
                    percent: route.percent,
                    route: route.route,
                    gasModel: route.gasModel,
                    quoteToken: new sdk_core_1.Token(currencyIn.chainId, route.quoteToken.address, route.quoteToken.decimals, route.quoteToken.symbol, route.quoteToken.name),
                    tradeType: tradeType,
                    v2PoolProvider: v2PoolProvider,
                });
            case router_sdk_1.Protocol.MIXED:
                return new routers_1.MixedRouteWithValidQuote({
                    amount: sdk_core_1.CurrencyAmount.fromFractionalAmount(route.amount.currency, route.amount.numerator, route.amount.denominator),
                    rawQuote: bignumber_1.BigNumber.from(route.rawQuote),
                    sqrtPriceX96AfterList: route.sqrtPriceX96AfterList.map((num) => bignumber_1.BigNumber.from(num)),
                    initializedTicksCrossedList: [...route.initializedTicksCrossedList],
                    quoterGasEstimate: bignumber_1.BigNumber.from(route.gasEstimate),
                    percent: route.percent,
                    route: route.route,
                    mixedRouteGasModel: route.gasModel,
                    v2PoolProvider,
                    quoteToken: new sdk_core_1.Token(currencyIn.chainId, route.quoteToken.address, route.quoteToken.decimals, route.quoteToken.symbol, route.quoteToken.name),
                    tradeType: tradeType,
                    v3PoolProvider: v3PoolProvider,
                });
        }
    });
    const trade = (0, methodParameters_1.buildTrade)(currencyIn, currencyOut, tradeType, routesWithValidQuote);
    const quoteGasAndPortionAdjusted = swapRoute.portionAmount
        ? portionProvider.getQuoteGasAndPortionAdjusted(swapRoute.trade.tradeType, quoteGasAdjusted, swapRoute.portionAmount)
        : undefined;
    const routesWithValidQuotePortionAdjusted = portionProvider.getRouteWithQuotePortionAdjusted(swapRoute.trade.tradeType, routesWithValidQuote, swapOptions);
    return {
        quote: swapRoute.quote,
        quoteGasAdjusted,
        quoteGasAndPortionAdjusted,
        estimatedGasUsed,
        estimatedGasUsedQuoteToken,
        estimatedGasUsedUSD,
        gasPriceWei: bignumber_1.BigNumber.from(swapRoute.gasPriceWei),
        trade,
        route: routesWithValidQuotePortionAdjusted,
        blockNumber: bignumber_1.BigNumber.from(swapRoute.blockNumber),
        methodParameters: swapRoute.methodParameters
            ? {
                calldata: swapRoute.methodParameters.calldata,
                value: swapRoute.methodParameters.value,
                to: swapRoute.methodParameters.to,
            }
            : undefined,
        simulationStatus: swapRoute.simulationStatus,
        portionAmount: swapRoute.portionAmount,
    };
}
exports.initSwapRouteFromExisting = initSwapRouteFromExisting;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FzLWZhY3RvcnktaGVscGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlsL2dhcy1mYWN0b3J5LWhlbHBlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0RBQXFEO0FBQ3JELG9EQUErQztBQUMvQyxnREFNMkI7QUFFM0IsNENBQWtEO0FBQ2xELGdEQUF3QjtBQUN4QixvREFBdUI7QUFVdkIsd0NBUW9CO0FBQ3BCLGtDQUF1RDtBQUV2RCx5REFBZ0Q7QUFFekMsS0FBSyxVQUFVLGVBQWUsQ0FDbkMsS0FBWSxFQUNaLFlBQTZCLEVBQzdCLGNBQStCO0lBRS9CLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFrQixDQUFDO0lBQ3pDLE1BQU0sSUFBSSxHQUFHLDhCQUF1QixDQUFDLE9BQU8sQ0FBRSxDQUFDO0lBRS9DLE1BQU0sWUFBWSxHQUFHLE1BQU0sWUFBWSxDQUFDLFFBQVEsQ0FDOUMsQ0FBQyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUNmLGNBQWMsQ0FDZixDQUFDO0lBQ0YsTUFBTSxJQUFJLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFFL0MsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUNqRSxVQUFHLENBQUMsS0FBSyxDQUNQO1lBQ0UsSUFBSTtZQUNKLEtBQUs7WUFDTCxRQUFRLEVBQUUsSUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLFFBQVEsQ0FBQyxPQUFPLEVBQUU7WUFDbEMsUUFBUSxFQUFFLElBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxRQUFRLENBQUMsT0FBTyxFQUFFO1NBQ25DLEVBQ0QsNENBQTRDLEtBQUssQ0FBQyxNQUFN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