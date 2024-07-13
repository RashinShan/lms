import React, { useState } from 'react';
import './css/bookUpdate.css';
import bookImage from './css/book1.jfif'; // Import the image

function FunctionalComUpdateBook() {
    const [book, setBook] = useState({
        title: '',
        author: '',
        copies: '',
        status: '',
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBook({ ...book, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add logic to handle book update, e.g., sending data to a server
        console.log('Book updated:', book);
        setMessage('Book updated successfully!');
        // Optionally reset form after update
        // setBook({ title: '', author: '', copies: '', status: '' });
    };

    const handleReset = () => {
        setBook({ title: '', author: '', copies: '', status: '' });
        setMessage('');
    };

    return (
        <div className="update-book-page">
            <h1>Update Book</h1>
            <img src={bookImage} alt="Book" className="book-image" />
            {message && <p className="success-message">{message}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={book.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="author">Author</label>
                    <input
                        type="text"
                        id="author"
                        name="author"
                        value={book.author}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="copies">Copies</label>
                    <input
                        type="number"
                        id="copies"
                        name="copies"
                        value={book.copies}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select
                        id="status"
                        name="status"
                        value={book.status}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Status</option>
                        <option value="Available">Available</option>
                        <option value="Not Available">Not Available</option>
                    </select>
                </div>
                <div className="form-buttons">
                    <button type="submit">Update Book</button>
                    <button type="button" onClick={handleReset}>Reset</button>
                </div>
            </form>
        </div>
    );
}

export default FunctionalComUpdateBook;