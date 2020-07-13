import React, { useState } from "react";
import { Button, Container, Row, Col } from "reactstrap";
import ControlButtons from "../UsefulComponents/ControlButtons";

const AttackBox = (props) => {
  const team = props.team;
  const enemyTeam = props.enemyTeam;
  const [highlight, setHighlight] = useState(
    props.lastmove ? props.lastmove : 0
  );

  let moves = props.active.moves;
  let xs = "6";
  if (props.playerTwoTurnAttack !== "") {
    moves = [props.playerTwoTurnAttack];
    xs = "12";
  }
  if (props.active.moves.filter((m) => m.pp > 0).length === 0) {
    moves = [
      {
        name: "Struggle",
        type: "none",
        power: 50,
        movetype: "phys",
        recoil: 0.25,
        accuracy: 100,
        speed: 1,
      },
    ];
    xs = "12";
  }

  const handleHighlight = (x) => {
    if (highlight + x < 0) {
      return;
    } else if (highlight + x >= 4) {
      return;
    } else {
      setHighlight(highlight + x);
    }
  };
  const decideEnemyMove = () => {
    if (
      (moves[highlight].hasOwnProperty("pp") && moves[highlight].pp !== 0) ||
      !moves[highlight].hasOwnProperty("pp")
    ) {
      props.decideEnemyMove(team, enemyTeam, moves[highlight], highlight);
    } else console.log("no pp");
  };

  return (
    <div>
      <div //Log and Menu Box
        style={{
          zIndex: props.z,
          position: "absolute",
          top: props.tilesize * 8,
          left: 0,
          width: "100vw",
          height: props.tilesize * 3,
          backgroundColor: "white",
        }}
      >
        <ControlButtons
          UpFunction={() => handleHighlight(-2)}
          DownFunction={() => handleHighlight(2)}
          LeftFunction={() => handleHighlight(-1)}
          RightFunction={() => handleHighlight(1)}
          AFunction={() => decideEnemyMove()}
          BFunction={() => props.closeAttackBox()}
          StartFunction={() => {
            console.log("unassigned");
          }}
          SelectFunction={() => props.closeFight()}
          tilesize={props.tilesize}
        />
        <Container fluid>
          <Row noGutters>
            {moves.map((m, i) =>
              i === highlight ? (
                <Col xs={xs}>
                  <Button
                    style={{
                      height: props.tilesize * 1.5,
                      minWidth: "100%",
                    }}
                    color="dark"
                  >
                    {m.type !== "none" ? (
                      <img
                        src={`${process.env.PUBLIC_URL}/assets/types/${m.type}.png`}
                        alt="put"
                        style={{
                          float: "right",
                          marginRight: 2,
                          marginLeft: 2,
                          height: props.tilesize * 1.2,
                          width: props.tilesize * 1.2,
                        }}
                      />
                    ) : (
                      ""
                    )}
                    <h3>
                      {m.name} {m.hasOwnProperty("pp") ? "(" + m.pp + ")" : ""}
                    </h3>
                  </Button>
                </Col>
              ) : (
                <Col xs={xs}>
                  <Button
                    style={{
                      minWidth: "100%",
                      height: props.tilesize * 1.5,
                    }}
                    outline
                    color="dark"
                  >
                    {m.type !== "none" ? (
                      <img
                        src={`${process.env.PUBLIC_URL}/assets/types/${m.type}.png`}
                        alt="put"
                        style={{
                          float: "right",
                          marginRight: 2,
                          marginLeft: 2,
                          height: props.tilesize,
                          width: props.tilesize,
                        }}
                      />
                    ) : (
                      ""
                    )}
                    <h3>
                      {m.name} {m.hasOwnProperty("pp") ? "(" + m.pp + ")" : ""}
                    </h3>
                  </Button>
                </Col>
              )
            )}
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default AttackBox;
