import React, { useState } from 'react';
import LoginModal from './LoginModal';

function Login() {
    const [isModalOpen, setModalOpen] = useState(true);
    console.log("[Login] Initial modal open state:", isModalOpen);

    const closeModal = () => {
        console.log("[Login] Closing modal");
        setModalOpen(false);
    };

    return (
        <div>
            <LoginModal isOpen={isModalOpen} onClose={closeModal} />
        </div>
    );
}

export default Login;
