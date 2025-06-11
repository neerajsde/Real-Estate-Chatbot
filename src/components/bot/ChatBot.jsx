import React, { useState, useEffect, useRef } from "react";
import { IoClose, IoReload } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import {
  addMessage,
  clearMessages,
  closeChat,
} from "../../features/chat/chatSlice";
import mira_profile from "../../assets/mira_profile.jpg";
import apiHandler from "../../utils/apiHandler";
import { TbWindowMinimize } from "react-icons/tb";
import toast from "react-hot-toast";
import DotLoader from "../spinner/DotLoader";

export default function Chatbot() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const chatsHistory = useSelector((state) => state.chat.messages);
  const [status, setStatus] = useState("online");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatsHistory, loading]);

  const hasGreetedRef = useRef(false);

  useEffect(() => {
    const greetUser = async () => {
      if (!hasGreetedRef.current && chatsHistory.length === 0) {
        hasGreetedRef.current = true;
        const greeting = isAuthenticated ? `Hi, My name is ${user.name}` : "Hi";
        try {
          setLoading(true);
          dispatch(addMessage({ role: 'user', parts: [{ text: greeting }] }))
          const response = await apiHandler("/chats/bot", "POST", {
            userQuery: greeting,
            chatsHistory: chatsHistory,
          });

          if (response.success) {
            dispatch(addMessage(response.data));
          }
        } catch (err) {
          console.error("Greeting Error:", err);
        } finally {
          setLoading(false);
        }
      }
    };
    greetUser();
  }, [isAuthenticated, chatsHistory.length]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const trimmedInput = input.trim();
    const newMessage = { role: "user", parts: [{ text: trimmedInput }] };

    dispatch(addMessage(newMessage));
    setInput("");
    setStatus("typing...");
    setLoading(true);

    try {
      const response = await apiHandler("/chats/bot", "POST", {
        userQuery: trimmedInput,
        chatsHistory: [...chatsHistory, newMessage],
      });

      if (response.success) {
        dispatch(addMessage(response.data));
      } else {
        toast.error(response.message || "Something went wrong.");
      }
    } catch (error) {
      toast.error("Failed to fetch response.");
      console.error("SendMessage Error:", error);
    } finally {
      setStatus("online");
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const handleCloseChat = () => {
    dispatch(clearMessages());
    dispatch(closeChat());
  };

  function formatMessageWithMarkdown(text) {
    // Format bold/italic
    let formatted = text
      .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>");

    // Handle bullet points (lines starting with "* ")
    const lines = formatted.split("\n");
    const parsedLines = [];
    let insideList = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith("* ")) {
        if (!insideList) {
          parsedLines.push("<ul>");
          insideList = true;
        }
        parsedLines.push("<li>" + line.slice(2) + "</li>");
      } else {
        if (insideList) {
          parsedLines.push("</ul>");
          insideList = false;
        }
        parsedLines.push("<p>" + line + "</p>");
      }
    }

    if (insideList) {
      parsedLines.push("</ul>");
    }

    // Convert links
    const finalHTML = parsedLines
      .join("\n")
      .replace(
        /(https?:\/\/[^\s]+)/g,
        `<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">$1</a>`
      );

    return <div dangerouslySetInnerHTML={{ __html: finalHTML }} />;
  }

  return (
    <div className="fixed bottom-0 right-0 w-full md:w-[500px] h-[80vh] md:h-full rounded-t-2xl md:rounded-l-3xl shadow-lg border border-gray-300 flex flex-col overflow-hidden z-[9999]">
      {/* Header */}
      <div className="flex justify-between items-center gap-2 px-4 py-2 border-b border-gray-300 bg-white">
        <div className="flex items-center gap-2">
          <img
            src={mira_profile}
            alt="Mira AI"
            className="w-10 h-10 rounded-full object-contain border-2 border-blue-500"
          />
          <div className="flex flex-col items-start">
            <h2 className="font-semibold text-gray-700 text-sm">Mira ✨</h2>
            <span className="text-xs text-emerald-500">{status}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TbWindowMinimize
            onClick={() => dispatch(closeChat())}
            className="cursor-pointer text-xl"
            title="Minimize"
          />
          <IoClose
            onClick={handleCloseChat}
            className="cursor-pointer text-2xl"
            title="Clear chat and close"
          />
        </div>
      </div>

      {/* Messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 p-2 md:p-4 overflow-y-auto space-y-3 bg-gray-200"
      >
        {chatsHistory.map((msg, idx) => {
          if(idx === 0) return;
          const messageText = msg.parts?.[0]?.text || "";
          const isBot =
            msg.role === "model" ||
            msg.sender === "bot" ||
            msg.role === "assistant";

          const baseStyle =
            "px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap shadow-sm transition-transform";
          const bubbleStyle = isBot
            ? "bg-gradient-to-br from-white to-gray-100 text-gray-900 self-start rounded-bl-none"
            : "bg-gradient-to-br from-blue-500 to-blue-600 text-white self-end rounded-br-none ml-auto";

          return (
            <div
              key={idx}
              className={`max-w-[80%] ${baseStyle} ${bubbleStyle} hover:scale-[1.02]`}
            >
              {formatMessageWithMarkdown(messageText)}
            </div>
          );
        })}

        {/* Typing Indicator */}
        {loading && (
          <div className="w-[80px] px-4 py-2 rounded-xl bg-blue-500 flex justify-center items-center shadow">
            <DotLoader/>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 p-3 border-t border-gray-300 bg-white">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 transition-colors text-white px-4 py-2 rounded-full text-sm shadow-md"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
