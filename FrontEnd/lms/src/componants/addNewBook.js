import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/addNewBook.css';
import bookImage from './css/book1.jfif'; // Import the image

function FunctionalComAddBook() {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [copies, setCopies] = useState("");
    const [status, setStatus] = useState("");
    const navigate = useNavigate(); // Initialize useNavigate

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:4000/AddBooks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    author,
                    copies,
                    status,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Book added successfully');
                navigate('/bookpage'); 
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert('Error adding book');
        }
    };

    return (
        <div className="add-book-page">
            <h1>Add New Book</h1>

            <div className='img'>
                <img src={bookImage} alt="Book" className="img" />
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="author">Author</label>
                    <input
                        type="text"
                        id="author"
                        name="author"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="copies">Copies</label>
                    <input
                        type="number"
                        id="copies"
                        name="copies"
                        value={copies}
                        onChange={(e) => setCopies(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select
                        id="status"
                        name="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="">Select Status</option>
                        <option value="available">Available</option>
                        <option value="unavailable">Not Available</option>
                    </select>
                </div>
                <div className="form-buttons">
                    <button type="submit">Add Book</button>
                    <button type="button" onClick={() => {
                        setTitle("");
                        setAuthor("");
                        setCopies("");
                        setStatus("");
                    }}>Reset</button>
                </div>
            </form>
        </div>
    );
}

export default FunctionalComAddBook;
