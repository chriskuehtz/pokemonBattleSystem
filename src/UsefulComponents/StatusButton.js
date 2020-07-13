import React from "react";
import { Button } from "reactstrap";

const StatusButton = (props) => {
  let button = { color: "", text: "" };
  if (props.status === "poisoned") {
    button = { color: "rgb(170,109,198)", text: "PSN" };
  } else if (props.status === "paralyzed") {
    button = { color: "rgb(242,209,75)", text: "PAR" };
  } else if (props.status === "burned") {
    button = { color: "rgb(253,156,91)", text: "BRN" };
  } else if (props.status === "asleep") {
    button = { color: "rgb(145,153,161)", text: "SLP" };
  } else if (props.status === "frozen") {
    button = { color: "rgb(119,206,192)", text: "FRZ" };
  } else if (props.status === "confused") {
    button = { color: "rgb(247,114,120)", text: "CNF" };
  }
  return (
    <Button
      style={{
        backgroundColor: button.color,
        float: props.float,
        color: "white",
        width: props.tilesize * 1.4,
        height: props.tilesize,
      }}
    >
      {button.text}
    </Button>
  );
};

export default StatusButton;
