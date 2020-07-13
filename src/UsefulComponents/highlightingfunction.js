import React, { useState } from "react";
import { Button } from "reactstrap";
import ControlButtons from "./UsefulComponents.js/ControlButtons";

function Highlight(props) {
  const [highlight, setHighlight] = useState(0);
  const [clicked, setClicked] = useState(false);

  const handleHighlight = (x) => {
    if (highlight + x < 0) {
      return;
    } else if (highlight + x >= dex.dex.length) {
      return;
    } else {
      setHighlight(highlight + x);
    }
  };
  const clickOnHighlight = () => {
    if (clicked == true) {
      return /**The highlighted object */;
    }
  };
  return (
    <div>
      {!clicked ? (
        <div>
          <ControlButtons
            UpFunction={() => handleHighlight(-1)}
            DownFunction={() => handleHighlight(1)}
            LeftFunction={() => handleHighlight(-5)}
            RightFunction={() => handleHighlight(5)}
            AFunction={() => setClicked(true)}
            BFunction={() => props.closeDex()}
            StartFunction={() => {
              console.log("unassigned");
            }}
            SelectFunction={() => {
              console.log("unassigned");
            }}
          />
          ;
          <div
            style={{
              zIndex: 300,
              position: "absolute",
              top: 0,
              left: 0,
              width: 450,
              height: 330,
              backgroundColor: "white",
              border: "solid",
              borderColor: "green",
              borderWidth: 2,
            }}
          >
            {dex.dex.map((p, i) =>
              i == highlight ? (
                <h5 style={{ border: "solid", borderWidth: 1, height: 30 }}>
                  {p.name}
                </h5>
              ) : (
                <h5 style={{ height: 30 }}>{p.name}</h5>
              )
            )}
          </div>
        </div>
      ) : (
        clickOnHighlight()
      )}
    </div>
  );
}
export default Highlight;
