import $ from 'jquery';
import '../sass/v1.scss';

const ORIENTATION_CONSTANTS = {
    alpha: {
        target: 180,
        buffer: 20
    },
    beta: {
        target: 68,
        buffer: 13
    },
    webkit: {
        accuracy: 50
    }
};

const MODE = {
    START: 'START',
    ALIGN_VERTICAL: 'ALIGN_VERTICAL',
    ALIGN_HORIZONTAL: 'ALIGN_HORIZONTAL',
    ALIGNED: 'ALIGNED'
};

let alignedX = false;
let alignedY = false;

let initialOffset = null,
    mode,
    $canvas,
    $device,
    $target,
    $data,
    $alpha,
    $beta;

function round(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

function calculateNormalizedOffsetY(reading) {
    const containerSize = $canvas.outerHeight();
    const size = $device.outerHeight();
    const { target, buffer } = ORIENTATION_CONSTANTS.beta;

    const min = 0;
    const max = 90;
    const minThreshold = Math.max(target - buffer, min);
    const maxThreshold = Math.min(target + buffer, max);

    const maxOffset = (containerSize - size) / 2;
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

    return normalizedOffset * maxOffset;
}

function calculateNormalizedOffsetX(reading) {
    const containerSize = $canvas.outerWidth();
    const size = $device.outerWidth();
    const { target, buffer } = ORIENTATION_CONSTANTS.alpha;

    const opposite = (target + 180) % 360;
    let minThreshold = target - buffer;
    if (minThreshold < 0) {
        minThreshold += 360;
    }
    const maxThreshold = (target + buffer) % 360;

    const maxOffset = (containerSize - size) / 2;
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

    return normalizedOffset * maxOffset;
}

function inRangeModulo(x, min, max, modulo) {
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
}

function setPositionX(reading) {
    let offset = calculateNormalizedOffsetX(reading);

    $device.css('--device-offsetX', -offset);
    $target.css('--device-offsetX', offset);

    alignedX = offset == 0 ? true : false;
}

function setPositionY(reading) {
    let offset = calculateNormalizedOffsetY(reading);

    $device.css('--device-offsetY', offset);
    $target.css('--device-offsetY', -offset);

    alignedY = offset == 0 ? true : false;
}

// TODO Unused. Needs work. May not be necessary
function calibratedWebkitCompassHeading(event) {
    if (!event.webkitCompassHeading) {
        return NaN;
    }

    if (
        initialOffset === null &&
        +event.webkitCompassAccuracy > 0 &&
        +event.webkitCompassAccuracy < ORIENTATION_CONSTANTS.webkit.accuracy
    ) {
        initialOffset = event.webkitCompassHeading - event.alpha;
        // return initialOffset;
    }

    // use relative offset after initial accurate bearing
    let alpha = event.alpha + initialOffset;
    if (alpha < 0) {
        alpha += 360;
    }
    return alpha;
}

function handleDeviceOrientation(event) {
    let alpha, beta;

    if (event.webkitCompassHeading) {
        // iOS
        // alpha = calibratedWebkitCompassHeading(event);
        alpha = event.webkitCompassHeading;
    } else if (event.absolute) {
        // Chrome is 180º flipped from iOS
        // alpha = (event.alpha + 180) % 360;
        alpha = event.alpha;
    } else {
        // alpha not absolute
        return;
    }

    beta = event.beta;

    processTelemetry(alpha, beta);
}

function processTelemetry(alpha, beta) {
    $alpha.text(round(alpha, 0));
    $beta.text(round(beta, 0));

    setPositionY(beta);
    setPositionX(alpha);

    // Light em up if aligned in the middle
    alignedX == true && alignedY == true
        ? $device.addClass('-on')
        : $device.removeClass('-on');
}

$(function() {
    $canvas = $('.illustration');
    $device = $('.device');
    $target = $('.target');

    $data = $('.data');
    $alpha = $('.dimension.-alpha > .value');
    $beta = $('.dimension.-beta > .value');

    mode = MODE.START;

    let supportedEventName = null;

    if ('ondeviceorientationabsolute' in window) {
        // Chrome 50+
        supportedEventName = 'deviceorientationabsolute';
    } else if ('ondeviceorientation' in window) {
        // Chrome <50 or iOS
        // For iOS, use event.webkitCompassHeading instead of event.alpha
        // For Chrome < 50, use event.alpha, which *should* always be absolute
        // but check for event.absolute just in case
        supportedEventName = 'deviceorientation';
    }

    if (supportedEventName) {
        window.addEventListener(
            supportedEventName,
            handleDeviceOrientation,
            true
        );
    } else {
        console.log('Device orientation not supported');
    }
});
