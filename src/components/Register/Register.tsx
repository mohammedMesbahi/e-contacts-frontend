import React from 'react';
import './Register.css';
import axios from 'axios';
import proxy from '../../configs/config';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

const Register: React.FC = () => {
    const [login, setLogin] = useState<string>('user3@gmail.com');
    const [password, setPassword] = useState<string>('123456');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');
        setSuccessMessage('');
        try {
            const response = await axios.post(
                proxy.register,
                {login, password},
            );
            setSuccessMessage(response.data);
            navigate('/login?success=registered successfully');
        } catch (error: any) {
            setErrorMessage(error.response.data || error.message);
        }finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="parent_container">
            <div className="signup-container">
                <h2>Register</h2>
                {errorMessage && <div className="error">
                    {errorMessage}
                </div>}
                {successMessage && <div className="success">
                    {successMessage}
                </div>}
                <form>
                    <label htmlFor="login">Login:</label>
                    <input type="email" id="login" name="login"
                           required value={login} onChange={(e) => setLogin(e.target.value)}/>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" required
                           value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <input type="submit" value={isSubmitting ? "Registering.." : "Register"} disabled={isSubmitting}
                           className="submit-btn" onClick={handleRegister}/>
                </form>
                <p>Already have an account? <a href="/login">Sign In</a></p>
            </div>
        </div>
    );
};
export default Register;