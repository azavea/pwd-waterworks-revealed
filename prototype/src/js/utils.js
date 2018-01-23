export function delay(duration, func, ...params) {
    return window.setTimeout(func, duration, params);
}

export function cancelDelay(id) {
    return window.clearTimeout(id);
}
