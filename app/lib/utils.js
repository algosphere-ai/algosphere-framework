function formatMarketcap(value) {
    const num = parseFloat(value);
    if (num >= 1_000_000) {
        return `${(num / 1_000_000).toFixed(0)}M`;
    }
    else if (num >= 1_000) {
        return `${(num / 1_000).toFixed(0)}K`;
    }
    return num.toFixed(0);
}

export { formatMarketcap };