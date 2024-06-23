import React, { useEffect, useState } from 'react';
import api from '../Services/axiosInstance';
import { Alert, Card, Spinner, Button, Form, Modal } from 'react-bootstrap';
import Navbar from '../Components/Navbar.jsx';
import Footer from '../Components/Footer.jsx';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [addressError, setAddressError] = useState('');
    const [userDetailsError, setUserDetailsError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [address, setAddress] = useState({
        country: '',
        city: '',
        street: '',
        number: '',
        zipCode: ''
    });
    const [userDetails, setUserDetails] = useState({
        email: '',
        name: '',
        surname: ''
    });
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const userResponse = await api.get('/api/user/GetUser', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserProfile(userResponse.data);
                setAddress(userResponse.data.address || {});
                setUserDetails({
                    email: userResponse.data.email,
                    name: userResponse.data.name,
                    surname: userResponse.data.surname
                });
            } catch (error) {
                setError(`Failed to fetch data: ${error.response?.data?.Message || error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleInputChange = (e, setter) => {
        const { name, value } = e.target;
        setter(prevState => ({ ...prevState, [name]: value }));
    };

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        setAddressError('');
        setSuccessMessage('');
        try {
            const token = localStorage.getItem('token');
            const updatedProfile = { ...userProfile, address };
            await api.put(`/api/user/${userProfile.uuid}`, updatedProfile, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserProfile(updatedProfile);
            setShowAddressForm(false);
            setSuccessMessage('Address updated successfully.');
        } catch (error) {
            setAddressError(`Failed to update address: ${error.response?.data?.Message || error.message}`);
        }
    };

    const handleUserDetailsSubmit = async (e) => {
        e.preventDefault();
        setUserDetailsError('');
        setSuccessMessage('');
        try {
            const token = localStorage.getItem('token');
            const updatedProfile = { ...userProfile, ...userDetails };
            await api.put(`/api/user/${userProfile.uuid}`, updatedProfile, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserProfile(updatedProfile);
            setShowUpdateForm(false);
            setSuccessMessage('User details updated successfully.');
        } catch (error) {
            setUserDetailsError(`Failed to update user details: ${error.response?.data?.Message || error.message}`);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setSuccessMessage('');
        if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>+-]).{8,}$/.test(passwords.newPassword)) {
            setPasswordError('Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character.');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            await api.post(`/api/user/change-password/${userProfile.uuid}`, passwords, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowPasswordForm(false);
            setSuccessMessage('Password changed successfully.');
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setPasswordError('Old password is not correct');
            } else {
                setPasswordError(`Failed to change password: ${error.response?.data?.Message || error.message}`);
            }
        }
    };

    const handleDeleteAccount = async () => {
        setDeleteError('');
        setSuccessMessage('');
        try {
            const token = localStorage.getItem('token');
            await api.delete(`/api/user/${userProfile.uuid}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            localStorage.removeItem('token'); // Clear token
            setShowDeleteModal(false);
            navigate('/login'); // Redirect to login page
        } catch (error) {
            setDeleteError(`Failed to delete account: ${error.response?.data?.Message || error.message}`);
        }
    };

    if (loading) {
        return (
            <div className="App d-flex flex-column min-vh-100">
                <Navbar />
                <div className="container flex-grow-1 d-flex justify-content-center align-items-center">
                    <Spinner animation="border" />
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="App d-flex flex-column min-vh-100">
                <Navbar />
                <div className="container flex-grow-1 d-flex justify-content-center align-items-center">
                    <Alert variant="danger">{error}</Alert>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="App d-flex flex-column min-vh-100">
            <Navbar />
            <div className="container flex-grow-1 d-flex flex-column">
                <h2>Profile</h2>
                {successMessage && <Alert variant="success">{successMessage}</Alert>}
                {userProfile && (
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>{userProfile.name} {userProfile.surname}'s Profile</Card.Title>
                            <Card.Text><strong>Email:</strong> {userProfile.email}</Card.Text>
                            <Card.Text><strong>Name:</strong> {userProfile.name}</Card.Text>
                            <Card.Text><strong>Surname:</strong> {userProfile.surname}</Card.Text>
                            <Card.Text><strong>Joined:</strong> {new Date(userProfile.createdAt).toLocaleDateString()}</Card.Text>
                            {userProfile.address && (
                                <Card.Text>
                                    <strong>Address:</strong> {userProfile.address.street} {userProfile.address.number}, {userProfile.address.city}, {userProfile.address.zipCode}, {userProfile.address.country}
                                    <Button variant="link" onClick={() => setShowAddressForm(true)}>Edit Address</Button>
                                </Card.Text>
                            )}
                            {!userProfile.address && (
                                <Button onClick={() => setShowAddressForm(true)}>Add Address</Button>
                            )}
                            <Button onClick={() => setShowUpdateForm(true)}>Edit Profile</Button>
                            <Button onClick={() => setShowPasswordForm(true)}>Change Password</Button>
                            <Button variant="danger" onClick={() => setShowDeleteModal(true)}>Delete Account</Button>
                        </Card.Body>
                    </Card>
                )}

                {showAddressForm && (
                    <Form onSubmit={handleAddressSubmit}>
                        <Form.Group controlId="formCountry">
                            <Form.Label>Country</Form.Label>
                            <Form.Control type="text" name="country" value={address.country} onChange={(e) => handleInputChange(e, setAddress)} />
                        </Form.Group>
                        <Form.Group controlId="formCity">
                            <Form.Label>City</Form.Label>
                            <Form.Control type="text" name="city" value={address.city} onChange={(e) => handleInputChange(e, setAddress)} />
                        </Form.Group>
                        <Form.Group controlId="formStreet">
                            <Form.Label>Street</Form.Label>
                            <Form.Control type="text" name="street" value={address.street} onChange={(e) => handleInputChange(e, setAddress)} />
                        </Form.Group>
                        <Form.Group controlId="formNumber">
                            <Form.Label>Number</Form.Label>
                            <Form.Control type="text" name="number" value={address.number} onChange={(e) => handleInputChange(e, setAddress)} />
                        </Form.Group>
                        <Form.Group controlId="formZipCode">
                            <Form.Label>Zip Code</Form.Label>
                            <Form.Control type="text" name="zipCode" value={address.zipCode} onChange={(e) => handleInputChange(e, setAddress)} />
                        </Form.Group>
                        {addressError && <Alert variant="danger">{addressError}</Alert>}
                        <Button variant="primary" type="submit">
                            Save Address
                        </Button>
                        <Button variant="secondary" onClick={() => setShowAddressForm(false)}>
                            Cancel
                        </Button>
                    </Form>
                )}

                {showUpdateForm && (
                    <Form onSubmit={handleUserDetailsSubmit}>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" name="email" value={userDetails.email} onChange={(e) => handleInputChange(e, setUserDetails)} />
                        </Form.Group>
                        <Form.Group controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" name="name" value={userDetails.name} onChange={(e) => handleInputChange(e, setUserDetails)} />
                        </Form.Group>
                        <Form.Group controlId="formSurname">
                            <Form.Label>Surname</Form.Label>
                            <Form.Control type="text" name="surname" value={userDetails.surname} onChange={(e) => handleInputChange(e, setUserDetails)} />
                        </Form.Group>
                        {userDetailsError && <Alert variant="danger">{userDetailsError}</Alert>}
                        <Button variant="primary" type="submit">
                            Save Changes
                        </Button>
                        <Button variant="secondary" onClick={() => setShowUpdateForm(false)}>
                            Cancel
                        </Button>
                    </Form>
                )}

                {showPasswordForm && (
                    <Form onSubmit={handlePasswordSubmit}>
                        <Form.Group controlId="formOldPassword">
                            <Form.Label>Old Password</Form.Label>
                            <Form.Control type="password" name="oldPassword" value={passwords.oldPassword} onChange={(e) => handleInputChange(e, setPasswords)} />
                        </Form.Group>
                        <Form.Group controlId="formNewPassword">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control type="password" name="newPassword" value={passwords.newPassword} onChange={(e) => handleInputChange(e, setPasswords)} />
                        </Form.Group>
                        <Form.Text className="text-muted">
                            Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character from !@#$%^&*(),.?":{}|&lt;&gt;+-.
                        </Form.Text>
                        {passwordError && <Alert variant="danger">{passwordError}</Alert>}
                        <Button variant="primary" type="submit">
                            Change Password
                        </Button>
                        <Button variant="secondary" onClick={() => setShowPasswordForm(false)}>
                            Cancel
                        </Button>
                    </Form>
                )}

                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Delete Account</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete your account? This action cannot be undone.
                        {deleteError && <Alert variant="danger">{deleteError}</Alert>}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleDeleteAccount}>
                            Delete Account
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
            <Footer />
        </div>
    );
};

export default ProfilePage;
