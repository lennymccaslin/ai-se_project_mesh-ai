import "./Intro.css";
import logoNoWords from "../../assets/LogoNoWords.png";
import icon from "../../assets/Icon.png";
import icon2 from "../../assets/Icon (2).png";
import icon3 from "../../assets/Icon (3).png";
import { useNavigate } from "react-router";

export default function Intro() {
  const navigate = useNavigate();
  const handleStart = () => {
    navigate("/knowledge");
  };

  return (
    <div className="intro">
      <header className="intro__header">
        <h1 className="intro__header-title">Welcome to Mesh AI</h1>
        <img src={logoNoWords} alt="Mesh AI logo" />
      </header>
      <div className="intro__icon-1">
        <img src={icon} alt="Stack of documents" />
        <p>Bring all your documents into one secure AI workspace</p>
      </div>
      <div className="intro__icon-2">
        <img src={icon2} alt="Folder of documents" />
        <p>Organize and manage the documents that power your AI</p>
      </div>
      <div className="intro__icon-3">
        <img src={icon3} alt="Documents with sparkles" />
        <p>Your knowledge base, accessible through a simple chat interface</p>
      </div>
      <div className="intro__start-message">
        <p>Start by creating your Organisation’s Knowledge Base</p>
      </div>
      <button
        className="intro__start-btn"
        type="button"
        aria-label="Start Button"
        onClick={handleStart}
      >
        Start
      </button>
    </div>
  );
}
