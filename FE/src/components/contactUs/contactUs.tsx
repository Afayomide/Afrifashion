"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import "./contactUs.css";

import { Send, User, Mail, MessageSquare, FileText } from "lucide-react";

export default function ContactUs() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [focused, setFocused] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;

  function sendEmail(e) {
    e.preventDefault();
    setSubmitting(true);

    const emailPromise = axios.post(`${apiUrl}/api/contactUs`, {
      subject,
      fullName,
      email,
      message,
    });

    toast.promise(emailPromise, {
      loading: "Sending message...",
      success: "Message sent successfully!",
      error: "Error sending email. Please try again.",
    });

    emailPromise
      .then(() => {
        setEmail("");
        setMessage("");
        setFullName("");
        setSubject("");
      })
      .finally(() => {
        setSubmitting(false);
      });
  }

  const handleFocus = (field) => {
    setFocused(field);
  };

  const handleBlur = () => {
    setFocused(null);
  };

  return (
    <div className="contact-container">
      <div className="contact-card">
        <div className="contact-header">
          <h2>Get in Touch</h2>
          <p>Please contact us with any questions or special orders</p>
        </div>

        <form className="contact-form" onSubmit={sendEmail}>
          <div
            className={`form-group ${focused === "subject" ? "focused" : ""} ${
              subject ? "has-value" : ""
            }`}
          >
            <div className="input-icon">
              <FileText size={18} />
            </div>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              onFocus={() => handleFocus("subject")}
              onBlur={handleBlur}
              required
            />
            <label htmlFor="subject">Subject</label>
          </div>

          <div
            className={`form-group ${focused === "fullName" ? "focused" : ""} ${
              fullName ? "has-value" : ""
            }`}
          >
            <div className="input-icon">
              <User size={18} />
            </div>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              onFocus={() => handleFocus("fullName")}
              onBlur={handleBlur}
              required
            />
            <label htmlFor="fullName">Full Name</label>
          </div>

          <div
            className={`form-group ${focused === "email" ? "focused" : ""} ${
              email ? "has-value" : ""
            }`}
          >
            <div className="input-icon">
              <Mail size={18} />
            </div>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => handleFocus("email")}
              onBlur={handleBlur}
              required
            />
            <label htmlFor="email">Email Address</label>
          </div>

          <div
            className={`form-group ${focused === "message" ? "focused" : ""} ${
              message ? "has-value" : ""
            }`}
          >
            <div className="input-icon textarea-icon">
              <MessageSquare size={18} />
            </div>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onFocus={() => handleFocus("message")}
              onBlur={handleBlur}
              required
            ></textarea>
            <label htmlFor="message">Your Message</label>
          </div>

          <button
            type="submit"
            className={`submit-button ${submitting ? "submitting" : ""}`}
            disabled={submitting}
          >
            <span className="button-text">Send Message</span>
            <Send size={18} className="send-icon" />
          </button>
        </form>
      </div>
    </div>
  );
}
