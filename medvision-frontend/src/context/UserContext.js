import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';

// Create UserContext
export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [doctorName, setDoctorName] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [loading, setLoading] = useState(true); // To handle loading state

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            console.error('No token found');
            setLoading(false); // Set loading to false if there's no token
            return;
        }

        console.log(token,'token') 

        // Fetch user data
        axios.get('http://127.0.0.1:8000/api/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(response => {
            const user = response.data.user;
            setDoctorName(user.name);
            setProfilePicture(user.profile_picture);
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
            }
        })
        .finally(() => {
            setLoading(false); // Set loading to false regardless of success or error
        });
    }, []);

    return (
        <UserContext.Provider value={{ doctorName, profilePicture, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
