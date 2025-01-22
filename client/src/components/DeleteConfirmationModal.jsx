import React from "react";
import { X } from "lucide-react";

const DeleteConfirmationModal = ({ selectedUser, handleDeleteUser, closeModal }) => (
  <div className="modal-overlay">
    <div className="modal">
      <div className="modal-header">
        <h2 className="modal-title">Delete User</h2>
        <button className="close-btn" onClick={closeModal}>
          <X size={20} />
        </button>
      </div>
      <div className="delete-modal-content">
        <p className="delete-modal-text">
          Are you sure you want to delete "{selectedUser?.userName}"?
        </p>
        <div className="modal-actions">
          <button className="cancel-btn" onClick={closeModal}>
            Cancel
          </button>
          <button className="delete-btn" onClick={handleDeleteUser}>
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default DeleteConfirmationModal;
