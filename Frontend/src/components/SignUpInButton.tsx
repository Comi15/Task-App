import "../styles/registerForm.css";

type SingUpInButtonProps = {
  isSignUp: boolean;
  setSingUpInButtonUpdated(value: boolean): void;
};

const SingUpInButton = ({
  isSignUp,
  setSingUpInButtonUpdated,
}: SingUpInButtonProps) => {
  return (
    <>
      <div className="auth-toggle">
        <div className={`slider ${isSignUp ? "right" : "left"}`}>
          <button
            className="button-sl"
            onClick={() => setSingUpInButtonUpdated(false)}
          >
            Sign In
          </button>
          <button
            className="button-sl"
            onClick={() => setSingUpInButtonUpdated(true)}
          >
            Sign Up
          </button>
        </div>
      </div>
    </>
  );
};
export default SingUpInButton;
