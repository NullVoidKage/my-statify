export const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    } else {
      return num;
    }
  };
  
export const truncateUsername = (name: string | null): string => {
  if (name && name.length > 15) {
    return name.slice(0, 15) + "...";
  }
  return name || "";
};