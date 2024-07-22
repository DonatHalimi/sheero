import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Box, Container, IconButton, InputAdornment, Typography } from '@mui/material';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField } from '../components/Dashboard/CustomComponents';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!usernameOrEmail || !password) {
            toast.error('Please fill in all fields', {
                closeOnClick: true
            });
            return;
        }
        const response = await login(usernameOrEmail, password);
        if (response.success) {
            navigate('/');
        } else {
            toast.error(response.message, {
                closeOnClick: true
            });
        }
    };

    return (
        <>
            <Navbar />
            <Container component="main" maxWidth="xs">
                <Box className="mt-32 flex flex-col items-center bg-white p-8 rounded shadow-md">
                    <Typography component="h1" variant="h5" className="mb-4">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate className="w-full">
                        <BrownOutlinedTextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="usernameOrEmail"
                            label="Username or Email"
                            name="usernameOrEmail"
                            autoComplete="usernameOrEmail"
                            autoFocus
                            value={usernameOrEmail}
                            onChange={(e) => setUsernameOrEmail(e.target.value)}
                        />
                        <BrownOutlinedTextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            id="password"
                            autoComplete="current-password"
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
                                )
                            }}
                        />
                        <BrownButton
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className="mb-2 !mt-4"
                        >
                            Sign In
                        </BrownButton>
                    </Box>
                </Box>
            </Container>
        </>
    );
};

export default Login;
