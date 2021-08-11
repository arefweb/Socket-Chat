import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { io } from "socket.io-client";

/***********  App Component ***********/
const App = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io();

    socketRef.current.on("confirm user", (name) => {
      setUser(name);
    });

    socketRef.current.on("distributed message", (message) => {
      setMessages((oldMsgs) => [...oldMsgs, message]);
    });

  }, []);


  function handleSubmit(e) {
    e.preventDefault();
    const messageObject = {
      body: message,
      name: user,
    };
    setMessage("");
    socketRef.current.emit("send message", messageObject);
  }


  function handleUser(e) {
    e.preventDefault();
    socketRef.current.emit("set user", username);
  }

  useEffect(() => {
    console.log("user: " + user + " username: " + username);
  }, [user, username]);

  if (!user) {
    return (
      <div className="user">
        <section className="user-container">
          <form className="user-container-form">
            <input
              type="text"
              placeholder="نام خود را وارد نمایید"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button onClick={handleUser}>ارسال</button>
          </form>
        </section>
      </div>
    );
  }

  return (
    <div className="messages">
      <section className="messages-container">
        <div className="messages-container-top">
          <h3>
            پیام های
            <span> {user} </span>
          </h3>
          {messages.map((msg, i) => {
            return (
              <div
                key={i}
                className={`message-row ${
                  msg.name == user ? "same-person" : "other-person"
                }`}
              >
                <div>
                  <strong>{msg.name}: </strong> {msg.body}
                </div>
              </div>
            );
          })}
        </div>
        <form className="messages-container-form">
          <input
            type="text"
            placeholder="ارسال پیام"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={handleSubmit}>ارسال</button>
        </form>
      </section>
    </div>
  );
};

export default App;
