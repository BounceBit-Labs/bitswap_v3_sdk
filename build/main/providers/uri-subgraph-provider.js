"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.URISubgraphProvider = void 0;
/**
 * Gets subgraph pools from a URI. The URI shoudl contain a JSON
 * stringified array of V2SubgraphPool objects or V3SubgraphPool
 * objects.
 *
 * @export
 * @class URISubgraphProvider
 * @template TSubgraphPool
 */
class URISubgraphProvider {
    constructor(chainId, uri, timeout = 6000, retries = 2) {
        this.chainId = chainId;
        this.uri = uri;
        this.timeout = timeout;
        this.retries = retries;
    }
    async getPools() {
        console.log('Skip query URISubgraphProvider');
        // log.info(
        //   { uri: this.uri },
        //   `About to get subgraph pools from URI ${this.uri}`
        // );
        // let allPools: TSubgraphPool[] = [];
        // await retry(
        //   async () => {
        //     const timeout = new Timeout();
        //     const timerPromise = timeout.set(this.timeout).then(() => {
        //       throw new Error(
        //         `Timed out getting pools from subgraph: ${this.timeout}`
        //       );
        //     });
        //     let response;
        //     /* eslint-disable no-useless-catch */
        //     try {
        //       response = await Promise.race([axios.get(this.uri), timerPromise]);
        //     } catch (err) {
        //       throw err;
        //     } finally {
        //       timeout.clear();
        //     }
        //     /* eslint-enable no-useless-catch */
        //     const { data: poolsBuffer, status } = response;
        //     if (status != 200) {
        //       log.error({ response }, `Unabled to get pools from ${this.uri}.`);
        //       throw new Error(`Unable to get pools from ${this.uri}`);
        //     }
        //     const pools = poolsBuffer as TSubgraphPool[];
        //     log.info(
        //       { uri: this.uri, chain: this.chainId },
        //       `Got subgraph pools from uri. Num: ${pools.length}`
        //     );
        //     allPools = pools;
        //   },
        //   {
        //     retries: this.retries,
        //     onRetry: (err, retry) => {
        //       log.info(
        //         { err },
        //         `Failed to get pools from uri ${this.uri}. Retry attempt: ${retry}`
        //       );
        //     },
        //   }
        // );
        // return allPools;
        throw Error('Skip query URISubgraphProvider');
    }
}
exports.URISubgraphProvider = URISubgraphProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXJpLXN1YmdyYXBoLXByb3ZpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3Byb3ZpZGVycy91cmktc3ViZ3JhcGgtcHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBWUE7Ozs7Ozs7O0dBUUc7QUFDSCxNQUFhLG1CQUFtQjtJQUc5QixZQUNVLE9BQWdCLEVBQ2hCLEdBQVcsRUFDWCxVQUFVLElBQUksRUFDZCxVQUFVLENBQUM7UUFIWCxZQUFPLEdBQVAsT0FBTyxDQUFTO1FBQ2hCLFFBQUcsR0FBSCxHQUFHLENBQVE7UUFDWCxZQUFPLEdBQVAsT0FBTyxDQUFPO1FBQ2QsWUFBTyxHQUFQLE9BQU8sQ0FBSTtJQUNsQixDQUFDO0lBRUcsS0FBSyxDQUFDLFFBQVE7UUFDbkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFBO1FBQzdDLFlBQVk7UUFDWix1QkFBdUI7UUFDdkIsdURBQXVEO1FBQ3ZELEtBQUs7UUFFTCxzQ0FBc0M7UUFFdEMsZUFBZTtRQUNmLGtCQUFrQjtRQUNsQixxQ0FBcUM7UUFDckMsa0VBQWtFO1FBQ2xFLHlCQUF5QjtRQUN6QixtRUFBbUU7UUFDbkUsV0FBVztRQUNYLFVBQVU7UUFFVixvQkFBb0I7UUFFcEIsNENBQTRDO1FBQzVDLFlBQVk7UUFDWiw0RUFBNEU7UUFDNUUsc0JBQXNCO1FBQ3RCLG1CQUFtQjtRQUNuQixrQkFBa0I7UUFDbEIseUJBQXlCO1FBQ3pCLFFBQVE7UUFDUiwyQ0FBMkM7UUFFM0Msc0RBQXNEO1FBRXRELDJCQUEyQjtRQUMzQiwyRUFBMkU7UUFFM0UsaUVBQWlFO1FBQ2pFLFFBQVE7UUFFUixvREFBb0Q7UUFFcEQsZ0JBQWdCO1FBQ2hCLGdEQUFnRDtRQUNoRCw0REFBNEQ7UUFDNUQsU0FBUztRQUVULHdCQUF3QjtRQUN4QixPQUFPO1FBQ1AsTUFBTTtRQUNOLDZCQUE2QjtRQUM3QixpQ0FBaUM7UUFDakMsa0JBQWtCO1FBQ2xCLG1CQUFtQjtRQUNuQiw4RUFBOEU7UUFDOUUsV0FBVztRQUNYLFNBQVM7UUFDVCxNQUFNO1FBQ04sS0FBSztRQUVMLG1CQUFtQjtRQUNuQixNQUFNLEtBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFBO0lBQy9DLENBQUM7Q0FDRjtBQXZFRCxrREF1RUMifQ==