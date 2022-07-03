import React from "react";

import axios from "axios";
import "./Email.css";
import { AiOutlineBorder, AiOutlineCheckSquare } from "react-icons/ai";
import ShowMessage from "./ShowMessage.js";
import Login from "./Login.js";
import { createBrowserHistory } from "history";
import { Link } from "react-router-dom";

const history = createBrowserHistory();

class Email extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            datas: [],
            row: [],
            previousRow: [],
            nextRow: [],
            index: "",
            previousIndex: "",
            nextIndex: "",
            arrayFiles: [],
            arrayFileNames: [],
            emailComponent: false,
            markMessageArray: [],
        };
        this.deleteMessageAxios = this.deleteMessageAxios.bind(this);
    }

    importAll(r) {
        return r.keys().map(r);
    }
    componentDidMount() {
        if (localStorage.getItem("user-info")) {
            this.setState({ emailComponent: true });

            axios.get("/api/mail").then((response) => {
                this.setState({ datas: response.data });
            });
            this.setState({ arrayFiles: [] });
        } else {
            history.push("/");
            this.setState({ emailComponent: false });
        }
    }

    showArrayFilePath(row) {
        this.setState({ arrayFileNames: [] });
        if (row.fileNames) {
            let files = row.fileNames;
            let lastIndex = files.length;
            let firstIndex = files.indexOf('"');

            let pureFileNames = files.slice(firstIndex + 1, lastIndex);
            let arrayPureFileNames = pureFileNames.split(",");
            this.setState({ arrayFileNames: arrayPureFileNames });

            let filesName = [];

            let pathToFiles = "../../../storage/app/files/";
            for (let i = 0; i < arrayPureFileNames.length; i++) {
                filesName[i] = pathToFiles + arrayPureFileNames[i];
            }
            this.setState({ arrayFiles: filesName });
        }
    }

    showMessage(row, index) {
        let previousMesage = this.state.datas[index - 1];
        let nextMessage = this.state.datas[index + 1];

        let emailMessage = document.getElementById("showMessage");
        emailMessage.style.display = "flex";
        this.setState({ markMessageArray: [] });

        this.setState({ row: row });
        this.setState({ previousRow: previousMesage });
        this.setState({ nextRow: nextMessage });

        this.setState({ index: index });
        this.setState({ previousIndex: index - 1 });
        this.setState({ nextIndex: index + 1 });

        this.showArrayFilePath(row);
    }

    showNextPreviousMessage = (row, index) => {
        if (index >= 0 && index < this.state.datas.length) {
            this.showMessage(row, index);
        }
    };

    markBox(row) {
        const newArray = [row, ...this.state.markMessageArray];
        this.setState({ markMessageArray: newArray });
    }

    unmarkMessage(row) {
        const newArray = this.state.markMessageArray;

        const elementIndex = newArray.indexOf(row);

        newArray.splice(elementIndex, 1);

        this.setState({ markMessageArray: newArray });
    }

    deleteMessageAxios(e) {
        let data = new FormData();
        data.append("message", e);
        data.append("filesArray", this.state.arrayFileNames);
        data.append("_method", "POST");
        axios.post("/api/delete/" + e.id, data).then((response) => {
            const arrayDB = response.data;
            return this.setState({ datas: arrayDB });
        });

        let emailMessage = document.getElementById("showMessage");
        emailMessage.style.display = "none";
    }

    deleteMessage() {
        const arrayMessages = this.state.markMessageArray;
        for (let i = 0; i <= arrayMessages.length - 1; i++) {
            let arrayElement = this.state.markMessageArray[i];

            this.deleteMessageAxios(arrayElement);
        }
    }

    logout() {
        this.setState({ markMessageArray: [] });
        localStorage.clear();
        this.setState({ emailComponent: false });
        history.push("/");
    }

    render() {
        return (
            <article>
                {this.state.emailComponent ? (
                    <>
                        <button>
                            <Link to="/Kontakt">Nowa wiadomość</Link>
                        </button>
                        <div className="deleteLogout">
                            {!this.state.datas.length ? (
                                <div></div>
                            ) : (
                                <button
                                    title="Usuń zaznaczone"
                                    onClick={() => this.deleteMessage()}
                                >
                                    Usuń
                                </button>
                            )}

                            <button
                                className="buttonLogout"
                                onClick={() => this.logout()}
                            >
                                Wyloguj{" "}
                            </button>
                        </div>

                        <div className="email">
                            {!this.state.datas.length ? (
                                <div>Nie masz żadnych wiadomości.</div>
                            ) : (
                                this.state.datas.map((row, index) => {
                                    return (
                                        <div
                                            key={row.id}
                                            id={index}
                                            className="dataRow"
                                        >
                                            {this.state.markMessageArray.indexOf(
                                                row
                                            ) > -1 ? (
                                                <AiOutlineCheckSquare
                                                    className="checkedIcon"
                                                    onClick={(e) =>
                                                        this.unmarkMessage(row)
                                                    }
                                                />
                                            ) : (
                                                <AiOutlineBorder
                                                    onClick={(e) =>
                                                        this.markBox(row)
                                                    }
                                                    className="rowBox"
                                                />
                                            )}

                                            <div
                                                className="row"
                                                onClick={() =>
                                                    this.showMessage(row, index)
                                                }
                                            >
                                                <div className="rowNumber">
                                                    {index + 1}
                                                </div>
                                                <div className="rowEmail">
                                                    {row.email}
                                                </div>
                                                <div className="rowMessage">
                                                    {" "}
                                                    {row.message}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <ShowMessage
                                row={this.state.row}
                                previousRow={this.state.previousRow}
                                nextRow={this.state.nextRow}
                                index={this.state.index}
                                nextIndex={this.state.nextIndex}
                                previousIndex={this.state.previousIndex}
                                email={this.state.row.email}
                                message={this.state.row.message}
                                arrayFiles={this.state.arrayFiles}
                                arrayFileNames={this.state.arrayFileNames}
                                deleteMessage={this.deleteMessageAxios}
                                showNextPreviousMessage={
                                    this.showNextPreviousMessage
                                }
                            />
                        </div>
                    </>
                ) : (
                    <Login />
                )}
            </article>
        );
    }
}

export default Email;
