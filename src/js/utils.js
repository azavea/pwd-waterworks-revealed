'use strict';

var $ = require('jquery').$;

/**
 * Make font large enough to fill the appropriate space but ensure that it does
 * not get too large. This helps make the text look good on various devices.
 * 
 * @param $target - A jQuery selection of the element for which the text should
 * be resized.
 * 
 * @param $container - A jQuery selection of the container in which the target
 * should be constrained 
 * 
 * @param options - dictionary of options
 * offset: int - buffer size in px.
 * allowUpscale: boolean - allow the font size to exceed the size specified in the CSS. 
 * subElement: string - apply scaling only to elements matching this selection within $target.
 */
function adjustFontSizeToEl($target, $container, options) {
    options = options || {};
    options.offset = options.offset || 0;
    options.allowUpscale = options.allowUpscale || false;
    options.subElement = options.subElement || null;

    var $contextText;

    if (options.subElement !== null) {
        $contextText = $target.find(options.subElement);
    } else {
        $contextText = $target;
    }

    var parentHeight = $container.height() - options.offset,
        fontSize = 12,
        increment = 1,
        lineHeightMultiplier = 1.5, // Set line height to be 1.5 times the font-size, a commonly recommended guideline
        maxFontSize = options.allowUpscale ? Infinity : Number($contextText.css('font-size').replace('px', ''));

    do {
        $contextText.css('font-size', fontSize + 'px');
        $contextText.css('line-height', (fontSize * lineHeightMultiplier) + 'px');
        fontSize += increment;
    } while(parentHeight > $target.height() && fontSize <= maxFontSize);

    // We might have gone over. If so back off one notch.
    if (parentHeight < $target.height()) {
        fontSize -= increment;
        $contextText.css('font-size', fontSize + 'px');
        $contextText.css('line-height', (fontSize * lineHeightMultiplier) + 'px');
    }
}

module.exports = {
    adjustFontSizeToEl: adjustFontSizeToEl
};
