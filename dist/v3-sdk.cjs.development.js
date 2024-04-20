'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _regeneratorRuntime = _interopDefault(require('regenerator-runtime'));
var sdkCore = require('@uniswap/sdk-core');
var JSBI = _interopDefault(require('jsbi'));
var invariant = _interopDefault(require('tiny-invariant'));
var abi$2 = require('@ethersproject/abi');
var address$1 = require('@ethersproject/address');
var solidity = require('@ethersproject/solidity');
var IMulticall = _interopDefault(require('@uniswap/v3-periphery/artifacts/contracts/interfaces/IMulticall.sol/IMulticall.json'));
var ISelfPermit = _interopDefault(require('@uniswap/v3-periphery/artifacts/contracts/interfaces/ISelfPermit.sol/ISelfPermit.json'));
var IQuoter = _interopDefault(require('@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json'));
var IQuoterV2 = _interopDefault(require('@uniswap/swap-router-contracts/artifacts/contracts/lens/QuoterV2.sol/QuoterV2.json'));
var IUniswapV3Staker = _interopDefault(require('@uniswap/v3-staker/artifacts/contracts/UniswapV3Staker.sol/UniswapV3Staker.json'));
var ISwapRouter = _interopDefault(require('@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json'));

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it;

  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      return function () {
        if (i >= o.length) return {
          done: true
        };
        return {
          done: false,
          value: o[i++]
        };
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  it = o[Symbol.iterator]();
  return it.next.bind(it);
}

var _TICK_SPACINGS;

var FACTORY_ADDRESS = {
  6000: '0xa1D7936dB27B5252e9f2674554719e5Cc3c654B8',
  6001: '0x30a326d09E01d7960a0A2639c8F13362e6cd304A',
  1: '0x1F98431c8aD98523631AE4a59f267346ea31F984'
};
var ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';
var POOL_INIT_CODE_HASH = {
  6000: '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54',
  6001: '0xb08f141592c0050e62ab87dfaa72052ba6475576805a571ff865bf5bcbdb56e4',
  1: '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54'
};

(function (FeeAmount) {
  FeeAmount[FeeAmount["LOWEST"] = 100] = "LOWEST";
  FeeAmount[FeeAmount["LOW"] = 500] = "LOW";
  FeeAmount[FeeAmount["MEDIUM"] = 3000] = "MEDIUM";
  FeeAmount[FeeAmount["HIGH"] = 10000] = "HIGH";
})(exports.FeeAmount || (exports.FeeAmount = {}));
/**
 * The default factory tick spacings by fee amount.
 */


var TICK_SPACINGS = (_TICK_SPACINGS = {}, _TICK_SPACINGS[exports.FeeAmount.LOWEST] = 1, _TICK_SPACINGS[exports.FeeAmount.LOW] = 10, _TICK_SPACINGS[exports.FeeAmount.MEDIUM] = 60, _TICK_SPACINGS[exports.FeeAmount.HIGH] = 200, _TICK_SPACINGS);

var NEGATIVE_ONE = /*#__PURE__*/JSBI.BigInt(-1);
var ZERO = /*#__PURE__*/JSBI.BigInt(0);
var ONE = /*#__PURE__*/JSBI.BigInt(1); // used in liquidity amount math

var Q96 = /*#__PURE__*/JSBI.exponentiate( /*#__PURE__*/JSBI.BigInt(2), /*#__PURE__*/JSBI.BigInt(96));
var Q192 = /*#__PURE__*/JSBI.exponentiate(Q96, /*#__PURE__*/JSBI.BigInt(2));

/**
 * Computes a pool address
 * @param factoryAddress The Uniswap V3 factory address
 * @param tokenA The first token of the pair, irrespective of sort order
 * @param tokenB The second token of the pair, irrespective of sort order
 * @param fee The fee tier of the pool
 * @param initCodeHashManualOverride Override the init code hash used to compute the pool address if necessary
 * @returns The pool address
 */

function computePoolAddress(_ref) {
  var factoryAddress = _ref.factoryAddress,
      tokenA = _ref.tokenA,
      tokenB = _ref.tokenB,
      fee = _ref.fee,
      initCodeHashManualOverride = _ref.initCodeHashManualOverride;

  var _ref2 = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA],
      token0 = _ref2[0],
      token1 = _ref2[1]; // does safety checks


  return address$1.getCreate2Address(factoryAddress, solidity.keccak256(['bytes'], [abi$2.defaultAbiCoder.encode(['address', 'address', 'uint24'], [token0.address, token1.address, fee])]), initCodeHashManualOverride != null ? initCodeHashManualOverride : POOL_INIT_CODE_HASH(token0.chainId));
}

var LiquidityMath = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function LiquidityMath() {}

  LiquidityMath.addDelta = function addDelta(x, y) {
    if (JSBI.lessThan(y, ZERO)) {
      return JSBI.subtract(x, JSBI.multiply(y, NEGATIVE_ONE));
    } else {
      return JSBI.add(x, y);
    }
  };

  return LiquidityMath;
}();

var FullMath = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function FullMath() {}

  FullMath.mulDivRoundingUp = function mulDivRoundingUp(a, b, denominator) {
    var product = JSBI.multiply(a, b);
    var result = JSBI.divide(product, denominator);
    if (JSBI.notEqual(JSBI.remainder(product, denominator), ZERO)) result = JSBI.add(result, ONE);
    return result;
  };

  return FullMath;
}();

var MaxUint160 = /*#__PURE__*/JSBI.subtract( /*#__PURE__*/JSBI.exponentiate( /*#__PURE__*/JSBI.BigInt(2), /*#__PURE__*/JSBI.BigInt(160)), ONE);

function multiplyIn256(x, y) {
  var product = JSBI.multiply(x, y);
  return JSBI.bitwiseAnd(product, sdkCore.MaxUint256);
}

function addIn256(x, y) {
  var sum = JSBI.add(x, y);
  return JSBI.bitwiseAnd(sum, sdkCore.MaxUint256);
}

var SqrtPriceMath = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function SqrtPriceMath() {}

  SqrtPriceMath.getAmount0Delta = function getAmount0Delta(sqrtRatioAX96, sqrtRatioBX96, liquidity, roundUp) {
    if (JSBI.greaterThan(sqrtRatioAX96, sqrtRatioBX96)) {
      var _ref = [sqrtRatioBX96, sqrtRatioAX96];
      sqrtRatioAX96 = _ref[0];
      sqrtRatioBX96 = _ref[1];
    }

    var numerator1 = JSBI.leftShift(liquidity, JSBI.BigInt(96));
    var numerator2 = JSBI.subtract(sqrtRatioBX96, sqrtRatioAX96);
    return roundUp ? FullMath.mulDivRoundingUp(FullMath.mulDivRoundingUp(numerator1, numerator2, sqrtRatioBX96), ONE, sqrtRatioAX96) : JSBI.divide(JSBI.divide(JSBI.multiply(numerator1, numerator2), sqrtRatioBX96), sqrtRatioAX96);
  };

  SqrtPriceMath.getAmount1Delta = function getAmount1Delta(sqrtRatioAX96, sqrtRatioBX96, liquidity, roundUp) {
    if (JSBI.greaterThan(sqrtRatioAX96, sqrtRatioBX96)) {
      var _ref2 = [sqrtRatioBX96, sqrtRatioAX96];
      sqrtRatioAX96 = _ref2[0];
      sqrtRatioBX96 = _ref2[1];
    }

    return roundUp ? FullMath.mulDivRoundingUp(liquidity, JSBI.subtract(sqrtRatioBX96, sqrtRatioAX96), Q96) : JSBI.divide(JSBI.multiply(liquidity, JSBI.subtract(sqrtRatioBX96, sqrtRatioAX96)), Q96);
  };

  SqrtPriceMath.getNextSqrtPriceFromInput = function getNextSqrtPriceFromInput(sqrtPX96, liquidity, amountIn, zeroForOne) {
    !JSBI.greaterThan(sqrtPX96, ZERO) ?  invariant(false)  : void 0;
    !JSBI.greaterThan(liquidity, ZERO) ?  invariant(false)  : void 0;
    return zeroForOne ? this.getNextSqrtPriceFromAmount0RoundingUp(sqrtPX96, liquidity, amountIn, true) : this.getNextSqrtPriceFromAmount1RoundingDown(sqrtPX96, liquidity, amountIn, true);
  };

  SqrtPriceMath.getNextSqrtPriceFromOutput = function getNextSqrtPriceFromOutput(sqrtPX96, liquidity, amountOut, zeroForOne) {
    !JSBI.greaterThan(sqrtPX96, ZERO) ?  invariant(false)  : void 0;
    !JSBI.greaterThan(liquidity, ZERO) ?  invariant(false)  : void 0;
    return zeroForOne ? this.getNextSqrtPriceFromAmount1RoundingDown(sqrtPX96, liquidity, amountOut, false) : this.getNextSqrtPriceFromAmount0RoundingUp(sqrtPX96, liquidity, amountOut, false);
  };

  SqrtPriceMath.getNextSqrtPriceFromAmount0RoundingUp = function getNextSqrtPriceFromAmount0RoundingUp(sqrtPX96, liquidity, amount, add) {
    if (JSBI.equal(amount, ZERO)) return sqrtPX96;
    var numerator1 = JSBI.leftShift(liquidity, JSBI.BigInt(96));

    if (add) {
      var product = multiplyIn256(amount, sqrtPX96);

      if (JSBI.equal(JSBI.divide(product, amount), sqrtPX96)) {
        var denominator = addIn256(numerator1, product);

        if (JSBI.greaterThanOrEqual(denominator, numerator1)) {
          return FullMath.mulDivRoundingUp(numerator1, sqrtPX96, denominator);
        }
      }

      return FullMath.mulDivRoundingUp(numerator1, ONE, JSBI.add(JSBI.divide(numerator1, sqrtPX96), amount));
    } else {
      var _product = multiplyIn256(amount, sqrtPX96);

      !JSBI.equal(JSBI.divide(_product, amount), sqrtPX96) ?  invariant(false)  : void 0;
      !JSBI.greaterThan(numerator1, _product) ?  invariant(false)  : void 0;

      var _denominator = JSBI.subtract(numerator1, _product);

      return FullMath.mulDivRoundingUp(numerator1, sqrtPX96, _denominator);
    }
  };

  SqrtPriceMath.getNextSqrtPriceFromAmount1RoundingDown = function getNextSqrtPriceFromAmount1RoundingDown(sqrtPX96, liquidity, amount, add) {
    if (add) {
      var quotient = JSBI.lessThanOrEqual(amount, MaxUint160) ? JSBI.divide(JSBI.leftShift(amount, JSBI.BigInt(96)), liquidity) : JSBI.divide(JSBI.multiply(amount, Q96), liquidity);
      return JSBI.add(sqrtPX96, quotient);
    } else {
      var _quotient = FullMath.mulDivRoundingUp(amount, Q96, liquidity);

      !JSBI.greaterThan(sqrtPX96, _quotient) ?  invariant(false)  : void 0;
      return JSBI.subtract(sqrtPX96, _quotient);
    }
  };

  return SqrtPriceMath;
}();

var MAX_FEE = /*#__PURE__*/JSBI.exponentiate( /*#__PURE__*/JSBI.BigInt(10), /*#__PURE__*/JSBI.BigInt(6));
var SwapMath = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function SwapMath() {}

  SwapMath.computeSwapStep = function computeSwapStep(sqrtRatioCurrentX96, sqrtRatioTargetX96, liquidity, amountRemaining, feePips) {
    var returnValues = {};
    var zeroForOne = JSBI.greaterThanOrEqual(sqrtRatioCurrentX96, sqrtRatioTargetX96);
    var exactIn = JSBI.greaterThanOrEqual(amountRemaining, ZERO);

    if (exactIn) {
      var amountRemainingLessFee = JSBI.divide(JSBI.multiply(amountRemaining, JSBI.subtract(MAX_FEE, JSBI.BigInt(feePips))), MAX_FEE);
      returnValues.amountIn = zeroForOne ? SqrtPriceMath.getAmount0Delta(sqrtRatioTargetX96, sqrtRatioCurrentX96, liquidity, true) : SqrtPriceMath.getAmount1Delta(sqrtRatioCurrentX96, sqrtRatioTargetX96, liquidity, true);

      if (JSBI.greaterThanOrEqual(amountRemainingLessFee, returnValues.amountIn)) {
        returnValues.sqrtRatioNextX96 = sqrtRatioTargetX96;
      } else {
        returnValues.sqrtRatioNextX96 = SqrtPriceMath.getNextSqrtPriceFromInput(sqrtRatioCurrentX96, liquidity, amountRemainingLessFee, zeroForOne);
      }
    } else {
      returnValues.amountOut = zeroForOne ? SqrtPriceMath.getAmount1Delta(sqrtRatioTargetX96, sqrtRatioCurrentX96, liquidity, false) : SqrtPriceMath.getAmount0Delta(sqrtRatioCurrentX96, sqrtRatioTargetX96, liquidity, false);

      if (JSBI.greaterThanOrEqual(JSBI.multiply(amountRemaining, NEGATIVE_ONE), returnValues.amountOut)) {
        returnValues.sqrtRatioNextX96 = sqrtRatioTargetX96;
      } else {
        returnValues.sqrtRatioNextX96 = SqrtPriceMath.getNextSqrtPriceFromOutput(sqrtRatioCurrentX96, liquidity, JSBI.multiply(amountRemaining, NEGATIVE_ONE), zeroForOne);
      }
    }

    var max = JSBI.equal(sqrtRatioTargetX96, returnValues.sqrtRatioNextX96);

    if (zeroForOne) {
      returnValues.amountIn = max && exactIn ? returnValues.amountIn : SqrtPriceMath.getAmount0Delta(returnValues.sqrtRatioNextX96, sqrtRatioCurrentX96, liquidity, true);
      returnValues.amountOut = max && !exactIn ? returnValues.amountOut : SqrtPriceMath.getAmount1Delta(returnValues.sqrtRatioNextX96, sqrtRatioCurrentX96, liquidity, false);
    } else {
      returnValues.amountIn = max && exactIn ? returnValues.amountIn : SqrtPriceMath.getAmount1Delta(sqrtRatioCurrentX96, returnValues.sqrtRatioNextX96, liquidity, true);
      returnValues.amountOut = max && !exactIn ? returnValues.amountOut : SqrtPriceMath.getAmount0Delta(sqrtRatioCurrentX96, returnValues.sqrtRatioNextX96, liquidity, false);
    }

    if (!exactIn && JSBI.greaterThan(returnValues.amountOut, JSBI.multiply(amountRemaining, NEGATIVE_ONE))) {
      returnValues.amountOut = JSBI.multiply(amountRemaining, NEGATIVE_ONE);
    }

    if (exactIn && JSBI.notEqual(returnValues.sqrtRatioNextX96, sqrtRatioTargetX96)) {
      // we didn't reach the target, so take the remainder of the maximum input as fee
      returnValues.feeAmount = JSBI.subtract(amountRemaining, returnValues.amountIn);
    } else {
      returnValues.feeAmount = FullMath.mulDivRoundingUp(returnValues.amountIn, JSBI.BigInt(feePips), JSBI.subtract(MAX_FEE, JSBI.BigInt(feePips)));
    }

    return [returnValues.sqrtRatioNextX96, returnValues.amountIn, returnValues.amountOut, returnValues.feeAmount];
  };

  return SwapMath;
}();

var TWO = /*#__PURE__*/JSBI.BigInt(2);
var POWERS_OF_2 = /*#__PURE__*/[128, 64, 32, 16, 8, 4, 2, 1].map(function (pow) {
  return [pow, JSBI.exponentiate(TWO, JSBI.BigInt(pow))];
});
function mostSignificantBit(x) {
  !JSBI.greaterThan(x, ZERO) ?  invariant(false, 'ZERO')  : void 0;
  !JSBI.lessThanOrEqual(x, sdkCore.MaxUint256) ?  invariant(false, 'MAX')  : void 0;
  var msb = 0;

  for (var _iterator = _createForOfIteratorHelperLoose(POWERS_OF_2), _step; !(_step = _iterator()).done;) {
    var _step$value = _step.value,
        power = _step$value[0],
        min = _step$value[1];

    if (JSBI.greaterThanOrEqual(x, min)) {
      x = JSBI.signedRightShift(x, JSBI.BigInt(power));
      msb += power;
    }
  }

  return msb;
}

function mulShift(val, mulBy) {
  return JSBI.signedRightShift(JSBI.multiply(val, JSBI.BigInt(mulBy)), JSBI.BigInt(128));
}

var Q32 = /*#__PURE__*/JSBI.exponentiate( /*#__PURE__*/JSBI.BigInt(2), /*#__PURE__*/JSBI.BigInt(32));
var TickMath = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function TickMath() {}
  /**
   * Returns the sqrt ratio as a Q64.96 for the given tick. The sqrt ratio is computed as sqrt(1.0001)^tick
   * @param tick the tick for which to compute the sqrt ratio
   */


  TickMath.getSqrtRatioAtTick = function getSqrtRatioAtTick(tick) {
    !(tick >= TickMath.MIN_TICK && tick <= TickMath.MAX_TICK && Number.isInteger(tick)) ?  invariant(false, 'TICK')  : void 0;
    var absTick = tick < 0 ? tick * -1 : tick;
    var ratio = (absTick & 0x1) != 0 ? JSBI.BigInt('0xfffcb933bd6fad37aa2d162d1a594001') : JSBI.BigInt('0x100000000000000000000000000000000');
    if ((absTick & 0x2) != 0) ratio = mulShift(ratio, '0xfff97272373d413259a46990580e213a');
    if ((absTick & 0x4) != 0) ratio = mulShift(ratio, '0xfff2e50f5f656932ef12357cf3c7fdcc');
    if ((absTick & 0x8) != 0) ratio = mulShift(ratio, '0xffe5caca7e10e4e61c3624eaa0941cd0');
    if ((absTick & 0x10) != 0) ratio = mulShift(ratio, '0xffcb9843d60f6159c9db58835c926644');
    if ((absTick & 0x20) != 0) ratio = mulShift(ratio, '0xff973b41fa98c081472e6896dfb254c0');
    if ((absTick & 0x40) != 0) ratio = mulShift(ratio, '0xff2ea16466c96a3843ec78b326b52861');
    if ((absTick & 0x80) != 0) ratio = mulShift(ratio, '0xfe5dee046a99a2a811c461f1969c3053');
    if ((absTick & 0x100) != 0) ratio = mulShift(ratio, '0xfcbe86c7900a88aedcffc83b479aa3a4');
    if ((absTick & 0x200) != 0) ratio = mulShift(ratio, '0xf987a7253ac413176f2b074cf7815e54');
    if ((absTick & 0x400) != 0) ratio = mulShift(ratio, '0xf3392b0822b70005940c7a398e4b70f3');
    if ((absTick & 0x800) != 0) ratio = mulShift(ratio, '0xe7159475a2c29b7443b29c7fa6e889d9');
    if ((absTick & 0x1000) != 0) ratio = mulShift(ratio, '0xd097f3bdfd2022b8845ad8f792aa5825');
    if ((absTick & 0x2000) != 0) ratio = mulShift(ratio, '0xa9f746462d870fdf8a65dc1f90e061e5');
    if ((absTick & 0x4000) != 0) ratio = mulShift(ratio, '0x70d869a156d2a1b890bb3df62baf32f7');
    if ((absTick & 0x8000) != 0) ratio = mulShift(ratio, '0x31be135f97d08fd981231505542fcfa6');
    if ((absTick & 0x10000) != 0) ratio = mulShift(ratio, '0x9aa508b5b7a84e1c677de54f3e99bc9');
    if ((absTick & 0x20000) != 0) ratio = mulShift(ratio, '0x5d6af8dedb81196699c329225ee604');
    if ((absTick & 0x40000) != 0) ratio = mulShift(ratio, '0x2216e584f5fa1ea926041bedfe98');
    if ((absTick & 0x80000) != 0) ratio = mulShift(ratio, '0x48a170391f7dc42444e8fa2');
    if (tick > 0) ratio = JSBI.divide(sdkCore.MaxUint256, ratio); // back to Q96

    return JSBI.greaterThan(JSBI.remainder(ratio, Q32), ZERO) ? JSBI.add(JSBI.divide(ratio, Q32), ONE) : JSBI.divide(ratio, Q32);
  }
  /**
   * Returns the tick corresponding to a given sqrt ratio, s.t. #getSqrtRatioAtTick(tick) <= sqrtRatioX96
   * and #getSqrtRatioAtTick(tick + 1) > sqrtRatioX96
   * @param sqrtRatioX96 the sqrt ratio as a Q64.96 for which to compute the tick
   */
  ;

  TickMath.getTickAtSqrtRatio = function getTickAtSqrtRatio(sqrtRatioX96) {
    !(JSBI.greaterThanOrEqual(sqrtRatioX96, TickMath.MIN_SQRT_RATIO) && JSBI.lessThan(sqrtRatioX96, TickMath.MAX_SQRT_RATIO)) ?  invariant(false, 'SQRT_RATIO')  : void 0;
    var sqrtRatioX128 = JSBI.leftShift(sqrtRatioX96, JSBI.BigInt(32));
    var msb = mostSignificantBit(sqrtRatioX128);
    var r;

    if (JSBI.greaterThanOrEqual(JSBI.BigInt(msb), JSBI.BigInt(128))) {
      r = JSBI.signedRightShift(sqrtRatioX128, JSBI.BigInt(msb - 127));
    } else {
      r = JSBI.leftShift(sqrtRatioX128, JSBI.BigInt(127 - msb));
    }

    var log_2 = JSBI.leftShift(JSBI.subtract(JSBI.BigInt(msb), JSBI.BigInt(128)), JSBI.BigInt(64));

    for (var i = 0; i < 14; i++) {
      r = JSBI.signedRightShift(JSBI.multiply(r, r), JSBI.BigInt(127));
      var f = JSBI.signedRightShift(r, JSBI.BigInt(128));
      log_2 = JSBI.bitwiseOr(log_2, JSBI.leftShift(f, JSBI.BigInt(63 - i)));
      r = JSBI.signedRightShift(r, f);
    }

    var log_sqrt10001 = JSBI.multiply(log_2, JSBI.BigInt('255738958999603826347141'));
    var tickLow = JSBI.toNumber(JSBI.signedRightShift(JSBI.subtract(log_sqrt10001, JSBI.BigInt('3402992956809132418596140100660247210')), JSBI.BigInt(128)));
    var tickHigh = JSBI.toNumber(JSBI.signedRightShift(JSBI.add(log_sqrt10001, JSBI.BigInt('291339464771989622907027621153398088495')), JSBI.BigInt(128)));
    return tickLow === tickHigh ? tickLow : JSBI.lessThanOrEqual(TickMath.getSqrtRatioAtTick(tickHigh), sqrtRatioX96) ? tickHigh : tickLow;
  };

  return TickMath;
}();
/**
 * The minimum tick that can be used on any pool.
 */

TickMath.MIN_TICK = -887272;
/**
 * The maximum tick that can be used on any pool.
 */

TickMath.MAX_TICK = -TickMath.MIN_TICK;
/**
 * The sqrt ratio corresponding to the minimum tick that could be used on any pool.
 */

TickMath.MIN_SQRT_RATIO = /*#__PURE__*/JSBI.BigInt('4295128739');
/**
 * The sqrt ratio corresponding to the maximum tick that could be used on any pool.
 */

TickMath.MAX_SQRT_RATIO = /*#__PURE__*/JSBI.BigInt('1461446703485210103287273052203988822378723970342');

/**
 * This tick data provider does not know how to fetch any tick data. It throws whenever it is required. Useful if you
 * do not need to load tick data for your use case.
 */
var NoTickDataProvider = /*#__PURE__*/function () {
  function NoTickDataProvider() {}

  var _proto = NoTickDataProvider.prototype;

  _proto.getTick = /*#__PURE__*/function () {
    var _getTick = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(_tick) {
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              throw new Error(NoTickDataProvider.ERROR_MESSAGE);

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    function getTick(_x) {
      return _getTick.apply(this, arguments);
    }

    return getTick;
  }();

  _proto.nextInitializedTickWithinOneWord = /*#__PURE__*/function () {
    var _nextInitializedTickWithinOneWord = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(_tick, _lte, _tickSpacing) {
      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              throw new Error(NoTickDataProvider.ERROR_MESSAGE);

            case 1:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    function nextInitializedTickWithinOneWord(_x2, _x3, _x4) {
      return _nextInitializedTickWithinOneWord.apply(this, arguments);
    }

    return nextInitializedTickWithinOneWord;
  }();

  return NoTickDataProvider;
}();
NoTickDataProvider.ERROR_MESSAGE = 'No tick data provider was given';

/**
 * Determines if a tick list is sorted
 * @param list The tick list
 * @param comparator The comparator
 * @returns true if sorted
 */
function isSorted(list, comparator) {
  for (var i = 0; i < list.length - 1; i++) {
    if (comparator(list[i], list[i + 1]) > 0) {
      return false;
    }
  }

  return true;
}

function tickComparator(a, b) {
  return a.index - b.index;
}
/**
 * Utility methods for interacting with sorted lists of ticks
 */


var TickList = /*#__PURE__*/function () {
  /**
   * Cannot be constructed
   */
  function TickList() {}

  TickList.validateList = function validateList(ticks, tickSpacing) {
    !(tickSpacing > 0) ?  invariant(false, 'TICK_SPACING_NONZERO')  : void 0; // ensure ticks are spaced appropriately

    !ticks.every(function (_ref) {
      var index = _ref.index;
      return index % tickSpacing === 0;
    }) ?  invariant(false, 'TICK_SPACING')  : void 0; // ensure tick liquidity deltas sum to 0

    !JSBI.equal(ticks.reduce(function (accumulator, _ref2) {
      var liquidityNet = _ref2.liquidityNet;
      return JSBI.add(accumulator, liquidityNet);
    }, ZERO), ZERO) ?  invariant(false, 'ZERO_NET')  : void 0;
    !isSorted(ticks, tickComparator) ?  invariant(false, 'SORTED')  : void 0;
  };

  TickList.isBelowSmallest = function isBelowSmallest(ticks, tick) {
    !(ticks.length > 0) ?  invariant(false, 'LENGTH')  : void 0;
    return tick < ticks[0].index;
  };

  TickList.isAtOrAboveLargest = function isAtOrAboveLargest(ticks, tick) {
    !(ticks.length > 0) ?  invariant(false, 'LENGTH')  : void 0;
    return tick >= ticks[ticks.length - 1].index;
  };

  TickList.getTick = function getTick(ticks, index) {
    var tick = ticks[this.binarySearch(ticks, index)];
    !(tick.index === index) ?  invariant(false, 'NOT_CONTAINED')  : void 0;
    return tick;
  }
  /**
   * Finds the largest tick in the list of ticks that is less than or equal to tick
   * @param ticks list of ticks
   * @param tick tick to find the largest tick that is less than or equal to tick
   * @private
   */
  ;

  TickList.binarySearch = function binarySearch(ticks, tick) {
    !!this.isBelowSmallest(ticks, tick) ?  invariant(false, 'BELOW_SMALLEST')  : void 0;
    var l = 0;
    var r = ticks.length - 1;
    var i;

    while (true) {
      i = Math.floor((l + r) / 2);

      if (ticks[i].index <= tick && (i === ticks.length - 1 || ticks[i + 1].index > tick)) {
        return i;
      }

      if (ticks[i].index < tick) {
        l = i + 1;
      } else {
        r = i - 1;
      }
    }
  };

  TickList.nextInitializedTick = function nextInitializedTick(ticks, tick, lte) {
    if (lte) {
      !!TickList.isBelowSmallest(ticks, tick) ?  invariant(false, 'BELOW_SMALLEST')  : void 0;

      if (TickList.isAtOrAboveLargest(ticks, tick)) {
        return ticks[ticks.length - 1];
      }

      var index = this.binarySearch(ticks, tick);
      return ticks[index];
    } else {
      !!this.isAtOrAboveLargest(ticks, tick) ?  invariant(false, 'AT_OR_ABOVE_LARGEST')  : void 0;

      if (this.isBelowSmallest(ticks, tick)) {
        return ticks[0];
      }

      var _index = this.binarySearch(ticks, tick);

      return ticks[_index + 1];
    }
  };

  TickList.nextInitializedTickWithinOneWord = function nextInitializedTickWithinOneWord(ticks, tick, lte, tickSpacing) {
    var compressed = Math.floor(tick / tickSpacing); // matches rounding in the code

    if (lte) {
      var wordPos = compressed >> 8;
      var minimum = (wordPos << 8) * tickSpacing;

      if (TickList.isBelowSmallest(ticks, tick)) {
        return [minimum, false];
      }

      var index = TickList.nextInitializedTick(ticks, tick, lte).index;
      var nextInitializedTick = Math.max(minimum, index);
      return [nextInitializedTick, nextInitializedTick === index];
    } else {
      var _wordPos = compressed + 1 >> 8;

      var maximum = ((_wordPos + 1 << 8) - 1) * tickSpacing;

      if (this.isAtOrAboveLargest(ticks, tick)) {
        return [maximum, false];
      }

      var _index2 = this.nextInitializedTick(ticks, tick, lte).index;

      var _nextInitializedTick = Math.min(maximum, _index2);

      return [_nextInitializedTick, _nextInitializedTick === _index2];
    }
  };

  return TickList;
}();

/**
 * Converts a big int to a hex string
 * @param bigintIsh
 * @returns The hex encoded calldata
 */

function toHex(bigintIsh) {
  var bigInt = JSBI.BigInt(bigintIsh);
  var hex = bigInt.toString(16);

  if (hex.length % 2 !== 0) {
    hex = "0" + hex;
  }

  return "0x" + hex;
}

/**
 * Converts a route to a hex encoded path
 * @param route the v3 path to convert to an encoded path
 * @param exactOutput whether the route should be encoded in reverse, for making exact output swaps
 */

function encodeRouteToPath(route, exactOutput) {
  var firstInputToken = route.input.wrapped;

  var _route$pools$reduce = route.pools.reduce(function (_ref, pool, index) {
    var inputToken = _ref.inputToken,
        path = _ref.path,
        types = _ref.types;
    var outputToken = pool.token0.equals(inputToken) ? pool.token1 : pool.token0;

    if (index === 0) {
      return {
        inputToken: outputToken,
        types: ['address', 'uint24', 'address'],
        path: [inputToken.address, pool.fee, outputToken.address]
      };
    } else {
      return {
        inputToken: outputToken,
        types: [].concat(types, ['uint24', 'address']),
        path: [].concat(path, [pool.fee, outputToken.address])
      };
    }
  }, {
    inputToken: firstInputToken,
    path: [],
    types: []
  }),
      path = _route$pools$reduce.path,
      types = _route$pools$reduce.types;

  return exactOutput ? solidity.pack(types.reverse(), path.reverse()) : solidity.pack(types, path);
}

/**
 * Returns the sqrt ratio as a Q64.96 corresponding to a given ratio of amount1 and amount0
 * @param amount1 The numerator amount i.e., the amount of token1
 * @param amount0 The denominator amount i.e., the amount of token0
 * @returns The sqrt ratio
 */

function encodeSqrtRatioX96(amount1, amount0) {
  var numerator = JSBI.leftShift(JSBI.BigInt(amount1), JSBI.BigInt(192));
  var denominator = JSBI.BigInt(amount0);
  var ratioX192 = JSBI.divide(numerator, denominator);
  return sdkCore.sqrt(ratioX192);
}

/**
 * Returns an imprecise maximum amount of liquidity received for a given amount of token 0.
 * This function is available to accommodate LiquidityAmounts#getLiquidityForAmount0 in the v3 periphery,
 * which could be more precise by at least 32 bits by dividing by Q64 instead of Q96 in the intermediate step,
 * and shifting the subtracted ratio left by 32 bits. This imprecise calculation will likely be replaced in a future
 * v3 router contract.
 * @param sqrtRatioAX96 The price at the lower boundary
 * @param sqrtRatioBX96 The price at the upper boundary
 * @param amount0 The token0 amount
 * @returns liquidity for amount0, imprecise
 */

function maxLiquidityForAmount0Imprecise(sqrtRatioAX96, sqrtRatioBX96, amount0) {
  if (JSBI.greaterThan(sqrtRatioAX96, sqrtRatioBX96)) {
    var _ref = [sqrtRatioBX96, sqrtRatioAX96];
    sqrtRatioAX96 = _ref[0];
    sqrtRatioBX96 = _ref[1];
  }

  var intermediate = JSBI.divide(JSBI.multiply(sqrtRatioAX96, sqrtRatioBX96), Q96);
  return JSBI.divide(JSBI.multiply(JSBI.BigInt(amount0), intermediate), JSBI.subtract(sqrtRatioBX96, sqrtRatioAX96));
}
/**
 * Returns a precise maximum amount of liquidity received for a given amount of token 0 by dividing by Q64 instead of Q96 in the intermediate step,
 * and shifting the subtracted ratio left by 32 bits.
 * @param sqrtRatioAX96 The price at the lower boundary
 * @param sqrtRatioBX96 The price at the upper boundary
 * @param amount0 The token0 amount
 * @returns liquidity for amount0, precise
 */


function maxLiquidityForAmount0Precise(sqrtRatioAX96, sqrtRatioBX96, amount0) {
  if (JSBI.greaterThan(sqrtRatioAX96, sqrtRatioBX96)) {
    var _ref2 = [sqrtRatioBX96, sqrtRatioAX96];
    sqrtRatioAX96 = _ref2[0];
    sqrtRatioBX96 = _ref2[1];
  }

  var numerator = JSBI.multiply(JSBI.multiply(JSBI.BigInt(amount0), sqrtRatioAX96), sqrtRatioBX96);
  var denominator = JSBI.multiply(Q96, JSBI.subtract(sqrtRatioBX96, sqrtRatioAX96));
  return JSBI.divide(numerator, denominator);
}
/**
 * Computes the maximum amount of liquidity received for a given amount of token1
 * @param sqrtRatioAX96 The price at the lower tick boundary
 * @param sqrtRatioBX96 The price at the upper tick boundary
 * @param amount1 The token1 amount
 * @returns liquidity for amount1
 */


function maxLiquidityForAmount1(sqrtRatioAX96, sqrtRatioBX96, amount1) {
  if (JSBI.greaterThan(sqrtRatioAX96, sqrtRatioBX96)) {
    var _ref3 = [sqrtRatioBX96, sqrtRatioAX96];
    sqrtRatioAX96 = _ref3[0];
    sqrtRatioBX96 = _ref3[1];
  }

  return JSBI.divide(JSBI.multiply(JSBI.BigInt(amount1), Q96), JSBI.subtract(sqrtRatioBX96, sqrtRatioAX96));
}
/**
 * Computes the maximum amount of liquidity received for a given amount of token0, token1,
 * and the prices at the tick boundaries.
 * @param sqrtRatioCurrentX96 the current price
 * @param sqrtRatioAX96 price at lower boundary
 * @param sqrtRatioBX96 price at upper boundary
 * @param amount0 token0 amount
 * @param amount1 token1 amount
 * @param useFullPrecision if false, liquidity will be maximized according to what the router can calculate,
 * not what core can theoretically support
 */


function maxLiquidityForAmounts(sqrtRatioCurrentX96, sqrtRatioAX96, sqrtRatioBX96, amount0, amount1, useFullPrecision) {
  if (JSBI.greaterThan(sqrtRatioAX96, sqrtRatioBX96)) {
    var _ref4 = [sqrtRatioBX96, sqrtRatioAX96];
    sqrtRatioAX96 = _ref4[0];
    sqrtRatioBX96 = _ref4[1];
  }

  var maxLiquidityForAmount0 = useFullPrecision ? maxLiquidityForAmount0Precise : maxLiquidityForAmount0Imprecise;

  if (JSBI.lessThanOrEqual(sqrtRatioCurrentX96, sqrtRatioAX96)) {
    return maxLiquidityForAmount0(sqrtRatioAX96, sqrtRatioBX96, amount0);
  } else if (JSBI.lessThan(sqrtRatioCurrentX96, sqrtRatioBX96)) {
    var liquidity0 = maxLiquidityForAmount0(sqrtRatioCurrentX96, sqrtRatioBX96, amount0);
    var liquidity1 = maxLiquidityForAmount1(sqrtRatioAX96, sqrtRatioCurrentX96, amount1);
    return JSBI.lessThan(liquidity0, liquidity1) ? liquidity0 : liquidity1;
  } else {
    return maxLiquidityForAmount1(sqrtRatioAX96, sqrtRatioBX96, amount1);
  }
}

/**
 * Returns the closest tick that is nearest a given tick and usable for the given tick spacing
 * @param tick the target tick
 * @param tickSpacing the spacing of the pool
 */

function nearestUsableTick(tick, tickSpacing) {
  !(Number.isInteger(tick) && Number.isInteger(tickSpacing)) ?  invariant(false, 'INTEGERS')  : void 0;
  !(tickSpacing > 0) ?  invariant(false, 'TICK_SPACING')  : void 0;
  !(tick >= TickMath.MIN_TICK && tick <= TickMath.MAX_TICK) ?  invariant(false, 'TICK_BOUND')  : void 0;
  var rounded = Math.round(tick / tickSpacing) * tickSpacing;
  if (rounded < TickMath.MIN_TICK) return rounded + tickSpacing;else if (rounded > TickMath.MAX_TICK) return rounded - tickSpacing;else return rounded;
}

var Q128 = /*#__PURE__*/JSBI.exponentiate( /*#__PURE__*/JSBI.BigInt(2), /*#__PURE__*/JSBI.BigInt(128));
var PositionLibrary = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function PositionLibrary() {} // replicates the portions of Position#update required to compute unaccounted fees


  PositionLibrary.getTokensOwed = function getTokensOwed(feeGrowthInside0LastX128, feeGrowthInside1LastX128, liquidity, feeGrowthInside0X128, feeGrowthInside1X128) {
    var tokensOwed0 = JSBI.divide(JSBI.multiply(subIn256(feeGrowthInside0X128, feeGrowthInside0LastX128), liquidity), Q128);
    var tokensOwed1 = JSBI.divide(JSBI.multiply(subIn256(feeGrowthInside1X128, feeGrowthInside1LastX128), liquidity), Q128);
    return [tokensOwed0, tokensOwed1];
  };

  return PositionLibrary;
}();

/**
 * Returns a price object corresponding to the input tick and the base/quote token
 * Inputs must be tokens because the address order is used to interpret the price represented by the tick
 * @param baseToken the base token of the price
 * @param quoteToken the quote token of the price
 * @param tick the tick for which to return the price
 */

function tickToPrice(baseToken, quoteToken, tick) {
  var sqrtRatioX96 = TickMath.getSqrtRatioAtTick(tick);
  var ratioX192 = JSBI.multiply(sqrtRatioX96, sqrtRatioX96);
  return baseToken.sortsBefore(quoteToken) ? new sdkCore.Price(baseToken, quoteToken, Q192, ratioX192) : new sdkCore.Price(baseToken, quoteToken, ratioX192, Q192);
}
/**
 * Returns the first tick for which the given price is greater than or equal to the tick price
 * @param price for which to return the closest tick that represents a price less than or equal to the input price,
 * i.e. the price of the returned tick is less than or equal to the input price
 */

function priceToClosestTick(price) {
  var sorted = price.baseCurrency.sortsBefore(price.quoteCurrency);
  var sqrtRatioX96 = sorted ? encodeSqrtRatioX96(price.numerator, price.denominator) : encodeSqrtRatioX96(price.denominator, price.numerator);
  var tick = TickMath.getTickAtSqrtRatio(sqrtRatioX96);
  var nextTickPrice = tickToPrice(price.baseCurrency, price.quoteCurrency, tick + 1);

  if (sorted) {
    if (!price.lessThan(nextTickPrice)) {
      tick++;
    }
  } else {
    if (!price.greaterThan(nextTickPrice)) {
      tick++;
    }
  }

  return tick;
}

var Q256 = /*#__PURE__*/JSBI.exponentiate( /*#__PURE__*/JSBI.BigInt(2), /*#__PURE__*/JSBI.BigInt(256));
function subIn256(x, y) {
  var difference = JSBI.subtract(x, y);

  if (JSBI.lessThan(difference, ZERO)) {
    return JSBI.add(Q256, difference);
  } else {
    return difference;
  }
}
var TickLibrary = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function TickLibrary() {}

  TickLibrary.getFeeGrowthInside = function getFeeGrowthInside(feeGrowthOutsideLower, feeGrowthOutsideUpper, tickLower, tickUpper, tickCurrent, feeGrowthGlobal0X128, feeGrowthGlobal1X128) {
    var feeGrowthBelow0X128;
    var feeGrowthBelow1X128;

    if (tickCurrent >= tickLower) {
      feeGrowthBelow0X128 = feeGrowthOutsideLower.feeGrowthOutside0X128;
      feeGrowthBelow1X128 = feeGrowthOutsideLower.feeGrowthOutside1X128;
    } else {
      feeGrowthBelow0X128 = subIn256(feeGrowthGlobal0X128, feeGrowthOutsideLower.feeGrowthOutside0X128);
      feeGrowthBelow1X128 = subIn256(feeGrowthGlobal1X128, feeGrowthOutsideLower.feeGrowthOutside1X128);
    }

    var feeGrowthAbove0X128;
    var feeGrowthAbove1X128;

    if (tickCurrent < tickUpper) {
      feeGrowthAbove0X128 = feeGrowthOutsideUpper.feeGrowthOutside0X128;
      feeGrowthAbove1X128 = feeGrowthOutsideUpper.feeGrowthOutside1X128;
    } else {
      feeGrowthAbove0X128 = subIn256(feeGrowthGlobal0X128, feeGrowthOutsideUpper.feeGrowthOutside0X128);
      feeGrowthAbove1X128 = subIn256(feeGrowthGlobal1X128, feeGrowthOutsideUpper.feeGrowthOutside1X128);
    }

    return [subIn256(subIn256(feeGrowthGlobal0X128, feeGrowthBelow0X128), feeGrowthAbove0X128), subIn256(subIn256(feeGrowthGlobal1X128, feeGrowthBelow1X128), feeGrowthAbove1X128)];
  };

  return TickLibrary;
}();

var Tick = function Tick(_ref) {
  var index = _ref.index,
      liquidityGross = _ref.liquidityGross,
      liquidityNet = _ref.liquidityNet;
  !(index >= TickMath.MIN_TICK && index <= TickMath.MAX_TICK) ?  invariant(false, 'TICK')  : void 0;
  this.index = index;
  this.liquidityGross = JSBI.BigInt(liquidityGross);
  this.liquidityNet = JSBI.BigInt(liquidityNet);
};

/**
 * A data provider for ticks that is backed by an in-memory array of ticks.
 */

var TickListDataProvider = /*#__PURE__*/function () {
  function TickListDataProvider(ticks, tickSpacing) {
    var ticksMapped = ticks.map(function (t) {
      return t instanceof Tick ? t : new Tick(t);
    });
    TickList.validateList(ticksMapped, tickSpacing);
    this.ticks = ticksMapped;
  }

  var _proto = TickListDataProvider.prototype;

  _proto.getTick = /*#__PURE__*/function () {
    var _getTick = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(tick) {
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", TickList.getTick(this.ticks, tick));

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function getTick(_x) {
      return _getTick.apply(this, arguments);
    }

    return getTick;
  }();

  _proto.nextInitializedTickWithinOneWord = /*#__PURE__*/function () {
    var _nextInitializedTickWithinOneWord = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(tick, lte, tickSpacing) {
      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.abrupt("return", TickList.nextInitializedTickWithinOneWord(this.ticks, tick, lte, tickSpacing));

            case 1:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function nextInitializedTickWithinOneWord(_x2, _x3, _x4) {
      return _nextInitializedTickWithinOneWord.apply(this, arguments);
    }

    return nextInitializedTickWithinOneWord;
  }();

  return TickListDataProvider;
}();

/**
 * By default, pools will not allow operations that require ticks.
 */

var NO_TICK_DATA_PROVIDER_DEFAULT = /*#__PURE__*/new NoTickDataProvider();
/**
 * Represents a V3 pool
 */

var Pool = /*#__PURE__*/function () {
  /**
   * Construct a pool
   * @param tokenA One of the tokens in the pool
   * @param tokenB The other token in the pool
   * @param fee The fee in hundredths of a bips of the input amount of every swap that is collected by the pool
   * @param sqrtRatioX96 The sqrt of the current ratio of amounts of token1 to token0
   * @param liquidity The current value of in range liquidity
   * @param tickCurrent The current tick of the pool
   * @param ticks The current state of the pool ticks or a data provider that can return tick data
   */
  function Pool(tokenA, tokenB, fee, sqrtRatioX96, liquidity, tickCurrent, ticks) {
    if (ticks === void 0) {
      ticks = NO_TICK_DATA_PROVIDER_DEFAULT;
    }

    !(Number.isInteger(fee) && fee < 1000000) ?  invariant(false, 'FEE')  : void 0;
    var tickCurrentSqrtRatioX96 = TickMath.getSqrtRatioAtTick(tickCurrent);
    var nextTickSqrtRatioX96 = TickMath.getSqrtRatioAtTick(tickCurrent + 1);
    !(JSBI.greaterThanOrEqual(JSBI.BigInt(sqrtRatioX96), tickCurrentSqrtRatioX96) && JSBI.lessThanOrEqual(JSBI.BigInt(sqrtRatioX96), nextTickSqrtRatioX96)) ?  invariant(false, 'PRICE_BOUNDS')  : void 0;

    var _ref = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA];

    this.token0 = _ref[0];
    this.token1 = _ref[1];
    this.fee = fee;
    this.sqrtRatioX96 = JSBI.BigInt(sqrtRatioX96);
    this.liquidity = JSBI.BigInt(liquidity);
    this.tickCurrent = tickCurrent;
    this.tickDataProvider = Array.isArray(ticks) ? new TickListDataProvider(ticks, TICK_SPACINGS[fee]) : ticks;
  }

  Pool.getAddress = function getAddress(tokenA, tokenB, fee, initCodeHashManualOverride, factoryAddressOverride) {
    return computePoolAddress({
      factoryAddress: factoryAddressOverride != null ? factoryAddressOverride : FACTORY_ADDRESS(tokenA.chainId),
      fee: fee,
      tokenA: tokenA,
      tokenB: tokenB,
      initCodeHashManualOverride: initCodeHashManualOverride
    });
  }
  /**
   * Returns true if the token is either token0 or token1
   * @param token The token to check
   * @returns True if token is either token0 or token
   */
  ;

  var _proto = Pool.prototype;

  _proto.involvesToken = function involvesToken(token) {
    return token.equals(this.token0) || token.equals(this.token1);
  }
  /**
   * Returns the current mid price of the pool in terms of token0, i.e. the ratio of token1 over token0
   */
  ;

  /**
   * Return the price of the given token in terms of the other token in the pool.
   * @param token The token to return price of
   * @returns The price of the given token, in terms of the other.
   */
  _proto.priceOf = function priceOf(token) {
    !this.involvesToken(token) ?  invariant(false, 'TOKEN')  : void 0;
    return token.equals(this.token0) ? this.token0Price : this.token1Price;
  }
  /**
   * Returns the chain ID of the tokens in the pool.
   */
  ;

  /**
   * Given an input amount of a token, return the computed output amount, and a pool with state updated after the trade
   * @param inputAmount The input amount for which to quote the output amount
   * @param sqrtPriceLimitX96 The Q64.96 sqrt price limit
   * @returns The output amount and the pool with updated state
   */
  _proto.getOutputAmount =
  /*#__PURE__*/
  function () {
    var _getOutputAmount = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(inputAmount, sqrtPriceLimitX96) {
      var zeroForOne, _yield$this$swap, outputAmount, sqrtRatioX96, liquidity, tickCurrent, outputToken;

      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              !this.involvesToken(inputAmount.currency) ?  invariant(false, 'TOKEN')  : void 0;
              zeroForOne = inputAmount.currency.equals(this.token0);
              _context.next = 4;
              return this.swap(zeroForOne, inputAmount.quotient, sqrtPriceLimitX96);

            case 4:
              _yield$this$swap = _context.sent;
              outputAmount = _yield$this$swap.amountCalculated;
              sqrtRatioX96 = _yield$this$swap.sqrtRatioX96;
              liquidity = _yield$this$swap.liquidity;
              tickCurrent = _yield$this$swap.tickCurrent;
              outputToken = zeroForOne ? this.token1 : this.token0;
              return _context.abrupt("return", [sdkCore.CurrencyAmount.fromRawAmount(outputToken, JSBI.multiply(outputAmount, NEGATIVE_ONE)), new Pool(this.token0, this.token1, this.fee, sqrtRatioX96, liquidity, tickCurrent, this.tickDataProvider)]);

            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function getOutputAmount(_x, _x2) {
      return _getOutputAmount.apply(this, arguments);
    }

    return getOutputAmount;
  }()
  /**
   * Given a desired output amount of a token, return the computed input amount and a pool with state updated after the trade
   * @param outputAmount the output amount for which to quote the input amount
   * @param sqrtPriceLimitX96 The Q64.96 sqrt price limit. If zero for one, the price cannot be less than this value after the swap. If one for zero, the price cannot be greater than this value after the swap
   * @returns The input amount and the pool with updated state
   */
  ;

  _proto.getInputAmount =
  /*#__PURE__*/
  function () {
    var _getInputAmount = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(outputAmount, sqrtPriceLimitX96) {
      var zeroForOne, _yield$this$swap2, inputAmount, sqrtRatioX96, liquidity, tickCurrent, inputToken;

      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              !(outputAmount.currency.isToken && this.involvesToken(outputAmount.currency)) ?  invariant(false, 'TOKEN')  : void 0;
              zeroForOne = outputAmount.currency.equals(this.token1);
              _context2.next = 4;
              return this.swap(zeroForOne, JSBI.multiply(outputAmount.quotient, NEGATIVE_ONE), sqrtPriceLimitX96);

            case 4:
              _yield$this$swap2 = _context2.sent;
              inputAmount = _yield$this$swap2.amountCalculated;
              sqrtRatioX96 = _yield$this$swap2.sqrtRatioX96;
              liquidity = _yield$this$swap2.liquidity;
              tickCurrent = _yield$this$swap2.tickCurrent;
              inputToken = zeroForOne ? this.token0 : this.token1;
              return _context2.abrupt("return", [sdkCore.CurrencyAmount.fromRawAmount(inputToken, inputAmount), new Pool(this.token0, this.token1, this.fee, sqrtRatioX96, liquidity, tickCurrent, this.tickDataProvider)]);

            case 11:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function getInputAmount(_x3, _x4) {
      return _getInputAmount.apply(this, arguments);
    }

    return getInputAmount;
  }()
  /**
   * Executes a swap
   * @param zeroForOne Whether the amount in is token0 or token1
   * @param amountSpecified The amount of the swap, which implicitly configures the swap as exact input (positive), or exact output (negative)
   * @param sqrtPriceLimitX96 The Q64.96 sqrt price limit. If zero for one, the price cannot be less than this value after the swap. If one for zero, the price cannot be greater than this value after the swap
   * @returns amountCalculated
   * @returns sqrtRatioX96
   * @returns liquidity
   * @returns tickCurrent
   */
  ;

  _proto.swap =
  /*#__PURE__*/
  function () {
    var _swap = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(zeroForOne, amountSpecified, sqrtPriceLimitX96) {
      var exactInput, state, step, _yield$this$tickDataP, _SwapMath$computeSwap, liquidityNet;

      return _regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (!sqrtPriceLimitX96) sqrtPriceLimitX96 = zeroForOne ? JSBI.add(TickMath.MIN_SQRT_RATIO, ONE) : JSBI.subtract(TickMath.MAX_SQRT_RATIO, ONE);

              if (zeroForOne) {
                !JSBI.greaterThan(sqrtPriceLimitX96, TickMath.MIN_SQRT_RATIO) ?  invariant(false, 'RATIO_MIN')  : void 0;
                !JSBI.lessThan(sqrtPriceLimitX96, this.sqrtRatioX96) ?  invariant(false, 'RATIO_CURRENT')  : void 0;
              } else {
                !JSBI.lessThan(sqrtPriceLimitX96, TickMath.MAX_SQRT_RATIO) ?  invariant(false, 'RATIO_MAX')  : void 0;
                !JSBI.greaterThan(sqrtPriceLimitX96, this.sqrtRatioX96) ?  invariant(false, 'RATIO_CURRENT')  : void 0;
              }

              exactInput = JSBI.greaterThanOrEqual(amountSpecified, ZERO); // keep track of swap state

              state = {
                amountSpecifiedRemaining: amountSpecified,
                amountCalculated: ZERO,
                sqrtPriceX96: this.sqrtRatioX96,
                tick: this.tickCurrent,
                liquidity: this.liquidity
              }; // start swap while loop

            case 4:
              if (!(JSBI.notEqual(state.amountSpecifiedRemaining, ZERO) && state.sqrtPriceX96 != sqrtPriceLimitX96)) {
                _context3.next = 35;
                break;
              }

              step = {};
              step.sqrtPriceStartX96 = state.sqrtPriceX96;
              _context3.next = 9;
              return this.tickDataProvider.nextInitializedTickWithinOneWord(state.tick, zeroForOne, this.tickSpacing);

            case 9:
              _yield$this$tickDataP = _context3.sent;
              step.tickNext = _yield$this$tickDataP[0];
              step.initialized = _yield$this$tickDataP[1];

              if (step.tickNext < TickMath.MIN_TICK) {
                step.tickNext = TickMath.MIN_TICK;
              } else if (step.tickNext > TickMath.MAX_TICK) {
                step.tickNext = TickMath.MAX_TICK;
              }

              step.sqrtPriceNextX96 = TickMath.getSqrtRatioAtTick(step.tickNext);
              _SwapMath$computeSwap = SwapMath.computeSwapStep(state.sqrtPriceX96, (zeroForOne ? JSBI.lessThan(step.sqrtPriceNextX96, sqrtPriceLimitX96) : JSBI.greaterThan(step.sqrtPriceNextX96, sqrtPriceLimitX96)) ? sqrtPriceLimitX96 : step.sqrtPriceNextX96, state.liquidity, state.amountSpecifiedRemaining, this.fee);
              state.sqrtPriceX96 = _SwapMath$computeSwap[0];
              step.amountIn = _SwapMath$computeSwap[1];
              step.amountOut = _SwapMath$computeSwap[2];
              step.feeAmount = _SwapMath$computeSwap[3];

              if (exactInput) {
                state.amountSpecifiedRemaining = JSBI.subtract(state.amountSpecifiedRemaining, JSBI.add(step.amountIn, step.feeAmount));
                state.amountCalculated = JSBI.subtract(state.amountCalculated, step.amountOut);
              } else {
                state.amountSpecifiedRemaining = JSBI.add(state.amountSpecifiedRemaining, step.amountOut);
                state.amountCalculated = JSBI.add(state.amountCalculated, JSBI.add(step.amountIn, step.feeAmount));
              } // TODO


              if (!JSBI.equal(state.sqrtPriceX96, step.sqrtPriceNextX96)) {
                _context3.next = 32;
                break;
              }

              if (!step.initialized) {
                _context3.next = 29;
                break;
              }

              _context3.t0 = JSBI;
              _context3.next = 25;
              return this.tickDataProvider.getTick(step.tickNext);

            case 25:
              _context3.t1 = _context3.sent.liquidityNet;
              liquidityNet = _context3.t0.BigInt.call(_context3.t0, _context3.t1);
              // if we're moving leftward, we interpret liquidityNet as the opposite sign
              // safe because liquidityNet cannot be type(int128).min
              if (zeroForOne) liquidityNet = JSBI.multiply(liquidityNet, NEGATIVE_ONE);
              state.liquidity = LiquidityMath.addDelta(state.liquidity, liquidityNet);

            case 29:
              state.tick = zeroForOne ? step.tickNext - 1 : step.tickNext;
              _context3.next = 33;
              break;

            case 32:
              if (JSBI.notEqual(state.sqrtPriceX96, step.sqrtPriceStartX96)) {
                // updated comparison function
                // recompute unless we're on a lower tick boundary (i.e. already transitioned ticks), and haven't moved
                state.tick = TickMath.getTickAtSqrtRatio(state.sqrtPriceX96);
              }

            case 33:
              _context3.next = 4;
              break;

            case 35:
              return _context3.abrupt("return", {
                amountCalculated: state.amountCalculated,
                sqrtRatioX96: state.sqrtPriceX96,
                liquidity: state.liquidity,
                tickCurrent: state.tick
              });

            case 36:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function swap(_x5, _x6, _x7) {
      return _swap.apply(this, arguments);
    }

    return swap;
  }();

  _createClass(Pool, [{
    key: "token0Price",
    get: function get() {
      var _this$_token0Price;

      return (_this$_token0Price = this._token0Price) != null ? _this$_token0Price : this._token0Price = new sdkCore.Price(this.token0, this.token1, Q192, JSBI.multiply(this.sqrtRatioX96, this.sqrtRatioX96));
    }
    /**
     * Returns the current mid price of the pool in terms of token1, i.e. the ratio of token0 over token1
     */

  }, {
    key: "token1Price",
    get: function get() {
      var _this$_token1Price;

      return (_this$_token1Price = this._token1Price) != null ? _this$_token1Price : this._token1Price = new sdkCore.Price(this.token1, this.token0, JSBI.multiply(this.sqrtRatioX96, this.sqrtRatioX96), Q192);
    }
  }, {
    key: "chainId",
    get: function get() {
      return this.token0.chainId;
    }
  }, {
    key: "tickSpacing",
    get: function get() {
      return TICK_SPACINGS[this.fee];
    }
  }]);

  return Pool;
}();

/**
 * Represents a position on a Uniswap V3 Pool
 */

var Position = /*#__PURE__*/function () {
  /**
   * Constructs a position for a given pool with the given liquidity
   * @param pool For which pool the liquidity is assigned
   * @param liquidity The amount of liquidity that is in the position
   * @param tickLower The lower tick of the position
   * @param tickUpper The upper tick of the position
   */
  function Position(_ref) {
    var pool = _ref.pool,
        liquidity = _ref.liquidity,
        tickLower = _ref.tickLower,
        tickUpper = _ref.tickUpper;
    // cached resuts for the getters
    this._token0Amount = null;
    this._token1Amount = null;
    this._mintAmounts = null;
    !(tickLower < tickUpper) ?  invariant(false, 'TICK_ORDER')  : void 0;
    !(tickLower >= TickMath.MIN_TICK && tickLower % pool.tickSpacing === 0) ?  invariant(false, 'TICK_LOWER')  : void 0;
    !(tickUpper <= TickMath.MAX_TICK && tickUpper % pool.tickSpacing === 0) ?  invariant(false, 'TICK_UPPER')  : void 0;
    this.pool = pool;
    this.tickLower = tickLower;
    this.tickUpper = tickUpper;
    this.liquidity = JSBI.BigInt(liquidity);
  }
  /**
   * Returns the price of token0 at the lower tick
   */


  var _proto = Position.prototype;

  /**
   * Returns the lower and upper sqrt ratios if the price 'slips' up to slippage tolerance percentage
   * @param slippageTolerance The amount by which the price can 'slip' before the transaction will revert
   * @returns The sqrt ratios after slippage
   */
  _proto.ratiosAfterSlippage = function ratiosAfterSlippage(slippageTolerance) {
    var priceLower = this.pool.token0Price.asFraction.multiply(new sdkCore.Percent(1).subtract(slippageTolerance));
    var priceUpper = this.pool.token0Price.asFraction.multiply(slippageTolerance.add(1));
    var sqrtRatioX96Lower = encodeSqrtRatioX96(priceLower.numerator, priceLower.denominator);

    if (JSBI.lessThanOrEqual(sqrtRatioX96Lower, TickMath.MIN_SQRT_RATIO)) {
      sqrtRatioX96Lower = JSBI.add(TickMath.MIN_SQRT_RATIO, JSBI.BigInt(1));
    }

    var sqrtRatioX96Upper = encodeSqrtRatioX96(priceUpper.numerator, priceUpper.denominator);

    if (JSBI.greaterThanOrEqual(sqrtRatioX96Upper, TickMath.MAX_SQRT_RATIO)) {
      sqrtRatioX96Upper = JSBI.subtract(TickMath.MAX_SQRT_RATIO, JSBI.BigInt(1));
    }

    return {
      sqrtRatioX96Lower: sqrtRatioX96Lower,
      sqrtRatioX96Upper: sqrtRatioX96Upper
    };
  }
  /**
   * Returns the minimum amounts that must be sent in order to safely mint the amount of liquidity held by the position
   * with the given slippage tolerance
   * @param slippageTolerance Tolerance of unfavorable slippage from the current price
   * @returns The amounts, with slippage
   */
  ;

  _proto.mintAmountsWithSlippage = function mintAmountsWithSlippage(slippageTolerance) {
    // get lower/upper prices
    var _this$ratiosAfterSlip = this.ratiosAfterSlippage(slippageTolerance),
        sqrtRatioX96Upper = _this$ratiosAfterSlip.sqrtRatioX96Upper,
        sqrtRatioX96Lower = _this$ratiosAfterSlip.sqrtRatioX96Lower; // construct counterfactual pools


    var poolLower = new Pool(this.pool.token0, this.pool.token1, this.pool.fee, sqrtRatioX96Lower, 0
    /* liquidity doesn't matter */
    , TickMath.getTickAtSqrtRatio(sqrtRatioX96Lower));
    var poolUpper = new Pool(this.pool.token0, this.pool.token1, this.pool.fee, sqrtRatioX96Upper, 0
    /* liquidity doesn't matter */
    , TickMath.getTickAtSqrtRatio(sqrtRatioX96Upper)); // because the router is imprecise, we need to calculate the position that will be created (assuming no slippage)

    var positionThatWillBeCreated = Position.fromAmounts(_extends({
      pool: this.pool,
      tickLower: this.tickLower,
      tickUpper: this.tickUpper
    }, this.mintAmounts, {
      useFullPrecision: false
    })); // we want the smaller amounts...
    // ...which occurs at the upper price for amount0...

    var amount0 = new Position({
      pool: poolUpper,
      liquidity: positionThatWillBeCreated.liquidity,
      tickLower: this.tickLower,
      tickUpper: this.tickUpper
    }).mintAmounts.amount0; // ...and the lower for amount1

    var amount1 = new Position({
      pool: poolLower,
      liquidity: positionThatWillBeCreated.liquidity,
      tickLower: this.tickLower,
      tickUpper: this.tickUpper
    }).mintAmounts.amount1;
    return {
      amount0: amount0,
      amount1: amount1
    };
  }
  /**
   * Returns the minimum amounts that should be requested in order to safely burn the amount of liquidity held by the
   * position with the given slippage tolerance
   * @param slippageTolerance tolerance of unfavorable slippage from the current price
   * @returns The amounts, with slippage
   */
  ;

  _proto.burnAmountsWithSlippage = function burnAmountsWithSlippage(slippageTolerance) {
    // get lower/upper prices
    var _this$ratiosAfterSlip2 = this.ratiosAfterSlippage(slippageTolerance),
        sqrtRatioX96Upper = _this$ratiosAfterSlip2.sqrtRatioX96Upper,
        sqrtRatioX96Lower = _this$ratiosAfterSlip2.sqrtRatioX96Lower; // construct counterfactual pools


    var poolLower = new Pool(this.pool.token0, this.pool.token1, this.pool.fee, sqrtRatioX96Lower, 0
    /* liquidity doesn't matter */
    , TickMath.getTickAtSqrtRatio(sqrtRatioX96Lower));
    var poolUpper = new Pool(this.pool.token0, this.pool.token1, this.pool.fee, sqrtRatioX96Upper, 0
    /* liquidity doesn't matter */
    , TickMath.getTickAtSqrtRatio(sqrtRatioX96Upper)); // we want the smaller amounts...
    // ...which occurs at the upper price for amount0...

    var amount0 = new Position({
      pool: poolUpper,
      liquidity: this.liquidity,
      tickLower: this.tickLower,
      tickUpper: this.tickUpper
    }).amount0; // ...and the lower for amount1

    var amount1 = new Position({
      pool: poolLower,
      liquidity: this.liquidity,
      tickLower: this.tickLower,
      tickUpper: this.tickUpper
    }).amount1;
    return {
      amount0: amount0.quotient,
      amount1: amount1.quotient
    };
  }
  /**
   * Returns the minimum amounts that must be sent in order to mint the amount of liquidity held by the position at
   * the current price for the pool
   */
  ;

  /**
   * Computes the maximum amount of liquidity received for a given amount of token0, token1,
   * and the prices at the tick boundaries.
   * @param pool The pool for which the position should be created
   * @param tickLower The lower tick of the position
   * @param tickUpper The upper tick of the position
   * @param amount0 token0 amount
   * @param amount1 token1 amount
   * @param useFullPrecision If false, liquidity will be maximized according to what the router can calculate,
   * not what core can theoretically support
   * @returns The amount of liquidity for the position
   */
  Position.fromAmounts = function fromAmounts(_ref2) {
    var pool = _ref2.pool,
        tickLower = _ref2.tickLower,
        tickUpper = _ref2.tickUpper,
        amount0 = _ref2.amount0,
        amount1 = _ref2.amount1,
        useFullPrecision = _ref2.useFullPrecision;
    var sqrtRatioAX96 = TickMath.getSqrtRatioAtTick(tickLower);
    var sqrtRatioBX96 = TickMath.getSqrtRatioAtTick(tickUpper);
    return new Position({
      pool: pool,
      tickLower: tickLower,
      tickUpper: tickUpper,
      liquidity: maxLiquidityForAmounts(pool.sqrtRatioX96, sqrtRatioAX96, sqrtRatioBX96, amount0, amount1, useFullPrecision)
    });
  }
  /**
   * Computes a position with the maximum amount of liquidity received for a given amount of token0, assuming an unlimited amount of token1
   * @param pool The pool for which the position is created
   * @param tickLower The lower tick
   * @param tickUpper The upper tick
   * @param amount0 The desired amount of token0
   * @param useFullPrecision If true, liquidity will be maximized according to what the router can calculate,
   * not what core can theoretically support
   * @returns The position
   */
  ;

  Position.fromAmount0 = function fromAmount0(_ref3) {
    var pool = _ref3.pool,
        tickLower = _ref3.tickLower,
        tickUpper = _ref3.tickUpper,
        amount0 = _ref3.amount0,
        useFullPrecision = _ref3.useFullPrecision;
    return Position.fromAmounts({
      pool: pool,
      tickLower: tickLower,
      tickUpper: tickUpper,
      amount0: amount0,
      amount1: sdkCore.MaxUint256,
      useFullPrecision: useFullPrecision
    });
  }
  /**
   * Computes a position with the maximum amount of liquidity received for a given amount of token1, assuming an unlimited amount of token0
   * @param pool The pool for which the position is created
   * @param tickLower The lower tick
   * @param tickUpper The upper tick
   * @param amount1 The desired amount of token1
   * @returns The position
   */
  ;

  Position.fromAmount1 = function fromAmount1(_ref4) {
    var pool = _ref4.pool,
        tickLower = _ref4.tickLower,
        tickUpper = _ref4.tickUpper,
        amount1 = _ref4.amount1;
    // this function always uses full precision,
    return Position.fromAmounts({
      pool: pool,
      tickLower: tickLower,
      tickUpper: tickUpper,
      amount0: sdkCore.MaxUint256,
      amount1: amount1,
      useFullPrecision: true
    });
  };

  _createClass(Position, [{
    key: "token0PriceLower",
    get: function get() {
      return tickToPrice(this.pool.token0, this.pool.token1, this.tickLower);
    }
    /**
     * Returns the price of token0 at the upper tick
     */

  }, {
    key: "token0PriceUpper",
    get: function get() {
      return tickToPrice(this.pool.token0, this.pool.token1, this.tickUpper);
    }
    /**
     * Returns the amount of token0 that this position's liquidity could be burned for at the current pool price
     */

  }, {
    key: "amount0",
    get: function get() {
      if (this._token0Amount === null) {
        if (this.pool.tickCurrent < this.tickLower) {
          this._token0Amount = sdkCore.CurrencyAmount.fromRawAmount(this.pool.token0, SqrtPriceMath.getAmount0Delta(TickMath.getSqrtRatioAtTick(this.tickLower), TickMath.getSqrtRatioAtTick(this.tickUpper), this.liquidity, false));
        } else if (this.pool.tickCurrent < this.tickUpper) {
          this._token0Amount = sdkCore.CurrencyAmount.fromRawAmount(this.pool.token0, SqrtPriceMath.getAmount0Delta(this.pool.sqrtRatioX96, TickMath.getSqrtRatioAtTick(this.tickUpper), this.liquidity, false));
        } else {
          this._token0Amount = sdkCore.CurrencyAmount.fromRawAmount(this.pool.token0, ZERO);
        }
      }

      return this._token0Amount;
    }
    /**
     * Returns the amount of token1 that this position's liquidity could be burned for at the current pool price
     */

  }, {
    key: "amount1",
    get: function get() {
      if (this._token1Amount === null) {
        if (this.pool.tickCurrent < this.tickLower) {
          this._token1Amount = sdkCore.CurrencyAmount.fromRawAmount(this.pool.token1, ZERO);
        } else if (this.pool.tickCurrent < this.tickUpper) {
          this._token1Amount = sdkCore.CurrencyAmount.fromRawAmount(this.pool.token1, SqrtPriceMath.getAmount1Delta(TickMath.getSqrtRatioAtTick(this.tickLower), this.pool.sqrtRatioX96, this.liquidity, false));
        } else {
          this._token1Amount = sdkCore.CurrencyAmount.fromRawAmount(this.pool.token1, SqrtPriceMath.getAmount1Delta(TickMath.getSqrtRatioAtTick(this.tickLower), TickMath.getSqrtRatioAtTick(this.tickUpper), this.liquidity, false));
        }
      }

      return this._token1Amount;
    }
  }, {
    key: "mintAmounts",
    get: function get() {
      if (this._mintAmounts === null) {
        if (this.pool.tickCurrent < this.tickLower) {
          return {
            amount0: SqrtPriceMath.getAmount0Delta(TickMath.getSqrtRatioAtTick(this.tickLower), TickMath.getSqrtRatioAtTick(this.tickUpper), this.liquidity, true),
            amount1: ZERO
          };
        } else if (this.pool.tickCurrent < this.tickUpper) {
          return {
            amount0: SqrtPriceMath.getAmount0Delta(this.pool.sqrtRatioX96, TickMath.getSqrtRatioAtTick(this.tickUpper), this.liquidity, true),
            amount1: SqrtPriceMath.getAmount1Delta(TickMath.getSqrtRatioAtTick(this.tickLower), this.pool.sqrtRatioX96, this.liquidity, true)
          };
        } else {
          return {
            amount0: ZERO,
            amount1: SqrtPriceMath.getAmount1Delta(TickMath.getSqrtRatioAtTick(this.tickLower), TickMath.getSqrtRatioAtTick(this.tickUpper), this.liquidity, true)
          };
        }
      }

      return this._mintAmounts;
    }
  }]);

  return Position;
}();

/**
 * Represents a list of pools through which a swap can occur
 * @template TInput The input token
 * @template TOutput The output token
 */

var Route = /*#__PURE__*/function () {
  /**
   * Creates an instance of route.
   * @param pools An array of `Pool` objects, ordered by the route the swap will take
   * @param input The input token
   * @param output The output token
   */
  function Route(pools, input, output) {
    this._midPrice = null;
    !(pools.length > 0) ?  invariant(false, 'POOLS')  : void 0;
    var chainId = pools[0].chainId;
    var allOnSameChain = pools.every(function (pool) {
      return pool.chainId === chainId;
    });
    !allOnSameChain ?  invariant(false, 'CHAIN_IDS')  : void 0;
    var wrappedInput = input.wrapped;
    !pools[0].involvesToken(wrappedInput) ?  invariant(false, 'INPUT')  : void 0;
    !pools[pools.length - 1].involvesToken(output.wrapped) ?  invariant(false, 'OUTPUT')  : void 0;
    /**
     * Normalizes token0-token1 order and selects the next token/fee step to add to the path
     * */

    var tokenPath = [wrappedInput];

    for (var _iterator = _createForOfIteratorHelperLoose(pools.entries()), _step; !(_step = _iterator()).done;) {
      var _step$value = _step.value,
          i = _step$value[0],
          pool = _step$value[1];
      var currentInputToken = tokenPath[i];
      !(currentInputToken.equals(pool.token0) || currentInputToken.equals(pool.token1)) ?  invariant(false, 'PATH')  : void 0;
      var nextToken = currentInputToken.equals(pool.token0) ? pool.token1 : pool.token0;
      tokenPath.push(nextToken);
    }

    this.pools = pools;
    this.tokenPath = tokenPath;
    this.input = input;
    this.output = output != null ? output : tokenPath[tokenPath.length - 1];
  }

  _createClass(Route, [{
    key: "chainId",
    get: function get() {
      return this.pools[0].chainId;
    }
    /**
     * Returns the mid price of the route
     */

  }, {
    key: "midPrice",
    get: function get() {
      if (this._midPrice !== null) return this._midPrice;
      var price = this.pools.slice(1).reduce(function (_ref, pool) {
        var nextInput = _ref.nextInput,
            price = _ref.price;
        return nextInput.equals(pool.token0) ? {
          nextInput: pool.token1,
          price: price.multiply(pool.token0Price)
        } : {
          nextInput: pool.token0,
          price: price.multiply(pool.token1Price)
        };
      }, this.pools[0].token0.equals(this.input.wrapped) ? {
        nextInput: this.pools[0].token1,
        price: this.pools[0].token0Price
      } : {
        nextInput: this.pools[0].token0,
        price: this.pools[0].token1Price
      }).price;
      return this._midPrice = new sdkCore.Price(this.input, this.output, price.denominator, price.numerator);
    }
  }]);

  return Route;
}();

/**
 * Trades comparator, an extension of the input output comparator that also considers other dimensions of the trade in ranking them
 * @template TInput The input token, either Ether or an ERC-20
 * @template TOutput The output token, either Ether or an ERC-20
 * @template TTradeType The trade type, either exact input or exact output
 * @param a The first trade to compare
 * @param b The second trade to compare
 * @returns A sorted ordering for two neighboring elements in a trade array
 */

function tradeComparator(a, b) {
  // must have same input and output token for comparison
  !a.inputAmount.currency.equals(b.inputAmount.currency) ?  invariant(false, 'INPUT_CURRENCY')  : void 0;
  !a.outputAmount.currency.equals(b.outputAmount.currency) ?  invariant(false, 'OUTPUT_CURRENCY')  : void 0;

  if (a.outputAmount.equalTo(b.outputAmount)) {
    if (a.inputAmount.equalTo(b.inputAmount)) {
      // consider the number of hops since each hop costs gas
      var aHops = a.swaps.reduce(function (total, cur) {
        return total + cur.route.tokenPath.length;
      }, 0);
      var bHops = b.swaps.reduce(function (total, cur) {
        return total + cur.route.tokenPath.length;
      }, 0);
      return aHops - bHops;
    } // trade A requires less input than trade B, so A should come first


    if (a.inputAmount.lessThan(b.inputAmount)) {
      return -1;
    } else {
      return 1;
    }
  } else {
    // tradeA has less output than trade B, so should come second
    if (a.outputAmount.lessThan(b.outputAmount)) {
      return 1;
    } else {
      return -1;
    }
  }
}
/**
 * Represents a trade executed against a set of routes where some percentage of the input is
 * split across each route.
 *
 * Each route has its own set of pools. Pools can not be re-used across routes.
 *
 * Does not account for slippage, i.e., changes in price environment that can occur between
 * the time the trade is submitted and when it is executed.
 * @template TInput The input token, either Ether or an ERC-20
 * @template TOutput The output token, either Ether or an ERC-20
 * @template TTradeType The trade type, either exact input or exact output
 */

var Trade = /*#__PURE__*/function () {
  /**
   * Construct a trade by passing in the pre-computed property values
   * @param routes The routes through which the trade occurs
   * @param tradeType The type of trade, exact input or exact output
   */
  function Trade(_ref) {
    var routes = _ref.routes,
        tradeType = _ref.tradeType;
    var inputCurrency = routes[0].inputAmount.currency;
    var outputCurrency = routes[0].outputAmount.currency;
    !routes.every(function (_ref2) {
      var route = _ref2.route;
      return inputCurrency.wrapped.equals(route.input.wrapped);
    }) ?  invariant(false, 'INPUT_CURRENCY_MATCH')  : void 0;
    !routes.every(function (_ref3) {
      var route = _ref3.route;
      return outputCurrency.wrapped.equals(route.output.wrapped);
    }) ?  invariant(false, 'OUTPUT_CURRENCY_MATCH')  : void 0;
    var numPools = routes.map(function (_ref4) {
      var route = _ref4.route;
      return route.pools.length;
    }).reduce(function (total, cur) {
      return total + cur;
    }, 0);
    var poolAddressSet = new Set();

    for (var _iterator = _createForOfIteratorHelperLoose(routes), _step; !(_step = _iterator()).done;) {
      var route = _step.value.route;

      for (var _iterator2 = _createForOfIteratorHelperLoose(route.pools), _step2; !(_step2 = _iterator2()).done;) {
        var pool = _step2.value;
        poolAddressSet.add(Pool.getAddress(pool.token0, pool.token1, pool.fee));
      }
    }

    !(numPools == poolAddressSet.size) ?  invariant(false, 'POOLS_DUPLICATED')  : void 0;
    this.swaps = routes;
    this.tradeType = tradeType;
  }
  /**
   * @deprecated Deprecated in favor of 'swaps' property. If the trade consists of multiple routes
   * this will return an error.
   *
   * When the trade consists of just a single route, this returns the route of the trade,
   * i.e. which pools the trade goes through.
   */


  /**
   * Constructs an exact in trade with the given amount in and route
   * @template TInput The input token, either Ether or an ERC-20
   * @template TOutput The output token, either Ether or an ERC-20
   * @param route The route of the exact in trade
   * @param amountIn The amount being passed in
   * @returns The exact in trade
   */
  Trade.exactIn =
  /*#__PURE__*/
  function () {
    var _exactIn = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(route, amountIn) {
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", Trade.fromRoute(route, amountIn, sdkCore.TradeType.EXACT_INPUT));

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    function exactIn(_x, _x2) {
      return _exactIn.apply(this, arguments);
    }

    return exactIn;
  }()
  /**
   * Constructs an exact out trade with the given amount out and route
   * @template TInput The input token, either Ether or an ERC-20
   * @template TOutput The output token, either Ether or an ERC-20
   * @param route The route of the exact out trade
   * @param amountOut The amount returned by the trade
   * @returns The exact out trade
   */
  ;

  Trade.exactOut =
  /*#__PURE__*/
  function () {
    var _exactOut = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(route, amountOut) {
      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.abrupt("return", Trade.fromRoute(route, amountOut, sdkCore.TradeType.EXACT_OUTPUT));

            case 1:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    function exactOut(_x3, _x4) {
      return _exactOut.apply(this, arguments);
    }

    return exactOut;
  }()
  /**
   * Constructs a trade by simulating swaps through the given route
   * @template TInput The input token, either Ether or an ERC-20.
   * @template TOutput The output token, either Ether or an ERC-20.
   * @template TTradeType The type of the trade, either exact in or exact out.
   * @param route route to swap through
   * @param amount the amount specified, either input or output, depending on tradeType
   * @param tradeType whether the trade is an exact input or exact output swap
   * @returns The route
   */
  ;

  Trade.fromRoute =
  /*#__PURE__*/
  function () {
    var _fromRoute = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(route, amount, tradeType) {
      var amounts, inputAmount, outputAmount, i, pool, _yield$pool$getOutput, _outputAmount, _i, _pool, _yield$_pool$getInput, _inputAmount;

      return _regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              amounts = new Array(route.tokenPath.length);

              if (!(tradeType === sdkCore.TradeType.EXACT_INPUT)) {
                _context3.next = 19;
                break;
              }

              !amount.currency.equals(route.input) ?  invariant(false, 'INPUT')  : void 0;
              amounts[0] = amount.wrapped;
              i = 0;

            case 5:
              if (!(i < route.tokenPath.length - 1)) {
                _context3.next = 15;
                break;
              }

              pool = route.pools[i];
              _context3.next = 9;
              return pool.getOutputAmount(amounts[i]);

            case 9:
              _yield$pool$getOutput = _context3.sent;
              _outputAmount = _yield$pool$getOutput[0];
              amounts[i + 1] = _outputAmount;

            case 12:
              i++;
              _context3.next = 5;
              break;

            case 15:
              inputAmount = sdkCore.CurrencyAmount.fromFractionalAmount(route.input, amount.numerator, amount.denominator);
              outputAmount = sdkCore.CurrencyAmount.fromFractionalAmount(route.output, amounts[amounts.length - 1].numerator, amounts[amounts.length - 1].denominator);
              _context3.next = 34;
              break;

            case 19:
              !amount.currency.equals(route.output) ?  invariant(false, 'OUTPUT')  : void 0;
              amounts[amounts.length - 1] = amount.wrapped;
              _i = route.tokenPath.length - 1;

            case 22:
              if (!(_i > 0)) {
                _context3.next = 32;
                break;
              }

              _pool = route.pools[_i - 1];
              _context3.next = 26;
              return _pool.getInputAmount(amounts[_i]);

            case 26:
              _yield$_pool$getInput = _context3.sent;
              _inputAmount = _yield$_pool$getInput[0];
              amounts[_i - 1] = _inputAmount;

            case 29:
              _i--;
              _context3.next = 22;
              break;

            case 32:
              inputAmount = sdkCore.CurrencyAmount.fromFractionalAmount(route.input, amounts[0].numerator, amounts[0].denominator);
              outputAmount = sdkCore.CurrencyAmount.fromFractionalAmount(route.output, amount.numerator, amount.denominator);

            case 34:
              return _context3.abrupt("return", new Trade({
                routes: [{
                  inputAmount: inputAmount,
                  outputAmount: outputAmount,
                  route: route
                }],
                tradeType: tradeType
              }));

            case 35:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    function fromRoute(_x5, _x6, _x7) {
      return _fromRoute.apply(this, arguments);
    }

    return fromRoute;
  }()
  /**
   * Constructs a trade from routes by simulating swaps
   *
   * @template TInput The input token, either Ether or an ERC-20.
   * @template TOutput The output token, either Ether or an ERC-20.
   * @template TTradeType The type of the trade, either exact in or exact out.
   * @param routes the routes to swap through and how much of the amount should be routed through each
   * @param tradeType whether the trade is an exact input or exact output swap
   * @returns The trade
   */
  ;

  Trade.fromRoutes =
  /*#__PURE__*/
  function () {
    var _fromRoutes = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4(routes, tradeType) {
      var populatedRoutes, _iterator3, _step3, _step3$value, route, amount, amounts, inputAmount, outputAmount, i, pool, _yield$pool$getOutput2, _outputAmount2, _i2, _pool2, _yield$_pool2$getInpu, _inputAmount2;

      return _regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              populatedRoutes = [];
              _iterator3 = _createForOfIteratorHelperLoose(routes);

            case 2:
              if ((_step3 = _iterator3()).done) {
                _context4.next = 43;
                break;
              }

              _step3$value = _step3.value, route = _step3$value.route, amount = _step3$value.amount;
              amounts = new Array(route.tokenPath.length);
              inputAmount = void 0;
              outputAmount = void 0;

              if (!(tradeType === sdkCore.TradeType.EXACT_INPUT)) {
                _context4.next = 25;
                break;
              }

              !amount.currency.equals(route.input) ?  invariant(false, 'INPUT')  : void 0;
              inputAmount = sdkCore.CurrencyAmount.fromFractionalAmount(route.input, amount.numerator, amount.denominator);
              amounts[0] = sdkCore.CurrencyAmount.fromFractionalAmount(route.input.wrapped, amount.numerator, amount.denominator);
              i = 0;

            case 12:
              if (!(i < route.tokenPath.length - 1)) {
                _context4.next = 22;
                break;
              }

              pool = route.pools[i];
              _context4.next = 16;
              return pool.getOutputAmount(amounts[i]);

            case 16:
              _yield$pool$getOutput2 = _context4.sent;
              _outputAmount2 = _yield$pool$getOutput2[0];
              amounts[i + 1] = _outputAmount2;

            case 19:
              i++;
              _context4.next = 12;
              break;

            case 22:
              outputAmount = sdkCore.CurrencyAmount.fromFractionalAmount(route.output, amounts[amounts.length - 1].numerator, amounts[amounts.length - 1].denominator);
              _context4.next = 40;
              break;

            case 25:
              !amount.currency.equals(route.output) ?  invariant(false, 'OUTPUT')  : void 0;
              outputAmount = sdkCore.CurrencyAmount.fromFractionalAmount(route.output, amount.numerator, amount.denominator);
              amounts[amounts.length - 1] = sdkCore.CurrencyAmount.fromFractionalAmount(route.output.wrapped, amount.numerator, amount.denominator);
              _i2 = route.tokenPath.length - 1;

            case 29:
              if (!(_i2 > 0)) {
                _context4.next = 39;
                break;
              }

              _pool2 = route.pools[_i2 - 1];
              _context4.next = 33;
              return _pool2.getInputAmount(amounts[_i2]);

            case 33:
              _yield$_pool2$getInpu = _context4.sent;
              _inputAmount2 = _yield$_pool2$getInpu[0];
              amounts[_i2 - 1] = _inputAmount2;

            case 36:
              _i2--;
              _context4.next = 29;
              break;

            case 39:
              inputAmount = sdkCore.CurrencyAmount.fromFractionalAmount(route.input, amounts[0].numerator, amounts[0].denominator);

            case 40:
              populatedRoutes.push({
                route: route,
                inputAmount: inputAmount,
                outputAmount: outputAmount
              });

            case 41:
              _context4.next = 2;
              break;

            case 43:
              return _context4.abrupt("return", new Trade({
                routes: populatedRoutes,
                tradeType: tradeType
              }));

            case 44:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));

    function fromRoutes(_x8, _x9) {
      return _fromRoutes.apply(this, arguments);
    }

    return fromRoutes;
  }()
  /**
   * Creates a trade without computing the result of swapping through the route. Useful when you have simulated the trade
   * elsewhere and do not have any tick data
   * @template TInput The input token, either Ether or an ERC-20
   * @template TOutput The output token, either Ether or an ERC-20
   * @template TTradeType The type of the trade, either exact in or exact out
   * @param constructorArguments The arguments passed to the trade constructor
   * @returns The unchecked trade
   */
  ;

  Trade.createUncheckedTrade = function createUncheckedTrade(constructorArguments) {
    return new Trade(_extends({}, constructorArguments, {
      routes: [{
        inputAmount: constructorArguments.inputAmount,
        outputAmount: constructorArguments.outputAmount,
        route: constructorArguments.route
      }]
    }));
  }
  /**
   * Creates a trade without computing the result of swapping through the routes. Useful when you have simulated the trade
   * elsewhere and do not have any tick data
   * @template TInput The input token, either Ether or an ERC-20
   * @template TOutput The output token, either Ether or an ERC-20
   * @template TTradeType The type of the trade, either exact in or exact out
   * @param constructorArguments The arguments passed to the trade constructor
   * @returns The unchecked trade
   */
  ;

  Trade.createUncheckedTradeWithMultipleRoutes = function createUncheckedTradeWithMultipleRoutes(constructorArguments) {
    return new Trade(constructorArguments);
  }
  /**
   * Get the minimum amount that must be received from this trade for the given slippage tolerance
   * @param slippageTolerance The tolerance of unfavorable slippage from the execution price of this trade
   * @returns The amount out
   */
  ;

  var _proto = Trade.prototype;

  _proto.minimumAmountOut = function minimumAmountOut(slippageTolerance, amountOut) {
    if (amountOut === void 0) {
      amountOut = this.outputAmount;
    }

    !!slippageTolerance.lessThan(ZERO) ?  invariant(false, 'SLIPPAGE_TOLERANCE')  : void 0;

    if (this.tradeType === sdkCore.TradeType.EXACT_OUTPUT) {
      return amountOut;
    } else {
      var slippageAdjustedAmountOut = new sdkCore.Fraction(ONE).add(slippageTolerance).invert().multiply(amountOut.quotient).quotient;
      return sdkCore.CurrencyAmount.fromRawAmount(amountOut.currency, slippageAdjustedAmountOut);
    }
  }
  /**
   * Get the maximum amount in that can be spent via this trade for the given slippage tolerance
   * @param slippageTolerance The tolerance of unfavorable slippage from the execution price of this trade
   * @returns The amount in
   */
  ;

  _proto.maximumAmountIn = function maximumAmountIn(slippageTolerance, amountIn) {
    if (amountIn === void 0) {
      amountIn = this.inputAmount;
    }

    !!slippageTolerance.lessThan(ZERO) ?  invariant(false, 'SLIPPAGE_TOLERANCE')  : void 0;

    if (this.tradeType === sdkCore.TradeType.EXACT_INPUT) {
      return amountIn;
    } else {
      var slippageAdjustedAmountIn = new sdkCore.Fraction(ONE).add(slippageTolerance).multiply(amountIn.quotient).quotient;
      return sdkCore.CurrencyAmount.fromRawAmount(amountIn.currency, slippageAdjustedAmountIn);
    }
  }
  /**
   * Return the execution price after accounting for slippage tolerance
   * @param slippageTolerance the allowed tolerated slippage
   * @returns The execution price
   */
  ;

  _proto.worstExecutionPrice = function worstExecutionPrice(slippageTolerance) {
    return new sdkCore.Price(this.inputAmount.currency, this.outputAmount.currency, this.maximumAmountIn(slippageTolerance).quotient, this.minimumAmountOut(slippageTolerance).quotient);
  }
  /**
   * Given a list of pools, and a fixed amount in, returns the top `maxNumResults` trades that go from an input token
   * amount to an output token, making at most `maxHops` hops.
   * Note this does not consider aggregation, as routes are linear. It's possible a better route exists by splitting
   * the amount in among multiple routes.
   * @param pools the pools to consider in finding the best trade
   * @param nextAmountIn exact amount of input currency to spend
   * @param currencyOut the desired currency out
   * @param maxNumResults maximum number of results to return
   * @param maxHops maximum number of hops a returned trade can make, e.g. 1 hop goes through a single pool
   * @param currentPools used in recursion; the current list of pools
   * @param currencyAmountIn used in recursion; the original value of the currencyAmountIn parameter
   * @param bestTrades used in recursion; the current list of best trades
   * @returns The exact in trade
   */
  ;

  Trade.bestTradeExactIn =
  /*#__PURE__*/
  function () {
    var _bestTradeExactIn = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5(pools, currencyAmountIn, currencyOut, _temp, // used in recursion.
    currentPools, nextAmountIn, bestTrades) {
      var _ref5, _ref5$maxNumResults, maxNumResults, _ref5$maxHops, maxHops, amountIn, tokenOut, i, pool, amountOut, _yield$pool$getOutput3, poolsExcludingThisPool;

      return _regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _ref5 = _temp === void 0 ? {} : _temp, _ref5$maxNumResults = _ref5.maxNumResults, maxNumResults = _ref5$maxNumResults === void 0 ? 3 : _ref5$maxNumResults, _ref5$maxHops = _ref5.maxHops, maxHops = _ref5$maxHops === void 0 ? 3 : _ref5$maxHops;

              if (currentPools === void 0) {
                currentPools = [];
              }

              if (nextAmountIn === void 0) {
                nextAmountIn = currencyAmountIn;
              }

              if (bestTrades === void 0) {
                bestTrades = [];
              }

              !(pools.length > 0) ?  invariant(false, 'POOLS')  : void 0;
              !(maxHops > 0) ?  invariant(false, 'MAX_HOPS')  : void 0;
              !(currencyAmountIn === nextAmountIn || currentPools.length > 0) ?  invariant(false, 'INVALID_RECURSION')  : void 0;
              amountIn = nextAmountIn.wrapped;
              tokenOut = currencyOut.wrapped;
              i = 0;

            case 10:
              if (!(i < pools.length)) {
                _context5.next = 46;
                break;
              }

              pool = pools[i]; // pool irrelevant

              if (!(!pool.token0.equals(amountIn.currency) && !pool.token1.equals(amountIn.currency))) {
                _context5.next = 14;
                break;
              }

              return _context5.abrupt("continue", 43);

            case 14:
              amountOut = void 0;
              _context5.prev = 15;
              _context5.next = 19;
              return pool.getOutputAmount(amountIn);

            case 19:
              _yield$pool$getOutput3 = _context5.sent;
              amountOut = _yield$pool$getOutput3[0];
              _context5.next = 28;
              break;

            case 23:
              _context5.prev = 23;
              _context5.t0 = _context5["catch"](15);

              if (!_context5.t0.isInsufficientInputAmountError) {
                _context5.next = 27;
                break;
              }

              return _context5.abrupt("continue", 43);

            case 27:
              throw _context5.t0;

            case 28:
              if (!(amountOut.currency.isToken && amountOut.currency.equals(tokenOut))) {
                _context5.next = 39;
                break;
              }

              _context5.t1 = sdkCore.sortedInsert;
              _context5.t2 = bestTrades;
              _context5.next = 33;
              return Trade.fromRoute(new Route([].concat(currentPools, [pool]), currencyAmountIn.currency, currencyOut), currencyAmountIn, sdkCore.TradeType.EXACT_INPUT);

            case 33:
              _context5.t3 = _context5.sent;
              _context5.t4 = maxNumResults;
              _context5.t5 = tradeComparator;
              (0, _context5.t1)(_context5.t2, _context5.t3, _context5.t4, _context5.t5);
              _context5.next = 43;
              break;

            case 39:
              if (!(maxHops > 1 && pools.length > 1)) {
                _context5.next = 43;
                break;
              }

              poolsExcludingThisPool = pools.slice(0, i).concat(pools.slice(i + 1, pools.length)); // otherwise, consider all the other paths that lead from this token as long as we have not exceeded maxHops

              _context5.next = 43;
              return Trade.bestTradeExactIn(poolsExcludingThisPool, currencyAmountIn, currencyOut, {
                maxNumResults: maxNumResults,
                maxHops: maxHops - 1
              }, [].concat(currentPools, [pool]), amountOut, bestTrades);

            case 43:
              i++;
              _context5.next = 10;
              break;

            case 46:
              return _context5.abrupt("return", bestTrades);

            case 47:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, null, [[15, 23]]);
    }));

    function bestTradeExactIn(_x10, _x11, _x12, _x13, _x14, _x15, _x16) {
      return _bestTradeExactIn.apply(this, arguments);
    }

    return bestTradeExactIn;
  }()
  /**
   * similar to the above method but instead targets a fixed output amount
   * given a list of pools, and a fixed amount out, returns the top `maxNumResults` trades that go from an input token
   * to an output token amount, making at most `maxHops` hops
   * note this does not consider aggregation, as routes are linear. it's possible a better route exists by splitting
   * the amount in among multiple routes.
   * @param pools the pools to consider in finding the best trade
   * @param currencyIn the currency to spend
   * @param currencyAmountOut the desired currency amount out
   * @param nextAmountOut the exact amount of currency out
   * @param maxNumResults maximum number of results to return
   * @param maxHops maximum number of hops a returned trade can make, e.g. 1 hop goes through a single pool
   * @param currentPools used in recursion; the current list of pools
   * @param bestTrades used in recursion; the current list of best trades
   * @returns The exact out trade
   */
  ;

  Trade.bestTradeExactOut =
  /*#__PURE__*/
  function () {
    var _bestTradeExactOut = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee6(pools, currencyIn, currencyAmountOut, _temp2, // used in recursion.
    currentPools, nextAmountOut, bestTrades) {
      var _ref6, _ref6$maxNumResults, maxNumResults, _ref6$maxHops, maxHops, amountOut, tokenIn, i, pool, amountIn, _yield$pool$getInputA, poolsExcludingThisPool;

      return _regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _ref6 = _temp2 === void 0 ? {} : _temp2, _ref6$maxNumResults = _ref6.maxNumResults, maxNumResults = _ref6$maxNumResults === void 0 ? 3 : _ref6$maxNumResults, _ref6$maxHops = _ref6.maxHops, maxHops = _ref6$maxHops === void 0 ? 3 : _ref6$maxHops;

              if (currentPools === void 0) {
                currentPools = [];
              }

              if (nextAmountOut === void 0) {
                nextAmountOut = currencyAmountOut;
              }

              if (bestTrades === void 0) {
                bestTrades = [];
              }

              !(pools.length > 0) ?  invariant(false, 'POOLS')  : void 0;
              !(maxHops > 0) ?  invariant(false, 'MAX_HOPS')  : void 0;
              !(currencyAmountOut === nextAmountOut || currentPools.length > 0) ?  invariant(false, 'INVALID_RECURSION')  : void 0;
              amountOut = nextAmountOut.wrapped;
              tokenIn = currencyIn.wrapped;
              i = 0;

            case 10:
              if (!(i < pools.length)) {
                _context6.next = 46;
                break;
              }

              pool = pools[i]; // pool irrelevant

              if (!(!pool.token0.equals(amountOut.currency) && !pool.token1.equals(amountOut.currency))) {
                _context6.next = 14;
                break;
              }

              return _context6.abrupt("continue", 43);

            case 14:
              amountIn = void 0;
              _context6.prev = 15;
              _context6.next = 19;
              return pool.getInputAmount(amountOut);

            case 19:
              _yield$pool$getInputA = _context6.sent;
              amountIn = _yield$pool$getInputA[0];
              _context6.next = 28;
              break;

            case 23:
              _context6.prev = 23;
              _context6.t0 = _context6["catch"](15);

              if (!_context6.t0.isInsufficientReservesError) {
                _context6.next = 27;
                break;
              }

              return _context6.abrupt("continue", 43);

            case 27:
              throw _context6.t0;

            case 28:
              if (!amountIn.currency.equals(tokenIn)) {
                _context6.next = 39;
                break;
              }

              _context6.t1 = sdkCore.sortedInsert;
              _context6.t2 = bestTrades;
              _context6.next = 33;
              return Trade.fromRoute(new Route([pool].concat(currentPools), currencyIn, currencyAmountOut.currency), currencyAmountOut, sdkCore.TradeType.EXACT_OUTPUT);

            case 33:
              _context6.t3 = _context6.sent;
              _context6.t4 = maxNumResults;
              _context6.t5 = tradeComparator;
              (0, _context6.t1)(_context6.t2, _context6.t3, _context6.t4, _context6.t5);
              _context6.next = 43;
              break;

            case 39:
              if (!(maxHops > 1 && pools.length > 1)) {
                _context6.next = 43;
                break;
              }

              poolsExcludingThisPool = pools.slice(0, i).concat(pools.slice(i + 1, pools.length)); // otherwise, consider all the other paths that arrive at this token as long as we have not exceeded maxHops

              _context6.next = 43;
              return Trade.bestTradeExactOut(poolsExcludingThisPool, currencyIn, currencyAmountOut, {
                maxNumResults: maxNumResults,
                maxHops: maxHops - 1
              }, [pool].concat(currentPools), amountIn, bestTrades);

            case 43:
              i++;
              _context6.next = 10;
              break;

            case 46:
              return _context6.abrupt("return", bestTrades);

            case 47:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, null, [[15, 23]]);
    }));

    function bestTradeExactOut(_x17, _x18, _x19, _x20, _x21, _x22, _x23) {
      return _bestTradeExactOut.apply(this, arguments);
    }

    return bestTradeExactOut;
  }();

  _createClass(Trade, [{
    key: "route",
    get: function get() {
      !(this.swaps.length == 1) ?  invariant(false, 'MULTIPLE_ROUTES')  : void 0;
      return this.swaps[0].route;
    }
    /**
     * The input amount for the trade assuming no slippage.
     */

  }, {
    key: "inputAmount",
    get: function get() {
      if (this._inputAmount) {
        return this._inputAmount;
      }

      var inputCurrency = this.swaps[0].inputAmount.currency;
      var totalInputFromRoutes = this.swaps.map(function (_ref7) {
        var inputAmount = _ref7.inputAmount;
        return inputAmount;
      }).reduce(function (total, cur) {
        return total.add(cur);
      }, sdkCore.CurrencyAmount.fromRawAmount(inputCurrency, 0));
      this._inputAmount = totalInputFromRoutes;
      return this._inputAmount;
    }
    /**
     * The output amount for the trade assuming no slippage.
     */

  }, {
    key: "outputAmount",
    get: function get() {
      if (this._outputAmount) {
        return this._outputAmount;
      }

      var outputCurrency = this.swaps[0].outputAmount.currency;
      var totalOutputFromRoutes = this.swaps.map(function (_ref8) {
        var outputAmount = _ref8.outputAmount;
        return outputAmount;
      }).reduce(function (total, cur) {
        return total.add(cur);
      }, sdkCore.CurrencyAmount.fromRawAmount(outputCurrency, 0));
      this._outputAmount = totalOutputFromRoutes;
      return this._outputAmount;
    }
    /**
     * The price expressed in terms of output amount/input amount.
     */

  }, {
    key: "executionPrice",
    get: function get() {
      var _this$_executionPrice;

      return (_this$_executionPrice = this._executionPrice) != null ? _this$_executionPrice : this._executionPrice = new sdkCore.Price(this.inputAmount.currency, this.outputAmount.currency, this.inputAmount.quotient, this.outputAmount.quotient);
    }
    /**
     * Returns the percent difference between the route's mid price and the price impact
     */

  }, {
    key: "priceImpact",
    get: function get() {
      if (this._priceImpact) {
        return this._priceImpact;
      }

      var spotOutputAmount = sdkCore.CurrencyAmount.fromRawAmount(this.outputAmount.currency, 0);

      for (var _iterator4 = _createForOfIteratorHelperLoose(this.swaps), _step4; !(_step4 = _iterator4()).done;) {
        var _step4$value = _step4.value,
            route = _step4$value.route,
            inputAmount = _step4$value.inputAmount;
        var midPrice = route.midPrice;
        spotOutputAmount = spotOutputAmount.add(midPrice.quote(inputAmount));
      }

      var priceImpact = spotOutputAmount.subtract(this.outputAmount).divide(spotOutputAmount);
      this._priceImpact = new sdkCore.Percent(priceImpact.numerator, priceImpact.denominator);
      return this._priceImpact;
    }
  }]);

  return Trade;
}();

var Multicall = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function Multicall() {}

  Multicall.encodeMulticall = function encodeMulticall(calldatas) {
    if (!Array.isArray(calldatas)) {
      calldatas = [calldatas];
    }

    return calldatas.length === 1 ? calldatas[0] : Multicall.INTERFACE.encodeFunctionData('multicall', [calldatas]);
  };

  return Multicall;
}();
Multicall.INTERFACE = /*#__PURE__*/new abi$2.Interface(IMulticall.abi);

var address = "0xC2f43eA9684cf24772193218043CDF4BC1428066";
var abi = [
	{
		inputs: [
			{
				internalType: "address",
				name: "_factory",
				type: "address"
			},
			{
				internalType: "address",
				name: "_WBB",
				type: "address"
			},
			{
				internalType: "address",
				name: "_tokenDescriptor_",
				type: "address"
			}
		],
		stateMutability: "nonpayable",
		type: "constructor"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "approved",
				type: "address"
			},
			{
				indexed: true,
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "Approval",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "operator",
				type: "address"
			},
			{
				indexed: false,
				internalType: "bool",
				name: "approved",
				type: "bool"
			}
		],
		name: "ApprovalForAll",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount0",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount1",
				type: "uint256"
			}
		],
		name: "Collect",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint128",
				name: "liquidity",
				type: "uint128"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount0",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount1",
				type: "uint256"
			}
		],
		name: "DecreaseLiquidity",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint128",
				name: "liquidity",
				type: "uint128"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount0",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount1",
				type: "uint256"
			}
		],
		name: "IncreaseLiquidity",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "from",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				indexed: true,
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "Transfer",
		type: "event"
	},
	{
		inputs: [
		],
		name: "DOMAIN_SEPARATOR",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "PERMIT_TYPEHASH",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "WBB",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "approve",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			}
		],
		name: "balanceOf",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "baseURI",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string"
			}
		],
		stateMutability: "pure",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amount0Owed",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amount1Owed",
				type: "uint256"
			},
			{
				internalType: "bytes",
				name: "data",
				type: "bytes"
			}
		],
		name: "bitswapV3MintCallback",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "burn",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "uint256",
						name: "tokenId",
						type: "uint256"
					},
					{
						internalType: "address",
						name: "recipient",
						type: "address"
					},
					{
						internalType: "uint128",
						name: "amount0Max",
						type: "uint128"
					},
					{
						internalType: "uint128",
						name: "amount1Max",
						type: "uint128"
					}
				],
				internalType: "struct INonfungiblePositionManager.CollectParams",
				name: "params",
				type: "tuple"
			}
		],
		name: "collect",
		outputs: [
			{
				internalType: "uint256",
				name: "amount0",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amount1",
				type: "uint256"
			}
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token0",
				type: "address"
			},
			{
				internalType: "address",
				name: "token1",
				type: "address"
			},
			{
				internalType: "uint24",
				name: "fee",
				type: "uint24"
			},
			{
				internalType: "uint160",
				name: "sqrtPriceX96",
				type: "uint160"
			}
		],
		name: "createAndInitializePoolIfNecessary",
		outputs: [
			{
				internalType: "address",
				name: "pool",
				type: "address"
			}
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "uint256",
						name: "tokenId",
						type: "uint256"
					},
					{
						internalType: "uint128",
						name: "liquidity",
						type: "uint128"
					},
					{
						internalType: "uint256",
						name: "amount0Min",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amount1Min",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "deadline",
						type: "uint256"
					}
				],
				internalType: "struct INonfungiblePositionManager.DecreaseLiquidityParams",
				name: "params",
				type: "tuple"
			}
		],
		name: "decreaseLiquidity",
		outputs: [
			{
				internalType: "uint256",
				name: "amount0",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amount1",
				type: "uint256"
			}
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "factory",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "getApproved",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "uint256",
						name: "tokenId",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amount0Desired",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amount1Desired",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amount0Min",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amount1Min",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "deadline",
						type: "uint256"
					}
				],
				internalType: "struct INonfungiblePositionManager.IncreaseLiquidityParams",
				name: "params",
				type: "tuple"
			}
		],
		name: "increaseLiquidity",
		outputs: [
			{
				internalType: "uint128",
				name: "liquidity",
				type: "uint128"
			},
			{
				internalType: "uint256",
				name: "amount0",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amount1",
				type: "uint256"
			}
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				internalType: "address",
				name: "operator",
				type: "address"
			}
		],
		name: "isApprovedForAll",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "address",
						name: "token0",
						type: "address"
					},
					{
						internalType: "address",
						name: "token1",
						type: "address"
					},
					{
						internalType: "uint24",
						name: "fee",
						type: "uint24"
					},
					{
						internalType: "int24",
						name: "tickLower",
						type: "int24"
					},
					{
						internalType: "int24",
						name: "tickUpper",
						type: "int24"
					},
					{
						internalType: "uint256",
						name: "amount0Desired",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amount1Desired",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amount0Min",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amount1Min",
						type: "uint256"
					},
					{
						internalType: "address",
						name: "recipient",
						type: "address"
					},
					{
						internalType: "uint256",
						name: "deadline",
						type: "uint256"
					}
				],
				internalType: "struct INonfungiblePositionManager.MintParams",
				name: "params",
				type: "tuple"
			}
		],
		name: "mint",
		outputs: [
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			},
			{
				internalType: "uint128",
				name: "liquidity",
				type: "uint128"
			},
			{
				internalType: "uint256",
				name: "amount0",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amount1",
				type: "uint256"
			}
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes[]",
				name: "data",
				type: "bytes[]"
			}
		],
		name: "multicall",
		outputs: [
			{
				internalType: "bytes[]",
				name: "results",
				type: "bytes[]"
			}
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "name",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "ownerOf",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			},
			{
				internalType: "uint8",
				name: "v",
				type: "uint8"
			},
			{
				internalType: "bytes32",
				name: "r",
				type: "bytes32"
			},
			{
				internalType: "bytes32",
				name: "s",
				type: "bytes32"
			}
		],
		name: "permit",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "positions",
		outputs: [
			{
				internalType: "uint96",
				name: "nonce",
				type: "uint96"
			},
			{
				internalType: "address",
				name: "operator",
				type: "address"
			},
			{
				internalType: "address",
				name: "token0",
				type: "address"
			},
			{
				internalType: "address",
				name: "token1",
				type: "address"
			},
			{
				internalType: "uint24",
				name: "fee",
				type: "uint24"
			},
			{
				internalType: "int24",
				name: "tickLower",
				type: "int24"
			},
			{
				internalType: "int24",
				name: "tickUpper",
				type: "int24"
			},
			{
				internalType: "uint128",
				name: "liquidity",
				type: "uint128"
			},
			{
				internalType: "uint256",
				name: "feeGrowthInside0LastX128",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "feeGrowthInside1LastX128",
				type: "uint256"
			},
			{
				internalType: "uint128",
				name: "tokensOwed0",
				type: "uint128"
			},
			{
				internalType: "uint128",
				name: "tokensOwed1",
				type: "uint128"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "refundETH",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "from",
				type: "address"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "safeTransferFrom",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "from",
				type: "address"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			},
			{
				internalType: "bytes",
				name: "_data",
				type: "bytes"
			}
		],
		name: "safeTransferFrom",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "value",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			},
			{
				internalType: "uint8",
				name: "v",
				type: "uint8"
			},
			{
				internalType: "bytes32",
				name: "r",
				type: "bytes32"
			},
			{
				internalType: "bytes32",
				name: "s",
				type: "bytes32"
			}
		],
		name: "selfPermit",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "nonce",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "expiry",
				type: "uint256"
			},
			{
				internalType: "uint8",
				name: "v",
				type: "uint8"
			},
			{
				internalType: "bytes32",
				name: "r",
				type: "bytes32"
			},
			{
				internalType: "bytes32",
				name: "s",
				type: "bytes32"
			}
		],
		name: "selfPermitAllowed",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "nonce",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "expiry",
				type: "uint256"
			},
			{
				internalType: "uint8",
				name: "v",
				type: "uint8"
			},
			{
				internalType: "bytes32",
				name: "r",
				type: "bytes32"
			},
			{
				internalType: "bytes32",
				name: "s",
				type: "bytes32"
			}
		],
		name: "selfPermitAllowedIfNecessary",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "value",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			},
			{
				internalType: "uint8",
				name: "v",
				type: "uint8"
			},
			{
				internalType: "bytes32",
				name: "r",
				type: "bytes32"
			},
			{
				internalType: "bytes32",
				name: "s",
				type: "bytes32"
			}
		],
		name: "selfPermitIfNecessary",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "operator",
				type: "address"
			},
			{
				internalType: "bool",
				name: "approved",
				type: "bool"
			}
		],
		name: "setApprovalForAll",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes4",
				name: "interfaceId",
				type: "bytes4"
			}
		],
		name: "supportsInterface",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amountMinimum",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			}
		],
		name: "sweepToken",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "symbol",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "index",
				type: "uint256"
			}
		],
		name: "tokenByIndex",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "index",
				type: "uint256"
			}
		],
		name: "tokenOfOwnerByIndex",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "tokenURI",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "totalSupply",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "from",
				type: "address"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "transferFrom",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amountMinimum",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			}
		],
		name: "unwrapWBB",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		stateMutability: "payable",
		type: "receive"
	}
];
var transactionHash = "0x962fc363a566831b356a0e01f09b5039db0a9953cb89e878094fbea7b3ac2865";
var receipt = {
	to: null,
	from: "0x1D83a54Cc7897a9f315bA728CD4Cb45D39798cc2",
	contractAddress: "0xC2f43eA9684cf24772193218043CDF4BC1428066",
	transactionIndex: 0,
	gasUsed: "5177954",
	logsBloom: "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
	blockHash: "0x4fbb9d2e464a6fde3e3248140802d0b5d22fe0e79f05084f82b3fb2ea9a1c3b8",
	transactionHash: "0x962fc363a566831b356a0e01f09b5039db0a9953cb89e878094fbea7b3ac2865",
	logs: [
	],
	blockNumber: 218730,
	cumulativeGasUsed: "5177954",
	status: 1,
	byzantium: true
};
var args = [
	"0x30a326d09E01d7960a0A2639c8F13362e6cd304A",
	"0xF4c20e5004C6FDCDdA920bDD491ba8C98a9c5863",
	"0xc1c60db789Ea690e5de73f21E3F856d6613c4160"
];
var numDeployments = 1;
var solcInputHash = "764d3f4d52a77e1ad034099c4a2e4aa4";
var metadata = "{\"compiler\":{\"version\":\"0.7.6+commit.7338295f\"},\"language\":\"Solidity\",\"output\":{\"abi\":[{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_factory\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"_WBB\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"_tokenDescriptor_\",\"type\":\"address\"}],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"approved\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"Approval\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"bool\",\"name\":\"approved\",\"type\":\"bool\"}],\"name\":\"ApprovalForAll\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"address\",\"name\":\"recipient\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"amount0\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"amount1\",\"type\":\"uint256\"}],\"name\":\"Collect\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint128\",\"name\":\"liquidity\",\"type\":\"uint128\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"amount0\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"amount1\",\"type\":\"uint256\"}],\"name\":\"DecreaseLiquidity\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint128\",\"name\":\"liquidity\",\"type\":\"uint128\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"amount0\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"amount1\",\"type\":\"uint256\"}],\"name\":\"IncreaseLiquidity\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"Transfer\",\"type\":\"event\"},{\"inputs\":[],\"name\":\"DOMAIN_SEPARATOR\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"PERMIT_TYPEHASH\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"WBB\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"approve\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"}],\"name\":\"balanceOf\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"baseURI\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"pure\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"amount0Owed\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"amount1Owed\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"data\",\"type\":\"bytes\"}],\"name\":\"bitswapV3MintCallback\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"burn\",\"outputs\":[],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[{\"components\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"recipient\",\"type\":\"address\"},{\"internalType\":\"uint128\",\"name\":\"amount0Max\",\"type\":\"uint128\"},{\"internalType\":\"uint128\",\"name\":\"amount1Max\",\"type\":\"uint128\"}],\"internalType\":\"struct INonfungiblePositionManager.CollectParams\",\"name\":\"params\",\"type\":\"tuple\"}],\"name\":\"collect\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"amount0\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"amount1\",\"type\":\"uint256\"}],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"token0\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"token1\",\"type\":\"address\"},{\"internalType\":\"uint24\",\"name\":\"fee\",\"type\":\"uint24\"},{\"internalType\":\"uint160\",\"name\":\"sqrtPriceX96\",\"type\":\"uint160\"}],\"name\":\"createAndInitializePoolIfNecessary\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"pool\",\"type\":\"address\"}],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[{\"components\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"internalType\":\"uint128\",\"name\":\"liquidity\",\"type\":\"uint128\"},{\"internalType\":\"uint256\",\"name\":\"amount0Min\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"amount1Min\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"deadline\",\"type\":\"uint256\"}],\"internalType\":\"struct INonfungiblePositionManager.DecreaseLiquidityParams\",\"name\":\"params\",\"type\":\"tuple\"}],\"name\":\"decreaseLiquidity\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"amount0\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"amount1\",\"type\":\"uint256\"}],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"factory\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"getApproved\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"components\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"amount0Desired\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"amount1Desired\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"amount0Min\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"amount1Min\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"deadline\",\"type\":\"uint256\"}],\"internalType\":\"struct INonfungiblePositionManager.IncreaseLiquidityParams\",\"name\":\"params\",\"type\":\"tuple\"}],\"name\":\"increaseLiquidity\",\"outputs\":[{\"internalType\":\"uint128\",\"name\":\"liquidity\",\"type\":\"uint128\"},{\"internalType\":\"uint256\",\"name\":\"amount0\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"amount1\",\"type\":\"uint256\"}],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"}],\"name\":\"isApprovedForAll\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"components\":[{\"internalType\":\"address\",\"name\":\"token0\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"token1\",\"type\":\"address\"},{\"internalType\":\"uint24\",\"name\":\"fee\",\"type\":\"uint24\"},{\"internalType\":\"int24\",\"name\":\"tickLower\",\"type\":\"int24\"},{\"internalType\":\"int24\",\"name\":\"tickUpper\",\"type\":\"int24\"},{\"internalType\":\"uint256\",\"name\":\"amount0Desired\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"amount1Desired\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"amount0Min\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"amount1Min\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"recipient\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"deadline\",\"type\":\"uint256\"}],\"internalType\":\"struct INonfungiblePositionManager.MintParams\",\"name\":\"params\",\"type\":\"tuple\"}],\"name\":\"mint\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"internalType\":\"uint128\",\"name\":\"liquidity\",\"type\":\"uint128\"},{\"internalType\":\"uint256\",\"name\":\"amount0\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"amount1\",\"type\":\"uint256\"}],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes[]\",\"name\":\"data\",\"type\":\"bytes[]\"}],\"name\":\"multicall\",\"outputs\":[{\"internalType\":\"bytes[]\",\"name\":\"results\",\"type\":\"bytes[]\"}],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"name\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"ownerOf\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"deadline\",\"type\":\"uint256\"},{\"internalType\":\"uint8\",\"name\":\"v\",\"type\":\"uint8\"},{\"internalType\":\"bytes32\",\"name\":\"r\",\"type\":\"bytes32\"},{\"internalType\":\"bytes32\",\"name\":\"s\",\"type\":\"bytes32\"}],\"name\":\"permit\",\"outputs\":[],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"positions\",\"outputs\":[{\"internalType\":\"uint96\",\"name\":\"nonce\",\"type\":\"uint96\"},{\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"token0\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"token1\",\"type\":\"address\"},{\"internalType\":\"uint24\",\"name\":\"fee\",\"type\":\"uint24\"},{\"internalType\":\"int24\",\"name\":\"tickLower\",\"type\":\"int24\"},{\"internalType\":\"int24\",\"name\":\"tickUpper\",\"type\":\"int24\"},{\"internalType\":\"uint128\",\"name\":\"liquidity\",\"type\":\"uint128\"},{\"internalType\":\"uint256\",\"name\":\"feeGrowthInside0LastX128\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"feeGrowthInside1LastX128\",\"type\":\"uint256\"},{\"internalType\":\"uint128\",\"name\":\"tokensOwed0\",\"type\":\"uint128\"},{\"internalType\":\"uint128\",\"name\":\"tokensOwed1\",\"type\":\"uint128\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"refundETH\",\"outputs\":[],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"safeTransferFrom\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"_data\",\"type\":\"bytes\"}],\"name\":\"safeTransferFrom\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"token\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"deadline\",\"type\":\"uint256\"},{\"internalType\":\"uint8\",\"name\":\"v\",\"type\":\"uint8\"},{\"internalType\":\"bytes32\",\"name\":\"r\",\"type\":\"bytes32\"},{\"internalType\":\"bytes32\",\"name\":\"s\",\"type\":\"bytes32\"}],\"name\":\"selfPermit\",\"outputs\":[],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"token\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"nonce\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"expiry\",\"type\":\"uint256\"},{\"internalType\":\"uint8\",\"name\":\"v\",\"type\":\"uint8\"},{\"internalType\":\"bytes32\",\"name\":\"r\",\"type\":\"bytes32\"},{\"internalType\":\"bytes32\",\"name\":\"s\",\"type\":\"bytes32\"}],\"name\":\"selfPermitAllowed\",\"outputs\":[],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"token\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"nonce\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"expiry\",\"type\":\"uint256\"},{\"internalType\":\"uint8\",\"name\":\"v\",\"type\":\"uint8\"},{\"internalType\":\"bytes32\",\"name\":\"r\",\"type\":\"bytes32\"},{\"internalType\":\"bytes32\",\"name\":\"s\",\"type\":\"bytes32\"}],\"name\":\"selfPermitAllowedIfNecessary\",\"outputs\":[],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"token\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"deadline\",\"type\":\"uint256\"},{\"internalType\":\"uint8\",\"name\":\"v\",\"type\":\"uint8\"},{\"internalType\":\"bytes32\",\"name\":\"r\",\"type\":\"bytes32\"},{\"internalType\":\"bytes32\",\"name\":\"s\",\"type\":\"bytes32\"}],\"name\":\"selfPermitIfNecessary\",\"outputs\":[],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"},{\"internalType\":\"bool\",\"name\":\"approved\",\"type\":\"bool\"}],\"name\":\"setApprovalForAll\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes4\",\"name\":\"interfaceId\",\"type\":\"bytes4\"}],\"name\":\"supportsInterface\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"token\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amountMinimum\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"recipient\",\"type\":\"address\"}],\"name\":\"sweepToken\",\"outputs\":[],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"symbol\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"index\",\"type\":\"uint256\"}],\"name\":\"tokenByIndex\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"index\",\"type\":\"uint256\"}],\"name\":\"tokenOfOwnerByIndex\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"tokenURI\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"totalSupply\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"transferFrom\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"amountMinimum\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"recipient\",\"type\":\"address\"}],\"name\":\"unwrapWBB\",\"outputs\":[],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"stateMutability\":\"payable\",\"type\":\"receive\"}],\"devdoc\":{\"kind\":\"dev\",\"methods\":{\"DOMAIN_SEPARATOR()\":{\"returns\":{\"_0\":\"The domain seperator used in encoding of permit signature\"}},\"approve(address,uint256)\":{\"details\":\"See {IERC721-approve}.\"},\"balanceOf(address)\":{\"details\":\"See {IERC721-balanceOf}.\"},\"baseURI()\":{\"details\":\"Returns the base URI set via {_setBaseURI}. This will be automatically added as a prefix in {tokenURI} to each token's URI, or to the token ID if no specific URI is set for that token ID.\"},\"bitswapV3MintCallback(uint256,uint256,bytes)\":{\"details\":\"In the implementation you must pay the pool tokens owed for the minted liquidity. The caller of this method must be checked to be a BitswapV3Pool deployed by the canonical BitswapV3Factory.\",\"params\":{\"amount0Owed\":\"The amount of token0 due to the pool for the minted liquidity\",\"amount1Owed\":\"The amount of token1 due to the pool for the minted liquidity\",\"data\":\"Any data passed through by the caller via the IBitswapV3PoolActions#mint call\"}},\"burn(uint256)\":{\"params\":{\"tokenId\":\"The ID of the token that is being burned\"}},\"collect((uint256,address,uint128,uint128))\":{\"params\":{\"params\":\"tokenId The ID of the NFT for which tokens are being collected, recipient The account that should receive the tokens, amount0Max The maximum amount of token0 to collect, amount1Max The maximum amount of token1 to collect\"},\"returns\":{\"amount0\":\"The amount of fees collected in token0\",\"amount1\":\"The amount of fees collected in token1\"}},\"createAndInitializePoolIfNecessary(address,address,uint24,uint160)\":{\"details\":\"This method can be bundled with others via IMulticall for the first action (e.g. mint) performed against a pool\",\"params\":{\"fee\":\"The fee amount of the v3 pool for the specified token pair\",\"sqrtPriceX96\":\"The initial square root price of the pool as a Q64.96 value\",\"token0\":\"The contract address of token0 of the pool\",\"token1\":\"The contract address of token1 of the pool\"},\"returns\":{\"pool\":\"Returns the pool address based on the pair of tokens and fee, will return the newly created pool address if necessary\"}},\"decreaseLiquidity((uint256,uint128,uint256,uint256,uint256))\":{\"params\":{\"params\":\"tokenId The ID of the token for which liquidity is being decreased, amount The amount by which liquidity will be decreased, amount0Min The minimum amount of token0 that should be accounted for the burned liquidity, amount1Min The minimum amount of token1 that should be accounted for the burned liquidity, deadline The time by which the transaction must be included to effect the change\"},\"returns\":{\"amount0\":\"The amount of token0 accounted to the position's tokens owed\",\"amount1\":\"The amount of token1 accounted to the position's tokens owed\"}},\"getApproved(uint256)\":{\"details\":\"Returns the account approved for `tokenId` token. Requirements: - `tokenId` must exist.\"},\"increaseLiquidity((uint256,uint256,uint256,uint256,uint256,uint256))\":{\"params\":{\"params\":\"tokenId The ID of the token for which liquidity is being increased, amount0Desired The desired amount of token0 to be spent, amount1Desired The desired amount of token1 to be spent, amount0Min The minimum amount of token0 to spend, which serves as a slippage check, amount1Min The minimum amount of token1 to spend, which serves as a slippage check, deadline The time by which the transaction must be included to effect the change\"},\"returns\":{\"amount0\":\"The amount of token0 to acheive resulting liquidity\",\"amount1\":\"The amount of token1 to acheive resulting liquidity\",\"liquidity\":\"The new liquidity amount as a result of the increase\"}},\"isApprovedForAll(address,address)\":{\"details\":\"See {IERC721-isApprovedForAll}.\"},\"mint((address,address,uint24,int24,int24,uint256,uint256,uint256,uint256,address,uint256))\":{\"details\":\"Call this when the pool does exist and is initialized. Note that if the pool is created but not initialized a method does not exist, i.e. the pool is assumed to be initialized.\",\"params\":{\"params\":\"The params necessary to mint a position, encoded as `MintParams` in calldata\"},\"returns\":{\"amount0\":\"The amount of token0\",\"amount1\":\"The amount of token1\",\"liquidity\":\"The amount of liquidity for this position\",\"tokenId\":\"The ID of the token that represents the minted position\"}},\"multicall(bytes[])\":{\"details\":\"The `msg.value` should not be trusted for any method callable from multicall.\",\"params\":{\"data\":\"The encoded function data for each of the calls to make to this contract\"},\"returns\":{\"results\":\"The results from each of the calls passed in via data\"}},\"name()\":{\"details\":\"See {IERC721Metadata-name}.\"},\"ownerOf(uint256)\":{\"details\":\"See {IERC721-ownerOf}.\"},\"permit(address,uint256,uint256,uint8,bytes32,bytes32)\":{\"params\":{\"deadline\":\"The deadline timestamp by which the call must be mined for the approve to work\",\"r\":\"Must produce valid secp256k1 signature from the holder along with `v` and `s`\",\"s\":\"Must produce valid secp256k1 signature from the holder along with `r` and `v`\",\"spender\":\"The account that is being approved\",\"tokenId\":\"The ID of the token that is being approved for spending\",\"v\":\"Must produce valid secp256k1 signature from the holder along with `r` and `s`\"}},\"positions(uint256)\":{\"details\":\"Throws if the token ID is not valid.\",\"params\":{\"tokenId\":\"The ID of the token that represents the position\"},\"returns\":{\"fee\":\"The fee associated with the pool\",\"feeGrowthInside0LastX128\":\"The fee growth of token0 as of the last action on the individual position\",\"feeGrowthInside1LastX128\":\"The fee growth of token1 as of the last action on the individual position\",\"liquidity\":\"The liquidity of the position\",\"nonce\":\"The nonce for permits\",\"operator\":\"The address that is approved for spending\",\"tickLower\":\"The lower end of the tick range for the position\",\"tickUpper\":\"The higher end of the tick range for the position\",\"token0\":\"The address of the token0 for a specific pool\",\"token1\":\"The address of the token1 for a specific pool\",\"tokensOwed0\":\"The uncollected amount of token0 owed to the position as of the last computation\",\"tokensOwed1\":\"The uncollected amount of token1 owed to the position as of the last computation\"}},\"refundETH()\":{\"details\":\"Useful for bundling with mint or increase liquidity that uses ether, or exact output swaps that use ether for the input amount\"},\"safeTransferFrom(address,address,uint256)\":{\"details\":\"See {IERC721-safeTransferFrom}.\"},\"safeTransferFrom(address,address,uint256,bytes)\":{\"details\":\"See {IERC721-safeTransferFrom}.\"},\"selfPermit(address,uint256,uint256,uint8,bytes32,bytes32)\":{\"details\":\"The `owner` is always msg.sender and the `spender` is always address(this).\",\"params\":{\"deadline\":\"A timestamp, the current blocktime must be less than or equal to this timestamp\",\"r\":\"Must produce valid secp256k1 signature from the holder along with `v` and `s`\",\"s\":\"Must produce valid secp256k1 signature from the holder along with `r` and `v`\",\"token\":\"The address of the token spent\",\"v\":\"Must produce valid secp256k1 signature from the holder along with `r` and `s`\",\"value\":\"The amount that can be spent of token\"}},\"selfPermitAllowed(address,uint256,uint256,uint8,bytes32,bytes32)\":{\"details\":\"The `owner` is always msg.sender and the `spender` is always address(this)\",\"params\":{\"expiry\":\"The timestamp at which the permit is no longer valid\",\"nonce\":\"The current nonce of the owner\",\"r\":\"Must produce valid secp256k1 signature from the holder along with `v` and `s`\",\"s\":\"Must produce valid secp256k1 signature from the holder along with `r` and `v`\",\"token\":\"The address of the token spent\",\"v\":\"Must produce valid secp256k1 signature from the holder along with `r` and `s`\"}},\"selfPermitAllowedIfNecessary(address,uint256,uint256,uint8,bytes32,bytes32)\":{\"details\":\"The `owner` is always msg.sender and the `spender` is always address(this) Can be used instead of #selfPermitAllowed to prevent calls from failing due to a frontrun of a call to #selfPermitAllowed.\",\"params\":{\"expiry\":\"The timestamp at which the permit is no longer valid\",\"nonce\":\"The current nonce of the owner\",\"r\":\"Must produce valid secp256k1 signature from the holder along with `v` and `s`\",\"s\":\"Must produce valid secp256k1 signature from the holder along with `r` and `v`\",\"token\":\"The address of the token spent\",\"v\":\"Must produce valid secp256k1 signature from the holder along with `r` and `s`\"}},\"selfPermitIfNecessary(address,uint256,uint256,uint8,bytes32,bytes32)\":{\"details\":\"The `owner` is always msg.sender and the `spender` is always address(this). Can be used instead of #selfPermit to prevent calls from failing due to a frontrun of a call to #selfPermit\",\"params\":{\"deadline\":\"A timestamp, the current blocktime must be less than or equal to this timestamp\",\"r\":\"Must produce valid secp256k1 signature from the holder along with `v` and `s`\",\"s\":\"Must produce valid secp256k1 signature from the holder along with `r` and `v`\",\"token\":\"The address of the token spent\",\"v\":\"Must produce valid secp256k1 signature from the holder along with `r` and `s`\",\"value\":\"The amount that can be spent of token\"}},\"setApprovalForAll(address,bool)\":{\"details\":\"See {IERC721-setApprovalForAll}.\"},\"supportsInterface(bytes4)\":{\"details\":\"See {IERC165-supportsInterface}. Time complexity O(1), guaranteed to always use less than 30 000 gas.\"},\"sweepToken(address,uint256,address)\":{\"details\":\"The amountMinimum parameter prevents malicious contracts from stealing the token from users\",\"params\":{\"amountMinimum\":\"The minimum amount of token required for a transfer\",\"recipient\":\"The destination address of the token\",\"token\":\"The contract address of the token which will be transferred to `recipient`\"}},\"symbol()\":{\"details\":\"See {IERC721Metadata-symbol}.\"},\"tokenByIndex(uint256)\":{\"details\":\"See {IERC721Enumerable-tokenByIndex}.\"},\"tokenOfOwnerByIndex(address,uint256)\":{\"details\":\"See {IERC721Enumerable-tokenOfOwnerByIndex}.\"},\"totalSupply()\":{\"details\":\"See {IERC721Enumerable-totalSupply}.\"},\"transferFrom(address,address,uint256)\":{\"details\":\"See {IERC721-transferFrom}.\"},\"unwrapWBB(uint256,address)\":{\"details\":\"The amountMinimum parameter prevents malicious contracts from stealing WBB from users.\",\"params\":{\"amountMinimum\":\"The minimum amount of WBB to unwrap\",\"recipient\":\"The address receiving ETH\"}}},\"stateVariables\":{\"_nextId\":{\"details\":\"The ID of the next token that will be minted. Skips 0\"},\"_nextPoolId\":{\"details\":\"The ID of the next pool that is used for the first time. Skips 0\"},\"_poolIdToPoolKey\":{\"details\":\"Pool keys by pool ID, to save on SSTOREs for position data\"},\"_poolIds\":{\"details\":\"IDs of pools assigned by this contract\"},\"_positions\":{\"details\":\"The token ID position data\"},\"_tokenDescriptor\":{\"details\":\"The address of the token descriptor contract, which handles generating token URIs for position tokens\"}},\"title\":\"NFT positions\",\"version\":1},\"userdoc\":{\"events\":{\"Collect(uint256,address,uint256,uint256)\":{\"notice\":\"Emitted when tokens are collected for a position NFT\"},\"DecreaseLiquidity(uint256,uint128,uint256,uint256)\":{\"notice\":\"Emitted when liquidity is decreased for a position NFT\"},\"IncreaseLiquidity(uint256,uint128,uint256,uint256)\":{\"notice\":\"Emitted when liquidity is increased for a position NFT\"}},\"kind\":\"user\",\"methods\":{\"DOMAIN_SEPARATOR()\":{\"notice\":\"The domain separator used in the permit signature\"},\"PERMIT_TYPEHASH()\":{\"notice\":\"The permit typehash used in the permit signature\"},\"bitswapV3MintCallback(uint256,uint256,bytes)\":{\"notice\":\"Called to `msg.sender` after minting liquidity to a position from IBitswapV3Pool#mint.\"},\"burn(uint256)\":{\"notice\":\"Burns a token ID, which deletes it from the NFT contract. The token must have 0 liquidity and all tokens must be collected first.\"},\"collect((uint256,address,uint128,uint128))\":{\"notice\":\"Collects up to a maximum amount of fees owed to a specific position to the recipient\"},\"createAndInitializePoolIfNecessary(address,address,uint24,uint160)\":{\"notice\":\"Creates a new pool if it does not exist, then initializes if not initialized\"},\"decreaseLiquidity((uint256,uint128,uint256,uint256,uint256))\":{\"notice\":\"Decreases the amount of liquidity in a position and accounts it to the position\"},\"increaseLiquidity((uint256,uint256,uint256,uint256,uint256,uint256))\":{\"notice\":\"Increases the amount of liquidity in a position, with tokens paid by the `msg.sender`\"},\"mint((address,address,uint24,int24,int24,uint256,uint256,uint256,uint256,address,uint256))\":{\"notice\":\"Creates a new position wrapped in a NFT\"},\"multicall(bytes[])\":{\"notice\":\"Call multiple functions in the current contract and return the data from all of them if they all succeed\"},\"permit(address,uint256,uint256,uint8,bytes32,bytes32)\":{\"notice\":\"Approve of a specific token ID for spending by spender via signature\"},\"positions(uint256)\":{\"notice\":\"Returns the position information associated with a given token ID.\"},\"refundETH()\":{\"notice\":\"Refunds any ETH balance held by this contract to the `msg.sender`\"},\"selfPermit(address,uint256,uint256,uint8,bytes32,bytes32)\":{\"notice\":\"Permits this contract to spend a given token from `msg.sender`\"},\"selfPermitAllowed(address,uint256,uint256,uint8,bytes32,bytes32)\":{\"notice\":\"Permits this contract to spend the sender's tokens for permit signatures that have the `allowed` parameter\"},\"selfPermitAllowedIfNecessary(address,uint256,uint256,uint8,bytes32,bytes32)\":{\"notice\":\"Permits this contract to spend the sender's tokens for permit signatures that have the `allowed` parameter\"},\"selfPermitIfNecessary(address,uint256,uint256,uint8,bytes32,bytes32)\":{\"notice\":\"Permits this contract to spend a given token from `msg.sender`\"},\"sweepToken(address,uint256,address)\":{\"notice\":\"Transfers the full amount of a token held by this contract to recipient\"},\"unwrapWBB(uint256,address)\":{\"notice\":\"Unwraps the contract's WBB balance and sends it to recipient as ETH.\"}},\"notice\":\"Wraps Bitswap V3 positions in the ERC721 non-fungible token interface\",\"version\":1}},\"settings\":{\"compilationTarget\":{\"contracts/v3-periphery/NonfungiblePositionManager.sol\":\"NonfungiblePositionManager\"},\"evmVersion\":\"istanbul\",\"libraries\":{},\"metadata\":{\"bytecodeHash\":\"ipfs\",\"useLiteralContent\":true},\"optimizer\":{\"enabled\":true,\"runs\":200},\"remappings\":[]},\"sources\":{\"@openzeppelin/contracts/drafts/IERC20Permit.sol\":{\"content\":\"// SPDX-License-Identifier: MIT\\n\\npragma solidity >=0.6.0 <0.8.0;\\n\\n/**\\n * @dev Interface of the ERC20 Permit extension allowing approvals to be made via signatures, as defined in\\n * https://eips.ethereum.org/EIPS/eip-2612[EIP-2612].\\n *\\n * Adds the {permit} method, which can be used to change an account's ERC20 allowance (see {IERC20-allowance}) by\\n * presenting a message signed by the account. By not relying on `{IERC20-approve}`, the token holder account doesn't\\n * need to send a transaction, and thus is not required to hold Ether at all.\\n */\\ninterface IERC20Permit {\\n    /**\\n     * @dev Sets `value` as the allowance of `spender` over `owner`'s tokens,\\n     * given `owner`'s signed approval.\\n     *\\n     * IMPORTANT: The same issues {IERC20-approve} has related to transaction\\n     * ordering also apply here.\\n     *\\n     * Emits an {Approval} event.\\n     *\\n     * Requirements:\\n     *\\n     * - `spender` cannot be the zero address.\\n     * - `deadline` must be a timestamp in the future.\\n     * - `v`, `r` and `s` must be a valid `secp256k1` signature from `owner`\\n     * over the EIP712-formatted function arguments.\\n     * - the signature must use ``owner``'s current nonce (see {nonces}).\\n     *\\n     * For more information on the signature format, see the\\n     * https://eips.ethereum.org/EIPS/eip-2612#specification[relevant EIP\\n     * section].\\n     */\\n    function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external;\\n\\n    /**\\n     * @dev Returns the current nonce for `owner`. This value must be\\n     * included whenever a signature is generated for {permit}.\\n     *\\n     * Every successful call to {permit} increases ``owner``'s nonce by one. This\\n     * prevents a signature from being used multiple times.\\n     */\\n    function nonces(address owner) external view returns (uint256);\\n\\n    /**\\n     * @dev Returns the domain separator used in the encoding of the signature for `permit`, as defined by {EIP712}.\\n     */\\n    // solhint-disable-next-line func-name-mixedcase\\n    function DOMAIN_SEPARATOR() external view returns (bytes32);\\n}\\n\",\"keccak256\":\"0x1aab7754719ba764a8a05bec47e975001400f62986474945eb3dbee6d871259f\",\"license\":\"MIT\"},\"@openzeppelin/contracts/introspection/ERC165.sol\":{\"content\":\"// SPDX-License-Identifier: MIT\\n\\npragma solidity ^0.7.0;\\n\\nimport \\\"./IERC165.sol\\\";\\n\\n/**\\n * @dev Implementation of the {IERC165} interface.\\n *\\n * Contracts may inherit from this and call {_registerInterface} to declare\\n * their support of an interface.\\n */\\nabstract contract ERC165 is IERC165 {\\n    /*\\n     * bytes4(keccak256('supportsInterface(bytes4)')) == 0x01ffc9a7\\n     */\\n    bytes4 private constant _INTERFACE_ID_ERC165 = 0x01ffc9a7;\\n\\n    /**\\n     * @dev Mapping of interface ids to whether or not it's supported.\\n     */\\n    mapping(bytes4 => bool) private _supportedInterfaces;\\n\\n    constructor () {\\n        // Derived contracts need only register support for their own interfaces,\\n        // we register support for ERC165 itself here\\n        _registerInterface(_INTERFACE_ID_ERC165);\\n    }\\n\\n    /**\\n     * @dev See {IERC165-supportsInterface}.\\n     *\\n     * Time complexity O(1), guaranteed to always use less than 30 000 gas.\\n     */\\n    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {\\n        return _supportedInterfaces[interfaceId];\\n    }\\n\\n    /**\\n     * @dev Registers the contract as an implementer of the interface defined by\\n     * `interfaceId`. Support of the actual ERC165 interface is automatic and\\n     * registering its interface id is not required.\\n     *\\n     * See {IERC165-supportsInterface}.\\n     *\\n     * Requirements:\\n     *\\n     * - `interfaceId` cannot be the ERC165 invalid interface (`0xffffffff`).\\n     */\\n    function _registerInterface(bytes4 interfaceId) internal virtual {\\n        require(interfaceId != 0xffffffff, \\\"ERC165: invalid interface id\\\");\\n        _supportedInterfaces[interfaceId] = true;\\n    }\\n}\\n\",\"keccak256\":\"0x234cdf2c3efd5f0dc17d32fe65d33c21674ca17de1e945eb60ac1076d7152d96\",\"license\":\"MIT\"},\"@openzeppelin/contracts/introspection/IERC165.sol\":{\"content\":\"// SPDX-License-Identifier: MIT\\n\\npragma solidity ^0.7.0;\\n\\n/**\\n * @dev Interface of the ERC165 standard, as defined in the\\n * https://eips.ethereum.org/EIPS/eip-165[EIP].\\n *\\n * Implementers can declare support of contract interfaces, which can then be\\n * queried by others ({ERC165Checker}).\\n *\\n * For an implementation, see {ERC165}.\\n */\\ninterface IERC165 {\\n    /**\\n     * @dev Returns true if this contract implements the interface defined by\\n     * `interfaceId`. See the corresponding\\n     * https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section]\\n     * to learn more about how these ids are created.\\n     *\\n     * This function call must use less than 30 000 gas.\\n     */\\n    function supportsInterface(bytes4 interfaceId) external view returns (bool);\\n}\\n\",\"keccak256\":\"0xd2f30fad5b24c4120f96dbac83aacdb7993ee610a9092bc23c44463da292bf8d\",\"license\":\"MIT\"},\"@openzeppelin/contracts/math/SafeMath.sol\":{\"content\":\"// SPDX-License-Identifier: MIT\\n\\npragma solidity ^0.7.0;\\n\\n/**\\n * @dev Wrappers over Solidity's arithmetic operations with added overflow\\n * checks.\\n *\\n * Arithmetic operations in Solidity wrap on overflow. This can easily result\\n * in bugs, because programmers usually assume that an overflow raises an\\n * error, which is the standard behavior in high level programming languages.\\n * `SafeMath` restores this intuition by reverting the transaction when an\\n * operation overflows.\\n *\\n * Using this library instead of the unchecked operations eliminates an entire\\n * class of bugs, so it's recommended to use it always.\\n */\\nlibrary SafeMath {\\n    /**\\n     * @dev Returns the addition of two unsigned integers, with an overflow flag.\\n     *\\n     * _Available since v3.4._\\n     */\\n    function tryAdd(uint256 a, uint256 b) internal pure returns (bool, uint256) {\\n        uint256 c = a + b;\\n        if (c < a) return (false, 0);\\n        return (true, c);\\n    }\\n\\n    /**\\n     * @dev Returns the substraction of two unsigned integers, with an overflow flag.\\n     *\\n     * _Available since v3.4._\\n     */\\n    function trySub(uint256 a, uint256 b) internal pure returns (bool, uint256) {\\n        if (b > a) return (false, 0);\\n        return (true, a - b);\\n    }\\n\\n    /**\\n     * @dev Returns the multiplication of two unsigned integers, with an overflow flag.\\n     *\\n     * _Available since v3.4._\\n     */\\n    function tryMul(uint256 a, uint256 b) internal pure returns (bool, uint256) {\\n        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the\\n        // benefit is lost if 'b' is also tested.\\n        // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522\\n        if (a == 0) return (true, 0);\\n        uint256 c = a * b;\\n        if (c / a != b) return (false, 0);\\n        return (true, c);\\n    }\\n\\n    /**\\n     * @dev Returns the division of two unsigned integers, with a division by zero flag.\\n     *\\n     * _Available since v3.4._\\n     */\\n    function tryDiv(uint256 a, uint256 b) internal pure returns (bool, uint256) {\\n        if (b == 0) return (false, 0);\\n        return (true, a / b);\\n    }\\n\\n    /**\\n     * @dev Returns the remainder of dividing two unsigned integers, with a division by zero flag.\\n     *\\n     * _Available since v3.4._\\n     */\\n    function tryMod(uint256 a, uint256 b) internal pure returns (bool, uint256) {\\n        if (b == 0) return (false, 0);\\n        return (true, a % b);\\n    }\\n\\n    /**\\n     * @dev Returns the addition of two unsigned integers, reverting on\\n     * overflow.\\n     *\\n     * Counterpart to Solidity's `+` operator.\\n     *\\n     * Requirements:\\n     *\\n     * - Addition cannot overflow.\\n     */\\n    function add(uint256 a, uint256 b) internal pure returns (uint256) {\\n        uint256 c = a + b;\\n        require(c >= a, \\\"SafeMath: addition overflow\\\");\\n        return c;\\n    }\\n\\n    /**\\n     * @dev Returns the subtraction of two unsigned integers, reverting on\\n     * overflow (when the result is negative).\\n     *\\n     * Counterpart to Solidity's `-` operator.\\n     *\\n     * Requirements:\\n     *\\n     * - Subtraction cannot overflow.\\n     */\\n    function sub(uint256 a, uint256 b) internal pure returns (uint256) {\\n        require(b <= a, \\\"SafeMath: subtraction overflow\\\");\\n        return a - b;\\n    }\\n\\n    /**\\n     * @dev Returns the multiplication of two unsigned integers, reverting on\\n     * overflow.\\n     *\\n     * Counterpart to Solidity's `*` operator.\\n     *\\n     * Requirements:\\n     *\\n     * - Multiplication cannot overflow.\\n     */\\n    function mul(uint256 a, uint256 b) internal pure returns (uint256) {\\n        if (a == 0) return 0;\\n        uint256 c = a * b;\\n        require(c / a == b, \\\"SafeMath: multiplication overflow\\\");\\n        return c;\\n    }\\n\\n    /**\\n     * @dev Returns the integer division of two unsigned integers, reverting on\\n     * division by zero. The result is rounded towards zero.\\n     *\\n     * Counterpart to Solidity's `/` operator. Note: this function uses a\\n     * `revert` opcode (which leaves remaining gas untouched) while Solidity\\n     * uses an invalid opcode to revert (consuming all remaining gas).\\n     *\\n     * Requirements:\\n     *\\n     * - The divisor cannot be zero.\\n     */\\n    function div(uint256 a, uint256 b) internal pure returns (uint256) {\\n        require(b > 0, \\\"SafeMath: division by zero\\\");\\n        return a / b;\\n    }\\n\\n    /**\\n     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),\\n     * reverting when dividing by zero.\\n     *\\n     * Counterpart to Solidity's `%` operator. This function uses a `revert`\\n     * opcode (which leaves remaining gas untouched) while Solidity uses an\\n     * invalid opcode to revert (consuming all remaining gas).\\n     *\\n     * Requirements:\\n     *\\n     * - The divisor cannot be zero.\\n     */\\n    function mod(uint256 a, uint256 b) internal pure returns (uint256) {\\n        require(b > 0, \\\"SafeMath: modulo by zero\\\");\\n        return a % b;\\n    }\\n\\n    /**\\n     * @dev Returns the subtraction of two unsigned integers, reverting with custom message on\\n     * overflow (when the result is negative).\\n     *\\n     * CAUTION: This function is deprecated because it requires allocating memory for the error\\n     * message unnecessarily. For custom revert reasons use {trySub}.\\n     *\\n     * Counterpart to Solidity's `-` operator.\\n     *\\n     * Requirements:\\n     *\\n     * - Subtraction cannot overflow.\\n     */\\n    function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {\\n        require(b <= a, errorMessage);\\n        return a - b;\\n    }\\n\\n    /**\\n     * @dev Returns the integer division of two unsigned integers, reverting with custom message on\\n     * division by zero. The result is rounded towards zero.\\n     *\\n     * CAUTION: This function is deprecated because it requires allocating memory for the error\\n     * message unnecessarily. For custom revert reasons use {tryDiv}.\\n     *\\n     * Counterpart to Solidity's `/` operator. Note: this function uses a\\n     * `revert` opcode (which leaves remaining gas untouched) while Solidity\\n     * uses an invalid opcode to revert (consuming all remaining gas).\\n     *\\n     * Requirements:\\n     *\\n     * - The divisor cannot be zero.\\n     */\\n    function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {\\n        require(b > 0, errorMessage);\\n        return a / b;\\n    }\\n\\n    /**\\n     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),\\n     * reverting with custom message when dividing by zero.\\n     *\\n     * CAUTION: This function is deprecated because it requires allocating memory for the error\\n     * message unnecessarily. For custom revert reasons use {tryMod}.\\n     *\\n     * Counterpart to Solidity's `%` operator. This function uses a `revert`\\n     * opcode (which leaves remaining gas untouched) while Solidity uses an\\n     * invalid opcode to revert (consuming all remaining gas).\\n     *\\n     * Requirements:\\n     *\\n     * - The divisor cannot be zero.\\n     */\\n    function mod(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {\\n        require(b > 0, errorMessage);\\n        return a % b;\\n    }\\n}\\n\",\"keccak256\":\"0xe22a1fc7400ae196eba2ad1562d0386462b00a6363b742d55a2fd2021a58586f\",\"license\":\"MIT\"},\"@openzeppelin/contracts/token/ERC20/IERC20.sol\":{\"content\":\"// SPDX-License-Identifier: MIT\\n\\npragma solidity ^0.7.0;\\n\\n/**\\n * @dev Interface of the ERC20 standard as defined in the EIP.\\n */\\ninterface IERC20 {\\n    /**\\n     * @dev Returns the amount of tokens in existence.\\n     */\\n    function totalSupply() external view returns (uint256);\\n\\n    /**\\n     * @dev Returns the amount of tokens owned by `account`.\\n     */\\n    function balanceOf(address account) external view returns (uint256);\\n\\n    /**\\n     * @dev Moves `amount` tokens from the caller's account to `recipient`.\\n     *\\n     * Returns a boolean value indicating whether the operation succeeded.\\n     *\\n     * Emits a {Transfer} event.\\n     */\\n    function transfer(address recipient, uint256 amount) external returns (bool);\\n\\n    /**\\n     * @dev Returns the remaining number of tokens that `spender` will be\\n     * allowed to spend on behalf of `owner` through {transferFrom}. This is\\n     * zero by default.\\n     *\\n     * This value changes when {approve} or {transferFrom} are called.\\n     */\\n    function allowance(address owner, address spender) external view returns (uint256);\\n\\n    /**\\n     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.\\n     *\\n     * Returns a boolean value indicating whether the operation succeeded.\\n     *\\n     * IMPORTANT: Beware that changing an allowance with this method brings the risk\\n     * that someone may use both the old and the new allowance by unfortunate\\n     * transaction ordering. One possible solution to mitigate this race\\n     * condition is to first reduce the spender's allowance to 0 and set the\\n     * desired value afterwards:\\n     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729\\n     *\\n     * Emits an {Approval} event.\\n     */\\n    function approve(address spender, uint256 amount) external returns (bool);\\n\\n    /**\\n     * @dev Moves `amount` tokens from `sender` to `recipient` using the\\n     * allowance mechanism. `amount` is then deducted from the caller's\\n     * allowance.\\n     *\\n     * Returns a boolean value indicating whether the operation succeeded.\\n     *\\n     * Emits a {Transfer} event.\\n     */\\n    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);\\n\\n    /**\\n     * @dev Emitted when `value` tokens are moved from one account (`from`) to\\n     * another (`to`).\\n     *\\n     * Note that `value` may be zero.\\n     */\\n    event Transfer(address indexed from, address indexed to, uint256 value);\\n\\n    /**\\n     * @dev Emitted when the allowance of a `spender` for an `owner` is set by\\n     * a call to {approve}. `value` is the new allowance.\\n     */\\n    event Approval(address indexed owner, address indexed spender, uint256 value);\\n}\\n\",\"keccak256\":\"0xbd74f587ab9b9711801baf667db1426e4a03fd2d7f15af33e0e0d0394e7cef76\",\"license\":\"MIT\"},\"@openzeppelin/contracts/token/ERC721/ERC721.sol\":{\"content\":\"// SPDX-License-Identifier: MIT\\n\\npragma solidity ^0.7.0;\\n\\nimport \\\"../../utils/Context.sol\\\";\\nimport \\\"./IERC721.sol\\\";\\nimport \\\"./IERC721Metadata.sol\\\";\\nimport \\\"./IERC721Enumerable.sol\\\";\\nimport \\\"./IERC721Receiver.sol\\\";\\nimport \\\"../../introspection/ERC165.sol\\\";\\nimport \\\"../../math/SafeMath.sol\\\";\\nimport \\\"../../utils/Address.sol\\\";\\nimport \\\"../../utils/EnumerableSet.sol\\\";\\nimport \\\"../../utils/EnumerableMap.sol\\\";\\nimport \\\"../../utils/Strings.sol\\\";\\n\\n/**\\n * @title ERC721 Non-Fungible Token Standard basic implementation\\n * @dev see https://eips.ethereum.org/EIPS/eip-721\\n */\\ncontract ERC721 is Context, ERC165, IERC721, IERC721Metadata, IERC721Enumerable {\\n    using SafeMath for uint256;\\n    using Address for address;\\n    using EnumerableSet for EnumerableSet.UintSet;\\n    using EnumerableMap for EnumerableMap.UintToAddressMap;\\n    using Strings for uint256;\\n\\n    // Equals to `bytes4(keccak256(\\\"onERC721Received(address,address,uint256,bytes)\\\"))`\\n    // which can be also obtained as `IERC721Receiver(0).onERC721Received.selector`\\n    bytes4 private constant _ERC721_RECEIVED = 0x150b7a02;\\n\\n    // Mapping from holder address to their (enumerable) set of owned tokens\\n    mapping (address => EnumerableSet.UintSet) private _holderTokens;\\n\\n    // Enumerable mapping from token ids to their owners\\n    EnumerableMap.UintToAddressMap private _tokenOwners;\\n\\n    // Mapping from token ID to approved address\\n    mapping (uint256 => address) private _tokenApprovals;\\n\\n    // Mapping from owner to operator approvals\\n    mapping (address => mapping (address => bool)) private _operatorApprovals;\\n\\n    // Token name\\n    string private _name;\\n\\n    // Token symbol\\n    string private _symbol;\\n\\n    // Optional mapping for token URIs\\n    mapping (uint256 => string) private _tokenURIs;\\n\\n    // Base URI\\n    string private _baseURI;\\n\\n    /*\\n     *     bytes4(keccak256('balanceOf(address)')) == 0x70a08231\\n     *     bytes4(keccak256('ownerOf(uint256)')) == 0x6352211e\\n     *     bytes4(keccak256('approve(address,uint256)')) == 0x095ea7b3\\n     *     bytes4(keccak256('getApproved(uint256)')) == 0x081812fc\\n     *     bytes4(keccak256('setApprovalForAll(address,bool)')) == 0xa22cb465\\n     *     bytes4(keccak256('isApprovedForAll(address,address)')) == 0xe985e9c5\\n     *     bytes4(keccak256('transferFrom(address,address,uint256)')) == 0x23b872dd\\n     *     bytes4(keccak256('safeTransferFrom(address,address,uint256)')) == 0x42842e0e\\n     *     bytes4(keccak256('safeTransferFrom(address,address,uint256,bytes)')) == 0xb88d4fde\\n     *\\n     *     => 0x70a08231 ^ 0x6352211e ^ 0x095ea7b3 ^ 0x081812fc ^\\n     *        0xa22cb465 ^ 0xe985e9c5 ^ 0x23b872dd ^ 0x42842e0e ^ 0xb88d4fde == 0x80ac58cd\\n     */\\n    bytes4 private constant _INTERFACE_ID_ERC721 = 0x80ac58cd;\\n\\n    /*\\n     *     bytes4(keccak256('name()')) == 0x06fdde03\\n     *     bytes4(keccak256('symbol()')) == 0x95d89b41\\n     *     bytes4(keccak256('tokenURI(uint256)')) == 0xc87b56dd\\n     *\\n     *     => 0x06fdde03 ^ 0x95d89b41 ^ 0xc87b56dd == 0x5b5e139f\\n     */\\n    bytes4 private constant _INTERFACE_ID_ERC721_METADATA = 0x5b5e139f;\\n\\n    /*\\n     *     bytes4(keccak256('totalSupply()')) == 0x18160ddd\\n     *     bytes4(keccak256('tokenOfOwnerByIndex(address,uint256)')) == 0x2f745c59\\n     *     bytes4(keccak256('tokenByIndex(uint256)')) == 0x4f6ccce7\\n     *\\n     *     => 0x18160ddd ^ 0x2f745c59 ^ 0x4f6ccce7 == 0x780e9d63\\n     */\\n    bytes4 private constant _INTERFACE_ID_ERC721_ENUMERABLE = 0x780e9d63;\\n\\n    /**\\n     * @dev Initializes the contract by setting a `name` and a `symbol` to the token collection.\\n     */\\n    constructor (string memory name_, string memory symbol_) {\\n        _name = name_;\\n        _symbol = symbol_;\\n\\n        // register the supported interfaces to conform to ERC721 via ERC165\\n        _registerInterface(_INTERFACE_ID_ERC721);\\n        _registerInterface(_INTERFACE_ID_ERC721_METADATA);\\n        _registerInterface(_INTERFACE_ID_ERC721_ENUMERABLE);\\n    }\\n\\n    /**\\n     * @dev See {IERC721-balanceOf}.\\n     */\\n    function balanceOf(address owner) public view virtual override returns (uint256) {\\n        require(owner != address(0), \\\"ERC721: balance query for the zero address\\\");\\n        return _holderTokens[owner].length();\\n    }\\n\\n    /**\\n     * @dev See {IERC721-ownerOf}.\\n     */\\n    function ownerOf(uint256 tokenId) public view virtual override returns (address) {\\n        return _tokenOwners.get(tokenId, \\\"ERC721: owner query for nonexistent token\\\");\\n    }\\n\\n    /**\\n     * @dev See {IERC721Metadata-name}.\\n     */\\n    function name() public view virtual override returns (string memory) {\\n        return _name;\\n    }\\n\\n    /**\\n     * @dev See {IERC721Metadata-symbol}.\\n     */\\n    function symbol() public view virtual override returns (string memory) {\\n        return _symbol;\\n    }\\n\\n    /**\\n     * @dev See {IERC721Metadata-tokenURI}.\\n     */\\n    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {\\n        require(_exists(tokenId), \\\"ERC721Metadata: URI query for nonexistent token\\\");\\n\\n        string memory _tokenURI = _tokenURIs[tokenId];\\n        string memory base = baseURI();\\n\\n        // If there is no base URI, return the token URI.\\n        if (bytes(base).length == 0) {\\n            return _tokenURI;\\n        }\\n        // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).\\n        if (bytes(_tokenURI).length > 0) {\\n            return string(abi.encodePacked(base, _tokenURI));\\n        }\\n        // If there is a baseURI but no tokenURI, concatenate the tokenID to the baseURI.\\n        return string(abi.encodePacked(base, tokenId.toString()));\\n    }\\n\\n    /**\\n    * @dev Returns the base URI set via {_setBaseURI}. This will be\\n    * automatically added as a prefix in {tokenURI} to each token's URI, or\\n    * to the token ID if no specific URI is set for that token ID.\\n    */\\n    function baseURI() public view virtual returns (string memory) {\\n        return _baseURI;\\n    }\\n\\n    /**\\n     * @dev See {IERC721Enumerable-tokenOfOwnerByIndex}.\\n     */\\n    function tokenOfOwnerByIndex(address owner, uint256 index) public view virtual override returns (uint256) {\\n        return _holderTokens[owner].at(index);\\n    }\\n\\n    /**\\n     * @dev See {IERC721Enumerable-totalSupply}.\\n     */\\n    function totalSupply() public view virtual override returns (uint256) {\\n        // _tokenOwners are indexed by tokenIds, so .length() returns the number of tokenIds\\n        return _tokenOwners.length();\\n    }\\n\\n    /**\\n     * @dev See {IERC721Enumerable-tokenByIndex}.\\n     */\\n    function tokenByIndex(uint256 index) public view virtual override returns (uint256) {\\n        (uint256 tokenId, ) = _tokenOwners.at(index);\\n        return tokenId;\\n    }\\n\\n    /**\\n     * @dev See {IERC721-approve}.\\n     */\\n    function approve(address to, uint256 tokenId) public virtual override {\\n        address owner = ERC721.ownerOf(tokenId);\\n        require(to != owner, \\\"ERC721: approval to current owner\\\");\\n\\n        require(_msgSender() == owner || ERC721.isApprovedForAll(owner, _msgSender()),\\n            \\\"ERC721: approve caller is not owner nor approved for all\\\"\\n        );\\n\\n        _approve(to, tokenId);\\n    }\\n\\n    /**\\n     * @dev See {IERC721-getApproved}.\\n     */\\n    function getApproved(uint256 tokenId) public view virtual override returns (address) {\\n        require(_exists(tokenId), \\\"ERC721: approved query for nonexistent token\\\");\\n\\n        return _tokenApprovals[tokenId];\\n    }\\n\\n    /**\\n     * @dev See {IERC721-setApprovalForAll}.\\n     */\\n    function setApprovalForAll(address operator, bool approved) public virtual override {\\n        require(operator != _msgSender(), \\\"ERC721: approve to caller\\\");\\n\\n        _operatorApprovals[_msgSender()][operator] = approved;\\n        emit ApprovalForAll(_msgSender(), operator, approved);\\n    }\\n\\n    /**\\n     * @dev See {IERC721-isApprovedForAll}.\\n     */\\n    function isApprovedForAll(address owner, address operator) public view virtual override returns (bool) {\\n        return _operatorApprovals[owner][operator];\\n    }\\n\\n    /**\\n     * @dev See {IERC721-transferFrom}.\\n     */\\n    function transferFrom(address from, address to, uint256 tokenId) public virtual override {\\n        //solhint-disable-next-line max-line-length\\n        require(_isApprovedOrOwner(_msgSender(), tokenId), \\\"ERC721: transfer caller is not owner nor approved\\\");\\n\\n        _transfer(from, to, tokenId);\\n    }\\n\\n    /**\\n     * @dev See {IERC721-safeTransferFrom}.\\n     */\\n    function safeTransferFrom(address from, address to, uint256 tokenId) public virtual override {\\n        safeTransferFrom(from, to, tokenId, \\\"\\\");\\n    }\\n\\n    /**\\n     * @dev See {IERC721-safeTransferFrom}.\\n     */\\n    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data) public virtual override {\\n        require(_isApprovedOrOwner(_msgSender(), tokenId), \\\"ERC721: transfer caller is not owner nor approved\\\");\\n        _safeTransfer(from, to, tokenId, _data);\\n    }\\n\\n    /**\\n     * @dev Safely transfers `tokenId` token from `from` to `to`, checking first that contract recipients\\n     * are aware of the ERC721 protocol to prevent tokens from being forever locked.\\n     *\\n     * `_data` is additional data, it has no specified format and it is sent in call to `to`.\\n     *\\n     * This internal function is equivalent to {safeTransferFrom}, and can be used to e.g.\\n     * implement alternative mechanisms to perform token transfer, such as signature-based.\\n     *\\n     * Requirements:\\n     *\\n     * - `from` cannot be the zero address.\\n     * - `to` cannot be the zero address.\\n     * - `tokenId` token must exist and be owned by `from`.\\n     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.\\n     *\\n     * Emits a {Transfer} event.\\n     */\\n    function _safeTransfer(address from, address to, uint256 tokenId, bytes memory _data) internal virtual {\\n        _transfer(from, to, tokenId);\\n        require(_checkOnERC721Received(from, to, tokenId, _data), \\\"ERC721: transfer to non ERC721Receiver implementer\\\");\\n    }\\n\\n    /**\\n     * @dev Returns whether `tokenId` exists.\\n     *\\n     * Tokens can be managed by their owner or approved accounts via {approve} or {setApprovalForAll}.\\n     *\\n     * Tokens start existing when they are minted (`_mint`),\\n     * and stop existing when they are burned (`_burn`).\\n     */\\n    function _exists(uint256 tokenId) internal view virtual returns (bool) {\\n        return _tokenOwners.contains(tokenId);\\n    }\\n\\n    /**\\n     * @dev Returns whether `spender` is allowed to manage `tokenId`.\\n     *\\n     * Requirements:\\n     *\\n     * - `tokenId` must exist.\\n     */\\n    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view virtual returns (bool) {\\n        require(_exists(tokenId), \\\"ERC721: operator query for nonexistent token\\\");\\n        address owner = ERC721.ownerOf(tokenId);\\n        return (spender == owner || getApproved(tokenId) == spender || ERC721.isApprovedForAll(owner, spender));\\n    }\\n\\n    /**\\n     * @dev Safely mints `tokenId` and transfers it to `to`.\\n     *\\n     * Requirements:\\n     d*\\n     * - `tokenId` must not exist.\\n     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.\\n     *\\n     * Emits a {Transfer} event.\\n     */\\n    function _safeMint(address to, uint256 tokenId) internal virtual {\\n        _safeMint(to, tokenId, \\\"\\\");\\n    }\\n\\n    /**\\n     * @dev Same as {xref-ERC721-_safeMint-address-uint256-}[`_safeMint`], with an additional `data` parameter which is\\n     * forwarded in {IERC721Receiver-onERC721Received} to contract recipients.\\n     */\\n    function _safeMint(address to, uint256 tokenId, bytes memory _data) internal virtual {\\n        _mint(to, tokenId);\\n        require(_checkOnERC721Received(address(0), to, tokenId, _data), \\\"ERC721: transfer to non ERC721Receiver implementer\\\");\\n    }\\n\\n    /**\\n     * @dev Mints `tokenId` and transfers it to `to`.\\n     *\\n     * WARNING: Usage of this method is discouraged, use {_safeMint} whenever possible\\n     *\\n     * Requirements:\\n     *\\n     * - `tokenId` must not exist.\\n     * - `to` cannot be the zero address.\\n     *\\n     * Emits a {Transfer} event.\\n     */\\n    function _mint(address to, uint256 tokenId) internal virtual {\\n        require(to != address(0), \\\"ERC721: mint to the zero address\\\");\\n        require(!_exists(tokenId), \\\"ERC721: token already minted\\\");\\n\\n        _beforeTokenTransfer(address(0), to, tokenId);\\n\\n        _holderTokens[to].add(tokenId);\\n\\n        _tokenOwners.set(tokenId, to);\\n\\n        emit Transfer(address(0), to, tokenId);\\n    }\\n\\n    /**\\n     * @dev Destroys `tokenId`.\\n     * The approval is cleared when the token is burned.\\n     *\\n     * Requirements:\\n     *\\n     * - `tokenId` must exist.\\n     *\\n     * Emits a {Transfer} event.\\n     */\\n    function _burn(uint256 tokenId) internal virtual {\\n        address owner = ERC721.ownerOf(tokenId); // internal owner\\n\\n        _beforeTokenTransfer(owner, address(0), tokenId);\\n\\n        // Clear approvals\\n        _approve(address(0), tokenId);\\n\\n        // Clear metadata (if any)\\n        if (bytes(_tokenURIs[tokenId]).length != 0) {\\n            delete _tokenURIs[tokenId];\\n        }\\n\\n        _holderTokens[owner].remove(tokenId);\\n\\n        _tokenOwners.remove(tokenId);\\n\\n        emit Transfer(owner, address(0), tokenId);\\n    }\\n\\n    /**\\n     * @dev Transfers `tokenId` from `from` to `to`.\\n     *  As opposed to {transferFrom}, this imposes no restrictions on msg.sender.\\n     *\\n     * Requirements:\\n     *\\n     * - `to` cannot be the zero address.\\n     * - `tokenId` token must be owned by `from`.\\n     *\\n     * Emits a {Transfer} event.\\n     */\\n    function _transfer(address from, address to, uint256 tokenId) internal virtual {\\n        require(ERC721.ownerOf(tokenId) == from, \\\"ERC721: transfer of token that is not own\\\"); // internal owner\\n        require(to != address(0), \\\"ERC721: transfer to the zero address\\\");\\n\\n        _beforeTokenTransfer(from, to, tokenId);\\n\\n        // Clear approvals from the previous owner\\n        _approve(address(0), tokenId);\\n\\n        _holderTokens[from].remove(tokenId);\\n        _holderTokens[to].add(tokenId);\\n\\n        _tokenOwners.set(tokenId, to);\\n\\n        emit Transfer(from, to, tokenId);\\n    }\\n\\n    /**\\n     * @dev Sets `_tokenURI` as the tokenURI of `tokenId`.\\n     *\\n     * Requirements:\\n     *\\n     * - `tokenId` must exist.\\n     */\\n    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {\\n        require(_exists(tokenId), \\\"ERC721Metadata: URI set of nonexistent token\\\");\\n        _tokenURIs[tokenId] = _tokenURI;\\n    }\\n\\n    /**\\n     * @dev Internal function to set the base URI for all token IDs. It is\\n     * automatically added as a prefix to the value returned in {tokenURI},\\n     * or to the token ID if {tokenURI} is empty.\\n     */\\n    function _setBaseURI(string memory baseURI_) internal virtual {\\n        _baseURI = baseURI_;\\n    }\\n\\n    /**\\n     * @dev Internal function to invoke {IERC721Receiver-onERC721Received} on a target address.\\n     * The call is not executed if the target address is not a contract.\\n     *\\n     * @param from address representing the previous owner of the given token ID\\n     * @param to target address that will receive the tokens\\n     * @param tokenId uint256 ID of the token to be transferred\\n     * @param _data bytes optional data to send along with the call\\n     * @return bool whether the call correctly returned the expected magic value\\n     */\\n    function _checkOnERC721Received(address from, address to, uint256 tokenId, bytes memory _data)\\n        private returns (bool)\\n    {\\n        if (!to.isContract()) {\\n            return true;\\n        }\\n        bytes memory returndata = to.functionCall(abi.encodeWithSelector(\\n            IERC721Receiver(to).onERC721Received.selector,\\n            _msgSender(),\\n            from,\\n            tokenId,\\n            _data\\n        ), \\\"ERC721: transfer to non ERC721Receiver implementer\\\");\\n        bytes4 retval = abi.decode(returndata, (bytes4));\\n        return (retval == _ERC721_RECEIVED);\\n    }\\n\\n    /**\\n     * @dev Approve `to` to operate on `tokenId`\\n     *\\n     * Emits an {Approval} event.\\n     */\\n    function _approve(address to, uint256 tokenId) internal virtual {\\n        _tokenApprovals[tokenId] = to;\\n        emit Approval(ERC721.ownerOf(tokenId), to, tokenId); // internal owner\\n    }\\n\\n    /**\\n     * @dev Hook that is called before any token transfer. This includes minting\\n     * and burning.\\n     *\\n     * Calling conditions:\\n     *\\n     * - When `from` and `to` are both non-zero, ``from``'s `tokenId` will be\\n     * transferred to `to`.\\n     * - When `from` is zero, `tokenId` will be minted for `to`.\\n     * - When `to` is zero, ``from``'s `tokenId` will be burned.\\n     * - `from` cannot be the zero address.\\n     * - `to` cannot be the zero address.\\n     *\\n     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].\\n     */\\n    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal virtual { }\\n}\\n\",\"keccak256\":\"0x93e4f65a89c3c888afbaa3ee18c3fa4f51c422419bbcd9cca47676a0f8e507ea\",\"license\":\"MIT\"},\"@openzeppelin/contracts/token/ERC721/IERC721.sol\":{\"content\":\"// SPDX-License-Identifier: MIT\\n\\npragma solidity ^0.7.0;\\n\\nimport \\\"../../introspection/IERC165.sol\\\";\\n\\n/**\\n * @dev Required interface of an ERC721 compliant contract.\\n */\\ninterface IERC721 is IERC165 {\\n    /**\\n     * @dev Emitted when `tokenId` token is transferred from `from` to `to`.\\n     */\\n    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);\\n\\n    /**\\n     * @dev Emitted when `owner` enables `approved` to manage the `tokenId` token.\\n     */\\n    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);\\n\\n    /**\\n     * @dev Emitted when `owner` enables or disables (`approved`) `operator` to manage all of its assets.\\n     */\\n    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);\\n\\n    /**\\n     * @dev Returns the number of tokens in ``owner``'s account.\\n     */\\n    function balanceOf(address owner) external view returns (uint256 balance);\\n\\n    /**\\n     * @dev Returns the owner of the `tokenId` token.\\n     *\\n     * Requirements:\\n     *\\n     * - `tokenId` must exist.\\n     */\\n    function ownerOf(uint256 tokenId) external view returns (address owner);\\n\\n    /**\\n     * @dev Safely transfers `tokenId` token from `from` to `to`, checking first that contract recipients\\n     * are aware of the ERC721 protocol to prevent tokens from being forever locked.\\n     *\\n     * Requirements:\\n     *\\n     * - `from` cannot be the zero address.\\n     * - `to` cannot be the zero address.\\n     * - `tokenId` token must exist and be owned by `from`.\\n     * - If the caller is not `from`, it must be have been allowed to move this token by either {approve} or {setApprovalForAll}.\\n     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.\\n     *\\n     * Emits a {Transfer} event.\\n     */\\n    function safeTransferFrom(address from, address to, uint256 tokenId) external;\\n\\n    /**\\n     * @dev Transfers `tokenId` token from `from` to `to`.\\n     *\\n     * WARNING: Usage of this method is discouraged, use {safeTransferFrom} whenever possible.\\n     *\\n     * Requirements:\\n     *\\n     * - `from` cannot be the zero address.\\n     * - `to` cannot be the zero address.\\n     * - `tokenId` token must be owned by `from`.\\n     * - If the caller is not `from`, it must be approved to move this token by either {approve} or {setApprovalForAll}.\\n     *\\n     * Emits a {Transfer} event.\\n     */\\n    function transferFrom(address from, address to, uint256 tokenId) external;\\n\\n    /**\\n     * @dev Gives permission to `to` to transfer `tokenId` token to another account.\\n     * The approval is cleared when the token is transferred.\\n     *\\n     * Only a single account can be approved at a time, so approving the zero address clears previous approvals.\\n     *\\n     * Requirements:\\n     *\\n     * - The caller must own the token or be an approved operator.\\n     * - `tokenId` must exist.\\n     *\\n     * Emits an {Approval} event.\\n     */\\n    function approve(address to, uint256 tokenId) external;\\n\\n    /**\\n     * @dev Returns the account approved for `tokenId` token.\\n     *\\n     * Requirements:\\n     *\\n     * - `tokenId` must exist.\\n     */\\n    function getApproved(uint256 tokenId) external view returns (address operator);\\n\\n    /**\\n     * @dev Approve or remove `operator` as an operator for the caller.\\n     * Operators can call {transferFrom} or {safeTransferFrom} for any token owned by the caller.\\n     *\\n     * Requirements:\\n     *\\n     * - The `operator` cannot be the caller.\\n     *\\n     * Emits an {ApprovalForAll} event.\\n     */\\n    function setApprovalForAll(address operator, bool _approved) external;\\n\\n    /**\\n     * @dev Returns if the `operator` is allowed to manage all of the assets of `owner`.\\n     *\\n     * See {setApprovalForAll}\\n     */\\n    function isApprovedForAll(address owner, address operator) external view returns (bool);\\n\\n    /**\\n      * @dev Safely transfers `tokenId` token from `from` to `to`.\\n      *\\n      * Requirements:\\n      *\\n      * - `from` cannot be the zero address.\\n      * - `to` cannot be the zero address.\\n      * - `tokenId` token must exist and be owned by `from`.\\n      * - If the caller is not `from`, it must be approved to move this token by either {approve} or {setApprovalForAll}.\\n      * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.\\n      *\\n      * Emits a {Transfer} event.\\n      */\\n    function safeTransferFrom(address from, address to, uint256 tokenId, bytes calldata data) external;\\n}\\n\",\"keccak256\":\"0xb11597841d47f7a773bca63ca323c76f804cb5d944788de0327db5526319dc82\",\"license\":\"MIT\"},\"@openzeppelin/contracts/token/ERC721/IERC721Enumerable.sol\":{\"content\":\"// SPDX-License-Identifier: MIT\\n\\npragma solidity ^0.7.0;\\n\\nimport \\\"./IERC721.sol\\\";\\n\\n/**\\n * @title ERC-721 Non-Fungible Token Standard, optional enumeration extension\\n * @dev See https://eips.ethereum.org/EIPS/eip-721\\n */\\ninterface IERC721Enumerable is IERC721 {\\n\\n    /**\\n     * @dev Returns the total amount of tokens stored by the contract.\\n     */\\n    function totalSupply() external view returns (uint256);\\n\\n    /**\\n     * @dev Returns a token ID owned by `owner` at a given `index` of its token list.\\n     * Use along with {balanceOf} to enumerate all of ``owner``'s tokens.\\n     */\\n    function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256 tokenId);\\n\\n    /**\\n     * @dev Returns a token ID at a given `index` of all the tokens stored by the contract.\\n     * Use along with {totalSupply} to enumerate all tokens.\\n     */\\n    function tokenByIndex(uint256 index) external view returns (uint256);\\n}\\n\",\"keccak256\":\"0x2789dfea2d73182683d637db5729201f6730dae6113030a94c828f8688f38f2f\",\"license\":\"MIT\"},\"@openzeppelin/contracts/token/ERC721/IERC721Metadata.sol\":{\"content\":\"// SPDX-License-Identifier: MIT\\n\\npragma solidity ^0.7.0;\\n\\nimport \\\"./IERC721.sol\\\";\\n\\n/**\\n * @title ERC-721 Non-Fungible Token Standard, optional metadata extension\\n * @dev See https://eips.ethereum.org/EIPS/eip-721\\n */\\ninterface IERC721Metadata is IERC721 {\\n\\n    /**\\n     * @dev Returns the token collection name.\\n     */\\n    function name() external view returns (string memory);\\n\\n    /**\\n     * @dev Returns the token collection symbol.\\n     */\\n    function symbol() external view returns (string memory);\\n\\n    /**\\n     * @dev Returns the Uniform Resource Identifier (URI) for `tokenId` token.\\n     */\\n    function tokenURI(uint256 tokenId) external view returns (string memory);\\n}\\n\",\"keccak256\":\"0xc82c7d1d732081d9bd23f1555ebdf8f3bc1738bc42c2bfc4b9aa7564d9fa3573\",\"license\":\"MIT\"},\"@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol\":{\"content\":\"// SPDX-License-Identifier: MIT\\n\\npragma solidity ^0.7.0;\\n\\n/**\\n * @title ERC721 token receiver interface\\n * @dev Interface for any contract that wants to support safeTransfers\\n * from ERC721 asset contracts.\\n */\\ninterface IERC721Receiver {\\n    /**\\n     * @dev Whenever an {IERC721} `tokenId` token is transferred to this contract via {IERC721-safeTransferFrom}\\n     * by `operator` from `from`, this function is called.\\n     *\\n     * It must return its Solidity selector to confirm the token transfer.\\n     * If any other value is returned or the interface is not implemented by the recipient, the transfer will be reverted.\\n     *\\n     * The selector can be obtained in Solidity with `IERC721.onERC721Received.selector`.\\n     */\\n    function onERC721Received(address operator, address from, uint256 tokenId, bytes calldata data) external returns (bytes4);\\n}\\n\",\"keccak256\":\"0x05604ffcf69e416b8a42728bb0e4fd75170d8fac70bf1a284afeb4752a9bc52f\",\"license\":\"MIT\"},\"@openzeppelin/contracts/utils/Address.sol\":{\"content\":\"// SPDX-License-Identifier: MIT\\n\\npragma solidity ^0.7.0;\\n\\n/**\\n * @dev Collection of functions related to the address type\\n */\\nlibrary Address {\\n    /**\\n     * @dev Returns true if `account` is a contract.\\n     *\\n     * [IMPORTANT]\\n     * ====\\n     * It is unsafe to assume that an address for which this function returns\\n     * false is an externally-owned account (EOA) and not a contract.\\n     *\\n     * Among others, `isContract` will return false for the following\\n     * types of addresses:\\n     *\\n     *  - an externally-owned account\\n     *  - a contract in construction\\n     *  - an address where a contract will be created\\n     *  - an address where a contract lived, but was destroyed\\n     * ====\\n     */\\n    function isContract(address account) internal view returns (bool) {\\n        // This method relies on extcodesize, which returns 0 for contracts in\\n        // construction, since the code is only stored at the end of the\\n        // constructor execution.\\n\\n        uint256 size;\\n        // solhint-disable-next-line no-inline-assembly\\n        assembly { size := extcodesize(account) }\\n        return size > 0;\\n    }\\n\\n    /**\\n     * @dev Replacement for Solidity's `transfer`: sends `amount` wei to\\n     * `recipient`, forwarding all available gas and reverting on errors.\\n     *\\n     * https://eips.ethereum.org/EIPS/eip-1884[EIP1884] increases the gas cost\\n     * of certain opcodes, possibly making contracts go over the 2300 gas limit\\n     * imposed by `transfer`, making them unable to receive funds via\\n     * `transfer`. {sendValue} removes this limitation.\\n     *\\n     * https://diligence.consensys.net/posts/2019/09/stop-using-soliditys-transfer-now/[Learn more].\\n     *\\n     * IMPORTANT: because control is transferred to `recipient`, care must be\\n     * taken to not create reentrancy vulnerabilities. Consider using\\n     * {ReentrancyGuard} or the\\n     * https://solidity.readthedocs.io/en/v0.5.11/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].\\n     */\\n    function sendValue(address payable recipient, uint256 amount) internal {\\n        require(address(this).balance >= amount, \\\"Address: insufficient balance\\\");\\n\\n        // solhint-disable-next-line avoid-low-level-calls, avoid-call-value\\n        (bool success, ) = recipient.call{ value: amount }(\\\"\\\");\\n        require(success, \\\"Address: unable to send value, recipient may have reverted\\\");\\n    }\\n\\n    /**\\n     * @dev Performs a Solidity function call using a low level `call`. A\\n     * plain`call` is an unsafe replacement for a function call: use this\\n     * function instead.\\n     *\\n     * If `target` reverts with a revert reason, it is bubbled up by this\\n     * function (like regular Solidity function calls).\\n     *\\n     * Returns the raw returned data. To convert to the expected return value,\\n     * use https://solidity.readthedocs.io/en/latest/units-and-global-variables.html?highlight=abi.decode#abi-encoding-and-decoding-functions[`abi.decode`].\\n     *\\n     * Requirements:\\n     *\\n     * - `target` must be a contract.\\n     * - calling `target` with `data` must not revert.\\n     *\\n     * _Available since v3.1._\\n     */\\n    function functionCall(address target, bytes memory data) internal returns (bytes memory) {\\n      return functionCall(target, data, \\\"Address: low-level call failed\\\");\\n    }\\n\\n    /**\\n     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`], but with\\n     * `errorMessage` as a fallback revert reason when `target` reverts.\\n     *\\n     * _Available since v3.1._\\n     */\\n    function functionCall(address target, bytes memory data, string memory errorMessage) internal returns (bytes memory) {\\n        return functionCallWithValue(target, data, 0, errorMessage);\\n    }\\n\\n    /**\\n     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],\\n     * but also transferring `value` wei to `target`.\\n     *\\n     * Requirements:\\n     *\\n     * - the calling contract must have an ETH balance of at least `value`.\\n     * - the called Solidity function must be `payable`.\\n     *\\n     * _Available since v3.1._\\n     */\\n    function functionCallWithValue(address target, bytes memory data, uint256 value) internal returns (bytes memory) {\\n        return functionCallWithValue(target, data, value, \\\"Address: low-level call with value failed\\\");\\n    }\\n\\n    /**\\n     * @dev Same as {xref-Address-functionCallWithValue-address-bytes-uint256-}[`functionCallWithValue`], but\\n     * with `errorMessage` as a fallback revert reason when `target` reverts.\\n     *\\n     * _Available since v3.1._\\n     */\\n    function functionCallWithValue(address target, bytes memory data, uint256 value, string memory errorMessage) internal returns (bytes memory) {\\n        require(address(this).balance >= value, \\\"Address: insufficient balance for call\\\");\\n        require(isContract(target), \\\"Address: call to non-contract\\\");\\n\\n        // solhint-disable-next-line avoid-low-level-calls\\n        (bool success, bytes memory returndata) = target.call{ value: value }(data);\\n        return _verifyCallResult(success, returndata, errorMessage);\\n    }\\n\\n    /**\\n     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],\\n     * but performing a static call.\\n     *\\n     * _Available since v3.3._\\n     */\\n    function functionStaticCall(address target, bytes memory data) internal view returns (bytes memory) {\\n        return functionStaticCall(target, data, \\\"Address: low-level static call failed\\\");\\n    }\\n\\n    /**\\n     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],\\n     * but performing a static call.\\n     *\\n     * _Available since v3.3._\\n     */\\n    function functionStaticCall(address target, bytes memory data, string memory errorMessage) internal view returns (bytes memory) {\\n        require(isContract(target), \\\"Address: static call to non-contract\\\");\\n\\n        // solhint-disable-next-line avoid-low-level-calls\\n        (bool success, bytes memory returndata) = target.staticcall(data);\\n        return _verifyCallResult(success, returndata, errorMessage);\\n    }\\n\\n    /**\\n     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],\\n     * but performing a delegate call.\\n     *\\n     * _Available since v3.4._\\n     */\\n    function functionDelegateCall(address target, bytes memory data) internal returns (bytes memory) {\\n        return functionDelegateCall(target, data, \\\"Address: low-level delegate call failed\\\");\\n    }\\n\\n    /**\\n     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],\\n     * but performing a delegate call.\\n     *\\n     * _Available since v3.4._\\n     */\\n    function functionDelegateCall(address target, bytes memory data, string memory errorMessage) internal returns (bytes memory) {\\n        require(isContract(target), \\\"Address: delegate call to non-contract\\\");\\n\\n        // solhint-disable-next-line avoid-low-level-calls\\n        (bool success, bytes memory returndata) = target.delegatecall(data);\\n        return _verifyCallResult(success, returndata, errorMessage);\\n    }\\n\\n    function _verifyCallResult(bool success, bytes memory returndata, string memory errorMessage) private pure returns(bytes memory) {\\n        if (success) {\\n            return returndata;\\n        } else {\\n            // Look for revert reason and bubble it up if present\\n            if (returndata.length > 0) {\\n                // The easiest way to bubble the revert reason is using memory via assembly\\n\\n                // solhint-disable-next-line no-inline-assembly\\n                assembly {\\n                    let returndata_size := mload(returndata)\\n                    revert(add(32, returndata), returndata_size)\\n                }\\n            } else {\\n                revert(errorMessage);\\n            }\\n        }\\n    }\\n}\\n\",\"keccak256\":\"0xf89f005a3d98f7768cdee2583707db0ac725cf567d455751af32ee68132f3db3\",\"license\":\"MIT\"},\"@openzeppelin/contracts/utils/Context.sol\":{\"content\":\"// SPDX-License-Identifier: MIT\\n\\npragma solidity >=0.6.0 <0.8.0;\\n\\n/*\\n * @dev Provides information about the current execution context, including the\\n * sender of the transaction and its data. While these are generally available\\n * via msg.sender and msg.data, they should not be accessed in such a direct\\n * manner, since when dealing with GSN meta-transactions the account sending and\\n * paying for execution may not be the actual sender (as far as an application\\n * is concerned).\\n *\\n * This contract is only required for intermediate, library-like contracts.\\n */\\nabstract contract Context {\\n    function _msgSender() internal view virtual returns (address payable) {\\n        return msg.sender;\\n    }\\n\\n    function _msgData() internal view virtual returns (bytes memory) {\\n        this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691\\n        return msg.data;\\n    }\\n}\\n\",\"keccak256\":\"0x8d3cb350f04ff49cfb10aef08d87f19dcbaecc8027b0bed12f3275cd12f38cf0\",\"license\":\"MIT\"},\"@openzeppelin/contracts/utils/EnumerableMap.sol\":{\"content\":\"// SPDX-License-Identifier: MIT\\n\\npragma solidity ^0.7.0;\\n\\n/**\\n * @dev Library for managing an enumerable variant of Solidity's\\n * https://solidity.readthedocs.io/en/latest/types.html#mapping-types[`mapping`]\\n * type.\\n *\\n * Maps have the following properties:\\n *\\n * - Entries are added, removed, and checked for existence in constant time\\n * (O(1)).\\n * - Entries are enumerated in O(n). No guarantees are made on the ordering.\\n *\\n * ```\\n * contract Example {\\n *     // Add the library methods\\n *     using EnumerableMap for EnumerableMap.UintToAddressMap;\\n *\\n *     // Declare a set state variable\\n *     EnumerableMap.UintToAddressMap private myMap;\\n * }\\n * ```\\n *\\n * As of v3.0.0, only maps of type `uint256 -> address` (`UintToAddressMap`) are\\n * supported.\\n */\\nlibrary EnumerableMap {\\n    // To implement this library for multiple types with as little code\\n    // repetition as possible, we write it in terms of a generic Map type with\\n    // bytes32 keys and values.\\n    // The Map implementation uses private functions, and user-facing\\n    // implementations (such as Uint256ToAddressMap) are just wrappers around\\n    // the underlying Map.\\n    // This means that we can only create new EnumerableMaps for types that fit\\n    // in bytes32.\\n\\n    struct MapEntry {\\n        bytes32 _key;\\n        bytes32 _value;\\n    }\\n\\n    struct Map {\\n        // Storage of map keys and values\\n        MapEntry[] _entries;\\n\\n        // Position of the entry defined by a key in the `entries` array, plus 1\\n        // because index 0 means a key is not in the map.\\n        mapping (bytes32 => uint256) _indexes;\\n    }\\n\\n    /**\\n     * @dev Adds a key-value pair to a map, or updates the value for an existing\\n     * key. O(1).\\n     *\\n     * Returns true if the key was added to the map, that is if it was not\\n     * already present.\\n     */\\n    function _set(Map storage map, bytes32 key, bytes32 value) private returns (bool) {\\n        // We read and store the key's index to prevent multiple reads from the same storage slot\\n        uint256 keyIndex = map._indexes[key];\\n\\n        if (keyIndex == 0) { // Equivalent to !contains(map, key)\\n            map._entries.push(MapEntry({ _key: key, _value: value }));\\n            // The entry is stored at length-1, but we add 1 to all indexes\\n            // and use 0 as a sentinel value\\n            map._indexes[key] = map._entries.length;\\n            return true;\\n        } else {\\n            map._entries[keyIndex - 1]._value = value;\\n            return false;\\n        }\\n    }\\n\\n    /**\\n     * @dev Removes a key-value pair from a map. O(1).\\n     *\\n     * Returns true if the key was removed from the map, that is if it was present.\\n     */\\n    function _remove(Map storage map, bytes32 key) private returns (bool) {\\n        // We read and store the key's index to prevent multiple reads from the same storage slot\\n        uint256 keyIndex = map._indexes[key];\\n\\n        if (keyIndex != 0) { // Equivalent to contains(map, key)\\n            // To delete a key-value pair from the _entries array in O(1), we swap the entry to delete with the last one\\n            // in the array, and then remove the last entry (sometimes called as 'swap and pop').\\n            // This modifies the order of the array, as noted in {at}.\\n\\n            uint256 toDeleteIndex = keyIndex - 1;\\n            uint256 lastIndex = map._entries.length - 1;\\n\\n            // When the entry to delete is the last one, the swap operation is unnecessary. However, since this occurs\\n            // so rarely, we still do the swap anyway to avoid the gas cost of adding an 'if' statement.\\n\\n            MapEntry storage lastEntry = map._entries[lastIndex];\\n\\n            // Move the last entry to the index where the entry to delete is\\n            map._entries[toDeleteIndex] = lastEntry;\\n            // Update the index for the moved entry\\n            map._indexes[lastEntry._key] = toDeleteIndex + 1; // All indexes are 1-based\\n\\n            // Delete the slot where the moved entry was stored\\n            map._entries.pop();\\n\\n            // Delete the index for the deleted slot\\n            delete map._indexes[key];\\n\\n            return true;\\n        } else {\\n            return false;\\n        }\\n    }\\n\\n    /**\\n     * @dev Returns true if the key is in the map. O(1).\\n     */\\n    function _contains(Map storage map, bytes32 key) private view returns (bool) {\\n        return map._indexes[key] != 0;\\n    }\\n\\n    /**\\n     * @dev Returns the number of key-value pairs in the map. O(1).\\n     */\\n    function _length(Map storage map) private view returns (uint256) {\\n        return map._entries.length;\\n    }\\n\\n   /**\\n    * @dev Returns the key-value pair stored at position `index` in the map. O(1).\\n    *\\n    * Note that there are no guarantees on the ordering of entries inside the\\n    * array, and it may change when more entries are added or removed.\\n    *\\n    * Requirements:\\n    *\\n    * - `index` must be strictly less than {length}.\\n    */\\n    function _at(Map storage map, uint256 index) private view returns (bytes32, bytes32) {\\n        require(map._entries.length > index, \\\"EnumerableMap: index out of bounds\\\");\\n\\n        MapEntry storage entry = map._entries[index];\\n        return (entry._key, entry._value);\\n    }\\n\\n    /**\\n     * @dev Tries to returns the value associated with `key`.  O(1).\\n     * Does not revert if `key` is not in the map.\\n     */\\n    function _tryGet(Map storage map, bytes32 key) private view returns (bool, bytes32) {\\n        uint256 keyIndex = map._indexes[key];\\n        if (keyIndex == 0) return (false, 0); // Equivalent to contains(map, key)\\n        return (true, map._entries[keyIndex - 1]._value); // All indexes are 1-based\\n    }\\n\\n    /**\\n     * @dev Returns the value associated with `key`.  O(1).\\n     *\\n     * Requirements:\\n     *\\n     * - `key` must be in the map.\\n     */\\n    function _get(Map storage map, bytes32 key) private view returns (bytes32) {\\n        uint256 keyIndex = map._indexes[key];\\n        require(keyIndex != 0, \\\"EnumerableMap: nonexistent key\\\"); // Equivalent to contains(map, key)\\n        return map._entries[keyIndex - 1]._value; // All indexes are 1-based\\n    }\\n\\n    /**\\n     * @dev Same as {_get}, with a custom error message when `key` is not in the map.\\n     *\\n     * CAUTION: This function is deprecated because it requires allocating memory for the error\\n     * message unnecessarily. For custom revert reasons use {_tryGet}.\\n     */\\n    function _get(Map storage map, bytes32 key, string memory errorMessage) private view returns (bytes32) {\\n        uint256 keyIndex = map._indexes[key];\\n        require(keyIndex != 0, errorMessage); // Equivalent to contains(map, key)\\n        return map._entries[keyIndex - 1]._value; // All indexes are 1-based\\n    }\\n\\n    // UintToAddressMap\\n\\n    struct UintToAddressMap {\\n        Map _inner;\\n    }\\n\\n    /**\\n     * @dev Adds a key-value pair to a map, or updates the value for an existing\\n     * key. O(1).\\n     *\\n     * Returns true if the key was added to the map, that is if it was not\\n     * already present.\\n     */\\n    function set(UintToAddressMap storage map, uint256 key, address value) internal returns (bool) {\\n        return _set(map._inner, bytes32(key), bytes32(uint256(uint160(value))));\\n    }\\n\\n    /**\\n     * @dev Removes a value from a set. O(1).\\n     *\\n     * Returns true if the key was removed from the map, that is if it was present.\\n     */\\n    function remove(UintToAddressMap storage map, uint256 key) internal returns (bool) {\\n        return _remove(map._inner, bytes32(key));\\n    }\\n\\n    /**\\n     * @dev Returns true if the key is in the map. O(1).\\n     */\\n    function contains(UintToAddressMap storage map, uint256 key) internal view returns (bool) {\\n        return _contains(map._inner, bytes32(key));\\n    }\\n\\n    /**\\n     * @dev Returns the number of elements in the map. O(1).\\n     */\\n    function length(UintToAddressMap storage map) internal view returns (uint256) {\\n        return _length(map._inner);\\n    }\\n\\n   /**\\n    * @dev Returns the element stored at position `index` in the set. O(1).\\n    * Note that there are no guarantees on the ordering of values inside the\\n    * array, and it may change when more values are added or removed.\\n    *\\n    * Requirements:\\n    *\\n    * - `index` must be strictly less than {length}.\\n    */\\n    function at(UintToAddressMap storage map, uint256 index) internal view returns (uint256, address) {\\n        (bytes32 key, bytes32 value) = _at(map._inner, index);\\n        return (uint256(key), address(uint160(uint256(value))));\\n    }\\n\\n    /**\\n     * @dev Tries to returns the value associated with `key`.  O(1).\\n     * Does not revert if `key` is not in the map.\\n     *\\n     * _Available since v3.4._\\n     */\\n    function tryGet(UintToAddressMap storage map, uint256 key) internal view returns (bool, address) {\\n        (bool success, bytes32 value) = _tryGet(map._inner, bytes32(key));\\n        return (success, address(uint160(uint256(value))));\\n    }\\n\\n    /**\\n     * @dev Returns the value associated with `key`.  O(1).\\n     *\\n     * Requirements:\\n     *\\n     * - `key` must be in the map.\\n     */\\n    function get(UintToAddressMap storage map, uint256 key) internal view returns (address) {\\n        return address(uint160(uint256(_get(map._inner, bytes32(key)))));\\n    }\\n\\n    /**\\n     * @dev Same as {get}, with a custom error message when `key` is not in the map.\\n     *\\n     * CAUTION: This function is deprecated because it requires allocating memory for the error\\n     * message unnecessarily. For custom revert reasons use {tryGet}.\\n     */\\n    function get(UintToAddressMap storage map, uint256 key, string memory errorMessage) internal view returns (address) {\\n        return address(uint160(uint256(_get(map._inner, bytes32(key), errorMessage))));\\n    }\\n}\\n\",\"keccak256\":\"0x2114555153edb5f273008b3d34205f511db9af06b88f752e4c280dd612c4c549\",\"license\":\"MIT\"},\"@openzeppelin/contracts/utils/EnumerableSet.sol\":{\"content\":\"// SPDX-License-Identifier: MIT\\n\\npragma solidity ^0.7.0;\\n\\n/**\\n * @dev Library for managing\\n * https://en.wikipedia.org/wiki/Set_(abstract_data_type)[sets] of primitive\\n * types.\\n *\\n * Sets have the following properties:\\n *\\n * - Elements are added, removed, and checked for existence in constant time\\n * (O(1)).\\n * - Elements are enumerated in O(n). No guarantees are made on the ordering.\\n *\\n * ```\\n * contract Example {\\n *     // Add the library methods\\n *     using EnumerableSet for EnumerableSet.AddressSet;\\n *\\n *     // Declare a set state variable\\n *     EnumerableSet.AddressSet private mySet;\\n * }\\n * ```\\n *\\n * As of v3.3.0, sets of type `bytes32` (`Bytes32Set`), `address` (`AddressSet`)\\n * and `uint256` (`UintSet`) are supported.\\n */\\nlibrary EnumerableSet {\\n    // To implement this library for multiple types with as little code\\n    // repetition as possible, we write it in terms of a generic Set type with\\n    // bytes32 values.\\n    // The Set implementation uses private functions, and user-facing\\n    // implementations (such as AddressSet) are just wrappers around the\\n    // underlying Set.\\n    // This means that we can only create new EnumerableSets for types that fit\\n    // in bytes32.\\n\\n    struct Set {\\n        // Storage of set values\\n        bytes32[] _values;\\n\\n        // Position of the value in the `values` array, plus 1 because index 0\\n        // means a value is not in the set.\\n        mapping (bytes32 => uint256) _indexes;\\n    }\\n\\n    /**\\n     * @dev Add a value to a set. O(1).\\n     *\\n     * Returns true if the value was added to the set, that is if it was not\\n     * already present.\\n     */\\n    function _add(Set storage set, bytes32 value) private returns (bool) {\\n        if (!_contains(set, value)) {\\n            set._values.push(value);\\n            // The value is stored at length-1, but we add 1 to all indexes\\n            // and use 0 as a sentinel value\\n            set._indexes[value] = set._values.length;\\n            return true;\\n        } else {\\n            return false;\\n        }\\n    }\\n\\n    /**\\n     * @dev Removes a value from a set. O(1).\\n     *\\n     * Returns true if the value was removed from the set, that is if it was\\n     * present.\\n     */\\n    function _remove(Set storage set, bytes32 value) private returns (bool) {\\n        // We read and store the value's index to prevent multiple reads from the same storage slot\\n        uint256 valueIndex = set._indexes[value];\\n\\n        if (valueIndex != 0) { // Equivalent to contains(set, value)\\n            // To delete an element from the _values array in O(1), we swap the element to delete with the last one in\\n            // the array, and then remove the last element (sometimes called as 'swap and pop').\\n            // This modifies the order of the array, as noted in {at}.\\n\\n            uint256 toDeleteIndex = valueIndex - 1;\\n            uint256 lastIndex = set._values.length - 1;\\n\\n            // When the value to delete is the last one, the swap operation is unnecessary. However, since this occurs\\n            // so rarely, we still do the swap anyway to avoid the gas cost of adding an 'if' statement.\\n\\n            bytes32 lastvalue = set._values[lastIndex];\\n\\n            // Move the last value to the index where the value to delete is\\n            set._values[toDeleteIndex] = lastvalue;\\n            // Update the index for the moved value\\n            set._indexes[lastvalue] = toDeleteIndex + 1; // All indexes are 1-based\\n\\n            // Delete the slot where the moved value was stored\\n            set._values.pop();\\n\\n            // Delete the index for the deleted slot\\n            delete set._indexes[value];\\n\\n            return true;\\n        } else {\\n            return false;\\n        }\\n    }\\n\\n    /**\\n     * @dev Returns true if the value is in the set. O(1).\\n     */\\n    function _contains(Set storage set, bytes32 value) private view returns (bool) {\\n        return set._indexes[value] != 0;\\n    }\\n\\n    /**\\n     * @dev Returns the number of values on the set. O(1).\\n     */\\n    function _length(Set storage set) private view returns (uint256) {\\n        return set._values.length;\\n    }\\n\\n   /**\\n    * @dev Returns the value stored at position `index` in the set. O(1).\\n    *\\n    * Note that there are no guarantees on the ordering of values inside the\\n    * array, and it may change when more values are added or removed.\\n    *\\n    * Requirements:\\n    *\\n    * - `index` must be strictly less than {length}.\\n    */\\n    function _at(Set storage set, uint256 index) private view returns (bytes32) {\\n        require(set._values.length > index, \\\"EnumerableSet: index out of bounds\\\");\\n        return set._values[index];\\n    }\\n\\n    // Bytes32Set\\n\\n    struct Bytes32Set {\\n        Set _inner;\\n    }\\n\\n    /**\\n     * @dev Add a value to a set. O(1).\\n     *\\n     * Returns true if the value was added to the set, that is if it was not\\n     * already present.\\n     */\\n    function add(Bytes32Set storage set, bytes32 value) internal returns (bool) {\\n        return _add(set._inner, value);\\n    }\\n\\n    /**\\n     * @dev Removes a value from a set. O(1).\\n     *\\n     * Returns true if the value was removed from the set, that is if it was\\n     * present.\\n     */\\n    function remove(Bytes32Set storage set, bytes32 value) internal returns (bool) {\\n        return _remove(set._inner, value);\\n    }\\n\\n    /**\\n     * @dev Returns true if the value is in the set. O(1).\\n     */\\n    function contains(Bytes32Set storage set, bytes32 value) internal view returns (bool) {\\n        return _contains(set._inner, value);\\n    }\\n\\n    /**\\n     * @dev Returns the number of values in the set. O(1).\\n     */\\n    function length(Bytes32Set storage set) internal view returns (uint256) {\\n        return _length(set._inner);\\n    }\\n\\n   /**\\n    * @dev Returns the value stored at position `index` in the set. O(1).\\n    *\\n    * Note that there are no guarantees on the ordering of values inside the\\n    * array, and it may change when more values are added or removed.\\n    *\\n    * Requirements:\\n    *\\n    * - `index` must be strictly less than {length}.\\n    */\\n    function at(Bytes32Set storage set, uint256 index) internal view returns (bytes32) {\\n        return _at(set._inner, index);\\n    }\\n\\n    // AddressSet\\n\\n    struct AddressSet {\\n        Set _inner;\\n    }\\n\\n    /**\\n     * @dev Add a value to a set. O(1).\\n     *\\n     * Returns true if the value was added to the set, that is if it was not\\n     * already present.\\n     */\\n    function add(AddressSet storage set, address value) internal returns (bool) {\\n        return _add(set._inner, bytes32(uint256(uint160(value))));\\n    }\\n\\n    /**\\n     * @dev Removes a value from a set. O(1).\\n     *\\n     * Returns true if the value was removed from the set, that is if it was\\n     * present.\\n     */\\n    function remove(AddressSet storage set, address value) internal returns (bool) {\\n        return _remove(set._inner, bytes32(uint256(uint160(value))));\\n    }\\n\\n    /**\\n     * @dev Returns true if the value is in the set. O(1).\\n     */\\n    function contains(AddressSet storage set, address value) internal view returns (bool) {\\n        return _contains(set._inner, bytes32(uint256(uint160(value))));\\n    }\\n\\n    /**\\n     * @dev Returns the number of values in the set. O(1).\\n     */\\n    function length(AddressSet storage set) internal view returns (uint256) {\\n        return _length(set._inner);\\n    }\\n\\n   /**\\n    * @dev Returns the value stored at position `index` in the set. O(1).\\n    *\\n    * Note that there are no guarantees on the ordering of values inside the\\n    * array, and it may change when more values are added or removed.\\n    *\\n    * Requirements:\\n    *\\n    * - `index` must be strictly less than {length}.\\n    */\\n    function at(AddressSet storage set, uint256 index) internal view returns (address) {\\n        return address(uint160(uint256(_at(set._inner, index))));\\n    }\\n\\n\\n    // UintSet\\n\\n    struct UintSet {\\n        Set _inner;\\n    }\\n\\n    /**\\n     * @dev Add a value to a set. O(1).\\n     *\\n     * Returns true if the value was added to the set, that is if it was not\\n     * already present.\\n     */\\n    function add(UintSet storage set, uint256 value) internal returns (bool) {\\n        return _add(set._inner, bytes32(value));\\n    }\\n\\n    /**\\n     * @dev Removes a value from a set. O(1).\\n     *\\n     * Returns true if the value was removed from the set, that is if it was\\n     * present.\\n     */\\n    function remove(UintSet storage set, uint256 value) internal returns (bool) {\\n        return _remove(set._inner, bytes32(value));\\n    }\\n\\n    /**\\n     * @dev Returns true if the value is in the set. O(1).\\n     */\\n    function contains(UintSet storage set, uint256 value) internal view returns (bool) {\\n        return _contains(set._inner, bytes32(value));\\n    }\\n\\n    /**\\n     * @dev Returns the number of values on the set. O(1).\\n     */\\n    function length(UintSet storage set) internal view returns (uint256) {\\n        return _length(set._inner);\\n    }\\n\\n   /**\\n    * @dev Returns the value stored at position `index` in the set. O(1).\\n    *\\n    * Note that there are no guarantees on the ordering of values inside the\\n    * array, and it may change when more values are added or removed.\\n    *\\n    * Requirements:\\n    *\\n    * - `index` must be strictly less than {length}.\\n    */\\n    function at(UintSet storage set, uint256 index) internal view returns (uint256) {\\n        return uint256(_at(set._inner, index));\\n    }\\n}\\n\",\"keccak256\":\"0x9a2c1eebb65250f0e11882237038600f22a62376f0547db4acc0dfe0a3d8d34f\",\"license\":\"MIT\"},\"@openzeppelin/contracts/utils/Strings.sol\":{\"content\":\"// SPDX-License-Identifier: MIT\\n\\npragma solidity ^0.7.0;\\n\\n/**\\n * @dev String operations.\\n */\\nlibrary Strings {\\n    /**\\n     * @dev Converts a `uint256` to its ASCII `string` representation.\\n     */\\n    function toString(uint256 value) internal pure returns (string memory) {\\n        // Inspired by OraclizeAPI's implementation - MIT licence\\n        // https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol\\n\\n        if (value == 0) {\\n            return \\\"0\\\";\\n        }\\n        uint256 temp = value;\\n        uint256 digits;\\n        while (temp != 0) {\\n            digits++;\\n            temp /= 10;\\n        }\\n        bytes memory buffer = new bytes(digits);\\n        uint256 index = digits - 1;\\n        temp = value;\\n        while (temp != 0) {\\n            buffer[index--] = bytes1(uint8(48 + temp % 10));\\n            temp /= 10;\\n        }\\n        return string(buffer);\\n    }\\n}\\n\",\"keccak256\":\"0x08e38e034333372aea8cb1b8846085b7fbab42c6b77a0af464d2c6827827c4f0\",\"license\":\"MIT\"},\"contracts/v3-core/interfaces/IBitswapV3Factory.sol\":{\"content\":\"// SPDX-License-Identifier: GPL-2.0-or-later\\npragma solidity =0.7.6;\\n\\n/// @title The interface for the Bitswap V3 Factory\\n/// @notice The Bitswap V3 Factory facilitates creation of Bitswap V3 pools and control over the protocol fees\\ninterface IBitswapV3Factory {\\n    /// @notice Emitted when the owner of the factory is changed\\n    /// @param oldOwner The owner before the owner was changed\\n    /// @param newOwner The owner after the owner was changed\\n    event OwnerChanged(address indexed oldOwner, address indexed newOwner);\\n\\n    /// @notice Emitted when a pool is created\\n    /// @param token0 The first token of the pool by address sort order\\n    /// @param token1 The second token of the pool by address sort order\\n    /// @param fee The fee collected upon every swap in the pool, denominated in hundredths of a bip\\n    /// @param tickSpacing The minimum number of ticks between initialized ticks\\n    /// @param pool The address of the created pool\\n    event PoolCreated(\\n        address indexed token0,\\n        address indexed token1,\\n        uint24 indexed fee,\\n        int24 tickSpacing,\\n        address pool\\n    );\\n\\n    /// @notice Emitted when a new fee amount is enabled for pool creation via the factory\\n    /// @param fee The enabled fee, denominated in hundredths of a bip\\n    /// @param tickSpacing The minimum number of ticks between initialized ticks for pools created with the given fee\\n    event FeeAmountEnabled(uint24 indexed fee, int24 indexed tickSpacing);\\n\\n    /// @notice Returns the current owner of the factory\\n    /// @dev Can be changed by the current owner via setOwner\\n    /// @return The address of the factory owner\\n    function owner() external view returns (address);\\n\\n    /// @notice Returns the tick spacing for a given fee amount, if enabled, or 0 if not enabled\\n    /// @dev A fee amount can never be removed, so this value should be hard coded or cached in the calling context\\n    /// @param fee The enabled fee, denominated in hundredths of a bip. Returns 0 in case of unenabled fee\\n    /// @return The tick spacing\\n    function feeAmountTickSpacing(uint24 fee) external view returns (int24);\\n\\n    /// @notice Returns the pool address for a given pair of tokens and a fee, or address 0 if it does not exist\\n    /// @dev tokenA and tokenB may be passed in either token0/token1 or token1/token0 order\\n    /// @param tokenA The contract address of either token0 or token1\\n    /// @param tokenB The contract address of the other token\\n    /// @param fee The fee collected upon every swap in the pool, denominated in hundredths of a bip\\n    /// @return pool The pool address\\n    function getPool(\\n        address tokenA,\\n        address tokenB,\\n        uint24 fee\\n    ) external view returns (address pool);\\n\\n    /// @notice Creates a pool for the given two tokens and fee\\n    /// @param tokenA One of the two tokens in the desired pool\\n    /// @param tokenB The other of the two tokens in the desired pool\\n    /// @param fee The desired fee for the pool\\n    /// @dev tokenA and tokenB may be passed in either order: token0/token1 or token1/token0. tickSpacing is retrieved\\n    /// from the fee. The call will revert if the pool already exists, the fee is invalid, or the token arguments\\n    /// are invalid.\\n    /// @return pool The address of the newly created pool\\n    function createPool(\\n        address tokenA,\\n        address tokenB,\\n        uint24 fee\\n    ) external returns (address pool);\\n\\n    /// @notice Updates the owner of the factory\\n    /// @dev Must be called by the current owner\\n    /// @param _owner The new owner of the factory\\n    function setOwner(address _owner) external;\\n\\n    /// @notice Enables a fee amount with the given tickSpacing\\n    /// @dev Fee amounts may never be removed once enabled\\n    /// @param fee The fee amount to enable, denominated in hundredths of a bip (i.e. 1e-6)\\n    /// @param tickSpacing The spacing between ticks to be enforced for all pools created with the given fee amount\\n    function enableFeeAmount(uint24 fee, int24 tickSpacing) external;\\n}\\n\",\"keccak256\":\"0x908c99a1538d658b905cbd16c85d5fce199ecee39cf32ab08b414bf4bc4f0b45\",\"license\":\"GPL-2.0-or-later\"},\"contracts/v3-core/interfaces/IBitswapV3Pool.sol\":{\"content\":\"// SPDX-License-Identifier: GPL-2.0-or-later\\npragma solidity =0.7.6;\\n\\nimport './pool/IBitswapV3PoolImmutables.sol';\\nimport './pool/IBitswapV3PoolState.sol';\\nimport './pool/IBitswapV3PoolDerivedState.sol';\\nimport './pool/IBitswapV3PoolActions.sol';\\nimport './pool/IBitswapV3PoolOwnerActions.sol';\\nimport './pool/IBitswapV3PoolEvents.sol';\\n\\n/// @title The interface for a Bitswap V3 Pool\\n/// @notice A Bitswap pool facilitates swapping and automated market making between any two assets that strictly conform\\n/// to the ERC20 specification\\n/// @dev The pool interface is broken up into many smaller pieces\\ninterface IBitswapV3Pool is\\n    IBitswapV3PoolImmutables,\\n    IBitswapV3PoolState,\\n    IBitswapV3PoolDerivedState,\\n    IBitswapV3PoolActions,\\n    IBitswapV3PoolOwnerActions,\\n    IBitswapV3PoolEvents\\n{\\n\\n}\\n\",\"keccak256\":\"0x7f634fe6987c6bc35228ef437b3be4e3313d17c225e9bedf1f9b4a05d44bd56a\",\"license\":\"GPL-2.0-or-later\"},\"contracts/v3-core/interfaces/callback/IBitswapV3MintCallback.sol\":{\"content\":\"// SPDX-License-Identifier: GPL-2.0-or-later\\npragma solidity =0.7.6;\\n\\n/// @title Callback for IBitswapV3PoolActions#mint\\n/// @notice Any contract that calls IBitswapV3PoolActions#mint must implement this interface\\ninterface IBitswapV3MintCallback {\\n    /// @notice Called to `msg.sender` after minting liquidity to a position from IBitswapV3Pool#mint.\\n    /// @dev In the implementation you must pay the pool tokens owed for the minted liquidity.\\n    /// The caller of this method must be checked to be a BitswapV3Pool deployed by the canonical BitswapV3Factory.\\n    /// @param amount0Owed The amount of token0 due to the pool for the minted liquidity\\n    /// @param amount1Owed The amount of token1 due to the pool for the minted liquidity\\n    /// @param data Any data passed through by the caller via the IBitswapV3PoolActions#mint call\\n    function bitswapV3MintCallback(\\n        uint256 amount0Owed,\\n        uint256 amount1Owed,\\n        bytes calldata data\\n    ) external;\\n}\\n\",\"keccak256\":\"0x84ea6d9d3db268d80bda9057a1102e10502c0909f3c52b18b1f1e7cc00948cf1\",\"license\":\"GPL-2.0-or-later\"},\"contracts/v3-core/interfaces/pool/IBitswapV3PoolActions.sol\":{\"content\":\"// SPDX-License-Identifier: GPL-2.0-or-later\\npragma solidity =0.7.6;\\n\\n/// @title Permissionless pool actions\\n/// @notice Contains pool methods that can be called by anyone\\ninterface IBitswapV3PoolActions {\\n    /// @notice Sets the initial price for the pool\\n    /// @dev Price is represented as a sqrt(amountToken1/amountToken0) Q64.96 value\\n    /// @param sqrtPriceX96 the initial sqrt price of the pool as a Q64.96\\n    function initialize(uint160 sqrtPriceX96) external;\\n\\n    /// @notice Adds liquidity for the given recipient/tickLower/tickUpper position\\n    /// @dev The caller of this method receives a callback in the form of IBitswapV3MintCallback#bitswapV3MintCallback\\n    /// in which they must pay any token0 or token1 owed for the liquidity. The amount of token0/token1 due depends\\n    /// on tickLower, tickUpper, the amount of liquidity, and the current price.\\n    /// @param recipient The address for which the liquidity will be created\\n    /// @param tickLower The lower tick of the position in which to add liquidity\\n    /// @param tickUpper The upper tick of the position in which to add liquidity\\n    /// @param amount The amount of liquidity to mint\\n    /// @param data Any data that should be passed through to the callback\\n    /// @return amount0 The amount of token0 that was paid to mint the given amount of liquidity. Matches the value in the callback\\n    /// @return amount1 The amount of token1 that was paid to mint the given amount of liquidity. Matches the value in the callback\\n    function mint(\\n        address recipient,\\n        int24 tickLower,\\n        int24 tickUpper,\\n        uint128 amount,\\n        bytes calldata data\\n    ) external returns (uint256 amount0, uint256 amount1);\\n\\n    /// @notice Collects tokens owed to a position\\n    /// @dev Does not recompute fees earned, which must be done either via mint or burn of any amount of liquidity.\\n    /// Collect must be called by the position owner. To withdraw only token0 or only token1, amount0Requested or\\n    /// amount1Requested may be set to zero. To withdraw all tokens owed, caller may pass any value greater than the\\n    /// actual tokens owed, e.g. type(uint128).max. Tokens owed may be from accumulated swap fees or burned liquidity.\\n    /// @param recipient The address which should receive the fees collected\\n    /// @param tickLower The lower tick of the position for which to collect fees\\n    /// @param tickUpper The upper tick of the position for which to collect fees\\n    /// @param amount0Requested How much token0 should be withdrawn from the fees owed\\n    /// @param amount1Requested How much token1 should be withdrawn from the fees owed\\n    /// @return amount0 The amount of fees collected in token0\\n    /// @return amount1 The amount of fees collected in token1\\n    function collect(\\n        address recipient,\\n        int24 tickLower,\\n        int24 tickUpper,\\n        uint128 amount0Requested,\\n        uint128 amount1Requested\\n    ) external returns (uint128 amount0, uint128 amount1);\\n\\n    /// @notice Burn liquidity from the sender and account tokens owed for the liquidity to the position\\n    /// @dev Can be used to trigger a recalculation of fees owed to a position by calling with an amount of 0\\n    /// @dev Fees must be collected separately via a call to #collect\\n    /// @param tickLower The lower tick of the position for which to burn liquidity\\n    /// @param tickUpper The upper tick of the position for which to burn liquidity\\n    /// @param amount How much liquidity to burn\\n    /// @return amount0 The amount of token0 sent to the recipient\\n    /// @return amount1 The amount of token1 sent to the recipient\\n    function burn(\\n        int24 tickLower,\\n        int24 tickUpper,\\n        uint128 amount\\n    ) external returns (uint256 amount0, uint256 amount1);\\n\\n    /// @notice Swap token0 for token1, or token1 for token0\\n    /// @dev The caller of this method receives a callback in the form of IBitswapV3SwapCallback#bitswapV3SwapCallback\\n    /// @param recipient The address to receive the output of the swap\\n    /// @param zeroForOne The direction of the swap, true for token0 to token1, false for token1 to token0\\n    /// @param amountSpecified The amount of the swap, which implicitly configures the swap as exact input (positive), or exact output (negative)\\n    /// @param sqrtPriceLimitX96 The Q64.96 sqrt price limit. If zero for one, the price cannot be less than this\\n    /// value after the swap. If one for zero, the price cannot be greater than this value after the swap\\n    /// @param data Any data to be passed through to the callback\\n    /// @return amount0 The delta of the balance of token0 of the pool, exact when negative, minimum when positive\\n    /// @return amount1 The delta of the balance of token1 of the pool, exact when negative, minimum when positive\\n    function swap(\\n        address recipient,\\n        bool zeroForOne,\\n        int256 amountSpecified,\\n        uint160 sqrtPriceLimitX96,\\n        bytes calldata data\\n    ) external returns (int256 amount0, int256 amount1);\\n\\n    /// @notice Receive token0 and/or token1 and pay it back, plus a fee, in the callback\\n    /// @dev The caller of this method receives a callback in the form of IBitswapV3FlashCallback#bitswapV3FlashCallback\\n    /// @dev Can be used to donate underlying tokens pro-rata to currently in-range liquidity providers by calling\\n    /// with 0 amount{0,1} and sending the donation amount(s) from the callback\\n    /// @param recipient The address which will receive the token0 and token1 amounts\\n    /// @param amount0 The amount of token0 to send\\n    /// @param amount1 The amount of token1 to send\\n    /// @param data Any data to be passed through to the callback\\n    function flash(\\n        address recipient,\\n        uint256 amount0,\\n        uint256 amount1,\\n        bytes calldata data\\n    ) external;\\n\\n    /// @notice Increase the maximum number of price and liquidity observations that this pool will store\\n    /// @dev This method is no-op if the pool already has an observationCardinalityNext greater than or equal to\\n    /// the input observationCardinalityNext.\\n    /// @param observationCardinalityNext The desired minimum number of observations for the pool to store\\n    function increaseObservationCardinalityNext(uint16 observationCardinalityNext) external;\\n}\\n\",\"keccak256\":\"0x056eba82f200128abf68a1f18d2e98c1750bc41e06380d51605d3c6b5acd4ee7\",\"license\":\"GPL-2.0-or-later\"},\"contracts/v3-core/interfaces/pool/IBitswapV3PoolDerivedState.sol\":{\"content\":\"// SPDX-License-Identifier: GPL-2.0-or-later\\npragma solidity =0.7.6;\\n\\n/// @title Pool state that is not stored\\n/// @notice Contains view functions to provide information about the pool that is computed rather than stored on the\\n/// blockchain. The functions here may have variable gas costs.\\ninterface IBitswapV3PoolDerivedState {\\n    /// @notice Returns the cumulative tick and liquidity as of each timestamp `secondsAgo` from the current block timestamp\\n    /// @dev To get a time weighted average tick or liquidity-in-range, you must call this with two values, one representing\\n    /// the beginning of the period and another for the end of the period. E.g., to get the last hour time-weighted average tick,\\n    /// you must call it with secondsAgos = [3600, 0].\\n    /// @dev The time weighted average tick represents the geometric time weighted average price of the pool, in\\n    /// log base sqrt(1.0001) of token1 / token0. The TickMath library can be used to go from a tick value to a ratio.\\n    /// @param secondsAgos From how long ago each cumulative tick and liquidity value should be returned\\n    /// @return tickCumulatives Cumulative tick values as of each `secondsAgos` from the current block timestamp\\n    /// @return secondsPerLiquidityCumulativeX128s Cumulative seconds per liquidity-in-range value as of each `secondsAgos` from the current block\\n    /// timestamp\\n    function observe(uint32[] calldata secondsAgos)\\n        external\\n        view\\n        returns (int56[] memory tickCumulatives, uint160[] memory secondsPerLiquidityCumulativeX128s);\\n\\n    /// @notice Returns a snapshot of the tick cumulative, seconds per liquidity and seconds inside a tick range\\n    /// @dev Snapshots must only be compared to other snapshots, taken over a period for which a position existed.\\n    /// I.e., snapshots cannot be compared if a position is not held for the entire period between when the first\\n    /// snapshot is taken and the second snapshot is taken.\\n    /// @param tickLower The lower tick of the range\\n    /// @param tickUpper The upper tick of the range\\n    /// @return tickCumulativeInside The snapshot of the tick accumulator for the range\\n    /// @return secondsPerLiquidityInsideX128 The snapshot of seconds per liquidity for the range\\n    /// @return secondsInside The snapshot of seconds per liquidity for the range\\n    function snapshotCumulativesInside(int24 tickLower, int24 tickUpper)\\n        external\\n        view\\n        returns (\\n            int56 tickCumulativeInside,\\n            uint160 secondsPerLiquidityInsideX128,\\n            uint32 secondsInside\\n        );\\n}\\n\",\"keccak256\":\"0xe464bbd8d49539bd68a4a8171b65c0822eb7a0004b9bcaa34b2ca0944e7827b0\",\"license\":\"GPL-2.0-or-later\"},\"contracts/v3-core/interfaces/pool/IBitswapV3PoolEvents.sol\":{\"content\":\"// SPDX-License-Identifier: GPL-2.0-or-later\\npragma solidity =0.7.6;\\n\\n/// @title Events emitted by a pool\\n/// @notice Contains all events emitted by the pool\\ninterface IBitswapV3PoolEvents {\\n    /// @notice Emitted exactly once by a pool when #initialize is first called on the pool\\n    /// @dev Mint/Burn/Swap cannot be emitted by the pool before Initialize\\n    /// @param sqrtPriceX96 The initial sqrt price of the pool, as a Q64.96\\n    /// @param tick The initial tick of the pool, i.e. log base 1.0001 of the starting price of the pool\\n    event Initialize(uint160 sqrtPriceX96, int24 tick);\\n\\n    /// @notice Emitted when liquidity is minted for a given position\\n    /// @param sender The address that minted the liquidity\\n    /// @param owner The owner of the position and recipient of any minted liquidity\\n    /// @param tickLower The lower tick of the position\\n    /// @param tickUpper The upper tick of the position\\n    /// @param amount The amount of liquidity minted to the position range\\n    /// @param amount0 How much token0 was required for the minted liquidity\\n    /// @param amount1 How much token1 was required for the minted liquidity\\n    event Mint(\\n        address sender,\\n        address indexed owner,\\n        int24 indexed tickLower,\\n        int24 indexed tickUpper,\\n        uint128 amount,\\n        uint256 amount0,\\n        uint256 amount1\\n    );\\n\\n    /// @notice Emitted when fees are collected by the owner of a position\\n    /// @dev Collect events may be emitted with zero amount0 and amount1 when the caller chooses not to collect fees\\n    /// @param owner The owner of the position for which fees are collected\\n    /// @param tickLower The lower tick of the position\\n    /// @param tickUpper The upper tick of the position\\n    /// @param amount0 The amount of token0 fees collected\\n    /// @param amount1 The amount of token1 fees collected\\n    event Collect(\\n        address indexed owner,\\n        address recipient,\\n        int24 indexed tickLower,\\n        int24 indexed tickUpper,\\n        uint128 amount0,\\n        uint128 amount1\\n    );\\n\\n    /// @notice Emitted when a position's liquidity is removed\\n    /// @dev Does not withdraw any fees earned by the liquidity position, which must be withdrawn via #collect\\n    /// @param owner The owner of the position for which liquidity is removed\\n    /// @param tickLower The lower tick of the position\\n    /// @param tickUpper The upper tick of the position\\n    /// @param amount The amount of liquidity to remove\\n    /// @param amount0 The amount of token0 withdrawn\\n    /// @param amount1 The amount of token1 withdrawn\\n    event Burn(\\n        address indexed owner,\\n        int24 indexed tickLower,\\n        int24 indexed tickUpper,\\n        uint128 amount,\\n        uint256 amount0,\\n        uint256 amount1\\n    );\\n\\n    /// @notice Emitted by the pool for any swaps between token0 and token1\\n    /// @param sender The address that initiated the swap call, and that received the callback\\n    /// @param recipient The address that received the output of the swap\\n    /// @param amount0 The delta of the token0 balance of the pool\\n    /// @param amount1 The delta of the token1 balance of the pool\\n    /// @param sqrtPriceX96 The sqrt(price) of the pool after the swap, as a Q64.96\\n    /// @param liquidity The liquidity of the pool after the swap\\n    /// @param tick The log base 1.0001 of price of the pool after the swap\\n    event Swap(\\n        address indexed sender,\\n        address indexed recipient,\\n        int256 amount0,\\n        int256 amount1,\\n        uint160 sqrtPriceX96,\\n        uint128 liquidity,\\n        int24 tick\\n    );\\n\\n    /// @notice Emitted by the pool for any flashes of token0/token1\\n    /// @param sender The address that initiated the swap call, and that received the callback\\n    /// @param recipient The address that received the tokens from flash\\n    /// @param amount0 The amount of token0 that was flashed\\n    /// @param amount1 The amount of token1 that was flashed\\n    /// @param paid0 The amount of token0 paid for the flash, which can exceed the amount0 plus the fee\\n    /// @param paid1 The amount of token1 paid for the flash, which can exceed the amount1 plus the fee\\n    event Flash(\\n        address indexed sender,\\n        address indexed recipient,\\n        uint256 amount0,\\n        uint256 amount1,\\n        uint256 paid0,\\n        uint256 paid1\\n    );\\n\\n    /// @notice Emitted by the pool for increases to the number of observations that can be stored\\n    /// @dev observationCardinalityNext is not the observation cardinality until an observation is written at the index\\n    /// just before a mint/swap/burn.\\n    /// @param observationCardinalityNextOld The previous value of the next observation cardinality\\n    /// @param observationCardinalityNextNew The updated value of the next observation cardinality\\n    event IncreaseObservationCardinalityNext(\\n        uint16 observationCardinalityNextOld,\\n        uint16 observationCardinalityNextNew\\n    );\\n\\n    /// @notice Emitted when the protocol fee is changed by the pool\\n    /// @param feeProtocol0Old The previous value of the token0 protocol fee\\n    /// @param feeProtocol1Old The previous value of the token1 protocol fee\\n    /// @param feeProtocol0New The updated value of the token0 protocol fee\\n    /// @param feeProtocol1New The updated value of the token1 protocol fee\\n    event SetFeeProtocol(uint8 feeProtocol0Old, uint8 feeProtocol1Old, uint8 feeProtocol0New, uint8 feeProtocol1New);\\n\\n    /// @notice Emitted when the collected protocol fees are withdrawn by the factory owner\\n    /// @param sender The address that collects the protocol fees\\n    /// @param recipient The address that receives the collected protocol fees\\n    /// @param amount0 The amount of token0 protocol fees that is withdrawn\\n    /// @param amount0 The amount of token1 protocol fees that is withdrawn\\n    event CollectProtocol(address indexed sender, address indexed recipient, uint128 amount0, uint128 amount1);\\n}\\n\",\"keccak256\":\"0xad2a2096938eb6ee8262383be60a0392092f2e636a5f1b86cdd216219396262c\",\"license\":\"GPL-2.0-or-later\"},\"contracts/v3-core/interfaces/pool/IBitswapV3PoolImmutables.sol\":{\"content\":\"// SPDX-License-Identifier: GPL-2.0-or-later\\npragma solidity =0.7.6;\\n\\n/// @title Pool state that never changes\\n/// @notice These parameters are fixed for a pool forever, i.e., the methods will always return the same values\\ninterface IBitswapV3PoolImmutables {\\n    /// @notice The contract that deployed the pool, which must adhere to the IBitswapV3Factory interface\\n    /// @return The contract address\\n    function factory() external view returns (address);\\n\\n    /// @notice The first of the two tokens of the pool, sorted by address\\n    /// @return The token contract address\\n    function token0() external view returns (address);\\n\\n    /// @notice The second of the two tokens of the pool, sorted by address\\n    /// @return The token contract address\\n    function token1() external view returns (address);\\n\\n    /// @notice The pool's fee in hundredths of a bip, i.e. 1e-6\\n    /// @return The fee\\n    function fee() external view returns (uint24);\\n\\n    /// @notice The pool tick spacing\\n    /// @dev Ticks can only be used at multiples of this value, minimum of 1 and always positive\\n    /// e.g.: a tickSpacing of 3 means ticks can be initialized every 3rd tick, i.e., ..., -6, -3, 0, 3, 6, ...\\n    /// This value is an int24 to avoid casting even though it is always positive.\\n    /// @return The tick spacing\\n    function tickSpacing() external view returns (int24);\\n\\n    /// @notice The maximum amount of position liquidity that can use any tick in the range\\n    /// @dev This parameter is enforced per tick to prevent liquidity from overflowing a uint128 at any point, and\\n    /// also prevents out-of-range liquidity from being used to prevent adding in-range liquidity to a pool\\n    /// @return The max amount of liquidity per tick\\n    function maxLiquidityPerTick() external view returns (uint128);\\n}\\n\",\"keccak256\":\"0x008ef2c3e88233c2385edd9303529a96145f4e2d1f095ae1d4f858d56f314d7d\",\"license\":\"GPL-2.0-or-later\"},\"contracts/v3-core/interfaces/pool/IBitswapV3PoolOwnerActions.sol\":{\"content\":\"// SPDX-License-Identifier: GPL-2.0-or-later\\npragma solidity =0.7.6;\\n\\n/// @title Permissioned pool actions\\n/// @notice Contains pool methods that may only be called by the factory owner\\ninterface IBitswapV3PoolOwnerActions {\\n    /// @notice Set the denominator of the protocol's % share of the fees\\n    /// @param feeProtocol0 new protocol fee for token0 of the pool\\n    /// @param feeProtocol1 new protocol fee for token1 of the pool\\n    function setFeeProtocol(uint8 feeProtocol0, uint8 feeProtocol1) external;\\n\\n    /// @notice Collect the protocol fee accrued to the pool\\n    /// @param recipient The address to which collected protocol fees should be sent\\n    /// @param amount0Requested The maximum amount of token0 to send, can be 0 to collect fees in only token1\\n    /// @param amount1Requested The maximum amount of token1 to send, can be 0 to collect fees in only token0\\n    /// @return amount0 The protocol fee collected in token0\\n    /// @return amount1 The protocol fee collected in token1\\n    function collectProtocol(\\n        address recipient,\\n        uint128 amount0Requested,\\n        uint128 amount1Requested\\n    ) external returns (uint128 amount0, uint128 amount1);\\n}\\n\",\"keccak256\":\"0x02c2faba98f6e32d19243cdb788c45f04b208b5cac2415e3d8d8b07e39d14255\",\"license\":\"GPL-2.0-or-later\"},\"contracts/v3-core/interfaces/pool/IBitswapV3PoolState.sol\":{\"content\":\"// SPDX-License-Identifier: GPL-2.0-or-later\\npragma solidity =0.7.6;\\n\\n/// @title Pool state that can change\\n/// @notice These methods compose the pool's state, and can change with any frequency including multiple times\\n/// per transaction\\ninterface IBitswapV3PoolState {\\n    /// @notice The 0th storage slot in the pool stores many values, and is exposed as a single method to save gas\\n    /// when accessed externally.\\n    /// @return sqrtPriceX96 The current price of the pool as a sqrt(token1/token0) Q64.96 value\\n    /// tick The current tick of the pool, i.e. according to the last tick transition that was run.\\n    /// This value may not always be equal to SqrtTickMath.getTickAtSqrtRatio(sqrtPriceX96) if the price is on a tick\\n    /// boundary.\\n    /// observationIndex The index of the last oracle observation that was written,\\n    /// observationCardinality The current maximum number of observations stored in the pool,\\n    /// observationCardinalityNext The next maximum number of observations, to be updated when the observation.\\n    /// feeProtocol The protocol fee for both tokens of the pool.\\n    /// Encoded as two 4 bit values, where the protocol fee of token1 is shifted 4 bits and the protocol fee of token0\\n    /// is the lower 4 bits. Used as the denominator of a fraction of the swap fee, e.g. 4 means 1/4th of the swap fee.\\n    /// unlocked Whether the pool is currently locked to reentrancy\\n    function slot0()\\n        external\\n        view\\n        returns (\\n            uint160 sqrtPriceX96,\\n            int24 tick,\\n            uint16 observationIndex,\\n            uint16 observationCardinality,\\n            uint16 observationCardinalityNext,\\n            uint8 feeProtocol,\\n            bool unlocked\\n        );\\n\\n    /// @notice The fee growth as a Q128.128 fees of token0 collected per unit of liquidity for the entire life of the pool\\n    /// @dev This value can overflow the uint256\\n    function feeGrowthGlobal0X128() external view returns (uint256);\\n\\n    /// @notice The fee growth as a Q128.128 fees of token1 collected per unit of liquidity for the entire life of the pool\\n    /// @dev This value can overflow the uint256\\n    function feeGrowthGlobal1X128() external view returns (uint256);\\n\\n    /// @notice The amounts of token0 and token1 that are owed to the protocol\\n    /// @dev Protocol fees will never exceed uint128 max in either token\\n    function protocolFees() external view returns (uint128 token0, uint128 token1);\\n\\n    /// @notice The currently in range liquidity available to the pool\\n    /// @dev This value has no relationship to the total liquidity across all ticks\\n    function liquidity() external view returns (uint128);\\n\\n    /// @notice Look up information about a specific tick in the pool\\n    /// @param tick The tick to look up\\n    /// @return liquidityGross the total amount of position liquidity that uses the pool either as tick lower or\\n    /// tick upper,\\n    /// liquidityNet how much liquidity changes when the pool price crosses the tick,\\n    /// feeGrowthOutside0X128 the fee growth on the other side of the tick from the current tick in token0,\\n    /// feeGrowthOutside1X128 the fee growth on the other side of the tick from the current tick in token1,\\n    /// tickCumulativeOutside the cumulative tick value on the other side of the tick from the current tick\\n    /// secondsPerLiquidityOutsideX128 the seconds spent per liquidity on the other side of the tick from the current tick,\\n    /// secondsOutside the seconds spent on the other side of the tick from the current tick,\\n    /// initialized Set to true if the tick is initialized, i.e. liquidityGross is greater than 0, otherwise equal to false.\\n    /// Outside values can only be used if the tick is initialized, i.e. if liquidityGross is greater than 0.\\n    /// In addition, these values are only relative and must be used only in comparison to previous snapshots for\\n    /// a specific position.\\n    function ticks(int24 tick)\\n        external\\n        view\\n        returns (\\n            uint128 liquidityGross,\\n            int128 liquidityNet,\\n            uint256 feeGrowthOutside0X128,\\n            uint256 feeGrowthOutside1X128,\\n            int56 tickCumulativeOutside,\\n            uint160 secondsPerLiquidityOutsideX128,\\n            uint32 secondsOutside,\\n            bool initialized\\n        );\\n\\n    /// @notice Returns 256 packed tick initialized boolean values. See TickBitmap for more information\\n    function tickBitmap(int16 wordPosition) external view returns (uint256);\\n\\n    /// @notice Returns the information about a position by the position's key\\n    /// @param key The position's key is a hash of a preimage composed by the owner, tickLower and tickUpper\\n    /// @return _liquidity The amount of liquidity in the position,\\n    /// Returns feeGrowthInside0LastX128 fee growth of token0 inside the tick range as of the last mint/burn/poke,\\n    /// Returns feeGrowthInside1LastX128 fee growth of token1 inside the tick range as of the last mint/burn/poke,\\n    /// Returns tokensOwed0 the computed amount of token0 owed to the position as of the last mint/burn/poke,\\n    /// Returns tokensOwed1 the computed amount of token1 owed to the position as of the last mint/burn/poke\\n    function positions(bytes32 key)\\n        external\\n        view\\n        returns (\\n            uint128 _liquidity,\\n            uint256 feeGrowthInside0LastX128,\\n            uint256 feeGrowthInside1LastX128,\\n            uint128 tokensOwed0,\\n            uint128 tokensOwed1\\n        );\\n\\n    /// @notice Returns data about a specific observation index\\n    /// @param index The element of the observations array to fetch\\n    /// @dev You most likely want to use #observe() instead of this method to get an observation as of some amount of time\\n    /// ago, rather than at a specific index in the array.\\n    /// @return blockTimestamp The timestamp of the observation,\\n    /// Returns tickCumulative the tick multiplied by seconds elapsed for the life of the pool as of the observation timestamp,\\n    /// Returns secondsPerLiquidityCumulativeX128 the seconds per in range liquidity for the life of the pool as of the observation timestamp,\\n    /// Returns initialized whether the observation has been initialized and the values are safe to use\\n    function observations(uint256 index)\\n        external\\n        view\\n        returns (\\n            uint32 blockTimestamp,\\n            int56 tickCumulative,\\n            uint160 secondsPerLiquidityCumulativeX128,\\n            bool initialized\\n        );\\n}\\n\",\"keccak256\":\"0xb8b77c6be90164c6bc23f10baa3240f6b78e42525d7781e09ec1ff1dfeef8bf8\",\"license\":\"GPL-2.0-or-later\"},\"contracts/v3-core/libraries/FixedPoint128.sol\":{\"content\":\"// SPDX-License-Identifier: GPL-2.0-or-later\\npragma solidity =0.7.6;\\n\\n/// @title FixedPoint128\\n/// @notice A library for handling binary fixed point numbers, see https://en.wikipedia.org/wiki/Q_(number_format)\\nlibrary FixedPoint128 {\\n    uint256 internal constant Q128 = 0x100000000000000000000000000000000;\\n}\\n\",\"keccak256\":\"0xef4391b457c69c2c02342d1d41eb4206b966a9c76cb646936e7c020875daa4e1\",\"license\":\"GPL-2.0-or-later\"},\"contracts/v3-core/libraries/FixedPoint96.sol\":{\"content\":\"// SPDX-License-Identifier: GPL-2.0-or-later\\npragma solidity =0.7.6;\\n\\n/// @title FixedPoint96\\n/// @notice A library for handling binary fixed point numbers, see https://en.wikipedia.org/wiki/Q_(number_format)\\n/// @dev Used in SqrtPriceMath.sol\\nlibrary FixedPoint96 {\\n    uint8 internal constant RESOLUTION = 96;\\n    uint256 internal constant Q96 = 0x1000000000000000000000000;\\n}\\n\",\"keccak256\":\"0xea6ef527eb999e0f3a7aae4efb92317abaf4f80bccec45629bfac349504e5f1d\",\"license\":\"GPL-2.0-or-later\"},\"contracts/v3-core/libraries/FullMath.sol\":{\"content\":\"// SPDX-License-Identifier: GPL-2.0-or-later\\npragma solidity =0.7.6;\\n\\n/// @title Contains 512-bit math functions\\n/// @notice Facilitates multiplication and division that can have overflow of an intermediate value without any loss of precision\\n/// @dev Handles \\\"phantom overflow\\\" i.e., allows multiplication and division where an intermediate value overflows 256 bits\\nlibrary FullMath {\\n    /// @notice Calculates floor(a\\u00d7b\\u00f7denominator) with full precision. Throws if result overflows a uint256 or denominator == 0\\n    /// @param a The multiplicand\\n    /// @param b The multiplier\\n    /// @param denominator The divisor\\n    /// @return result The 256-bit result\\n    /// @dev Credit to Remco Bloemen under MIT license https://xn--2-umb.com/21/muldiv\\n    function mulDiv(\\n        uint256 a,\\n        uint256 b,\\n        uint256 denominator\\n    ) internal pure returns (uint256 result) {\\n        // 512-bit multiply [prod1 prod0] = a * b\\n        // Compute the product mod 2**256 and mod 2**256 - 1\\n        // then use the Chinese Remainder Theorem to reconstruct\\n        // the 512 bit result. The result is stored in two 256\\n        // variables such that product = prod1 * 2**256 + prod0\\n        uint256 prod0; // Least significant 256 bits of the product\\n        uint256 prod1; // Most significant 256 bits of the product\\n        assembly {\\n            let mm := mulmod(a, b, not(0))\\n            prod0 := mul(a, b)\\n            prod1 := sub(sub(mm, prod0), lt(mm, prod0))\\n        }\\n\\n        // Handle non-overflow cases, 256 by 256 division\\n        if (prod1 == 0) {\\n            require(denominator > 0);\\n            assembly {\\n                result := div(prod0, denominator)\\n            }\\n            return result;\\n        }\\n\\n        // Make sure the result is less than 2**256.\\n        // Also prevents denominator == 0\\n        require(denominator > prod1);\\n\\n        ///////////////////////////////////////////////\\n        // 512 by 256 division.\\n        ///////////////////////////////////////////////\\n\\n        // Make division exact by subtracting the remainder from [prod1 prod0]\\n        // Compute remainder using mulmod\\n        uint256 remainder;\\n        assembly {\\n            remainder := mulmod(a, b, denominator)\\n        }\\n        // Subtract 256 bit number from 512 bit number\\n        assembly {\\n            prod1 := sub(prod1, gt(remainder, prod0))\\n            prod0 := sub(prod0, remainder)\\n        }\\n\\n        // Factor powers of two out of denominator\\n        // Compute largest power of two divisor of denominator.\\n        // Always >= 1.\\n        uint256 twos = -denominator & denominator;\\n        // Divide denominator by power of two\\n        assembly {\\n            denominator := div(denominator, twos)\\n        }\\n\\n        // Divide [prod1 prod0] by the factors of two\\n        assembly {\\n            prod0 := div(prod0, twos)\\n        }\\n        // Shift in bits from prod1 into prod0. For this we need\\n        // to flip `twos` such that it is 2**256 / twos.\\n        // If twos is zero, then it becomes one\\n        assembly {\\n            twos := add(div(sub(0, twos), twos), 1)\\n        }\\n        prod0 |= prod1 * twos;\\n\\n        // Invert denominator mod 2**256\\n        // Now that denominator is an odd number, it has an inverse\\n        // modulo 2**256 such that denominator * inv = 1 mod 2**256.\\n        // Compute the inverse by starting with a seed that is correct\\n        // correct for four bits. That is, denominator * inv = 1 mod 2**4\\n        uint256 inv = (3 * denominator) ^ 2;\\n        // Now use Newton-Raphson iteration to improve the precision.\\n        // Thanks to Hensel's lifting lemma, this also works in modular\\n        // arithmetic, doubling the correct bits in each step.\\n        inv *= 2 - denominator * inv; // inverse mod 2**8\\n        inv *= 2 - denominator * inv; // inverse mod 2**16\\n        inv *= 2 - denominator * inv; // inverse mod 2**32\\n        inv *= 2 - denominator * inv; // inverse mod 2**64\\n        inv *= 2 - denominator * inv; // inverse mod 2**128\\n        inv *= 2 - denominator * inv; // inverse mod 2**256\\n\\n        // Because the division is now exact we can divide by multiplying\\n        // with the modular inverse of denominator. This will give us the\\n        // correct result modulo 2**256. Since the precoditions guarantee\\n        // that the outcome is less than 2**256, this is the final result.\\n        // We don't need to compute the high bits of the result and prod1\\n        // is no longer required.\\n        result = prod0 * inv;\\n        return result;\\n    }\\n\\n    /// @notice Calculates ceil(a\\u00d7b\\u00f7denominator) with full precision. Throws if result overflows a uint256 or denominator == 0\\n    /// @param a The multiplicand\\n    /// @param b The multiplier\\n    /// @param denominator The divisor\\n    /// @return result The 256-bit result\\n    function mulDivRoundingUp(\\n        uint256 a,\\n        uint256 b,\\n        uint256 denominator\\n    ) internal pure returns (uint256 result) {\\n        result = mulDiv(a, b, denominator);\\n        if (mulmod(a, b, denominator) > 0) {\\n            require(result < type(uint256).max);\\n            result++;\\n        }\\n    }\\n}\\n\",\"keccak256\":\"0x5ff6166785469a18d7940228ccacbd96e93784d3811c7c8de238b3e9b5f131db\",\"license\":\"GPL-2.0-or-later\"},\"contracts/v3-core/libraries/TickMath.sol\":{\"content\":\"// SPDX-License-Identifier: GPL-2.0-or-later\\npragma solidity =0.7.6;\\n\\n/// @title Math library for computing sqrt prices from ticks and vice versa\\n/// @notice Computes sqrt price for ticks of size 1.0001, i.e. sqrt(1.0001^tick) as fixed point Q64.96 numbers. Supports\\n/// prices between 2**-128 and 2**128\\nlibrary TickMath {\\n    /// @dev The minimum tick that may be passed to #getSqrtRatioAtTick computed from log base 1.0001 of 2**-128\\n    int24 internal constant MIN_TICK = -887272;\\n    /// @dev The maximum tick that may be passed to #getSqrtRatioAtTick computed from log base 1.0001 of 2**128\\n    int24 internal constant MAX_TICK = -MIN_TICK;\\n\\n    /// @dev The minimum value that can be returned from #getSqrtRatioAtTick. Equivalent to getSqrtRatioAtTick(MIN_TICK)\\n    uint160 internal constant MIN_SQRT_RATIO = 4295128739;\\n    /// @dev The maximum value that can be returned from #getSqrtRatioAtTick. Equivalent to getSqrtRatioAtTick(MAX_TICK)\\n    uint160 internal constant MAX_SQRT_RATIO = 1461446703485210103287273052203988822378723970342;\\n\\n    /// @notice Calculates sqrt(1.0001^tick) * 2^96\\n    /// @dev Throws if |tick| > max tick\\n    /// @param tick The input tick for the above formula\\n    /// @return sqrtPriceX96 A Fixed point Q64.96 number representing the sqrt of the ratio of the two assets (token1/token0)\\n    /// at the given tick\\n    function getSqrtRatioAtTick(int24 tick) internal pure returns (uint160 sqrtPriceX96) {\\n        uint256 absTick = tick < 0 ? uint256(-int256(tick)) : uint256(int256(tick));\\n        require(absTick <= uint256(MAX_TICK), 'T');\\n\\n        uint256 ratio = absTick & 0x1 != 0 ? 0xfffcb933bd6fad37aa2d162d1a594001 : 0x100000000000000000000000000000000;\\n        if (absTick & 0x2 != 0) ratio = (ratio * 0xfff97272373d413259a46990580e213a) >> 128;\\n        if (absTick & 0x4 != 0) ratio = (ratio * 0xfff2e50f5f656932ef12357cf3c7fdcc) >> 128;\\n        if (absTick & 0x8 != 0) ratio = (ratio * 0xffe5caca7e10e4e61c3624eaa0941cd0) >> 128;\\n        if (absTick & 0x10 != 0) ratio = (ratio * 0xffcb9843d60f6159c9db58835c926644) >> 128;\\n        if (absTick & 0x20 != 0) ratio = (ratio * 0xff973b41fa98c081472e6896dfb254c0) >> 128;\\n        if (absTick & 0x40 != 0) ratio = (ratio * 0xff2ea16466c96a3843ec78b326b52861) >> 128;\\n        if (absTick & 0x80 != 0) ratio = (ratio * 0xfe5dee046a99a2a811c461f1969c3053) >> 128;\\n        if (absTick & 0x100 != 0) ratio = (ratio * 0xfcbe86c7900a88aedcffc83b479aa3a4) >> 128;\\n        if (absTick & 0x200 != 0) ratio = (ratio * 0xf987a7253ac413176f2b074cf7815e54) >> 128;\\n        if (absTick & 0x400 != 0) ratio = (ratio * 0xf3392b0822b70005940c7a398e4b70f3) >> 128;\\n        if (absTick & 0x800 != 0) ratio = (ratio * 0xe7159475a2c29b7443b29c7fa6e889d9) >> 128;\\n        if (absTick & 0x1000 != 0) ratio = (ratio * 0xd097f3bdfd2022b8845ad8f792aa5825) >> 128;\\n        if (absTick & 0x2000 != 0) ratio = (ratio * 0xa9f746462d870fdf8a65dc1f90e061e5) >> 128;\\n        if (absTick & 0x4000 != 0) ratio = (ratio * 0x70d869a156d2a1b890bb3df62baf32f7) >> 128;\\n        if (absTick & 0x8000 != 0) ratio = (ratio * 0x31be135f97d08fd981231505542fcfa6) >> 128;\\n        if (absTick & 0x10000 != 0) ratio = (ratio * 0x9aa508b5b7a84e1c677de54f3e99bc9) >> 128;\\n        if (absTick & 0x20000 != 0) ratio = (ratio * 0x5d6af8dedb81196699c329225ee604) >> 128;\\n        if (absTick & 0x40000 != 0) ratio = (ratio * 0x2216e584f5fa1ea926041bedfe98) >> 128;\\n        if (absTick & 0x80000 != 0) ratio = (ratio * 0x48a170391f7dc42444e8fa2) >> 128;\\n\\n        if (tick > 0) ratio = type(uint256).max / ratio;\\n\\n        // this divides by 1<<32 rounding up to go from a Q128.128 to a Q128.96.\\n        // we then downcast because we know the result always fits within 160 bits due to our tick input constraint\\n        // we round up in the division so getTickAtSqrtRatio of the output price is always consistent\\n        sqrtPriceX96 = uint160((ratio >> 32) + (ratio % (1 << 32) == 0 ? 0 : 1));\\n    }\\n\\n    /// @notice Calculates the greatest tick value such that getRatioAtTick(tick) <= ratio\\n    /// @dev Throws in case sqrtPriceX96 < MIN_SQRT_RATIO, as MIN_SQRT_RATIO is the lowest value getRatioAtTick may\\n    /// ever return.\\n    /// @param sqrtPriceX96 The sqrt ratio for which to compute the tick as a Q64.96\\n    /// @return tick The greatest tick for which the ratio is less than or equal to the input ratio\\n    function getTickAtSqrtRatio(uint160 sqrtPriceX96) internal pure returns (int24 tick) {\\n        // second inequality must be < because the price can never reach the price at the max tick\\n        require(sqrtPriceX96 >= MIN_SQRT_RATIO && sqrtPriceX96 < MAX_SQRT_RATIO, 'R');\\n        uint256 ratio = uint256(sqrtPriceX96) << 32;\\n\\n        uint256 r = ratio;\\n        uint256 msb = 0;\\n\\n        assembly {\\n            let f := shl(7, gt(r, 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF))\\n            msb := or(msb, f)\\n            r := shr(f, r)\\n        }\\n        assembly {\\n            let f := shl(6, gt(r, 0xFFFFFFFFFFFFFFFF))\\n            msb := or(msb, f)\\n            r := shr(f, r)\\n        }\\n        assembly {\\n            let f := shl(5, gt(r, 0xFFFFFFFF))\\n            msb := or(msb, f)\\n            r := shr(f, r)\\n        }\\n        assembly {\\n            let f := shl(4, gt(r, 0xFFFF))\\n            msb := or(msb, f)\\n            r := shr(f, r)\\n        }\\n        assembly {\\n            let f := shl(3, gt(r, 0xFF))\\n            msb := or(msb, f)\\n            r := shr(f, r)\\n        }\\n        assembly {\\n            let f := shl(2, gt(r, 0xF))\\n            msb := or(msb, f)\\n            r := shr(f, r)\\n        }\\n        assembly {\\n            let f := shl(1, gt(r, 0x3))\\n            msb := or(msb, f)\\n            r := shr(f, r)\\n        }\\n        assembly {\\n            let f := gt(r, 0x1)\\n            msb := or(msb, f)\\n        }\\n\\n        if (msb >= 128) r = ratio >> (msb - 127);\\n        else r = ratio << (127 - msb);\\n\\n        int256 log_2 = (int256(msb) - 128) << 64;\\n\\n        assembly {\\n            r := shr(127, mul(r, r))\\n            let f := shr(128, r)\\n            log_2 := or(log_2, shl(63, f))\\n            r := shr(f, r)\\n        }\\n        assembly {\\n            r := shr(127, mul(r, r))\\n            let f := shr(128, r)\\n            log_2 := or(log_2, shl(62, f))\\n            r := shr(f, r)\\n        }\\n        assembly {\\n            r := shr(127, mul(r, r))\\n            let f := shr(128, r)\\n            log_2 := or(log_2, shl(61, f))\\n            r := shr(f, r)\\n        }\\n        assembly {\\n            r := shr(127, mul(r, r))\\n            let f := shr(128, r)\\n            log_2 := or(log_2, shl(60, f))\\n            r := shr(f, r)\\n        }\\n        assembly {\\n            r := shr(127, mul(r, r))\\n            let f := shr(128, r)\\n            log_2 := or(log_2, shl(59, f))\\n            r := shr(f, r)\\n        }\\n        assembly {\\n            r := shr(127, mul(r, r))\\n            let f := shr(128, r)\\n            log_2 := or(log_2, shl(58, f))\\n            r := shr(f, r)\\n        }\\n        assembly {\\n            r := shr(127, mul(r, r))\\n            let f := shr(128, r)\\n            log_2 := or(log_2, shl(57, f))\\n            r := shr(f, r)\\n        }\\n        assembly {\\n            r := shr(127, mul(r, r))\\n            let f := shr(128, r)\\n            log_2 := or(log_2, shl(56, f))\\n            r := shr(f, r)\\n        }\\n        assembly {\\n            r := shr(127, mul(r, r))\\n            let f := shr(128, r)\\n            log_2 := or(log_2, shl(55, f))\\n            r := shr(f, r)\\n        }\\n        assembly {\\n            r := shr(127, mul(r, r))\\n            let f := shr(128, r)\\n            log_2 := or(log_2, shl(54, f))\\n            r := shr(f, r)\\n        }\\n        assembly {\\n            r := shr(127, mul(r, r))\\n            let f := shr(128, r)\\n            log_2 := or(log_2, shl(53, f))\\n            r := shr(f, r)\\n        }\\n        assembly {\\n            r := shr(127, mul(r, r))\\n            let f := shr(128, r)\\n            log_2 := or(log_2, shl(52, f))\\n            r := shr(f, r)\\n        }\\n        assembly {\\n            r := shr(127, mul(r, r))\\n            let f := shr(128, r)\\n            log_2 := or(log_2, shl(51, f))\\n            r := shr(f, r)\\n        }\\n        assembly {\\n            r := shr(127, mul(r, r))\\n            let f := shr(128, r)\\n            log_2 := or(log_2, shl(50, f))\\n        }\\n\\n        int256 log_sqrt10001 = log_2 * 255738958999603826347141; // 128.128 number\\n\\n        int24 tickLow = int24((log_sqrt10001 - 3402992956809132418596140100660247210) >> 128);\\n        int24 tickHi = int24((log_sqrt10001 + 291339464771989622907027621153398088495) >> 128);\\n\\n        tick = tickLow == tickHi ? tickLow : getSqrtRatioAtTick(tickHi) <= sqrtPriceX96 ? tickHi : tickLow;\\n    }\\n}\\n\",\"keccak256\":\"0x9f1bf618dc39e750f1f6597d5d7c6ebae2cb59c5ca11d21e1d0ed0968a255590\",\"license\":\"GPL-2.0-or-later\"},\"contracts/v3-periphery/NonfungiblePositionManager.sol\":{\"content\":\"// SPDX-License-Identifier: GPL-2.0-or-later\\npragma solidity =0.7.6;\\npragma abicoder v2;\\n\\nimport '../v3-core/interfaces/IBitswapV3Pool.sol';\\nimport '../v3-core/libraries/FixedPoint128.sol';\\nimport '../v3-core/libraries/FullMath.sol';\\n\\nimport './interfaces/INonfungiblePositionManager.sol';\\nimport './interfaces/INonfungibleTokenPositionDescriptor.sol';\\nimport './libraries/PositionKey.sol';\\nimport './libraries/PoolAddress.sol';\\nimport './base/LiquidityManagement.sol';\\nimport './base/PeripheryImmutableState.sol';\\nimport './base/Multicall.sol';\\nimport './base/ERC721Permit.sol';\\nimport './base/PeripheryValidation.sol';\\nimport './base/SelfPermit.sol';\\nimport './base/PoolInitializer.sol';\\n\\n/// @title NFT positions\\n/// @notice Wraps Bitswap V3 positions in the ERC721 non-fungible token interface\\ncontract NonfungiblePositionManager is\\n    INonfungiblePositionManager,\\n    Multicall,\\n    ERC721Permit,\\n    PeripheryImmutableState,\\n    PoolInitializer,\\n    LiquidityManagement,\\n    PeripheryValidation,\\n    SelfPermit\\n{\\n    // details about the Bitswap position\\n    struct Position {\\n        // the nonce for permits\\n        uint96 nonce;\\n        // the address that is approved for spending this token\\n        address operator;\\n        // the ID of the pool with which this token is connected\\n        uint80 poolId;\\n        // the tick range of the position\\n        int24 tickLower;\\n        int24 tickUpper;\\n        // the liquidity of the position\\n        uint128 liquidity;\\n        // the fee growth of the aggregate position as of the last action on the individual position\\n        uint256 feeGrowthInside0LastX128;\\n        uint256 feeGrowthInside1LastX128;\\n        // how many uncollected tokens are owed to the position, as of the last computation\\n        uint128 tokensOwed0;\\n        uint128 tokensOwed1;\\n    }\\n\\n    /// @dev IDs of pools assigned by this contract\\n    mapping(address => uint80) private _poolIds;\\n\\n    /// @dev Pool keys by pool ID, to save on SSTOREs for position data\\n    mapping(uint80 => PoolAddress.PoolKey) private _poolIdToPoolKey;\\n\\n    /// @dev The token ID position data\\n    mapping(uint256 => Position) private _positions;\\n\\n    /// @dev The ID of the next token that will be minted. Skips 0\\n    uint176 private _nextId = 1;\\n    /// @dev The ID of the next pool that is used for the first time. Skips 0\\n    uint80 private _nextPoolId = 1;\\n\\n    /// @dev The address of the token descriptor contract, which handles generating token URIs for position tokens\\n    address private immutable _tokenDescriptor;\\n\\n    constructor(\\n        address _factory,\\n        address _WBB,\\n        address _tokenDescriptor_\\n    ) ERC721Permit('Bitswap V3 Positions NFT-V1', 'BIT-V3-POS', '1') PeripheryImmutableState(_factory, _WBB) {\\n        _tokenDescriptor = _tokenDescriptor_;\\n    }\\n\\n    /// @inheritdoc INonfungiblePositionManager\\n    function positions(uint256 tokenId)\\n        external\\n        view\\n        override\\n        returns (\\n            uint96 nonce,\\n            address operator,\\n            address token0,\\n            address token1,\\n            uint24 fee,\\n            int24 tickLower,\\n            int24 tickUpper,\\n            uint128 liquidity,\\n            uint256 feeGrowthInside0LastX128,\\n            uint256 feeGrowthInside1LastX128,\\n            uint128 tokensOwed0,\\n            uint128 tokensOwed1\\n        )\\n    {\\n        Position memory position = _positions[tokenId];\\n        require(position.poolId != 0, 'Invalid token ID');\\n        PoolAddress.PoolKey memory poolKey = _poolIdToPoolKey[position.poolId];\\n        return (\\n            position.nonce,\\n            position.operator,\\n            poolKey.token0,\\n            poolKey.token1,\\n            poolKey.fee,\\n            position.tickLower,\\n            position.tickUpper,\\n            position.liquidity,\\n            position.feeGrowthInside0LastX128,\\n            position.feeGrowthInside1LastX128,\\n            position.tokensOwed0,\\n            position.tokensOwed1\\n        );\\n    }\\n\\n    /// @dev Caches a pool key\\n    function cachePoolKey(address pool, PoolAddress.PoolKey memory poolKey) private returns (uint80 poolId) {\\n        poolId = _poolIds[pool];\\n        if (poolId == 0) {\\n            _poolIds[pool] = (poolId = _nextPoolId++);\\n            _poolIdToPoolKey[poolId] = poolKey;\\n        }\\n    }\\n\\n    /// @inheritdoc INonfungiblePositionManager\\n    function mint(MintParams calldata params)\\n        external\\n        payable\\n        override\\n        checkDeadline(params.deadline)\\n        returns (\\n            uint256 tokenId,\\n            uint128 liquidity,\\n            uint256 amount0,\\n            uint256 amount1\\n        )\\n    {\\n        IBitswapV3Pool pool;\\n        (liquidity, amount0, amount1, pool) = addLiquidity(\\n            AddLiquidityParams({\\n                token0: params.token0,\\n                token1: params.token1,\\n                fee: params.fee,\\n                recipient: address(this),\\n                tickLower: params.tickLower,\\n                tickUpper: params.tickUpper,\\n                amount0Desired: params.amount0Desired,\\n                amount1Desired: params.amount1Desired,\\n                amount0Min: params.amount0Min,\\n                amount1Min: params.amount1Min\\n            })\\n        );\\n\\n        _mint(params.recipient, (tokenId = _nextId++));\\n\\n        bytes32 positionKey = PositionKey.compute(address(this), params.tickLower, params.tickUpper);\\n        (, uint256 feeGrowthInside0LastX128, uint256 feeGrowthInside1LastX128, , ) = pool.positions(positionKey);\\n\\n        // idempotent set\\n        uint80 poolId =\\n            cachePoolKey(\\n                address(pool),\\n                PoolAddress.PoolKey({token0: params.token0, token1: params.token1, fee: params.fee})\\n            );\\n\\n        _positions[tokenId] = Position({\\n            nonce: 0,\\n            operator: address(0),\\n            poolId: poolId,\\n            tickLower: params.tickLower,\\n            tickUpper: params.tickUpper,\\n            liquidity: liquidity,\\n            feeGrowthInside0LastX128: feeGrowthInside0LastX128,\\n            feeGrowthInside1LastX128: feeGrowthInside1LastX128,\\n            tokensOwed0: 0,\\n            tokensOwed1: 0\\n        });\\n\\n        emit IncreaseLiquidity(tokenId, liquidity, amount0, amount1);\\n    }\\n\\n    modifier isAuthorizedForToken(uint256 tokenId) {\\n        require(_isApprovedOrOwner(msg.sender, tokenId), 'Not approved');\\n        _;\\n    }\\n\\n    function tokenURI(uint256 tokenId) public view override(ERC721, IERC721Metadata) returns (string memory) {\\n        require(_exists(tokenId));\\n        return INonfungibleTokenPositionDescriptor(_tokenDescriptor).tokenURI(this, tokenId);\\n    }\\n\\n    // save bytecode by removing implementation of unused method\\n    function baseURI() public pure override returns (string memory) {}\\n\\n    /// @inheritdoc INonfungiblePositionManager\\n    function increaseLiquidity(IncreaseLiquidityParams calldata params)\\n        external\\n        payable\\n        override\\n        checkDeadline(params.deadline)\\n        returns (\\n            uint128 liquidity,\\n            uint256 amount0,\\n            uint256 amount1\\n        )\\n    {\\n        Position storage position = _positions[params.tokenId];\\n\\n        PoolAddress.PoolKey memory poolKey = _poolIdToPoolKey[position.poolId];\\n\\n        IBitswapV3Pool pool;\\n        (liquidity, amount0, amount1, pool) = addLiquidity(\\n            AddLiquidityParams({\\n                token0: poolKey.token0,\\n                token1: poolKey.token1,\\n                fee: poolKey.fee,\\n                tickLower: position.tickLower,\\n                tickUpper: position.tickUpper,\\n                amount0Desired: params.amount0Desired,\\n                amount1Desired: params.amount1Desired,\\n                amount0Min: params.amount0Min,\\n                amount1Min: params.amount1Min,\\n                recipient: address(this)\\n            })\\n        );\\n\\n        bytes32 positionKey = PositionKey.compute(address(this), position.tickLower, position.tickUpper);\\n\\n        // this is now updated to the current transaction\\n        (, uint256 feeGrowthInside0LastX128, uint256 feeGrowthInside1LastX128, , ) = pool.positions(positionKey);\\n\\n        position.tokensOwed0 += uint128(\\n            FullMath.mulDiv(\\n                feeGrowthInside0LastX128 - position.feeGrowthInside0LastX128,\\n                position.liquidity,\\n                FixedPoint128.Q128\\n            )\\n        );\\n        position.tokensOwed1 += uint128(\\n            FullMath.mulDiv(\\n                feeGrowthInside1LastX128 - position.feeGrowthInside1LastX128,\\n                position.liquidity,\\n                FixedPoint128.Q128\\n            )\\n        );\\n\\n        position.feeGrowthInside0LastX128 = feeGrowthInside0LastX128;\\n        position.feeGrowthInside1LastX128 = feeGrowthInside1LastX128;\\n        position.liquidity += liquidity;\\n\\n        emit IncreaseLiquidity(params.tokenId, liquidity, amount0, amount1);\\n    }\\n\\n    /// @inheritdoc INonfungiblePositionManager\\n    function decreaseLiquidity(DecreaseLiquidityParams calldata params)\\n        external\\n        payable\\n        override\\n        isAuthorizedForToken(params.tokenId)\\n        checkDeadline(params.deadline)\\n        returns (uint256 amount0, uint256 amount1)\\n    {\\n        require(params.liquidity > 0);\\n        Position storage position = _positions[params.tokenId];\\n\\n        uint128 positionLiquidity = position.liquidity;\\n        require(positionLiquidity >= params.liquidity);\\n\\n        PoolAddress.PoolKey memory poolKey = _poolIdToPoolKey[position.poolId];\\n        IBitswapV3Pool pool = IBitswapV3Pool(PoolAddress.computeAddress(factory, poolKey));\\n        (amount0, amount1) = pool.burn(position.tickLower, position.tickUpper, params.liquidity);\\n\\n        require(amount0 >= params.amount0Min && amount1 >= params.amount1Min, 'Price slippage check');\\n\\n        bytes32 positionKey = PositionKey.compute(address(this), position.tickLower, position.tickUpper);\\n        // this is now updated to the current transaction\\n        (, uint256 feeGrowthInside0LastX128, uint256 feeGrowthInside1LastX128, , ) = pool.positions(positionKey);\\n\\n        position.tokensOwed0 +=\\n            uint128(amount0) +\\n            uint128(\\n                FullMath.mulDiv(\\n                    feeGrowthInside0LastX128 - position.feeGrowthInside0LastX128,\\n                    positionLiquidity,\\n                    FixedPoint128.Q128\\n                )\\n            );\\n        position.tokensOwed1 +=\\n            uint128(amount1) +\\n            uint128(\\n                FullMath.mulDiv(\\n                    feeGrowthInside1LastX128 - position.feeGrowthInside1LastX128,\\n                    positionLiquidity,\\n                    FixedPoint128.Q128\\n                )\\n            );\\n\\n        position.feeGrowthInside0LastX128 = feeGrowthInside0LastX128;\\n        position.feeGrowthInside1LastX128 = feeGrowthInside1LastX128;\\n        // subtraction is safe because we checked positionLiquidity is gte params.liquidity\\n        position.liquidity = positionLiquidity - params.liquidity;\\n\\n        emit DecreaseLiquidity(params.tokenId, params.liquidity, amount0, amount1);\\n    }\\n\\n    /// @inheritdoc INonfungiblePositionManager\\n    function collect(CollectParams calldata params)\\n        external\\n        payable\\n        override\\n        isAuthorizedForToken(params.tokenId)\\n        returns (uint256 amount0, uint256 amount1)\\n    {\\n        require(params.amount0Max > 0 || params.amount1Max > 0);\\n        // allow collecting to the nft position manager address with address 0\\n        address recipient = params.recipient == address(0) ? address(this) : params.recipient;\\n\\n        Position storage position = _positions[params.tokenId];\\n\\n        PoolAddress.PoolKey memory poolKey = _poolIdToPoolKey[position.poolId];\\n\\n        IBitswapV3Pool pool = IBitswapV3Pool(PoolAddress.computeAddress(factory, poolKey));\\n\\n        (uint128 tokensOwed0, uint128 tokensOwed1) = (position.tokensOwed0, position.tokensOwed1);\\n\\n        // trigger an update of the position fees owed and fee growth snapshots if it has any liquidity\\n        if (position.liquidity > 0) {\\n            pool.burn(position.tickLower, position.tickUpper, 0);\\n            (, uint256 feeGrowthInside0LastX128, uint256 feeGrowthInside1LastX128, , ) =\\n                pool.positions(PositionKey.compute(address(this), position.tickLower, position.tickUpper));\\n\\n            tokensOwed0 += uint128(\\n                FullMath.mulDiv(\\n                    feeGrowthInside0LastX128 - position.feeGrowthInside0LastX128,\\n                    position.liquidity,\\n                    FixedPoint128.Q128\\n                )\\n            );\\n            tokensOwed1 += uint128(\\n                FullMath.mulDiv(\\n                    feeGrowthInside1LastX128 - position.feeGrowthInside1LastX128,\\n                    position.liquidity,\\n                    FixedPoint128.Q128\\n                )\\n            );\\n\\n            position.feeGrowthInside0LastX128 = feeGrowthInside0LastX128;\\n            position.feeGrowthInside1LastX128 = feeGrowthInside1LastX128;\\n        }\\n\\n        // compute the arguments to give to the pool#collect method\\n        (uint128 amount0Collect, uint128 amount1Collect) =\\n            (\\n                params.amount0Max > tokensOwed0 ? tokensOwed0 : params.amount0Max,\\n                params.amount1Max > tokensOwed1 ? tokensOwed1 : params.amount1Max\\n            );\\n\\n        // the actual amounts collected are returned\\n        (amount0, amount1) = pool.collect(\\n            recipient,\\n            position.tickLower,\\n            position.tickUpper,\\n            amount0Collect,\\n            amount1Collect\\n        );\\n\\n        // sometimes there will be a few less wei than expected due to rounding down in core, but we just subtract the full amount expected\\n        // instead of the actual amount so we can burn the token\\n        (position.tokensOwed0, position.tokensOwed1) = (tokensOwed0 - amount0Collect, tokensOwed1 - amount1Collect);\\n\\n        emit Collect(params.tokenId, recipient, amount0Collect, amount1Collect);\\n    }\\n\\n    /// @inheritdoc INonfungiblePositionManager\\n    function burn(uint256 tokenId) external payable override isAuthorizedForToken(tokenId) {\\n        Position storage position = _positions[tokenId];\\n        require(position.liquidity == 0 && position.tokensOwed0 == 0 && position.tokensOwed1 == 0, 'Not cleared');\\n        delete _positions[tokenId];\\n        _burn(tokenId);\\n    }\\n\\n    function _getAndIncrementNonce(uint256 tokenId) internal override returns (uint256) {\\n        return uint256(_positions[tokenId].nonce++);\\n    }\\n\\n    /// @inheritdoc IERC721\\n    function getApproved(uint256 tokenId) public view override(ERC721, IERC721) returns (address) {\\n        require(_exists(tokenId), 'ERC721: approved query for nonexistent token');\\n\\n        return _positions[tokenId].operator;\\n    }\\n\\n    /// @dev Overrides _approve to use the operator in the position, which is packed with the position permit nonce\\n    function _approve(address to, uint256 tokenId) internal override(ERC721) {\\n        _positions[tokenId].operator = to;\\n        emit Approval(ownerOf(tokenId), to, tokenId);\\n    }\\n}\\n\",\"keccak256\":\"0x7c8394ac2fd98468baea9b99319ec6215de74c20fcc9b49c54d75b6b200395b9\",\"license\":\"GPL-2.0-or-later\"},\"contracts/v3-periphery/base/BlockTimestamp.sol\":{\"content\":\"// SPDX-License-Identifier: GPL-2.0-or-later\\npragma solidity =0.7.6;\\n\\n/// @title Function for getting block timestamp\\n/// @dev Base contract that is overridden for tests\\nabstract contract BlockTimestamp {\\n    /// @dev Method that exists purely to be overridden for tests\\n    /// @return The current block timestamp\\n    function _blockTimestamp() internal view virtual returns (uint256) {\\n        return block.timestamp;\\n    }\\n}\\n\",\"keccak256\":\"0x1aa66f71234064a0c0976f62233f2edbd69554e5ad817dc97f318bc8e11f4da6\",\"license\":\"GPL-2.0-or-later\"},\"contracts/v3-periphery/base/ERC721Permit.sol\":{\"content\":\"// SPDX-License-Identifier: GPL-2.0-or-later\\npragma solidity =0.7.6;\\n\\nimport '@openzeppelin/contracts/token/ERC721/ERC721.sol';\\nimport '@openzeppelin/contracts/utils/Address.sol';\\n\\nimport '../libraries/ChainId.sol';\\nimport '../interfaces/external/IERC1271.sol';\\nimport '../interfaces/IERC721Permit.sol';\\nimport './BlockTimestamp.sol';\\n\\n/// @title ERC721 with permit\\n/// @notice Nonfungible tokens that support an approve via signature, i.e. permit\\nabstract contract ERC721Permit is BlockTimestamp, ERC721, IERC721Permit {\\n    /// @dev Gets the current nonce for a token ID and then increments it, returning the original value\\n    function _getAndIncrementNonce(uint256 tokenId) internal virtual returns (uint256);\\n\\n    /// @dev The hash of the name used in the permit signature verification\\n    bytes32 private immutable nameHash;\\n\\n    /// @dev The hash of the version string used in the permit signature verification\\n    bytes32 private immutable versionHash;\\n\\n    /// @notice Computes the nameHash and versionHash\\n    constructor(\\n        string memory name_,\\n        string memory symbol_,\\n        string memory version_\\n    ) ERC721(name_, symbol_) {\\n        nameHash = keccak256(bytes(name_));\\n        versionHash = keccak256(bytes(version_));\\n    }\\n\\n    /// @inheritdoc IERC721Permit\\n    function DOMAIN_SEPARATOR() public view override returns (bytes32) {\\n        return\\n            keccak256(\\n                abi.encode(\\n                    // keccak256('EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)')\\n                    0x8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f,\\n                    nameHash,\\n                    versionHash,\\n                    ChainId.get(),\\n                    address(this)\\n                )\\n            );\\n    }\\n\\n    /// @inheritdoc IERC721Permit\\n    /// @dev Value is equal to keccak256(\\\"Permit(address spender,uint256 tokenId,uint256 nonce,uint256 deadline)\\\");\\n    bytes32 public constant override PERMIT_TYPEHASH =\\n        0x49ecf333e5b8c95c40fdafc95c1ad136e8914a8fb55e9dc8bb01eaa83a2df9ad;\\n\\n    /// @inheritdoc IERC721Permit\\n    function permit(\\n        address spender,\\n        uint256 tokenId,\\n        uint256 deadline,\\n        uint8 v,\\n        bytes32 r,\\n        bytes32 s\\n    ) external payable override {\\n        require(_blockTimestamp() <= deadline, 'Permit expired');\\n\\n        bytes32 digest =\\n            keccak256(\\n                abi.encodePacked(\\n                    '\\\\x19\\\\x01',\\n                    DOMAIN_SEPARATOR(),\\n                    keccak256(abi.encode(PERMIT_TYPEHASH, spender, tokenId, _getAndIncrementNonce(tokenId), deadline))\\n                )\\n            );\\n        address owner = ownerOf(tokenId);\\n        require(spender != owner, 'ERC721Permit: approval to current owner');\\n\\n        if (Address.isContract(owner)) {\\n            require(IERC1271(owner).isValidSignature(digest, abi.encodePacked(r, s, v)) == 0x1626ba7e, 'Unauthorized');\\n        } else {\\n            address recoveredAddress = ecrecover(digest, v, r, s);\\n            require(recoveredAddress != address(0), 'Invalid signature');\\n            require(recoveredAddress == owner, 'Unauthorized');\\n        }\\n\\n        _approve(spender, tokenId);\\n    }\\n}\\n\",\"keccak256\":\"0x3b46b7ecd64d4ad4132145c2d162adc023ebb3d8364b35136d23d7d2405fe80b\",\"license\":\"GPL-2.0-or-later\"},\"contracts/v3-periphery/base/LiquidityManagement.sol\":{\"content\":\"// SPDX-License-Identifier: GPL-2.0-or-later\\npragma solidity =0.7.6;\\npragma abicoder v2;\\n\\nimport '../../v3-core/interfaces/IBitswapV3Factory.sol';\\nimport '../../v3-core/interfaces/callback/IBitswapV3MintCallback.sol';\\nimport '../../v3-core/libraries/TickMath.sol';\\n\\nimport '../libraries/PoolAddress.sol';\\nimport '../libraries/CallbackValidation.sol';\\nimport '../libraries/LiquidityAmounts.sol';\\n\\nimport './PeripheryPayments.sol';\\nimport './PeripheryImmutableState.sol';\\n\\n/// @title Liquidity management functions\\n/// @notice Internal functions for safely managing liquidity in Bitswap V3\\nabstract contract LiquidityManagement is IBitswapV3MintCallback, PeripheryImmutableState, PeripheryPayments {\\n    struct MintCallbackData {\\n        PoolAddress.PoolKey poolKey;\\n        address payer;\\n    }\\n\\n    /// @inheritdoc IBitswapV3MintCallback\\n    function bitswapV3MintCallback(\\n        uint256 amount0Owed,\\n        uint256 amount1Owed,\\n        bytes calldata data\\n    ) external override {\\n        MintCallbackData memory decoded = abi.decode(data, (MintCallbackData));\\n        CallbackValidation.verifyCallback(factory, decoded.poolKey);\\n\\n        if (amount0Owed > 0) pay(decoded.poolKey.token0, decoded.payer, msg.sender, amount0Owed);\\n        if (amount1Owed > 0) pay(decoded.poolKey.token1, decoded.payer, msg.sender, amount1Owed);\\n    }\\n\\n    struct AddLiquidityParams {\\n        address token0;\\n        address token1;\\n        uint24 fee;\\n        address recipient;\\n        int24 tickLower;\\n        int24 tickUpper;\\n        uint256 amount0Desired;\\n        uint256 amount1Desired;\\n        uint256 amount0Min;\\n        uint256 amount1Min;\\n    }\\n\\n    /// @notice Add liquidity to an initialized pool\\n    function addLiquidity(AddLiquidityParams memory params)\\n        internal\\n        returns (\\n            uint128 liquidity,\\n            uint256 amount0,\\n            uint256 amount1,\\n            IBitswapV3Pool pool\\n        )\\n    {\\n        PoolAddress.PoolKey memory poolKey =\\n            PoolAddress.PoolKey({token0: params.token0, token1: params.token1, fee: params.fee});\\n\\n        pool = IBitswapV3Pool(PoolAddress.computeAddress(factory, poolKey));\\n\\n        // compute the liquidity amount\\n        {\\n            (uint160 sqrtPriceX96, , , , , , ) = pool.slot0();\\n            uint160 sqrtRatioAX96 = TickMath.getSqrtRatioAtTick(params.tickLower);\\n            uint160 sqrtRatioBX96 = TickMath.getSqrtRatioAtTick(params.tickUpper);\\n\\n            liquidity = LiquidityAmounts.getLiquidityForAmounts(\\n                sqrtPriceX96,\\n                sqrtRatioAX96,\\n                sqrtRatioBX96,\\n                params.amount0Desired,\\n                params.amount1Desired\\n            );\\n        }\\n\\n        (amount0, amount1) = pool.mint(\\n            params.recipient,\\n            params.tickLower,\\n            params.tickUpper,\\n            liquidity,\\n            abi.encode(MintCallbackData({poolKey: poolKey, payer: msg.sender}))\\n        );\\n\\n        require(amount0 >= params.amount0Min && amount1 >= params.amount1Min, 'Price slippage check');\\n    }\\n}\\n\",\"keccak256\":\"0x233fb166fc34caa07560097883fa6d97ad9adc31642324d6c77b685a3f2ddaaa\",\"license\":\"GPL-2.0-or-later\"},\"contracts/v3-periphery/base/Multicall.sol\":{\"content\":\"// SPDX-License-Identifier: GPL-2.0-or-later\\npragma solidity =0.7.6;\\npragma abicoder v2;\\n\\nimport '../interfaces/IMulticall.sol';\\n\\n/// @title Multicall\\n/// @notice Enables calling multiple methods in a single call to the contract\\nabstract contract Multicall is IMulticall {\\n    /// @inheritdoc IMulticall\\n    function multicall(bytes[] calldata data) public payable override returns (bytes[] memory results) {\\n        results = new bytes[](data.length);\\n        for (uint256 i = 0; i < data.length; i++) {\\n            (bool success, bytes memory result) = address(this).delegatecall(data[i]);\\n\\n            if (!success) {\\n                // Next 5 lines from https://ethereum.stackexchange.com/a/83577\\n                if (result.length < 68) revert();\\n                assembly {\\n                    result := add(result, 0x04)\\n                }\\n                revert(abi.decode(result, (string)));\\n            }\\n\\n            results[i] = result;\\n        }\\n    }\\n}\\n\",\"keccak256\":\"0xfcfd78c62d2145634a791d5680a1af7055fbd301c415d29c09333c99c37d9037\",\"license\":\"GPL-2.0-or-later\"},\"contracts/v3-periphery/base/PeripheryImmutableState.sol\":{\"content\":\"// SPDX-License-Identifier: GPL-2.0-or-later\\npragma solidity =0.7.6;\\n\\nimport '../interfaces/IPeripheryImmutableState.sol';\\n\\n/// @title Immutable state\\n/// @notice Immutable state used by periphery contracts\\nabstract contract PeripheryImmutableState is IPeripheryImmutableState {\\n    /// @inheritdoc IPeripheryImmutableState\\n    address public immutable override factory;\\n    /// @inheritdoc IPeripheryImmutableState\\n    address public immutable override WBB;\\n\\n    constructor(address _factory, address _WBB) {\\n        factory = _factory;\\n        WBB = _WBB;\\n    }\\n}\\n\",\"keccak256\":\"0xb80a9e2050af4654a6bac18f38cdf0facc87cac32cd3a46117756a735eef1a69\",\"license\":\"GPL-2.0-or-later\"},\"contracts/v3-periphery/base/PeripheryPayments.sol\":{\"content\":\"// SPDX-License-Identifier: GPL-2.0-or-later\\npragma solidity >=0.7.5;\\n\\nimport '@openzeppelin/contracts/token/ERC20/IERC20.sol';\\n\\nimport '../interfaces/IPeripheryPayments.sol';\\nimport '../interfaces/external/IWBB.sol';\\n\\nimport '../libraries/TransferHelper.sol';\\n\\nimport './PeripheryImmutableState.sol';\\n\\nabstract contract PeripheryPayments is IPeripheryPayments, PeripheryImmutableState {\\n    receive() external payable {\\n        require(msg.sender == WBB, 'Not WBB');\\n    }\\n\\n    /// @inheritdoc IPeripheryPayments\\n    function unwrapWBB(uint256 amountMinimum, address recipient) public payable override {\\n        uint256 balanceWBB = IWBB(WBB).balanceOf(address(this));\\n        require(balanceWBB >= amountMinimum, 'Insufficient WBB');\\n\\n        if (balanceWBB > 0) {\\n            IWBB(WBB).withdraw(balanceWBB);\\n            TransferHelper.safeTransferETH(recipient, balanceWBB);\\n        }\\n    }\\n\\n    /// @inheritdoc IPeripheryPayments\\n    function sweepToken(\\n        address token,\\n        uint256 amountMinimum,\\n        address recipient\\n    ) public payable override {\\n        uint256 balanceToken = IERC20(token).balanceOf(address(this));\\n        require(balanceToken >= amountMinimum, 'Insufficient token');\\n\\n        if (balanceToken > 0) {\\n            TransferHelper.safeTransfer(token, recipient, balanceToken);\\n        }\\n    }\\n\\n    /// @inheritdoc IPeripheryPayments\\n    function refundETH() external payable override {\\n        if (address(this).balance > 0) TransferHelper.safeTransferETH(msg.sender, address(this).balance);\\n    }\\n\\n    /// @param token The token to pay\\n    /// @param payer The entity that must pay\\n    /// @param recipient The entity that will receive payment\\n    /// @param value The amount to pay\\n    function pay(\\n        address token,\\n        address payer,\\n        address recipient,\\n        uint256 value\\n    ) internal {\\n        if (token == WBB && address(this).balance >= value) {\\n            // pay with WBB\\n            IWBB(WBB).deposit{value: value}(); // wrap only what is needed to pay\\n            IWBB(WBB).transfer(recipient, value);\\n        } else if (payer == address(this)) {\\n            // pay with tokens already in the contract (for the exact input multihop case)\\n            TransferHelper.safeTransfer(token, recipient, value);\\n        } else {\\n            // pull payment\\n            TransferHelper.safeTransferFrom(token, payer, recipient, value);\\n        }\\n    }\\n}\\n\",\"keccak256\":\"0xb4960a95945148b9b508fcaeee4ea84f3ba8ed0d10a2b085e838330115ac6179\",\"license\":\"GPL-2.0-or-later\"},\"contracts/v3-periphery/base/PeripheryValidation.sol\":{\"content\":\"// SPDX-License-Identifier: GPL-2.0-or-later\\npragma solidity =0.7.6;\\n\\nimport './BlockTimestamp.sol';\\n\\nabstract contract PeripheryValidation is BlockTimestamp {\\n    modifier checkDeadline(uint256 deadline) {\\n        require(_blockTimestamp() <= deadline, 'Transaction too old');\\n        _;\\n    }\\n}\\n\",\"keccak256\":\"0xc736bab599912d6212e8414ee4ba7af0c1e08ff6aa11caa85f5f6e07f7d421c3\",\"license\":\"GPL-2.0-or-later\"},\"contracts/v3-periphery/base/PoolInitializer.sol\":{\"content\":\"// SPDX-License-Identifier: GPL-2.0-or-later\\npragma solidity =0.7.6;\\n\\nimport '../../v3-core/interfaces/IBitswapV3Factory.sol';\\nimport '../../v3-core/interfaces/IBitswapV3Pool.sol';\\n\\nimport './PeripheryImmutableState.sol';\\nimport '../interfaces/IPoolInitializer.sol';\\n\\n/// @title Creates and initializes V3 Pools\\nabstract contract PoolInitializer is IPoolInitializer, PeripheryImmutableState {\\n    /// @inheritdoc IPoolInitializer\\n    function createAndInitializePoolIfNecessary(\\n        address token0,\\n        address token1,\\n        uint24 fee,\\n        uint160 sqrtPriceX96\\n    ) external payable override returns (address pool) {\\n        require(token0 < token1);\\n        pool = IBitswapV3Factory(factory).getPool(token0, token1, fee);\\n\\n        if (pool == address(0)) {\\n            pool = IBitswapV3Factory(factory).createPool(token0, token1, fee);\\n            IBitswapV3Pool(pool).initialize(sqrtPriceX96);\\n        } else {\\n            (uint160 sqrtPriceX96Existing, , , , , , ) = IBitswapV3Pool(pool).slot0();\\n            if (sqrtPriceX96Existing == 0) {\\n                IBitswapV3Pool(pool).initialize(sqrtPriceX96);\\n            }\\n        }\\n    }\\n}\\n\",\"keccak256\":\"0xdf5a0b8e679e31504d7060e9398d9caa730ef7f5bb9630a57df8e821108cc96c\",\"license\":\"GPL-2.0-or-later\"},\"contracts/v3-periphery/base/SelfPermit.sol\":{\"content\":\"// SPDX-License-Identifier: GPL-2.0-or-later\\npragma solidity >=0.5.0;\\n\\nimport '@openzeppelin/contracts/token/ERC20/IERC20.sol';\\nimport '@openzeppelin/contracts/drafts/IERC20Permit.sol';\\n\\nimport '../interfaces/ISelfPermit.sol';\\nimport '../interfaces/external/IERC20PermitAllowed.sol';\\n\\n/// @title Self Permit\\n/// @notice Functionality to call permit on any EIP-2612-compliant token for use in the route\\n/// @dev These functions are expected to be embedded in multicalls to allow EOAs to approve a contract and call a function\\n/// that requires an approval in a single transaction.\\nabstract contract SelfPermit is ISelfPermit {\\n    /// @inheritdoc ISelfPermit\\n    function selfPermit(\\n        address token,\\n        uint256 value,\\n        uint256 deadline,\\n        uint8 v,\\n        bytes32 r,\\n        bytes32 s\\n    ) public payable override {\\n        IERC20Permit(token).permit(msg.sender, address(this), value, deadline, v, r, s);\\n    }\\n\\n    /// @inheritdoc ISelfPermit\\n    function selfPermitIfNecessary(\\n        address token,\\n        uint256 value,\\n        uint256 deadline,\\n        uint8 v,\\n        bytes32 r,\\n        bytes32 s\\n    ) external payable override {\\n        if (IERC20(token).allowance(msg.sender, address(this)) < value) selfPermit(token, value, deadline, v, r, s);\\n    }\\n\\n    /// @inheritdoc ISelfPermit\\n    function selfPermitAllowed(\\n        address token,\\n        uint256 nonce,\\n        uint256 expiry,\\n        uint8 v,\\n        bytes32 r,\\n        bytes32 s\\n    ) public payable override {\\n        IERC20PermitAllowed(token).permit(msg.sender, address(this), nonce, expiry, true, v, r, s);\\n    }\\n\\n    /// @inheritdoc ISelfPermit\\n    function selfPermitAllowedIfNecessary(\\n        address token,\\n        uint256 nonce,\\n        uint256 expiry,\\n        uint8 v,\\n        bytes32 r,\\n        bytes32 s\\n    ) external payable override {\\n        if (IERC20(token).allowance(msg.sender, address(this)) < type(uint256).max)\\n            selfPermitAllowed(token, nonce, expiry, v, r, s);\\n    }\\n}\\n\",\"keccak256\":\"0xe75aedfc1eff6c84adac82b2bc41d197127a74530f0c344a7a122a6c8ec186be\",\"license\":\"GPL-2.0-or-later\"},\"contracts/v3-periphery/interfaces/IERC721Permit.sol\":{\"content\":\"// SPDX-License-Identifier: GPL-2.0-or-later\\npragma solidity =0.7.6;\\n\\nimport '@openzeppelin/contracts/token/ERC721/IERC721.sol';\\n\\n/// @title ERC721 with permit\\n/// @notice Extension to ERC721 that includes a permit function for signature based approvals\\ninterface IERC721Permit is IERC721 {\\n    /// @notice The permit typehash used in the permit signature\\n    /// @return The typehash for the permit\\n    function PERMIT_TYPEHASH() external pure returns (bytes32);\\n\\n    /// @notice The domain separator used in the permit signature\\n    /// @return The domain seperator used in encoding of permit signature\\n    function DOMAIN_SEPARATOR() external view returns (bytes32);\\n\\n    /// @notice Approve of a specific token ID for spending by spender via signature\\n    /// @param spender The account that is being approved\\n    /// @param tokenId The ID of the token that is being approved for spending\\n    /// @param deadline The deadline timestamp by which the call must be mined for the approve to work\\n    /// @param v Must produce valid secp256k1 signature from the holder along with `r` and `s`\\n    /// @param r Must produce valid secp256k1 signature from the holder along with `v` and `s`\\n    /// @param s Must produce valid secp256k1 signature from the holder along with `r` and `v`\\n    function permit(\\n        address spender,\\n        uint256 tokenId,\\n        uint256 deadline,\\n        uint8 v,\\n        bytes32 r,\\n        bytes32 s\\n    ) external payable;\\n}\\n\",\"keccak256\":\"0x58514401e909591dae62f3776975762dcde482dccb7689c48837dbc8864d300e\",\"license\":\"GPL-2.0-or-later\"},\"contracts/v3-periphery/interfaces/IMulticall.sol\":{\"content\":\"// SPDX-License-Identifier: GPL-2.0-or-later\\npragma solidity =0.7.6;\\npragma abicoder v2;\\n\\n/// @title Multicall interface\\n/// @notice Enables calling multiple methods in a single call to the contract\\ninterface IMulticall {\\n    /// @notice Call multiple functions in the current contract and return the data from all of them if they all succeed\\n    /// @dev The `msg.value` should not be trusted for any method callable from multicall.\\n    /// @param data The encoded function data for each of the calls to make to this contract\\n    /// @return results The results from each of the calls passed in via data\\n    function multicall(bytes[] calldata data) external payable returns (bytes[] memory results);\\n}\\n\",\"keccak256\":\"0xa61610209966cca6f776a6e8b5cae32a6ce4b1e88539848fae4985aba08cb0d7\",\"license\":\"GPL-2.0-or-later\"},\"contracts/v3-periphery/interfaces/INonfungiblePositionManager.sol\":{\"content\":\"// SPDX-License-Identifier: GPL-2.0-or-later\\npragma solidity =0.7.6;\\npragma abicoder v2;\\n\\nimport '@openzeppelin/contracts/token/ERC721/IERC721Metadata.sol';\\nimport '@openzeppelin/contracts/token/ERC721/IERC721Enumerable.sol';\\n\\nimport './IPoolInitializer.sol';\\nimport './IERC721Permit.sol';\\nimport './IPeripheryPayments.sol';\\nimport './IPeripheryImmutableState.sol';\\nimport '../libraries/PoolAddress.sol';\\n\\n/// @title Non-fungible token for positions\\n/// @notice Wraps Bitswap V3 positions in a non-fungible token interface which allows for them to be transferred\\n/// and authorized.\\ninterface INonfungiblePositionManager is\\n    IPoolInitializer,\\n    IPeripheryPayments,\\n    IPeripheryImmutableState,\\n    IERC721Metadata,\\n    IERC721Enumerable,\\n    IERC721Permit\\n{\\n    /// @notice Emitted when liquidity is increased for a position NFT\\n    /// @dev Also emitted when a token is minted\\n    /// @param tokenId The ID of the token for which liquidity was increased\\n    /// @param liquidity The amount by which liquidity for the NFT position was increased\\n    /// @param amount0 The amount of token0 that was paid for the increase in liquidity\\n    /// @param amount1 The amount of token1 that was paid for the increase in liquidity\\n    event IncreaseLiquidity(uint256 indexed tokenId, uint128 liquidity, uint256 amount0, uint256 amount1);\\n    /// @notice Emitted when liquidity is decreased for a position NFT\\n    /// @param tokenId The ID of the token for which liquidity was decreased\\n    /// @param liquidity The amount by which liquidity for the NFT position was decreased\\n    /// @param amount0 The amount of token0 that was accounted for the decrease in liquidity\\n    /// @param amount1 The amount of token1 that was accounted for the decrease in liquidity\\n    event DecreaseLiquidity(uint256 indexed tokenId, uint128 liquidity, uint256 amount0, uint256 amount1);\\n    /// @notice Emitted when tokens are collected for a position NFT\\n    /// @dev The amounts reported may not be exactly equivalent to the amounts transferred, due to rounding behavior\\n    /// @param tokenId The ID of the token for which underlying tokens were collected\\n    /// @param recipient The address of the account that received the collected tokens\\n    /// @param amount0 The amount of token0 owed to the position that was collected\\n    /// @param amount1 The amount of token1 owed to the position that was collected\\n    event Collect(uint256 indexed tokenId, address recipient, uint256 amount0, uint256 amount1);\\n\\n    /// @notice Returns the position information associated with a given token ID.\\n    /// @dev Throws if the token ID is not valid.\\n    /// @param tokenId The ID of the token that represents the position\\n    /// @return nonce The nonce for permits\\n    /// @return operator The address that is approved for spending\\n    /// @return token0 The address of the token0 for a specific pool\\n    /// @return token1 The address of the token1 for a specific pool\\n    /// @return fee The fee associated with the pool\\n    /// @return tickLower The lower end of the tick range for the position\\n    /// @return tickUpper The higher end of the tick range for the position\\n    /// @return liquidity The liquidity of the position\\n    /// @return feeGrowthInside0LastX128 The fee growth of token0 as of the last action on the individual position\\n    /// @return feeGrowthInside1LastX128 The fee growth of token1 as of the last action on the individual position\\n    /// @return tokensOwed0 The uncollected amount of token0 owed to the position as of the last computation\\n    /// @return tokensOwed1 The uncollected amount of token1 owed to the position as of the last computation\\n    function positions(uint256 tokenId)\\n        external\\n        view\\n        returns (\\n            uint96 nonce,\\n            address operator,\\n            address token0,\\n            address token1,\\n            uint24 fee,\\n            int24 tickLower,\\n            int24 tickUpper,\\n            uint128 liquidity,\\n            uint256 feeGrowthInside0LastX128,\\n            uint256 feeGrowthInside1LastX128,\\n            uint128 tokensOwed0,\\n            uint128 tokensOwed1\\n        );\\n\\n    struct MintParams {\\n        address token0;\\n        address token1;\\n        uint24 fee;\\n        int24 tickLower;\\n        int24 tickUpper;\\n        uint256 amount0Desired;\\n        uint256 amount1Desired;\\n        uint256 amount0Min;\\n        uint256 amount1Min;\\n        address recipient;\\n        uint256 deadline;\\n    }\\n\\n    /// @notice Creates a new position wrapped in a NFT\\n    /// @dev Call this when the pool does exist and is initialized. Note that if the pool is created but not initialized\\n    /// a method does not exist, i.e. the pool is assumed to be initialized.\\n    /// @param params The params necessary to mint a position, encoded as `MintParams` in calldata\\n    /// @return tokenId The ID of the token that represents the minted position\\n    /// @return liquidity The amount of liquidity for this position\\n    /// @return amount0 The amount of token0\\n    /// @return amount1 The amount of token1\\n    function mint(MintParams calldata params)\\n        external\\n        payable\\n        returns (\\n            uint256 tokenId,\\n            uint128 liquidity,\\n            uint256 amount0,\\n            uint256 amount1\\n        );\\n\\n    struct IncreaseLiquidityParams {\\n        uint256 tokenId;\\n        uint256 amount0Desired;\\n        uint256 amount1Desired;\\n        uint256 amount0Min;\\n        uint256 amount1Min;\\n        uint256 deadline;\\n    }\\n\\n    /// @notice Increases the amount of liquidity in a position, with tokens paid by the `msg.sender`\\n    /// @param params tokenId The ID of the token for which liquidity is being increased,\\n    /// amount0Desired The desired amount of token0 to be spent,\\n    /// amount1Desired The desired amount of token1 to be spent,\\n    /// amount0Min The minimum amount of token0 to spend, which serves as a slippage check,\\n    /// amount1Min The minimum amount of token1 to spend, which serves as a slippage check,\\n    /// deadline The time by which the transaction must be included to effect the change\\n    /// @return liquidity The new liquidity amount as a result of the increase\\n    /// @return amount0 The amount of token0 to acheive resulting liquidity\\n    /// @return amount1 The amount of token1 to acheive resulting liquidity\\n    function increaseLiquidity(IncreaseLiquidityParams calldata params)\\n        external\\n        payable\\n        returns (\\n            uint128 liquidity,\\n            uint256 amount0,\\n            uint256 amount1\\n        );\\n\\n    struct DecreaseLiquidityParams {\\n        uint256 tokenId;\\n        uint128 liquidity;\\n        uint256 amount0Min;\\n        uint256 amount1Min;\\n        uint256 deadline;\\n    }\\n\\n    /// @notice Decreases the amount of liquidity in a position and accounts it to the position\\n    /// @param params tokenId The ID of the token for which liquidity is being decreased,\\n    /// amount The amount by which liquidity will be decreased,\\n    /// amount0Min The minimum amount of token0 that should be accounted for the burned liquidity,\\n    /// amount1Min The minimum amount of token1 that should be accounted for the burned liquidity,\\n    /// deadline The time by which the transaction must be included to effect the change\\n    /// @return amount0 The amount of token0 accounted to the position's tokens owed\\n    /// @return amount1 The amount of token1 accounted to the position's tokens owed\\n    function decreaseLiquidity(DecreaseLiquidityParams calldata params)\\n        external\\n        payable\\n        returns (uint256 amount0, uint256 amount1);\\n\\n    struct CollectParams {\\n        uint256 tokenId;\\n        address recipient;\\n        uint128 amount0Max;\\n        uint128 amount1Max;\\n    }\\n\\n    /// @notice Collects up to a maximum amount of fees owed to a specific position to the recipient\\n    /// @param params tokenId The ID of the NFT for which tokens are being collected,\\n    /// recipient The account that should receive the tokens,\\n    /// amount0Max The maximum amount of token0 to collect,\\n    /// amount1Max The maximum amount of token1 to collect\\n    /// @return amount0 The amount of fees collected in token0\\n    /// @return amount1 The amount of fees collected in token1\\n    function collect(CollectParams calldata params) external payable returns (uint256 amount0, uint256 amount1);\\n\\n    /// @notice Burns a token ID, which deletes it from the NFT contract. The token must have 0 liquidity and all tokens\\n    /// must be collected first.\\n    /// @param tokenId The ID of the token that is being burned\\n    function burn(uint256 tokenId) external payable;\\n}\\n\",\"keccak256\":\"0xc942b69e6821f0bedcaddae6f151e42342bb0f1603969ce67d3ea8eb62f908aa\",\"license\":\"GPL-2.0-or-later\"},\"contracts/v3-periphery/interfaces/INonfungibleTokenPositionDescriptor.sol\":{\"content\":\"// SPDX-License-Identifier: GPL-2.0-or-later\\npragma solidity =0.7.6;\\n\\nimport './INonfungiblePositionManager.sol';\\n\\n/// @title Describes position NFT tokens via URI\\ninterface INonfungibleTokenPositionDescriptor {\\n    /// @notice Produces the URI describing a particular token ID for a position manager\\n    /// @dev Note this URI may be a data: URI with the JSON contents directly inlined\\n    /// @param positionManager The position manager for which to describe the token\\n    /// @param tokenId The ID of the token for which to produce a description, which may not be valid\\n    /// @return The URI of the ERC721-compliant metadata\\n    function tokenURI(INonfungiblePositionManager positionManager, uint256 tokenId)\\n        external\\n        view\\n        returns (string memory);\\n}\\n\",\"keccak256\":\"0x85b21626b3027544acea1730ed83997b91a6f1de476e54ae5e3ab547fcafd4d3\",\"license\":\"GPL-2.0-or-later\"},\"contracts/v3-periphery/interfaces/IPeripheryImmutableState.sol\":{\"content\":\"// SPDX-License-Identifier: GPL-2.0-or-later\\npragma solidity =0.7.6;\\n\\n/// @title Immutable state\\n/// @notice Functions that return immutable state of the router\\ninterface IPeripheryImmutableState {\\n    /// @return Returns the address of the Bitswap V3 factory\\n    function factory() external view returns (address);\\n\\n    /// @return Returns the address of WBB\\n    function WBB() external view returns (address);\\n}\\n\",\"keccak256\":\"0x0a82210a9a2a486f7746a1aa2c34d4a6872be2b3624dbb259252844cbda17004\",\"license\":\"GPL-2.0-or-later\"},\"contracts/v3-periphery/interfaces/IPeripheryPayments.sol\":{\"content\":\"// SPDX-License-Identifier: GPL-2.0-or-later\\npragma solidity =0.7.6;\\n\\n/// @title Periphery Payments\\n/// @notice Functions to ease deposits and withdrawals of ETH\\ninterface IPeripheryPayments {\\n    /// @notice Unwraps the contract's WBB balance and sends it to recipient as ETH.\\n    /// @dev The amountMinimum parameter prevents malicious contracts from stealing WBB from users.\\n    /// @param amountMinimum The minimum amount of WBB to unwrap\\n    /// @param recipient The address receiving ETH\\n    function unwrapWBB(uint256 amountMinimum, address recipient) external payable;\\n\\n    /// @notice Refunds any ETH balance held by this contract to the `msg.sender`\\n    /// @dev Useful for bundling with mint or increase liquidity that uses ether, or exact output swaps\\n    /// that use ether for the input amount\\n    function refundETH() external payable;\\n\\n    /// @notice Transfers the full amount of a token held by this contract to recipient\\n    /// @dev The amountMinimum parameter prevents malicious contracts from stealing the token from users\\n    /// @param token The contract address of the token which will be transferred to `recipient`\\n    /// @param amountMinimum The minimum amount of token required for a transfer\\n    /// @param recipient The destination address of the token\\n    function sweepToken(\\n        address token,\\n        uint256 amountMinimum,\\n        address recipient\\n    ) external payable;\\n}\\n\",\"keccak256\":\"0x635ccb1fc13b409d28a308660a74f52376b79027b6dcd93d03421b57a0561e19\",\"license\":\"GPL-2.0-or-later\"},\"contracts/v3-periphery/interfaces/IPoolInitializer.sol\":{\"content\":\"// SPDX-License-Identifier: GPL-2.0-or-later\\npragma solidity =0.7.6;\\npragma abicoder v2;\\n\\n/// @title Creates and initializes V3 Pools\\n/// @notice Provides a method for creating and initializing a pool, if necessary, for bundling with other methods that\\n/// require the pool to exist.\\ninterface IPoolInitializer {\\n    /// @notice Creates a new pool if it does not exist, then initializes if not initialized\\n    /// @dev This method can be bundled with others via IMulticall for the first action (e.g. mint) performed against a pool\\n    /// @param token0 The contract address of token0 of the pool\\n    /// @param token1 The contract address of token1 of the pool\\n    /// @param fee The fee amount of the v3 pool for the specified token pair\\n    /// @param sqrtPriceX96 The initial square root price of the pool as a Q64.96 value\\n    /// @return pool Returns the pool address based on the pair of tokens and fee, will return the newly created pool address if necessary\\n    function createAndInitializePoolIfNecessary(\\n        address token0,\\n        address token1,\\n        uint24 fee,\\n        uint160 sqrtPriceX96\\n    ) external payable returns (address pool);\\n}\\n\",\"keccak256\":\"0x3fc891298d0e7b242faabb92a6dab76fab1c2a81d8282a0bc2cd08f2770ef627\",\"license\":\"GPL-2.0-or-later\"},\"contracts/v3-periphery/interfaces/ISelfPermit.sol\":{\"content\":\"// SPDX-License-Identifier: GPL-2.0-or-later\\npragma solidity =0.7.6;\\n\\n/// @title Self Permit\\n/// @notice Functionality to call permit on any EIP-2612-compliant token for use in the route\\ninterface ISelfPermit {\\n    /// @notice Permits this contract to spend a given token from `msg.sender`\\n    /// @dev The `owner` is always msg.sender and the `spender` is always address(this).\\n    /// @param token The address of the token spent\\n    /// @param value The amount that can be spent of token\\n    /// @param deadline A timestamp, the current blocktime must be less than or equal to this timestamp\\n    /// @param v Must produce valid secp256k1 signature from the holder along with `r` and `s`\\n    /// @param r Must produce valid secp256k1 signature from the holder along with `v` and `s`\\n    /// @param s Must produce valid secp256k1 signature from the holder along with `r` and `v`\\n    function selfPermit(\\n        address token,\\n        uint256 value,\\n        uint256 deadline,\\n        uint8 v,\\n        bytes32 r,\\n        bytes32 s\\n    ) external payable;\\n\\n    /// @notice Permits this contract to spend a given token from `msg.sender`\\n    /// @dev The `owner` is always msg.sender and the `spender` is always address(this).\\n    /// Can be used instead of #selfPermit to prevent calls from failing due to a frontrun of a call to #selfPermit\\n    /// @param token The address of the token spent\\n    /// @param value The amount that can be spent of token\\n    /// @param deadline A timestamp, the current blocktime must be less than or equal to this timestamp\\n    /// @param v Must produce valid secp256k1 signature from the holder along with `r` and `s`\\n    /// @param r Must produce valid secp256k1 signature from the holder along with `v` and `s`\\n    /// @param s Must produce valid secp256k1 signature from the holder along with `r` and `v`\\n    function selfPermitIfNecessary(\\n        address token,\\n        uint256 value,\\n        uint256 deadline,\\n        uint8 v,\\n        bytes32 r,\\n        bytes32 s\\n    ) external payable;\\n\\n    /// @notice Permits this contract to spend the sender's tokens for permit signatures that have the `allowed` parameter\\n    /// @dev The `owner` is always msg.sender and the `spender` is always address(this)\\n    /// @param token The address of the token spent\\n    /// @param nonce The current nonce of the owner\\n    /// @param expiry The timestamp at which the permit is no longer valid\\n    /// @param v Must produce valid secp256k1 signature from the holder along with `r` and `s`\\n    /// @param r Must produce valid secp256k1 signature from the holder along with `v` and `s`\\n    /// @param s Must produce valid secp256k1 signature from the holder along with `r` and `v`\\n    function selfPermitAllowed(\\n        address token,\\n        uint256 nonce,\\n        uint256 expiry,\\n        uint8 v,\\n        bytes32 r,\\n        bytes32 s\\n    ) external payable;\\n\\n    /// @notice Permits this contract to spend the sender's tokens for permit signatures that have the `allowed` parameter\\n    /// @dev The `owner` is always msg.sender and the `spender` is always address(this)\\n    /// Can be used instead of #selfPermitAllowed to prevent calls from failing due to a frontrun of a call to #selfPermitAllowed.\\n    /// @param token The address of the token spent\\n    /// @param nonce The current nonce of the owner\\n    /// @param expiry The timestamp at which the permit is no longer valid\\n    /// @param v Must produce valid secp256k1 signature from the holder along with `r` and `s`\\n    /// @param r Must produce valid secp256k1 signature from the holder along with `v` and `s`\\n    /// @param s Must produce valid secp256k1 signature from the holder along with `r` and `v`\\n    function selfPermitAllowedIfNecessary(\\n        address token,\\n        uint256 nonce,\\n        uint256 expiry,\\n        uint8 v,\\n        bytes32 r,\\n        bytes32 s\\n    ) external payable;\\n}\\n\",\"keccak256\":\"0xf8f2feb785fcf98071ff47729829c8d7b2a87903db216dfeeccca4eae28a9982\",\"license\":\"GPL-2.0-or-later\"},\"contracts/v3-periphery/interfaces/external/IERC1271.sol\":{\"content\":\"// SPDX-License-Identifier: GPL-2.0-or-later\\npragma solidity =0.7.6;\\n\\n/// @title Interface for verifying contract-based account signatures\\n/// @notice Interface that verifies provided signature for the data\\n/// @dev Interface defined by EIP-1271\\ninterface IERC1271 {\\n    /// @notice Returns whether the provided signature is valid for the provided data\\n    /// @dev MUST return the bytes4 magic value 0x1626ba7e when function passes.\\n    /// MUST NOT modify state (using STATICCALL for solc < 0.5, view modifier for solc > 0.5).\\n    /// MUST allow external calls.\\n    /// @param hash Hash of the data to be signed\\n    /// @param signature Signature byte array associated with _data\\n    /// @return magicValue The bytes4 magic value 0x1626ba7e\\n    function isValidSignature(bytes32 hash, bytes memory signature) external view returns (bytes4 magicValue);\\n}\\n\",\"keccak256\":\"0xec9cb1ebfb324af224718cee5fa55f8659a95ac25fd981574453f02d7609a221\",\"license\":\"GPL-2.0-or-later\"},\"contracts/v3-periphery/interfaces/external/IERC20PermitAllowed.sol\":{\"content\":\"// SPDX-License-Identifier: GPL-2.0-or-later\\npragma solidity =0.7.6;\\n\\n/// @title Interface for permit\\n/// @notice Interface used by DAI/CHAI for permit\\ninterface IERC20PermitAllowed {\\n    /// @notice Approve the spender to spend some tokens via the holder signature\\n    /// @dev This is the permit interface used by DAI and CHAI\\n    /// @param holder The address of the token holder, the token owner\\n    /// @param spender The address of the token spender\\n    /// @param nonce The holder's nonce, increases at each call to permit\\n    /// @param expiry The timestamp at which the permit is no longer valid\\n    /// @param allowed Boolean that sets approval amount, true for type(uint256).max and false for 0\\n    /// @param v Must produce valid secp256k1 signature from the holder along with `r` and `s`\\n    /// @param r Must produce valid secp256k1 signature from the holder along with `v` and `s`\\n    /// @param s Must produce valid secp256k1 signature from the holder along with `r` and `v`\\n    function permit(\\n        address holder,\\n        address spender,\\n        uint256 nonce,\\n        uint256 expiry,\\n        bool allowed,\\n        uint8 v,\\n        bytes32 r,\\n        bytes32 s\\n    ) external;\\n}\\n\",\"keccak256\":\"0x200deae62d06c421b1d24c8cfca3b57477b0e378af0873b6f30a6cd29a615837\",\"license\":\"GPL-2.0-or-later\"},\"contracts/v3-periphery/interfaces/external/IWBB.sol\":{\"content\":\"// SPDX-License-Identifier: GPL-2.0-or-later\\npragma solidity =0.7.6;\\n\\nimport '@openzeppelin/contracts/token/ERC20/IERC20.sol';\\n\\n/// @title Interface for WBB\\ninterface IWBB is IERC20 {\\n    /// @notice Deposit ether to get wrapped ether\\n    function deposit() external payable;\\n\\n    /// @notice Withdraw wrapped ether to get ether\\n    function withdraw(uint256) external;\\n}\\n\",\"keccak256\":\"0xc5b25a47df5bbb3f252db97772c2d69d5b33f199466393f101524a95957ba058\",\"license\":\"GPL-2.0-or-later\"},\"contracts/v3-periphery/libraries/CallbackValidation.sol\":{\"content\":\"// SPDX-License-Identifier: GPL-2.0-or-later\\npragma solidity =0.7.6;\\n\\nimport '../../v3-core/interfaces/IBitswapV3Pool.sol';\\nimport './PoolAddress.sol';\\n\\n/// @notice Provides validation for callbacks from Bitswap V3 Pools\\nlibrary CallbackValidation {\\n    /// @notice Returns the address of a valid Bitswap V3 Pool\\n    /// @param factory The contract address of the Bitswap V3 factory\\n    /// @param tokenA The contract address of either token0 or token1\\n    /// @param tokenB The contract address of the other token\\n    /// @param fee The fee collected upon every swap in the pool, denominated in hundredths of a bip\\n    /// @return pool The V3 pool contract address\\n    function verifyCallback(\\n        address factory,\\n        address tokenA,\\n        address tokenB,\\n        uint24 fee\\n    ) internal view returns (IBitswapV3Pool pool) {\\n        return verifyCallback(factory, PoolAddress.getPoolKey(tokenA, tokenB, fee));\\n    }\\n\\n    /// @notice Returns the address of a valid Bitswap V3 Pool\\n    /// @param factory The contract address of the Bitswap V3 factory\\n    /// @param poolKey The identifying key of the V3 pool\\n    /// @return pool The V3 pool contract address\\n    function verifyCallback(address factory, PoolAddress.PoolKey memory poolKey)\\n        internal\\n        view\\n        returns (IBitswapV3Pool pool)\\n    {\\n        pool = IBitswapV3Pool(PoolAddress.computeAddress(factory, poolKey));\\n        require(msg.sender == address(pool));\\n    }\\n}\\n\",\"keccak256\":\"0xcc0dd98933e8aac77bc056d387d1c1af1894e8cd6ffa4e84bb1b420dd99589a3\",\"license\":\"GPL-2.0-or-later\"},\"contracts/v3-periphery/libraries/ChainId.sol\":{\"content\":\"// SPDX-License-Identifier: GPL-2.0-or-later\\npragma solidity =0.7.6;\\n\\n/// @title Function for getting the current chain ID\\nlibrary ChainId {\\n    /// @dev Gets the current chain ID\\n    /// @return chainId The current chain ID\\n    function get() internal pure returns (uint256 chainId) {\\n        assembly {\\n            chainId := chainid()\\n        }\\n    }\\n}\\n\",\"keccak256\":\"0x01e8f4a9576375f59c6f5b6d3173b8c204ad117dfeaf7a9842b117b539999cf7\",\"license\":\"GPL-2.0-or-later\"},\"contracts/v3-periphery/libraries/LiquidityAmounts.sol\":{\"content\":\"// SPDX-License-Identifier: GPL-2.0-or-later\\npragma solidity =0.7.6;\\n\\nimport '../../v3-core/libraries/FullMath.sol';\\nimport '../../v3-core/libraries/FixedPoint96.sol';\\n\\n/// @title Liquidity amount functions\\n/// @notice Provides functions for computing liquidity amounts from token amounts and prices\\nlibrary LiquidityAmounts {\\n    /// @notice Downcasts uint256 to uint128\\n    /// @param x The uint258 to be downcasted\\n    /// @return y The passed value, downcasted to uint128\\n    function toUint128(uint256 x) private pure returns (uint128 y) {\\n        require((y = uint128(x)) == x);\\n    }\\n\\n    /// @notice Computes the amount of liquidity received for a given amount of token0 and price range\\n    /// @dev Calculates amount0 * (sqrt(upper) * sqrt(lower)) / (sqrt(upper) - sqrt(lower))\\n    /// @param sqrtRatioAX96 A sqrt price representing the first tick boundary\\n    /// @param sqrtRatioBX96 A sqrt price representing the second tick boundary\\n    /// @param amount0 The amount0 being sent in\\n    /// @return liquidity The amount of returned liquidity\\n    function getLiquidityForAmount0(\\n        uint160 sqrtRatioAX96,\\n        uint160 sqrtRatioBX96,\\n        uint256 amount0\\n    ) internal pure returns (uint128 liquidity) {\\n        if (sqrtRatioAX96 > sqrtRatioBX96) (sqrtRatioAX96, sqrtRatioBX96) = (sqrtRatioBX96, sqrtRatioAX96);\\n        uint256 intermediate = FullMath.mulDiv(sqrtRatioAX96, sqrtRatioBX96, FixedPoint96.Q96);\\n        return toUint128(FullMath.mulDiv(amount0, intermediate, sqrtRatioBX96 - sqrtRatioAX96));\\n    }\\n\\n    /// @notice Computes the amount of liquidity received for a given amount of token1 and price range\\n    /// @dev Calculates amount1 / (sqrt(upper) - sqrt(lower)).\\n    /// @param sqrtRatioAX96 A sqrt price representing the first tick boundary\\n    /// @param sqrtRatioBX96 A sqrt price representing the second tick boundary\\n    /// @param amount1 The amount1 being sent in\\n    /// @return liquidity The amount of returned liquidity\\n    function getLiquidityForAmount1(\\n        uint160 sqrtRatioAX96,\\n        uint160 sqrtRatioBX96,\\n        uint256 amount1\\n    ) internal pure returns (uint128 liquidity) {\\n        if (sqrtRatioAX96 > sqrtRatioBX96) (sqrtRatioAX96, sqrtRatioBX96) = (sqrtRatioBX96, sqrtRatioAX96);\\n        return toUint128(FullMath.mulDiv(amount1, FixedPoint96.Q96, sqrtRatioBX96 - sqrtRatioAX96));\\n    }\\n\\n    /// @notice Computes the maximum amount of liquidity received for a given amount of token0, token1, the current\\n    /// pool prices and the prices at the tick boundaries\\n    /// @param sqrtRatioX96 A sqrt price representing the current pool prices\\n    /// @param sqrtRatioAX96 A sqrt price representing the first tick boundary\\n    /// @param sqrtRatioBX96 A sqrt price representing the second tick boundary\\n    /// @param amount0 The amount of token0 being sent in\\n    /// @param amount1 The amount of token1 being sent in\\n    /// @return liquidity The maximum amount of liquidity received\\n    function getLiquidityForAmounts(\\n        uint160 sqrtRatioX96,\\n        uint160 sqrtRatioAX96,\\n        uint160 sqrtRatioBX96,\\n        uint256 amount0,\\n        uint256 amount1\\n    ) internal pure returns (uint128 liquidity) {\\n        if (sqrtRatioAX96 > sqrtRatioBX96) (sqrtRatioAX96, sqrtRatioBX96) = (sqrtRatioBX96, sqrtRatioAX96);\\n\\n        if (sqrtRatioX96 <= sqrtRatioAX96) {\\n            liquidity = getLiquidityForAmount0(sqrtRatioAX96, sqrtRatioBX96, amount0);\\n        } else if (sqrtRatioX96 < sqrtRatioBX96) {\\n            uint128 liquidity0 = getLiquidityForAmount0(sqrtRatioX96, sqrtRatioBX96, amount0);\\n            uint128 liquidity1 = getLiquidityForAmount1(sqrtRatioAX96, sqrtRatioX96, amount1);\\n\\n            liquidity = liquidity0 < liquidity1 ? liquidity0 : liquidity1;\\n        } else {\\n            liquidity = getLiquidityForAmount1(sqrtRatioAX96, sqrtRatioBX96, amount1);\\n        }\\n    }\\n\\n    /// @notice Computes the amount of token0 for a given amount of liquidity and a price range\\n    /// @param sqrtRatioAX96 A sqrt price representing the first tick boundary\\n    /// @param sqrtRatioBX96 A sqrt price representing the second tick boundary\\n    /// @param liquidity The liquidity being valued\\n    /// @return amount0 The amount of token0\\n    function getAmount0ForLiquidity(\\n        uint160 sqrtRatioAX96,\\n        uint160 sqrtRatioBX96,\\n        uint128 liquidity\\n    ) internal pure returns (uint256 amount0) {\\n        if (sqrtRatioAX96 > sqrtRatioBX96) (sqrtRatioAX96, sqrtRatioBX96) = (sqrtRatioBX96, sqrtRatioAX96);\\n\\n        return\\n            FullMath.mulDiv(\\n                uint256(liquidity) << FixedPoint96.RESOLUTION,\\n                sqrtRatioBX96 - sqrtRatioAX96,\\n                sqrtRatioBX96\\n            ) / sqrtRatioAX96;\\n    }\\n\\n    /// @notice Computes the amount of token1 for a given amount of liquidity and a price range\\n    /// @param sqrtRatioAX96 A sqrt price representing the first tick boundary\\n    /// @param sqrtRatioBX96 A sqrt price representing the second tick boundary\\n    /// @param liquidity The liquidity being valued\\n    /// @return amount1 The amount of token1\\n    function getAmount1ForLiquidity(\\n        uint160 sqrtRatioAX96,\\n        uint160 sqrtRatioBX96,\\n        uint128 liquidity\\n    ) internal pure returns (uint256 amount1) {\\n        if (sqrtRatioAX96 > sqrtRatioBX96) (sqrtRatioAX96, sqrtRatioBX96) = (sqrtRatioBX96, sqrtRatioAX96);\\n\\n        return FullMath.mulDiv(liquidity, sqrtRatioBX96 - sqrtRatioAX96, FixedPoint96.Q96);\\n    }\\n\\n    /// @notice Computes the token0 and token1 value for a given amount of liquidity, the current\\n    /// pool prices and the prices at the tick boundaries\\n    /// @param sqrtRatioX96 A sqrt price representing the current pool prices\\n    /// @param sqrtRatioAX96 A sqrt price representing the first tick boundary\\n    /// @param sqrtRatioBX96 A sqrt price representing the second tick boundary\\n    /// @param liquidity The liquidity being valued\\n    /// @return amount0 The amount of token0\\n    /// @return amount1 The amount of token1\\n    function getAmountsForLiquidity(\\n        uint160 sqrtRatioX96,\\n        uint160 sqrtRatioAX96,\\n        uint160 sqrtRatioBX96,\\n        uint128 liquidity\\n    ) internal pure returns (uint256 amount0, uint256 amount1) {\\n        if (sqrtRatioAX96 > sqrtRatioBX96) (sqrtRatioAX96, sqrtRatioBX96) = (sqrtRatioBX96, sqrtRatioAX96);\\n\\n        if (sqrtRatioX96 <= sqrtRatioAX96) {\\n            amount0 = getAmount0ForLiquidity(sqrtRatioAX96, sqrtRatioBX96, liquidity);\\n        } else if (sqrtRatioX96 < sqrtRatioBX96) {\\n            amount0 = getAmount0ForLiquidity(sqrtRatioX96, sqrtRatioBX96, liquidity);\\n            amount1 = getAmount1ForLiquidity(sqrtRatioAX96, sqrtRatioX96, liquidity);\\n        } else {\\n            amount1 = getAmount1ForLiquidity(sqrtRatioAX96, sqrtRatioBX96, liquidity);\\n        }\\n    }\\n}\\n\",\"keccak256\":\"0x67fa59fe9990bb14f845a3230a0cba4723000752cec4d3c32d9ec42773e1742f\",\"license\":\"GPL-2.0-or-later\"},\"contracts/v3-periphery/libraries/PoolAddress.sol\":{\"content\":\"// SPDX-License-Identifier: GPL-2.0-or-later\\npragma solidity =0.7.6;\\n\\n/// @title Provides functions for deriving a pool address from the factory, tokens, and the fee\\nlibrary PoolAddress {\\n    bytes32 internal constant POOL_INIT_CODE_HASH = 0xb08f141592c0050e62ab87dfaa72052ba6475576805a571ff865bf5bcbdb56e4;\\n\\n    /// @notice The identifying key of the pool\\n    struct PoolKey {\\n        address token0;\\n        address token1;\\n        uint24 fee;\\n    }\\n\\n    /// @notice Returns PoolKey: the ordered tokens with the matched fee levels\\n    /// @param tokenA The first token of a pool, unsorted\\n    /// @param tokenB The second token of a pool, unsorted\\n    /// @param fee The fee level of the pool\\n    /// @return Poolkey The pool details with ordered token0 and token1 assignments\\n    function getPoolKey(\\n        address tokenA,\\n        address tokenB,\\n        uint24 fee\\n    ) internal pure returns (PoolKey memory) {\\n        if (tokenA > tokenB) (tokenA, tokenB) = (tokenB, tokenA);\\n        return PoolKey({token0: tokenA, token1: tokenB, fee: fee});\\n    }\\n\\n    /// @notice Deterministically computes the pool address given the factory and PoolKey\\n    /// @param factory The Bitswap V3 factory contract address\\n    /// @param key The PoolKey\\n    /// @return pool The contract address of the V3 pool\\n    function computeAddress(address factory, PoolKey memory key) internal pure returns (address pool) {\\n        require(key.token0 < key.token1);\\n        pool = address(\\n            uint256(\\n                keccak256(\\n                    abi.encodePacked(\\n                        hex'ff',\\n                        factory,\\n                        keccak256(abi.encode(key.token0, key.token1, key.fee)),\\n                        POOL_INIT_CODE_HASH\\n                    )\\n                )\\n            )\\n        );\\n    }\\n}\\n\",\"keccak256\":\"0x23d8ea7ff8369688d48f4793a1498e5e5d4c7cd4d23001c49c2c6e1092b784f8\",\"license\":\"GPL-2.0-or-later\"},\"contracts/v3-periphery/libraries/PositionKey.sol\":{\"content\":\"// SPDX-License-Identifier: GPL-2.0-or-later\\npragma solidity =0.7.6;\\n\\nlibrary PositionKey {\\n    /// @dev Returns the key of the position in the core library\\n    function compute(\\n        address owner,\\n        int24 tickLower,\\n        int24 tickUpper\\n    ) internal pure returns (bytes32) {\\n        return keccak256(abi.encodePacked(owner, tickLower, tickUpper));\\n    }\\n}\\n\",\"keccak256\":\"0x719c52d470f0fb1f5d84b4c53e4a3fa0aa68d0a3769bd39030f2f8d7c38c3132\",\"license\":\"GPL-2.0-or-later\"},\"contracts/v3-periphery/libraries/TransferHelper.sol\":{\"content\":\"// SPDX-License-Identifier: GPL-2.0-or-later\\npragma solidity =0.7.6;\\n\\nimport '@openzeppelin/contracts/token/ERC20/IERC20.sol';\\n\\nlibrary TransferHelper {\\n    /// @notice Transfers tokens from the targeted address to the given destination\\n    /// @notice Errors with 'STF' if transfer fails\\n    /// @param token The contract address of the token to be transferred\\n    /// @param from The originating address from which the tokens will be transferred\\n    /// @param to The destination address of the transfer\\n    /// @param value The amount to be transferred\\n    function safeTransferFrom(\\n        address token,\\n        address from,\\n        address to,\\n        uint256 value\\n    ) internal {\\n        (bool success, bytes memory data) =\\n            token.call(abi.encodeWithSelector(IERC20.transferFrom.selector, from, to, value));\\n        require(success && (data.length == 0 || abi.decode(data, (bool))), 'STF');\\n    }\\n\\n    /// @notice Transfers tokens from msg.sender to a recipient\\n    /// @dev Errors with ST if transfer fails\\n    /// @param token The contract address of the token which will be transferred\\n    /// @param to The recipient of the transfer\\n    /// @param value The value of the transfer\\n    function safeTransfer(\\n        address token,\\n        address to,\\n        uint256 value\\n    ) internal {\\n        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(IERC20.transfer.selector, to, value));\\n        require(success && (data.length == 0 || abi.decode(data, (bool))), 'ST');\\n    }\\n\\n    /// @notice Approves the stipulated contract to spend the given allowance in the given token\\n    /// @dev Errors with 'SA' if transfer fails\\n    /// @param token The contract address of the token to be approved\\n    /// @param to The target of the approval\\n    /// @param value The amount of the given token the target will be allowed to spend\\n    function safeApprove(\\n        address token,\\n        address to,\\n        uint256 value\\n    ) internal {\\n        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(IERC20.approve.selector, to, value));\\n        require(success && (data.length == 0 || abi.decode(data, (bool))), 'SA');\\n    }\\n\\n    /// @notice Transfers ETH to the recipient address\\n    /// @dev Fails with `STE`\\n    /// @param to The destination of the transfer\\n    /// @param value The value to be transferred\\n    function safeTransferETH(address to, uint256 value) internal {\\n        (bool success, ) = to.call{value: value}(new bytes(0));\\n        require(success, 'STE');\\n    }\\n}\\n\",\"keccak256\":\"0xac32253b36f868331ad2fd45bca8209c41a3565e4d3ad2d8d4b5d61d2e3b928b\",\"license\":\"GPL-2.0-or-later\"}},\"version\":1}";
var bytecode = "0x610120604052600d80546001600160b01b0319166001176001600160b01b0316600160b01b1790553480156200003457600080fd5b5060405162005d5a38038062005d5a8339810160408190526200005791620002db565b82826040518060400160405280601b81526020017f4269747377617020563320506f736974696f6e73204e46542d563100000000008152506040518060400160405280600a8152602001694249542d56332d504f5360b01b815250604051806040016040528060018152602001603160f81b8152508282620000e66301ffc9a760e01b6200018d60201b60201c565b8151620000fb90600690602085019062000212565b5080516200011190600790602084019062000212565b50620001246380ac58cd60e01b6200018d565b62000136635b5e139f60e01b6200018d565b6200014863780e9d6360e01b6200018d565b50508251602093840120608052805192019190912060a052506001600160601b0319606092831b811660c05290821b811660e05291901b166101005250620003249050565b6001600160e01b03198082161415620001ed576040805162461bcd60e51b815260206004820152601c60248201527f4552433136353a20696e76616c696420696e7465726661636520696400000000604482015290519081900360640190fd5b6001600160e01b0319166000908152602081905260409020805460ff19166001179055565b828054600181600116156101000203166002900490600052602060002090601f0160209004810192826200024a576000855562000295565b82601f106200026557805160ff191683800117855562000295565b8280016001018555821562000295579182015b828111156200029557825182559160200191906001019062000278565b50620002a3929150620002a7565b5090565b5b80821115620002a35760008155600101620002a8565b80516001600160a01b0381168114620002d657600080fd5b919050565b600080600060608486031215620002f0578283fd5b620002fb84620002be565b92506200030b60208501620002be565b91506200031b60408501620002be565b90509250925092565b60805160a05160c05160601c60e05160601c6101005160601c6159b1620003a960003980612859525080610239528061131d528061260c52806126f552806136e35280613729528061379d525080610a035280610d235280610dea52806113fa528061280c5280612b7552806133785250806114a952508061148852506159b16000f3fe6080604052600436106102295760003560e01c80636352211e11610123578063ac9650d8116100ab578063c87b56dd1161006f578063c87b56dd1461064c578063df2ab5bb1461066c578063e985e9c51461067f578063f3995c671461069f578063fc6f7865146106b257610297565b8063ac9650d8146105d1578063b88d4fde146105f1578063bb4d237f14610611578063c2e3140a14610624578063c45a01551461063757610297565b806388316456116100f2578063883164561461052e57806395d89b411461055157806399fbab8814610566578063a22cb4651461059e578063a4a78f0c146105be57610297565b80636352211e146104c65780636c0360eb146104e657806370a08231146104fb5780637ac2ff7b1461051b57610297565b806323a82e0d116101b15780633644e515116101755780633644e5151461044b57806342842e0e1461046057806342966c68146104805780634659a494146104935780634f6ccce7146104a657610297565b806323a82e0d146103c157806323b872dd146103d65780632f745c59146103f657806330adf81f1461041657806330b4dcec1461042b57610297565b80630c49ccbe116101f85780630c49ccbe1461034157806312210e8a1461036257806313ead5621461036a57806318160ddd1461037d578063219f5d171461039f57610297565b806301ffc9a71461029c57806306fdde03146102d2578063081812fc146102f4578063095ea7b31461032157610297565b3661029757336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614610295576040805162461bcd60e51b81526020600482015260076024820152662737ba102ba12160c91b604482015290519081900360640190fd5b005b600080fd5b3480156102a857600080fd5b506102bc6102b7366004614e92565b6106c5565b6040516102c991906153d3565b60405180910390f35b3480156102de57600080fd5b506102e76106e8565b6040516102c99190615426565b34801561030057600080fd5b5061031461030f36600461518c565b61077e565b6040516102c991906152b6565b34801561032d57600080fd5b5061029561033c366004614d5c565b6107d1565b61035461034f366004614f57565b6108a7565b6040516102c99291906155ad565b610295610cef565b610314610378366004614bef565b610d01565b34801561038957600080fd5b50610392610ff5565b6040516102c991906153de565b6103b26103ad366004614f68565b611006565b6040516102c993929190615568565b3480156103cd57600080fd5b5061031461131b565b3480156103e257600080fd5b506102956103f1366004614c48565b61133f565b34801561040257600080fd5b50610392610411366004614d5c565b611396565b34801561042257600080fd5b506103926113c1565b34801561043757600080fd5b506102956104463660046151eb565b6113e5565b34801561045757600080fd5b50610392611463565b34801561046c57600080fd5b5061029561047b366004614c48565b611521565b61029561048e36600461518c565b61153c565b6102956104a1366004614dc8565b61160b565b3480156104b257600080fd5b506103926104c136600461518c565b6116a5565b3480156104d257600080fd5b506103146104e136600461518c565b6116bb565b3480156104f257600080fd5b506102e76116e3565b34801561050757600080fd5b50610392610516366004614b9b565b6116e8565b610295610529366004614dc8565b611750565b61054161053c366004615024565b611b42565b6040516102c99493929190615589565b34801561055d57600080fd5b506102e761205a565b34801561057257600080fd5b5061058661058136600461518c565b6120bb565b6040516102c99c9b9a999897969594939291906155bb565b3480156105aa57600080fd5b506102956105b9366004614d2f565b6122cc565b6102956105cc366004614dc8565b6123d1565b6105e46105df366004614e23565b61246a565b6040516102c99190615373565b3480156105fd57600080fd5b5061029561060c366004614c88565b6125aa565b61029561061f3660046151a4565b612608565b610295610632366004614dc8565b61277b565b34801561064357600080fd5b5061031461280a565b34801561065857600080fd5b506102e761066736600461518c565b61282e565b61029561067a366004614d87565b6128e4565b34801561068b57600080fd5b506102bc61069a366004614bb7565b6129bc565b6102956106ad366004614dc8565b6129ea565b6103546106c0366004614f40565b612a5c565b6001600160e01b0319811660009081526020819052604090205460ff165b919050565b60068054604080516020601f60026000196101006001881615020190951694909404938401819004810282018101909252828152606093909290918301828280156107745780601f1061074957610100808354040283529160200191610774565b820191906000526020600020905b81548152906001019060200180831161075757829003601f168201915b5050505050905090565b600061078982612f27565b6107ae5760405162461bcd60e51b81526004016107a59061545f565b60405180910390fd5b506000908152600c6020526040902054600160601b90046001600160a01b031690565b60006107dc826116bb565b9050806001600160a01b0316836001600160a01b0316141561082f5760405162461bcd60e51b815260040180806020018281038252602181526020018061592a6021913960400191505060405180910390fd5b806001600160a01b0316610841612f34565b6001600160a01b0316148061085d575061085d8161069a612f34565b6108985760405162461bcd60e51b81526004018080602001828103825260388152602001806158546038913960400191505060405180910390fd5b6108a28383612f38565b505050565b60008082356108b63382612fae565b6108d25760405162461bcd60e51b81526004016107a590615439565b8360800135806108e061304a565b1115610929576040805162461bcd60e51b8152602060048201526013602482015272151c985b9cd858dd1a5bdb881d1bdbc81bdb19606a1b604482015290519081900360640190fd5b600061093b6040870160208801615036565b6001600160801b03161161094e57600080fd5b84356000908152600c602090815260409182902060018101549092600160801b9091046001600160801b031691610989918901908901615036565b6001600160801b0316816001600160801b031610156109a757600080fd5b6001828101546001600160501b03166000908152600b60209081526040808320815160608101835281546001600160a01b039081168252919095015490811692850192909252600160a01b90910462ffffff1690830152610a287f00000000000000000000000000000000000000000000000000000000000000008361304e565b60018501549091506001600160a01b0382169063a34123a790600160501b8104600290810b91600160681b9004900b610a6760408e0160208f01615036565b6040518463ffffffff1660e01b8152600401610a8593929190615400565b6040805180830381600087803b158015610a9e57600080fd5b505af1158015610ab2573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ad691906151c8565b909850965060408901358810801590610af3575088606001358710155b610b0f5760405162461bcd60e51b81526004016107a5906154ab565b6001840154600090610b38903090600160501b8104600290810b91600160681b9004900b61312d565b9050600080836001600160a01b031663514ea4bf846040518263ffffffff1660e01b8152600401610b6991906153de565b60a06040518083038186803b158015610b8157600080fd5b505afa158015610b95573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610bb99190615080565b50509250925050610bde87600201548303876001600160801b0316600160801b613182565b6004880180546001600160801b03198116928e016001600160801b039182160181169290921790556003880154610c1f91908303908816600160801b613182565b6004880180546001600160801b03808216938e01600160801b9283900482160116029190911790556002870182905560038701819055610c6560408d0160208e01615036565b86038760010160106101000a8154816001600160801b0302191690836001600160801b031602179055508b600001357f26f6a048ee9138f2c0ce266f322cb99228e8d619ae2bff30c67f8dcf9d2377b48d6020016020810190610cc89190615036565b8d8d604051610cd993929190615568565b60405180910390a2505050505050505050915091565b4715610cff57610cff3347613231565b565b6000836001600160a01b0316856001600160a01b031610610d2157600080fd5b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316631698ee828686866040518463ffffffff1660e01b815260040180846001600160a01b03168152602001836001600160a01b031681526020018262ffffff168152602001935050505060206040518083038186803b158015610dac57600080fd5b505afa158015610dc0573d6000803e3d6000fd5b505050506040513d6020811015610dd657600080fd5b505190506001600160a01b038116610f0c577f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663a16712958686866040518463ffffffff1660e01b815260040180846001600160a01b03168152602001836001600160a01b031681526020018262ffffff1681526020019350505050602060405180830381600087803b158015610e7557600080fd5b505af1158015610e89573d6000803e3d6000fd5b505050506040513d6020811015610e9f57600080fd5b50516040805163f637731d60e01b81526001600160a01b03858116600483015291519293509083169163f637731d9160248082019260009290919082900301818387803b158015610eef57600080fd5b505af1158015610f03573d6000803e3d6000fd5b50505050610fed565b6000816001600160a01b0316633850c7bd6040518163ffffffff1660e01b815260040160e06040518083038186803b158015610f4757600080fd5b505afa158015610f5b573d6000803e3d6000fd5b505050506040513d60e0811015610f7157600080fd5b505190506001600160a01b038116610feb57816001600160a01b031663f637731d846040518263ffffffff1660e01b815260040180826001600160a01b03168152602001915050600060405180830381600087803b158015610fd257600080fd5b505af1158015610fe6573d6000803e3d6000fd5b505050505b505b949350505050565b60006110016002613320565b905090565b60008060008360a001358061101961304a565b1115611062576040805162461bcd60e51b8152602060048201526013602482015272151c985b9cd858dd1a5bdb881d1bdbc81bdb19606a1b604482015290519081900360640190fd5b84356000908152600c602090815260408083206001808201546001600160501b0381168652600b855283862084516060808201875282546001600160a01b039081168352929094015480831682890190815262ffffff600160a01b9092048216838901908152885161014081018a528451861681529151909416818a0152925116828701523082850152600160501b8304600290810b810b608080850191909152600160681b909404810b900b60a0830152958c013560c0820152938b013560e0850152908a013561010084015289013561012083015292906111449061332b565b6001870154939a5091985096509150600090611177903090600160501b8104600290810b91600160681b9004900b61312d565b9050600080836001600160a01b031663514ea4bf846040518263ffffffff1660e01b81526004016111a891906153de565b60a06040518083038186803b1580156111c057600080fd5b505afa1580156111d4573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906111f89190615080565b50509250925050611234866002015483038760010160109054906101000a90046001600160801b03166001600160801b0316600160801b613182565b6004870180546001600160801b0380821690930183166001600160801b03199091161790556003870154600188015461127b9291840391600160801b918290041690613182565b6004870180546001600160801b03600160801b80830482169094018116840291811691909117909155600288018490556003880183905560018801805483810483168e018316909302929091169190911790556040518b35907f3067048beee31b25b2f1681f88dac838c8bba36af25bfb2b7cf7473a5847e35f90611305908d908d908d90615568565b60405180910390a2505050505050509193909250565b7f000000000000000000000000000000000000000000000000000000000000000081565b61135061134a612f34565b82612fae565b61138b5760405162461bcd60e51b815260040180806020018281038252603181526020018061594b6031913960400191505060405180910390fd5b6108a2838383613566565b6001600160a01b03821660009081526001602052604081206113b890836136b2565b90505b92915050565b7f49ecf333e5b8c95c40fdafc95c1ad136e8914a8fb55e9dc8bb01eaa83a2df9ad81565b60006113f382840184614f79565b90506114237f000000000000000000000000000000000000000000000000000000000000000082600001516136be565b50841561143e57805151602082015161143e919033886136e1565b831561145c5761145c816000015160200151826020015133876136e1565b5050505050565b60007f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f7f00000000000000000000000000000000000000000000000000000000000000007f00000000000000000000000000000000000000000000000000000000000000006114d0613871565b3060405160200180868152602001858152602001848152602001838152602001826001600160a01b031681526020019550505050505060405160208183030381529060405280519060200120905090565b6108a2838383604051806020016040528060008152506125aa565b806115473382612fae565b6115635760405162461bcd60e51b81526004016107a590615439565b6000828152600c602052604090206001810154600160801b90046001600160801b031615801561159e575060048101546001600160801b0316155b80156115bc57506004810154600160801b90046001600160801b0316155b6115d85760405162461bcd60e51b81526004016107a590615503565b6000838152600c60205260408120818155600181018290556002810182905560038101829055600401556108a283613875565b604080516323f2ebc360e21b815233600482015230602482015260448101879052606481018690526001608482015260ff851660a482015260c4810184905260e4810183905290516001600160a01b03881691638fcbaf0c9161010480830192600092919082900301818387803b15801561168557600080fd5b505af1158015611699573d6000803e3d6000fd5b50505050505050505050565b6000806116b3600284613942565b509392505050565b60006113bb826040518060600160405280602981526020016158b66029913960029190613960565b606090565b60006001600160a01b03821661172f5760405162461bcd60e51b815260040180806020018281038252602a81526020018061588c602a913960400191505060405180910390fd5b6001600160a01b03821660009081526001602052604090206113bb90613320565b8361175961304a565b111561179d576040805162461bcd60e51b815260206004820152600e60248201526d14195c9b5a5d08195e1c1a5c995960921b604482015290519081900360640190fd5b60006117a7611463565b7f49ecf333e5b8c95c40fdafc95c1ad136e8914a8fb55e9dc8bb01eaa83a2df9ad88886117d38161396d565b604080516020808201969096526001600160a01b03909416848201526060840192909252608083015260a08083018a90528151808403909101815260c08301825280519084012061190160f01b60e084015260e28301949094526101028083019490945280518083039094018452610122909101905281519101209050600061185b876116bb565b9050806001600160a01b0316886001600160a01b031614156118ae5760405162461bcd60e51b81526004018080602001828103825260278152602001806157b76027913960400191505060405180910390fd5b6118b7816139a2565b15611a1f576040805160208082018790528183018690526001600160f81b031960f889901b1660608301528251604181840301815260618301808552630b135d3f60e11b90526065830186815260858401948552815160a585015281516001600160a01b03871695631626ba7e958995919260c59091019185019080838360005b83811015611950578181015183820152602001611938565b50505050905090810190601f16801561197d5780820380516001836020036101000a031916815260200191505b50935050505060206040518083038186803b15801561199b57600080fd5b505afa1580156119af573d6000803e3d6000fd5b505050506040513d60208110156119c557600080fd5b50516001600160e01b031916630b135d3f60e11b14611a1a576040805162461bcd60e51b815260206004820152600c60248201526b155b985d5d1a1bdc9a5e995960a21b604482015290519081900360640190fd5b611b2e565b600060018387878760405160008152602001604052604051808581526020018460ff1681526020018381526020018281526020019450505050506020604051602081039080840390855afa158015611a7b573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b038116611ad7576040805162461bcd60e51b8152602060048201526011602482015270496e76616c6964207369676e617475726560781b604482015290519081900360640190fd5b816001600160a01b0316816001600160a01b031614611b2c576040805162461bcd60e51b815260206004820152600c60248201526b155b985d5d1a1bdc9a5e995960a21b604482015290519081900360640190fd5b505b611b388888612f38565b5050505050505050565b60008060008084610140013580611b5761304a565b1115611ba0576040805162461bcd60e51b8152602060048201526013602482015272151c985b9cd858dd1a5bdb881d1bdbc81bdb19606a1b604482015290519081900360640190fd5b604080516101408101909152600090611c6c9080611bc160208b018b614b9b565b6001600160a01b03168152602001896020016020810190611be29190614b9b565b6001600160a01b03168152602001611c0060608b0160408c01615172565b62ffffff168152306020820152604001611c2060808b0160608c01614eba565b60020b8152602001611c3860a08b0160808c01614eba565b60020b81526020018960a0013581526020018960c0013581526020018960e00135815260200189610100013581525061332b565b92975090955093509050611cb9611c8b61014089016101208a01614b9b565b600d80546001600160b01b0319811660016001600160b01b03928316908101909216179091559750876139a8565b6000611ce430611ccf60808b0160608c01614eba565b611cdf60a08c0160808d01614eba565b61312d565b9050600080836001600160a01b031663514ea4bf846040518263ffffffff1660e01b8152600401611d1591906153de565b60a06040518083038186803b158015611d2d57600080fd5b505afa158015611d41573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611d659190615080565b505092509250506000611dde8560405180606001604052808e6000016020810190611d909190614b9b565b6001600160a01b031681526020018e6020016020810190611db19190614b9b565b6001600160a01b031681526020018e6040016020810190611dd29190615172565b62ffffff169052613ad6565b905060405180610140016040528060006001600160601b0316815260200160006001600160a01b03168152602001826001600160501b031681526020018c6060016020810190611e2e9190614eba565b60020b8152602001611e4660a08e0160808f01614eba565b60020b81526020018a6001600160801b0316815260200184815260200183815260200160006001600160801b0316815260200160006001600160801b0316815250600c60008c815260200190815260200160002060008201518160000160006101000a8154816001600160601b0302191690836001600160601b03160217905550602082015181600001600c6101000a8154816001600160a01b0302191690836001600160a01b0316021790555060408201518160010160006101000a8154816001600160501b0302191690836001600160501b03160217905550606082015181600101600a6101000a81548162ffffff021916908360020b62ffffff160217905550608082015181600101600d6101000a81548162ffffff021916908360020b62ffffff16021790555060a08201518160010160106101000a8154816001600160801b0302191690836001600160801b0316021790555060c0820151816002015560e082015181600301556101008201518160040160006101000a8154816001600160801b0302191690836001600160801b031602179055506101208201518160040160106101000a8154816001600160801b0302191690836001600160801b03160217905550905050897f3067048beee31b25b2f1681f88dac838c8bba36af25bfb2b7cf7473a5847e35f8a8a8a60405161204593929190615568565b60405180910390a25050505050509193509193565b60078054604080516020601f60026000196101006001881615020190951694909404938401819004810282018101909252828152606093909290918301828280156107745780601f1061074957610100808354040283529160200191610774565b6000818152600c6020908152604080832081516101408101835281546001600160601b03811682526001600160a01b03600160601b909104169381019390935260018101546001600160501b038116928401839052600160501b8104600290810b810b810b6060860152600160681b8204810b810b810b60808601526001600160801b03600160801b92839004811660a08701529083015460c0860152600383015460e0860152600490920154808316610100860152041661012083015282918291829182918291829182918291829182918291906121ac5760405162461bcd60e51b81526004016107a5906154d9565b6000600b600083604001516001600160501b03166001600160501b031681526020019081526020016000206040518060600160405290816000820160009054906101000a90046001600160a01b03166001600160a01b03166001600160a01b031681526020016001820160009054906101000a90046001600160a01b03166001600160a01b03166001600160a01b031681526020016001820160149054906101000a900462ffffff1662ffffff1662ffffff1681525050905081600001518260200151826000015183602001518460400151866060015187608001518860a001518960c001518a60e001518b61010001518c61012001519d509d509d509d509d509d509d509d509d509d509d509d50505091939597999b5091939597999b565b6122d4612f34565b6001600160a01b0316826001600160a01b0316141561233a576040805162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c657200000000000000604482015290519081900360640190fd5b8060056000612347612f34565b6001600160a01b03908116825260208083019390935260409182016000908120918716808252919093529120805460ff19169215159290921790915561238b612f34565b6001600160a01b03167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c318360405180821515815260200191505060405180910390a35050565b60408051636eb1769f60e11b81523360048201523060248201529051600019916001600160a01b0389169163dd62ed3e91604480820192602092909190829003018186803b15801561242257600080fd5b505afa158015612436573d6000803e3d6000fd5b505050506040513d602081101561244c57600080fd5b505110156124625761246286868686868661160b565b505050505050565b60608167ffffffffffffffff8111801561248357600080fd5b506040519080825280602002602001820160405280156124b757816020015b60608152602001906001900390816124a25790505b50905060005b828110156125a357600080308686858181106124d557fe5b90506020028101906124e79190615655565b6040516124f59291906152a6565b600060405180830381855af49150503d8060008114612530576040519150601f19603f3d011682016040523d82523d6000602084013e612535565b606091505b5091509150816125815760448151101561254e57600080fd5b600481019050808060200190518101906125689190614ed6565b60405162461bcd60e51b81526004016107a59190615426565b8084848151811061258e57fe5b602090810291909101015250506001016124bd565b5092915050565b6125bb6125b5612f34565b83612fae565b6125f65760405162461bcd60e51b815260040180806020018281038252603181526020018061594b6031913960400191505060405180910390fd5b61260284848484613bb8565b50505050565b60007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166370a08231306040518263ffffffff1660e01b815260040180826001600160a01b0316815260200191505060206040518083038186803b15801561267757600080fd5b505afa15801561268b573d6000803e3d6000fd5b505050506040513d60208110156126a157600080fd5b50519050828110156126ed576040805162461bcd60e51b815260206004820152601060248201526f24b739bab33334b1b4b2b73a102ba12160811b604482015290519081900360640190fd5b80156108a2577f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316632e1a7d4d826040518263ffffffff1660e01b815260040180828152602001915050600060405180830381600087803b15801561275957600080fd5b505af115801561276d573d6000803e3d6000fd5b505050506108a28282613231565b60408051636eb1769f60e11b8152336004820152306024820152905186916001600160a01b0389169163dd62ed3e91604480820192602092909190829003018186803b1580156127ca57600080fd5b505afa1580156127de573d6000803e3d6000fd5b505050506040513d60208110156127f457600080fd5b50511015612462576124628686868686866129ea565b7f000000000000000000000000000000000000000000000000000000000000000081565b606061283982612f27565b61284257600080fd5b60405163e9dc637560e01b81526001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000169063e9dc63759061289090309086906004016153e7565b60006040518083038186803b1580156128a857600080fd5b505afa1580156128bc573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526113bb9190810190614ed6565b6000836001600160a01b03166370a08231306040518263ffffffff1660e01b815260040180826001600160a01b0316815260200191505060206040518083038186803b15801561293357600080fd5b505afa158015612947573d6000803e3d6000fd5b505050506040513d602081101561295d57600080fd5b50519050828110156129ab576040805162461bcd60e51b815260206004820152601260248201527124b739bab33334b1b4b2b73a103a37b5b2b760711b604482015290519081900360640190fd5b801561260257612602848383613c0a565b6001600160a01b03918216600090815260056020908152604080832093909416825291909152205460ff1690565b6040805163d505accf60e01b8152336004820152306024820152604481018790526064810186905260ff8516608482015260a4810184905260c4810183905290516001600160a01b0388169163d505accf9160e480830192600092919082900301818387803b15801561168557600080fd5b6000808235612a6b3382612fae565b612a875760405162461bcd60e51b81526004016107a590615439565b6000612a996060860160408701615036565b6001600160801b03161180612ac657506000612abb6080860160608701615036565b6001600160801b0316115b612acf57600080fd5b600080612ae26040870160208801614b9b565b6001600160a01b031614612b0557612b006040860160208701614b9b565b612b07565b305b85356000908152600c602090815260408083206001808201546001600160501b03168552600b8452828520835160608101855281546001600160a01b039081168252919092015490811694820194909452600160a01b90930462ffffff169183019190915292935090612b9a7f00000000000000000000000000000000000000000000000000000000000000008361304e565b600484015460018501549192506001600160801b0380821692600160801b9283900482169290041615612d9057600185015460405163a34123a760e01b81526001600160a01b0385169163a34123a791612c1191600160501b8104600290810b92600160681b909204900b90600090600401615400565b6040805180830381600087803b158015612c2a57600080fd5b505af1158015612c3e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612c6291906151c8565b5050600185015460009081906001600160a01b0386169063514ea4bf90612ca0903090600160501b8104600290810b91600160681b9004900b61312d565b6040518263ffffffff1660e01b8152600401612cbc91906153de565b60a06040518083038186803b158015612cd457600080fd5b505afa158015612ce8573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612d0c9190615080565b50509250925050612d48876002015483038860010160109054906101000a90046001600160801b03166001600160801b0316600160801b613182565b84019350612d81876003015482038860010160109054906101000a90046001600160801b03166001600160801b0316600160801b613182565b60028801929092556003870155015b6000806001600160801b038416612dad60608e0160408f01615036565b6001600160801b031611612dd057612dcb60608d0160408e01615036565b612dd2565b835b836001600160801b03168d6060016020810190612def9190615036565b6001600160801b031611612e1257612e0d60808e0160608f01615036565b612e14565b835b60018901546040516309e3d67b60e31b81529294509092506001600160a01b03871691634f1eb3d891612e67918c91600160501b8104600290810b92600160681b909204900b908890889060040161530c565b6040805180830381600087803b158015612e8057600080fd5b505af1158015612e94573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612eb89190615052565b6004890180546001600160801b03196001600160801b03918216600160801b878a0384160217168689038216179091556040519281169d50169a508c35907f40d0efd1a53d60ecbf40971b9daf7dc90178c3aadc7aab1765632738fa8b8f0190610cd9908b9086908690615349565b60006113bb600283613d51565b3390565b6000818152600c6020526040902080546001600160601b0316600160601b6001600160a01b038516908102919091179091558190612f75826116bb565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b6000612fb982612f27565b612ff45760405162461bcd60e51b815260040180806020018281038252602c815260200180615828602c913960400191505060405180910390fd5b6000612fff836116bb565b9050806001600160a01b0316846001600160a01b0316148061303a5750836001600160a01b031661302f8461077e565b6001600160a01b0316145b80610fed5750610fed81856129bc565b4290565b600081602001516001600160a01b031682600001516001600160a01b03161061307657600080fd5b50805160208083015160409384015184516001600160a01b0394851681850152939091168385015262ffffff166060808401919091528351808403820181526080840185528051908301206001600160f81b031960a085015294901b6001600160601b03191660a183015260b58201939093527fb08f141592c0050e62ab87dfaa72052ba6475576805a571ff865bf5bcbdb56e460d5808301919091528251808303909101815260f5909101909152805191012090565b604080516001600160601b0319606086901b16602080830191909152600285810b60e890811b60348501529085900b901b60378301528251601a818403018152603a90920190925280519101205b9392505050565b60008080600019858709868602925082811090839003039050806131b857600084116131ad57600080fd5b50829004905061317b565b8084116131c457600080fd5b6000848688096000868103871696879004966002600389028118808a02820302808a02820302808a02820302808a02820302808a02820302808a02909103029181900381900460010186841190950394909402919094039290920491909117919091029150509392505050565b604080516000808252602082019092526001600160a01b0384169083906040518082805190602001908083835b6020831061327d5780518252601f19909201916020918201910161325e565b6001836020036101000a03801982511681845116808217855250505050505090500191505060006040518083038185875af1925050503d80600081146132df576040519150601f19603f3d011682016040523d82523d6000602084013e6132e4565b606091505b50509050806108a2576040805162461bcd60e51b815260206004820152600360248201526253544560e81b604482015290519081900360640190fd5b60006113bb82613d5d565b6000806000806000604051806060016040528087600001516001600160a01b0316815260200187602001516001600160a01b03168152602001876040015162ffffff16815250905061339d7f00000000000000000000000000000000000000000000000000000000000000008261304e565b91506000826001600160a01b0316633850c7bd6040518163ffffffff1660e01b815260040160e06040518083038186803b1580156133da57600080fd5b505afa1580156133ee573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061341291906150e1565b505050505050905060006134298860800151613d61565b9050600061343a8960a00151613d61565b90506134518383838c60c001518d60e00151614093565b9750505050816001600160a01b0316633c8a7d8d876060015188608001518960a00151896040518060400160405280888152602001336001600160a01b03168152506040516020016134a39190615528565b6040516020818303038152906040526040518663ffffffff1660e01b81526004016134d29594939291906152ca565b6040805180830381600087803b1580156134eb57600080fd5b505af11580156134ff573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061352391906151c8565b6101008801519195509350841080159061354257508561012001518310155b61355e5760405162461bcd60e51b81526004016107a5906154ab565b509193509193565b826001600160a01b0316613579826116bb565b6001600160a01b0316146135be5760405162461bcd60e51b81526004018080602001828103825260298152602001806159016029913960400191505060405180910390fd5b6001600160a01b0382166136035760405162461bcd60e51b81526004018080602001828103825260248152602001806157de6024913960400191505060405180910390fd5b61360e8383836108a2565b613619600082612f38565b6001600160a01b038316600090815260016020526040902061363b9082614157565b506001600160a01b038216600090815260016020526040902061365e9082614163565b5061366b6002828461416f565b5080826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a4505050565b60006113b88383614185565b60006136ca838361304e565b9050336001600160a01b038216146113bb57600080fd5b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316846001600160a01b03161480156137225750804710155b15613844577f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663d0e30db0826040518263ffffffff1660e01b81526004016000604051808303818588803b15801561378257600080fd5b505af1158015613796573d6000803e3d6000fd5b50505050507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663a9059cbb83836040518363ffffffff1660e01b815260040180836001600160a01b0316815260200182815260200192505050602060405180830381600087803b15801561381257600080fd5b505af1158015613826573d6000803e3d6000fd5b505050506040513d602081101561383c57600080fd5b506126029050565b6001600160a01b03831630141561386557613860848383613c0a565b612602565b612602848484846141e9565b4690565b6000613880826116bb565b905061388e816000846108a2565b613899600083612f38565b60008281526008602052604090205460026000196101006001841615020190911604156138d75760008281526008602052604081206138d791614b0b565b6001600160a01b03811660009081526001602052604090206138f99083614157565b50613905600283614339565b5060405182906000906001600160a01b038416907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908390a45050565b60008080806139518686614345565b909450925050505b9250929050565b6000610fed8484846143c0565b6000908152600c6020526040902080546001600160601b0319811660016001600160601b039283169081019092161790915590565b3b151590565b6001600160a01b038216613a03576040805162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f2061646472657373604482015290519081900360640190fd5b613a0c81612f27565b15613a5e576040805162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e74656400000000604482015290519081900360640190fd5b613a6a600083836108a2565b6001600160a01b0382166000908152600160205260409020613a8c9082614163565b50613a996002828461416f565b5060405181906001600160a01b038416906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b6001600160a01b0382166000908152600a60205260409020546001600160501b0316806113bb5750600d805460016001600160501b03600160b01b8084048216838101909216026001600160b01b03909316929092179092556001600160a01b038085166000908152600a60209081526040808320805469ffffffffffffffffffff191686179055848352600b825291829020865181549085166001600160a01b031991821617825591870151950180549287015162ffffff16600160a01b0262ffffff60a01b19969094169290911691909117939093161790915592915050565b613bc3848484613566565b613bcf8484848461448a565b6126025760405162461bcd60e51b81526004018080602001828103825260328152602001806157856032913960400191505060405180910390fd5b604080516001600160a01b038481166024830152604480830185905283518084039091018152606490920183526020820180516001600160e01b031663a9059cbb60e01b1781529251825160009485949389169392918291908083835b60208310613c865780518252601f199092019160209182019101613c67565b6001836020036101000a0380198251168184511680821785525050505050509050019150506000604051808303816000865af19150503d8060008114613ce8576040519150601f19603f3d011682016040523d82523d6000602084013e613ced565b606091505b5091509150818015613d1b575080511580613d1b5750808060200190516020811015613d1857600080fd5b50515b61145c576040805162461bcd60e51b815260206004820152600260248201526114d560f21b604482015290519081900360640190fd5b60006113b883836145f2565b5490565b60008060008360020b12613d78578260020b613d80565b8260020b6000035b9050620d89e8811115613dbe576040805162461bcd60e51b81526020600482015260016024820152601560fa1b604482015290519081900360640190fd5b600060018216613dd257600160801b613de4565b6ffffcb933bd6fad37aa2d162d1a5940015b70ffffffffffffffffffffffffffffffffff1690506002821615613e18576ffff97272373d413259a46990580e213a0260801c5b6004821615613e37576ffff2e50f5f656932ef12357cf3c7fdcc0260801c5b6008821615613e56576fffe5caca7e10e4e61c3624eaa0941cd00260801c5b6010821615613e75576fffcb9843d60f6159c9db58835c9266440260801c5b6020821615613e94576fff973b41fa98c081472e6896dfb254c00260801c5b6040821615613eb3576fff2ea16466c96a3843ec78b326b528610260801c5b6080821615613ed2576ffe5dee046a99a2a811c461f1969c30530260801c5b610100821615613ef2576ffcbe86c7900a88aedcffc83b479aa3a40260801c5b610200821615613f12576ff987a7253ac413176f2b074cf7815e540260801c5b610400821615613f32576ff3392b0822b70005940c7a398e4b70f30260801c5b610800821615613f52576fe7159475a2c29b7443b29c7fa6e889d90260801c5b611000821615613f72576fd097f3bdfd2022b8845ad8f792aa58250260801c5b612000821615613f92576fa9f746462d870fdf8a65dc1f90e061e50260801c5b614000821615613fb2576f70d869a156d2a1b890bb3df62baf32f70260801c5b618000821615613fd2576f31be135f97d08fd981231505542fcfa60260801c5b62010000821615613ff3576f09aa508b5b7a84e1c677de54f3e99bc90260801c5b62020000821615614013576e5d6af8dedb81196699c329225ee6040260801c5b62040000821615614032576d2216e584f5fa1ea926041bedfe980260801c5b6208000082161561404f576b048a170391f7dc42444e8fa20260801c5b60008460020b131561406a57806000198161406657fe5b0490505b64010000000081061561407e576001614081565b60005b60ff16602082901c0192505050919050565b6000836001600160a01b0316856001600160a01b031611156140b3579293925b846001600160a01b0316866001600160a01b0316116140de576140d785858561460a565b905061414e565b836001600160a01b0316866001600160a01b0316101561414057600061410587868661460a565b9050600061411487898661466d565b9050806001600160801b0316826001600160801b0316106141355780614137565b815b9250505061414e565b61414b85858461466d565b90505b95945050505050565b60006113b883836146aa565b60006113b88383614770565b6000610fed84846001600160a01b0385166147ba565b815460009082106141c75760405162461bcd60e51b81526004018080602001828103825260228152602001806157636022913960400191505060405180910390fd5b8260000182815481106141d657fe5b9060005260206000200154905092915050565b604080516001600160a01b0385811660248301528481166044830152606480830185905283518084039091018152608490920183526020820180516001600160e01b03166323b872dd60e01b178152925182516000948594938a169392918291908083835b6020831061426d5780518252601f19909201916020918201910161424e565b6001836020036101000a0380198251168184511680821785525050505050509050019150506000604051808303816000865af19150503d80600081146142cf576040519150601f19603f3d011682016040523d82523d6000602084013e6142d4565b606091505b509150915081801561430257508051158061430257508080602001905160208110156142ff57600080fd5b50515b612462576040805162461bcd60e51b815260206004820152600360248201526229aa2360e91b604482015290519081900360640190fd5b60006113b88383614851565b8154600090819083106143895760405162461bcd60e51b81526004018080602001828103825260228152602001806158df6022913960400191505060405180910390fd5b600084600001848154811061439a57fe5b906000526020600020906002020190508060000154816001015492509250509250929050565b6000828152600184016020526040812054828161445b5760405162461bcd60e51b81526004018080602001828103825283818151815260200191508051906020019080838360005b83811015614420578181015183820152602001614408565b50505050905090810190601f16801561444d5780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b5084600001600182038154811061446e57fe5b9060005260206000209060020201600101549150509392505050565b600061449e846001600160a01b03166139a2565b6144aa57506001610fed565b60006145b8630a85bd0160e11b6144bf612f34565b88878760405160240180856001600160a01b03168152602001846001600160a01b0316815260200183815260200180602001828103825283818151815260200191508051906020019080838360005b8381101561452657818101518382015260200161450e565b50505050905090810190601f1680156145535780820380516001836020036101000a031916815260200191505b5095505050505050604051602081830303815290604052906001600160e01b0319166020820180516001600160e01b038381831617835250505050604051806060016040528060328152602001615785603291396001600160a01b0388169190614925565b905060008180602001905160208110156145d157600080fd5b50516001600160e01b031916630a85bd0160e11b1492505050949350505050565b60009081526001919091016020526040902054151590565b6000826001600160a01b0316846001600160a01b0316111561462a579192915b600061464d856001600160a01b0316856001600160a01b0316600160601b613182565b905061414e61466884838888036001600160a01b0316613182565b614934565b6000826001600160a01b0316846001600160a01b0316111561468d579192915b610fed61466883600160601b8787036001600160a01b0316613182565b6000818152600183016020526040812054801561476657835460001980830191908101906000908790839081106146dd57fe5b90600052602060002001549050808760000184815481106146fa57fe5b60009182526020808320909101929092558281526001898101909252604090209084019055865487908061472a57fe5b600190038181906000526020600020016000905590558660010160008781526020019081526020016000206000905560019450505050506113bb565b60009150506113bb565b600061477c83836145f2565b6147b2575081546001818101845560008481526020808220909301849055845484825282860190935260409020919091556113bb565b5060006113bb565b60008281526001840160205260408120548061481f57505060408051808201825283815260208082018481528654600181810189556000898152848120955160029093029095019182559151908201558654868452818801909252929091205561317b565b8285600001600183038154811061483257fe5b906000526020600020906002020160010181905550600091505061317b565b60008181526001830160205260408120548015614766578354600019808301919081019060009087908390811061488457fe5b90600052602060002090600202019050808760000184815481106148a457fe5b6000918252602080832084546002909302019182556001938401549184019190915583548252898301905260409020908401905586548790806148e357fe5b60008281526020808220600260001990940193840201828155600190810183905592909355888152898201909252604082209190915594506113bb9350505050565b6060610fed848460008561494a565b806001600160801b03811681146106e357600080fd5b60608247101561498b5760405162461bcd60e51b81526004018080602001828103825260268152602001806158026026913960400191505060405180910390fd5b614994856139a2565b6149e5576040805162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000604482015290519081900360640190fd5b600080866001600160a01b031685876040518082805190602001908083835b60208310614a235780518252601f199092019160209182019101614a04565b6001836020036101000a03801982511681845116808217855250505050505090500191505060006040518083038185875af1925050503d8060008114614a85576040519150601f19603f3d011682016040523d82523d6000602084013e614a8a565b606091505b5091509150614a9a828286614aa5565b979650505050505050565b60608315614ab457508161317b565b825115614ac45782518084602001fd5b60405162461bcd60e51b8152602060048201818152845160248401528451859391928392604401919085019080838360008315614420578181015183820152602001614408565b50805460018160011615610100020316600290046000825580601f10614b315750614b4f565b601f016020900490600052602060002090810190614b4f9190614b52565b50565b5b80821115614b675760008155600101614b53565b5090565b80356106e38161570c565b805161ffff811681146106e357600080fd5b803562ffffff811681146106e357600080fd5b600060208284031215614bac578081fd5b813561317b8161570c565b60008060408385031215614bc9578081fd5b8235614bd48161570c565b91506020830135614be48161570c565b809150509250929050565b60008060008060808587031215614c04578182fd5b8435614c0f8161570c565b93506020850135614c1f8161570c565b9250614c2d60408601614b88565b91506060850135614c3d8161570c565b939692955090935050565b600080600060608486031215614c5c578081fd5b8335614c678161570c565b92506020840135614c778161570c565b929592945050506040919091013590565b60008060008060808587031215614c9d578182fd5b8435614ca88161570c565b93506020850135614cb88161570c565b925060408501359150606085013567ffffffffffffffff811115614cda578182fd5b8501601f81018713614cea578182fd5b8035614cfd614cf8826156be565b61569a565b818152886020838501011115614d11578384fd5b81602084016020830137908101602001929092525092959194509250565b60008060408385031215614d41578182fd5b8235614d4c8161570c565b91506020830135614be481615721565b60008060408385031215614d6e578182fd5b8235614d798161570c565b946020939093013593505050565b600080600060608486031215614d9b578081fd5b8335614da68161570c565b9250602084013591506040840135614dbd8161570c565b809150509250925092565b60008060008060008060c08789031215614de0578384fd5b8635614deb8161570c565b955060208701359450604087013593506060870135614e0981615753565b9598949750929560808101359460a0909101359350915050565b60008060208385031215614e35578182fd5b823567ffffffffffffffff80821115614e4c578384fd5b818501915085601f830112614e5f578384fd5b813581811115614e6d578485fd5b8660208083028501011115614e80578485fd5b60209290920196919550909350505050565b600060208284031215614ea3578081fd5b81356001600160e01b03198116811461317b578182fd5b600060208284031215614ecb578081fd5b813561317b8161572f565b600060208284031215614ee7578081fd5b815167ffffffffffffffff811115614efd578182fd5b8201601f81018413614f0d578182fd5b8051614f1b614cf8826156be565b818152856020838501011115614f2f578384fd5b61414e8260208301602086016156e0565b600060808284031215614f51578081fd5b50919050565b600060a08284031215614f51578081fd5b600060c08284031215614f51578081fd5b60008183036080811215614f8b578182fd5b6040516040810167ffffffffffffffff8282108183111715614fa957fe5b816040526060841215614fba578485fd5b60a0830193508184108185111715614fce57fe5b508260405284359250614fe08361570c565b918252602084013591614ff28361570c565b82606083015261500460408601614b88565b6080830152815261501760608501614b6b565b6020820152949350505050565b60006101608284031215614f51578081fd5b600060208284031215615047578081fd5b813561317b8161573e565b60008060408385031215615064578182fd5b825161506f8161573e565b6020840151909250614be48161573e565b600080600080600060a08688031215615097578283fd5b85516150a28161573e565b80955050602086015193506040860151925060608601516150c28161573e565b60808701519092506150d38161573e565b809150509295509295909350565b600080600080600080600060e0888a0312156150fb578485fd5b87516151068161570c565b60208901519097506151178161572f565b955061512560408901614b76565b945061513360608901614b76565b935061514160808901614b76565b925060a088015161515181615753565b60c089015190925061516281615721565b8091505092959891949750929550565b600060208284031215615183578081fd5b6113b882614b88565b60006020828403121561519d578081fd5b5035919050565b600080604083850312156151b6578182fd5b823591506020830135614be48161570c565b600080604083850312156151da578182fd5b505080516020909101519092909150565b60008060008060608587031215615200578182fd5b8435935060208501359250604085013567ffffffffffffffff80821115615225578384fd5b818701915087601f830112615238578384fd5b813581811115615246578485fd5b886020828501011115615257578485fd5b95989497505060200194505050565b6000815180845261527e8160208601602086016156e0565b601f01601f19169290920160200192915050565b60020b9052565b6001600160801b03169052565b6000828483379101908152919050565b6001600160a01b0391909116815260200190565b600060018060a01b03871682528560020b60208301528460020b60408301526001600160801b038416606083015260a06080830152614a9a60a0830184615266565b6001600160a01b03959095168552600293840b60208601529190920b60408401526001600160801b03918216606084015216608082015260a00190565b6001600160a01b039390931683526001600160801b03918216602084015216604082015260600190565b6000602080830181845280855180835260408601915060408482028701019250838701855b828110156153c657603f198886030184526153b4858351615266565b94509285019290850190600101615398565b5092979650505050505050565b901515815260200190565b90815260200190565b6001600160a01b03929092168252602082015260400190565b600293840b81529190920b60208201526001600160801b03909116604082015260600190565b6000602082526113b86020830184615266565b6020808252600c908201526b139bdd08185c1c1c9bdd995960a21b604082015260600190565b6020808252602c908201527f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860408201526b34b9ba32b73a103a37b5b2b760a11b606082015260800190565b602080825260149082015273507269636520736c69707061676520636865636b60601b604082015260600190565b60208082526010908201526f125b9d985b1a59081d1bdad95b88125160821b604082015260600190565b6020808252600b908201526a139bdd0818db19585c995960aa1b604082015260600190565b815180516001600160a01b03908116835260208083015182168185015260409283015162ffffff1692840192909252920151909116606082015260800190565b6001600160801b039390931683526020830191909152604082015260600190565b9384526001600160801b039290921660208401526040830152606082015260800190565b918252602082015260400190565b6001600160601b038d1681526001600160a01b038c811660208301528b811660408301528a16606082015262ffffff89166080820152600288900b60a0820152610180810161560d60c0830189615292565b61561a60e0830188615299565b8561010083015284610120830152615636610140830185615299565b615644610160830184615299565b9d9c50505050505050505050505050565b6000808335601e1984360301811261566b578283fd5b83018035915067ffffffffffffffff821115615685578283fd5b60200191503681900382131561395957600080fd5b60405181810167ffffffffffffffff811182821017156156b657fe5b604052919050565b600067ffffffffffffffff8211156156d257fe5b50601f01601f191660200190565b60005b838110156156fb5781810151838201526020016156e3565b838111156126025750506000910152565b6001600160a01b0381168114614b4f57600080fd5b8015158114614b4f57600080fd5b8060020b8114614b4f57600080fd5b6001600160801b0381168114614b4f57600080fd5b60ff81168114614b4f57600080fdfe456e756d657261626c655365743a20696e646578206f7574206f6620626f756e64734552433732313a207472616e7366657220746f206e6f6e20455243373231526563656976657220696d706c656d656e7465724552433732315065726d69743a20617070726f76616c20746f2063757272656e74206f776e65724552433732313a207472616e7366657220746f20746865207a65726f2061646472657373416464726573733a20696e73756666696369656e742062616c616e636520666f722063616c6c4552433732313a206f70657261746f7220717565727920666f72206e6f6e6578697374656e7420746f6b656e4552433732313a20617070726f76652063616c6c6572206973206e6f74206f776e6572206e6f7220617070726f76656420666f7220616c6c4552433732313a2062616c616e636520717565727920666f7220746865207a65726f20616464726573734552433732313a206f776e657220717565727920666f72206e6f6e6578697374656e7420746f6b656e456e756d657261626c654d61703a20696e646578206f7574206f6620626f756e64734552433732313a207472616e73666572206f6620746f6b656e2074686174206973206e6f74206f776e4552433732313a20617070726f76616c20746f2063757272656e74206f776e65724552433732313a207472616e736665722063616c6c6572206973206e6f74206f776e6572206e6f7220617070726f766564a26469706673582212206c5d0f0a6fcb88da04ead4345c45b136940987b60bf534cf5a03abf88775f7ff64736f6c63430007060033";
var deployedBytecode = "0x6080604052600436106102295760003560e01c80636352211e11610123578063ac9650d8116100ab578063c87b56dd1161006f578063c87b56dd1461064c578063df2ab5bb1461066c578063e985e9c51461067f578063f3995c671461069f578063fc6f7865146106b257610297565b8063ac9650d8146105d1578063b88d4fde146105f1578063bb4d237f14610611578063c2e3140a14610624578063c45a01551461063757610297565b806388316456116100f2578063883164561461052e57806395d89b411461055157806399fbab8814610566578063a22cb4651461059e578063a4a78f0c146105be57610297565b80636352211e146104c65780636c0360eb146104e657806370a08231146104fb5780637ac2ff7b1461051b57610297565b806323a82e0d116101b15780633644e515116101755780633644e5151461044b57806342842e0e1461046057806342966c68146104805780634659a494146104935780634f6ccce7146104a657610297565b806323a82e0d146103c157806323b872dd146103d65780632f745c59146103f657806330adf81f1461041657806330b4dcec1461042b57610297565b80630c49ccbe116101f85780630c49ccbe1461034157806312210e8a1461036257806313ead5621461036a57806318160ddd1461037d578063219f5d171461039f57610297565b806301ffc9a71461029c57806306fdde03146102d2578063081812fc146102f4578063095ea7b31461032157610297565b3661029757336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614610295576040805162461bcd60e51b81526020600482015260076024820152662737ba102ba12160c91b604482015290519081900360640190fd5b005b600080fd5b3480156102a857600080fd5b506102bc6102b7366004614e92565b6106c5565b6040516102c991906153d3565b60405180910390f35b3480156102de57600080fd5b506102e76106e8565b6040516102c99190615426565b34801561030057600080fd5b5061031461030f36600461518c565b61077e565b6040516102c991906152b6565b34801561032d57600080fd5b5061029561033c366004614d5c565b6107d1565b61035461034f366004614f57565b6108a7565b6040516102c99291906155ad565b610295610cef565b610314610378366004614bef565b610d01565b34801561038957600080fd5b50610392610ff5565b6040516102c991906153de565b6103b26103ad366004614f68565b611006565b6040516102c993929190615568565b3480156103cd57600080fd5b5061031461131b565b3480156103e257600080fd5b506102956103f1366004614c48565b61133f565b34801561040257600080fd5b50610392610411366004614d5c565b611396565b34801561042257600080fd5b506103926113c1565b34801561043757600080fd5b506102956104463660046151eb565b6113e5565b34801561045757600080fd5b50610392611463565b34801561046c57600080fd5b5061029561047b366004614c48565b611521565b61029561048e36600461518c565b61153c565b6102956104a1366004614dc8565b61160b565b3480156104b257600080fd5b506103926104c136600461518c565b6116a5565b3480156104d257600080fd5b506103146104e136600461518c565b6116bb565b3480156104f257600080fd5b506102e76116e3565b34801561050757600080fd5b50610392610516366004614b9b565b6116e8565b610295610529366004614dc8565b611750565b61054161053c366004615024565b611b42565b6040516102c99493929190615589565b34801561055d57600080fd5b506102e761205a565b34801561057257600080fd5b5061058661058136600461518c565b6120bb565b6040516102c99c9b9a999897969594939291906155bb565b3480156105aa57600080fd5b506102956105b9366004614d2f565b6122cc565b6102956105cc366004614dc8565b6123d1565b6105e46105df366004614e23565b61246a565b6040516102c99190615373565b3480156105fd57600080fd5b5061029561060c366004614c88565b6125aa565b61029561061f3660046151a4565b612608565b610295610632366004614dc8565b61277b565b34801561064357600080fd5b5061031461280a565b34801561065857600080fd5b506102e761066736600461518c565b61282e565b61029561067a366004614d87565b6128e4565b34801561068b57600080fd5b506102bc61069a366004614bb7565b6129bc565b6102956106ad366004614dc8565b6129ea565b6103546106c0366004614f40565b612a5c565b6001600160e01b0319811660009081526020819052604090205460ff165b919050565b60068054604080516020601f60026000196101006001881615020190951694909404938401819004810282018101909252828152606093909290918301828280156107745780601f1061074957610100808354040283529160200191610774565b820191906000526020600020905b81548152906001019060200180831161075757829003601f168201915b5050505050905090565b600061078982612f27565b6107ae5760405162461bcd60e51b81526004016107a59061545f565b60405180910390fd5b506000908152600c6020526040902054600160601b90046001600160a01b031690565b60006107dc826116bb565b9050806001600160a01b0316836001600160a01b0316141561082f5760405162461bcd60e51b815260040180806020018281038252602181526020018061592a6021913960400191505060405180910390fd5b806001600160a01b0316610841612f34565b6001600160a01b0316148061085d575061085d8161069a612f34565b6108985760405162461bcd60e51b81526004018080602001828103825260388152602001806158546038913960400191505060405180910390fd5b6108a28383612f38565b505050565b60008082356108b63382612fae565b6108d25760405162461bcd60e51b81526004016107a590615439565b8360800135806108e061304a565b1115610929576040805162461bcd60e51b8152602060048201526013602482015272151c985b9cd858dd1a5bdb881d1bdbc81bdb19606a1b604482015290519081900360640190fd5b600061093b6040870160208801615036565b6001600160801b03161161094e57600080fd5b84356000908152600c602090815260409182902060018101549092600160801b9091046001600160801b031691610989918901908901615036565b6001600160801b0316816001600160801b031610156109a757600080fd5b6001828101546001600160501b03166000908152600b60209081526040808320815160608101835281546001600160a01b039081168252919095015490811692850192909252600160a01b90910462ffffff1690830152610a287f00000000000000000000000000000000000000000000000000000000000000008361304e565b60018501549091506001600160a01b0382169063a34123a790600160501b8104600290810b91600160681b9004900b610a6760408e0160208f01615036565b6040518463ffffffff1660e01b8152600401610a8593929190615400565b6040805180830381600087803b158015610a9e57600080fd5b505af1158015610ab2573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ad691906151c8565b909850965060408901358810801590610af3575088606001358710155b610b0f5760405162461bcd60e51b81526004016107a5906154ab565b6001840154600090610b38903090600160501b8104600290810b91600160681b9004900b61312d565b9050600080836001600160a01b031663514ea4bf846040518263ffffffff1660e01b8152600401610b6991906153de565b60a06040518083038186803b158015610b8157600080fd5b505afa158015610b95573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610bb99190615080565b50509250925050610bde87600201548303876001600160801b0316600160801b613182565b6004880180546001600160801b03198116928e016001600160801b039182160181169290921790556003880154610c1f91908303908816600160801b613182565b6004880180546001600160801b03808216938e01600160801b9283900482160116029190911790556002870182905560038701819055610c6560408d0160208e01615036565b86038760010160106101000a8154816001600160801b0302191690836001600160801b031602179055508b600001357f26f6a048ee9138f2c0ce266f322cb99228e8d619ae2bff30c67f8dcf9d2377b48d6020016020810190610cc89190615036565b8d8d604051610cd993929190615568565b60405180910390a2505050505050505050915091565b4715610cff57610cff3347613231565b565b6000836001600160a01b0316856001600160a01b031610610d2157600080fd5b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316631698ee828686866040518463ffffffff1660e01b815260040180846001600160a01b03168152602001836001600160a01b031681526020018262ffffff168152602001935050505060206040518083038186803b158015610dac57600080fd5b505afa158015610dc0573d6000803e3d6000fd5b505050506040513d6020811015610dd657600080fd5b505190506001600160a01b038116610f0c577f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663a16712958686866040518463ffffffff1660e01b815260040180846001600160a01b03168152602001836001600160a01b031681526020018262ffffff1681526020019350505050602060405180830381600087803b158015610e7557600080fd5b505af1158015610e89573d6000803e3d6000fd5b505050506040513d6020811015610e9f57600080fd5b50516040805163f637731d60e01b81526001600160a01b03858116600483015291519293509083169163f637731d9160248082019260009290919082900301818387803b158015610eef57600080fd5b505af1158015610f03573d6000803e3d6000fd5b50505050610fed565b6000816001600160a01b0316633850c7bd6040518163ffffffff1660e01b815260040160e06040518083038186803b158015610f4757600080fd5b505afa158015610f5b573d6000803e3d6000fd5b505050506040513d60e0811015610f7157600080fd5b505190506001600160a01b038116610feb57816001600160a01b031663f637731d846040518263ffffffff1660e01b815260040180826001600160a01b03168152602001915050600060405180830381600087803b158015610fd257600080fd5b505af1158015610fe6573d6000803e3d6000fd5b505050505b505b949350505050565b60006110016002613320565b905090565b60008060008360a001358061101961304a565b1115611062576040805162461bcd60e51b8152602060048201526013602482015272151c985b9cd858dd1a5bdb881d1bdbc81bdb19606a1b604482015290519081900360640190fd5b84356000908152600c602090815260408083206001808201546001600160501b0381168652600b855283862084516060808201875282546001600160a01b039081168352929094015480831682890190815262ffffff600160a01b9092048216838901908152885161014081018a528451861681529151909416818a0152925116828701523082850152600160501b8304600290810b810b608080850191909152600160681b909404810b900b60a0830152958c013560c0820152938b013560e0850152908a013561010084015289013561012083015292906111449061332b565b6001870154939a5091985096509150600090611177903090600160501b8104600290810b91600160681b9004900b61312d565b9050600080836001600160a01b031663514ea4bf846040518263ffffffff1660e01b81526004016111a891906153de565b60a06040518083038186803b1580156111c057600080fd5b505afa1580156111d4573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906111f89190615080565b50509250925050611234866002015483038760010160109054906101000a90046001600160801b03166001600160801b0316600160801b613182565b6004870180546001600160801b0380821690930183166001600160801b03199091161790556003870154600188015461127b9291840391600160801b918290041690613182565b6004870180546001600160801b03600160801b80830482169094018116840291811691909117909155600288018490556003880183905560018801805483810483168e018316909302929091169190911790556040518b35907f3067048beee31b25b2f1681f88dac838c8bba36af25bfb2b7cf7473a5847e35f90611305908d908d908d90615568565b60405180910390a2505050505050509193909250565b7f000000000000000000000000000000000000000000000000000000000000000081565b61135061134a612f34565b82612fae565b61138b5760405162461bcd60e51b815260040180806020018281038252603181526020018061594b6031913960400191505060405180910390fd5b6108a2838383613566565b6001600160a01b03821660009081526001602052604081206113b890836136b2565b90505b92915050565b7f49ecf333e5b8c95c40fdafc95c1ad136e8914a8fb55e9dc8bb01eaa83a2df9ad81565b60006113f382840184614f79565b90506114237f000000000000000000000000000000000000000000000000000000000000000082600001516136be565b50841561143e57805151602082015161143e919033886136e1565b831561145c5761145c816000015160200151826020015133876136e1565b5050505050565b60007f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f7f00000000000000000000000000000000000000000000000000000000000000007f00000000000000000000000000000000000000000000000000000000000000006114d0613871565b3060405160200180868152602001858152602001848152602001838152602001826001600160a01b031681526020019550505050505060405160208183030381529060405280519060200120905090565b6108a2838383604051806020016040528060008152506125aa565b806115473382612fae565b6115635760405162461bcd60e51b81526004016107a590615439565b6000828152600c602052604090206001810154600160801b90046001600160801b031615801561159e575060048101546001600160801b0316155b80156115bc57506004810154600160801b90046001600160801b0316155b6115d85760405162461bcd60e51b81526004016107a590615503565b6000838152600c60205260408120818155600181018290556002810182905560038101829055600401556108a283613875565b604080516323f2ebc360e21b815233600482015230602482015260448101879052606481018690526001608482015260ff851660a482015260c4810184905260e4810183905290516001600160a01b03881691638fcbaf0c9161010480830192600092919082900301818387803b15801561168557600080fd5b505af1158015611699573d6000803e3d6000fd5b50505050505050505050565b6000806116b3600284613942565b509392505050565b60006113bb826040518060600160405280602981526020016158b66029913960029190613960565b606090565b60006001600160a01b03821661172f5760405162461bcd60e51b815260040180806020018281038252602a81526020018061588c602a913960400191505060405180910390fd5b6001600160a01b03821660009081526001602052604090206113bb90613320565b8361175961304a565b111561179d576040805162461bcd60e51b815260206004820152600e60248201526d14195c9b5a5d08195e1c1a5c995960921b604482015290519081900360640190fd5b60006117a7611463565b7f49ecf333e5b8c95c40fdafc95c1ad136e8914a8fb55e9dc8bb01eaa83a2df9ad88886117d38161396d565b604080516020808201969096526001600160a01b03909416848201526060840192909252608083015260a08083018a90528151808403909101815260c08301825280519084012061190160f01b60e084015260e28301949094526101028083019490945280518083039094018452610122909101905281519101209050600061185b876116bb565b9050806001600160a01b0316886001600160a01b031614156118ae5760405162461bcd60e51b81526004018080602001828103825260278152602001806157b76027913960400191505060405180910390fd5b6118b7816139a2565b15611a1f576040805160208082018790528183018690526001600160f81b031960f889901b1660608301528251604181840301815260618301808552630b135d3f60e11b90526065830186815260858401948552815160a585015281516001600160a01b03871695631626ba7e958995919260c59091019185019080838360005b83811015611950578181015183820152602001611938565b50505050905090810190601f16801561197d5780820380516001836020036101000a031916815260200191505b50935050505060206040518083038186803b15801561199b57600080fd5b505afa1580156119af573d6000803e3d6000fd5b505050506040513d60208110156119c557600080fd5b50516001600160e01b031916630b135d3f60e11b14611a1a576040805162461bcd60e51b815260206004820152600c60248201526b155b985d5d1a1bdc9a5e995960a21b604482015290519081900360640190fd5b611b2e565b600060018387878760405160008152602001604052604051808581526020018460ff1681526020018381526020018281526020019450505050506020604051602081039080840390855afa158015611a7b573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b038116611ad7576040805162461bcd60e51b8152602060048201526011602482015270496e76616c6964207369676e617475726560781b604482015290519081900360640190fd5b816001600160a01b0316816001600160a01b031614611b2c576040805162461bcd60e51b815260206004820152600c60248201526b155b985d5d1a1bdc9a5e995960a21b604482015290519081900360640190fd5b505b611b388888612f38565b5050505050505050565b60008060008084610140013580611b5761304a565b1115611ba0576040805162461bcd60e51b8152602060048201526013602482015272151c985b9cd858dd1a5bdb881d1bdbc81bdb19606a1b604482015290519081900360640190fd5b604080516101408101909152600090611c6c9080611bc160208b018b614b9b565b6001600160a01b03168152602001896020016020810190611be29190614b9b565b6001600160a01b03168152602001611c0060608b0160408c01615172565b62ffffff168152306020820152604001611c2060808b0160608c01614eba565b60020b8152602001611c3860a08b0160808c01614eba565b60020b81526020018960a0013581526020018960c0013581526020018960e00135815260200189610100013581525061332b565b92975090955093509050611cb9611c8b61014089016101208a01614b9b565b600d80546001600160b01b0319811660016001600160b01b03928316908101909216179091559750876139a8565b6000611ce430611ccf60808b0160608c01614eba565b611cdf60a08c0160808d01614eba565b61312d565b9050600080836001600160a01b031663514ea4bf846040518263ffffffff1660e01b8152600401611d1591906153de565b60a06040518083038186803b158015611d2d57600080fd5b505afa158015611d41573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611d659190615080565b505092509250506000611dde8560405180606001604052808e6000016020810190611d909190614b9b565b6001600160a01b031681526020018e6020016020810190611db19190614b9b565b6001600160a01b031681526020018e6040016020810190611dd29190615172565b62ffffff169052613ad6565b905060405180610140016040528060006001600160601b0316815260200160006001600160a01b03168152602001826001600160501b031681526020018c6060016020810190611e2e9190614eba565b60020b8152602001611e4660a08e0160808f01614eba565b60020b81526020018a6001600160801b0316815260200184815260200183815260200160006001600160801b0316815260200160006001600160801b0316815250600c60008c815260200190815260200160002060008201518160000160006101000a8154816001600160601b0302191690836001600160601b03160217905550602082015181600001600c6101000a8154816001600160a01b0302191690836001600160a01b0316021790555060408201518160010160006101000a8154816001600160501b0302191690836001600160501b03160217905550606082015181600101600a6101000a81548162ffffff021916908360020b62ffffff160217905550608082015181600101600d6101000a81548162ffffff021916908360020b62ffffff16021790555060a08201518160010160106101000a8154816001600160801b0302191690836001600160801b0316021790555060c0820151816002015560e082015181600301556101008201518160040160006101000a8154816001600160801b0302191690836001600160801b031602179055506101208201518160040160106101000a8154816001600160801b0302191690836001600160801b03160217905550905050897f3067048beee31b25b2f1681f88dac838c8bba36af25bfb2b7cf7473a5847e35f8a8a8a60405161204593929190615568565b60405180910390a25050505050509193509193565b60078054604080516020601f60026000196101006001881615020190951694909404938401819004810282018101909252828152606093909290918301828280156107745780601f1061074957610100808354040283529160200191610774565b6000818152600c6020908152604080832081516101408101835281546001600160601b03811682526001600160a01b03600160601b909104169381019390935260018101546001600160501b038116928401839052600160501b8104600290810b810b810b6060860152600160681b8204810b810b810b60808601526001600160801b03600160801b92839004811660a08701529083015460c0860152600383015460e0860152600490920154808316610100860152041661012083015282918291829182918291829182918291829182918291906121ac5760405162461bcd60e51b81526004016107a5906154d9565b6000600b600083604001516001600160501b03166001600160501b031681526020019081526020016000206040518060600160405290816000820160009054906101000a90046001600160a01b03166001600160a01b03166001600160a01b031681526020016001820160009054906101000a90046001600160a01b03166001600160a01b03166001600160a01b031681526020016001820160149054906101000a900462ffffff1662ffffff1662ffffff1681525050905081600001518260200151826000015183602001518460400151866060015187608001518860a001518960c001518a60e001518b61010001518c61012001519d509d509d509d509d509d509d509d509d509d509d509d50505091939597999b5091939597999b565b6122d4612f34565b6001600160a01b0316826001600160a01b0316141561233a576040805162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c657200000000000000604482015290519081900360640190fd5b8060056000612347612f34565b6001600160a01b03908116825260208083019390935260409182016000908120918716808252919093529120805460ff19169215159290921790915561238b612f34565b6001600160a01b03167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c318360405180821515815260200191505060405180910390a35050565b60408051636eb1769f60e11b81523360048201523060248201529051600019916001600160a01b0389169163dd62ed3e91604480820192602092909190829003018186803b15801561242257600080fd5b505afa158015612436573d6000803e3d6000fd5b505050506040513d602081101561244c57600080fd5b505110156124625761246286868686868661160b565b505050505050565b60608167ffffffffffffffff8111801561248357600080fd5b506040519080825280602002602001820160405280156124b757816020015b60608152602001906001900390816124a25790505b50905060005b828110156125a357600080308686858181106124d557fe5b90506020028101906124e79190615655565b6040516124f59291906152a6565b600060405180830381855af49150503d8060008114612530576040519150601f19603f3d011682016040523d82523d6000602084013e612535565b606091505b5091509150816125815760448151101561254e57600080fd5b600481019050808060200190518101906125689190614ed6565b60405162461bcd60e51b81526004016107a59190615426565b8084848151811061258e57fe5b602090810291909101015250506001016124bd565b5092915050565b6125bb6125b5612f34565b83612fae565b6125f65760405162461bcd60e51b815260040180806020018281038252603181526020018061594b6031913960400191505060405180910390fd5b61260284848484613bb8565b50505050565b60007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166370a08231306040518263ffffffff1660e01b815260040180826001600160a01b0316815260200191505060206040518083038186803b15801561267757600080fd5b505afa15801561268b573d6000803e3d6000fd5b505050506040513d60208110156126a157600080fd5b50519050828110156126ed576040805162461bcd60e51b815260206004820152601060248201526f24b739bab33334b1b4b2b73a102ba12160811b604482015290519081900360640190fd5b80156108a2577f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316632e1a7d4d826040518263ffffffff1660e01b815260040180828152602001915050600060405180830381600087803b15801561275957600080fd5b505af115801561276d573d6000803e3d6000fd5b505050506108a28282613231565b60408051636eb1769f60e11b8152336004820152306024820152905186916001600160a01b0389169163dd62ed3e91604480820192602092909190829003018186803b1580156127ca57600080fd5b505afa1580156127de573d6000803e3d6000fd5b505050506040513d60208110156127f457600080fd5b50511015612462576124628686868686866129ea565b7f000000000000000000000000000000000000000000000000000000000000000081565b606061283982612f27565b61284257600080fd5b60405163e9dc637560e01b81526001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000169063e9dc63759061289090309086906004016153e7565b60006040518083038186803b1580156128a857600080fd5b505afa1580156128bc573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526113bb9190810190614ed6565b6000836001600160a01b03166370a08231306040518263ffffffff1660e01b815260040180826001600160a01b0316815260200191505060206040518083038186803b15801561293357600080fd5b505afa158015612947573d6000803e3d6000fd5b505050506040513d602081101561295d57600080fd5b50519050828110156129ab576040805162461bcd60e51b815260206004820152601260248201527124b739bab33334b1b4b2b73a103a37b5b2b760711b604482015290519081900360640190fd5b801561260257612602848383613c0a565b6001600160a01b03918216600090815260056020908152604080832093909416825291909152205460ff1690565b6040805163d505accf60e01b8152336004820152306024820152604481018790526064810186905260ff8516608482015260a4810184905260c4810183905290516001600160a01b0388169163d505accf9160e480830192600092919082900301818387803b15801561168557600080fd5b6000808235612a6b3382612fae565b612a875760405162461bcd60e51b81526004016107a590615439565b6000612a996060860160408701615036565b6001600160801b03161180612ac657506000612abb6080860160608701615036565b6001600160801b0316115b612acf57600080fd5b600080612ae26040870160208801614b9b565b6001600160a01b031614612b0557612b006040860160208701614b9b565b612b07565b305b85356000908152600c602090815260408083206001808201546001600160501b03168552600b8452828520835160608101855281546001600160a01b039081168252919092015490811694820194909452600160a01b90930462ffffff169183019190915292935090612b9a7f00000000000000000000000000000000000000000000000000000000000000008361304e565b600484015460018501549192506001600160801b0380821692600160801b9283900482169290041615612d9057600185015460405163a34123a760e01b81526001600160a01b0385169163a34123a791612c1191600160501b8104600290810b92600160681b909204900b90600090600401615400565b6040805180830381600087803b158015612c2a57600080fd5b505af1158015612c3e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612c6291906151c8565b5050600185015460009081906001600160a01b0386169063514ea4bf90612ca0903090600160501b8104600290810b91600160681b9004900b61312d565b6040518263ffffffff1660e01b8152600401612cbc91906153de565b60a06040518083038186803b158015612cd457600080fd5b505afa158015612ce8573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612d0c9190615080565b50509250925050612d48876002015483038860010160109054906101000a90046001600160801b03166001600160801b0316600160801b613182565b84019350612d81876003015482038860010160109054906101000a90046001600160801b03166001600160801b0316600160801b613182565b60028801929092556003870155015b6000806001600160801b038416612dad60608e0160408f01615036565b6001600160801b031611612dd057612dcb60608d0160408e01615036565b612dd2565b835b836001600160801b03168d6060016020810190612def9190615036565b6001600160801b031611612e1257612e0d60808e0160608f01615036565b612e14565b835b60018901546040516309e3d67b60e31b81529294509092506001600160a01b03871691634f1eb3d891612e67918c91600160501b8104600290810b92600160681b909204900b908890889060040161530c565b6040805180830381600087803b158015612e8057600080fd5b505af1158015612e94573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612eb89190615052565b6004890180546001600160801b03196001600160801b03918216600160801b878a0384160217168689038216179091556040519281169d50169a508c35907f40d0efd1a53d60ecbf40971b9daf7dc90178c3aadc7aab1765632738fa8b8f0190610cd9908b9086908690615349565b60006113bb600283613d51565b3390565b6000818152600c6020526040902080546001600160601b0316600160601b6001600160a01b038516908102919091179091558190612f75826116bb565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b6000612fb982612f27565b612ff45760405162461bcd60e51b815260040180806020018281038252602c815260200180615828602c913960400191505060405180910390fd5b6000612fff836116bb565b9050806001600160a01b0316846001600160a01b0316148061303a5750836001600160a01b031661302f8461077e565b6001600160a01b0316145b80610fed5750610fed81856129bc565b4290565b600081602001516001600160a01b031682600001516001600160a01b03161061307657600080fd5b50805160208083015160409384015184516001600160a01b0394851681850152939091168385015262ffffff166060808401919091528351808403820181526080840185528051908301206001600160f81b031960a085015294901b6001600160601b03191660a183015260b58201939093527fb08f141592c0050e62ab87dfaa72052ba6475576805a571ff865bf5bcbdb56e460d5808301919091528251808303909101815260f5909101909152805191012090565b604080516001600160601b0319606086901b16602080830191909152600285810b60e890811b60348501529085900b901b60378301528251601a818403018152603a90920190925280519101205b9392505050565b60008080600019858709868602925082811090839003039050806131b857600084116131ad57600080fd5b50829004905061317b565b8084116131c457600080fd5b6000848688096000868103871696879004966002600389028118808a02820302808a02820302808a02820302808a02820302808a02820302808a02909103029181900381900460010186841190950394909402919094039290920491909117919091029150509392505050565b604080516000808252602082019092526001600160a01b0384169083906040518082805190602001908083835b6020831061327d5780518252601f19909201916020918201910161325e565b6001836020036101000a03801982511681845116808217855250505050505090500191505060006040518083038185875af1925050503d80600081146132df576040519150601f19603f3d011682016040523d82523d6000602084013e6132e4565b606091505b50509050806108a2576040805162461bcd60e51b815260206004820152600360248201526253544560e81b604482015290519081900360640190fd5b60006113bb82613d5d565b6000806000806000604051806060016040528087600001516001600160a01b0316815260200187602001516001600160a01b03168152602001876040015162ffffff16815250905061339d7f00000000000000000000000000000000000000000000000000000000000000008261304e565b91506000826001600160a01b0316633850c7bd6040518163ffffffff1660e01b815260040160e06040518083038186803b1580156133da57600080fd5b505afa1580156133ee573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061341291906150e1565b505050505050905060006134298860800151613d61565b9050600061343a8960a00151613d61565b90506134518383838c60c001518d60e00151614093565b9750505050816001600160a01b0316633c8a7d8d876060015188608001518960a00151896040518060400160405280888152602001336001600160a01b03168152506040516020016134a39190615528565b6040516020818303038152906040526040518663ffffffff1660e01b81526004016134d29594939291906152ca565b6040805180830381600087803b1580156134eb57600080fd5b505af11580156134ff573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061352391906151c8565b6101008801519195509350841080159061354257508561012001518310155b61355e5760405162461bcd60e51b81526004016107a5906154ab565b509193509193565b826001600160a01b0316613579826116bb565b6001600160a01b0316146135be5760405162461bcd60e51b81526004018080602001828103825260298152602001806159016029913960400191505060405180910390fd5b6001600160a01b0382166136035760405162461bcd60e51b81526004018080602001828103825260248152602001806157de6024913960400191505060405180910390fd5b61360e8383836108a2565b613619600082612f38565b6001600160a01b038316600090815260016020526040902061363b9082614157565b506001600160a01b038216600090815260016020526040902061365e9082614163565b5061366b6002828461416f565b5080826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a4505050565b60006113b88383614185565b60006136ca838361304e565b9050336001600160a01b038216146113bb57600080fd5b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316846001600160a01b03161480156137225750804710155b15613844577f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663d0e30db0826040518263ffffffff1660e01b81526004016000604051808303818588803b15801561378257600080fd5b505af1158015613796573d6000803e3d6000fd5b50505050507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663a9059cbb83836040518363ffffffff1660e01b815260040180836001600160a01b0316815260200182815260200192505050602060405180830381600087803b15801561381257600080fd5b505af1158015613826573d6000803e3d6000fd5b505050506040513d602081101561383c57600080fd5b506126029050565b6001600160a01b03831630141561386557613860848383613c0a565b612602565b612602848484846141e9565b4690565b6000613880826116bb565b905061388e816000846108a2565b613899600083612f38565b60008281526008602052604090205460026000196101006001841615020190911604156138d75760008281526008602052604081206138d791614b0b565b6001600160a01b03811660009081526001602052604090206138f99083614157565b50613905600283614339565b5060405182906000906001600160a01b038416907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908390a45050565b60008080806139518686614345565b909450925050505b9250929050565b6000610fed8484846143c0565b6000908152600c6020526040902080546001600160601b0319811660016001600160601b039283169081019092161790915590565b3b151590565b6001600160a01b038216613a03576040805162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f2061646472657373604482015290519081900360640190fd5b613a0c81612f27565b15613a5e576040805162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e74656400000000604482015290519081900360640190fd5b613a6a600083836108a2565b6001600160a01b0382166000908152600160205260409020613a8c9082614163565b50613a996002828461416f565b5060405181906001600160a01b038416906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b6001600160a01b0382166000908152600a60205260409020546001600160501b0316806113bb5750600d805460016001600160501b03600160b01b8084048216838101909216026001600160b01b03909316929092179092556001600160a01b038085166000908152600a60209081526040808320805469ffffffffffffffffffff191686179055848352600b825291829020865181549085166001600160a01b031991821617825591870151950180549287015162ffffff16600160a01b0262ffffff60a01b19969094169290911691909117939093161790915592915050565b613bc3848484613566565b613bcf8484848461448a565b6126025760405162461bcd60e51b81526004018080602001828103825260328152602001806157856032913960400191505060405180910390fd5b604080516001600160a01b038481166024830152604480830185905283518084039091018152606490920183526020820180516001600160e01b031663a9059cbb60e01b1781529251825160009485949389169392918291908083835b60208310613c865780518252601f199092019160209182019101613c67565b6001836020036101000a0380198251168184511680821785525050505050509050019150506000604051808303816000865af19150503d8060008114613ce8576040519150601f19603f3d011682016040523d82523d6000602084013e613ced565b606091505b5091509150818015613d1b575080511580613d1b5750808060200190516020811015613d1857600080fd5b50515b61145c576040805162461bcd60e51b815260206004820152600260248201526114d560f21b604482015290519081900360640190fd5b60006113b883836145f2565b5490565b60008060008360020b12613d78578260020b613d80565b8260020b6000035b9050620d89e8811115613dbe576040805162461bcd60e51b81526020600482015260016024820152601560fa1b604482015290519081900360640190fd5b600060018216613dd257600160801b613de4565b6ffffcb933bd6fad37aa2d162d1a5940015b70ffffffffffffffffffffffffffffffffff1690506002821615613e18576ffff97272373d413259a46990580e213a0260801c5b6004821615613e37576ffff2e50f5f656932ef12357cf3c7fdcc0260801c5b6008821615613e56576fffe5caca7e10e4e61c3624eaa0941cd00260801c5b6010821615613e75576fffcb9843d60f6159c9db58835c9266440260801c5b6020821615613e94576fff973b41fa98c081472e6896dfb254c00260801c5b6040821615613eb3576fff2ea16466c96a3843ec78b326b528610260801c5b6080821615613ed2576ffe5dee046a99a2a811c461f1969c30530260801c5b610100821615613ef2576ffcbe86c7900a88aedcffc83b479aa3a40260801c5b610200821615613f12576ff987a7253ac413176f2b074cf7815e540260801c5b610400821615613f32576ff3392b0822b70005940c7a398e4b70f30260801c5b610800821615613f52576fe7159475a2c29b7443b29c7fa6e889d90260801c5b611000821615613f72576fd097f3bdfd2022b8845ad8f792aa58250260801c5b612000821615613f92576fa9f746462d870fdf8a65dc1f90e061e50260801c5b614000821615613fb2576f70d869a156d2a1b890bb3df62baf32f70260801c5b618000821615613fd2576f31be135f97d08fd981231505542fcfa60260801c5b62010000821615613ff3576f09aa508b5b7a84e1c677de54f3e99bc90260801c5b62020000821615614013576e5d6af8dedb81196699c329225ee6040260801c5b62040000821615614032576d2216e584f5fa1ea926041bedfe980260801c5b6208000082161561404f576b048a170391f7dc42444e8fa20260801c5b60008460020b131561406a57806000198161406657fe5b0490505b64010000000081061561407e576001614081565b60005b60ff16602082901c0192505050919050565b6000836001600160a01b0316856001600160a01b031611156140b3579293925b846001600160a01b0316866001600160a01b0316116140de576140d785858561460a565b905061414e565b836001600160a01b0316866001600160a01b0316101561414057600061410587868661460a565b9050600061411487898661466d565b9050806001600160801b0316826001600160801b0316106141355780614137565b815b9250505061414e565b61414b85858461466d565b90505b95945050505050565b60006113b883836146aa565b60006113b88383614770565b6000610fed84846001600160a01b0385166147ba565b815460009082106141c75760405162461bcd60e51b81526004018080602001828103825260228152602001806157636022913960400191505060405180910390fd5b8260000182815481106141d657fe5b9060005260206000200154905092915050565b604080516001600160a01b0385811660248301528481166044830152606480830185905283518084039091018152608490920183526020820180516001600160e01b03166323b872dd60e01b178152925182516000948594938a169392918291908083835b6020831061426d5780518252601f19909201916020918201910161424e565b6001836020036101000a0380198251168184511680821785525050505050509050019150506000604051808303816000865af19150503d80600081146142cf576040519150601f19603f3d011682016040523d82523d6000602084013e6142d4565b606091505b509150915081801561430257508051158061430257508080602001905160208110156142ff57600080fd5b50515b612462576040805162461bcd60e51b815260206004820152600360248201526229aa2360e91b604482015290519081900360640190fd5b60006113b88383614851565b8154600090819083106143895760405162461bcd60e51b81526004018080602001828103825260228152602001806158df6022913960400191505060405180910390fd5b600084600001848154811061439a57fe5b906000526020600020906002020190508060000154816001015492509250509250929050565b6000828152600184016020526040812054828161445b5760405162461bcd60e51b81526004018080602001828103825283818151815260200191508051906020019080838360005b83811015614420578181015183820152602001614408565b50505050905090810190601f16801561444d5780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b5084600001600182038154811061446e57fe5b9060005260206000209060020201600101549150509392505050565b600061449e846001600160a01b03166139a2565b6144aa57506001610fed565b60006145b8630a85bd0160e11b6144bf612f34565b88878760405160240180856001600160a01b03168152602001846001600160a01b0316815260200183815260200180602001828103825283818151815260200191508051906020019080838360005b8381101561452657818101518382015260200161450e565b50505050905090810190601f1680156145535780820380516001836020036101000a031916815260200191505b5095505050505050604051602081830303815290604052906001600160e01b0319166020820180516001600160e01b038381831617835250505050604051806060016040528060328152602001615785603291396001600160a01b0388169190614925565b905060008180602001905160208110156145d157600080fd5b50516001600160e01b031916630a85bd0160e11b1492505050949350505050565b60009081526001919091016020526040902054151590565b6000826001600160a01b0316846001600160a01b0316111561462a579192915b600061464d856001600160a01b0316856001600160a01b0316600160601b613182565b905061414e61466884838888036001600160a01b0316613182565b614934565b6000826001600160a01b0316846001600160a01b0316111561468d579192915b610fed61466883600160601b8787036001600160a01b0316613182565b6000818152600183016020526040812054801561476657835460001980830191908101906000908790839081106146dd57fe5b90600052602060002001549050808760000184815481106146fa57fe5b60009182526020808320909101929092558281526001898101909252604090209084019055865487908061472a57fe5b600190038181906000526020600020016000905590558660010160008781526020019081526020016000206000905560019450505050506113bb565b60009150506113bb565b600061477c83836145f2565b6147b2575081546001818101845560008481526020808220909301849055845484825282860190935260409020919091556113bb565b5060006113bb565b60008281526001840160205260408120548061481f57505060408051808201825283815260208082018481528654600181810189556000898152848120955160029093029095019182559151908201558654868452818801909252929091205561317b565b8285600001600183038154811061483257fe5b906000526020600020906002020160010181905550600091505061317b565b60008181526001830160205260408120548015614766578354600019808301919081019060009087908390811061488457fe5b90600052602060002090600202019050808760000184815481106148a457fe5b6000918252602080832084546002909302019182556001938401549184019190915583548252898301905260409020908401905586548790806148e357fe5b60008281526020808220600260001990940193840201828155600190810183905592909355888152898201909252604082209190915594506113bb9350505050565b6060610fed848460008561494a565b806001600160801b03811681146106e357600080fd5b60608247101561498b5760405162461bcd60e51b81526004018080602001828103825260268152602001806158026026913960400191505060405180910390fd5b614994856139a2565b6149e5576040805162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000604482015290519081900360640190fd5b600080866001600160a01b031685876040518082805190602001908083835b60208310614a235780518252601f199092019160209182019101614a04565b6001836020036101000a03801982511681845116808217855250505050505090500191505060006040518083038185875af1925050503d8060008114614a85576040519150601f19603f3d011682016040523d82523d6000602084013e614a8a565b606091505b5091509150614a9a828286614aa5565b979650505050505050565b60608315614ab457508161317b565b825115614ac45782518084602001fd5b60405162461bcd60e51b8152602060048201818152845160248401528451859391928392604401919085019080838360008315614420578181015183820152602001614408565b50805460018160011615610100020316600290046000825580601f10614b315750614b4f565b601f016020900490600052602060002090810190614b4f9190614b52565b50565b5b80821115614b675760008155600101614b53565b5090565b80356106e38161570c565b805161ffff811681146106e357600080fd5b803562ffffff811681146106e357600080fd5b600060208284031215614bac578081fd5b813561317b8161570c565b60008060408385031215614bc9578081fd5b8235614bd48161570c565b91506020830135614be48161570c565b809150509250929050565b60008060008060808587031215614c04578182fd5b8435614c0f8161570c565b93506020850135614c1f8161570c565b9250614c2d60408601614b88565b91506060850135614c3d8161570c565b939692955090935050565b600080600060608486031215614c5c578081fd5b8335614c678161570c565b92506020840135614c778161570c565b929592945050506040919091013590565b60008060008060808587031215614c9d578182fd5b8435614ca88161570c565b93506020850135614cb88161570c565b925060408501359150606085013567ffffffffffffffff811115614cda578182fd5b8501601f81018713614cea578182fd5b8035614cfd614cf8826156be565b61569a565b818152886020838501011115614d11578384fd5b81602084016020830137908101602001929092525092959194509250565b60008060408385031215614d41578182fd5b8235614d4c8161570c565b91506020830135614be481615721565b60008060408385031215614d6e578182fd5b8235614d798161570c565b946020939093013593505050565b600080600060608486031215614d9b578081fd5b8335614da68161570c565b9250602084013591506040840135614dbd8161570c565b809150509250925092565b60008060008060008060c08789031215614de0578384fd5b8635614deb8161570c565b955060208701359450604087013593506060870135614e0981615753565b9598949750929560808101359460a0909101359350915050565b60008060208385031215614e35578182fd5b823567ffffffffffffffff80821115614e4c578384fd5b818501915085601f830112614e5f578384fd5b813581811115614e6d578485fd5b8660208083028501011115614e80578485fd5b60209290920196919550909350505050565b600060208284031215614ea3578081fd5b81356001600160e01b03198116811461317b578182fd5b600060208284031215614ecb578081fd5b813561317b8161572f565b600060208284031215614ee7578081fd5b815167ffffffffffffffff811115614efd578182fd5b8201601f81018413614f0d578182fd5b8051614f1b614cf8826156be565b818152856020838501011115614f2f578384fd5b61414e8260208301602086016156e0565b600060808284031215614f51578081fd5b50919050565b600060a08284031215614f51578081fd5b600060c08284031215614f51578081fd5b60008183036080811215614f8b578182fd5b6040516040810167ffffffffffffffff8282108183111715614fa957fe5b816040526060841215614fba578485fd5b60a0830193508184108185111715614fce57fe5b508260405284359250614fe08361570c565b918252602084013591614ff28361570c565b82606083015261500460408601614b88565b6080830152815261501760608501614b6b565b6020820152949350505050565b60006101608284031215614f51578081fd5b600060208284031215615047578081fd5b813561317b8161573e565b60008060408385031215615064578182fd5b825161506f8161573e565b6020840151909250614be48161573e565b600080600080600060a08688031215615097578283fd5b85516150a28161573e565b80955050602086015193506040860151925060608601516150c28161573e565b60808701519092506150d38161573e565b809150509295509295909350565b600080600080600080600060e0888a0312156150fb578485fd5b87516151068161570c565b60208901519097506151178161572f565b955061512560408901614b76565b945061513360608901614b76565b935061514160808901614b76565b925060a088015161515181615753565b60c089015190925061516281615721565b8091505092959891949750929550565b600060208284031215615183578081fd5b6113b882614b88565b60006020828403121561519d578081fd5b5035919050565b600080604083850312156151b6578182fd5b823591506020830135614be48161570c565b600080604083850312156151da578182fd5b505080516020909101519092909150565b60008060008060608587031215615200578182fd5b8435935060208501359250604085013567ffffffffffffffff80821115615225578384fd5b818701915087601f830112615238578384fd5b813581811115615246578485fd5b886020828501011115615257578485fd5b95989497505060200194505050565b6000815180845261527e8160208601602086016156e0565b601f01601f19169290920160200192915050565b60020b9052565b6001600160801b03169052565b6000828483379101908152919050565b6001600160a01b0391909116815260200190565b600060018060a01b03871682528560020b60208301528460020b60408301526001600160801b038416606083015260a06080830152614a9a60a0830184615266565b6001600160a01b03959095168552600293840b60208601529190920b60408401526001600160801b03918216606084015216608082015260a00190565b6001600160a01b039390931683526001600160801b03918216602084015216604082015260600190565b6000602080830181845280855180835260408601915060408482028701019250838701855b828110156153c657603f198886030184526153b4858351615266565b94509285019290850190600101615398565b5092979650505050505050565b901515815260200190565b90815260200190565b6001600160a01b03929092168252602082015260400190565b600293840b81529190920b60208201526001600160801b03909116604082015260600190565b6000602082526113b86020830184615266565b6020808252600c908201526b139bdd08185c1c1c9bdd995960a21b604082015260600190565b6020808252602c908201527f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860408201526b34b9ba32b73a103a37b5b2b760a11b606082015260800190565b602080825260149082015273507269636520736c69707061676520636865636b60601b604082015260600190565b60208082526010908201526f125b9d985b1a59081d1bdad95b88125160821b604082015260600190565b6020808252600b908201526a139bdd0818db19585c995960aa1b604082015260600190565b815180516001600160a01b03908116835260208083015182168185015260409283015162ffffff1692840192909252920151909116606082015260800190565b6001600160801b039390931683526020830191909152604082015260600190565b9384526001600160801b039290921660208401526040830152606082015260800190565b918252602082015260400190565b6001600160601b038d1681526001600160a01b038c811660208301528b811660408301528a16606082015262ffffff89166080820152600288900b60a0820152610180810161560d60c0830189615292565b61561a60e0830188615299565b8561010083015284610120830152615636610140830185615299565b615644610160830184615299565b9d9c50505050505050505050505050565b6000808335601e1984360301811261566b578283fd5b83018035915067ffffffffffffffff821115615685578283fd5b60200191503681900382131561395957600080fd5b60405181810167ffffffffffffffff811182821017156156b657fe5b604052919050565b600067ffffffffffffffff8211156156d257fe5b50601f01601f191660200190565b60005b838110156156fb5781810151838201526020016156e3565b838111156126025750506000910152565b6001600160a01b0381168114614b4f57600080fd5b8015158114614b4f57600080fd5b8060020b8114614b4f57600080fd5b6001600160801b0381168114614b4f57600080fd5b60ff81168114614b4f57600080fdfe456e756d657261626c655365743a20696e646578206f7574206f6620626f756e64734552433732313a207472616e7366657220746f206e6f6e20455243373231526563656976657220696d706c656d656e7465724552433732315065726d69743a20617070726f76616c20746f2063757272656e74206f776e65724552433732313a207472616e7366657220746f20746865207a65726f2061646472657373416464726573733a20696e73756666696369656e742062616c616e636520666f722063616c6c4552433732313a206f70657261746f7220717565727920666f72206e6f6e6578697374656e7420746f6b656e4552433732313a20617070726f76652063616c6c6572206973206e6f74206f776e6572206e6f7220617070726f76656420666f7220616c6c4552433732313a2062616c616e636520717565727920666f7220746865207a65726f20616464726573734552433732313a206f776e657220717565727920666f72206e6f6e6578697374656e7420746f6b656e456e756d657261626c654d61703a20696e646578206f7574206f6620626f756e64734552433732313a207472616e73666572206f6620746f6b656e2074686174206973206e6f74206f776e4552433732313a20617070726f76616c20746f2063757272656e74206f776e65724552433732313a207472616e736665722063616c6c6572206973206e6f74206f776e6572206e6f7220617070726f766564a26469706673582212206c5d0f0a6fcb88da04ead4345c45b136940987b60bf534cf5a03abf88775f7ff64736f6c63430007060033";
var devdoc = {
	kind: "dev",
	methods: {
		"DOMAIN_SEPARATOR()": {
			returns: {
				_0: "The domain seperator used in encoding of permit signature"
			}
		},
		"approve(address,uint256)": {
			details: "See {IERC721-approve}."
		},
		"balanceOf(address)": {
			details: "See {IERC721-balanceOf}."
		},
		"baseURI()": {
			details: "Returns the base URI set via {_setBaseURI}. This will be automatically added as a prefix in {tokenURI} to each token's URI, or to the token ID if no specific URI is set for that token ID."
		},
		"bitswapV3MintCallback(uint256,uint256,bytes)": {
			details: "In the implementation you must pay the pool tokens owed for the minted liquidity. The caller of this method must be checked to be a BitswapV3Pool deployed by the canonical BitswapV3Factory.",
			params: {
				amount0Owed: "The amount of token0 due to the pool for the minted liquidity",
				amount1Owed: "The amount of token1 due to the pool for the minted liquidity",
				data: "Any data passed through by the caller via the IBitswapV3PoolActions#mint call"
			}
		},
		"burn(uint256)": {
			params: {
				tokenId: "The ID of the token that is being burned"
			}
		},
		"collect((uint256,address,uint128,uint128))": {
			params: {
				params: "tokenId The ID of the NFT for which tokens are being collected, recipient The account that should receive the tokens, amount0Max The maximum amount of token0 to collect, amount1Max The maximum amount of token1 to collect"
			},
			returns: {
				amount0: "The amount of fees collected in token0",
				amount1: "The amount of fees collected in token1"
			}
		},
		"createAndInitializePoolIfNecessary(address,address,uint24,uint160)": {
			details: "This method can be bundled with others via IMulticall for the first action (e.g. mint) performed against a pool",
			params: {
				fee: "The fee amount of the v3 pool for the specified token pair",
				sqrtPriceX96: "The initial square root price of the pool as a Q64.96 value",
				token0: "The contract address of token0 of the pool",
				token1: "The contract address of token1 of the pool"
			},
			returns: {
				pool: "Returns the pool address based on the pair of tokens and fee, will return the newly created pool address if necessary"
			}
		},
		"decreaseLiquidity((uint256,uint128,uint256,uint256,uint256))": {
			params: {
				params: "tokenId The ID of the token for which liquidity is being decreased, amount The amount by which liquidity will be decreased, amount0Min The minimum amount of token0 that should be accounted for the burned liquidity, amount1Min The minimum amount of token1 that should be accounted for the burned liquidity, deadline The time by which the transaction must be included to effect the change"
			},
			returns: {
				amount0: "The amount of token0 accounted to the position's tokens owed",
				amount1: "The amount of token1 accounted to the position's tokens owed"
			}
		},
		"getApproved(uint256)": {
			details: "Returns the account approved for `tokenId` token. Requirements: - `tokenId` must exist."
		},
		"increaseLiquidity((uint256,uint256,uint256,uint256,uint256,uint256))": {
			params: {
				params: "tokenId The ID of the token for which liquidity is being increased, amount0Desired The desired amount of token0 to be spent, amount1Desired The desired amount of token1 to be spent, amount0Min The minimum amount of token0 to spend, which serves as a slippage check, amount1Min The minimum amount of token1 to spend, which serves as a slippage check, deadline The time by which the transaction must be included to effect the change"
			},
			returns: {
				amount0: "The amount of token0 to acheive resulting liquidity",
				amount1: "The amount of token1 to acheive resulting liquidity",
				liquidity: "The new liquidity amount as a result of the increase"
			}
		},
		"isApprovedForAll(address,address)": {
			details: "See {IERC721-isApprovedForAll}."
		},
		"mint((address,address,uint24,int24,int24,uint256,uint256,uint256,uint256,address,uint256))": {
			details: "Call this when the pool does exist and is initialized. Note that if the pool is created but not initialized a method does not exist, i.e. the pool is assumed to be initialized.",
			params: {
				params: "The params necessary to mint a position, encoded as `MintParams` in calldata"
			},
			returns: {
				amount0: "The amount of token0",
				amount1: "The amount of token1",
				liquidity: "The amount of liquidity for this position",
				tokenId: "The ID of the token that represents the minted position"
			}
		},
		"multicall(bytes[])": {
			details: "The `msg.value` should not be trusted for any method callable from multicall.",
			params: {
				data: "The encoded function data for each of the calls to make to this contract"
			},
			returns: {
				results: "The results from each of the calls passed in via data"
			}
		},
		"name()": {
			details: "See {IERC721Metadata-name}."
		},
		"ownerOf(uint256)": {
			details: "See {IERC721-ownerOf}."
		},
		"permit(address,uint256,uint256,uint8,bytes32,bytes32)": {
			params: {
				deadline: "The deadline timestamp by which the call must be mined for the approve to work",
				r: "Must produce valid secp256k1 signature from the holder along with `v` and `s`",
				s: "Must produce valid secp256k1 signature from the holder along with `r` and `v`",
				spender: "The account that is being approved",
				tokenId: "The ID of the token that is being approved for spending",
				v: "Must produce valid secp256k1 signature from the holder along with `r` and `s`"
			}
		},
		"positions(uint256)": {
			details: "Throws if the token ID is not valid.",
			params: {
				tokenId: "The ID of the token that represents the position"
			},
			returns: {
				fee: "The fee associated with the pool",
				feeGrowthInside0LastX128: "The fee growth of token0 as of the last action on the individual position",
				feeGrowthInside1LastX128: "The fee growth of token1 as of the last action on the individual position",
				liquidity: "The liquidity of the position",
				nonce: "The nonce for permits",
				operator: "The address that is approved for spending",
				tickLower: "The lower end of the tick range for the position",
				tickUpper: "The higher end of the tick range for the position",
				token0: "The address of the token0 for a specific pool",
				token1: "The address of the token1 for a specific pool",
				tokensOwed0: "The uncollected amount of token0 owed to the position as of the last computation",
				tokensOwed1: "The uncollected amount of token1 owed to the position as of the last computation"
			}
		},
		"refundETH()": {
			details: "Useful for bundling with mint or increase liquidity that uses ether, or exact output swaps that use ether for the input amount"
		},
		"safeTransferFrom(address,address,uint256)": {
			details: "See {IERC721-safeTransferFrom}."
		},
		"safeTransferFrom(address,address,uint256,bytes)": {
			details: "See {IERC721-safeTransferFrom}."
		},
		"selfPermit(address,uint256,uint256,uint8,bytes32,bytes32)": {
			details: "The `owner` is always msg.sender and the `spender` is always address(this).",
			params: {
				deadline: "A timestamp, the current blocktime must be less than or equal to this timestamp",
				r: "Must produce valid secp256k1 signature from the holder along with `v` and `s`",
				s: "Must produce valid secp256k1 signature from the holder along with `r` and `v`",
				token: "The address of the token spent",
				v: "Must produce valid secp256k1 signature from the holder along with `r` and `s`",
				value: "The amount that can be spent of token"
			}
		},
		"selfPermitAllowed(address,uint256,uint256,uint8,bytes32,bytes32)": {
			details: "The `owner` is always msg.sender and the `spender` is always address(this)",
			params: {
				expiry: "The timestamp at which the permit is no longer valid",
				nonce: "The current nonce of the owner",
				r: "Must produce valid secp256k1 signature from the holder along with `v` and `s`",
				s: "Must produce valid secp256k1 signature from the holder along with `r` and `v`",
				token: "The address of the token spent",
				v: "Must produce valid secp256k1 signature from the holder along with `r` and `s`"
			}
		},
		"selfPermitAllowedIfNecessary(address,uint256,uint256,uint8,bytes32,bytes32)": {
			details: "The `owner` is always msg.sender and the `spender` is always address(this) Can be used instead of #selfPermitAllowed to prevent calls from failing due to a frontrun of a call to #selfPermitAllowed.",
			params: {
				expiry: "The timestamp at which the permit is no longer valid",
				nonce: "The current nonce of the owner",
				r: "Must produce valid secp256k1 signature from the holder along with `v` and `s`",
				s: "Must produce valid secp256k1 signature from the holder along with `r` and `v`",
				token: "The address of the token spent",
				v: "Must produce valid secp256k1 signature from the holder along with `r` and `s`"
			}
		},
		"selfPermitIfNecessary(address,uint256,uint256,uint8,bytes32,bytes32)": {
			details: "The `owner` is always msg.sender and the `spender` is always address(this). Can be used instead of #selfPermit to prevent calls from failing due to a frontrun of a call to #selfPermit",
			params: {
				deadline: "A timestamp, the current blocktime must be less than or equal to this timestamp",
				r: "Must produce valid secp256k1 signature from the holder along with `v` and `s`",
				s: "Must produce valid secp256k1 signature from the holder along with `r` and `v`",
				token: "The address of the token spent",
				v: "Must produce valid secp256k1 signature from the holder along with `r` and `s`",
				value: "The amount that can be spent of token"
			}
		},
		"setApprovalForAll(address,bool)": {
			details: "See {IERC721-setApprovalForAll}."
		},
		"supportsInterface(bytes4)": {
			details: "See {IERC165-supportsInterface}. Time complexity O(1), guaranteed to always use less than 30 000 gas."
		},
		"sweepToken(address,uint256,address)": {
			details: "The amountMinimum parameter prevents malicious contracts from stealing the token from users",
			params: {
				amountMinimum: "The minimum amount of token required for a transfer",
				recipient: "The destination address of the token",
				token: "The contract address of the token which will be transferred to `recipient`"
			}
		},
		"symbol()": {
			details: "See {IERC721Metadata-symbol}."
		},
		"tokenByIndex(uint256)": {
			details: "See {IERC721Enumerable-tokenByIndex}."
		},
		"tokenOfOwnerByIndex(address,uint256)": {
			details: "See {IERC721Enumerable-tokenOfOwnerByIndex}."
		},
		"totalSupply()": {
			details: "See {IERC721Enumerable-totalSupply}."
		},
		"transferFrom(address,address,uint256)": {
			details: "See {IERC721-transferFrom}."
		},
		"unwrapWBB(uint256,address)": {
			details: "The amountMinimum parameter prevents malicious contracts from stealing WBB from users.",
			params: {
				amountMinimum: "The minimum amount of WBB to unwrap",
				recipient: "The address receiving ETH"
			}
		}
	},
	stateVariables: {
		_nextId: {
			details: "The ID of the next token that will be minted. Skips 0"
		},
		_nextPoolId: {
			details: "The ID of the next pool that is used for the first time. Skips 0"
		},
		_poolIdToPoolKey: {
			details: "Pool keys by pool ID, to save on SSTOREs for position data"
		},
		_poolIds: {
			details: "IDs of pools assigned by this contract"
		},
		_positions: {
			details: "The token ID position data"
		},
		_tokenDescriptor: {
			details: "The address of the token descriptor contract, which handles generating token URIs for position tokens"
		}
	},
	title: "NFT positions",
	version: 1
};
var userdoc = {
	events: {
		"Collect(uint256,address,uint256,uint256)": {
			notice: "Emitted when tokens are collected for a position NFT"
		},
		"DecreaseLiquidity(uint256,uint128,uint256,uint256)": {
			notice: "Emitted when liquidity is decreased for a position NFT"
		},
		"IncreaseLiquidity(uint256,uint128,uint256,uint256)": {
			notice: "Emitted when liquidity is increased for a position NFT"
		}
	},
	kind: "user",
	methods: {
		"DOMAIN_SEPARATOR()": {
			notice: "The domain separator used in the permit signature"
		},
		"PERMIT_TYPEHASH()": {
			notice: "The permit typehash used in the permit signature"
		},
		"bitswapV3MintCallback(uint256,uint256,bytes)": {
			notice: "Called to `msg.sender` after minting liquidity to a position from IBitswapV3Pool#mint."
		},
		"burn(uint256)": {
			notice: "Burns a token ID, which deletes it from the NFT contract. The token must have 0 liquidity and all tokens must be collected first."
		},
		"collect((uint256,address,uint128,uint128))": {
			notice: "Collects up to a maximum amount of fees owed to a specific position to the recipient"
		},
		"createAndInitializePoolIfNecessary(address,address,uint24,uint160)": {
			notice: "Creates a new pool if it does not exist, then initializes if not initialized"
		},
		"decreaseLiquidity((uint256,uint128,uint256,uint256,uint256))": {
			notice: "Decreases the amount of liquidity in a position and accounts it to the position"
		},
		"increaseLiquidity((uint256,uint256,uint256,uint256,uint256,uint256))": {
			notice: "Increases the amount of liquidity in a position, with tokens paid by the `msg.sender`"
		},
		"mint((address,address,uint24,int24,int24,uint256,uint256,uint256,uint256,address,uint256))": {
			notice: "Creates a new position wrapped in a NFT"
		},
		"multicall(bytes[])": {
			notice: "Call multiple functions in the current contract and return the data from all of them if they all succeed"
		},
		"permit(address,uint256,uint256,uint8,bytes32,bytes32)": {
			notice: "Approve of a specific token ID for spending by spender via signature"
		},
		"positions(uint256)": {
			notice: "Returns the position information associated with a given token ID."
		},
		"refundETH()": {
			notice: "Refunds any ETH balance held by this contract to the `msg.sender`"
		},
		"selfPermit(address,uint256,uint256,uint8,bytes32,bytes32)": {
			notice: "Permits this contract to spend a given token from `msg.sender`"
		},
		"selfPermitAllowed(address,uint256,uint256,uint8,bytes32,bytes32)": {
			notice: "Permits this contract to spend the sender's tokens for permit signatures that have the `allowed` parameter"
		},
		"selfPermitAllowedIfNecessary(address,uint256,uint256,uint8,bytes32,bytes32)": {
			notice: "Permits this contract to spend the sender's tokens for permit signatures that have the `allowed` parameter"
		},
		"selfPermitIfNecessary(address,uint256,uint256,uint8,bytes32,bytes32)": {
			notice: "Permits this contract to spend a given token from `msg.sender`"
		},
		"sweepToken(address,uint256,address)": {
			notice: "Transfers the full amount of a token held by this contract to recipient"
		},
		"unwrapWBB(uint256,address)": {
			notice: "Unwraps the contract's WBB balance and sends it to recipient as ETH."
		}
	},
	notice: "Wraps Bitswap V3 positions in the ERC721 non-fungible token interface",
	version: 1
};
var storageLayout = {
	storage: [
		{
			astId: 460,
			contract: "contracts/v3-periphery/NonfungiblePositionManager.sol:NonfungiblePositionManager",
			label: "_supportedInterfaces",
			offset: 0,
			slot: "0",
			type: "t_mapping(t_bytes4,t_bool)"
		},
		{
			astId: 1676,
			contract: "contracts/v3-periphery/NonfungiblePositionManager.sol:NonfungiblePositionManager",
			label: "_holderTokens",
			offset: 0,
			slot: "1",
			type: "t_mapping(t_address,t_struct(UintSet)4092_storage)"
		},
		{
			astId: 1678,
			contract: "contracts/v3-periphery/NonfungiblePositionManager.sol:NonfungiblePositionManager",
			label: "_tokenOwners",
			offset: 0,
			slot: "2",
			type: "t_struct(UintToAddressMap)3469_storage"
		},
		{
			astId: 1682,
			contract: "contracts/v3-periphery/NonfungiblePositionManager.sol:NonfungiblePositionManager",
			label: "_tokenApprovals",
			offset: 0,
			slot: "4",
			type: "t_mapping(t_uint256,t_address)"
		},
		{
			astId: 1688,
			contract: "contracts/v3-periphery/NonfungiblePositionManager.sol:NonfungiblePositionManager",
			label: "_operatorApprovals",
			offset: 0,
			slot: "5",
			type: "t_mapping(t_address,t_mapping(t_address,t_bool))"
		},
		{
			astId: 1690,
			contract: "contracts/v3-periphery/NonfungiblePositionManager.sol:NonfungiblePositionManager",
			label: "_name",
			offset: 0,
			slot: "6",
			type: "t_string_storage"
		},
		{
			astId: 1692,
			contract: "contracts/v3-periphery/NonfungiblePositionManager.sol:NonfungiblePositionManager",
			label: "_symbol",
			offset: 0,
			slot: "7",
			type: "t_string_storage"
		},
		{
			astId: 1696,
			contract: "contracts/v3-periphery/NonfungiblePositionManager.sol:NonfungiblePositionManager",
			label: "_tokenURIs",
			offset: 0,
			slot: "8",
			type: "t_mapping(t_uint256,t_string_storage)"
		},
		{
			astId: 1698,
			contract: "contracts/v3-periphery/NonfungiblePositionManager.sol:NonfungiblePositionManager",
			label: "_baseURI",
			offset: 0,
			slot: "9",
			type: "t_string_storage"
		},
		{
			astId: 29986,
			contract: "contracts/v3-periphery/NonfungiblePositionManager.sol:NonfungiblePositionManager",
			label: "_poolIds",
			offset: 0,
			slot: "10",
			type: "t_mapping(t_address,t_uint80)"
		},
		{
			astId: 29991,
			contract: "contracts/v3-periphery/NonfungiblePositionManager.sol:NonfungiblePositionManager",
			label: "_poolIdToPoolKey",
			offset: 0,
			slot: "11",
			type: "t_mapping(t_uint80,t_struct(PoolKey)40073_storage)"
		},
		{
			astId: 29996,
			contract: "contracts/v3-periphery/NonfungiblePositionManager.sol:NonfungiblePositionManager",
			label: "_positions",
			offset: 0,
			slot: "12",
			type: "t_mapping(t_uint256,t_struct(Position)29981_storage)"
		},
		{
			astId: 30000,
			contract: "contracts/v3-periphery/NonfungiblePositionManager.sol:NonfungiblePositionManager",
			label: "_nextId",
			offset: 0,
			slot: "13",
			type: "t_uint176"
		},
		{
			astId: 30004,
			contract: "contracts/v3-periphery/NonfungiblePositionManager.sol:NonfungiblePositionManager",
			label: "_nextPoolId",
			offset: 22,
			slot: "13",
			type: "t_uint80"
		}
	],
	types: {
		t_address: {
			encoding: "inplace",
			label: "address",
			numberOfBytes: "20"
		},
		"t_array(t_bytes32)dyn_storage": {
			base: "t_bytes32",
			encoding: "dynamic_array",
			label: "bytes32[]",
			numberOfBytes: "32"
		},
		"t_array(t_struct(MapEntry)3143_storage)dyn_storage": {
			base: "t_struct(MapEntry)3143_storage",
			encoding: "dynamic_array",
			label: "struct EnumerableMap.MapEntry[]",
			numberOfBytes: "32"
		},
		t_bool: {
			encoding: "inplace",
			label: "bool",
			numberOfBytes: "1"
		},
		t_bytes32: {
			encoding: "inplace",
			label: "bytes32",
			numberOfBytes: "32"
		},
		t_bytes4: {
			encoding: "inplace",
			label: "bytes4",
			numberOfBytes: "4"
		},
		t_int24: {
			encoding: "inplace",
			label: "int24",
			numberOfBytes: "3"
		},
		"t_mapping(t_address,t_bool)": {
			encoding: "mapping",
			key: "t_address",
			label: "mapping(address => bool)",
			numberOfBytes: "32",
			value: "t_bool"
		},
		"t_mapping(t_address,t_mapping(t_address,t_bool))": {
			encoding: "mapping",
			key: "t_address",
			label: "mapping(address => mapping(address => bool))",
			numberOfBytes: "32",
			value: "t_mapping(t_address,t_bool)"
		},
		"t_mapping(t_address,t_struct(UintSet)4092_storage)": {
			encoding: "mapping",
			key: "t_address",
			label: "mapping(address => struct EnumerableSet.UintSet)",
			numberOfBytes: "32",
			value: "t_struct(UintSet)4092_storage"
		},
		"t_mapping(t_address,t_uint80)": {
			encoding: "mapping",
			key: "t_address",
			label: "mapping(address => uint80)",
			numberOfBytes: "32",
			value: "t_uint80"
		},
		"t_mapping(t_bytes32,t_uint256)": {
			encoding: "mapping",
			key: "t_bytes32",
			label: "mapping(bytes32 => uint256)",
			numberOfBytes: "32",
			value: "t_uint256"
		},
		"t_mapping(t_bytes4,t_bool)": {
			encoding: "mapping",
			key: "t_bytes4",
			label: "mapping(bytes4 => bool)",
			numberOfBytes: "32",
			value: "t_bool"
		},
		"t_mapping(t_uint256,t_address)": {
			encoding: "mapping",
			key: "t_uint256",
			label: "mapping(uint256 => address)",
			numberOfBytes: "32",
			value: "t_address"
		},
		"t_mapping(t_uint256,t_string_storage)": {
			encoding: "mapping",
			key: "t_uint256",
			label: "mapping(uint256 => string)",
			numberOfBytes: "32",
			value: "t_string_storage"
		},
		"t_mapping(t_uint256,t_struct(Position)29981_storage)": {
			encoding: "mapping",
			key: "t_uint256",
			label: "mapping(uint256 => struct NonfungiblePositionManager.Position)",
			numberOfBytes: "32",
			value: "t_struct(Position)29981_storage"
		},
		"t_mapping(t_uint80,t_struct(PoolKey)40073_storage)": {
			encoding: "mapping",
			key: "t_uint80",
			label: "mapping(uint80 => struct PoolAddress.PoolKey)",
			numberOfBytes: "32",
			value: "t_struct(PoolKey)40073_storage"
		},
		t_string_storage: {
			encoding: "bytes",
			label: "string",
			numberOfBytes: "32"
		},
		"t_struct(Map)3151_storage": {
			encoding: "inplace",
			label: "struct EnumerableMap.Map",
			members: [
				{
					astId: 3146,
					contract: "contracts/v3-periphery/NonfungiblePositionManager.sol:NonfungiblePositionManager",
					label: "_entries",
					offset: 0,
					slot: "0",
					type: "t_array(t_struct(MapEntry)3143_storage)dyn_storage"
				},
				{
					astId: 3150,
					contract: "contracts/v3-periphery/NonfungiblePositionManager.sol:NonfungiblePositionManager",
					label: "_indexes",
					offset: 0,
					slot: "1",
					type: "t_mapping(t_bytes32,t_uint256)"
				}
			],
			numberOfBytes: "64"
		},
		"t_struct(MapEntry)3143_storage": {
			encoding: "inplace",
			label: "struct EnumerableMap.MapEntry",
			members: [
				{
					astId: 3140,
					contract: "contracts/v3-periphery/NonfungiblePositionManager.sol:NonfungiblePositionManager",
					label: "_key",
					offset: 0,
					slot: "0",
					type: "t_bytes32"
				},
				{
					astId: 3142,
					contract: "contracts/v3-periphery/NonfungiblePositionManager.sol:NonfungiblePositionManager",
					label: "_value",
					offset: 0,
					slot: "1",
					type: "t_bytes32"
				}
			],
			numberOfBytes: "64"
		},
		"t_struct(PoolKey)40073_storage": {
			encoding: "inplace",
			label: "struct PoolAddress.PoolKey",
			members: [
				{
					astId: 40068,
					contract: "contracts/v3-periphery/NonfungiblePositionManager.sol:NonfungiblePositionManager",
					label: "token0",
					offset: 0,
					slot: "0",
					type: "t_address"
				},
				{
					astId: 40070,
					contract: "contracts/v3-periphery/NonfungiblePositionManager.sol:NonfungiblePositionManager",
					label: "token1",
					offset: 0,
					slot: "1",
					type: "t_address"
				},
				{
					astId: 40072,
					contract: "contracts/v3-periphery/NonfungiblePositionManager.sol:NonfungiblePositionManager",
					label: "fee",
					offset: 20,
					slot: "1",
					type: "t_uint24"
				}
			],
			numberOfBytes: "64"
		},
		"t_struct(Position)29981_storage": {
			encoding: "inplace",
			label: "struct NonfungiblePositionManager.Position",
			members: [
				{
					astId: 29962,
					contract: "contracts/v3-periphery/NonfungiblePositionManager.sol:NonfungiblePositionManager",
					label: "nonce",
					offset: 0,
					slot: "0",
					type: "t_uint96"
				},
				{
					astId: 29964,
					contract: "contracts/v3-periphery/NonfungiblePositionManager.sol:NonfungiblePositionManager",
					label: "operator",
					offset: 12,
					slot: "0",
					type: "t_address"
				},
				{
					astId: 29966,
					contract: "contracts/v3-periphery/NonfungiblePositionManager.sol:NonfungiblePositionManager",
					label: "poolId",
					offset: 0,
					slot: "1",
					type: "t_uint80"
				},
				{
					astId: 29968,
					contract: "contracts/v3-periphery/NonfungiblePositionManager.sol:NonfungiblePositionManager",
					label: "tickLower",
					offset: 10,
					slot: "1",
					type: "t_int24"
				},
				{
					astId: 29970,
					contract: "contracts/v3-periphery/NonfungiblePositionManager.sol:NonfungiblePositionManager",
					label: "tickUpper",
					offset: 13,
					slot: "1",
					type: "t_int24"
				},
				{
					astId: 29972,
					contract: "contracts/v3-periphery/NonfungiblePositionManager.sol:NonfungiblePositionManager",
					label: "liquidity",
					offset: 16,
					slot: "1",
					type: "t_uint128"
				},
				{
					astId: 29974,
					contract: "contracts/v3-periphery/NonfungiblePositionManager.sol:NonfungiblePositionManager",
					label: "feeGrowthInside0LastX128",
					offset: 0,
					slot: "2",
					type: "t_uint256"
				},
				{
					astId: 29976,
					contract: "contracts/v3-periphery/NonfungiblePositionManager.sol:NonfungiblePositionManager",
					label: "feeGrowthInside1LastX128",
					offset: 0,
					slot: "3",
					type: "t_uint256"
				},
				{
					astId: 29978,
					contract: "contracts/v3-periphery/NonfungiblePositionManager.sol:NonfungiblePositionManager",
					label: "tokensOwed0",
					offset: 0,
					slot: "4",
					type: "t_uint128"
				},
				{
					astId: 29980,
					contract: "contracts/v3-periphery/NonfungiblePositionManager.sol:NonfungiblePositionManager",
					label: "tokensOwed1",
					offset: 16,
					slot: "4",
					type: "t_uint128"
				}
			],
			numberOfBytes: "160"
		},
		"t_struct(Set)3706_storage": {
			encoding: "inplace",
			label: "struct EnumerableSet.Set",
			members: [
				{
					astId: 3701,
					contract: "contracts/v3-periphery/NonfungiblePositionManager.sol:NonfungiblePositionManager",
					label: "_values",
					offset: 0,
					slot: "0",
					type: "t_array(t_bytes32)dyn_storage"
				},
				{
					astId: 3705,
					contract: "contracts/v3-periphery/NonfungiblePositionManager.sol:NonfungiblePositionManager",
					label: "_indexes",
					offset: 0,
					slot: "1",
					type: "t_mapping(t_bytes32,t_uint256)"
				}
			],
			numberOfBytes: "64"
		},
		"t_struct(UintSet)4092_storage": {
			encoding: "inplace",
			label: "struct EnumerableSet.UintSet",
			members: [
				{
					astId: 4091,
					contract: "contracts/v3-periphery/NonfungiblePositionManager.sol:NonfungiblePositionManager",
					label: "_inner",
					offset: 0,
					slot: "0",
					type: "t_struct(Set)3706_storage"
				}
			],
			numberOfBytes: "64"
		},
		"t_struct(UintToAddressMap)3469_storage": {
			encoding: "inplace",
			label: "struct EnumerableMap.UintToAddressMap",
			members: [
				{
					astId: 3468,
					contract: "contracts/v3-periphery/NonfungiblePositionManager.sol:NonfungiblePositionManager",
					label: "_inner",
					offset: 0,
					slot: "0",
					type: "t_struct(Map)3151_storage"
				}
			],
			numberOfBytes: "64"
		},
		t_uint128: {
			encoding: "inplace",
			label: "uint128",
			numberOfBytes: "16"
		},
		t_uint176: {
			encoding: "inplace",
			label: "uint176",
			numberOfBytes: "22"
		},
		t_uint24: {
			encoding: "inplace",
			label: "uint24",
			numberOfBytes: "3"
		},
		t_uint256: {
			encoding: "inplace",
			label: "uint256",
			numberOfBytes: "32"
		},
		t_uint80: {
			encoding: "inplace",
			label: "uint80",
			numberOfBytes: "10"
		},
		t_uint96: {
			encoding: "inplace",
			label: "uint96",
			numberOfBytes: "12"
		}
	}
};
var INonfungiblePositionManager = {
	address: address,
	abi: abi,
	transactionHash: transactionHash,
	receipt: receipt,
	args: args,
	numDeployments: numDeployments,
	solcInputHash: solcInputHash,
	metadata: metadata,
	bytecode: bytecode,
	deployedBytecode: deployedBytecode,
	devdoc: devdoc,
	userdoc: userdoc,
	storageLayout: storageLayout
};

function isAllowedPermit(permitOptions) {
  return 'nonce' in permitOptions;
}

var SelfPermit = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function SelfPermit() {}

  SelfPermit.encodePermit = function encodePermit(token, options) {
    return isAllowedPermit(options) ? SelfPermit.INTERFACE.encodeFunctionData('selfPermitAllowed', [token.address, toHex(options.nonce), toHex(options.expiry), options.v, options.r, options.s]) : SelfPermit.INTERFACE.encodeFunctionData('selfPermit', [token.address, toHex(options.amount), toHex(options.deadline), options.v, options.r, options.s]);
  };

  return SelfPermit;
}();
SelfPermit.INTERFACE = /*#__PURE__*/new abi$2.Interface(ISelfPermit.abi);

var _format = "hh-sol-artifact-1";
var contractName = "PeripheryPaymentsWithFee";
var sourceName = "contracts/v3-periphery/base/PeripheryPaymentsWithFee.sol";
var abi$1 = [
	{
		inputs: [
		],
		name: "WBB",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "factory",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "refundETH",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amountMinimum",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			}
		],
		name: "sweepToken",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amountMinimum",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "feeBips",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "feeRecipient",
				type: "address"
			}
		],
		name: "sweepTokenWithFee",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amountMinimum",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			}
		],
		name: "unwrapWBB",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amountMinimum",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "feeBips",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "feeRecipient",
				type: "address"
			}
		],
		name: "unwrapWBBWithFee",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		stateMutability: "payable",
		type: "receive"
	}
];
var bytecode$1 = "0x";
var deployedBytecode$1 = "0x";
var linkReferences = {
};
var deployedLinkReferences = {
};
var IPeripheryPaymentsWithFee = {
	_format: _format,
	contractName: contractName,
	sourceName: sourceName,
	abi: abi$1,
	bytecode: bytecode$1,
	deployedBytecode: deployedBytecode$1,
	linkReferences: linkReferences,
	deployedLinkReferences: deployedLinkReferences
};

var Payments = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function Payments() {}

  Payments.encodeFeeBips = function encodeFeeBips(fee) {
    return toHex(fee.multiply(10000).quotient);
  };

  Payments.encodeUnwrapWETH9 = function encodeUnwrapWETH9(amountMinimum, recipient, feeOptions) {
    recipient = sdkCore.validateAndParseAddress(recipient);

    if (!!feeOptions) {
      var feeBips = this.encodeFeeBips(feeOptions.fee);
      var feeRecipient = sdkCore.validateAndParseAddress(feeOptions.recipient);
      return Payments.INTERFACE.encodeFunctionData('unwrapWBBWithFee', [toHex(amountMinimum), recipient, feeBips, feeRecipient]);
    } else {
      return Payments.INTERFACE.encodeFunctionData('unwrapWBB', [toHex(amountMinimum), recipient]);
    }
  };

  Payments.encodeSweepToken = function encodeSweepToken(token, amountMinimum, recipient, feeOptions) {
    recipient = sdkCore.validateAndParseAddress(recipient);

    if (!!feeOptions) {
      var feeBips = this.encodeFeeBips(feeOptions.fee);
      var feeRecipient = sdkCore.validateAndParseAddress(feeOptions.recipient);
      return Payments.INTERFACE.encodeFunctionData('sweepTokenWithFee', [token.address, toHex(amountMinimum), recipient, feeBips, feeRecipient]);
    } else {
      return Payments.INTERFACE.encodeFunctionData('sweepToken', [token.address, toHex(amountMinimum), recipient]);
    }
  };

  Payments.encodeRefundETH = function encodeRefundETH() {
    return Payments.INTERFACE.encodeFunctionData('refundETH');
  };

  return Payments;
}();
Payments.INTERFACE = /*#__PURE__*/new abi$2.Interface(IPeripheryPaymentsWithFee.abi);

var MaxUint128 = /*#__PURE__*/toHex( /*#__PURE__*/JSBI.subtract( /*#__PURE__*/JSBI.exponentiate( /*#__PURE__*/JSBI.BigInt(2), /*#__PURE__*/JSBI.BigInt(128)), /*#__PURE__*/JSBI.BigInt(1))); // type guard

function isMint(options) {
  return Object.keys(options).some(function (k) {
    return k === 'recipient';
  });
}

var NonfungiblePositionManager = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function NonfungiblePositionManager() {}

  NonfungiblePositionManager.encodeCreate = function encodeCreate(pool) {
    return NonfungiblePositionManager.INTERFACE.encodeFunctionData('createAndInitializePoolIfNecessary', [pool.token0.address, pool.token1.address, pool.fee, toHex(pool.sqrtRatioX96)]);
  };

  NonfungiblePositionManager.createCallParameters = function createCallParameters(pool) {
    return {
      calldata: this.encodeCreate(pool),
      value: toHex(0)
    };
  };

  NonfungiblePositionManager.addCallParameters = function addCallParameters(position, options) {
    !JSBI.greaterThan(position.liquidity, ZERO) ?  invariant(false, 'ZERO_LIQUIDITY')  : void 0;
    var calldatas = []; // get amounts

    var _position$mintAmounts = position.mintAmounts,
        amount0Desired = _position$mintAmounts.amount0,
        amount1Desired = _position$mintAmounts.amount1; // adjust for slippage

    var minimumAmounts = position.mintAmountsWithSlippage(options.slippageTolerance);
    var amount0Min = toHex(minimumAmounts.amount0);
    var amount1Min = toHex(minimumAmounts.amount1);
    var deadline = toHex(options.deadline); // create pool if needed

    if (isMint(options) && options.createPool) {
      calldatas.push(this.encodeCreate(position.pool));
    } // permits if necessary


    if (options.token0Permit) {
      calldatas.push(SelfPermit.encodePermit(position.pool.token0, options.token0Permit));
    }

    if (options.token1Permit) {
      calldatas.push(SelfPermit.encodePermit(position.pool.token1, options.token1Permit));
    } // mint


    if (isMint(options)) {
      var recipient = sdkCore.validateAndParseAddress(options.recipient);
      calldatas.push(NonfungiblePositionManager.INTERFACE.encodeFunctionData('mint', [{
        token0: position.pool.token0.address,
        token1: position.pool.token1.address,
        fee: position.pool.fee,
        tickLower: position.tickLower,
        tickUpper: position.tickUpper,
        amount0Desired: toHex(amount0Desired),
        amount1Desired: toHex(amount1Desired),
        amount0Min: amount0Min,
        amount1Min: amount1Min,
        recipient: recipient,
        deadline: deadline
      }]));
    } else {
      // increase
      calldatas.push(NonfungiblePositionManager.INTERFACE.encodeFunctionData('increaseLiquidity', [{
        tokenId: toHex(options.tokenId),
        amount0Desired: toHex(amount0Desired),
        amount1Desired: toHex(amount1Desired),
        amount0Min: amount0Min,
        amount1Min: amount1Min,
        deadline: deadline
      }]));
    }

    var value = toHex(0);

    if (options.useNative) {
      var wrapped = options.useNative.wrapped;
      !(position.pool.token0.equals(wrapped) || position.pool.token1.equals(wrapped)) ?  invariant(false, 'NO_WETH')  : void 0;
      var wrappedValue = position.pool.token0.equals(wrapped) ? amount0Desired : amount1Desired; // we only need to refund if we're actually sending ETH

      if (JSBI.greaterThan(wrappedValue, ZERO)) {
        calldatas.push(Payments.encodeRefundETH());
      }

      value = toHex(wrappedValue);
    }

    return {
      calldata: Multicall.encodeMulticall(calldatas),
      value: value
    };
  };

  NonfungiblePositionManager.encodeCollect = function encodeCollect(options) {
    var calldatas = [];
    var tokenId = toHex(options.tokenId);
    var involvesETH = options.expectedCurrencyOwed0.currency.isNative || options.expectedCurrencyOwed1.currency.isNative;
    var recipient = sdkCore.validateAndParseAddress(options.recipient); // collect

    calldatas.push(NonfungiblePositionManager.INTERFACE.encodeFunctionData('collect', [{
      tokenId: tokenId,
      recipient: involvesETH ? ADDRESS_ZERO : recipient,
      amount0Max: MaxUint128,
      amount1Max: MaxUint128
    }]));

    if (involvesETH) {
      var ethAmount = options.expectedCurrencyOwed0.currency.isNative ? options.expectedCurrencyOwed0.quotient : options.expectedCurrencyOwed1.quotient;
      var token = options.expectedCurrencyOwed0.currency.isNative ? options.expectedCurrencyOwed1.currency : options.expectedCurrencyOwed0.currency;
      var tokenAmount = options.expectedCurrencyOwed0.currency.isNative ? options.expectedCurrencyOwed1.quotient : options.expectedCurrencyOwed0.quotient;
      calldatas.push(Payments.encodeUnwrapWETH9(ethAmount, recipient));
      calldatas.push(Payments.encodeSweepToken(token, tokenAmount, recipient));
    }

    return calldatas;
  };

  NonfungiblePositionManager.collectCallParameters = function collectCallParameters(options) {
    var calldatas = NonfungiblePositionManager.encodeCollect(options);
    return {
      calldata: Multicall.encodeMulticall(calldatas),
      value: toHex(0)
    };
  }
  /**
   * Produces the calldata for completely or partially exiting a position
   * @param position The position to exit
   * @param options Additional information necessary for generating the calldata
   * @returns The call parameters
   */
  ;

  NonfungiblePositionManager.removeCallParameters = function removeCallParameters(position, options) {
    var calldatas = [];
    var deadline = toHex(options.deadline);
    var tokenId = toHex(options.tokenId); // construct a partial position with a percentage of liquidity

    var partialPosition = new Position({
      pool: position.pool,
      liquidity: options.liquidityPercentage.multiply(position.liquidity).quotient,
      tickLower: position.tickLower,
      tickUpper: position.tickUpper
    });
    !JSBI.greaterThan(partialPosition.liquidity, ZERO) ?  invariant(false, 'ZERO_LIQUIDITY')  : void 0; // slippage-adjusted underlying amounts

    var _partialPosition$burn = partialPosition.burnAmountsWithSlippage(options.slippageTolerance),
        amount0Min = _partialPosition$burn.amount0,
        amount1Min = _partialPosition$burn.amount1;

    if (options.permit) {
      calldatas.push(NonfungiblePositionManager.INTERFACE.encodeFunctionData('permit', [sdkCore.validateAndParseAddress(options.permit.spender), tokenId, toHex(options.permit.deadline), options.permit.v, options.permit.r, options.permit.s]));
    } // remove liquidity


    calldatas.push(NonfungiblePositionManager.INTERFACE.encodeFunctionData('decreaseLiquidity', [{
      tokenId: tokenId,
      liquidity: toHex(partialPosition.liquidity),
      amount0Min: toHex(amount0Min),
      amount1Min: toHex(amount1Min),
      deadline: deadline
    }]));

    var _options$collectOptio = options.collectOptions,
        expectedCurrencyOwed0 = _options$collectOptio.expectedCurrencyOwed0,
        expectedCurrencyOwed1 = _options$collectOptio.expectedCurrencyOwed1,
        rest = _objectWithoutPropertiesLoose(_options$collectOptio, ["expectedCurrencyOwed0", "expectedCurrencyOwed1"]);

    calldatas.push.apply(calldatas, NonfungiblePositionManager.encodeCollect(_extends({
      tokenId: toHex(options.tokenId),
      // add the underlying value to the expected currency already owed
      expectedCurrencyOwed0: expectedCurrencyOwed0.add(sdkCore.CurrencyAmount.fromRawAmount(expectedCurrencyOwed0.currency, amount0Min)),
      expectedCurrencyOwed1: expectedCurrencyOwed1.add(sdkCore.CurrencyAmount.fromRawAmount(expectedCurrencyOwed1.currency, amount1Min))
    }, rest)));

    if (options.liquidityPercentage.equalTo(ONE)) {
      if (options.burnToken) {
        calldatas.push(NonfungiblePositionManager.INTERFACE.encodeFunctionData('burn', [tokenId]));
      }
    } else {
      !(options.burnToken !== true) ?  invariant(false, 'CANNOT_BURN')  : void 0;
    }

    return {
      calldata: Multicall.encodeMulticall(calldatas),
      value: toHex(0)
    };
  };

  NonfungiblePositionManager.safeTransferFromParameters = function safeTransferFromParameters(options) {
    var recipient = sdkCore.validateAndParseAddress(options.recipient);
    var sender = sdkCore.validateAndParseAddress(options.sender);
    var calldata;

    if (options.data) {
      calldata = NonfungiblePositionManager.INTERFACE.encodeFunctionData('safeTransferFrom(address,address,uint256,bytes)', [sender, recipient, toHex(options.tokenId), options.data]);
    } else {
      calldata = NonfungiblePositionManager.INTERFACE.encodeFunctionData('safeTransferFrom(address,address,uint256)', [sender, recipient, toHex(options.tokenId)]);
    }

    return {
      calldata: calldata,
      value: toHex(0)
    };
  };

  return NonfungiblePositionManager;
}();
NonfungiblePositionManager.INTERFACE = /*#__PURE__*/new abi$2.Interface(INonfungiblePositionManager.abi);

/**
 * Represents the Uniswap V3 QuoterV1 contract with a method for returning the formatted
 * calldata needed to call the quoter contract.
 */

var SwapQuoter = /*#__PURE__*/function () {
  function SwapQuoter() {}

  /**
   * Produces the on-chain method name of the appropriate function within QuoterV2,
   * and the relevant hex encoded parameters.
   * @template TInput The input token, either Ether or an ERC-20
   * @template TOutput The output token, either Ether or an ERC-20
   * @param route The swap route, a list of pools through which a swap can occur
   * @param amount The amount of the quote, either an amount in, or an amount out
   * @param tradeType The trade type, either exact input or exact output
   * @param options The optional params including price limit and Quoter contract switch
   * @returns The formatted calldata
   */
  SwapQuoter.quoteCallParameters = function quoteCallParameters(route, amount, tradeType, options) {
    if (options === void 0) {
      options = {};
    }

    var singleHop = route.pools.length === 1;
    var quoteAmount = toHex(amount.quotient);
    var calldata;
    var swapInterface = options.useQuoterV2 ? this.V2INTERFACE : this.V1INTERFACE;

    if (singleHop) {
      var _options$sqrtPriceLim, _options;

      var baseQuoteParams = {
        tokenIn: route.tokenPath[0].address,
        tokenOut: route.tokenPath[1].address,
        fee: route.pools[0].fee,
        sqrtPriceLimitX96: toHex((_options$sqrtPriceLim = (_options = options) == null ? void 0 : _options.sqrtPriceLimitX96) != null ? _options$sqrtPriceLim : 0)
      };

      var v2QuoteParams = _extends({}, baseQuoteParams, tradeType == sdkCore.TradeType.EXACT_INPUT ? {
        amountIn: quoteAmount
      } : {
        amount: quoteAmount
      });

      var v1QuoteParams = [baseQuoteParams.tokenIn, baseQuoteParams.tokenOut, baseQuoteParams.fee, quoteAmount, baseQuoteParams.sqrtPriceLimitX96];
      var tradeTypeFunctionName = tradeType === sdkCore.TradeType.EXACT_INPUT ? 'quoteExactInputSingle' : 'quoteExactOutputSingle';
      calldata = swapInterface.encodeFunctionData(tradeTypeFunctionName, options.useQuoterV2 ? [v2QuoteParams] : v1QuoteParams);
    } else {
      var _options2;

      !(((_options2 = options) == null ? void 0 : _options2.sqrtPriceLimitX96) === undefined) ?  invariant(false, 'MULTIHOP_PRICE_LIMIT')  : void 0;
      var path = encodeRouteToPath(route, tradeType === sdkCore.TradeType.EXACT_OUTPUT);

      var _tradeTypeFunctionName = tradeType === sdkCore.TradeType.EXACT_INPUT ? 'quoteExactInput' : 'quoteExactOutput';

      calldata = swapInterface.encodeFunctionData(_tradeTypeFunctionName, [path, quoteAmount]);
    }

    return {
      calldata: calldata,
      value: toHex(0)
    };
  };

  return SwapQuoter;
}();
SwapQuoter.V1INTERFACE = /*#__PURE__*/new abi$2.Interface(IQuoter.abi);
SwapQuoter.V2INTERFACE = /*#__PURE__*/new abi$2.Interface(IQuoterV2.abi);

var Staker = /*#__PURE__*/function () {
  function Staker() {}
  /**
   *  To claim rewards, must unstake and then claim.
   * @param incentiveKey The unique identifier of a staking program.
   * @param options Options for producing the calldata to claim. Can't claim unless you unstake.
   * @returns The calldatas for 'unstakeToken' and 'claimReward'.
   */


  Staker.encodeClaim = function encodeClaim(incentiveKey, options) {
    var _options$amount;

    var calldatas = [];
    calldatas.push(Staker.INTERFACE.encodeFunctionData('unstakeToken', [this._encodeIncentiveKey(incentiveKey), toHex(options.tokenId)]));
    var recipient = sdkCore.validateAndParseAddress(options.recipient);
    var amount = (_options$amount = options.amount) != null ? _options$amount : 0;
    calldatas.push(Staker.INTERFACE.encodeFunctionData('claimReward', [incentiveKey.rewardToken.address, recipient, toHex(amount)]));
    return calldatas;
  }
  /**
   *
   * Note:  A `tokenId` can be staked in many programs but to claim rewards and continue the program you must unstake, claim, and then restake.
   * @param incentiveKeys An IncentiveKey or array of IncentiveKeys that `tokenId` is staked in.
   * Input an array of IncentiveKeys to claim rewards for each program.
   * @param options ClaimOptions to specify tokenId, recipient, and amount wanting to collect.
   * Note that you can only specify one amount and one recipient across the various programs if you are collecting from multiple programs at once.
   * @returns
   */
  ;

  Staker.collectRewards = function collectRewards(incentiveKeys, options) {
    incentiveKeys = Array.isArray(incentiveKeys) ? incentiveKeys : [incentiveKeys];
    var calldatas = [];

    for (var i = 0; i < incentiveKeys.length; i++) {
      // the unique program tokenId is staked in
      var incentiveKey = incentiveKeys[i]; // unstakes and claims for the unique program

      calldatas = calldatas.concat(this.encodeClaim(incentiveKey, options)); // re-stakes the position for the unique program

      calldatas.push(Staker.INTERFACE.encodeFunctionData('stakeToken', [this._encodeIncentiveKey(incentiveKey), toHex(options.tokenId)]));
    }

    return {
      calldata: Multicall.encodeMulticall(calldatas),
      value: toHex(0)
    };
  }
  /**
   *
   * @param incentiveKeys A list of incentiveKeys to unstake from. Should include all incentiveKeys (unique staking programs) that `options.tokenId` is staked in.
   * @param withdrawOptions Options for producing claim calldata and withdraw calldata. Can't withdraw without unstaking all programs for `tokenId`.
   * @returns Calldata for unstaking, claiming, and withdrawing.
   */
  ;

  Staker.withdrawToken = function withdrawToken(incentiveKeys, withdrawOptions) {
    var calldatas = [];
    incentiveKeys = Array.isArray(incentiveKeys) ? incentiveKeys : [incentiveKeys];
    var claimOptions = {
      tokenId: withdrawOptions.tokenId,
      recipient: withdrawOptions.recipient,
      amount: withdrawOptions.amount
    };

    for (var i = 0; i < incentiveKeys.length; i++) {
      var incentiveKey = incentiveKeys[i];
      calldatas = calldatas.concat(this.encodeClaim(incentiveKey, claimOptions));
    }

    var owner = sdkCore.validateAndParseAddress(withdrawOptions.owner);
    calldatas.push(Staker.INTERFACE.encodeFunctionData('withdrawToken', [toHex(withdrawOptions.tokenId), owner, withdrawOptions.data ? withdrawOptions.data : toHex(0)]));
    return {
      calldata: Multicall.encodeMulticall(calldatas),
      value: toHex(0)
    };
  }
  /**
   *
   * @param incentiveKeys A single IncentiveKey or array of IncentiveKeys to be encoded and used in the data parameter in `safeTransferFrom`
   * @returns An IncentiveKey as a string
   */
  ;

  Staker.encodeDeposit = function encodeDeposit(incentiveKeys) {
    incentiveKeys = Array.isArray(incentiveKeys) ? incentiveKeys : [incentiveKeys];
    var data;

    if (incentiveKeys.length > 1) {
      var keys = [];

      for (var i = 0; i < incentiveKeys.length; i++) {
        var incentiveKey = incentiveKeys[i];
        keys.push(this._encodeIncentiveKey(incentiveKey));
      }

      data = abi$2.defaultAbiCoder.encode([Staker.INCENTIVE_KEY_ABI + "[]"], [keys]);
    } else {
      data = abi$2.defaultAbiCoder.encode([Staker.INCENTIVE_KEY_ABI], [this._encodeIncentiveKey(incentiveKeys[0])]);
    }

    return data;
  }
  /**
   *
   * @param incentiveKey An `IncentiveKey` which represents a unique staking program.
   * @returns An encoded IncentiveKey to be read by ethers
   */
  ;

  Staker._encodeIncentiveKey = function _encodeIncentiveKey(incentiveKey) {
    var _incentiveKey$pool = incentiveKey.pool,
        token0 = _incentiveKey$pool.token0,
        token1 = _incentiveKey$pool.token1,
        fee = _incentiveKey$pool.fee;
    var refundee = sdkCore.validateAndParseAddress(incentiveKey.refundee);
    return {
      rewardToken: incentiveKey.rewardToken.address,
      pool: Pool.getAddress(token0, token1, fee),
      startTime: toHex(incentiveKey.startTime),
      endTime: toHex(incentiveKey.endTime),
      refundee: refundee
    };
  };

  return Staker;
}();
Staker.INTERFACE = /*#__PURE__*/new abi$2.Interface(IUniswapV3Staker.abi);
Staker.INCENTIVE_KEY_ABI = 'tuple(address rewardToken, address pool, uint256 startTime, uint256 endTime, address refundee)';

/**
 * Represents the Uniswap V3 SwapRouter, and has static methods for helping execute trades.
 */

var SwapRouter = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function SwapRouter() {}
  /**
   * Produces the on-chain method name to call and the hex encoded parameters to pass as arguments for a given trade.
   * @param trade to produce call parameters for
   * @param options options for the call parameters
   */


  SwapRouter.swapCallParameters = function swapCallParameters(trades, options) {
    if (!Array.isArray(trades)) {
      trades = [trades];
    }

    var sampleTrade = trades[0];
    var tokenIn = sampleTrade.inputAmount.currency.wrapped;
    var tokenOut = sampleTrade.outputAmount.currency.wrapped; // All trades should have the same starting and ending token.

    !trades.every(function (trade) {
      return trade.inputAmount.currency.wrapped.equals(tokenIn);
    }) ?  invariant(false, 'TOKEN_IN_DIFF')  : void 0;
    !trades.every(function (trade) {
      return trade.outputAmount.currency.wrapped.equals(tokenOut);
    }) ?  invariant(false, 'TOKEN_OUT_DIFF')  : void 0;
    var calldatas = [];
    var ZERO_IN = sdkCore.CurrencyAmount.fromRawAmount(trades[0].inputAmount.currency, 0);
    var ZERO_OUT = sdkCore.CurrencyAmount.fromRawAmount(trades[0].outputAmount.currency, 0);
    var totalAmountOut = trades.reduce(function (sum, trade) {
      return sum.add(trade.minimumAmountOut(options.slippageTolerance));
    }, ZERO_OUT); // flag for whether a refund needs to happen

    var mustRefund = sampleTrade.inputAmount.currency.isNative && sampleTrade.tradeType === sdkCore.TradeType.EXACT_OUTPUT;
    var inputIsNative = sampleTrade.inputAmount.currency.isNative; // flags for whether funds should be send first to the router

    var outputIsNative = sampleTrade.outputAmount.currency.isNative;
    var routerMustCustody = outputIsNative || !!options.fee;
    var totalValue = inputIsNative ? trades.reduce(function (sum, trade) {
      return sum.add(trade.maximumAmountIn(options.slippageTolerance));
    }, ZERO_IN) : ZERO_IN; // encode permit if necessary

    if (options.inputTokenPermit) {
      !sampleTrade.inputAmount.currency.isToken ?  invariant(false, 'NON_TOKEN_PERMIT')  : void 0;
      calldatas.push(SelfPermit.encodePermit(sampleTrade.inputAmount.currency, options.inputTokenPermit));
    }

    var recipient = sdkCore.validateAndParseAddress(options.recipient);
    var deadline = toHex(options.deadline);

    for (var _iterator = _createForOfIteratorHelperLoose(trades), _step; !(_step = _iterator()).done;) {
      var trade = _step.value;

      for (var _iterator2 = _createForOfIteratorHelperLoose(trade.swaps), _step2; !(_step2 = _iterator2()).done;) {
        var _step2$value = _step2.value,
            route = _step2$value.route,
            inputAmount = _step2$value.inputAmount,
            outputAmount = _step2$value.outputAmount;
        var amountIn = toHex(trade.maximumAmountIn(options.slippageTolerance, inputAmount).quotient);
        var amountOut = toHex(trade.minimumAmountOut(options.slippageTolerance, outputAmount).quotient); // flag for whether the trade is single hop or not

        var singleHop = route.pools.length === 1;

        if (singleHop) {
          if (trade.tradeType === sdkCore.TradeType.EXACT_INPUT) {
            var _options$sqrtPriceLim;

            var exactInputSingleParams = {
              tokenIn: route.tokenPath[0].address,
              tokenOut: route.tokenPath[1].address,
              fee: route.pools[0].fee,
              recipient: routerMustCustody ? ADDRESS_ZERO : recipient,
              deadline: deadline,
              amountIn: amountIn,
              amountOutMinimum: amountOut,
              sqrtPriceLimitX96: toHex((_options$sqrtPriceLim = options.sqrtPriceLimitX96) != null ? _options$sqrtPriceLim : 0)
            };
            calldatas.push(SwapRouter.INTERFACE.encodeFunctionData('exactInputSingle', [exactInputSingleParams]));
          } else {
            var _options$sqrtPriceLim2;

            var exactOutputSingleParams = {
              tokenIn: route.tokenPath[0].address,
              tokenOut: route.tokenPath[1].address,
              fee: route.pools[0].fee,
              recipient: routerMustCustody ? ADDRESS_ZERO : recipient,
              deadline: deadline,
              amountOut: amountOut,
              amountInMaximum: amountIn,
              sqrtPriceLimitX96: toHex((_options$sqrtPriceLim2 = options.sqrtPriceLimitX96) != null ? _options$sqrtPriceLim2 : 0)
            };
            calldatas.push(SwapRouter.INTERFACE.encodeFunctionData('exactOutputSingle', [exactOutputSingleParams]));
          }
        } else {
          !(options.sqrtPriceLimitX96 === undefined) ?  invariant(false, 'MULTIHOP_PRICE_LIMIT')  : void 0;
          var path = encodeRouteToPath(route, trade.tradeType === sdkCore.TradeType.EXACT_OUTPUT);

          if (trade.tradeType === sdkCore.TradeType.EXACT_INPUT) {
            var exactInputParams = {
              path: path,
              recipient: routerMustCustody ? ADDRESS_ZERO : recipient,
              deadline: deadline,
              amountIn: amountIn,
              amountOutMinimum: amountOut
            };
            calldatas.push(SwapRouter.INTERFACE.encodeFunctionData('exactInput', [exactInputParams]));
          } else {
            var exactOutputParams = {
              path: path,
              recipient: routerMustCustody ? ADDRESS_ZERO : recipient,
              deadline: deadline,
              amountOut: amountOut,
              amountInMaximum: amountIn
            };
            calldatas.push(SwapRouter.INTERFACE.encodeFunctionData('exactOutput', [exactOutputParams]));
          }
        }
      }
    } // unwrap


    if (routerMustCustody) {
      if (!!options.fee) {
        if (outputIsNative) {
          calldatas.push(Payments.encodeUnwrapWETH9(totalAmountOut.quotient, recipient, options.fee));
        } else {
          calldatas.push(Payments.encodeSweepToken(sampleTrade.outputAmount.currency.wrapped, totalAmountOut.quotient, recipient, options.fee));
        }
      } else {
        calldatas.push(Payments.encodeUnwrapWETH9(totalAmountOut.quotient, recipient));
      }
    } // refund


    if (mustRefund) {
      calldatas.push(Payments.encodeRefundETH());
    }

    return {
      calldata: Multicall.encodeMulticall(calldatas),
      value: toHex(totalValue.quotient)
    };
  };

  return SwapRouter;
}();
SwapRouter.INTERFACE = /*#__PURE__*/new abi$2.Interface(ISwapRouter.abi);

exports.ADDRESS_ZERO = ADDRESS_ZERO;
exports.FACTORY_ADDRESS = FACTORY_ADDRESS;
exports.FullMath = FullMath;
exports.LiquidityMath = LiquidityMath;
exports.Multicall = Multicall;
exports.NoTickDataProvider = NoTickDataProvider;
exports.NonfungiblePositionManager = NonfungiblePositionManager;
exports.POOL_INIT_CODE_HASH = POOL_INIT_CODE_HASH;
exports.Payments = Payments;
exports.Pool = Pool;
exports.Position = Position;
exports.PositionLibrary = PositionLibrary;
exports.Route = Route;
exports.SelfPermit = SelfPermit;
exports.SqrtPriceMath = SqrtPriceMath;
exports.Staker = Staker;
exports.SwapMath = SwapMath;
exports.SwapQuoter = SwapQuoter;
exports.SwapRouter = SwapRouter;
exports.TICK_SPACINGS = TICK_SPACINGS;
exports.Tick = Tick;
exports.TickLibrary = TickLibrary;
exports.TickList = TickList;
exports.TickListDataProvider = TickListDataProvider;
exports.TickMath = TickMath;
exports.Trade = Trade;
exports.computePoolAddress = computePoolAddress;
exports.encodeRouteToPath = encodeRouteToPath;
exports.encodeSqrtRatioX96 = encodeSqrtRatioX96;
exports.isSorted = isSorted;
exports.maxLiquidityForAmounts = maxLiquidityForAmounts;
exports.mostSignificantBit = mostSignificantBit;
exports.nearestUsableTick = nearestUsableTick;
exports.priceToClosestTick = priceToClosestTick;
exports.subIn256 = subIn256;
exports.tickToPrice = tickToPrice;
exports.toHex = toHex;
exports.tradeComparator = tradeComparator;
//# sourceMappingURL=v3-sdk.cjs.development.js.map
