import { useState } from "preact/hooks";
import ImageSlider from "./ImageSlider";
import HomeAssistant from "./HomeAssistant";

export default function App() {
  const [showHASS, setShowHASS] = useState(false);

  return (
    <>
      <ImageSlider onClick={() => setShowHASS(true)} />
      {showHASS && <HomeAssistant onClickAway={() => setShowHASS(false)} />}
    </>
  );
}
