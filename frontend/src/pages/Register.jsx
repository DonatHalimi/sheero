import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Box, Container, IconButton, InputAdornment, Typography } from '@mui/material';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField } from '../components/Dashboard/CustomComponents';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !email || !password) {
            toast.error('Please fill in all fields');
            return;
        }

        if (!validateEmail(email)) {
            toast.error('Email format is not correct');
            return;
        }

        if (!validatePassword(password)) {
            toast.error('Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character');
            return;
        }

        const response = await register(username, email, password);
        if (response.success) {
            toast.success('User registered successfully');
            navigate('/login');
        } else {
            if (response.message === 'User or Email already exists') {
                toast.error('Username or Email already exists');
            } else {
                toast.error(response.message || 'Registration failed');
            }
        }
    };

    return (
        <>
            <Navbar />
            <Container component="main" maxWidth="xs">
                <Box className="mt-32 flex flex-col items-center bg-white p-8 rounded shadow-md">
                    <Typography component="h1" variant="h5" className="mb-4">
                        Register
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate className="w-full">
                        <BrownOutlinedTextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            value={username}
                            name="username"
                            autoComplete="username"
                            autoFocus
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <BrownOutlinedTextField
                            margin='normal'
                            required
                            fullWidth
                            id='email'
                            label="Email"
                            value={email}
                            name='email'
                            autoComplete='email'
                            onChange={(e) => setEmail(e.target.value)}
                            type='email'
                        />
                        <BrownOutlinedTextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            id="password"
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                        >
                                            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <BrownButton
                            type="submit"
                            fullWidth
                            variant="contained"
                            className="mb-2 !mt-4"
                        >
                            Register
                        </BrownButton>
                    </Box>
                </Box>
            </Container>
        </>
    );
};

export default Register;