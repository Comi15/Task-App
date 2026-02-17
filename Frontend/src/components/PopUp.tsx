import "../styles/popUp.css";

type PopUpProps = {
  children: React.ReactNode;
  setPopUpButtonClicked: React.Dispatch<React.SetStateAction<boolean>>;
};

const PopUp = ({ children, setPopUpButtonClicked }: PopUpProps) => {
  return (
    <>
      <div onClick={() => setPopUpButtonClicked(false)} id="overlay-div"></div>
      {children}
    </>
  );
};

export default PopUp;
