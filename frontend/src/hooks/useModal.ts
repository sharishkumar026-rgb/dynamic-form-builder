import { useCallback, useState } from "react";

interface UseModalResult {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  toggleModal: () => void;
}

const useModal = (
  initialOpen: boolean = false
): UseModalResult => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleModal = useCallback(() => {
    setIsOpen((current) => !current);
  }, []);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
  };
};

export default useModal;