import React, { useState, Suspense } from "react";
import ReactDOM from "react-dom";
import Contact from "./ContactPage/Contact";
import Email from "./Email";
import Login from "./Login";
import Loading from "./Loading";

import { Router, Switch, Route } from "react-router-dom";
//import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Footer from "./layout/Footer";
import "./Index.css";

import { createBrowserHistory } from "history";

function Index() {
    const history = createBrowserHistory();

    const [emailAdress, setEmailAdress] = useState(false);
    const [EmailComponent, setEmailComponent] = useState("");
    const emailAdr = localStorage.getItem("user-info");

    return (
        <Router history={history}>
            <div className="container">
                <Switch>
                    <Route exact path="/">
                        <Login />
                    </Route>

                    <Route exact path="/Email">
                        <Email />
                    </Route>

                    <Route exact path="/Kontakt">
                        <Contact />
                    </Route>
                </Switch>

                <Footer />
            </div>
        </Router>
    );
}

ReactDOM.render(
    <Suspense fallback={<Loading />}>
        <Index />
    </Suspense>,
    document.getElementById("app")
);
