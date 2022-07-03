import React, { useState } from "react";
import axios from "axios";
import "./contactForm.css";

function ContactForm() {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [sendData, setSendData] = useState([]);
    const [emailError, setEmailError] = useState(false);
    const [messageError, setMessageError] = useState(false);
    const [fileError, setFileError] = useState(false);
    const [antyspamError, setAntyspamError] = useState(false);
    const [fileErrorInfo, setFileErrorInfo] = useState("");
    const [emailServerError, setEmailServerError] = useState(false);
    const [messageServerError, setMessageServerError] = useState(false);
    const [fileServerError, setFileServerError] = useState(false);
    const [antyspamServerError, setAntyspamServerError] = useState(false);
    const [serverAnswer, setServerAnswer] = useState(false);
    const [undefinedError, setUndefinedError] = useState(false);

    const [cantSubmit, setCantSubmit] = useState(false);

    function validateEmail(email) {
        console.log(email);
        if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
            return true;
        } else {
            console.log("Zły adres email");
            setEmailError(true);
            return false;
        }
    }
    function validateMessage(message) {
        if (!message) {
            setMessageError(true);
            return false;
        } else {
            return true;
        }
    }

    function validateAttachment(file) {
        var countFile = document.getElementById("file").files.length;
        var size = 0;
        var sizeMAX = 10485760;

        for (var i = 0; i < countFile; i++) {
            var attachment = document.getElementById("file").files[i];
            var type = attachment.mimeType;

            var attachmentName = attachment.name;
            var attachmentSplit = attachmentName.split(".");
            var attachmentExtension = attachmentSplit[1];

            var inputFile = document.getElementById("file");

            size = size + attachment.size;

            if (size > sizeMAX) {
                setFileError(true);
                setFileErrorInfo(
                    "Przepraszamy! Możesz załączyć pliki tylko do 10Mb."
                );

                return false;
            }
            var allowed = [
                "image/jpg",
                "image/png",
                "image/jpeg",
                "application/pdf",
                "image/gif",
                "application/x-zip-compressed",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/STEP",
                "application/dxf",
            ];

            if (
                allowed.indexOf(attachment.type) === -1 &&
                attachmentExtension != "stp" &&
                attachmentExtension != "DXF"
            ) {
                setFileError(true);
                setFileErrorInfo(
                    "Możesz załączyć pliki o typach: 'jpg', 'jpeg', 'png', 'pdf', 'gif', 'doc', 'docx', 'zip', 'stp', 'dxf'"
                );

                return false;
            }
        }

        return true;
    }
    function validateAntyspam(antyspam) {
        if (antyspam === "10") {
            return true;
        } else {
            setAntyspamError(true);
            return false;
        }
    }

    function uploadToServer(e) {
        setCantSubmit(true);
        e.preventDefault();
        var email = e.target[0].value;
        var message = e.target[1].value;
        var files = e.target[2].files;
        var antyspam = e.target[3].value;
        var fileNames = "";
        var fileArray = [];
        if (
            validateEmail(email) &&
            validateMessage(message) &&
            validateAttachment(files) &&
            validateAntyspam(antyspam) === true
        ) {
            const formData = new FormData();
            formData.append("email", email);
            formData.append("message", message);
            formData.append("antyspam", antyspam);

            for (let i = 0; i < files.length; i++) {
                fileNames = fileNames + "," + files[i].name;
                fileArray[i] = files[i];
                formData.append("files[]", fileArray[i]);
            }
            console.log(fileArray);
            fileNames = fileNames.slice(1);

            formData.append("fileNames", fileNames);

            axios({
                url: "/api/mail",
                method: "POST",
                data: formData,
                dataType: "json",

                headers: {
                    "Content-type": "multipart/form-data",
                },
            })
                .then((res) => {
                    console.log(res);
                    setCantSubmit(false);
                    document.getElementById("email").value = "";
                    document.getElementById("textMessage").value = "";
                    document.getElementById("file").value = "";
                    document.getElementById("antyspam").value = "";
                    setServerAnswer(true);
                })
                .catch((error) => {
                    var serverError = error.response.data.errors;
                    var fileServerError = error.response.data.error;
                    if (fileServerError) {
                        setFileServerError(fileServerError);
                    }

                    if (serverError || fileServerError) {
                        setCantSubmit(false);

                        if (typeof serverError.email !== "undefined") {
                            setEmailServerError(serverError.email[0]);
                        } else if (typeof serverError.message !== "undefined") {
                            setMessageServerError(serverError.message[0]);
                        }

                        for (let i = 0; i < files.length; i++) {
                            if (
                                typeof serverError["files." + i] !== "undefined"
                            ) {
                                setFileServerError(serverError["files." + i]);
                            }
                        }
                        if (typeof serverError.antyspam !== "undefined") {
                            setAntyspamServerError(serverError.antyspam[0]);
                        }
                    } else {
                        setUndefinedError(true);
                        setCantSubmit(false);
                    }
                });
        } else {
            setCantSubmit(false);
        }
    }
    return (
        <section className="contactForm">
            <h2 className="contact-center" id="sMessage">
                Wyślij wiadomość
            </h2>
            <form
                className="form"
                id="contactForm"
                method="post"
                noValidate
                onSubmit={(e) => uploadToServer(e)}
                encType="multipart/form-data"
            >
                <div className="form-row" id="divEmail">
                    <label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email"
                            data-error="Podaj poprawny adres email."
                            required
                            className={
                                emailError || emailServerError ? "shake" : ""
                            }
                            onFocus={(e) => {
                                setEmailError(false) ||
                                    setEmailServerError(false) ||
                                    setUndefinedError(false) ||
                                    setServerAnswer(false);
                            }}
                        />
                    </label>
                </div>

                <div className="error" id="emailFormError">
                    {emailError ? <span>Podaj poprawny adres email.</span> : ""}
                    {emailServerError ? <span>{emailServerError}</span> : ""}
                </div>

                <div className="form-row">
                    <label>
                        <textarea
                            name="message"
                            id="textMessage"
                            placeholder="Wiadomość"
                            cols="10"
                            rows="10"
                            required
                            data-error="Napisz tu swoja wiadomość."
                            className={
                                messageError || messageServerError
                                    ? "shake"
                                    : ""
                            }
                            onFocus={(e) => {
                                setMessageError(false) ||
                                    setMessageServerError(false) ||
                                    setUndefinedError(false) ||
                                    setServerAnswer(false);
                            }}
                        ></textarea>
                    </label>
                </div>
                <div className="error">
                    {messageError ? <span>Napisz swoją wiadomość.</span> : ""}
                    {messageServerError ? (
                        <span>{messageServerError}</span>
                    ) : (
                        ""
                    )}
                </div>
                <div id="submitTools">
                    <div className="fileAntyspam">
                        <div className="file">
                            <input
                                type="file"
                                name="files[]"
                                multiple
                                id="file"
                                onChange={(e) => {
                                    setSelectedFiles(e.target.files[0]);
                                }}
                                className={
                                    fileError ||
                                    fileErrorInfo ||
                                    fileServerError
                                        ? "shake"
                                        : ""
                                }
                                onFocus={(e) => {
                                    setFileError(false) ||
                                        setFileServerError(false);
                                }}
                            />

                            <div className="error">
                                {fileError ? <span>{fileErrorInfo}</span> : ""}
                                {fileServerError ? (
                                    <span>{fileServerError}</span>
                                ) : (
                                    ""
                                )}
                            </div>
                        </div>
                        <div className="antyspam">
                            AntySpam <br></br>5 + 5 ={" "}
                            <input
                                type="text"
                                id="antyspam"
                                name="anytyspam"
                                required
                                className={
                                    antyspamError || antyspamServerError
                                        ? "shake"
                                        : ""
                                }
                                onFocus={(e) => {
                                    setAntyspamError(false) ||
                                        setAntyspamServerError(false);
                                }}
                            />
                            <div className="error">
                                {antyspamError ? (
                                    <span>Wpisz poprawny wynik</span>
                                ) : (
                                    ""
                                )}
                                {antyspamServerError ? (
                                    <span>{antyspamServerError}</span>
                                ) : (
                                    ""
                                )}
                            </div>{" "}
                        </div>
                    </div>

                    <div id="submit_button">
                        <input
                            type="submit"
                            name="submit"
                            id="submit"
                            className="submit-btn"
                            value="Wyślij"
                            disabled={cantSubmit}
                        ></input>

                        {cantSubmit ? (
                            <div id="spinner" className="lds-spinner">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        ) : (
                            ""
                        )}
                    </div>
                </div>

                {serverAnswer ? (
                    <div id="serverAnswer">Dziękujemy, wiadomość wysłana!</div>
                ) : (
                    ""
                )}
                {undefinedError ? (
                    <div className="error">
                        Coś poszło nie tak. Proszę wysłać wiadomość jeszcze raz.
                        Załącznik może mieć do 10 MB.
                    </div>
                ) : (
                    ""
                )}
            </form>
        </section>
    );
}

export default ContactForm;
