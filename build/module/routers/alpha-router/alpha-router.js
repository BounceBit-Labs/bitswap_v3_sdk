import { BigNumber } from '@ethersproject/bignumber';
import { JsonRpcProvider } from '@ethersproject/providers';
import DEFAULT_TOKEN_LIST from '@uniswap/default-token-list';
import { Protocol, SwapRouter, ZERO } from '@uniswap/router-sdk';
import { ChainId, Fraction, TradeType, } from '@uniswap/sdk-core';
import { Pool, Position, SqrtPriceMath, TickMath } from '@uniswap/v3-sdk';
import retry from 'async-retry';
import JSBI from 'jsbi';
import _ from 'lodash';
import NodeCache from 'node-cache';
import { CachedRoutes, CacheMode, CachingGasStationProvider, CachingTokenProviderWithFallback, CachingV2PoolProvider, 
// CachingV2SubgraphProvider,
CachingV3PoolProvider, 
// CachingV3SubgraphProvider,
EIP1559GasPriceProvider, ETHGasStationInfoProvider, LegacyGasPriceProvider, NodeJSCache, OnChainGasPriceProvider, OnChainQuoteProvider, StaticV2SubgraphProvider, StaticV3SubgraphProvider, SwapRouterProvider, TokenPropertiesProvider, UniswapMulticallProvider, 
// URISubgraphProvider,
V2QuoteProvider, V2SubgraphProviderWithFallBacks, V3SubgraphProviderWithFallBacks, } from '../../providers';
import { CachingTokenListProvider, } from '../../providers/caching-token-list-provider';
import { PortionProvider, } from '../../providers/portion-provider';
import { OnChainTokenFeeFetcher } from '../../providers/token-fee-fetcher';
import { TokenProvider } from '../../providers/token-provider';
import { TokenValidatorProvider, } from '../../providers/token-validator-provider';
import { V2PoolProvider, } from '../../providers/v2/pool-provider';
import { V3PoolProvider, } from '../../providers/v3/pool-provider';
import { Erc20__factory } from '../../types/other/factories/Erc20__factory';
import { SWAP_ROUTER_02_ADDRESSES, WRAPPED_NATIVE_CURRENCY } from '../../util';
import { CurrencyAmount } from '../../util/amounts';
import { ID_TO_CHAIN_ID, 
// ID_TO_NETWORK_NAME,
V2_SUPPORTED, } from '../../util/chains';
import { getHighestLiquidityV3NativePool, getHighestLiquidityV3USDPool, } from '../../util/gas-factory-helpers';
import { log } from '../../util/log';
import { buildSwapMethodParameters, buildTrade, } from '../../util/methodParameters';
import { metric, MetricLoggerUnit } from '../../util/metric';
import { UNSUPPORTED_TOKENS } from '../../util/unsupported-tokens';
import { SwapToRatioStatus, } from '../router';
import { DEFAULT_ROUTING_CONFIG_BY_CHAIN, ETH_GAS_STATION_API_URL, } from './config';
import { getBestSwapRoute } from './functions/best-swap-route';
import { calculateRatioAmountIn } from './functions/calculate-ratio-amount-in';
import { getV2CandidatePools, getV3CandidatePools, } from './functions/get-candidate-pools';
import { MixedRouteHeuristicGasModelFactory } from './gas-models/mixedRoute/mixed-route-heuristic-gas-model';
import { V2HeuristicGasModelFactory } from './gas-models/v2/v2-heuristic-gas-model';
import { NATIVE_OVERHEAD } from './gas-models/v3/gas-costs';
import { V3HeuristicGasModelFactory } from './gas-models/v3/v3-heuristic-gas-model';
import { MixedQuoter, V2Quoter, V3Quoter } from './quoters';
export class MapWithLowerCaseKey extends Map {
    set(key, value) {
        return super.set(key.toLowerCase(), value);
    }
}
export class LowerCaseStringArray extends Array {
    constructor(...items) {
        // Convert all items to lowercase before calling the parent constructor
        super(...items.map((item) => item.toLowerCase()));
    }
}
export class AlphaRouter {
    constructor({ chainId, provider, multicall2Provider, v3PoolProvider, onChainQuoteProvider, v2PoolProvider, v2QuoteProvider, v2SubgraphProvider, tokenProvider, blockedTokenListProvider, v3SubgraphProvider, gasPriceProvider, v3GasModelFactory, v2GasModelFactory, mixedRouteGasModelFactory, swapRouterProvider, tokenValidatorProvider, simulator, routeCachingProvider, tokenPropertiesProvider, portionProvider, }) {
        this.chainId = chainId;
        this.provider = provider;
        this.multicall2Provider =
            multicall2Provider !== null && multicall2Provider !== void 0 ? multicall2Provider : new UniswapMulticallProvider(chainId, provider, 375000);
        this.v3PoolProvider =
            v3PoolProvider !== null && v3PoolProvider !== void 0 ? v3PoolProvider : new CachingV3PoolProvider(this.chainId, new V3PoolProvider(ID_TO_CHAIN_ID(chainId), this.multicall2Provider), new NodeJSCache(new NodeCache({ stdTTL: 360, useClones: false })));
        this.simulator = simulator;
        this.routeCachingProvider = routeCachingProvider;
        if (onChainQuoteProvider) {
            this.onChainQuoteProvider = onChainQuoteProvider;
        }
        else {
            switch (chainId) {
                default:
                    this.onChainQuoteProvider = new OnChainQuoteProvider(chainId, provider, this.multicall2Provider, {
                        retries: 2,
                        minTimeout: 100,
                        maxTimeout: 1000,
                    }, {
                        multicallChunk: 210,
                        gasLimitPerCall: 705000,
                        quoteMinSuccessRate: 0.15,
                    }, {
                        gasLimitOverride: 2000000,
                        multicallChunk: 70,
                    });
                    break;
            }
        }
        if (tokenValidatorProvider) {
            this.tokenValidatorProvider = tokenValidatorProvider;
        }
        else if (this.chainId === ChainId.MAINNET) {
            this.tokenValidatorProvider = new TokenValidatorProvider(this.chainId, this.multicall2Provider, new NodeJSCache(new NodeCache({ stdTTL: 30000, useClones: false })));
        }
        if (tokenPropertiesProvider) {
            this.tokenPropertiesProvider = tokenPropertiesProvider;
        }
        else {
            this.tokenPropertiesProvider = new TokenPropertiesProvider(this.chainId, new NodeJSCache(new NodeCache({ stdTTL: 86400, useClones: false })), new OnChainTokenFeeFetcher(this.chainId, provider));
        }
        this.v2PoolProvider =
            v2PoolProvider !== null && v2PoolProvider !== void 0 ? v2PoolProvider : new CachingV2PoolProvider(chainId, new V2PoolProvider(chainId, this.multicall2Provider, this.tokenPropertiesProvider), new NodeJSCache(new NodeCache({ stdTTL: 60, useClones: false })));
        this.v2QuoteProvider = v2QuoteProvider !== null && v2QuoteProvider !== void 0 ? v2QuoteProvider : new V2QuoteProvider();
        this.blockedTokenListProvider =
            blockedTokenListProvider !== null && blockedTokenListProvider !== void 0 ? blockedTokenListProvider : new CachingTokenListProvider(chainId, UNSUPPORTED_TOKENS, new NodeJSCache(new NodeCache({ stdTTL: 3600, useClones: false })));
        this.tokenProvider =
            tokenProvider !== null && tokenProvider !== void 0 ? tokenProvider : new CachingTokenProviderWithFallback(chainId, new NodeJSCache(new NodeCache({ stdTTL: 3600, useClones: false })), new CachingTokenListProvider(chainId, DEFAULT_TOKEN_LIST, new NodeJSCache(new NodeCache({ stdTTL: 3600, useClones: false }))), new TokenProvider(chainId, this.multicall2Provider));
        this.portionProvider = portionProvider !== null && portionProvider !== void 0 ? portionProvider : new PortionProvider();
        // const chainName = ID_TO_NETWORK_NAME(chainId);
        // ipfs urls in the following format: `https://cloudflare-ipfs.com/ipns/api.uniswap.org/v1/pools/${protocol}/${chainName}.json`;
        if (v2SubgraphProvider) {
            this.v2SubgraphProvider = v2SubgraphProvider;
        }
        else {
            this.v2SubgraphProvider = new V2SubgraphProviderWithFallBacks([
                // new CachingV2SubgraphProvider(
                //   chainId,
                //   new URISubgraphProvider(
                //     chainId,
                //     `https://cloudflare-ipfs.com/ipns/api.uniswap.org/v1/pools/v2/${chainName}.json`,
                //     undefined,
                //     0
                //   ),
                //   new NodeJSCache(new NodeCache({ stdTTL: 300, useClones: false }))
                // ),
                new StaticV2SubgraphProvider(chainId),
            ]);
        }
        if (v3SubgraphProvider) {
            this.v3SubgraphProvider = v3SubgraphProvider;
        }
        else {
            this.v3SubgraphProvider = new V3SubgraphProviderWithFallBacks([
                // new CachingV3SubgraphProvider(
                //   chainId,
                //   new URISubgraphProvider(
                //     chainId,
                //     `https://cloudflare-ipfs.com/ipns/api.uniswap.org/v1/pools/v3/${chainName}.json`,
                //     undefined,
                //     0
                //   ),
                //   new NodeJSCache(new NodeCache({ stdTTL: 300, useClones: false }))
                // ),
                new StaticV3SubgraphProvider(chainId, this.v3PoolProvider),
            ]);
        }
        let gasPriceProviderInstance;
        console.log('this.provider', this.provider);
        if (JsonRpcProvider.isProvider(this.provider)) {
            gasPriceProviderInstance = new OnChainGasPriceProvider(chainId, new EIP1559GasPriceProvider(this.provider), new LegacyGasPriceProvider(this.provider));
        }
        else {
            console.log('this.provider', this.provider, JsonRpcProvider.isProvider(this.provider));
            gasPriceProviderInstance = new ETHGasStationInfoProvider(ETH_GAS_STATION_API_URL);
        }
        this.gasPriceProvider =
            gasPriceProvider !== null && gasPriceProvider !== void 0 ? gasPriceProvider : new CachingGasStationProvider(chainId, gasPriceProviderInstance, new NodeJSCache(new NodeCache({ stdTTL: 7, useClones: false })));
        this.v3GasModelFactory =
            v3GasModelFactory !== null && v3GasModelFactory !== void 0 ? v3GasModelFactory : new V3HeuristicGasModelFactory();
        this.v2GasModelFactory =
            v2GasModelFactory !== null && v2GasModelFactory !== void 0 ? v2GasModelFactory : new V2HeuristicGasModelFactory();
        this.mixedRouteGasModelFactory =
            mixedRouteGasModelFactory !== null && mixedRouteGasModelFactory !== void 0 ? mixedRouteGasModelFactory : new MixedRouteHeuristicGasModelFactory();
        this.swapRouterProvider =
            swapRouterProvider !== null && swapRouterProvider !== void 0 ? swapRouterProvider : new SwapRouterProvider(this.multicall2Provider, this.chainId);
        // Initialize the Quoters.
        // Quoters are an abstraction encapsulating the business logic of fetching routes and quotes.
        this.v2Quoter = new V2Quoter(this.v2SubgraphProvider, this.v2PoolProvider, this.v2QuoteProvider, this.v2GasModelFactory, this.tokenProvider, this.chainId, this.blockedTokenListProvider, this.tokenValidatorProvider);
        this.v3Quoter = new V3Quoter(this.v3SubgraphProvider, this.v3PoolProvider, this.onChainQuoteProvider, this.tokenProvider, this.chainId, this.blockedTokenListProvider, this.tokenValidatorProvider);
        this.mixedQuoter = new MixedQuoter(this.v3SubgraphProvider, this.v3PoolProvider, this.v2SubgraphProvider, this.v2PoolProvider, this.onChainQuoteProvider, this.tokenProvider, this.chainId, this.blockedTokenListProvider, this.tokenValidatorProvider);
    }
    async routeToRatio(token0Balance, token1Balance, position, swapAndAddConfig, swapAndAddOptions, routingConfig = DEFAULT_ROUTING_CONFIG_BY_CHAIN(this.chainId)) {
        if (token1Balance.currency.wrapped.sortsBefore(token0Balance.currency.wrapped)) {
            [token0Balance, token1Balance] = [token1Balance, token0Balance];
        }
        let preSwapOptimalRatio = this.calculateOptimalRatio(position, position.pool.sqrtRatioX96, true);
        // set up parameters according to which token will be swapped
        let zeroForOne;
        if (position.pool.tickCurrent > position.tickUpper) {
            zeroForOne = true;
        }
        else if (position.pool.tickCurrent < position.tickLower) {
            zeroForOne = false;
        }
        else {
            zeroForOne = new Fraction(token0Balance.quotient, token1Balance.quotient).greaterThan(preSwapOptimalRatio);
            if (!zeroForOne)
                preSwapOptimalRatio = preSwapOptimalRatio.invert();
        }
        const [inputBalance, outputBalance] = zeroForOne
            ? [token0Balance, token1Balance]
            : [token1Balance, token0Balance];
        let optimalRatio = preSwapOptimalRatio;
        let postSwapTargetPool = position.pool;
        let exchangeRate = zeroForOne
            ? position.pool.token0Price
            : position.pool.token1Price;
        let swap = null;
        let ratioAchieved = false;
        let n = 0;
        // iterate until we find a swap with a sufficient ratio or return null
        while (!ratioAchieved) {
            n++;
            if (n > swapAndAddConfig.maxIterations) {
                log.info('max iterations exceeded');
                return {
                    status: SwapToRatioStatus.NO_ROUTE_FOUND,
                    error: 'max iterations exceeded',
                };
            }
            const amountToSwap = calculateRatioAmountIn(optimalRatio, exchangeRate, inputBalance, outputBalance);
            if (amountToSwap.equalTo(0)) {
                log.info(`no swap needed: amountToSwap = 0`);
                return {
                    status: SwapToRatioStatus.NO_SWAP_NEEDED,
                };
            }
            swap = await this.route(amountToSwap, outputBalance.currency, TradeType.EXACT_INPUT, undefined, {
                ...DEFAULT_ROUTING_CONFIG_BY_CHAIN(this.chainId),
                ...routingConfig,
                /// @dev We do not want to query for mixedRoutes for routeToRatio as they are not supported
                /// [Protocol.V3, Protocol.V2] will make sure we only query for V3 and V2
                protocols: [Protocol.V3, Protocol.V2],
            });
            if (!swap) {
                log.info('no route found from this.route()');
                return {
                    status: SwapToRatioStatus.NO_ROUTE_FOUND,
                    error: 'no route found',
                };
            }
            const inputBalanceUpdated = inputBalance.subtract(swap.trade.inputAmount);
            const outputBalanceUpdated = outputBalance.add(swap.trade.outputAmount);
            const newRatio = inputBalanceUpdated.divide(outputBalanceUpdated);
            let targetPoolPriceUpdate;
            swap.route.forEach((route) => {
                if (route.protocol === Protocol.V3) {
                    const v3Route = route;
                    v3Route.route.pools.forEach((pool, i) => {
                        if (pool.token0.equals(position.pool.token0) &&
                            pool.token1.equals(position.pool.token1) &&
                            pool.fee === position.pool.fee) {
                            targetPoolPriceUpdate = JSBI.BigInt(v3Route.sqrtPriceX96AfterList[i].toString());
                            optimalRatio = this.calculateOptimalRatio(position, JSBI.BigInt(targetPoolPriceUpdate.toString()), zeroForOne);
                        }
                    });
                }
            });
            if (!targetPoolPriceUpdate) {
                optimalRatio = preSwapOptimalRatio;
            }
            ratioAchieved =
                newRatio.equalTo(optimalRatio) ||
                    this.absoluteValue(newRatio.asFraction.divide(optimalRatio).subtract(1)).lessThan(swapAndAddConfig.ratioErrorTolerance);
            if (ratioAchieved && targetPoolPriceUpdate) {
                postSwapTargetPool = new Pool(position.pool.token0, position.pool.token1, position.pool.fee, targetPoolPriceUpdate, position.pool.liquidity, TickMath.getTickAtSqrtRatio(targetPoolPriceUpdate), position.pool.tickDataProvider);
            }
            exchangeRate = swap.trade.outputAmount.divide(swap.trade.inputAmount);
            log.info({
                exchangeRate: exchangeRate.asFraction.toFixed(18),
                optimalRatio: optimalRatio.asFraction.toFixed(18),
                newRatio: newRatio.asFraction.toFixed(18),
                inputBalanceUpdated: inputBalanceUpdated.asFraction.toFixed(18),
                outputBalanceUpdated: outputBalanceUpdated.asFraction.toFixed(18),
                ratioErrorTolerance: swapAndAddConfig.ratioErrorTolerance.toFixed(18),
                iterationN: n.toString(),
            }, 'QuoteToRatio Iteration Parameters');
            if (exchangeRate.equalTo(0)) {
                log.info('exchangeRate to 0');
                return {
                    status: SwapToRatioStatus.NO_ROUTE_FOUND,
                    error: 'insufficient liquidity to swap to optimal ratio',
                };
            }
        }
        if (!swap) {
            return {
                status: SwapToRatioStatus.NO_ROUTE_FOUND,
                error: 'no route found',
            };
        }
        let methodParameters;
        if (swapAndAddOptions) {
            methodParameters = await this.buildSwapAndAddMethodParameters(swap.trade, swapAndAddOptions, {
                initialBalanceTokenIn: inputBalance,
                initialBalanceTokenOut: outputBalance,
                preLiquidityPosition: position,
            });
        }
        return {
            status: SwapToRatioStatus.SUCCESS,
            result: { ...swap, methodParameters, optimalRatio, postSwapTargetPool },
        };
    }
    /**
     * @inheritdoc IRouter
     */
    async route(amount, quoteCurrency, tradeType, swapConfig, partialRoutingConfig = {}, externalGasPriceWei) {
        var _a, _c, _d, _e;
        const originalAmount = amount;
        if (tradeType === TradeType.EXACT_OUTPUT) {
            const portionAmount = this.portionProvider.getPortionAmount(amount, tradeType, swapConfig);
            if (portionAmount && portionAmount.greaterThan(ZERO)) {
                // In case of exact out swap, before we route, we need to make sure that the
                // token out amount accounts for flat portion, and token in amount after the best swap route contains the token in equivalent of portion.
                // In other words, in case a pool's LP fee bps is lower than the portion bps (0.01%/0.05% for v3), a pool can go insolvency.
                // This is because instead of the swapper being responsible for the portion,
                // the pool instead gets responsible for the portion.
                // The addition below avoids that situation.
                amount = amount.add(portionAmount);
            }
        }
        const { currencyIn, currencyOut } = this.determineCurrencyInOutFromTradeType(tradeType, amount, quoteCurrency);
        const tokenIn = currencyIn.wrapped;
        const tokenOut = currencyOut.wrapped;
        metric.setProperty('chainId', this.chainId);
        metric.setProperty('pair', `${tokenIn.symbol}/${tokenOut.symbol}`);
        metric.setProperty('tokenIn', tokenIn.address);
        metric.setProperty('tokenOut', tokenOut.address);
        metric.setProperty('tradeType', tradeType === TradeType.EXACT_INPUT ? 'ExactIn' : 'ExactOut');
        metric.putMetric(`QuoteRequestedForChain${this.chainId}`, 1, MetricLoggerUnit.Count);
        // Get a block number to specify in all our calls. Ensures data we fetch from chain is
        // from the same block.
        const blockNumber = (_a = partialRoutingConfig.blockNumber) !== null && _a !== void 0 ? _a : await this.getBlockNumberPromise();
        const routingConfig = _.merge({
            // These settings could be changed by the partialRoutingConfig
            useCachedRoutes: true,
            writeToCachedRoutes: true,
            optimisticCachedRoutes: false,
            overwriteCacheMode: CacheMode.Livemode
        }, DEFAULT_ROUTING_CONFIG_BY_CHAIN(this.chainId), partialRoutingConfig, { blockNumber });
        if (routingConfig.debugRouting) {
            log.warn(`Finalized routing config is ${JSON.stringify(routingConfig)}`);
        }
        const gasPriceWei = externalGasPriceWei ? BigNumber.from(externalGasPriceWei) : await this.getGasPriceWei();
        const quoteToken = quoteCurrency.wrapped;
        const providerConfig = {
            ...routingConfig,
            blockNumber,
            additionalGasOverhead: NATIVE_OVERHEAD(this.chainId, amount.currency, quoteCurrency),
        };
        const [v3GasModel, mixedRouteGasModel] = await this.getGasModels(gasPriceWei, amount.currency.wrapped, quoteToken, providerConfig);
        // Create a Set to sanitize the protocols input, a Set of undefined becomes an empty set,
        // Then create an Array from the values of that Set.
        const protocols = Array.from(new Set(routingConfig.protocols).values());
        const cacheMode = (_c = routingConfig.overwriteCacheMode) !== null && _c !== void 0 ? _c : (await ((_d = this.routeCachingProvider) === null || _d === void 0 ? void 0 : _d.getCacheMode(this.chainId, amount, quoteToken, tradeType, protocols)));
        // Fetch CachedRoutes
        let cachedRoutes;
        if (routingConfig.useCachedRoutes && cacheMode !== CacheMode.Darkmode) {
            cachedRoutes = await ((_e = this.routeCachingProvider) === null || _e === void 0 ? void 0 : _e.getCachedRoute(this.chainId, amount, quoteToken, tradeType, protocols, await blockNumber, routingConfig.optimisticCachedRoutes));
        }
        metric.putMetric(routingConfig.useCachedRoutes
            ? 'GetQuoteUsingCachedRoutes'
            : 'GetQuoteNotUsingCachedRoutes', 1, MetricLoggerUnit.Count);
        if (cacheMode &&
            routingConfig.useCachedRoutes &&
            cacheMode !== CacheMode.Darkmode &&
            !cachedRoutes) {
            metric.putMetric(`GetCachedRoute_miss_${cacheMode}`, 1, MetricLoggerUnit.Count);
            log.info({
                tokenIn: tokenIn.symbol,
                tokenInAddress: tokenIn.address,
                tokenOut: tokenOut.symbol,
                tokenOutAddress: tokenOut.address,
                cacheMode,
                amount: amount.toExact(),
                chainId: this.chainId,
                tradeType: this.tradeTypeStr(tradeType),
            }, `GetCachedRoute miss ${cacheMode} for ${this.tokenPairSymbolTradeTypeChainId(tokenIn, tokenOut, tradeType)}`);
        }
        else if (cachedRoutes && routingConfig.useCachedRoutes) {
            metric.putMetric(`GetCachedRoute_hit_${cacheMode}`, 1, MetricLoggerUnit.Count);
            log.info({
                tokenIn: tokenIn.symbol,
                tokenInAddress: tokenIn.address,
                tokenOut: tokenOut.symbol,
                tokenOutAddress: tokenOut.address,
                cacheMode,
                amount: amount.toExact(),
                chainId: this.chainId,
                tradeType: this.tradeTypeStr(tradeType),
            }, `GetCachedRoute hit ${cacheMode} for ${this.tokenPairSymbolTradeTypeChainId(tokenIn, tokenOut, tradeType)}`);
        }
        let swapRouteFromCachePromise = Promise.resolve(null);
        if (cachedRoutes) {
            swapRouteFromCachePromise = this.getSwapRouteFromCache(cachedRoutes, await blockNumber, amount, quoteToken, tradeType, routingConfig, v3GasModel, mixedRouteGasModel, gasPriceWei, swapConfig);
        }
        let swapRouteFromChainPromise = Promise.resolve(null);
        if (!cachedRoutes || cacheMode !== CacheMode.Livemode) {
            swapRouteFromChainPromise = this.getSwapRouteFromChain(amount, tokenIn, tokenOut, protocols, quoteToken, tradeType, routingConfig, v3GasModel, mixedRouteGasModel, gasPriceWei, swapConfig);
        }
        const [swapRouteFromCache, swapRouteFromChain] = await Promise.all([
            swapRouteFromCachePromise,
            swapRouteFromChainPromise,
        ]);
        let swapRouteRaw;
        let hitsCachedRoute = false;
        if (cacheMode === CacheMode.Livemode && swapRouteFromCache) {
            log.info(`CacheMode is ${cacheMode}, and we are using swapRoute from cache`);
            hitsCachedRoute = true;
            swapRouteRaw = swapRouteFromCache;
        }
        else {
            log.info(`CacheMode is ${cacheMode}, and we are using materialized swapRoute`);
            swapRouteRaw = swapRouteFromChain;
        }
        if (cacheMode === CacheMode.Tapcompare &&
            swapRouteFromCache &&
            swapRouteFromChain) {
            const quoteDiff = swapRouteFromChain.quote.subtract(swapRouteFromCache.quote);
            const quoteGasAdjustedDiff = swapRouteFromChain.quoteGasAdjusted.subtract(swapRouteFromCache.quoteGasAdjusted);
            const gasUsedDiff = swapRouteFromChain.estimatedGasUsed.sub(swapRouteFromCache.estimatedGasUsed);
            // Only log if quoteDiff is different from 0, or if quoteGasAdjustedDiff and gasUsedDiff are both different from 0
            if (!quoteDiff.equalTo(0) ||
                !(quoteGasAdjustedDiff.equalTo(0) || gasUsedDiff.eq(0))) {
                // Calculates the percentage of the difference with respect to the quoteFromChain (not from cache)
                const misquotePercent = quoteGasAdjustedDiff
                    .divide(swapRouteFromChain.quoteGasAdjusted)
                    .multiply(100);
                metric.putMetric(`TapcompareCachedRoute_quoteGasAdjustedDiffPercent`, Number(misquotePercent.toExact()), MetricLoggerUnit.Percent);
                log.warn({
                    quoteFromChain: swapRouteFromChain.quote.toExact(),
                    quoteFromCache: swapRouteFromCache.quote.toExact(),
                    quoteDiff: quoteDiff.toExact(),
                    quoteGasAdjustedFromChain: swapRouteFromChain.quoteGasAdjusted.toExact(),
                    quoteGasAdjustedFromCache: swapRouteFromCache.quoteGasAdjusted.toExact(),
                    quoteGasAdjustedDiff: quoteGasAdjustedDiff.toExact(),
                    gasUsedFromChain: swapRouteFromChain.estimatedGasUsed.toString(),
                    gasUsedFromCache: swapRouteFromCache.estimatedGasUsed.toString(),
                    gasUsedDiff: gasUsedDiff.toString(),
                    routesFromChain: swapRouteFromChain.routes.toString(),
                    routesFromCache: swapRouteFromCache.routes.toString(),
                    amount: amount.toExact(),
                    originalAmount: cachedRoutes === null || cachedRoutes === void 0 ? void 0 : cachedRoutes.originalAmount,
                    pair: this.tokenPairSymbolTradeTypeChainId(tokenIn, tokenOut, tradeType),
                    blockNumber,
                }, `Comparing quotes between Chain and Cache for ${this.tokenPairSymbolTradeTypeChainId(tokenIn, tokenOut, tradeType)}`);
            }
        }
        if (!swapRouteRaw) {
            return null;
        }
        const { quote, quoteGasAdjusted, estimatedGasUsed, routes: routeAmounts, estimatedGasUsedQuoteToken, estimatedGasUsedUSD, } = swapRouteRaw;
        if (this.routeCachingProvider &&
            routingConfig.writeToCachedRoutes &&
            cacheMode !== CacheMode.Darkmode &&
            swapRouteFromChain) {
            // Generate the object to be cached
            const routesToCache = CachedRoutes.fromRoutesWithValidQuotes(swapRouteFromChain.routes, this.chainId, tokenIn, tokenOut, protocols.sort(), // sort it for consistency in the order of the protocols.
            await blockNumber, tradeType, amount.toExact());
            if (routesToCache) {
                // Attempt to insert the entry in cache. This is fire and forget promise.
                // The catch method will prevent any exception from blocking the normal code execution.
                this.routeCachingProvider
                    .setCachedRoute(routesToCache, amount)
                    .then((success) => {
                    const status = success ? 'success' : 'rejected';
                    metric.putMetric(`SetCachedRoute_${status}`, 1, MetricLoggerUnit.Count);
                })
                    .catch((reason) => {
                    log.error({
                        reason: reason,
                        tokenPair: this.tokenPairSymbolTradeTypeChainId(tokenIn, tokenOut, tradeType),
                    }, `SetCachedRoute failure`);
                    metric.putMetric(`SetCachedRoute_failure`, 1, MetricLoggerUnit.Count);
                });
            }
            else {
                metric.putMetric(`SetCachedRoute_unnecessary`, 1, MetricLoggerUnit.Count);
            }
        }
        metric.putMetric(`QuoteFoundForChain${this.chainId}`, 1, MetricLoggerUnit.Count);
        // Build Trade object that represents the optimal swap.
        const trade = buildTrade(currencyIn, currencyOut, tradeType, routeAmounts);
        let methodParameters;
        // If user provided recipient, deadline etc. we also generate the calldata required to execute
        // the swap and return it too.
        if (swapConfig) {
            methodParameters = buildSwapMethodParameters(trade, swapConfig, this.chainId);
        }
        const tokenOutAmount = tradeType === TradeType.EXACT_OUTPUT
            ? originalAmount // we need to pass in originalAmount instead of amount, because amount already added portionAmount in case of exact out swap
            : quote;
        const portionAmount = this.portionProvider.getPortionAmount(tokenOutAmount, tradeType, swapConfig);
        const portionQuoteAmount = this.portionProvider.getPortionQuoteAmount(tradeType, quote, amount, // we need to pass in amount instead of originalAmount here, because amount here needs to add the portion for exact out
        portionAmount);
        // we need to correct quote and quote gas adjusted for exact output when portion is part of the exact out swap
        const correctedQuote = this.portionProvider.getQuote(tradeType, quote, portionQuoteAmount);
        const correctedQuoteGasAdjusted = this.portionProvider.getQuoteGasAdjusted(tradeType, quoteGasAdjusted, portionQuoteAmount);
        const quoteGasAndPortionAdjusted = this.portionProvider.getQuoteGasAndPortionAdjusted(tradeType, quoteGasAdjusted, portionAmount);
        const swapRoute = {
            quote: correctedQuote,
            quoteGasAdjusted: correctedQuoteGasAdjusted,
            estimatedGasUsed,
            estimatedGasUsedQuoteToken,
            estimatedGasUsedUSD,
            gasPriceWei,
            route: routeAmounts,
            trade,
            methodParameters,
            blockNumber: BigNumber.from(await blockNumber),
            hitsCachedRoute: hitsCachedRoute,
            portionAmount: portionAmount,
            quoteGasAndPortionAdjusted: quoteGasAndPortionAdjusted,
        };
        if (swapConfig &&
            swapConfig.simulate &&
            methodParameters &&
            methodParameters.calldata) {
            if (!this.simulator) {
                throw new Error('Simulator not initialized!');
            }
            log.info({ swapConfig, methodParameters }, 'Starting simulation');
            const fromAddress = swapConfig.simulate.fromAddress;
            const beforeSimulate = Date.now();
            const swapRouteWithSimulation = await this.simulator.simulate(fromAddress, swapConfig, swapRoute, amount, 
            // Quote will be in WETH even if quoteCurrency is ETH
            // So we init a new CurrencyAmount object here
            CurrencyAmount.fromRawAmount(quoteCurrency, quote.quotient.toString()), this.l2GasDataProvider
                ? await this.l2GasDataProvider.getGasData()
                : undefined, providerConfig);
            metric.putMetric('SimulateTransaction', Date.now() - beforeSimulate, MetricLoggerUnit.Milliseconds);
            return swapRouteWithSimulation;
        }
        return swapRoute;
    }
    async getSwapRouteFromCache(cachedRoutes, blockNumber, amount, quoteToken, tradeType, routingConfig, v3GasModel, mixedRouteGasModel, gasPriceWei, swapConfig) {
        log.info({
            protocols: cachedRoutes.protocolsCovered,
            tradeType: cachedRoutes.tradeType,
            cachedBlockNumber: cachedRoutes.blockNumber,
            quoteBlockNumber: blockNumber,
        }, 'Routing across CachedRoute');
        const quotePromises = [];
        const v3Routes = cachedRoutes.routes.filter((route) => route.protocol === Protocol.V3);
        const v2Routes = cachedRoutes.routes.filter((route) => route.protocol === Protocol.V2);
        const mixedRoutes = cachedRoutes.routes.filter((route) => route.protocol === Protocol.MIXED);
        let percents;
        let amounts;
        if (cachedRoutes.routes.length > 1) {
            // If we have more than 1 route, we will quote the different percents for it, following the regular process
            [percents, amounts] = this.getAmountDistribution(amount, routingConfig);
        }
        else if (cachedRoutes.routes.length == 1) {
            [percents, amounts] = [[100], [amount]];
        }
        else {
            // In this case this means that there's no route, so we return null
            return Promise.resolve(null);
        }
        if (v3Routes.length > 0) {
            const v3RoutesFromCache = v3Routes.map((cachedRoute) => cachedRoute.route);
            metric.putMetric('SwapRouteFromCache_V3_GetQuotes_Request', 1, MetricLoggerUnit.Count);
            const beforeGetQuotes = Date.now();
            quotePromises.push(this.v3Quoter
                .getQuotes(v3RoutesFromCache, amounts, percents, quoteToken, tradeType, routingConfig, undefined, v3GasModel)
                .then((result) => {
                metric.putMetric(`SwapRouteFromCache_V3_GetQuotes_Load`, Date.now() - beforeGetQuotes, MetricLoggerUnit.Milliseconds);
                return result;
            }));
        }
        if (v2Routes.length > 0) {
            const v2RoutesFromCache = v2Routes.map((cachedRoute) => cachedRoute.route);
            metric.putMetric('SwapRouteFromCache_V2_GetQuotes_Request', 1, MetricLoggerUnit.Count);
            const beforeGetQuotes = Date.now();
            quotePromises.push(this.v2Quoter
                .refreshRoutesThenGetQuotes(cachedRoutes.tokenIn, cachedRoutes.tokenOut, v2RoutesFromCache, amounts, percents, quoteToken, tradeType, routingConfig, gasPriceWei)
                .then((result) => {
                metric.putMetric(`SwapRouteFromCache_V2_GetQuotes_Load`, Date.now() - beforeGetQuotes, MetricLoggerUnit.Milliseconds);
                return result;
            }));
        }
        if (mixedRoutes.length > 0) {
            const mixedRoutesFromCache = mixedRoutes.map((cachedRoute) => cachedRoute.route);
            metric.putMetric('SwapRouteFromCache_Mixed_GetQuotes_Request', 1, MetricLoggerUnit.Count);
            const beforeGetQuotes = Date.now();
            quotePromises.push(this.mixedQuoter
                .getQuotes(mixedRoutesFromCache, amounts, percents, quoteToken, tradeType, routingConfig, undefined, mixedRouteGasModel)
                .then((result) => {
                metric.putMetric(`SwapRouteFromCache_Mixed_GetQuotes_Load`, Date.now() - beforeGetQuotes, MetricLoggerUnit.Milliseconds);
                return result;
            }));
        }
        const getQuotesResults = await Promise.all(quotePromises);
        const allRoutesWithValidQuotes = _.flatMap(getQuotesResults, (quoteResult) => quoteResult.routesWithValidQuotes);
        return getBestSwapRoute(amount, percents, allRoutesWithValidQuotes, tradeType, this.chainId, routingConfig, this.portionProvider, v3GasModel, swapConfig);
    }
    async getSwapRouteFromChain(amount, tokenIn, tokenOut, protocols, quoteToken, tradeType, routingConfig, v3GasModel, mixedRouteGasModel, gasPriceWei, swapConfig) {
        // Generate our distribution of amounts, i.e. fractions of the input amount.
        // We will get quotes for fractions of the input amount for different routes, then
        // combine to generate split routes.
        const [percents, amounts] = this.getAmountDistribution(amount, routingConfig);
        const noProtocolsSpecified = protocols.length === 0;
        const v3ProtocolSpecified = protocols.includes(Protocol.V3);
        const v2ProtocolSpecified = protocols.includes(Protocol.V2);
        const v2SupportedInChain = V2_SUPPORTED.includes(this.chainId);
        const shouldQueryMixedProtocol = protocols.includes(Protocol.MIXED) ||
            (noProtocolsSpecified && v2SupportedInChain);
        const mixedProtocolAllowed = [ChainId.MAINNET, ChainId.GOERLI].includes(this.chainId) &&
            tradeType === TradeType.EXACT_INPUT;
        const beforeGetCandidates = Date.now();
        let v3CandidatePoolsPromise = Promise.resolve(undefined);
        if (v3ProtocolSpecified ||
            noProtocolsSpecified ||
            (shouldQueryMixedProtocol && mixedProtocolAllowed)) {
            v3CandidatePoolsPromise = getV3CandidatePools({
                tokenIn,
                tokenOut,
                tokenProvider: this.tokenProvider,
                blockedTokenListProvider: this.blockedTokenListProvider,
                poolProvider: this.v3PoolProvider,
                routeType: tradeType,
                subgraphProvider: this.v3SubgraphProvider,
                routingConfig,
                chainId: this.chainId,
            }).then((candidatePools) => {
                metric.putMetric('GetV3CandidatePools', Date.now() - beforeGetCandidates, MetricLoggerUnit.Milliseconds);
                return candidatePools;
            });
        }
        let v2CandidatePoolsPromise = Promise.resolve(undefined);
        if ((v2SupportedInChain && (v2ProtocolSpecified || noProtocolsSpecified)) ||
            (shouldQueryMixedProtocol && mixedProtocolAllowed)) {
            // Fetch all the pools that we will consider routing via. There are thousands
            // of pools, so we filter them to a set of candidate pools that we expect will
            // result in good prices.
            v2CandidatePoolsPromise = getV2CandidatePools({
                tokenIn,
                tokenOut,
                tokenProvider: this.tokenProvider,
                blockedTokenListProvider: this.blockedTokenListProvider,
                poolProvider: this.v2PoolProvider,
                routeType: tradeType,
                subgraphProvider: this.v2SubgraphProvider,
                routingConfig,
                chainId: this.chainId,
            }).then((candidatePools) => {
                metric.putMetric('GetV2CandidatePools', Date.now() - beforeGetCandidates, MetricLoggerUnit.Milliseconds);
                return candidatePools;
            });
        }
        const quotePromises = [];
        // Maybe Quote V3 - if V3 is specified, or no protocol is specified
        if (v3ProtocolSpecified || noProtocolsSpecified) {
            log.info({ protocols, tradeType }, 'Routing across V3');
            metric.putMetric('SwapRouteFromChain_V3_GetRoutesThenQuotes_Request', 1, MetricLoggerUnit.Count);
            const beforeGetRoutesThenQuotes = Date.now();
            quotePromises.push(v3CandidatePoolsPromise.then((v3CandidatePools) => this.v3Quoter
                .getRoutesThenQuotes(tokenIn, tokenOut, amount, amounts, percents, quoteToken, v3CandidatePools, tradeType, routingConfig, v3GasModel)
                .then((result) => {
                metric.putMetric(`SwapRouteFromChain_V3_GetRoutesThenQuotes_Load`, Date.now() - beforeGetRoutesThenQuotes, MetricLoggerUnit.Milliseconds);
                return result;
            })));
        }
        // Maybe Quote V2 - if V2 is specified, or no protocol is specified AND v2 is supported in this chain
        if (v2SupportedInChain && (v2ProtocolSpecified || noProtocolsSpecified)) {
            log.info({ protocols, tradeType }, 'Routing across V2');
            metric.putMetric('SwapRouteFromChain_V2_GetRoutesThenQuotes_Request', 1, MetricLoggerUnit.Count);
            const beforeGetRoutesThenQuotes = Date.now();
            quotePromises.push(v2CandidatePoolsPromise.then((v2CandidatePools) => this.v2Quoter
                .getRoutesThenQuotes(tokenIn, tokenOut, amount, amounts, percents, quoteToken, v2CandidatePools, tradeType, routingConfig, undefined, gasPriceWei)
                .then((result) => {
                metric.putMetric(`SwapRouteFromChain_V2_GetRoutesThenQuotes_Load`, Date.now() - beforeGetRoutesThenQuotes, MetricLoggerUnit.Milliseconds);
                return result;
            })));
        }
        // Maybe Quote mixed routes
        // if MixedProtocol is specified or no protocol is specified and v2 is supported AND tradeType is ExactIn
        // AND is Mainnet or Gorli
        if (shouldQueryMixedProtocol && mixedProtocolAllowed) {
            log.info({ protocols, tradeType }, 'Routing across MixedRoutes');
            metric.putMetric('SwapRouteFromChain_Mixed_GetRoutesThenQuotes_Request', 1, MetricLoggerUnit.Count);
            const beforeGetRoutesThenQuotes = Date.now();
            quotePromises.push(Promise.all([v3CandidatePoolsPromise, v2CandidatePoolsPromise]).then(([v3CandidatePools, v2CandidatePools]) => this.mixedQuoter
                .getRoutesThenQuotes(tokenIn, tokenOut, amount, amounts, percents, quoteToken, [v3CandidatePools, v2CandidatePools], tradeType, routingConfig, mixedRouteGasModel)
                .then((result) => {
                metric.putMetric(`SwapRouteFromChain_Mixed_GetRoutesThenQuotes_Load`, Date.now() - beforeGetRoutesThenQuotes, MetricLoggerUnit.Milliseconds);
                return result;
            })));
        }
        const getQuotesResults = await Promise.all(quotePromises);
        const allRoutesWithValidQuotes = [];
        const allCandidatePools = [];
        getQuotesResults.forEach((getQuoteResult) => {
            allRoutesWithValidQuotes.push(...getQuoteResult.routesWithValidQuotes);
            if (getQuoteResult.candidatePools) {
                allCandidatePools.push(getQuoteResult.candidatePools);
            }
        });
        if (allRoutesWithValidQuotes.length === 0) {
            log.info({ allRoutesWithValidQuotes }, 'Received no valid quotes');
            return null;
        }
        // Given all the quotes for all the amounts for all the routes, find the best combination.
        const bestSwapRoute = await getBestSwapRoute(amount, percents, allRoutesWithValidQuotes, tradeType, this.chainId, routingConfig, this.portionProvider, v3GasModel, swapConfig);
        if (bestSwapRoute) {
            this.emitPoolSelectionMetrics(bestSwapRoute, allCandidatePools);
        }
        return bestSwapRoute;
    }
    tradeTypeStr(tradeType) {
        return tradeType === TradeType.EXACT_INPUT ? 'ExactIn' : 'ExactOut';
    }
    tokenPairSymbolTradeTypeChainId(tokenIn, tokenOut, tradeType) {
        return `${tokenIn.symbol}/${tokenOut.symbol}/${this.tradeTypeStr(tradeType)}/${this.chainId}`;
    }
    determineCurrencyInOutFromTradeType(tradeType, amount, quoteCurrency) {
        if (tradeType === TradeType.EXACT_INPUT) {
            return {
                currencyIn: amount.currency,
                currencyOut: quoteCurrency,
            };
        }
        else {
            return {
                currencyIn: quoteCurrency,
                currencyOut: amount.currency,
            };
        }
    }
    async getGasPriceWei() {
        // Track how long it takes to resolve this async call.
        const beforeGasTimestamp = Date.now();
        // Get an estimate of the gas price to use when estimating gas cost of different routes.
        const { gasPriceWei } = await this.gasPriceProvider.getGasPrice();
        metric.putMetric('GasPriceLoad', Date.now() - beforeGasTimestamp, MetricLoggerUnit.Milliseconds);
        return gasPriceWei;
    }
    async getGasModels(gasPriceWei, amountToken, quoteToken, providerConfig) {
        const beforeGasModel = Date.now();
        const usdPoolPromise = getHighestLiquidityV3USDPool(this.chainId, this.v3PoolProvider, providerConfig);
        const nativeCurrency = WRAPPED_NATIVE_CURRENCY[this.chainId];
        const nativeQuoteTokenV3PoolPromise = !quoteToken.equals(nativeCurrency)
            ? getHighestLiquidityV3NativePool(quoteToken, this.v3PoolProvider, providerConfig)
            : Promise.resolve(null);
        const nativeAmountTokenV3PoolPromise = !amountToken.equals(nativeCurrency)
            ? getHighestLiquidityV3NativePool(amountToken, this.v3PoolProvider, providerConfig)
            : Promise.resolve(null);
        const [usdPool, nativeQuoteTokenV3Pool, nativeAmountTokenV3Pool] = await Promise.all([
            usdPoolPromise,
            nativeQuoteTokenV3PoolPromise,
            nativeAmountTokenV3PoolPromise,
        ]);
        const pools = {
            usdPool: usdPool,
            nativeQuoteTokenV3Pool: nativeQuoteTokenV3Pool,
            nativeAmountTokenV3Pool: nativeAmountTokenV3Pool,
        };
        const v3GasModelPromise = this.v3GasModelFactory.buildGasModel({
            chainId: this.chainId,
            gasPriceWei,
            pools,
            amountToken,
            quoteToken,
            v2poolProvider: this.v2PoolProvider,
            l2GasDataProvider: this.l2GasDataProvider,
            providerConfig: providerConfig,
        });
        const mixedRouteGasModelPromise = this.mixedRouteGasModelFactory.buildGasModel({
            chainId: this.chainId,
            gasPriceWei,
            pools,
            amountToken,
            quoteToken,
            v2poolProvider: this.v2PoolProvider,
            providerConfig: providerConfig,
        });
        const [v3GasModel, mixedRouteGasModel] = await Promise.all([
            v3GasModelPromise,
            mixedRouteGasModelPromise,
        ]);
        metric.putMetric('GasModelCreation', Date.now() - beforeGasModel, MetricLoggerUnit.Milliseconds);
        return [v3GasModel, mixedRouteGasModel];
    }
    // Note multiplications here can result in a loss of precision in the amounts (e.g. taking 50% of 101)
    // This is reconcilled at the end of the algorithm by adding any lost precision to one of
    // the splits in the route.
    getAmountDistribution(amount, routingConfig) {
        const { distributionPercent } = routingConfig;
        const percents = [];
        const amounts = [];
        for (let i = 1; i <= 100 / distributionPercent; i++) {
            percents.push(i * distributionPercent);
            amounts.push(amount.multiply(new Fraction(i * distributionPercent, 100)));
        }
        return [percents, amounts];
    }
    async buildSwapAndAddMethodParameters(trade, swapAndAddOptions, swapAndAddParameters) {
        const { swapOptions: { recipient, slippageTolerance, deadline, inputTokenPermit }, addLiquidityOptions: addLiquidityConfig, } = swapAndAddOptions;
        const preLiquidityPosition = swapAndAddParameters.preLiquidityPosition;
        const finalBalanceTokenIn = swapAndAddParameters.initialBalanceTokenIn.subtract(trade.inputAmount);
        const finalBalanceTokenOut = swapAndAddParameters.initialBalanceTokenOut.add(trade.outputAmount);
        const approvalTypes = await this.swapRouterProvider.getApprovalType(finalBalanceTokenIn, finalBalanceTokenOut);
        const zeroForOne = finalBalanceTokenIn.currency.wrapped.sortsBefore(finalBalanceTokenOut.currency.wrapped);
        return {
            ...SwapRouter.swapAndAddCallParameters(trade, {
                recipient,
                slippageTolerance,
                deadlineOrPreviousBlockhash: deadline,
                inputTokenPermit,
            }, Position.fromAmounts({
                pool: preLiquidityPosition.pool,
                tickLower: preLiquidityPosition.tickLower,
                tickUpper: preLiquidityPosition.tickUpper,
                amount0: zeroForOne
                    ? finalBalanceTokenIn.quotient.toString()
                    : finalBalanceTokenOut.quotient.toString(),
                amount1: zeroForOne
                    ? finalBalanceTokenOut.quotient.toString()
                    : finalBalanceTokenIn.quotient.toString(),
                useFullPrecision: false,
            }), addLiquidityConfig, approvalTypes.approvalTokenIn, approvalTypes.approvalTokenOut),
            to: SWAP_ROUTER_02_ADDRESSES(this.chainId),
        };
    }
    emitPoolSelectionMetrics(swapRouteRaw, allPoolsBySelection) {
        const poolAddressesUsed = new Set();
        const { routes: routeAmounts } = swapRouteRaw;
        _(routeAmounts)
            .flatMap((routeAmount) => {
            const { poolAddresses } = routeAmount;
            return poolAddresses;
        })
            .forEach((address) => {
            poolAddressesUsed.add(address.toLowerCase());
        });
        for (const poolsBySelection of allPoolsBySelection) {
            const { protocol } = poolsBySelection;
            _.forIn(poolsBySelection.selections, (pools, topNSelection) => {
                const topNUsed = _.findLastIndex(pools, (pool) => poolAddressesUsed.has(pool.id.toLowerCase())) + 1;
                metric.putMetric(_.capitalize(`${protocol}${topNSelection}`), topNUsed, MetricLoggerUnit.Count);
            });
        }
        let hasV3Route = false;
        let hasV2Route = false;
        let hasMixedRoute = false;
        for (const routeAmount of routeAmounts) {
            if (routeAmount.protocol === Protocol.V3) {
                hasV3Route = true;
            }
            if (routeAmount.protocol === Protocol.V2) {
                hasV2Route = true;
            }
            if (routeAmount.protocol === Protocol.MIXED) {
                hasMixedRoute = true;
            }
        }
        if (hasMixedRoute && (hasV3Route || hasV2Route)) {
            if (hasV3Route && hasV2Route) {
                metric.putMetric(`MixedAndV3AndV2SplitRoute`, 1, MetricLoggerUnit.Count);
                metric.putMetric(`MixedAndV3AndV2SplitRouteForChain${this.chainId}`, 1, MetricLoggerUnit.Count);
            }
            else if (hasV3Route) {
                metric.putMetric(`MixedAndV3SplitRoute`, 1, MetricLoggerUnit.Count);
                metric.putMetric(`MixedAndV3SplitRouteForChain${this.chainId}`, 1, MetricLoggerUnit.Count);
            }
            else if (hasV2Route) {
                metric.putMetric(`MixedAndV2SplitRoute`, 1, MetricLoggerUnit.Count);
                metric.putMetric(`MixedAndV2SplitRouteForChain${this.chainId}`, 1, MetricLoggerUnit.Count);
            }
        }
        else if (hasV3Route && hasV2Route) {
            metric.putMetric(`V3AndV2SplitRoute`, 1, MetricLoggerUnit.Count);
            metric.putMetric(`V3AndV2SplitRouteForChain${this.chainId}`, 1, MetricLoggerUnit.Count);
        }
        else if (hasMixedRoute) {
            if (routeAmounts.length > 1) {
                metric.putMetric(`MixedSplitRoute`, 1, MetricLoggerUnit.Count);
                metric.putMetric(`MixedSplitRouteForChain${this.chainId}`, 1, MetricLoggerUnit.Count);
            }
            else {
                metric.putMetric(`MixedRoute`, 1, MetricLoggerUnit.Count);
                metric.putMetric(`MixedRouteForChain${this.chainId}`, 1, MetricLoggerUnit.Count);
            }
        }
        else if (hasV3Route) {
            if (routeAmounts.length > 1) {
                metric.putMetric(`V3SplitRoute`, 1, MetricLoggerUnit.Count);
                metric.putMetric(`V3SplitRouteForChain${this.chainId}`, 1, MetricLoggerUnit.Count);
            }
            else {
                metric.putMetric(`V3Route`, 1, MetricLoggerUnit.Count);
                metric.putMetric(`V3RouteForChain${this.chainId}`, 1, MetricLoggerUnit.Count);
            }
        }
        else if (hasV2Route) {
            if (routeAmounts.length > 1) {
                metric.putMetric(`V2SplitRoute`, 1, MetricLoggerUnit.Count);
                metric.putMetric(`V2SplitRouteForChain${this.chainId}`, 1, MetricLoggerUnit.Count);
            }
            else {
                metric.putMetric(`V2Route`, 1, MetricLoggerUnit.Count);
                metric.putMetric(`V2RouteForChain${this.chainId}`, 1, MetricLoggerUnit.Count);
            }
        }
    }
    calculateOptimalRatio(position, sqrtRatioX96, zeroForOne) {
        const upperSqrtRatioX96 = TickMath.getSqrtRatioAtTick(position.tickUpper);
        const lowerSqrtRatioX96 = TickMath.getSqrtRatioAtTick(position.tickLower);
        // returns Fraction(0, 1) for any out of range position regardless of zeroForOne. Implication: function
        // cannot be used to determine the trading direction of out of range positions.
        if (JSBI.greaterThan(sqrtRatioX96, upperSqrtRatioX96) ||
            JSBI.lessThan(sqrtRatioX96, lowerSqrtRatioX96)) {
            return new Fraction(0, 1);
        }
        const precision = JSBI.BigInt('1' + '0'.repeat(18));
        let optimalRatio = new Fraction(SqrtPriceMath.getAmount0Delta(sqrtRatioX96, upperSqrtRatioX96, precision, true), SqrtPriceMath.getAmount1Delta(sqrtRatioX96, lowerSqrtRatioX96, precision, true));
        if (!zeroForOne)
            optimalRatio = optimalRatio.invert();
        return optimalRatio;
    }
    async userHasSufficientBalance(fromAddress, tradeType, amount, quote) {
        try {
            const neededBalance = tradeType === TradeType.EXACT_INPUT ? amount : quote;
            let balance;
            if (neededBalance.currency.isNative) {
                balance = await this.provider.getBalance(fromAddress);
            }
            else {
                const tokenContract = Erc20__factory.connect(neededBalance.currency.address, this.provider);
                balance = await tokenContract.balanceOf(fromAddress);
            }
            return balance.gte(BigNumber.from(neededBalance.quotient.toString()));
        }
        catch (e) {
            log.error(e, 'Error while checking user balance');
            return false;
        }
    }
    absoluteValue(fraction) {
        const numeratorAbs = JSBI.lessThan(fraction.numerator, JSBI.BigInt(0))
            ? JSBI.unaryMinus(fraction.numerator)
            : fraction.numerator;
        const denominatorAbs = JSBI.lessThan(fraction.denominator, JSBI.BigInt(0))
            ? JSBI.unaryMinus(fraction.denominator)
            : fraction.denominator;
        return new Fraction(numeratorAbs, denominatorAbs);
    }
    getBlockNumberPromise() {
        return retry(async (_b, attempt) => {
            var _a;
            if (attempt > 1) {
                log.info(`Get block number attempt ${attempt}`);
                console.log(`Get block number attempt ${attempt}`);
            }
            return (_a = this.provider) === null || _a === void 0 ? void 0 : _a.getBlockNumber();
        }, {
            retries: 2,
            minTimeout: 100,
            maxTimeout: 1000,
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxwaGEtcm91dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3JvdXRlcnMvYWxwaGEtcm91dGVyL2FscGhhLXJvdXRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDckQsT0FBTyxFQUFnQixlQUFlLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUN6RSxPQUFPLGtCQUFrQixNQUFNLDZCQUE2QixDQUFDO0FBQzdELE9BQU8sRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFTLElBQUksRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3hFLE9BQU8sRUFDTCxPQUFPLEVBRVAsUUFBUSxFQUVSLFNBQVMsR0FDVixNQUFNLG1CQUFtQixDQUFDO0FBRTNCLE9BQU8sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMxRSxPQUFPLEtBQUssTUFBTSxhQUFhLENBQUM7QUFDaEMsT0FBTyxJQUFJLE1BQU0sTUFBTSxDQUFDO0FBQ3hCLE9BQU8sQ0FBQyxNQUFNLFFBQVEsQ0FBQztBQUN2QixPQUFPLFNBQVMsTUFBTSxZQUFZLENBQUM7QUFFbkMsT0FBTyxFQUNMLFlBQVksRUFDWixTQUFTLEVBQ1QseUJBQXlCLEVBQ3pCLGdDQUFnQyxFQUNoQyxxQkFBcUI7QUFDckIsNkJBQTZCO0FBQzdCLHFCQUFxQjtBQUNyQiw2QkFBNkI7QUFDN0IsdUJBQXVCLEVBQ3ZCLHlCQUF5QixFQU96QixzQkFBc0IsRUFDdEIsV0FBVyxFQUNYLHVCQUF1QixFQUN2QixvQkFBb0IsRUFFcEIsd0JBQXdCLEVBQ3hCLHdCQUF3QixFQUN4QixrQkFBa0IsRUFDbEIsdUJBQXVCLEVBQ3ZCLHdCQUF3QjtBQUN4Qix1QkFBdUI7QUFDdkIsZUFBZSxFQUNmLCtCQUErQixFQUMvQiwrQkFBK0IsR0FDaEMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QixPQUFPLEVBQ0wsd0JBQXdCLEdBRXpCLE1BQU0sNkNBQTZDLENBQUM7QUFLckQsT0FBTyxFQUVMLGVBQWUsR0FDaEIsTUFBTSxrQ0FBa0MsQ0FBQztBQUUxQyxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUMzRSxPQUFPLEVBQWtCLGFBQWEsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQy9FLE9BQU8sRUFFTCxzQkFBc0IsR0FDdkIsTUFBTSwwQ0FBMEMsQ0FBQztBQUNsRCxPQUFPLEVBRUwsY0FBYyxHQUNmLE1BQU0sa0NBQWtDLENBQUM7QUFNMUMsT0FBTyxFQUVMLGNBQWMsR0FDZixNQUFNLGtDQUFrQyxDQUFDO0FBRTFDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUM1RSxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDL0UsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3BELE9BQU8sRUFDTCxjQUFjO0FBQ2Qsc0JBQXNCO0FBQ3RCLFlBQVksR0FDYixNQUFNLG1CQUFtQixDQUFDO0FBQzNCLE9BQU8sRUFDTCwrQkFBK0IsRUFDL0IsNEJBQTRCLEdBQzdCLE1BQU0sZ0NBQWdDLENBQUM7QUFDeEMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3JDLE9BQU8sRUFDTCx5QkFBeUIsRUFDekIsVUFBVSxHQUNYLE1BQU0sNkJBQTZCLENBQUM7QUFDckMsT0FBTyxFQUFFLE1BQU0sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQzdELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQ25FLE9BQU8sRUFXTCxpQkFBaUIsR0FHbEIsTUFBTSxXQUFXLENBQUM7QUFFbkIsT0FBTyxFQUNMLCtCQUErQixFQUMvQix1QkFBdUIsR0FDeEIsTUFBTSxVQUFVLENBQUM7QUFNbEIsT0FBTyxFQUFpQixnQkFBZ0IsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzlFLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBQy9FLE9BQU8sRUFFTCxtQkFBbUIsRUFDbkIsbUJBQW1CLEdBSXBCLE1BQU0saUNBQWlDLENBQUM7QUFPekMsT0FBTyxFQUFFLGtDQUFrQyxFQUFFLE1BQU0seURBQXlELENBQUM7QUFDN0csT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDcEYsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQzVELE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQ3BGLE9BQU8sRUFBbUIsV0FBVyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFrSDdFLE1BQU0sT0FBTyxtQkFBdUIsU0FBUSxHQUFjO0lBQy9DLEdBQUcsQ0FBQyxHQUFXLEVBQUUsS0FBUTtRQUNoQyxPQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzdDLENBQUM7Q0FDRjtBQUVELE1BQU0sT0FBTyxvQkFBcUIsU0FBUSxLQUFhO0lBQ3JELFlBQVksR0FBRyxLQUFlO1FBQzVCLHVFQUF1RTtRQUN2RSxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3BELENBQUM7Q0FDRjtBQXFKRCxNQUFNLE9BQU8sV0FBVztJQWlDdEIsWUFBWSxFQUNWLE9BQU8sRUFDUCxRQUFRLEVBQ1Isa0JBQWtCLEVBQ2xCLGNBQWMsRUFDZCxvQkFBb0IsRUFDcEIsY0FBYyxFQUNkLGVBQWUsRUFDZixrQkFBa0IsRUFDbEIsYUFBYSxFQUNiLHdCQUF3QixFQUN4QixrQkFBa0IsRUFDbEIsZ0JBQWdCLEVBQ2hCLGlCQUFpQixFQUNqQixpQkFBaUIsRUFDakIseUJBQXlCLEVBQ3pCLGtCQUFrQixFQUNsQixzQkFBc0IsRUFDdEIsU0FBUyxFQUNULG9CQUFvQixFQUNwQix1QkFBdUIsRUFDdkIsZUFBZSxHQUNHO1FBQ2xCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxrQkFBa0I7WUFDckIsa0JBQWtCLGFBQWxCLGtCQUFrQixjQUFsQixrQkFBa0IsR0FDbEIsSUFBSSx3QkFBd0IsQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU8sQ0FBQyxDQUFDO1FBQzNELElBQUksQ0FBQyxjQUFjO1lBQ2pCLGNBQWMsYUFBZCxjQUFjLGNBQWQsY0FBYyxHQUNkLElBQUkscUJBQXFCLENBQ3ZCLElBQUksQ0FBQyxPQUFPLEVBQ1osSUFBSSxjQUFjLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxFQUNwRSxJQUFJLFdBQVcsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FDbEUsQ0FBQztRQUNKLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxvQkFBb0IsQ0FBQztRQUVqRCxJQUFJLG9CQUFvQixFQUFFO1lBQ3hCLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxvQkFBb0IsQ0FBQztTQUNsRDthQUFNO1lBQ0wsUUFBUSxPQUFPLEVBQUU7Z0JBQ2Y7b0JBQ0UsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksb0JBQW9CLENBQ2xELE9BQU8sRUFDUCxRQUFRLEVBQ1IsSUFBSSxDQUFDLGtCQUFrQixFQUN2Qjt3QkFDRSxPQUFPLEVBQUUsQ0FBQzt3QkFDVixVQUFVLEVBQUUsR0FBRzt3QkFDZixVQUFVLEVBQUUsSUFBSTtxQkFDakIsRUFDRDt3QkFDRSxjQUFjLEVBQUUsR0FBRzt3QkFDbkIsZUFBZSxFQUFFLE1BQU87d0JBQ3hCLG1CQUFtQixFQUFFLElBQUk7cUJBQzFCLEVBQ0Q7d0JBQ0UsZ0JBQWdCLEVBQUUsT0FBUzt3QkFDM0IsY0FBYyxFQUFFLEVBQUU7cUJBQ25CLENBQ0YsQ0FBQztvQkFDRixNQUFNO2FBQ1Q7U0FDRjtRQUVELElBQUksc0JBQXNCLEVBQUU7WUFDMUIsSUFBSSxDQUFDLHNCQUFzQixHQUFHLHNCQUFzQixDQUFDO1NBQ3REO2FBQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxLQUFLLE9BQU8sQ0FBQyxPQUFPLEVBQUU7WUFDM0MsSUFBSSxDQUFDLHNCQUFzQixHQUFHLElBQUksc0JBQXNCLENBQ3RELElBQUksQ0FBQyxPQUFPLEVBQ1osSUFBSSxDQUFDLGtCQUFrQixFQUN2QixJQUFJLFdBQVcsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FDcEUsQ0FBQztTQUNIO1FBQ0QsSUFBSSx1QkFBdUIsRUFBRTtZQUMzQixJQUFJLENBQUMsdUJBQXVCLEdBQUcsdUJBQXVCLENBQUM7U0FDeEQ7YUFBTTtZQUNMLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxJQUFJLHVCQUF1QixDQUN4RCxJQUFJLENBQUMsT0FBTyxFQUNaLElBQUksV0FBVyxDQUFDLElBQUksU0FBUyxDQUFDLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUNuRSxJQUFJLHNCQUFzQixDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQ25ELENBQUM7U0FDSDtRQUNELElBQUksQ0FBQyxjQUFjO1lBQ2pCLGNBQWMsYUFBZCxjQUFjLGNBQWQsY0FBYyxHQUNkLElBQUkscUJBQXFCLENBQ3ZCLE9BQU8sRUFDUCxJQUFJLGNBQWMsQ0FDaEIsT0FBTyxFQUNQLElBQUksQ0FBQyxrQkFBa0IsRUFDdkIsSUFBSSxDQUFDLHVCQUF1QixDQUM3QixFQUNELElBQUksV0FBVyxDQUFDLElBQUksU0FBUyxDQUFDLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUNqRSxDQUFDO1FBRUosSUFBSSxDQUFDLGVBQWUsR0FBRyxlQUFlLGFBQWYsZUFBZSxjQUFmLGVBQWUsR0FBSSxJQUFJLGVBQWUsRUFBRSxDQUFDO1FBRWhFLElBQUksQ0FBQyx3QkFBd0I7WUFDM0Isd0JBQXdCLGFBQXhCLHdCQUF3QixjQUF4Qix3QkFBd0IsR0FDeEIsSUFBSSx3QkFBd0IsQ0FDMUIsT0FBTyxFQUNQLGtCQUErQixFQUMvQixJQUFJLFdBQVcsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FDbkUsQ0FBQztRQUNKLElBQUksQ0FBQyxhQUFhO1lBQ2hCLGFBQWEsYUFBYixhQUFhLGNBQWIsYUFBYSxHQUNiLElBQUksZ0NBQWdDLENBQ2xDLE9BQU8sRUFDUCxJQUFJLFdBQVcsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsRUFDbEUsSUFBSSx3QkFBd0IsQ0FDMUIsT0FBTyxFQUNQLGtCQUFrQixFQUNsQixJQUFJLFdBQVcsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FDbkUsRUFDRCxJQUFJLGFBQWEsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQ3BELENBQUM7UUFDSixJQUFJLENBQUMsZUFBZSxHQUFHLGVBQWUsYUFBZixlQUFlLGNBQWYsZUFBZSxHQUFJLElBQUksZUFBZSxFQUFFLENBQUM7UUFFaEUsaURBQWlEO1FBRWpELGdJQUFnSTtRQUNoSSxJQUFJLGtCQUFrQixFQUFFO1lBQ3RCLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxrQkFBa0IsQ0FBQztTQUM5QzthQUFNO1lBQ0wsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksK0JBQStCLENBQUM7Z0JBQzVELGlDQUFpQztnQkFDakMsYUFBYTtnQkFDYiw2QkFBNkI7Z0JBQzdCLGVBQWU7Z0JBQ2Ysd0ZBQXdGO2dCQUN4RixpQkFBaUI7Z0JBQ2pCLFFBQVE7Z0JBQ1IsT0FBTztnQkFDUCxzRUFBc0U7Z0JBQ3RFLEtBQUs7Z0JBQ0wsSUFBSSx3QkFBd0IsQ0FBQyxPQUFPLENBQUM7YUFDdEMsQ0FBQyxDQUFDO1NBQ0o7UUFFRCxJQUFJLGtCQUFrQixFQUFFO1lBQ3RCLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxrQkFBa0IsQ0FBQztTQUM5QzthQUFNO1lBQ0wsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksK0JBQStCLENBQUM7Z0JBQzVELGlDQUFpQztnQkFDakMsYUFBYTtnQkFDYiw2QkFBNkI7Z0JBQzdCLGVBQWU7Z0JBQ2Ysd0ZBQXdGO2dCQUN4RixpQkFBaUI7Z0JBQ2pCLFFBQVE7Z0JBQ1IsT0FBTztnQkFDUCxzRUFBc0U7Z0JBQ3RFLEtBQUs7Z0JBQ0wsSUFBSSx3QkFBd0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQzthQUMzRCxDQUFDLENBQUM7U0FDSjtRQUVELElBQUksd0JBQTJDLENBQUM7UUFDaEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBQzFDLElBQUksZUFBZSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDL0Msd0JBQXdCLEdBQUcsSUFBSSx1QkFBdUIsQ0FDbEQsT0FBTyxFQUNQLElBQUksdUJBQXVCLENBQUMsSUFBSSxDQUFDLFFBQTJCLENBQUMsRUFDN0QsSUFBSSxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsUUFBMkIsQ0FBQyxDQUM3RCxDQUFDO1NBQ0g7YUFBTTtZQUNMLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsZUFBZSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUUsQ0FBQTtZQUN0Rix3QkFBd0IsR0FBRyxJQUFJLHlCQUF5QixDQUN0RCx1QkFBdUIsQ0FDeEIsQ0FBQztTQUNIO1FBRUQsSUFBSSxDQUFDLGdCQUFnQjtZQUNuQixnQkFBZ0IsYUFBaEIsZ0JBQWdCLGNBQWhCLGdCQUFnQixHQUNoQixJQUFJLHlCQUF5QixDQUMzQixPQUFPLEVBQ1Asd0JBQXdCLEVBQ3hCLElBQUksV0FBVyxDQUNiLElBQUksU0FBUyxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FDL0MsQ0FDRixDQUFDO1FBQ0osSUFBSSxDQUFDLGlCQUFpQjtZQUNwQixpQkFBaUIsYUFBakIsaUJBQWlCLGNBQWpCLGlCQUFpQixHQUFJLElBQUksMEJBQTBCLEVBQUUsQ0FBQztRQUN4RCxJQUFJLENBQUMsaUJBQWlCO1lBQ3BCLGlCQUFpQixhQUFqQixpQkFBaUIsY0FBakIsaUJBQWlCLEdBQUksSUFBSSwwQkFBMEIsRUFBRSxDQUFDO1FBQ3hELElBQUksQ0FBQyx5QkFBeUI7WUFDNUIseUJBQXlCLGFBQXpCLHlCQUF5QixjQUF6Qix5QkFBeUIsR0FBSSxJQUFJLGtDQUFrQyxFQUFFLENBQUM7UUFFeEUsSUFBSSxDQUFDLGtCQUFrQjtZQUNyQixrQkFBa0IsYUFBbEIsa0JBQWtCLGNBQWxCLGtCQUFrQixHQUNsQixJQUFJLGtCQUFrQixDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFaEUsMEJBQTBCO1FBQzFCLDZGQUE2RjtRQUM3RixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksUUFBUSxDQUMxQixJQUFJLENBQUMsa0JBQWtCLEVBQ3ZCLElBQUksQ0FBQyxjQUFjLEVBQ25CLElBQUksQ0FBQyxlQUFlLEVBQ3BCLElBQUksQ0FBQyxpQkFBaUIsRUFDdEIsSUFBSSxDQUFDLGFBQWEsRUFDbEIsSUFBSSxDQUFDLE9BQU8sRUFDWixJQUFJLENBQUMsd0JBQXdCLEVBQzdCLElBQUksQ0FBQyxzQkFBc0IsQ0FDNUIsQ0FBQztRQUVGLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxRQUFRLENBQzFCLElBQUksQ0FBQyxrQkFBa0IsRUFDdkIsSUFBSSxDQUFDLGNBQWMsRUFDbkIsSUFBSSxDQUFDLG9CQUFvQixFQUN6QixJQUFJLENBQUMsYUFBYSxFQUNsQixJQUFJLENBQUMsT0FBTyxFQUNaLElBQUksQ0FBQyx3QkFBd0IsRUFDN0IsSUFBSSxDQUFDLHNCQUFzQixDQUM1QixDQUFDO1FBRUYsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLFdBQVcsQ0FDaEMsSUFBSSxDQUFDLGtCQUFrQixFQUN2QixJQUFJLENBQUMsY0FBYyxFQUNuQixJQUFJLENBQUMsa0JBQWtCLEVBQ3ZCLElBQUksQ0FBQyxjQUFjLEVBQ25CLElBQUksQ0FBQyxvQkFBb0IsRUFDekIsSUFBSSxDQUFDLGFBQWEsRUFDbEIsSUFBSSxDQUFDLE9BQU8sRUFDWixJQUFJLENBQUMsd0JBQXdCLEVBQzdCLElBQUksQ0FBQyxzQkFBc0IsQ0FDNUIsQ0FBQztJQUNKLENBQUM7SUFFTSxLQUFLLENBQUMsWUFBWSxDQUN2QixhQUE2QixFQUM3QixhQUE2QixFQUM3QixRQUFrQixFQUNsQixnQkFBa0MsRUFDbEMsaUJBQXFDLEVBQ3JDLGdCQUE0QywrQkFBK0IsQ0FDekUsSUFBSSxDQUFDLE9BQU8sQ0FDYjtRQUVELElBQ0UsYUFBYSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQzFFO1lBQ0EsQ0FBQyxhQUFhLEVBQUUsYUFBYSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsYUFBYSxDQUFDLENBQUM7U0FDakU7UUFFRCxJQUFJLG1CQUFtQixHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FDbEQsUUFBUSxFQUNSLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUMxQixJQUFJLENBQ0wsQ0FBQztRQUNGLDZEQUE2RDtRQUM3RCxJQUFJLFVBQW1CLENBQUM7UUFDeEIsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUMsU0FBUyxFQUFFO1lBQ2xELFVBQVUsR0FBRyxJQUFJLENBQUM7U0FDbkI7YUFBTSxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQyxTQUFTLEVBQUU7WUFDekQsVUFBVSxHQUFHLEtBQUssQ0FBQztTQUNwQjthQUFNO1lBQ0wsVUFBVSxHQUFHLElBQUksUUFBUSxDQUN2QixhQUFhLENBQUMsUUFBUSxFQUN0QixhQUFhLENBQUMsUUFBUSxDQUN2QixDQUFDLFdBQVcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1lBQ25DLElBQUksQ0FBQyxVQUFVO2dCQUFFLG1CQUFtQixHQUFHLG1CQUFtQixDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ3JFO1FBRUQsTUFBTSxDQUFDLFlBQVksRUFBRSxhQUFhLENBQUMsR0FBRyxVQUFVO1lBQzlDLENBQUMsQ0FBQyxDQUFDLGFBQWEsRUFBRSxhQUFhLENBQUM7WUFDaEMsQ0FBQyxDQUFDLENBQUMsYUFBYSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBRW5DLElBQUksWUFBWSxHQUFHLG1CQUFtQixDQUFDO1FBQ3ZDLElBQUksa0JBQWtCLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQztRQUN2QyxJQUFJLFlBQVksR0FBYSxVQUFVO1lBQ3JDLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVc7WUFDM0IsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQzlCLElBQUksSUFBSSxHQUFxQixJQUFJLENBQUM7UUFDbEMsSUFBSSxhQUFhLEdBQUcsS0FBSyxDQUFDO1FBQzFCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNWLHNFQUFzRTtRQUN0RSxPQUFPLENBQUMsYUFBYSxFQUFFO1lBQ3JCLENBQUMsRUFBRSxDQUFDO1lBQ0osSUFBSSxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsYUFBYSxFQUFFO2dCQUN0QyxHQUFHLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUM7Z0JBQ3BDLE9BQU87b0JBQ0wsTUFBTSxFQUFFLGlCQUFpQixDQUFDLGNBQWM7b0JBQ3hDLEtBQUssRUFBRSx5QkFBeUI7aUJBQ2pDLENBQUM7YUFDSDtZQUVELE1BQU0sWUFBWSxHQUFHLHNCQUFzQixDQUN6QyxZQUFZLEVBQ1osWUFBWSxFQUNaLFlBQVksRUFDWixhQUFhLENBQ2QsQ0FBQztZQUNGLElBQUksWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDM0IsR0FBRyxDQUFDLElBQUksQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO2dCQUM3QyxPQUFPO29CQUNMLE1BQU0sRUFBRSxpQkFBaUIsQ0FBQyxjQUFjO2lCQUN6QyxDQUFDO2FBQ0g7WUFDRCxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUNyQixZQUFZLEVBQ1osYUFBYSxDQUFDLFFBQVEsRUFDdEIsU0FBUyxDQUFDLFdBQVcsRUFDckIsU0FBUyxFQUNUO2dCQUNFLEdBQUcsK0JBQStCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztnQkFDaEQsR0FBRyxhQUFhO2dCQUNoQiwyRkFBMkY7Z0JBQzNGLHlFQUF5RTtnQkFDekUsU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsRUFBRSxDQUFDO2FBQ3RDLENBQ0YsQ0FBQztZQUNGLElBQUksQ0FBQyxJQUFJLEVBQUU7Z0JBQ1QsR0FBRyxDQUFDLElBQUksQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO2dCQUM3QyxPQUFPO29CQUNMLE1BQU0sRUFBRSxpQkFBaUIsQ0FBQyxjQUFjO29CQUN4QyxLQUFLLEVBQUUsZ0JBQWdCO2lCQUN4QixDQUFDO2FBQ0g7WUFFRCxNQUFNLG1CQUFtQixHQUFHLFlBQVksQ0FBQyxRQUFRLENBQy9DLElBQUksQ0FBQyxLQUFNLENBQUMsV0FBVyxDQUN4QixDQUFDO1lBQ0YsTUFBTSxvQkFBb0IsR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDekUsTUFBTSxRQUFRLEdBQUcsbUJBQW1CLENBQUMsTUFBTSxDQUFDLG9CQUFvQixDQUFDLENBQUM7WUFFbEUsSUFBSSxxQkFBcUIsQ0FBQztZQUMxQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO2dCQUMzQixJQUFJLEtBQUssQ0FBQyxRQUFRLEtBQUssUUFBUSxDQUFDLEVBQUUsRUFBRTtvQkFDbEMsTUFBTSxPQUFPLEdBQUcsS0FBOEIsQ0FBQztvQkFDL0MsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFO3dCQUN0QyxJQUNFLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDOzRCQUN4QyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQzs0QkFDeEMsSUFBSSxDQUFDLEdBQUcsS0FBSyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFDOUI7NEJBQ0EscUJBQXFCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FDakMsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBRSxDQUFDLFFBQVEsRUFBRSxDQUM3QyxDQUFDOzRCQUNGLFlBQVksR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQ3ZDLFFBQVEsRUFDUixJQUFJLENBQUMsTUFBTSxDQUFDLHFCQUFzQixDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQzlDLFVBQVUsQ0FDWCxDQUFDO3lCQUNIO29CQUNILENBQUMsQ0FBQyxDQUFDO2lCQUNKO1lBQ0gsQ0FBQyxDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMscUJBQXFCLEVBQUU7Z0JBQzFCLFlBQVksR0FBRyxtQkFBbUIsQ0FBQzthQUNwQztZQUNELGFBQWE7Z0JBQ1gsUUFBUSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUM7b0JBQzlCLElBQUksQ0FBQyxhQUFhLENBQ2hCLFFBQVEsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FDckQsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsbUJBQW1CLENBQUMsQ0FBQztZQUVuRCxJQUFJLGFBQWEsSUFBSSxxQkFBcUIsRUFBRTtnQkFDMUMsa0JBQWtCLEdBQUcsSUFBSSxJQUFJLENBQzNCLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUNwQixRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFDcEIsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQ2pCLHFCQUFxQixFQUNyQixRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFDdkIsUUFBUSxDQUFDLGtCQUFrQixDQUFDLHFCQUFxQixDQUFDLEVBQ2xELFFBQVEsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQy9CLENBQUM7YUFDSDtZQUNELFlBQVksR0FBRyxJQUFJLENBQUMsS0FBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUV4RSxHQUFHLENBQUMsSUFBSSxDQUNOO2dCQUNFLFlBQVksRUFBRSxZQUFZLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7Z0JBQ2pELFlBQVksRUFBRSxZQUFZLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7Z0JBQ2pELFFBQVEsRUFBRSxRQUFRLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7Z0JBQ3pDLG1CQUFtQixFQUFFLG1CQUFtQixDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO2dCQUMvRCxvQkFBb0IsRUFBRSxvQkFBb0IsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztnQkFDakUsbUJBQW1CLEVBQUUsZ0JBQWdCLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztnQkFDckUsVUFBVSxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUU7YUFDekIsRUFDRCxtQ0FBbUMsQ0FDcEMsQ0FBQztZQUVGLElBQUksWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDM0IsR0FBRyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO2dCQUM5QixPQUFPO29CQUNMLE1BQU0sRUFBRSxpQkFBaUIsQ0FBQyxjQUFjO29CQUN4QyxLQUFLLEVBQUUsaURBQWlEO2lCQUN6RCxDQUFDO2FBQ0g7U0FDRjtRQUVELElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDVCxPQUFPO2dCQUNMLE1BQU0sRUFBRSxpQkFBaUIsQ0FBQyxjQUFjO2dCQUN4QyxLQUFLLEVBQUUsZ0JBQWdCO2FBQ3hCLENBQUM7U0FDSDtRQUNELElBQUksZ0JBQThDLENBQUM7UUFDbkQsSUFBSSxpQkFBaUIsRUFBRTtZQUNyQixnQkFBZ0IsR0FBRyxNQUFNLElBQUksQ0FBQywrQkFBK0IsQ0FDM0QsSUFBSSxDQUFDLEtBQUssRUFDVixpQkFBaUIsRUFDakI7Z0JBQ0UscUJBQXFCLEVBQUUsWUFBWTtnQkFDbkMsc0JBQXNCLEVBQUUsYUFBYTtnQkFDckMsb0JBQW9CLEVBQUUsUUFBUTthQUMvQixDQUNGLENBQUM7U0FDSDtRQUVELE9BQU87WUFDTCxNQUFNLEVBQUUsaUJBQWlCLENBQUMsT0FBTztZQUNqQyxNQUFNLEVBQUUsRUFBRSxHQUFHLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxZQUFZLEVBQUUsa0JBQWtCLEVBQUU7U0FDeEUsQ0FBQztJQUNKLENBQUM7SUFFRDs7T0FFRztJQUNJLEtBQUssQ0FBQyxLQUFLLENBQ2hCLE1BQXNCLEVBQ3RCLGFBQXVCLEVBQ3ZCLFNBQW9CLEVBQ3BCLFVBQXdCLEVBQ3hCLHVCQUFtRCxFQUFFLEVBQ3JELG1CQUE0Qjs7UUFFNUIsTUFBTSxjQUFjLEdBQUcsTUFBTSxDQUFDO1FBQzlCLElBQUksU0FBUyxLQUFLLFNBQVMsQ0FBQyxZQUFZLEVBQUU7WUFDeEMsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FDekQsTUFBTSxFQUNOLFNBQVMsRUFDVCxVQUFVLENBQ1gsQ0FBQztZQUNGLElBQUksYUFBYSxJQUFJLGFBQWEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3BELDRFQUE0RTtnQkFDNUUseUlBQXlJO2dCQUN6SSw0SEFBNEg7Z0JBQzVILDRFQUE0RTtnQkFDNUUscURBQXFEO2dCQUNyRCw0Q0FBNEM7Z0JBQzVDLE1BQU0sR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO2FBQ3BDO1NBQ0Y7UUFFRCxNQUFNLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxHQUMvQixJQUFJLENBQUMsbUNBQW1DLENBQ3RDLFNBQVMsRUFDVCxNQUFNLEVBQ04sYUFBYSxDQUNkLENBQUM7UUFFSixNQUFNLE9BQU8sR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDO1FBQ25DLE1BQU0sUUFBUSxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUM7UUFFckMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzVDLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLE1BQU0sSUFBSSxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUNuRSxNQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDL0MsTUFBTSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2pELE1BQU0sQ0FBQyxXQUFXLENBQ2hCLFdBQVcsRUFDWCxTQUFTLEtBQUssU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQzdELENBQUM7UUFFRixNQUFNLENBQUMsU0FBUyxDQUNkLHlCQUF5QixJQUFJLENBQUMsT0FBTyxFQUFFLEVBQ3ZDLENBQUMsRUFDRCxnQkFBZ0IsQ0FBQyxLQUFLLENBQ3ZCLENBQUM7UUFFRixzRkFBc0Y7UUFDdEYsdUJBQXVCO1FBQ3ZCLE1BQU0sV0FBVyxHQUNmLE1BQUEsb0JBQW9CLENBQUMsV0FBVyxtQ0FBSSxNQUFNLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBRXpFLE1BQU0sYUFBYSxHQUFzQixDQUFDLENBQUMsS0FBSyxDQUM5QztZQUNFLDhEQUE4RDtZQUM5RCxlQUFlLEVBQUUsSUFBSTtZQUNyQixtQkFBbUIsRUFBRSxJQUFJO1lBQ3pCLHNCQUFzQixFQUFFLEtBQUs7WUFDN0Isa0JBQWtCLEVBQUUsU0FBUyxDQUFDLFFBQVE7U0FDdkMsRUFDRCwrQkFBK0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQzdDLG9CQUFvQixFQUNwQixFQUFFLFdBQVcsRUFBRSxDQUNoQixDQUFDO1FBRUYsSUFBSSxhQUFhLENBQUMsWUFBWSxFQUFFO1lBQzlCLEdBQUcsQ0FBQyxJQUFJLENBQUMsK0JBQStCLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQzFFO1FBRUQsTUFBTSxXQUFXLEdBQUcsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFHNUcsTUFBTSxVQUFVLEdBQUcsYUFBYSxDQUFDLE9BQU8sQ0FBQztRQUN6QyxNQUFNLGNBQWMsR0FBbUI7WUFDckMsR0FBRyxhQUFhO1lBQ2hCLFdBQVc7WUFDWCxxQkFBcUIsRUFBRSxlQUFlLENBQ3BDLElBQUksQ0FBQyxPQUFPLEVBQ1osTUFBTSxDQUFDLFFBQVEsRUFDZixhQUFhLENBQ2Q7U0FDRixDQUFDO1FBR0YsTUFBTSxDQUFDLFVBQVUsRUFBRSxrQkFBa0IsQ0FBQyxHQUFHLE1BQU0sSUFBSSxDQUFDLFlBQVksQ0FDOUQsV0FBVyxFQUNYLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUN2QixVQUFVLEVBQ1YsY0FBYyxDQUNmLENBQUM7UUFHRix5RkFBeUY7UUFDekYsb0RBQW9EO1FBQ3BELE1BQU0sU0FBUyxHQUFlLEtBQUssQ0FBQyxJQUFJLENBQ3RDLElBQUksR0FBRyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FDMUMsQ0FBQztRQUVGLE1BQU0sU0FBUyxHQUNiLE1BQUEsYUFBYSxDQUFDLGtCQUFrQixtQ0FDaEMsQ0FBQyxNQUFNLENBQUEsTUFBQSxJQUFJLENBQUMsb0JBQW9CLDBDQUFFLFlBQVksQ0FDNUMsSUFBSSxDQUFDLE9BQU8sRUFDWixNQUFNLEVBQ04sVUFBVSxFQUNWLFNBQVMsRUFDVCxTQUFTLENBQ1YsQ0FBQSxDQUFDLENBQUM7UUFFTCxxQkFBcUI7UUFDckIsSUFBSSxZQUFzQyxDQUFDO1FBQzNDLElBQUksYUFBYSxDQUFDLGVBQWUsSUFBSSxTQUFTLEtBQUssU0FBUyxDQUFDLFFBQVEsRUFBRTtZQUNyRSxZQUFZLEdBQUcsTUFBTSxDQUFBLE1BQUEsSUFBSSxDQUFDLG9CQUFvQiwwQ0FBRSxjQUFjLENBQzVELElBQUksQ0FBQyxPQUFPLEVBQ1osTUFBTSxFQUNOLFVBQVUsRUFDVixTQUFTLEVBQ1QsU0FBUyxFQUNULE1BQU0sV0FBVyxFQUNqQixhQUFhLENBQUMsc0JBQXNCLENBQ3JDLENBQUEsQ0FBQztTQUNIO1FBRUQsTUFBTSxDQUFDLFNBQVMsQ0FDZCxhQUFhLENBQUMsZUFBZTtZQUMzQixDQUFDLENBQUMsMkJBQTJCO1lBQzdCLENBQUMsQ0FBQyw4QkFBOEIsRUFDbEMsQ0FBQyxFQUNELGdCQUFnQixDQUFDLEtBQUssQ0FDdkIsQ0FBQztRQUVGLElBQ0UsU0FBUztZQUNULGFBQWEsQ0FBQyxlQUFlO1lBQzdCLFNBQVMsS0FBSyxTQUFTLENBQUMsUUFBUTtZQUNoQyxDQUFDLFlBQVksRUFDYjtZQUNBLE1BQU0sQ0FBQyxTQUFTLENBQ2QsdUJBQXVCLFNBQVMsRUFBRSxFQUNsQyxDQUFDLEVBQ0QsZ0JBQWdCLENBQUMsS0FBSyxDQUN2QixDQUFDO1lBRUYsR0FBRyxDQUFDLElBQUksQ0FDTjtnQkFDRSxPQUFPLEVBQUUsT0FBTyxDQUFDLE1BQU07Z0JBQ3ZCLGNBQWMsRUFBRSxPQUFPLENBQUMsT0FBTztnQkFDL0IsUUFBUSxFQUFFLFFBQVEsQ0FBQyxNQUFNO2dCQUN6QixlQUFlLEVBQUUsUUFBUSxDQUFDLE9BQU87Z0JBQ2pDLFNBQVM7Z0JBQ1QsTUFBTSxFQUFFLE1BQU0sQ0FBQyxPQUFPLEVBQUU7Z0JBQ3hCLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztnQkFDckIsU0FBUyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDO2FBQ3hDLEVBQ0QsdUJBQXVCLFNBQVMsUUFBUSxJQUFJLENBQUMsK0JBQStCLENBQzFFLE9BQU8sRUFDUCxRQUFRLEVBQ1IsU0FBUyxDQUNWLEVBQUUsQ0FDSixDQUFDO1NBQ0g7YUFBTSxJQUFJLFlBQVksSUFBSSxhQUFhLENBQUMsZUFBZSxFQUFFO1lBQ3hELE1BQU0sQ0FBQyxTQUFTLENBQ2Qsc0JBQXNCLFNBQVMsRUFBRSxFQUNqQyxDQUFDLEVBQ0QsZ0JBQWdCLENBQUMsS0FBSyxDQUN2QixDQUFDO1lBRUYsR0FBRyxDQUFDLElBQUksQ0FDTjtnQkFDRSxPQUFPLEVBQUUsT0FBTyxDQUFDLE1BQU07Z0JBQ3ZCLGNBQWMsRUFBRSxPQUFPLENBQUMsT0FBTztnQkFDL0IsUUFBUSxFQUFFLFFBQVEsQ0FBQyxNQUFNO2dCQUN6QixlQUFlLEVBQUUsUUFBUSxDQUFDLE9BQU87Z0JBQ2pDLFNBQVM7Z0JBQ1QsTUFBTSxFQUFFLE1BQU0sQ0FBQyxPQUFPLEVBQUU7Z0JBQ3hCLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztnQkFDckIsU0FBUyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDO2FBQ3hDLEVBQ0Qsc0JBQXNCLFNBQVMsUUFBUSxJQUFJLENBQUMsK0JBQStCLENBQ3pFLE9BQU8sRUFDUCxRQUFRLEVBQ1IsU0FBUyxDQUNWLEVBQUUsQ0FDSixDQUFDO1NBQ0g7UUFFRCxJQUFJLHlCQUF5QixHQUMzQixPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hCLElBQUksWUFBWSxFQUFFO1lBQ2hCLHlCQUF5QixHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FDcEQsWUFBWSxFQUNaLE1BQU0sV0FBVyxFQUNqQixNQUFNLEVBQ04sVUFBVSxFQUNWLFNBQVMsRUFDVCxhQUFhLEVBQ2IsVUFBVSxFQUNWLGtCQUFrQixFQUNsQixXQUFXLEVBQ1gsVUFBVSxDQUNYLENBQUM7U0FDSDtRQUVELElBQUkseUJBQXlCLEdBQzNCLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEIsSUFBSSxDQUFDLFlBQVksSUFBSSxTQUFTLEtBQUssU0FBUyxDQUFDLFFBQVEsRUFBRTtZQUNyRCx5QkFBeUIsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQ3BELE1BQU0sRUFDTixPQUFPLEVBQ1AsUUFBUSxFQUNSLFNBQVMsRUFDVCxVQUFVLEVBQ1YsU0FBUyxFQUNULGFBQWEsRUFDYixVQUFVLEVBQ1Ysa0JBQWtCLEVBQ2xCLFdBQVcsRUFDWCxVQUFVLENBQ1gsQ0FBQztTQUNIO1FBRUQsTUFBTSxDQUFDLGtCQUFrQixFQUFFLGtCQUFrQixDQUFDLEdBQUcsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDO1lBQ2pFLHlCQUF5QjtZQUN6Qix5QkFBeUI7U0FDMUIsQ0FBQyxDQUFDO1FBR0gsSUFBSSxZQUFrQyxDQUFDO1FBQ3ZDLElBQUksZUFBZSxHQUFHLEtBQUssQ0FBQztRQUM1QixJQUFJLFNBQVMsS0FBSyxTQUFTLENBQUMsUUFBUSxJQUFJLGtCQUFrQixFQUFFO1lBQzFELEdBQUcsQ0FBQyxJQUFJLENBQ04sZ0JBQWdCLFNBQVMseUNBQXlDLENBQ25FLENBQUM7WUFDRixlQUFlLEdBQUcsSUFBSSxDQUFDO1lBQ3ZCLFlBQVksR0FBRyxrQkFBa0IsQ0FBQztTQUNuQzthQUFNO1lBQ0wsR0FBRyxDQUFDLElBQUksQ0FDTixnQkFBZ0IsU0FBUywyQ0FBMkMsQ0FDckUsQ0FBQztZQUNGLFlBQVksR0FBRyxrQkFBa0IsQ0FBQztTQUNuQztRQUVELElBQ0UsU0FBUyxLQUFLLFNBQVMsQ0FBQyxVQUFVO1lBQ2xDLGtCQUFrQjtZQUNsQixrQkFBa0IsRUFDbEI7WUFDQSxNQUFNLFNBQVMsR0FBRyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUNqRCxrQkFBa0IsQ0FBQyxLQUFLLENBQ3pCLENBQUM7WUFDRixNQUFNLG9CQUFvQixHQUFHLGtCQUFrQixDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FDdkUsa0JBQWtCLENBQUMsZ0JBQWdCLENBQ3BDLENBQUM7WUFDRixNQUFNLFdBQVcsR0FBRyxrQkFBa0IsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQ3pELGtCQUFrQixDQUFDLGdCQUFnQixDQUNwQyxDQUFDO1lBRUYsa0hBQWtIO1lBQ2xILElBQ0UsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDckIsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ3ZEO2dCQUNBLGtHQUFrRztnQkFDbEcsTUFBTSxlQUFlLEdBQUcsb0JBQW9CO3FCQUN6QyxNQUFNLENBQUMsa0JBQWtCLENBQUMsZ0JBQWdCLENBQUM7cUJBQzNDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFFakIsTUFBTSxDQUFDLFNBQVMsQ0FDZCxtREFBbUQsRUFDbkQsTUFBTSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUNqQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQ3pCLENBQUM7Z0JBRUYsR0FBRyxDQUFDLElBQUksQ0FDTjtvQkFDRSxjQUFjLEVBQUUsa0JBQWtCLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRTtvQkFDbEQsY0FBYyxFQUFFLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUU7b0JBQ2xELFNBQVMsRUFBRSxTQUFTLENBQUMsT0FBTyxFQUFFO29CQUM5Qix5QkFBeUIsRUFDdkIsa0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFO29CQUMvQyx5QkFBeUIsRUFDdkIsa0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFO29CQUMvQyxvQkFBb0IsRUFBRSxvQkFBb0IsQ0FBQyxPQUFPLEVBQUU7b0JBQ3BELGdCQUFnQixFQUFFLGtCQUFrQixDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRTtvQkFDaEUsZ0JBQWdCLEVBQUUsa0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFO29CQUNoRSxXQUFXLEVBQUUsV0FBVyxDQUFDLFFBQVEsRUFBRTtvQkFDbkMsZUFBZSxFQUFFLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUU7b0JBQ3JELGVBQWUsRUFBRSxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFO29CQUNyRCxNQUFNLEVBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRTtvQkFDeEIsY0FBYyxFQUFFLFlBQVksYUFBWixZQUFZLHVCQUFaLFlBQVksQ0FBRSxjQUFjO29CQUM1QyxJQUFJLEVBQUUsSUFBSSxDQUFDLCtCQUErQixDQUN4QyxPQUFPLEVBQ1AsUUFBUSxFQUNSLFNBQVMsQ0FDVjtvQkFDRCxXQUFXO2lCQUNaLEVBQ0QsZ0RBQWdELElBQUksQ0FBQywrQkFBK0IsQ0FDbEYsT0FBTyxFQUNQLFFBQVEsRUFDUixTQUFTLENBQ1YsRUFBRSxDQUNKLENBQUM7YUFDSDtTQUNGO1FBRUQsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNqQixPQUFPLElBQUksQ0FBQztTQUNiO1FBRUQsTUFBTSxFQUNKLEtBQUssRUFDTCxnQkFBZ0IsRUFDaEIsZ0JBQWdCLEVBQ2hCLE1BQU0sRUFBRSxZQUFZLEVBQ3BCLDBCQUEwQixFQUMxQixtQkFBbUIsR0FDcEIsR0FBRyxZQUFZLENBQUM7UUFFakIsSUFDRSxJQUFJLENBQUMsb0JBQW9CO1lBQ3pCLGFBQWEsQ0FBQyxtQkFBbUI7WUFDakMsU0FBUyxLQUFLLFNBQVMsQ0FBQyxRQUFRO1lBQ2hDLGtCQUFrQixFQUNsQjtZQUNBLG1DQUFtQztZQUNuQyxNQUFNLGFBQWEsR0FBRyxZQUFZLENBQUMseUJBQXlCLENBQzFELGtCQUFrQixDQUFDLE1BQU0sRUFDekIsSUFBSSxDQUFDLE9BQU8sRUFDWixPQUFPLEVBQ1AsUUFBUSxFQUNSLFNBQVMsQ0FBQyxJQUFJLEVBQUUsRUFBRSx5REFBeUQ7WUFDM0UsTUFBTSxXQUFXLEVBQ2pCLFNBQVMsRUFDVCxNQUFNLENBQUMsT0FBTyxFQUFFLENBQ2pCLENBQUM7WUFFRixJQUFJLGFBQWEsRUFBRTtnQkFDakIseUVBQXlFO2dCQUN6RSx1RkFBdUY7Z0JBQ3ZGLElBQUksQ0FBQyxvQkFBb0I7cUJBQ3RCLGNBQWMsQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDO3FCQUNyQyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRTtvQkFDaEIsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQztvQkFDaEQsTUFBTSxDQUFDLFNBQVMsQ0FDZCxrQkFBa0IsTUFBTSxFQUFFLEVBQzFCLENBQUMsRUFDRCxnQkFBZ0IsQ0FBQyxLQUFLLENBQ3ZCLENBQUM7Z0JBQ0osQ0FBQyxDQUFDO3FCQUNELEtBQUssQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO29CQUNoQixHQUFHLENBQUMsS0FBSyxDQUNQO3dCQUNFLE1BQU0sRUFBRSxNQUFNO3dCQUNkLFNBQVMsRUFBRSxJQUFJLENBQUMsK0JBQStCLENBQzdDLE9BQU8sRUFDUCxRQUFRLEVBQ1IsU0FBUyxDQUNWO3FCQUNGLEVBQ0Qsd0JBQXdCLENBQ3pCLENBQUM7b0JBRUYsTUFBTSxDQUFDLFNBQVMsQ0FDZCx3QkFBd0IsRUFDeEIsQ0FBQyxFQUNELGdCQUFnQixDQUFDLEtBQUssQ0FDdkIsQ0FBQztnQkFDSixDQUFDLENBQUMsQ0FBQzthQUNOO2lCQUFNO2dCQUNMLE1BQU0sQ0FBQyxTQUFTLENBQ2QsNEJBQTRCLEVBQzVCLENBQUMsRUFDRCxnQkFBZ0IsQ0FBQyxLQUFLLENBQ3ZCLENBQUM7YUFDSDtTQUNGO1FBRUQsTUFBTSxDQUFDLFNBQVMsQ0FDZCxxQkFBcUIsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUNuQyxDQUFDLEVBQ0QsZ0JBQWdCLENBQUMsS0FBSyxDQUN2QixDQUFDO1FBR0YsdURBQXVEO1FBQ3ZELE1BQU0sS0FBSyxHQUFHLFVBQVUsQ0FDdEIsVUFBVSxFQUNWLFdBQVcsRUFDWCxTQUFTLEVBQ1QsWUFBWSxDQUNiLENBQUM7UUFHRixJQUFJLGdCQUE4QyxDQUFDO1FBRW5ELDhGQUE4RjtRQUM5Riw4QkFBOEI7UUFDOUIsSUFBSSxVQUFVLEVBQUU7WUFDZCxnQkFBZ0IsR0FBRyx5QkFBeUIsQ0FDMUMsS0FBSyxFQUNMLFVBQVUsRUFDVixJQUFJLENBQUMsT0FBTyxDQUNiLENBQUM7U0FDSDtRQUVELE1BQU0sY0FBYyxHQUNsQixTQUFTLEtBQUssU0FBUyxDQUFDLFlBQVk7WUFDbEMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyw0SEFBNEg7WUFDN0ksQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUNaLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQ3pELGNBQWMsRUFDZCxTQUFTLEVBQ1QsVUFBVSxDQUNYLENBQUM7UUFDRixNQUFNLGtCQUFrQixHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMscUJBQXFCLENBQ25FLFNBQVMsRUFDVCxLQUFLLEVBQ0wsTUFBTSxFQUFFLHVIQUF1SDtRQUMvSCxhQUFhLENBQ2QsQ0FBQztRQUVGLDhHQUE4RztRQUM5RyxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FDbEQsU0FBUyxFQUNULEtBQUssRUFDTCxrQkFBa0IsQ0FDbkIsQ0FBQztRQUVGLE1BQU0seUJBQXlCLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxtQkFBbUIsQ0FDeEUsU0FBUyxFQUNULGdCQUFnQixFQUNoQixrQkFBa0IsQ0FDbkIsQ0FBQztRQUNGLE1BQU0sMEJBQTBCLEdBQzlCLElBQUksQ0FBQyxlQUFlLENBQUMsNkJBQTZCLENBQ2hELFNBQVMsRUFDVCxnQkFBZ0IsRUFDaEIsYUFBYSxDQUNkLENBQUM7UUFDSixNQUFNLFNBQVMsR0FBYztZQUMzQixLQUFLLEVBQUUsY0FBYztZQUNyQixnQkFBZ0IsRUFBRSx5QkFBeUI7WUFDM0MsZ0JBQWdCO1lBQ2hCLDBCQUEwQjtZQUMxQixtQkFBbUI7WUFDbkIsV0FBVztZQUNYLEtBQUssRUFBRSxZQUFZO1lBQ25CLEtBQUs7WUFDTCxnQkFBZ0I7WUFDaEIsV0FBVyxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxXQUFXLENBQUM7WUFDOUMsZUFBZSxFQUFFLGVBQWU7WUFDaEMsYUFBYSxFQUFFLGFBQWE7WUFDNUIsMEJBQTBCLEVBQUUsMEJBQTBCO1NBQ3ZELENBQUM7UUFFRixJQUNFLFVBQVU7WUFDVixVQUFVLENBQUMsUUFBUTtZQUNuQixnQkFBZ0I7WUFDaEIsZ0JBQWdCLENBQUMsUUFBUSxFQUN6QjtZQUNBLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUNuQixNQUFNLElBQUksS0FBSyxDQUFDLDRCQUE0QixDQUFDLENBQUM7YUFDL0M7WUFDRCxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixFQUFFLEVBQUUscUJBQXFCLENBQUMsQ0FBQztZQUNsRSxNQUFNLFdBQVcsR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQztZQUNwRCxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDbEMsTUFBTSx1QkFBdUIsR0FBRyxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUMzRCxXQUFXLEVBQ1gsVUFBVSxFQUNWLFNBQVMsRUFDVCxNQUFNO1lBQ04scURBQXFEO1lBQ3JELDhDQUE4QztZQUM5QyxjQUFjLENBQUMsYUFBYSxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQ3RFLElBQUksQ0FBQyxpQkFBaUI7Z0JBQ3BCLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxpQkFBa0IsQ0FBQyxVQUFVLEVBQUU7Z0JBQzVDLENBQUMsQ0FBQyxTQUFTLEVBQ2IsY0FBYyxDQUNmLENBQUM7WUFDRixNQUFNLENBQUMsU0FBUyxDQUNkLHFCQUFxQixFQUNyQixJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsY0FBYyxFQUMzQixnQkFBZ0IsQ0FBQyxZQUFZLENBQzlCLENBQUM7WUFDRixPQUFPLHVCQUF1QixDQUFDO1NBQ2hDO1FBRUQsT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQztJQUVPLEtBQUssQ0FBQyxxQkFBcUIsQ0FDakMsWUFBMEIsRUFDMUIsV0FBbUIsRUFDbkIsTUFBc0IsRUFDdEIsVUFBaUIsRUFDakIsU0FBb0IsRUFDcEIsYUFBZ0MsRUFDaEMsVUFBNEMsRUFDNUMsa0JBQXVELEVBQ3ZELFdBQXNCLEVBQ3RCLFVBQXdCO1FBRXhCLEdBQUcsQ0FBQyxJQUFJLENBQ047WUFDRSxTQUFTLEVBQUUsWUFBWSxDQUFDLGdCQUFnQjtZQUN4QyxTQUFTLEVBQUUsWUFBWSxDQUFDLFNBQVM7WUFDakMsaUJBQWlCLEVBQUUsWUFBWSxDQUFDLFdBQVc7WUFDM0MsZ0JBQWdCLEVBQUUsV0FBVztTQUM5QixFQUNELDRCQUE0QixDQUM3QixDQUFDO1FBQ0YsTUFBTSxhQUFhLEdBQStCLEVBQUUsQ0FBQztRQUVyRCxNQUFNLFFBQVEsR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FDekMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLEtBQUssUUFBUSxDQUFDLEVBQUUsQ0FDMUMsQ0FBQztRQUNGLE1BQU0sUUFBUSxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUN6QyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsS0FBSyxRQUFRLENBQUMsRUFBRSxDQUMxQyxDQUFDO1FBQ0YsTUFBTSxXQUFXLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQzVDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxLQUFLLFFBQVEsQ0FBQyxLQUFLLENBQzdDLENBQUM7UUFFRixJQUFJLFFBQWtCLENBQUM7UUFDdkIsSUFBSSxPQUF5QixDQUFDO1FBQzlCLElBQUksWUFBWSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ2xDLDJHQUEyRztZQUMzRyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsTUFBTSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1NBQ3pFO2FBQU0sSUFBSSxZQUFZLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7WUFDMUMsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztTQUN6QzthQUFNO1lBQ0wsbUVBQW1FO1lBQ25FLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUM5QjtRQUVELElBQUksUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDdkIsTUFBTSxpQkFBaUIsR0FBYyxRQUFRLENBQUMsR0FBRyxDQUMvQyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsV0FBVyxDQUFDLEtBQWdCLENBQzlDLENBQUM7WUFDRixNQUFNLENBQUMsU0FBUyxDQUNkLHlDQUF5QyxFQUN6QyxDQUFDLEVBQ0QsZ0JBQWdCLENBQUMsS0FBSyxDQUN2QixDQUFDO1lBRUYsTUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBRW5DLGFBQWEsQ0FBQyxJQUFJLENBQ2hCLElBQUksQ0FBQyxRQUFRO2lCQUNWLFNBQVMsQ0FDUixpQkFBaUIsRUFDakIsT0FBTyxFQUNQLFFBQVEsRUFDUixVQUFVLEVBQ1YsU0FBUyxFQUNULGFBQWEsRUFDYixTQUFTLEVBQ1QsVUFBVSxDQUNYO2lCQUNBLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO2dCQUNmLE1BQU0sQ0FBQyxTQUFTLENBQ2Qsc0NBQXNDLEVBQ3RDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxlQUFlLEVBQzVCLGdCQUFnQixDQUFDLFlBQVksQ0FDOUIsQ0FBQztnQkFFRixPQUFPLE1BQU0sQ0FBQztZQUNoQixDQUFDLENBQUMsQ0FDTCxDQUFDO1NBQ0g7UUFFRCxJQUFJLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ3ZCLE1BQU0saUJBQWlCLEdBQWMsUUFBUSxDQUFDLEdBQUcsQ0FDL0MsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxLQUFnQixDQUM5QyxDQUFDO1lBQ0YsTUFBTSxDQUFDLFNBQVMsQ0FDZCx5Q0FBeUMsRUFDekMsQ0FBQyxFQUNELGdCQUFnQixDQUFDLEtBQUssQ0FDdkIsQ0FBQztZQUVGLE1BQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUVuQyxhQUFhLENBQUMsSUFBSSxDQUNoQixJQUFJLENBQUMsUUFBUTtpQkFDViwwQkFBMEIsQ0FDekIsWUFBWSxDQUFDLE9BQU8sRUFDcEIsWUFBWSxDQUFDLFFBQVEsRUFDckIsaUJBQWlCLEVBQ2pCLE9BQU8sRUFDUCxRQUFRLEVBQ1IsVUFBVSxFQUNWLFNBQVMsRUFDVCxhQUFhLEVBQ2IsV0FBVyxDQUNaO2lCQUNBLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO2dCQUNmLE1BQU0sQ0FBQyxTQUFTLENBQ2Qsc0NBQXNDLEVBQ3RDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxlQUFlLEVBQzVCLGdCQUFnQixDQUFDLFlBQVksQ0FDOUIsQ0FBQztnQkFFRixPQUFPLE1BQU0sQ0FBQztZQUNoQixDQUFDLENBQUMsQ0FDTCxDQUFDO1NBQ0g7UUFFRCxJQUFJLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQzFCLE1BQU0sb0JBQW9CLEdBQWlCLFdBQVcsQ0FBQyxHQUFHLENBQ3hELENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxXQUFXLENBQUMsS0FBbUIsQ0FDakQsQ0FBQztZQUNGLE1BQU0sQ0FBQyxTQUFTLENBQ2QsNENBQTRDLEVBQzVDLENBQUMsRUFDRCxnQkFBZ0IsQ0FBQyxLQUFLLENBQ3ZCLENBQUM7WUFFRixNQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7WUFFbkMsYUFBYSxDQUFDLElBQUksQ0FDaEIsSUFBSSxDQUFDLFdBQVc7aUJBQ2IsU0FBUyxDQUNSLG9CQUFvQixFQUNwQixPQUFPLEVBQ1AsUUFBUSxFQUNSLFVBQVUsRUFDVixTQUFTLEVBQ1QsYUFBYSxFQUNiLFNBQVMsRUFDVCxrQkFBa0IsQ0FDbkI7aUJBQ0EsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7Z0JBQ2YsTUFBTSxDQUFDLFNBQVMsQ0FDZCx5Q0FBeUMsRUFDekMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLGVBQWUsRUFDNUIsZ0JBQWdCLENBQUMsWUFBWSxDQUM5QixDQUFDO2dCQUVGLE9BQU8sTUFBTSxDQUFDO1lBQ2hCLENBQUMsQ0FBQyxDQUNMLENBQUM7U0FDSDtRQUVELE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzFELE1BQU0sd0JBQXdCLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FDeEMsZ0JBQWdCLEVBQ2hCLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxXQUFXLENBQUMscUJBQXFCLENBQ25ELENBQUM7UUFFRixPQUFPLGdCQUFnQixDQUNyQixNQUFNLEVBQ04sUUFBUSxFQUNSLHdCQUF3QixFQUN4QixTQUFTLEVBQ1QsSUFBSSxDQUFDLE9BQU8sRUFDWixhQUFhLEVBQ2IsSUFBSSxDQUFDLGVBQWUsRUFDcEIsVUFBVSxFQUNWLFVBQVUsQ0FDWCxDQUFDO0lBQ0osQ0FBQztJQUVPLEtBQUssQ0FBQyxxQkFBcUIsQ0FDakMsTUFBc0IsRUFDdEIsT0FBYyxFQUNkLFFBQWUsRUFDZixTQUFxQixFQUNyQixVQUFpQixFQUNqQixTQUFvQixFQUNwQixhQUFnQyxFQUNoQyxVQUE0QyxFQUM1QyxrQkFBdUQsRUFDdkQsV0FBc0IsRUFDdEIsVUFBd0I7UUFFeEIsNEVBQTRFO1FBQzVFLGtGQUFrRjtRQUNsRixvQ0FBb0M7UUFDcEMsTUFBTSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQ3BELE1BQU0sRUFDTixhQUFhLENBQ2QsQ0FBQztRQUVGLE1BQU0sb0JBQW9CLEdBQUcsU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7UUFDcEQsTUFBTSxtQkFBbUIsR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM1RCxNQUFNLG1CQUFtQixHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzVELE1BQU0sa0JBQWtCLEdBQUcsWUFBWSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDL0QsTUFBTSx3QkFBd0IsR0FDNUIsU0FBUyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO1lBQ2xDLENBQUMsb0JBQW9CLElBQUksa0JBQWtCLENBQUMsQ0FBQztRQUMvQyxNQUFNLG9CQUFvQixHQUN4QixDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO1lBQ3hELFNBQVMsS0FBSyxTQUFTLENBQUMsV0FBVyxDQUFDO1FBRXRDLE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBRXZDLElBQUksdUJBQXVCLEdBQ3pCLE9BQU8sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDN0IsSUFDRSxtQkFBbUI7WUFDbkIsb0JBQW9CO1lBQ3BCLENBQUMsd0JBQXdCLElBQUksb0JBQW9CLENBQUMsRUFDbEQ7WUFDQSx1QkFBdUIsR0FBRyxtQkFBbUIsQ0FBQztnQkFDNUMsT0FBTztnQkFDUCxRQUFRO2dCQUNSLGFBQWEsRUFBRSxJQUFJLENBQUMsYUFBYTtnQkFDakMsd0JBQXdCLEVBQUUsSUFBSSxDQUFDLHdCQUF3QjtnQkFDdkQsWUFBWSxFQUFFLElBQUksQ0FBQyxjQUFjO2dCQUNqQyxTQUFTLEVBQUUsU0FBUztnQkFDcEIsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLGtCQUFrQjtnQkFDekMsYUFBYTtnQkFDYixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87YUFDdEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLGNBQWMsRUFBRSxFQUFFO2dCQUN6QixNQUFNLENBQUMsU0FBUyxDQUNkLHFCQUFxQixFQUNyQixJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsbUJBQW1CLEVBQ2hDLGdCQUFnQixDQUFDLFlBQVksQ0FDOUIsQ0FBQztnQkFDRixPQUFPLGNBQWMsQ0FBQztZQUN4QixDQUFDLENBQUMsQ0FBQztTQUNKO1FBRUQsSUFBSSx1QkFBdUIsR0FDekIsT0FBTyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM3QixJQUNFLENBQUMsa0JBQWtCLElBQUksQ0FBQyxtQkFBbUIsSUFBSSxvQkFBb0IsQ0FBQyxDQUFDO1lBQ3JFLENBQUMsd0JBQXdCLElBQUksb0JBQW9CLENBQUMsRUFDbEQ7WUFDQSw2RUFBNkU7WUFDN0UsOEVBQThFO1lBQzlFLHlCQUF5QjtZQUN6Qix1QkFBdUIsR0FBRyxtQkFBbUIsQ0FBQztnQkFDNUMsT0FBTztnQkFDUCxRQUFRO2dCQUNSLGFBQWEsRUFBRSxJQUFJLENBQUMsYUFBYTtnQkFDakMsd0JBQXdCLEVBQUUsSUFBSSxDQUFDLHdCQUF3QjtnQkFDdkQsWUFBWSxFQUFFLElBQUksQ0FBQyxjQUFjO2dCQUNqQyxTQUFTLEVBQUUsU0FBUztnQkFDcEIsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLGtCQUFrQjtnQkFDekMsYUFBYTtnQkFDYixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87YUFDdEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLGNBQWMsRUFBRSxFQUFFO2dCQUN6QixNQUFNLENBQUMsU0FBUyxDQUNkLHFCQUFxQixFQUNyQixJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsbUJBQW1CLEVBQ2hDLGdCQUFnQixDQUFDLFlBQVksQ0FDOUIsQ0FBQztnQkFDRixPQUFPLGNBQWMsQ0FBQztZQUN4QixDQUFDLENBQUMsQ0FBQztTQUNKO1FBRUQsTUFBTSxhQUFhLEdBQStCLEVBQUUsQ0FBQztRQUVyRCxtRUFBbUU7UUFDbkUsSUFBSSxtQkFBbUIsSUFBSSxvQkFBb0IsRUFBRTtZQUMvQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxFQUFFLG1CQUFtQixDQUFDLENBQUM7WUFFeEQsTUFBTSxDQUFDLFNBQVMsQ0FDZCxtREFBbUQsRUFDbkQsQ0FBQyxFQUNELGdCQUFnQixDQUFDLEtBQUssQ0FDdkIsQ0FBQztZQUNGLE1BQU0seUJBQXlCLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBRTdDLGFBQWEsQ0FBQyxJQUFJLENBQ2hCLHVCQUF1QixDQUFDLElBQUksQ0FBQyxDQUFDLGdCQUFnQixFQUFFLEVBQUUsQ0FDaEQsSUFBSSxDQUFDLFFBQVE7aUJBQ1YsbUJBQW1CLENBQ2xCLE9BQU8sRUFDUCxRQUFRLEVBQ1IsTUFBTSxFQUNOLE9BQU8sRUFDUCxRQUFRLEVBQ1IsVUFBVSxFQUNWLGdCQUFpQixFQUNqQixTQUFTLEVBQ1QsYUFBYSxFQUNiLFVBQVUsQ0FDWDtpQkFDQSxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtnQkFDZixNQUFNLENBQUMsU0FBUyxDQUNkLGdEQUFnRCxFQUNoRCxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcseUJBQXlCLEVBQ3RDLGdCQUFnQixDQUFDLFlBQVksQ0FDOUIsQ0FBQztnQkFFRixPQUFPLE1BQU0sQ0FBQztZQUNoQixDQUFDLENBQUMsQ0FDTCxDQUNGLENBQUM7U0FDSDtRQUVELHFHQUFxRztRQUNyRyxJQUFJLGtCQUFrQixJQUFJLENBQUMsbUJBQW1CLElBQUksb0JBQW9CLENBQUMsRUFBRTtZQUN2RSxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxFQUFFLG1CQUFtQixDQUFDLENBQUM7WUFFeEQsTUFBTSxDQUFDLFNBQVMsQ0FDZCxtREFBbUQsRUFDbkQsQ0FBQyxFQUNELGdCQUFnQixDQUFDLEtBQUssQ0FDdkIsQ0FBQztZQUNGLE1BQU0seUJBQXlCLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBRTdDLGFBQWEsQ0FBQyxJQUFJLENBQ2hCLHVCQUF1QixDQUFDLElBQUksQ0FBQyxDQUFDLGdCQUFnQixFQUFFLEVBQUUsQ0FDaEQsSUFBSSxDQUFDLFFBQVE7aUJBQ1YsbUJBQW1CLENBQ2xCLE9BQU8sRUFDUCxRQUFRLEVBQ1IsTUFBTSxFQUNOLE9BQU8sRUFDUCxRQUFRLEVBQ1IsVUFBVSxFQUNWLGdCQUFpQixFQUNqQixTQUFTLEVBQ1QsYUFBYSxFQUNiLFNBQVMsRUFDVCxXQUFXLENBQ1o7aUJBQ0EsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7Z0JBQ2YsTUFBTSxDQUFDLFNBQVMsQ0FDZCxnREFBZ0QsRUFDaEQsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLHlCQUF5QixFQUN0QyxnQkFBZ0IsQ0FBQyxZQUFZLENBQzlCLENBQUM7Z0JBRUYsT0FBTyxNQUFNLENBQUM7WUFDaEIsQ0FBQyxDQUFDLENBQ0wsQ0FDRixDQUFDO1NBQ0g7UUFFRCwyQkFBMkI7UUFDM0IseUdBQXlHO1FBQ3pHLDBCQUEwQjtRQUMxQixJQUFJLHdCQUF3QixJQUFJLG9CQUFvQixFQUFFO1lBQ3BELEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLEVBQUUsNEJBQTRCLENBQUMsQ0FBQztZQUVqRSxNQUFNLENBQUMsU0FBUyxDQUNkLHNEQUFzRCxFQUN0RCxDQUFDLEVBQ0QsZ0JBQWdCLENBQUMsS0FBSyxDQUN2QixDQUFDO1lBQ0YsTUFBTSx5QkFBeUIsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7WUFFN0MsYUFBYSxDQUFDLElBQUksQ0FDaEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLHVCQUF1QixFQUFFLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQ2xFLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQyxFQUFFLEVBQUUsQ0FDdkMsSUFBSSxDQUFDLFdBQVc7aUJBQ2IsbUJBQW1CLENBQ2xCLE9BQU8sRUFDUCxRQUFRLEVBQ1IsTUFBTSxFQUNOLE9BQU8sRUFDUCxRQUFRLEVBQ1IsVUFBVSxFQUNWLENBQUMsZ0JBQWlCLEVBQUUsZ0JBQWlCLENBQUMsRUFDdEMsU0FBUyxFQUNULGFBQWEsRUFDYixrQkFBa0IsQ0FDbkI7aUJBQ0EsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7Z0JBQ2YsTUFBTSxDQUFDLFNBQVMsQ0FDZCxtREFBbUQsRUFDbkQsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLHlCQUF5QixFQUN0QyxnQkFBZ0IsQ0FBQyxZQUFZLENBQzlCLENBQUM7Z0JBRUYsT0FBTyxNQUFNLENBQUM7WUFDaEIsQ0FBQyxDQUFDLENBQ1AsQ0FDRixDQUFDO1NBQ0g7UUFFRCxNQUFNLGdCQUFnQixHQUFHLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUUxRCxNQUFNLHdCQUF3QixHQUEwQixFQUFFLENBQUM7UUFDM0QsTUFBTSxpQkFBaUIsR0FBd0MsRUFBRSxDQUFDO1FBQ2xFLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDLGNBQWMsRUFBRSxFQUFFO1lBQzFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxHQUFHLGNBQWMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBQ3ZFLElBQUksY0FBYyxDQUFDLGNBQWMsRUFBRTtnQkFDakMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsQ0FBQzthQUN2RDtRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSx3QkFBd0IsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ3pDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSx3QkFBd0IsRUFBRSxFQUFFLDBCQUEwQixDQUFDLENBQUM7WUFDbkUsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELDBGQUEwRjtRQUMxRixNQUFNLGFBQWEsR0FBRyxNQUFNLGdCQUFnQixDQUMxQyxNQUFNLEVBQ04sUUFBUSxFQUNSLHdCQUF3QixFQUN4QixTQUFTLEVBQ1QsSUFBSSxDQUFDLE9BQU8sRUFDWixhQUFhLEVBQ2IsSUFBSSxDQUFDLGVBQWUsRUFDcEIsVUFBVSxFQUNWLFVBQVUsQ0FDWCxDQUFDO1FBRUYsSUFBSSxhQUFhLEVBQUU7WUFDakIsSUFBSSxDQUFDLHdCQUF3QixDQUFDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1NBQ2pFO1FBRUQsT0FBTyxhQUFhLENBQUM7SUFDdkIsQ0FBQztJQUVPLFlBQVksQ0FBQyxTQUFvQjtRQUN2QyxPQUFPLFNBQVMsS0FBSyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQztJQUN0RSxDQUFDO0lBRU8sK0JBQStCLENBQ3JDLE9BQWMsRUFDZCxRQUFlLEVBQ2YsU0FBb0I7UUFFcEIsT0FBTyxHQUFHLE9BQU8sQ0FBQyxNQUFNLElBQUksUUFBUSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsWUFBWSxDQUM5RCxTQUFTLENBQ1YsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUVPLG1DQUFtQyxDQUN6QyxTQUFvQixFQUNwQixNQUFzQixFQUN0QixhQUF1QjtRQUV2QixJQUFJLFNBQVMsS0FBSyxTQUFTLENBQUMsV0FBVyxFQUFFO1lBQ3ZDLE9BQU87Z0JBQ0wsVUFBVSxFQUFFLE1BQU0sQ0FBQyxRQUFRO2dCQUMzQixXQUFXLEVBQUUsYUFBYTthQUMzQixDQUFDO1NBQ0g7YUFBTTtZQUNMLE9BQU87Z0JBQ0wsVUFBVSxFQUFFLGFBQWE7Z0JBQ3pCLFdBQVcsRUFBRSxNQUFNLENBQUMsUUFBUTthQUM3QixDQUFDO1NBQ0g7SUFDSCxDQUFDO0lBRU8sS0FBSyxDQUFDLGNBQWM7UUFDMUIsc0RBQXNEO1FBQ3RELE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBRXRDLHdGQUF3RjtRQUN4RixNQUFNLEVBQUUsV0FBVyxFQUFFLEdBQUcsTUFBTSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLENBQUM7UUFFbEUsTUFBTSxDQUFDLFNBQVMsQ0FDZCxjQUFjLEVBQ2QsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLGtCQUFrQixFQUMvQixnQkFBZ0IsQ0FBQyxZQUFZLENBQzlCLENBQUM7UUFFRixPQUFPLFdBQVcsQ0FBQztJQUNyQixDQUFDO0lBRU8sS0FBSyxDQUFDLFlBQVksQ0FDeEIsV0FBc0IsRUFDdEIsV0FBa0IsRUFDbEIsVUFBaUIsRUFDakIsY0FBK0I7UUFJL0IsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBRWxDLE1BQU0sY0FBYyxHQUFHLDRCQUE0QixDQUNqRCxJQUFJLENBQUMsT0FBTyxFQUNaLElBQUksQ0FBQyxjQUFjLEVBQ25CLGNBQWMsQ0FDZixDQUFDO1FBQ0YsTUFBTSxjQUFjLEdBQUcsdUJBQXVCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzdELE1BQU0sNkJBQTZCLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQztZQUN0RSxDQUFDLENBQUMsK0JBQStCLENBQzdCLFVBQVUsRUFDVixJQUFJLENBQUMsY0FBYyxFQUNuQixjQUFjLENBQ2Y7WUFDSCxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxQixNQUFNLDhCQUE4QixHQUFHLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUM7WUFDeEUsQ0FBQyxDQUFDLCtCQUErQixDQUM3QixXQUFXLEVBQ1gsSUFBSSxDQUFDLGNBQWMsRUFDbkIsY0FBYyxDQUNmO1lBQ0gsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFMUIsTUFBTSxDQUFDLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSx1QkFBdUIsQ0FBQyxHQUM5RCxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUM7WUFDaEIsY0FBYztZQUNkLDZCQUE2QjtZQUM3Qiw4QkFBOEI7U0FDL0IsQ0FBQyxDQUFDO1FBRUwsTUFBTSxLQUFLLEdBQThCO1lBQ3ZDLE9BQU8sRUFBRSxPQUFPO1lBQ2hCLHNCQUFzQixFQUFFLHNCQUFzQjtZQUM5Qyx1QkFBdUIsRUFBRSx1QkFBdUI7U0FDakQsQ0FBQztRQUVGLE1BQU0saUJBQWlCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGFBQWEsQ0FBQztZQUM3RCxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87WUFDckIsV0FBVztZQUNYLEtBQUs7WUFDTCxXQUFXO1lBQ1gsVUFBVTtZQUNWLGNBQWMsRUFBRSxJQUFJLENBQUMsY0FBYztZQUNuQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsaUJBQWlCO1lBQ3pDLGNBQWMsRUFBRSxjQUFjO1NBQy9CLENBQUMsQ0FBQztRQUVILE1BQU0seUJBQXlCLEdBQzdCLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxhQUFhLENBQUM7WUFDM0MsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO1lBQ3JCLFdBQVc7WUFDWCxLQUFLO1lBQ0wsV0FBVztZQUNYLFVBQVU7WUFDVixjQUFjLEVBQUUsSUFBSSxDQUFDLGNBQWM7WUFDbkMsY0FBYyxFQUFFLGNBQWM7U0FDL0IsQ0FBQyxDQUFDO1FBRUwsTUFBTSxDQUFDLFVBQVUsRUFBRSxrQkFBa0IsQ0FBQyxHQUFHLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQztZQUN6RCxpQkFBaUI7WUFDakIseUJBQXlCO1NBQzFCLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxTQUFTLENBQ2Qsa0JBQWtCLEVBQ2xCLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxjQUFjLEVBQzNCLGdCQUFnQixDQUFDLFlBQVksQ0FDOUIsQ0FBQztRQUVGLE9BQU8sQ0FBQyxVQUFVLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRUQsc0dBQXNHO0lBQ3RHLHlGQUF5RjtJQUN6RiwyQkFBMkI7SUFDbkIscUJBQXFCLENBQzNCLE1BQXNCLEVBQ3RCLGFBQWdDO1FBRWhDLE1BQU0sRUFBRSxtQkFBbUIsRUFBRSxHQUFHLGFBQWEsQ0FBQztRQUM5QyxNQUFNLFFBQVEsR0FBRyxFQUFFLENBQUM7UUFDcEIsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBRW5CLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxHQUFHLEdBQUcsbUJBQW1CLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDbkQsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsbUJBQW1CLENBQUMsQ0FBQztZQUN2QyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxRQUFRLENBQUMsQ0FBQyxHQUFHLG1CQUFtQixFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUMzRTtRQUVELE9BQU8sQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVPLEtBQUssQ0FBQywrQkFBK0IsQ0FDM0MsS0FBMkMsRUFDM0MsaUJBQW9DLEVBQ3BDLG9CQUEwQztRQUUxQyxNQUFNLEVBQ0osV0FBVyxFQUFFLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixFQUFFLFFBQVEsRUFBRSxnQkFBZ0IsRUFBRSxFQUN6RSxtQkFBbUIsRUFBRSxrQkFBa0IsR0FDeEMsR0FBRyxpQkFBaUIsQ0FBQztRQUV0QixNQUFNLG9CQUFvQixHQUFHLG9CQUFvQixDQUFDLG9CQUFvQixDQUFDO1FBQ3ZFLE1BQU0sbUJBQW1CLEdBQ3ZCLG9CQUFvQixDQUFDLHFCQUFxQixDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDekUsTUFBTSxvQkFBb0IsR0FDeEIsb0JBQW9CLENBQUMsc0JBQXNCLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUN0RSxNQUFNLGFBQWEsR0FBRyxNQUFNLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLENBQ2pFLG1CQUFtQixFQUNuQixvQkFBb0IsQ0FDckIsQ0FBQztRQUNGLE1BQU0sVUFBVSxHQUFHLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUNqRSxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUN0QyxDQUFDO1FBQ0YsT0FBTztZQUNMLEdBQUcsVUFBVSxDQUFDLHdCQUF3QixDQUNwQyxLQUFLLEVBQ0w7Z0JBQ0UsU0FBUztnQkFDVCxpQkFBaUI7Z0JBQ2pCLDJCQUEyQixFQUFFLFFBQVE7Z0JBQ3JDLGdCQUFnQjthQUNqQixFQUNELFFBQVEsQ0FBQyxXQUFXLENBQUM7Z0JBQ25CLElBQUksRUFBRSxvQkFBb0IsQ0FBQyxJQUFJO2dCQUMvQixTQUFTLEVBQUUsb0JBQW9CLENBQUMsU0FBUztnQkFDekMsU0FBUyxFQUFFLG9CQUFvQixDQUFDLFNBQVM7Z0JBQ3pDLE9BQU8sRUFBRSxVQUFVO29CQUNqQixDQUFDLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRTtvQkFDekMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUU7Z0JBQzVDLE9BQU8sRUFBRSxVQUFVO29CQUNqQixDQUFDLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRTtvQkFDMUMsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUU7Z0JBQzNDLGdCQUFnQixFQUFFLEtBQUs7YUFDeEIsQ0FBQyxFQUNGLGtCQUFrQixFQUNsQixhQUFhLENBQUMsZUFBZSxFQUM3QixhQUFhLENBQUMsZ0JBQWdCLENBQy9CO1lBQ0QsRUFBRSxFQUFFLHdCQUF3QixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7U0FDM0MsQ0FBQztJQUNKLENBQUM7SUFFTyx3QkFBd0IsQ0FDOUIsWUFLQyxFQUNELG1CQUF3RDtRQUV4RCxNQUFNLGlCQUFpQixHQUFHLElBQUksR0FBRyxFQUFVLENBQUM7UUFDNUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsR0FBRyxZQUFZLENBQUM7UUFDOUMsQ0FBQyxDQUFDLFlBQVksQ0FBQzthQUNaLE9BQU8sQ0FBQyxDQUFDLFdBQVcsRUFBRSxFQUFFO1lBQ3ZCLE1BQU0sRUFBRSxhQUFhLEVBQUUsR0FBRyxXQUFXLENBQUM7WUFDdEMsT0FBTyxhQUFhLENBQUM7UUFDdkIsQ0FBQyxDQUFDO2FBQ0QsT0FBTyxDQUFDLENBQUMsT0FBZSxFQUFFLEVBQUU7WUFDM0IsaUJBQWlCLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO1FBQy9DLENBQUMsQ0FBQyxDQUFDO1FBRUwsS0FBSyxNQUFNLGdCQUFnQixJQUFJLG1CQUFtQixFQUFFO1lBQ2xELE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxnQkFBZ0IsQ0FBQztZQUN0QyxDQUFDLENBQUMsS0FBSyxDQUNMLGdCQUFnQixDQUFDLFVBQVUsRUFDM0IsQ0FBQyxLQUFlLEVBQUUsYUFBcUIsRUFBRSxFQUFFO2dCQUN6QyxNQUFNLFFBQVEsR0FDWixDQUFDLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLENBQzlCLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQzdDLEdBQUcsQ0FBQyxDQUFDO2dCQUNSLE1BQU0sQ0FBQyxTQUFTLENBQ2QsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLFFBQVEsR0FBRyxhQUFhLEVBQUUsQ0FBQyxFQUMzQyxRQUFRLEVBQ1IsZ0JBQWdCLENBQUMsS0FBSyxDQUN2QixDQUFDO1lBQ0osQ0FBQyxDQUNGLENBQUM7U0FDSDtRQUVELElBQUksVUFBVSxHQUFHLEtBQUssQ0FBQztRQUN2QixJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUM7UUFDdkIsSUFBSSxhQUFhLEdBQUcsS0FBSyxDQUFDO1FBQzFCLEtBQUssTUFBTSxXQUFXLElBQUksWUFBWSxFQUFFO1lBQ3RDLElBQUksV0FBVyxDQUFDLFFBQVEsS0FBSyxRQUFRLENBQUMsRUFBRSxFQUFFO2dCQUN4QyxVQUFVLEdBQUcsSUFBSSxDQUFDO2FBQ25CO1lBQ0QsSUFBSSxXQUFXLENBQUMsUUFBUSxLQUFLLFFBQVEsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3hDLFVBQVUsR0FBRyxJQUFJLENBQUM7YUFDbkI7WUFDRCxJQUFJLFdBQVcsQ0FBQyxRQUFRLEtBQUssUUFBUSxDQUFDLEtBQUssRUFBRTtnQkFDM0MsYUFBYSxHQUFHLElBQUksQ0FBQzthQUN0QjtTQUNGO1FBRUQsSUFBSSxhQUFhLElBQUksQ0FBQyxVQUFVLElBQUksVUFBVSxDQUFDLEVBQUU7WUFDL0MsSUFBSSxVQUFVLElBQUksVUFBVSxFQUFFO2dCQUM1QixNQUFNLENBQUMsU0FBUyxDQUNkLDJCQUEyQixFQUMzQixDQUFDLEVBQ0QsZ0JBQWdCLENBQUMsS0FBSyxDQUN2QixDQUFDO2dCQUNGLE1BQU0sQ0FBQyxTQUFTLENBQ2Qsb0NBQW9DLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFDbEQsQ0FBQyxFQUNELGdCQUFnQixDQUFDLEtBQUssQ0FDdkIsQ0FBQzthQUNIO2lCQUFNLElBQUksVUFBVSxFQUFFO2dCQUNyQixNQUFNLENBQUMsU0FBUyxDQUFDLHNCQUFzQixFQUFFLENBQUMsRUFBRSxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDcEUsTUFBTSxDQUFDLFNBQVMsQ0FDZCwrQkFBK0IsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUM3QyxDQUFDLEVBQ0QsZ0JBQWdCLENBQUMsS0FBSyxDQUN2QixDQUFDO2FBQ0g7aUJBQU0sSUFBSSxVQUFVLEVBQUU7Z0JBQ3JCLE1BQU0sQ0FBQyxTQUFTLENBQUMsc0JBQXNCLEVBQUUsQ0FBQyxFQUFFLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNwRSxNQUFNLENBQUMsU0FBUyxDQUNkLCtCQUErQixJQUFJLENBQUMsT0FBTyxFQUFFLEVBQzdDLENBQUMsRUFDRCxnQkFBZ0IsQ0FBQyxLQUFLLENBQ3ZCLENBQUM7YUFDSDtTQUNGO2FBQU0sSUFBSSxVQUFVLElBQUksVUFBVSxFQUFFO1lBQ25DLE1BQU0sQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxFQUFFLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2pFLE1BQU0sQ0FBQyxTQUFTLENBQ2QsNEJBQTRCLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFDMUMsQ0FBQyxFQUNELGdCQUFnQixDQUFDLEtBQUssQ0FDdkIsQ0FBQztTQUNIO2FBQU0sSUFBSSxhQUFhLEVBQUU7WUFDeEIsSUFBSSxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDM0IsTUFBTSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLEVBQUUsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQy9ELE1BQU0sQ0FBQyxTQUFTLENBQ2QsMEJBQTBCLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFDeEMsQ0FBQyxFQUNELGdCQUFnQixDQUFDLEtBQUssQ0FDdkIsQ0FBQzthQUNIO2lCQUFNO2dCQUNMLE1BQU0sQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLENBQUMsRUFBRSxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDMUQsTUFBTSxDQUFDLFNBQVMsQ0FDZCxxQkFBcUIsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUNuQyxDQUFDLEVBQ0QsZ0JBQWdCLENBQUMsS0FBSyxDQUN2QixDQUFDO2FBQ0g7U0FDRjthQUFNLElBQUksVUFBVSxFQUFFO1lBQ3JCLElBQUksWUFBWSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQzNCLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUFFLENBQUMsRUFBRSxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDNUQsTUFBTSxDQUFDLFNBQVMsQ0FDZCx1QkFBdUIsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUNyQyxDQUFDLEVBQ0QsZ0JBQWdCLENBQUMsS0FBSyxDQUN2QixDQUFDO2FBQ0g7aUJBQU07Z0JBQ0wsTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUN2RCxNQUFNLENBQUMsU0FBUyxDQUNkLGtCQUFrQixJQUFJLENBQUMsT0FBTyxFQUFFLEVBQ2hDLENBQUMsRUFDRCxnQkFBZ0IsQ0FBQyxLQUFLLENBQ3ZCLENBQUM7YUFDSDtTQUNGO2FBQU0sSUFBSSxVQUFVLEVBQUU7WUFDckIsSUFBSSxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDM0IsTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxFQUFFLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUM1RCxNQUFNLENBQUMsU0FBUyxDQUNkLHVCQUF1QixJQUFJLENBQUMsT0FBTyxFQUFFLEVBQ3JDLENBQUMsRUFDRCxnQkFBZ0IsQ0FBQyxLQUFLLENBQ3ZCLENBQUM7YUFDSDtpQkFBTTtnQkFDTCxNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUUsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3ZELE1BQU0sQ0FBQyxTQUFTLENBQ2Qsa0JBQWtCLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFDaEMsQ0FBQyxFQUNELGdCQUFnQixDQUFDLEtBQUssQ0FDdkIsQ0FBQzthQUNIO1NBQ0Y7SUFDSCxDQUFDO0lBRU8scUJBQXFCLENBQzNCLFFBQWtCLEVBQ2xCLFlBQWtCLEVBQ2xCLFVBQW1CO1FBRW5CLE1BQU0saUJBQWlCLEdBQUcsUUFBUSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMxRSxNQUFNLGlCQUFpQixHQUFHLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFMUUsdUdBQXVHO1FBQ3ZHLCtFQUErRTtRQUMvRSxJQUNFLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxFQUFFLGlCQUFpQixDQUFDO1lBQ2pELElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxFQUFFLGlCQUFpQixDQUFDLEVBQzlDO1lBQ0EsT0FBTyxJQUFJLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDM0I7UUFFRCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDcEQsSUFBSSxZQUFZLEdBQUcsSUFBSSxRQUFRLENBQzdCLGFBQWEsQ0FBQyxlQUFlLENBQzNCLFlBQVksRUFDWixpQkFBaUIsRUFDakIsU0FBUyxFQUNULElBQUksQ0FDTCxFQUNELGFBQWEsQ0FBQyxlQUFlLENBQzNCLFlBQVksRUFDWixpQkFBaUIsRUFDakIsU0FBUyxFQUNULElBQUksQ0FDTCxDQUNGLENBQUM7UUFDRixJQUFJLENBQUMsVUFBVTtZQUFFLFlBQVksR0FBRyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDdEQsT0FBTyxZQUFZLENBQUM7SUFDdEIsQ0FBQztJQUVNLEtBQUssQ0FBQyx3QkFBd0IsQ0FDbkMsV0FBbUIsRUFDbkIsU0FBb0IsRUFDcEIsTUFBc0IsRUFDdEIsS0FBcUI7UUFFckIsSUFBSTtZQUNGLE1BQU0sYUFBYSxHQUNqQixTQUFTLEtBQUssU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFDdkQsSUFBSSxPQUFPLENBQUM7WUFDWixJQUFJLGFBQWEsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFO2dCQUNuQyxPQUFPLEdBQUcsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQzthQUN2RDtpQkFBTTtnQkFDTCxNQUFNLGFBQWEsR0FBRyxjQUFjLENBQUMsT0FBTyxDQUMxQyxhQUFhLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFDOUIsSUFBSSxDQUFDLFFBQVEsQ0FDZCxDQUFDO2dCQUNGLE9BQU8sR0FBRyxNQUFNLGFBQWEsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUM7YUFDdEQ7WUFDRCxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUN2RTtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1YsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsbUNBQW1DLENBQUMsQ0FBQztZQUNsRCxPQUFPLEtBQUssQ0FBQztTQUNkO0lBQ0gsQ0FBQztJQUVPLGFBQWEsQ0FBQyxRQUFrQjtRQUN0QyxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDO1lBQ3JDLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDO1FBQ3ZCLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUM7WUFDdkMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUM7UUFDekIsT0FBTyxJQUFJLFFBQVEsQ0FBQyxZQUFZLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUVPLHFCQUFxQjtRQUMzQixPQUFPLEtBQUssQ0FDVixLQUFLLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxFQUFFOztZQUNwQixJQUFJLE9BQU8sR0FBRyxDQUFDLEVBQUU7Z0JBQ2YsR0FBRyxDQUFDLElBQUksQ0FBQyw0QkFBNEIsT0FBTyxFQUFFLENBQUMsQ0FBQztnQkFDaEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsT0FBTyxFQUFFLENBQUMsQ0FBQzthQUNwRDtZQUNELE9BQU8sTUFBQSxJQUFJLENBQUMsUUFBUSwwQ0FBRSxjQUFjLEVBQUUsQ0FBQztRQUN6QyxDQUFDLEVBQ0Q7WUFDRSxPQUFPLEVBQUUsQ0FBQztZQUNWLFVBQVUsRUFBRSxHQUFHO1lBQ2YsVUFBVSxFQUFFLElBQUk7U0FDakIsQ0FDRixDQUFDO0lBQ0osQ0FBQztDQUNGIn0=