import React, {useEffect, useState} from 'react';
import NavBar from "../NavBar/NavBar";
import './Home.css';
import {useNavigate} from "react-router-dom";
import Note from "../../Models/Note";
import Contact from "../../Models/Contact";
import Alert from "@mui/material/Alert";
import {Collapse} from "@mui/material";
import axios from "axios";
import proxy from "../../configs/config";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import User from "../../Models/User";

const Home: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetch('/logout', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
            });
            navigate('/login?success=You have been logged out');
        } catch (error: any) {
            console.error(error);
        }
    }
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [newContact, setNewContact] = useState<Contact>({
        name: 'hassan',
        email: 'hassan@gmail.com',
        address: 'IMB 132 APPT 13 RCE MLY DRISS TGHAT FES',
        phone: '+212688988483'
    });
    const [message, setMessage] = React.useState<string>('');
    const [severity, setSeverity] = React.useState<"success" | "info" | "error">('success');
    const [open, setOpen] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');
        try {
            const response = await axios.post(
                proxy.addContact,
                newContact
            );
            setMessage("Contact added successfully");
            setSeverity('success');
            setOpen(true);
            setContacts(
                contacts.concat(newContact)
            )
        } catch (error: any) {
            setMessage(error.response.data || error.message);
            setSeverity('error');
            setOpen(true);
        } finally {
            setIsSubmitting(false);
        }
    }
    useEffect(() => {
        // generate 5 dummy contacts
        const contacts: Contact[] = [];
        for (let i = 0; i < 5; i++) {
            contacts.push({
                name: `Contact ${i}`,
                email: `contact${i}`,
                address: `address ${i}`,
                phone: `+${i}123456789`
            });
        }
        setContacts(contacts);
    }, [])
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };
    return (
        <div className="home-container">
            <NavBar/>
            {/*form to add a contact */}
            <div style={{
                display: 'flex',
                gap: "1rem",
                marginTop: '1rem',
                justifyContent: 'space-around',
                flexWrap: 'wrap'
            }}>
                <div>
                    <Collapse in={open}>
                        <Alert
                            onClose={handleClose}
                            severity={severity}
                            variant="filled"
                        >
                            {message}
                        </Alert>
                    </Collapse>
                    <form onSubmit={handleSubmit}>
                        <h2>Add a Contact</h2>
                        <label htmlFor="name">Name:</label>
                        <input type="text" id="name" name="name" required
                               value={newContact.name} onChange={(e) => setNewContact(
                            {...newContact, name: e.target.value})}/>
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" required
                               value={newContact.email} onChange={(e) => setNewContact({
                                ...newContact, email: e.target.value
                            }
                        )}
                        />
                        <label htmlFor="address">Address:</label>
                        <input type="text" id="address" name="address" required
                               value={newContact.address} onChange={(e) => setNewContact(
                            {...newContact, address: e.target.value}
                        )}/>
                        <label htmlFor="phone">Phone:</label>
                        <input type="tel" id="phone" name="phone" required
                               value={newContact.phone} onChange={(e) => setNewContact({
                            ...newContact, phone: e.target.value
                        })}/>
                        <input type="submit" onClick={handleSubmit} value="Add Contact" className="submit-btn"/>
                    </form>
                </div>

                <div >
                    <table className={'contacts'}>
                        <thead>
                        <tr>
                            <th colSpan={6}>
                                <input type={'search'} placeholder={'Search...'} />
                            </th>
                        </tr>
                        <tr>
                            <th>name</th>
                            <th>email</th>
                            <th>phone</th>
                            <th>address</th>
                            <th>edit</th>
                            <th>delete</th>

                        </tr>
                        </thead>
                        <tbody>
                        {contacts.map((contact: Contact, index) => {
                            return (
                                <tr key={index}>
                                    <td>{contact.name}</td>
                                    <td>{contact.email}</td>
                                    <td>{contact.phone}</td>
                                    <td>{contact.address}</td>
                                    <td>
                                        <IconButton aria-label="edit" color={"info"} >
                                            <EditIcon />
                                        </IconButton>
                                    </td>
                                    <td>
                                        <IconButton aria-label="delete" color={"error"} >
                                            <DeleteIcon />
                                        </IconButton>
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
export default Home;