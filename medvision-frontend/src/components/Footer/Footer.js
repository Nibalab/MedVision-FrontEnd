import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaYoutube } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-contact">
          <h3>Contact Us</h3>
          <p><a href="mailto:MedVision@gmail.com">MedVision@gmail.com</a></p>
        </div>
        <div className="footer-social">
          <FaFacebook />
          <FaInstagram />
          <FaTwitter />
          <FaLinkedin />
          <FaYoutube />
        </div>
        <div className="footer-copyright">
          <p>&copy; 2024 MedVision. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
