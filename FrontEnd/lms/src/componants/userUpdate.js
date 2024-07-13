import React, { useState } from 'react';
import './css/userUpdate.css';
import userImage from './css/user1.png'; // Import the image

function FunctionalComUpdateUser() {
    const [user, setUser] = useState({
        username: '',
        email: '',
        role: '',
        status: '',
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add logic to handle user update, e.g., sending data to a server
        console.log('User updated:', user);
        setMessage('User updated successfully!');
        // Optionally reset form after update
        // setUser({ username: '', email: '', role: '', status: '' });
    };

    const handleReset = () => {
        setUser({ username: '', email: '', role: '', status: '' });
        setMessage('');
    };

    return (
        <div className="update-user-page">
            <h1>Update User</h1>
            <img src={userImage} alt="User" className="user-image" />
            {message && <p className="success-message">{message}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={user.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="role">Role</label>
                    <input
                        type="text"
                        id="role"
                        name="role"
                        value={user.role}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select
                        id="status"
                        name="status"
                        value={user.status}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
                <div className="form-buttons">
                    <button type="submit">Update User</button>
                    <button type="button" onClick={handleReset}>Reset</button>
                </div>
            </form>
        </div>
    );
}

export default FunctionalComUpdateUser;