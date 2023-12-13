import { JSX } from "preact/jsx-runtime";
import { useEffect, useRef, useState } from "preact/hooks";
import config from "../config.json";
import updater from "./updater";
import Entity from "./Entity";

const { rooms, cellWidth, cellHeight, cellGap } = config.homeAssistant;

const columnCount = (() => {
  const effectiveWidth = cellWidth + cellGap;
  return Math.floor((window.innerWidth - 52) / effectiveWidth);
})();

const tableWidth = columnCount * (cellWidth + cellGap);

export default function HomeAssistant({
  onClickAway,
}: {
  onClickAway: () => void;
}) {
  const timeoutRef = useRef(0);
  const onClickAwayRef = useRef(onClickAway);

  const [states, setStates] = useState<Record<string, any>>(
    () => updater.states
  );

  const restartCloseTimeout = () => {
    clearTimeout(timeoutRef.current);

    timeoutRef.current = window.setTimeout(() => {
      onClickAwayRef.current();
    }, 5_000);
  };

  useEffect(() => {
    updater.setCallback(setStates);
    updater.start();

    return () => updater.stop();
  }, []);

  useEffect(() => {
    restartCloseTimeout();

    return () => {
      window.clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    onClickAwayRef.current = onClickAway;
  }, [onClickAway]);

  return (
    <div
      className="home-assistant"
      onClick={(e) => {
        //@ts-expect-error
        if (e.target?.tagName !== "BUTTON") {
          onClickAway();
        }
      }}
    >
      {rooms.map((room, index) => (
        <div key={index} style={{ width: tableWidth, margin: "0 auto" }}>
          <h3>{room.label}</h3>
          <table style={{ marginLeft: -(cellGap / 2) }}>
            <tbody>
              {room.entities
                .reduce((rows, entity) => {
                  let row = rows[rows.length - 1];

                  if (
                    typeof row === "undefined" ||
                    row.length === columnCount
                  ) {
                    row = [];
                    rows.push(row);
                  }

                  row.push(
                    <td key={entity.entityId} style={{ padding: cellGap / 2 }}>
                      <Entity
                        width={cellWidth}
                        height={cellHeight}
                        entityId={entity.entityId}
                        label={entity.label || entity.entityId}
                        on={states[entity.entityId]}
                        onToggle={restartCloseTimeout}
                      />
                    </td>
                  );

                  return rows;
                }, [] as JSX.Element[][])
                .map((row, index) => (
                  <tr key={index}>{row}</tr>
                ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
