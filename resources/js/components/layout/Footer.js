import React from "react";

import "../layoutCss/Footer.css";

function Footer() {
    return (
        <div className="Footer">
            Copyright &copy; {new Date().getFullYear()} Ewa
        </div>
    );
}

export default Footer;
