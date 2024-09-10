import React from 'react';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-contact">
          <h3>Contact Us</h3>
          <p>Email: MedVision@gmail.com</p>
        </div>
        <div className="footer-social">
          <FaFacebook size={24} />
          <FaInstagram size={24} />
        </div>
        <div className="footer-copyright">
          <p>&copy; 2024 MedVision. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
