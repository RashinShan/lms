import React, { useState, useEffect } from 'react';
import './css/adminPage.css';
import { Link, useNavigate } from "react-router-dom";

function FunctionalComAdmin() {
    const [books, setBooks] = useState([]);
    const [users, setUsers] = useState([]);
    const [issuedUsers, setIssuedUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchUser, setSearchUser] = useState('');
    const [searchIssuedUser, setSearchIssuedUser] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchBooks();
        fetchUsers();
        fetchIssuedUsers();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await fetch('http://localhost:4000/books', {
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to fetch books');
            }
            const data = await response.json();
            setBooks(data);
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    const handleDelete = async (bookId) => {
        try {
            const response = await fetch(`http://localhost:4000/books/${bookId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorMessage = await response.json();
                throw new Error(`Failed to delete book: ${errorMessage.message}`);
            }

            alert('Book deleted successfully');
            fetchBooks(); // Optionally update state or perform other actions upon successful deletion
        } catch (error) {
            console.error('Error deleting book:', error);
            alert(`Error deleting book: ${error.message}`);
        }
    };

    const handleDeleteUser = async (uid) => {
        try {
            const response = await fetch(`http://localhost:4000/deluser/${uid}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorMessage = await response.json();
                throw new Error(`Failed to delete user: ${errorMessage.message}`);
            }

            alert('User deleted successfully');
            fetchUsers(); // Optionally update state or perform other actions upon successful deletion
        } catch (error) {
            console.error('Error deleting user:', error);
            alert(`Error deleting user: ${error.message}`);
        }
    };

    const handleDeleteIssuedUser = async (uid) => {
        try {
            const response = await fetch(`http://localhost:4000/deleteissueduser/${uid}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorMessage = await response.json();
                throw new Error(`Failed to delete issued user: ${errorMessage.message}`);
            }

            alert('Issued user deleted successfully');
            fetchIssuedUsers(); // Optionally update state or perform other actions upon successful deletion
        } catch (error) {
            console.error('Error deleting issued user:', error);
            alert(`Error deleting issued user: ${error.message}`);
        }
    };

    const fetchIssuedUsers = async () => {
        try {
            const response = await fetch('http://localhost:4000/issuedusers', {
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to fetch issued users');
            }
            const data = await response.json();
            setIssuedUsers(data);
        } catch (error) {
            console.error('Error fetching issued users:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:4000/usersdetails', {
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleBookSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleUserSearch = (event) => {
        setSearchUser(event.target.value);
    };

    const handleIssuedUserSearch = (event) => {
        setSearchIssuedUser(event.target.value);
    };

    const handleHandover = async (id) => {
        const submittedDate = new Date().toISOString().split('T')[0];

        try {
            const response = await fetch(`http://localhost:4000/books/${id}/submit`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ submittedDate }),
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to submit book: ${errorData.message}`);
            }

            const data = await response.json();
            alert(`Book submitted successfully. Fine: ${data.fine}`);
            fetchIssuedUsers();
        } catch (error) {
            console.error('Error submitting book:', error);
        }
    };

    const filteredBooks = books.filter((book) =>
        book.title && book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredUsers = users.filter((user) =>
        user.username && user.username.toLowerCase().includes(searchUser.toLowerCase())
    );

    const filteredIssuedUsers = issuedUsers.filter((issuedUser) =>
        issuedUser.issuedUser && issuedUser.issuedUser.toLowerCase().includes(searchIssuedUser.toLowerCase())
    );

    return (
        <div className="admin-page">
            <div className="table-container">
                <div className="table-wrapper">
                    <h1>Books Details</h1>
                    {<Link to="/addBook"><button className="add">Add Book</button></Link>}

                    <input
                        type="text"
                        placeholder="Search by book title"
                        value={searchTerm}
                        onChange={handleBookSearch}
                    />
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Copies</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBooks.map((book) => (
                                <tr key={book._id}>
                                    <td>{book.title}</td>
                                    <td>{book.author}</td>
                                    <td>{book.copies}</td>
                                    <td>{book.status}</td>
                                    <td>
                                        <button className="del" onClick={() => handleDelete(book._id)}>Delete</button>
                                        <Link to={`/updateBook/${book._id}`}>
                                            <button className="add">Update</button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="table-wrapper">
                    <h1>User Details</h1>
                    <input
                        type="text"
                        placeholder="Search by username"
                        value={searchUser}
                        onChange={handleUserSearch}
                    />
                    <table>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Mobile Number</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user._id}>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.mobileNumber}</td>
                                    <td>
                                        <button className="del" onClick={() => handleDeleteUser(user._id)}>Delete</button>
                                        {<Link to="/updateUser"><button className="add">Update</button></Link>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="table-wrapper">
                    <h1>Issued User Details</h1>
                    <input
                        type="text"
                        placeholder="Search by username"
                        value={searchIssuedUser}
                        onChange={handleIssuedUserSearch}
                    />
                    <table>
                        <thead>
                            <tr>
                                <th>Issued User</th>
                                <th>Book Name</th>
                                <th>Issued Date</th>
                                <th>Submitted Date</th>
                                <th>Fine or Payment</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredIssuedUsers.map((issuedUser) => (
                                <tr key={issuedUser._id}>
                                    <td>{issuedUser.issuedUser}</td>
                                    <td>{issuedUser.bookName}</td>
                                    <td>{issuedUser.issuedDate}</td>
                                    <td>{issuedUser.submittedDate === null ? 'Not handed over' : 'Handed over'}</td>
                                    <td>{issuedUser.fineOrPayment}</td>
                                    <td>
                                        <button
                                            className="del"
                                            onClick={() => handleHandover(issuedUser._id)}
                                            disabled={issuedUser.submittedDate !== null}
                                        >
                                            {issuedUser.submittedDate === null ? 'Handover' : 'Handed over'}
                                        </button>
                                        <button className="up" onClick={() => handleDeleteIssuedUser(issuedUser._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default FunctionalComAdmin;
