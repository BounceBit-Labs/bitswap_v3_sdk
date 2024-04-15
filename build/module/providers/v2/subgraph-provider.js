// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { ChainId } from '@uniswap/sdk-core';
import { GraphQLClient } from 'graphql-request';
const SUBGRAPH_URL_BY_CHAIN = {
    [ChainId.MAINNET]: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v2-dev',
};
const threshold = 0.025;
const PAGE_SIZE = 1000; // 1k is max possible query size from subgraph.
export class V2SubgraphProvider {
    constructor(chainId, retries = 2, timeout = 360000, rollback = true, pageSize = PAGE_SIZE) {
        this.chainId = chainId;
        this.retries = retries;
        this.timeout = timeout;
        this.rollback = rollback;
        this.pageSize = pageSize;
        const subgraphUrl = SUBGRAPH_URL_BY_CHAIN[this.chainId];
        if (!subgraphUrl) {
            throw new Error(`No subgraph url for chain id: ${this.chainId}`);
        }
        this.client = new GraphQLClient(subgraphUrl);
    }
    async getPools(_tokenIn, _tokenOut, providerConfig) {
        console.log(`Skip V2 query`);
        throw Error('Skip V2query');
        // let blockNumber = providerConfig?.blockNumber
        //   ? await providerConfig.blockNumber
        //   : undefined;
        // // Due to limitations with the Subgraph API this is the only way to parameterize the query.
        // const query2 = gql`
        //     query getPools($pageSize: Int!, $id: String) {
        //         pairs(
        //             first: $pageSize
        //             ${blockNumber ? `block: { number: ${blockNumber} }` : ``}
        //             where: { id_gt: $id }
        //         ) {
        //             id
        //             token0 { id, symbol }
        //             token1 { id, symbol }
        //             totalSupply
        //             trackedReserveETH
        //             reserveUSD
        //         }
        //     }
        // `;
        // let pools: RawV2SubgraphPool[] = [];
        // log.info(
        //   `Getting V2 pools from the subgraph with page size ${this.pageSize}${
        //     providerConfig?.blockNumber
        //       ? ` as of block ${providerConfig?.blockNumber}`
        //       : ''
        //   }.`
        // );
        // await retry(
        //   async () => {
        //     const timeout = new Timeout();
        //     const getPools = async (): Promise<RawV2SubgraphPool[]> => {
        //       let lastId = '';
        //       let pairs: RawV2SubgraphPool[] = [];
        //       let pairsPage: RawV2SubgraphPool[] = [];
        //       do {
        //         await retry(
        //           async () => {
        //             const poolsResult = await this.client.request<{
        //               pairs: RawV2SubgraphPool[];
        //             }>(query2, {
        //               pageSize: this.pageSize,
        //               id: lastId,
        //             });
        //             pairsPage = poolsResult.pairs;
        //             pairs = pairs.concat(pairsPage);
        //             lastId = pairs[pairs.length - 1]!.id;
        //           },
        //           {
        //             retries: this.retries,
        //             onRetry: (err, retry) => {
        //               pools = [];
        //               log.info(
        //                 { err },
        //                 `Failed request for page of pools from subgraph. Retry attempt: ${retry}`
        //               );
        //             },
        //           }
        //         );
        //       } while (pairsPage.length > 0);
        //       return pairs;
        //     };
        //     /* eslint-disable no-useless-catch */
        //     try {
        //       const getPoolsPromise = getPools();
        //       const timerPromise = timeout.set(this.timeout).then(() => {
        //         throw new Error(
        //           `Timed out getting pools from subgraph: ${this.timeout}`
        //         );
        //       });
        //       pools = await Promise.race([getPoolsPromise, timerPromise]);
        //       return;
        //     } catch (err) {
        //       throw err;
        //     } finally {
        //       timeout.clear();
        //     }
        //     /* eslint-enable no-useless-catch */
        //   },
        //   {
        //     retries: this.retries,
        //     onRetry: (err, retry) => {
        //       if (
        //         this.rollback &&
        //         blockNumber &&
        //         _.includes(err.message, 'indexed up to')
        //       ) {
        //         blockNumber = blockNumber - 10;
        //         log.info(
        //           `Detected subgraph indexing error. Rolled back block number to: ${blockNumber}`
        //         );
        //       }
        //       pools = [];
        //       log.info(
        //         { err },
        //         `Failed to get pools from subgraph. Retry attempt: ${retry}`
        //       );
        //     },
        //   }
        // );
        // // Filter pools that have tracked reserve ETH less than threshold.
        // // trackedReserveETH filters pools that do not involve a pool from this allowlist:
        // // https://github.com/Uniswap/v2-subgraph/blob/7c82235cad7aee4cfce8ea82f0030af3d224833e/src/mappings/pricing.ts#L43
        // // Which helps filter pools with manipulated prices/liquidity.
        // // TODO: Remove. Temporary fix to ensure tokens without trackedReserveETH are in the list.
        // const FEI = '0x956f47f50a910163d8bf957cf5846d573e7f87ca';
        // const poolsSanitized: V2SubgraphPool[] = pools
        //   .filter((pool) => {
        //     return (
        //       pool.token0.id == FEI ||
        //       pool.token1.id == FEI ||
        //       parseFloat(pool.trackedReserveETH) > threshold
        //     );
        //   })
        //   .map((pool) => {
        //     return {
        //       ...pool,
        //       id: pool.id.toLowerCase(),
        //       token0: {
        //         id: pool.token0.id.toLowerCase(),
        //       },
        //       token1: {
        //         id: pool.token1.id.toLowerCase(),
        //       },
        //       supply: parseFloat(pool.totalSupply),
        //       reserve: parseFloat(pool.trackedReserveETH),
        //       reserveUSD: parseFloat(pool.reserveUSD),
        //     };
        //   });
        // log.info(
        //   `Got ${pools.length} V2 pools from the subgraph. ${poolsSanitized.length} after filtering`
        // );
        // return poolsSanitized;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ViZ3JhcGgtcHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcHJvdmlkZXJzL3YyL3N1YmdyYXBoLXByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDZEQUE2RDtBQUM3RCxjQUFjO0FBRWQsT0FBTyxFQUFFLE9BQU8sRUFBUyxNQUFNLG1CQUFtQixDQUFDO0FBR25ELE9BQU8sRUFBTyxhQUFhLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQWtDckQsTUFBTSxxQkFBcUIsR0FBc0M7SUFDL0QsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQ2Ysa0VBQWtFO0NBQ3JFLENBQUM7QUFFRixNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUM7QUFFeEIsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLENBQUMsK0NBQStDO0FBZ0J2RSxNQUFNLE9BQU8sa0JBQWtCO0lBRzdCLFlBQ1UsT0FBZ0IsRUFDaEIsVUFBVSxDQUFDLEVBQ1gsVUFBVSxNQUFNLEVBQ2hCLFdBQVcsSUFBSSxFQUNmLFdBQVcsU0FBUztRQUpwQixZQUFPLEdBQVAsT0FBTyxDQUFTO1FBQ2hCLFlBQU8sR0FBUCxPQUFPLENBQUk7UUFDWCxZQUFPLEdBQVAsT0FBTyxDQUFTO1FBQ2hCLGFBQVEsR0FBUixRQUFRLENBQU87UUFDZixhQUFRLEdBQVIsUUFBUSxDQUFZO1FBRTVCLE1BQU0sV0FBVyxHQUFHLHFCQUFxQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN4RCxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ2hCLE1BQU0sSUFBSSxLQUFLLENBQUMsaUNBQWlDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1NBQ2xFO1FBQ0QsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRU0sS0FBSyxDQUFDLFFBQVEsQ0FDbkIsUUFBZ0IsRUFDaEIsU0FBaUIs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