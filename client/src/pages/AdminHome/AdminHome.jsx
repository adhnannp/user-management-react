import React, { useState, useEffect } from "react";
import { UserPlus, Pencil, Trash2 } from "lucide-react";
import AddUserModal from "../../components/AddUserModal";
import EditUserModal from "../../components/EditUserModal";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import "./AdminHome.css";
import { toast } from 'react-toastify';
import axios from "axios";
import Header from "../../components/Header";
import { logout } from '../../features/authSlice'; 
import { useDispatch} from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AdminHome = () => {
  const [users, setUsers] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/admin/get-users");
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (query) => {
    if (query.trim()) {
      const filteredUsers = users.filter(
        (user) =>
          user.userName.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase())
      );
      setUsers(filteredUsers);
    } else {
      fetchUsers();
    }
  };

  const handleLogout = () => {
    dispatch(logout()); 
    navigate('/admin');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/admin/add-user", formData);
      setUsers((prevUsers) => [...prevUsers, response.data.user]);
      setFormData({ userName: "", email: "", password: "" });
      setIsAddModalOpen(false);
      toast.success("User added successfully!");
      console.log("User added successfully:", response.data.message);
    } catch (error) {
      toast.error(`Error adding user: ${error.response?.data || error.message}`);
      console.error("Error adding user:", error.response?.data || error.message);
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setFormData({
      userName: user.userName,
      email: user.email,
      password: user.password,
    });
    setIsEditModalOpen(true);
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(`http://localhost:3000/admin/edit-user/${selectedUser._id}`, formData);
      const updatedUsers = users.map((user) =>
        user._id === selectedUser._id ? { ...user, ...formData } : user
      );
      setUsers(updatedUsers);
      setIsEditModalOpen(false);
      setSelectedUser(null);
      setFormData({ userName: "", email: "", password: "" });
      toast.success("User updated successfully!");
      console.log("User updated successfully:", response.data.message);
    } catch (error) {
      toast.error(`Error updating user: ${error.response?.data.message || error.message}`);
      console.error("Error updating user:", error.response?.data.message || error.message);
    }
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteUser = async () => {
    try {
      await axios.delete(`http://localhost:3000/admin/delete-user/${selectedUser._id}`);
      const updatedUsers = users.filter((user) => user._id !== selectedUser._id);
      setUsers(updatedUsers);
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
      toast.success("User deleted successfully!");
    } catch (error) {
      toast.error(`Error deleting user: ${error.response?.data.message || error.message}`);
      console.error("Error deleting user:", error.response?.data.message || error.message);
    }
  };

  return (
    <>
      <Header onSearch={handleSearch} onLogout={handleLogout} />
      <div className="admin-container">
      <div className="content-wrapper">
        <div className="header">
          <button
            className="add-user-btn"
            onClick={() => setIsAddModalOpen(true)}
          >
            <UserPlus size={20} />
            Add User
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Password</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.userName}</td>
                    <td>{user.email}</td>
                    <td>{user.password}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="edit-btn"
                          onClick={() => handleEditClick(user)}
                        >
                          <Pencil size={16} />
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteClick(user)}
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {isAddModalOpen && (
          <AddUserModal
            formData={formData}
            handleInputChange={handleInputChange}
            handleAddUser={handleAddUser}
            closeModal={() => setIsAddModalOpen(false)}
          />
        )}
        {isEditModalOpen && (
          <EditUserModal
            formData={formData}
            handleInputChange={handleInputChange}
            handleEditUser={handleEditUser}
            closeModal={() => setIsEditModalOpen(false)}
          />
        )}
        {isDeleteModalOpen && (
          <DeleteConfirmationModal
            selectedUser={selectedUser}
            handleDeleteUser={handleDeleteUser}
            closeModal={() => setIsDeleteModalOpen(false)}
          />
        )}
      </div>
    </div>
    </>
  );
};

export default AdminHome;
