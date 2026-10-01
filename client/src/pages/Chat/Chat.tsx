import { useEffect, useState } from "react";
import { createChat, getChats, getChat, type Chat as ChatType, type Message } from "../../utils/api";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router";
import errorIcon from "../../assets/errorIcon.png";
import "./Chat.css";

export default function Chat() {
	const [chats, setChats] = useState<ChatType[]>([]);
	const [activeChatId, setActiveChatId] = useState<string | null>(null);
	const [chatsError, setChatsError] = useState<string | null>(null);
	const [isLoadingChats, setIsLoadingChats] = useState<boolean>(true);
	const [isCreatingChat, setIsCreatingChat] = useState<boolean>(false);
	const [newChatTitle, setNewChatTitle] = useState<string>("");
	const [messages, setMessages] = useState<Message[]>([]);
	const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
	const [messagesError, setMessagesError] = useState<string>("");

	useEffect(() => {
  const load = async () => {
    try {
      const res = await getChats();
	    if (res.error) {
        setChatsError(res.error.message);
      } else {
        setChats(res.data ?? []);
      }
    } catch {
      setChatsError("We couldn't load your chats. Please try again.");
    } finally {
      setIsLoadingChats(false);
    }
  };

  load();
}, []);

	useEffect(() => {
    if (!activeChatId) return;

		const load = async () => {
      setMessages([]);
      setMessagesError("");
      setIsLoadingMessages(true);
	  try {
		const res = await getChat(activeChatId);
		if (res.error) {
			setMessagesError(res.error.message);
		} else {
			setMessages(res.data?.messages || []);
		};
	  } catch {
		setMessagesError("Failed to load messages.");
	  } finally {
		setIsLoadingMessages(false);
	  }
		};

		load();
  }, [activeChatId]);

  const handleCreateChat = async () => {
		const title = newChatTitle.trim() || 'New Chat';
		setIsCreatingChat(false);
		setNewChatTitle("New Chat");
try {
 const res = await createChat(title);
 if (res.data) {
  setChats((prev) => [res.data!, ...prev]);
setActiveChatId(res.data._id);
 }
} catch {
 // A toast or inline error could go here in the future
}	
	}

	return (
  <div className="chat">
    <aside className="chat__sidebar">
      <button 
	  className="chat__new-btn" 
	  type="button"
	  onClick={() => setIsCreatingChat(true)}
	  >
        + New Chat
      </button>
		{isCreatingChat && (
 <input
   className="chat__title-input"
   type="text"
   placeholder="Chat name"
   value={newChatTitle}
  onChange={(e) => {setNewChatTitle(e.target.value)}}
   onKeyDown={(e) => {
     if (e.key === 'Enter') handleCreateChat();
     if (e.key === 'Escape') {
       setIsCreatingChat(false);
       setNewChatTitle("New Chat");
     }
   }}
   autoFocus
 />
)}
      {isLoadingChats && <p className="chat__sidebar-message">Loading…</p>}
      {chatsError && <p className="chat__sidebar-message">{chatsError}</p>}

      <ul className="chat__list">
        {chats.map((c) => (
  <li
    key={c._id}
    className={
      c._id === activeChatId
        ? 'chat__item chat__item_active'
        : 'chat__item'
    }
    onClick={() => setActiveChatId(c._id)}
  >
    {c.title}
  </li>
))}
      </ul>
    </aside>

    <div className="chat__main">
		{!messagesError && !isLoadingMessages && !activeChatId && (
        <div className="chat__empty-state">
          <p className="chat__state">
            Create a new chat or select an existing one to start the conversation
          </p>
          <button
            className="chat__empty-state-btn"
            type="button"
            onClick={() => setIsCreatingChat(true)}
          >
            Start New Chat
          </button>
        </div>
		)}
		{!messagesError && !isLoadingMessages && activeChatId && messages.length === 0 && (
			<div className="chat__no-messages">
        <h2 className="chat__no-messages-title">
          Ask a question below
          <span>to start the conversation</span>
        </h2>
        <div className="chat__composer">
          <textarea
            className="chat__composer-input"
            aria-label="Ask a question"
            placeholder="Ask any question"
            rows={3}
          />
          <span className="chat__composer-send" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M4 12 20 5l-5 14-3-6-8-1Z" />
            </svg>
          </span>
        </div>
		</div>
		)}

		  {activeChatId && isLoadingMessages && (
    <p className="chat__loading">Loading...</p>
  )}

  	  {activeChatId && messagesError && (
      <section className="chat__error" role="alert">
        <img className="chat__error-icon" src={errorIcon} alt="" aria-hidden="true" />
        <h1>Looks like something went wrong</h1>
        <p className="chat__error-guidance">
          Try reloading the page or creating the chat again
        </p>
        <p className="chat__error-detail">{messagesError}</p>
        <Link className="chat__error-link" to="/">
          Go to the Main Page
        </Link>
      </section>
  )}

    {activeChatId && !isLoadingMessages && !messagesError && (
    <ul className="chat__messages">
      <li className="chat__messages-title">Chat with loaded messages</li>
      {messages.map((msg) => (
        <li
          key={msg._id}
          className={
            msg.role === 'user'
              ? 'chat__message chat__message_user'
              : 'chat__message chat__message_assistant'
          }
        >
          {msg.role === "assistant" ? (
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          ) : (
            msg.content
          )}
        </li>
      ))}
    </ul>
  )}

  </div>
  </div>
);
}
