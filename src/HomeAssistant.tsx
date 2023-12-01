import { JSX } from "preact/jsx-runtime";
import { useEffect, useState } from "preact/hooks";
import { homeAssistant } from "./config.json";
import updater from "./updater";
import Entity from "./Entity";

const { entities, columnCount } = homeAssistant;

export default function HomeAssistant({
  onClickAway,
}: {
  onClickAway: () => void;
}) {
  const [states, setStates] = useState<Record<string, any>>(
    () => updater.states
  );

  useEffect(() => {
    updater.setCallback(setStates);
    updater.start();

    return () => updater.stop();
  }, []);

  return (
    <div
      className="home-assistant"
      onClick={(e) => {
        //@ts-expect-error
        if (e.target?.className === "home-assistant") {
          onClickAway();
        }
      }}
    >
      <table>
        <tbody>
          {entities
            .reduce((rows, entity) => {
              let row = rows[rows.length - 1];

              if (typeof row === "undefined" || row.length === columnCount) {
                row = [];
                rows.push(row);
              }

              row.push(
                <td key={entity.entityId}>
                  <Entity
                    entityId={entity.entityId}
                    label={entity.label || entity.entityId}
                    on={states[entity.entityId]}
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
  );
}
