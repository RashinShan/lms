import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './css/bookUpdate.css';
import bookImage from './css/book1.jfif'; // Import the image

function FunctionalComUpdateBook() {
    const { bookId } = useParams();

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
    
        try {
            const response = await fetch(`http://localhost:4000/booksupdate/${bookId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(book),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to update book: ${errorData.message}`);
            }
    
            const data = await response.json();
            console.log('Book updated:', data);
            setMessage('Book updated successfully!');
        } catch (error) {
            console.error('Error updating book:', error);
            setMessage(`Error: ${error.message}`);
        }
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
