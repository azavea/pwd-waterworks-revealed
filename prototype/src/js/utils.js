export function delay(duration, func) {
    return window.setTimeout(func, duration);
}

export function cancelDelay(id) {
    return window.clearTimeout(id);
}
