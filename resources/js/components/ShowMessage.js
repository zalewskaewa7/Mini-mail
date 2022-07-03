import React from "react";
import axios from "axios";

import "./ShowMessage.css";
import { AiFillFile } from "react-icons/ai";

const ShowMessage = (props) => {
    let previousIndex = props.previousIndex;
    let nextIndex = props.nextIndex;
    let previousRow = props.previousRow;
    let nextRow = props.nextRow;

    function closeDialog() {
        let emailMessage = document.getElementById("showMessage");
        emailMessage.style.display = "none";
    }
    function previousMessage() {
        closeDialog();
        props.showNextPreviousMessage(previousRow, previousIndex);
    }

    function nextMessage() {
        closeDialog();
        props.showNextPreviousMessage(nextRow, nextIndex);
    }

    function downloadFile(path, index) {
        const filename = props.arrayFileNames[index];

        axios({
            url: "/api/download/" + filename,
            method: "GET",
            responseType: "blob", // important
        })
            .then((response) => {
                const url = window.URL.createObjectURL(
                    new Blob([response.data])
                );
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", filename); //or any other extension
                document.body.appendChild(link);
                link.download = filename;
                link.click();
            })
            .catch((error) => console.log(error));
    }
    return (
        <div id="showMessage" className="showMessage">
            <div className="closeDialog">
                <button onClick={closeDialog} className="btnClose">
                    &times;
                </button>
            </div>
            <div className="info">
                <div className="messageFrom">
                    <b>Wiadomość od:</b> {props.email}
                </div>
                <div className="btnPreviousNextMessage">
                    <button
                        id="btnPreviousMessage"
                        className="btnPreviousMessage"
                        onClick={previousMessage}
                    >
                        &#8249;
                    </button>
                    <button
                        id="btnNextMessage"
                        className="btnNextMessage"
                        onClick={nextMessage}
                    >
                        &#8250;
                    </button>
                </div>
            </div>

            <div className="displayMessage">{props.message}</div>
            {props.arrayFileNames.length > 0 ? (
                <div>
                    Załączniki:
                    {props.arrayFiles.map((path, index) => {
                        return (
                            <div
                                key={index}
                                onClick={() => downloadFile(path, index)}
                                style={{ cursor: "pointer" }}
                            >
                                <AiFillFile />
                                {props.arrayFileNames[index]}
                            </div>
                        );
                    })}
                </div>
            ) : (
                ""
            )}

            <div className="deleteMessage">
                <button onClick={() => props.deleteMessage(props.row)}>
                    Usuń wiadomość
                </button>
            </div>
        </div>
    );
};

export default ShowMessage;
