import React, { useState, useEffect } from 'react'; // Import useEffect from React
import './css/bookPage.css'; // Ensure this path is correct
import searchIcon from './css/search.webp'; // Ensure this path is correct

function FunctionalComBook() {
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetch('http://localhost:4000/books', {
            credentials: 'include',
        })
            .then(response => response.json())
            .then(data => setBooks(data))
            .catch(error => console.error('Error fetching books:', error));
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleToggleSelectBook = async (book) => {
        if (book.confirmed) {
            alert('This book selection is confirmed and cannot be changed.');
            return;
        }

        const endpoint = book.status === 'available' ? 'select' : 'unselect';

        try {
            const response = await fetch(`http://localhost:4000/books/${book._id}/${endpoint}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorMessage = await response.json();
                alert(errorMessage.message);
                throw new Error(`Failed to toggle book selection: ${errorMessage.message}`);
            }

            const updatedBook = await response.json();

            setBooks((prevBooks) =>
                prevBooks.map((b) => {
                    if (b._id === updatedBook._id) {
                        return {
                            ...b,
                            status: endpoint === 'select' ? 'unavailable' : 'available',
                            copies: updatedBook.copies,
                        };
                    }
                    return b;
                })
            );
        } catch (error) {
            console.error(`Error trying to ${endpoint} book:`, error);
        }
    };

    const handleConfirmBook = async (book) => {
        alert("Do you need to conferm this book selection");
        try {
            const response = await fetch(`http://localhost:4000/books/${book._id}/confirm`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                
                alert("Book selection  saved");
                
            }

            if (!response.ok) {
                const errorMessage = await response.json();
                alert(errorMessage.message);
                throw new Error(`Failed to confirm book: ${errorMessage.message}`);
            }

            const confirmedBook = await response.json();

            setBooks((prevBooks) =>
                prevBooks.map((b) => {
                    if (b._id === confirmedBook._id) {
                        return {
                            ...b,
                            confirmed: true,
                        };
                    }
                    return b;
                })
            );
        } catch (error) {
            console.error('Error confirming book:', error);
        }
    };

    const filteredBooks = books.filter((book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="books">
            <h1>List of Books Available</h1>
            <div className="search-bar">
                <img src={searchIcon} alt="Search Icon" className="search-icon" />
                <input
                    type="text"
                    placeholder="Search by book title"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Number</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Copies</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredBooks.map((book, index) => (
                        <tr key={book._id}>
                            <td>{index + 1}</td>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.copies}</td>
                            <td>{book.status}</td>
                            <td>
                                <button
                                    onClick={() => handleToggleSelectBook(book)}
                                    disabled={book.confirmed}
                                >
                                    {book.status === 'available' ? 'Select' : 'Unselect'}
                                </button>
                                {!book.confirmed && (
                                    <button
                                        onClick={() => handleConfirmBook(book)}
                                    >
                                        Confirm
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default FunctionalComBook;
