type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black  bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 border-b dark:border-gray-700  p-6 rounded-lg shadow-lg w-96">
        <button
          className="absolute text-gray-700 dark:text-white-200 text-xl"
          onClick={onClose}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};
export default Modal;
