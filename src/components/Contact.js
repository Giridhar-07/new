import React, { useState } from "react";
import { useToast } from "../components/ToastManager";
import { motion } from "framer-motion";
import "./Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/contact/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        addToast(
          "Message sent successfully! We'll get back to you soon.",
          "success"
        );
        setFormData({
          name: "",
          email: "",
          message: "",
        });
      } else {
        addToast("Failed to send message. Please try again.", "error");
      }
    } catch (error) {
      addToast("Failed to send message. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="contact-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Contact Us
      </motion.h1>
      <motion.p
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Have questions about our hotel or need assistance with your booking? We're
        here to help!
      </motion.p>
      <motion.form 
        onSubmit={handleSubmit} 
        className={`contact-form ${isLoading ? 'loading' : ''}`}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <motion.div 
          className="form-group"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <motion.label 
            htmlFor="name"
            whileHover={{ x: 5 }}
          >
            Name:
          </motion.label>
          <motion.input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          />
        </motion.div>
        <motion.div 
          className="form-group"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <motion.label 
            htmlFor="email"
            whileHover={{ x: 5 }}
          >
            Email:
          </motion.label>
          <motion.input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          />
        </motion.div>
        <motion.div 
          className="form-group"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <motion.label 
            htmlFor="message"
            whileHover={{ x: 5 }}
          >
            Message:
          </motion.label>
          <motion.textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          />
        </motion.div>
        <motion.button
          type="submit"
          className={`submit-button ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
          whileHover={!isLoading ? { scale: 1.02 } : {}}
          whileTap={!isLoading ? { scale: 0.98 } : {}}
        >
          {isLoading ? "Sending..." : "Send Message"}
        </motion.button>
      </motion.form>
    </motion.div>
  );
}

export default Contact;
