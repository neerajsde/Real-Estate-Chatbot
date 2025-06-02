import React, { useState, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import {
  addMessage,
  clearMessages,
  closeChat,
} from "../../features/chat/chatSlice";
import mira_profile from "../../assets/mira_profile.jpg";
import apiHandler from "../../utils/apiHandler";
import { Link, useNavigate } from "react-router-dom";
import { TbWindowMinimize } from "react-icons/tb";

export default function Chatbot() {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [status, setStatus] = useState("online");
  const chatContainerRef = useRef(null);
  const navigate = useNavigate();
  const preferences = useRef({
    location: "",
    budget: "",
    bedrooms: "",
    size: "",
    amenities: "",
  });

  const [input, setInput] = useState("");
  const [stepIndex, setStepIndex] = useState(0);

  const messages = useSelector((state) => state.chat.messages);

  const questions = [
    "First, what location are you interested in?",
    "What's your budget range?",
    "How many bedrooms are you looking for?",
    "Do you have a preferred size in square feet?",
    "Any specific amenities you want? (e.g. Pool, Gym, Parking)",
  ];

  useEffect(() => {
    if (messages.length > 0) return;

    setStatus("typing...");

    const initialMsgs = [
      {
        sender: "bot",
        message: `Welcome${
          isAuthenticated && user ? ` ${user.name.split(" ")[0]}` : ""
        } 😊\n\nI'm here to help you find your ideal property.`,
      },
    ];

    // Store timeout IDs so we can clear them on unmount
    const timeoutIds = [];

    // Add welcome messages
    initialMsgs.forEach((msg, idx) => {
      const id = setTimeout(() => dispatch(addMessage(msg)), idx * 500);
      timeoutIds.push(id);
    });

    // Ask first question
    const questionTimeout = setTimeout(() => {
      dispatch(addMessage({ sender: "bot", message: questions[0] }));
    }, initialMsgs.length * 500 + 500);
    timeoutIds.push(questionTimeout);

    // Set status to online
    const statusTimeout = setTimeout(() => {
      setStatus("online");
    }, initialMsgs.length * 500 + 1000);
    timeoutIds.push(statusTimeout);

    // Cleanup on unmount or re-render
    return () => {
      timeoutIds.forEach(clearTimeout);
    };
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  // Optimized sendMessage function
  const sendMessage = async () => {
    setStatus("typing...");
    if (!input.trim()) return;

    const trimmedInput = input.trim();
    dispatch(addMessage({ sender: "user", message: trimmedInput }));
    setInput("");

    const greetings = ["hi", "hello", "hey", "good morning", "good evening"];
    if (greetings.some((word) => input.toLowerCase().includes(word))) {
      dispatch(
        addMessage({
          sender: "bot",
          message: `Hello! How can I assist you with finding a property today?\n\n${questions[stepIndex]}`,
        })
      );
      return;
    }

    const currentStep = stepIndex;

    // Validation logic
    const isNumber = (val) => /^\d+(\.\d+)?$/.test(val);

    // Step-specific validation
    if (currentStep === 1 && !isNumber(trimmedInput)) {
      dispatch(
        addMessage({
          sender: "bot",
          message:
            "💰 Please enter a valid numeric value for budget (e.g. 50000).",
        })
      );
      setStatus("online");
      return;
    }

    if (
      currentStep === 2 &&
      (!Number.isInteger(Number(trimmedInput)) || Number(trimmedInput) <= 0)
    ) {
      dispatch(
        addMessage({
          sender: "bot",
          message: "🛏️ Please enter a valid number of bedrooms (e.g. 2).",
        })
      );
      setStatus("online");
      return;
    }

    if (currentStep === 3 && !isNumber(trimmedInput)) {
      dispatch(
        addMessage({
          sender: "bot",
          message:
            "📐 Please enter a valid numeric size in square feet (e.g. 1200).",
        })
      );
      setStatus("online");
      return;
    }

    // Store the preference based on current step
    if (currentStep === 0) preferences.current.location = trimmedInput;
    if (currentStep === 1) preferences.current.budget = trimmedInput;
    if (currentStep === 2) preferences.current.bedrooms = trimmedInput;
    if (currentStep === 3) preferences.current.size = trimmedInput;
    if (currentStep === 4) preferences.current.amenities = trimmedInput;

    const nextStep = currentStep + 1;

    // Show next question or summary
    setTimeout(() => {
      if (nextStep < questions.length) {
        dispatch(addMessage({ sender: "bot", message: questions[nextStep] }));
        setStepIndex(nextStep);
        setStatus("online");
      } else {
        dispatch(
          addMessage({
            sender: "bot",
            message: `Thanks! Here's a quick summary of your preferences:\n\n📍 Location: ${preferences.current.location}\n💰 Budget: ${preferences.current.budget}\n🛏️ Bedrooms: ${preferences.current.bedrooms}\n📐 Size: ${preferences.current.size}\n✨ Amenities: ${preferences.current.amenities}`,
          })
        );
        dispatch(
          addMessage({
            sender: "bot",
            message:
              "We'll start searching properties based on your preferences. ✅",
          })
        );
        serachRecommendation();
      }
    }, 1000);
  };

  async function serachRecommendation() {
    setStatus("typing...");
    const payload = {
      ...preferences.current,
      amenities: preferences.current.amenities.split(","),
    };
    let res;
    if (isAuthenticated) {
      res = await apiHandler("/chats/search/me", "POST", payload);
    } else {
      res = await apiHandler("/chats/search", "POST", payload);
    }
    if (res.success) {
      localStorage.setItem("RecommendedProperties", JSON.stringify(res.data));
      const url = window.location;
      dispatch(
        addMessage({
          sender: "bot",
          message: `${res.message}\n\nGo to ${window.location.origin}/recommended`,
        })
      );
      let xtime = setTimeout(() => {
        navigate("/recommended");
        dispatch(closeChat());
      }, 4000);
      clearTimeout(xtime);
    } else {
      dispatch(
        addMessage({
          sender: "bot",
          message: `Sorry 😔 ${res.message}`,
        })
      );
    }
    setStatus("online");
  }

  const handleCloseChat = () => {
    dispatch(clearMessages());
    dispatch(closeChat());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="fixed bottom-0 right-0 w-[500px] rounded-l-3xl shadow-lg border border-gray-300 flex flex-col h-full overflow-hidden z-[9999]">
      {/* Header */}
      <div className="flex justify-between items-center gap-2 px-4 py-2 border-b border-gray-300 bg-white">
        <div className="flex items-center gap-2">
          <img
            src={mira_profile}
            alt="profile-pic"
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
            title="minimize"
          />
          <IoClose
            onClick={handleCloseChat}
            className="cursor-pointer text-2xl"
            title="clear chat and close"
          />
        </div>
      </div>

      {/* Chat messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-200"
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[80%] px-4 py-2 rounded-xl text-sm whitespace-pre-line ${
              msg.sender === "bot"
                ? "bg-white text-gray-800 self-start"
                : "bg-blue-500 text-white self-end ml-auto"
            }`}
          >
            {(() => {
              const urlRegex = /(https?:\/\/[^\s]+)/g;
              const parts = msg.message.split(urlRegex);
              return parts.map((part, i) =>
                urlRegex.test(part) ? (
                  <a
                    key={i}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {part}
                  </a>
                ) : (
                  <span key={i}>{part}</span>
                )
              );
            })()}
          </div>
        ))}
      </div>

      {/* Input box */}
      <div className="flex items-center gap-2 p-3 border-t border-gray-300 bg-white">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-600 transition-colors text-white px-4 py-2 rounded-full text-sm shadow-md"
        >
          Send
        </button>
      </div>
    </div>
  );
}
