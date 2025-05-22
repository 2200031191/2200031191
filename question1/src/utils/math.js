export const covariance = (x, y) => {
    const n = x.length;
    if (n !== y.length || n <= 1) return 0;
    const meanX = x.reduce((sum, val) => sum + val, 0) / n;
    const meanY = y.reduce((sum, val) => sum + val, 0) / n;
    let cov = 0;
    for (let i = 0; i < n; i++) {
      cov += (x[i] - meanX) * (y[i] - meanY);
    }
    return cov / (n - 1);
  };
  
  export const standardDeviation = (x) => {
    const n = x.length;
    if (n <= 1) return 0;
    const mean = x.reduce((sum, val) => sum + val, 0) / n;
    const variance = x.reduce((sum, val) => sum + (val - mean) ** 2, 0) / (n - 1);
    return Math.sqrt(variance);
  };
  
  export const pearsonCorrelation = (x, y) => {
    const cov = covariance(x, y);
    const stdX = standardDeviation(x);
    const stdY = standardDeviation(y);
    if (stdX === 0 || stdY === 0) return 0;
    return cov / (stdX * stdY);
  };