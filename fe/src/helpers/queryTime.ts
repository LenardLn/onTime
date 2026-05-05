export const queryTime = (time: string): number => {
  const value = parseInt(time.slice(0, -1));
  const unit = time.slice(-1);

  switch (unit) {
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    case "d":
      return value * 24 * 60 * 60 * 1000;
    default:
      throw new Error("Invalid time format. Use m, h, or d.");
  }
};
