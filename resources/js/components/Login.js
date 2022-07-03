import React, { useState, useEffect } from "react";
import Email from "./Email";
import { createBrowserHistory } from "history";
import "./Login.css";

import axios from "axios";
<link rel="shortcut icon" href="favicon.ico"></link>;

function Login() {
    const history = createBrowserHistory();

    const [message, setMessage] = useState(false);
    const [loginComponent, setLoginComponent] = useState(true);
    const [emailComponent, setEmailComponent] = useState(false);
    const [error, setError] = useState("");

    let token = document
        .querySelector('meta[name="csrf-token"]')
        .getAttribute("content");

    useEffect(() => {
        if (localStorage.getItem("user-info")) {
            history.push("/Email");
        }
    }, []);

    function loginUser(e) {
        e.preventDefault();
        let email = e.target[1].value;
        let password = e.target[2].value;
        const formData = new FormData();
        formData.append("name", "Anzal");
        formData.append("email", email);
        formData.append("password", password);

        axios({
            url: "/api/login",
            method: "POST",
            data: formData,
            dataType: "json",

            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        }).then((res) => {
            if (res.data.name) {
                localStorage.setItem(
                    "user-info",
                    JSON.stringify(res.data.name)
                );
                history.push("/Email");
                setLoginComponent(false);
                setEmailComponent(true);
            } else {
                setError("Zły email lub hasło.");
            }
        });
    }

    return (
        <article>
            {loginComponent ? (
                <div className="loginComponent">
                    <h1>Witaj w minipoczcie!</h1>
                    <h2>Zaloguj się:</h2>

                    <div className="loginForm">
                        <form onSubmit={(e) => loginUser(e)}>
                            <input
                                type="hidden"
                                name="_token"
                                value={token}
                            ></input>

                            <div className="formRow">
                                <label className="col-md-4 col-form-label text-md-right">
                                    Email:
                                </label>

                                <div className="email">
                                    <input
                                        id="emailLogin"
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        required
                                        autoComplete="email"
                                        onFocus={(e) => {
                                            setError("");
                                        }}
                                    />

                                    <span
                                        className={
                                            message ? "invalid-feedback" : ""
                                        }
                                        role="alert"
                                    >
                                        <strong>{message}</strong>
                                    </span>
                                </div>
                            </div>

                            <div className="formRow">
                                <label className="col-md-4 col-form-label text-md-right">
                                    Hasło:
                                </label>

                                <div className="password">
                                    <input
                                        id="password"
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        required
                                        autoComplete="current-password"
                                        onFocus={(e) => {
                                            setError("");
                                        }}
                                    />

                                    <span
                                        className="invalid-feedback"
                                        role="alert"
                                    >
                                        <strong>{message}</strong>
                                    </span>
                                </div>
                            </div>

                            <div className="form-group row mb-0">
                                <div className="logButtonDiv">
                                    <button type="submit" className="loginBtn">
                                        Zaloguj
                                    </button>
                                </div>
                            </div>
                            <div className="loginError">
                                <strong>{error}</strong>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                <Email />
            )}
        </article>
    );
}

export default Login;
