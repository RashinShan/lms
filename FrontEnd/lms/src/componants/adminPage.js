import React, { useState } from 'react';
import './css/adminPage.css';

function FunctionalComAdmin() {
    // Initial book details
    const booksData = [
        { title: 'Harry Potter', author: 'J.K. Rowling', copies: 8, status: 'Available' },
    ];

    const [books] = useState(booksData);
    const [searchTerm, setSearchTerm] = useState('');

    // Initial user details
    const userData = [
        { userid: 'AB123', bookname: 'Harry Potter', issuedate: '6/6/2024', submitdate: '16/6/2024', payment: 40 },
    ];

    const [users] = useState(userData);
    const [searchUser, setSearchUser] = useState('');

    const filteredBooks = books.filter((book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredUsers = users.filter((user) =>
        user.userid.toLowerCase().includes(searchUser.toLowerCase())
    );

    return (
        <div className="admin-page">
            <div className="table-container">
                <div className="table-wrapper">
                    {/* Book Data Table */}
                    <h1>Books Details</h1>
                    <button2 className="add">Add Book</button2>
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
                                <tr key={book.title}>
                                    <td>{book.title}</td>
                                    <td>{book.author}</td>
                                    <td>{book.copies}</td>
                                    <td>{book.status}</td>
                                    <td>
                                        <button2 className="del">Delete</button2>
                                        <button2 className="up">Update</button2>
                                       
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                  
                </div>
                <div className="table-wrapper">
                    {/* User Data Table */}
                    <h1>User Details</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>UserId</th>
                                <th>Book Name</th>
                                <th>Issue Date</th>
                                <th>Submit Date</th>
                                <th>Payment</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.userid}>
                                    <td>{user.userid}</td>
                                    <td>{user.bookname}</td>
                                    <td>{user.issuedate}</td>
                                    <td>{user.submitdate}</td>
                                    <td>{user.payment}</td>
                                    <td>
                                        <button2 className="del">Delete</button2>
                                        <button2 className="up">Update</button2>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="form-wrapper">

                    </div>  
                    <div className="form-wrapper">
                        
                        </div> 
                </div>
            </div>
        </div>
    );
}

export default FunctionalComAdmin;