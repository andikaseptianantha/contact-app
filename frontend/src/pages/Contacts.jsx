import { useEffect, useState } from "react";
import { getContacts, deleteContact, logout } from "../services/api";
import { Link, useNavigate } from "react-router-dom";

function Contacts() {
    const navigate = useNavigate();

    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        loadContacts();
    }, []);

    const loadContacts = async () => {
        try {
            const data = await getContacts();
            setContacts(data.data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Apakah kamu yakin ingin menghapus kontak ini?"
        );

        if (!confirmDelete) return;

        try {
            await deleteContact(id);

            setContacts(
                contacts.filter((contact) => contact.id !== id)
            );
        } catch (error) {
            setError(error.message);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.log(error.message);
        }

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="contacts-container">

            <header className="navbar">
                <div>
                    <h1>Contact App</h1>
                    <p>Halo, {user?.name}</p>
                </div>

                <button onClick={handleLogout}>
                    Logout
                </button>
            </header>

            <div className="contacts-header">
                <h2>My Contacts</h2>

                <Link to="/contacts/create">
                    + Tambah Kontak
                </Link>
            </div>

            {error && <p className="error">{error}</p>}

            {contacts.length === 0 ? (
                <p>Belum ada kontak.</p>
            ) : (
                <div className="contact-list">
                    {contacts.map((contact) => (
                        <div
                            className="contact-card"
                            key={contact.id}
                        >
                            <h3>{contact.name}</h3>

                            {contact.email && (
                                <p>
                                    Email: {contact.email}
                                </p>
                            )}

                            {contact.address && (
                                <p>
                                    Alamat: {contact.address}
                                </p>
                            )}

                            <div>
                                <strong>Nomor Telepon:</strong>

                                {contact.phones.map((phone) => (
                                    <p key={phone.id}>
                                        {phone.phone}
                                    </p>
                                ))}
                            </div>

                            <div className="actions">
                                <Link
                                    to={`/contacts/edit/${contact.id}`}
                                >
                                    Edit
                                </Link>

                                <button
                                    onClick={() =>
                                        handleDelete(contact.id)
                                    }
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Contacts;