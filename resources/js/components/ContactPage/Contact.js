import React, { useState, useEffect } from "react";
import ContactForm from "./contactForm";
import "./Contact.css";
import { Link } from "react-router-dom";

export default function Contact() {
    return (
        <article>
            <button>
                <Link to="/Email">Poczta</Link>
            </button>
            <ContactForm />
        </article>
    );
}
