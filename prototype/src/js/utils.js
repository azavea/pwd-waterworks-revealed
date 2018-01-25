import { alphaConstants, betaConstants } from './constants';

export function delay(duration, func, ...params) {
    return window.setTimeout(func, duration, params);
}

export function cancelDelay(id) {
    return window.clearTimeout(id);
}

export function calculateNormalizedAlphaOffset(target, reading) {
    const inRangeModulo = function(x, min, max, modulo) {
        if (max > min) {
            // range does not span the MODULO
            return x >= min && x <= max;
        } else if (min === max) {
            // just in case
            return x === min;
        } else {
            // range spans the modulo
            return (x >= min && x <= modulo) || (x >= 0 && x <= max);
        }
    };

    const { buffer } = alphaConstants;
    let minThreshold = target - buffer;
    if (minThreshold < 0) {
        minThreshold += 360;
    }
    const maxThreshold = (target + buffer) % 360;
    const opposite = (target + 180) % 360;

    let normalizedOffset = 0,
        numerator = 0,
        denominator = 0;

    if (inRangeModulo(reading, minThreshold, maxThreshold, 360)) {
        // within range
        normalizedOffset = 0;
    } else if (inRangeModulo(reading, opposite, minThreshold, 360)) {
        // below range
        numerator = reading - opposite;
        if (numerator < 0) {
            numerator += 360;
        }
        denominator = minThreshold - opposite;
        if (denominator < 0) {
            denominator += 360;
        }
        normalizedOffset = 1 - numerator / denominator;
    } else if (inRangeModulo(reading, maxThreshold, opposite, 360)) {
        // above range
        numerator = reading - maxThreshold;
        if (numerator < 0) {
            numerator += 360;
        }
        denominator = opposite - maxThreshold;
        if (denominator < 0) {
            denominator += 360;
        }
        normalizedOffset = 0 - numerator / denominator;
    } else {
        // reading === opposite
        normalizedOffset = 1;
    }

    return normalizedOffset;
}

export function calculateNormalizedBetaOffset(reading) {
    const { target, buffer, min, max } = betaConstants;
    const minThreshold = Math.max(target - buffer, min);
    const maxThreshold = Math.min(target + buffer, max);
    let normalizedOffset = 0;

    if (reading < min) {
        normalizedOffset = 1;
    } else if (reading < minThreshold) {
        normalizedOffset = 1 - (reading - min) / (minThreshold - min);
    } else if (reading >= minThreshold && reading <= maxThreshold) {
        normalizedOffset = 0;
    } else if (reading < max) {
        normalizedOffset = 0 - (reading - maxThreshold) / (max - maxThreshold);
    } else {
        normalizedOffset = -1;
    }

    return normalizedOffset;
}
