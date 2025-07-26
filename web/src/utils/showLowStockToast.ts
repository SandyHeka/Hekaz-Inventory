export const showLowStockToast = (): boolean => {
  const key = "lowStockToastLogs";
  const logs = JSON.parse(localStorage.getItem(key) || "[]");

  const today = new Date().toISOString().split("T")[0];
  const todayLogs = logs.filter((entry: string) => entry === today);

  if (todayLogs.length >= 2) return false;

  localStorage.setItem(key, JSON.stringify([...todayLogs, today]));
  return true;
};
