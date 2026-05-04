export const buildQueryParams = (filters: Record<string, any>) => {
  const params = new URLSearchParams();

  const append = (key: string, value: any) => {
    if (value === null || value === undefined) return;

    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v !== null && v !== undefined) {
          params.append(key, String(v));
        }
      });
    } else {
      params.append(key, String(value));
    }
  };

  Object.entries(filters).forEach(([key, value]) => {
    append(key, value);
  });

  return params;
};
