import { useState } from "react";

const useModal = () => {
  const [isShowing, setIsShowing] = useState(false);

  function toggle() {
    console.log("toggle is being triggered");
    setIsShowing(!isShowing);
  }
  return {
    isShowing,
    toggle,
  };
};

export default useModal;
