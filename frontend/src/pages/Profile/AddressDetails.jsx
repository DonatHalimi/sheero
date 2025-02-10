import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { BrownButton, Header, LoadingDetails, LoadingLabel, ProfileLayout } from '../../assets/CustomComponents';
import { downloadAddress } from '../../assets/DataExport';
import { profileBoxSx } from '../../assets/sx';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Utils/Footer';
import { addAddress, getAddressByUser, getCities, getCountries, updateAddress } from '../../store/actions/addressActions';

const AddressDetails = () => {
    const { user } = useSelector((state) => state.auth);
    const { address, countries, cities, loadingUserAddress } = useSelector((state) => state.address);
    const dispatch = useDispatch();

    const [initialData, setInitialData] = useState({
        name: '',
        street: '',
        phoneNumber: '',
        city: '',
        country: '',
        comment: '',
    });
    const [originalAddress, setOriginalAddress] = useState(null);

    const [existingAddress, setExistingAddress] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [nameValid, setNameValid] = useState(true);
    const [streetValid, setStreetValid] = useState(true);
    const [phoneNumberValid, setPhoneNumberValid] = useState(true);
    const [commentValid, setCommentValid] = useState(true);
    const [focusedField, setFocusedField] = useState(null);

    useEffect(() => {
        if (user && user.id) {
            dispatch(getAddressByUser(user.id));
        }
        dispatch(getCountries());
    }, [dispatch, user]);

    useEffect(() => {
        if (initialData.country) {
            dispatch(getCities(initialData.country));
        }
    }, [dispatch, initialData.country]);

    useEffect(() => {
        if (address) {
            setExistingAddress(true);
            const newInitialData = {
                name: address.name || '',
                street: address.street || '',
                phoneNumber: address.phoneNumber || '',
                city: address.city?._id || '',
                country: address.country?._id || '',
                comment: address.comment || '',
            };
            setInitialData(newInitialData);
            setOriginalAddress(newInitialData);
        } else {
            setExistingAddress(false);
            setOriginalAddress(null);
        }
    }, [address]);

    const handleCountryChange = (e) => {
        const selectedCountryId = e.target.value;
        setInitialData((prevData) => ({
            ...prevData,
            country: selectedCountryId,
            city: '',
        }));
    };

    const handleCityChange = (e) => {
        const selectedCityId = e.target.value;
        setInitialData((prevData) => ({
            ...prevData,
            city: selectedCityId,
        }));
    };

    const handleSaveAddress = async (e) => {
        setIsSubmitted(true);

        e.preventDefault();

        if (!initialData.name || !initialData.street || !initialData.phoneNumber || !initialData.city || !initialData.country) {
            toast.error('Please fill in all the fields correctly');
            return;
        }

        const updatedAddress = { ...initialData };

        try {
            if (address) {
                await dispatch(updateAddress(address._id, updatedAddress));
                toast.success('Address updated successfully');
                setOriginalAddress(updatedAddress);
                await dispatch(getAddressByUser(user.id));
            } else {
                await dispatch(addAddress(updatedAddress));
                toast.success('Address added successfully');
                await dispatch(getAddressByUser(user.id));
            }
        } catch (error) {
            toast.error('Error saving address');
        } finally {
            setIsSubmitted(false);
        }
    };

    const validateName = (name) => /^[A-ZÇ][a-zA-ZëËçÇ]{1,9}$/.test(name);
    const validateStreet = (street) => /^[A-Z][a-zA-Z0-9\s\-\.]{1,26}$/.test(street);
    const validatePhoneNumber = (phoneNumber) => /^0(43|44|45|46|47|48|49)\d{6}$/.test(phoneNumber);
    const validateComment = (comment) => /^[a-zA-Z0-9\s]{2,25}$/.test(comment);

    const handleNameChange = (e) => {
        const value = e.target.value;
        setInitialData((prevData) => ({
            ...prevData,
            name: value,
        }));
        setNameValid(validateName(value));
    };

    const handleStreetChange = (e) => {
        const value = e.target.value;
        setInitialData((prevData) => ({
            ...prevData,
            street: value,
        }));
        setStreetValid(validateStreet(value));
    };

    const handlePhoneNumberChange = (e) => {
        const value = e.target.value;
        setInitialData((prevData) => ({
            ...prevData,
            phoneNumber: value,
        }));
        setPhoneNumberValid(validatePhoneNumber(value));
    };

    const handleCommentChange = (e) => {
        const value = e.target.value;
        setInitialData((prevData) => ({
            ...prevData,
            comment: value,
        }));
        setCommentValid(value === '' || validateComment(value));
    };

    const isFormValid = nameValid && streetValid && phoneNumberValid && commentValid && initialData.city && initialData.country;
    const isFormUnchanged = originalAddress && Object.keys(initialData).every(
        key => initialData[key] === originalAddress[key]
    );

    const handleDownloadAddress = () => {
        if (address) {
            downloadAddress(address);
        }
    };

    return (
        <>
            <Navbar />
            <ProfileLayout>
                <Header
                    title="Address Details"
                    hasAddress={existingAddress}
                    onDownloadAddress={handleDownloadAddress}
                />

                <Box
                    sx={{
                        p: { xs: 3, md: 3 }
                    }}
                    className='bg-white rounded-md shadow-sm mb-3'
                >
                    {loadingUserAddress ? (
                        <LoadingDetails showAdditionalField={true} />
                    ) : (
                        <form onSubmit={handleSaveAddress} className="space-y-4">
                            <Box sx={profileBoxSx}>
                                <div className="relative w-full">
                                    <TextField
                                        fullWidth
                                        label="Name"
                                        variant="outlined"
                                        required
                                        name="name"
                                        value={initialData.name}
                                        onChange={handleNameChange}
                                        onFocus={() => setFocusedField('name')}
                                        onBlur={() => setFocusedField(null)}
                                        error={!nameValid}
                                        InputLabelProps={{ className: 'text-gray-700' }}
                                        InputProps={{ className: 'text-gray-700' }}
                                    />
                                    {focusedField === 'name' && !nameValid && (
                                        <div className="absolute left-0 bottom-[-78px] bg-white text-red-500 text-sm p-2 rounded-lg shadow-md w-full z-10">
                                            <span className="block text-xs font-semibold mb-1">Invalid Name</span>
                                            Must start with a capital letter and be 2 to 10 characters long.
                                            <div className="absolute top-[-5px] left-[20px] w-0 h-0 border-l-[5px] border-r-[5px] border-b-[5px] border-transparent border-b-white"></div>
                                        </div>
                                    )}
                                </div>
                                <div className="relative w-full">
                                    <TextField
                                        fullWidth
                                        label="Street"
                                        variant="outlined"
                                        required
                                        name="street"
                                        value={initialData.street}
                                        onChange={handleStreetChange}
                                        onFocus={() => setFocusedField('street')}
                                        onBlur={() => setFocusedField(null)}
                                        error={!streetValid}
                                        InputLabelProps={{ className: 'text-gray-700' }}
                                        InputProps={{ className: 'text-gray-700' }}
                                    />
                                    {focusedField === 'street' && !streetValid && (
                                        <div className="absolute left-0 bottom-[-78px] bg-white text-red-500 text-sm p-2 rounded-lg shadow-md w-full z-10">
                                            <span className="block text-xs font-semibold mb-1">Invalid Street</span>
                                            Must start with a capital letter and be 2 to 27 characters long.
                                            <div className="absolute top-[-5px] left-[20px] w-0 h-0 border-l-[5px] border-r-[5px] border-b-[5px] border-transparent border-b-white"></div>
                                        </div>
                                    )}
                                </div>

                                <div className="relative w-full">
                                    <TextField
                                        fullWidth
                                        label="Phone Number"
                                        variant="outlined"
                                        required
                                        name="phoneNumber"
                                        value={initialData.phoneNumber}
                                        onChange={handlePhoneNumberChange}
                                        onFocus={() => setFocusedField('phoneNumber')}
                                        onBlur={() => setFocusedField(null)}
                                        error={!phoneNumberValid}
                                        InputLabelProps={{ className: 'text-gray-700' }}
                                        InputProps={{ className: 'text-gray-700' }}
                                    />
                                    {focusedField === 'phoneNumber' && !phoneNumberValid && (
                                        <div className="absolute left-0 top-[58px] bg-white text-red-500 text-sm p-2 rounded-lg shadow-md w-full z-10">
                                            <span className="block text-xs font-semibold mb-1">Invalid Phone Number</span>
                                            Must be in the format: 043/44/45/46/47/48/49 followed by 6 digits.
                                            <div className="absolute top-[-5px] left-[20px] w-0 h-0 border-l-[5px] border-r-[5px] border-b-[5px] border-transparent border-b-white"></div>
                                        </div>
                                    )}
                                </div>
                            </Box>

                            <Box sx={profileBoxSx}>
                                <FormControl fullWidth variant="outlined" required>
                                    <InputLabel>Country</InputLabel>
                                    <Select
                                        name="country"
                                        value={initialData.country}
                                        onChange={handleCountryChange}
                                        label="Country"
                                        MenuProps={{
                                            disableScrollLock: true,
                                        }}
                                    >
                                        {countries.map((country) => (
                                            <MenuItem key={country._id} value={country._id}>
                                                {country.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth variant="outlined" required>
                                    <InputLabel>City</InputLabel>
                                    <Select
                                        name="city"
                                        value={initialData.city}
                                        onChange={handleCityChange}
                                        label="City"
                                        disabled={!initialData.country}
                                        MenuProps={{
                                            disableScrollLock: true,
                                        }}
                                    >
                                        {cities.map((city) => (
                                            <MenuItem key={city._id} value={city._id}>
                                                {city.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>

                            <div className="relative w-full">
                                <TextField
                                    fullWidth
                                    label="Comment"
                                    variant="outlined"
                                    name="comment"
                                    value={initialData.comment}
                                    onChange={handleCommentChange}
                                    onFocus={() => setFocusedField('comment')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Add any additional comments (optional)"
                                />
                                {focusedField === 'comment' && !commentValid && (
                                    <div className="absolute left-0 bottom-[-58px] bg-white text-red-500 text-sm p-2 rounded-lg shadow-md w-full z-10">
                                        <span className="block text-xs font-semibold mb-1">Invalid Comment</span>
                                        Must be 2 to 25 characters long.
                                        <div className="absolute top-[-5px] left-[20px] w-0 h-0 border-l-[5px] border-r-[5px] border-b-[5px] border-transparent border-b-white"></div>
                                    </div>
                                )}
                            </div>

                            <BrownButton
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isFormUnchanged || !isFormValid || isSubmitted}
                                className="w-1/6"
                            >
                                <LoadingLabel
                                    loading={isSubmitted}
                                    defaultLabel={existingAddress ? 'Update' : 'Add'}
                                    loadingLabel={existingAddress ? 'Updating' : 'Adding'}
                                />
                            </BrownButton>
                        </form>
                    )}
                </Box>
            </ProfileLayout >
            <Footer />
        </>
    );
};

export default AddressDetails;