import React, { useState } from "react";
import axios from "axios";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    const response = await axios.post(
      "https://dialogflow.googleapis.com/v2/projects/YOUR_PROJECT_ID/agent/sessions/YOUR_SESSION_ID:detectIntent",
      {
        queryInput: {
          text: {
            text: input,
            languageCode: "en-US",
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer YOUR_ACCESS_TOKEN`,
        },
      }
    );

    const reply = response.data.queryResult.fulfillmentText;
    setMessages([
      ...messages,
      { text: input, from: "user" },
      { text: reply, from: "bot" },
    ]);
    setInput("");
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index} className={msg.from}>
            {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chatbot;
