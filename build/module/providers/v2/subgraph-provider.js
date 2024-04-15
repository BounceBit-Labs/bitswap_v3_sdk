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
        throw Error('Skip query');
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