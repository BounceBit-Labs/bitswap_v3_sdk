export const FACTORY_ADDRESS = {
  6000:'0xa1D7936dB27B5252e9f2674554719e5Cc3c654B8',
  6001: '0x30a326d09E01d7960a0A2639c8F13362e6cd304A',
  1: '0x1F98431c8aD98523631AE4a59f267346ea31F984'
}


export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'

export const POOL_INIT_CODE_HASH = {
  6000: '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54',
  6001: '0xb08f141592c0050e62ab87dfaa72052ba6475576805a571ff865bf5bcbdb56e4',
  1:'0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54'
}

/**
 * The default factory enabled fee amounts, denominated in hundredths of bips.
 */
export enum FeeAmount {
  LOWEST = 100,
  LOW = 500,
  MEDIUM = 3000,
  HIGH = 10000
}

/**
 * The default factory tick spacings by fee amount.
 */
export const TICK_SPACINGS: { [amount in FeeAmount]: number } = {
  [FeeAmount.LOWEST]: 1,
  [FeeAmount.LOW]: 10,
  [FeeAmount.MEDIUM]: 60,
  [FeeAmount.HIGH]: 200
}
