const reportWebVitals = (onPerfEntry?: any) => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    import('web-vitals').then(({
      onCLS,
      onFID,
      onFCP,
      onLCP,
      onTTFB
    }) => {
      onCLS(onPerfEntry);
      onFID(onPerfEntry);
      onFCP(onPerfEntry);
      onLCP(onPerfEntry);
      onTTFB(onPerfEntry);
    }).catch(error => {
      console.error('Failed to load web-vitals module:', error);
    });
  }
};

export default reportWebVitals;