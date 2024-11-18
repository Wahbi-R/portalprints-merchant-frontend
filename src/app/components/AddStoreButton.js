import { useState } from 'react';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import AddStoreModal from './AddStoreModal'; // Import the modal

export default function AddStoreButton({ onStoreAdded }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="flex flex-col items-center text-white">
      {/* Add Store Button */}
      <div
        className="bg-green-600 rounded-full cursor-pointer"
        onClick={handleOpenModal}
      >
        <PlusCircleIcon className="h-12 w-12" />
      </div>
      <span className="text-xs mt-2">Add Store</span>

      {/* Add Store Modal */}
      <AddStoreModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={onStoreAdded} // Callback for refreshing parent data
      />
    </div>
  );
}
