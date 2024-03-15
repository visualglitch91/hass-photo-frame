import useIsBetweenTimes from "./useIsBetweenTimes";

export default function NightTimeOverlay() {
  const show = useIsBetweenTimes("23:00", "07:00");
  return show ? <div className="night-time-overlay" /> : null;
}
