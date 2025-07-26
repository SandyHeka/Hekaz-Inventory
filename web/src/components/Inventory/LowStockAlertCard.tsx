import { useEffect, useState } from "react";
import { getLowStockProducts } from "../../api/inventoryService";
import { showLowStockToast } from "../../utils/showLowStockToast";
import ToastMessage from "../ToastMessage";

const LowStockAlertCard = () => {
  const [items, setItems] = useState([]);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchLowStock = async () => {
      try {
        const res = await getLowStockProducts();
        const lowStockItems = res.slice(0, 5);

        setItems(lowStockItems);
        if (lowStockItems.length > 0 && showLowStockToast()) {
          setShowToast(true);
        }
      } catch (err) {
        console.error("Failed to load low stock item");
      }
    };
    fetchLowStock();
  }, []);

  return (
    <>
      {showToast && (
        <ToastMessage
          type="warning"
          message={`Low stock alert: ${items
            .map((item) => item.name)
            .join(", ")}`}
        />
      )}
    </>
  );
};

export default LowStockAlertCard;
