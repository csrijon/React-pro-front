import "../../css/NeonButton.css";

const NeonButton = ({  onClick }) => {
  return (
    <button className="neon-btn" onClick={onClick}>
Sign Up
    </button>
  );
};

export default NeonButton;