import { useState, useRef, useEffect } from "preact/hooks";
import { hass } from "./utils";
import updater from "./updater";

const baseStyle = {
  display: "inline-block",
  width: 140,
  height: 80,
  border: "none",
  background: "rgba(0,0,0,0.7)",
  color: "white",
  fontWeight: "bold",
  borderRadius: 8,
  fontSize: 14,
  padding: 12,
  cursor: "pointer",
  margin: 8,
  float: "left",
};

const onStyle = {
  color: "black",
  background: "rgba(255,255,255,0.6)",
};

export default function Entity({
  label,
  entityId,
  on: externalOn,
}: {
  label: string;
  entityId: string;
  on: boolean;
}) {
  const [internalOn, setInternalOn] = useState<boolean | null>(null);
  const on = internalOn === null ? externalOn : internalOn;
  const timeoutRef = useRef<number>();

  const clearInternal = () => {
    setInternalOn(null);
    clearTimeout(timeoutRef.current);
  };

  const toggle = () => {
    clearInternal();
    setInternalOn(!on);

    timeoutRef.current = window.setTimeout(clearInternal, 4000);

    hass("post", `services/homeassistant/turn_${on ? "off" : "on"}`, {
      entity_id: entityId,
    }).then(() => setTimeout(() => updater.update(), 300));
  };

  useEffect(() => {
    clearInternal();
  }, [externalOn]);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <button style={{ ...baseStyle, ...(on ? onStyle : {}) }} onClick={toggle}>
      {label}
    </button>
  );
}
