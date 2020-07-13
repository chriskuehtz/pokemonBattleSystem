import React, { useState } from "react";
import { Button, ButtonGroup, Progress, Container, Row, Col } from "reactstrap";
import ControlButtons from "../UsefulComponents/ControlButtons";

const MoveScreen = (props) => {
  const [highlight, setHighlight] = useState(4);
  const [clicked, setClicked] = useState(false);
  const handleHighlight = (dir) => {
    if (dir === "up") {
      if ([0, 1].includes(highlight)) setHighlight(-1);
      else if (highlight === 2) setHighlight(0);
      else if (highlight === 3) setHighlight(1);
      else if (highlight === 4) setHighlight(2);
    } else if (dir === "down") {
      if (highlight === -1) setHighlight(0);
      else if (highlight === 0) setHighlight(2);
      else if (highlight === 1) setHighlight(3);
      else if ([2, 3].includes(highlight)) setHighlight(4);
    } else if (dir === "left") {
      if (highlight === 1) setHighlight(0);
      else if (highlight === 3) setHighlight(2);
    } else if (dir == "right") {
      if (highlight === 0) setHighlight(1);
      else if (highlight === 2) setHighlight(3);
    }
  };
  const clickOn = () => {
    if (clicked === true) {
      if ([-1, 4].includes(highlight)) {
        props.closeMoveScreen();
      } else {
        let moveset = props.pokemon.moves;
        moveset.splice(highlight, 1, props.move);
        let tempTeam = props.team;
        tempTeam[0].moves = moveset;
        props.learnMove(tempTeam);
      }
    }
  };
  return (
    <div>
      <ControlButtons
        UpFunction={() => handleHighlight("up")}
        DownFunction={() => handleHighlight("down")}
        LeftFunction={() => handleHighlight("left")}
        RightFunction={() => handleHighlight("right")}
        AFunction={() => setClicked(true)}
        BFunction={() => props.closeMoveScreen()}
        StartFunction={() => {
          console.log("unassigned");
        }}
        SelectFunction={() => {}}
        tilesize={props.tilesize}
      />

      <div
        style={{
          zIndex: props.z,
          position: "absolute",
          top: 0,
          left: 0,
          width: props.tilesize * 15,
          height: props.tilesize * 11,
          backgroundColor: "white",
        }}
      >
        {clickOn()}
        <Container fluid>
          <Row noGutters>
            <Col style={{ height: props.tilesize * 2 }} xs="3">
              <Button
                color="danger"
                outline={highlight === -1 ? false : true}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              >
                {highlight === -1 ? <h2>back</h2> : <h4>back</h4>}
              </Button>
            </Col>
            <Col style={{ height: props.tilesize * 2 }} xs="9">
              <h1>{props.pokemon.name}</h1>
            </Col>
            {props.pokemon.moves.map((m, i) => (
              <Col style={{ height: props.tilesize * 3 }} xs="6">
                <Button
                  color={highlight === i ? "warning" : "dark"}
                  outline={highlight === i ? false : true}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                >
                  {highlight === i ? <h2>{m.name}</h2> : <h4>{m.name}</h4>}
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/types/${m.type}.png`}
                    alt="put"
                    style={{
                      float: "right",
                      marginRight: 2,
                      marginLeft: 2,
                      width: props.tilesize * 1.2,
                    }}
                  />
                </Button>
              </Col>
            ))}
            <Col style={{ height: props.tilesize * 3 }} xs="12">
              <Button
                color={highlight === 4 ? "warning" : "dark"}
                outline={highlight === 4 ? false : true}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              >
                {highlight === 4 ? (
                  <h2>{props.move.name}</h2>
                ) : (
                  <h4>{props.move.name}</h4>
                )}

                <img
                  src={`${process.env.PUBLIC_URL}/assets/types/${props.move.type}.png`}
                  alt="put"
                  style={{
                    float: "right",
                    marginRight: 2,
                    marginLeft: 2,
                    width: props.tilesize * 1.2,
                  }}
                />
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};
export default MoveScreen;
