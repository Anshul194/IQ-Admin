import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SuccessModal = ({ isOpen, message, onClose }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="modal-overlay">
                <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="modal-container"
                >
                    <div className="modal-content">
                        <div className="success-icon">
                            <motion.svg 
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.5 }}
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                strokeWidth={2} 
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </motion.svg>
                        </div>
                        <h2>Success!</h2>
                        <p>{message || "Operation completed successfully."}</p>
                        <button onClick={onClose} className="modal-button">
                            Continue
                        </button>
                    </div>
                </motion.div>
                
                <style jsx>{`
                    .modal-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.4);
                        backdrop-filter: blur(8px);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: 1000;
                    }
                    .modal-container {
                        background: rgba(255, 255, 255, 0.9);
                        padding: 2.5rem;
                        border-radius: 20px;
                        box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                        max-width: 400px;
                        width: 90%;
                        text-align: center;
                    }
                    .success-icon {
                        width: 80px;
                        height: 80px;
                        margin: 0 auto 1.5rem;
                        color: #10b981;
                        background: #ecfdf5;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 1rem;
                    }
                    h2 {
                        color: #111827;
                        margin-bottom: 0.5rem;
                        font-family: 'Inter', sans-serif;
                    }
                    p {
                        color: #6b7280;
                        margin-bottom: 2rem;
                    }
                    .modal-button {
                        background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
                        color: white;
                        border: none;
                        padding: 0.8rem 2rem;
                        border-radius: 12px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: transform 0.2s ease;
                        width: 100%;
                    }
                    .modal-button:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
                    }
                `}</style>
            </div>
        </AnimatePresence>
    );
};

export default SuccessModal;
