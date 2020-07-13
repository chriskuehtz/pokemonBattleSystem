import React, { useState, useEffect } from "react";
import types from "../data//types.json";
import { Progress, Button, Row, Col, Container } from "reactstrap";
import ControlButtons from "../UsefulComponents/ControlButtons";
import movesdata from "../data/moves.json";

const IndividualScreen = (props) => {
  const [moves, setMoves] = useState(false);
  const mon = props.p;
  const [p, setP] = useState(mon);
  const tilesize = props.tilesize;

  const columnstyle = {
    border: "solid",
    borderColor: "lightgray",
    borderWidth: 1,
    borderRadius: 5,
  };

  useEffect(() => {
    const getMoveData = (pokemon) => {
      //gets the move data for the players team
      console.log("getMoveData");
      pokemon.moves.map((m, i) => {
        if (typeof m === "string") {
          pokemon.moves[i] = Object.assign(movesdata[m]);
        }
      });
      setP(pokemon);
    };
    getMoveData(mon);
  }, []);

  return (
    <div
      style={{
        zIndex: props.z,
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: tilesize * 11,
        backgroundImage: `linear-gradient(
          to bottom right,
          ${types.types.filter((t) => t.name === p.type)[0].color},
          ${
            p.hasOwnProperty("type2")
              ? types.types.filter((t) => t.name === p.type2)[0].color
              : "white"
          }
        )`,
        border: "solid",
        borderColor: "red",
        borderWidth: 0,
      }}
    >
      <ControlButtons
        UpFunction={() => props.prev()}
        DownFunction={() => props.next()}
        LeftFunction={() => setMoves(!moves)}
        RightFunction={() => setMoves(!moves)}
        AFunction={() => console.log("not assigned")}
        BFunction={() => props.closeIndiv()}
        StartFunction={() => console.log("not assigned")}
        SelectFunction={() => console.log("not assigned")}
        tilesize={tilesize}
      />
      <div>
        <Container fluid>
          {moves === true ? (
            <Row noGutters>
              {p.moves.map((m, i) => (
                <Col style={{ height: tilesize * 5.5 }} xs="6">
                  <Button
                    color="dark"
                    outline
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/types/${m.type}.png`}
                      alt="put"
                      style={{
                        margin: 2,
                        width: props.tilesize * 1.5,
                      }}
                    />
                    <h2>{m.name}</h2>
                    {m.hasOwnProperty("power") ? (
                      <h6>
                        Power: {m.power} {"(" + m.movetype + ")"}
                      </h6>
                    ) : (
                      ""
                    )}
                    {m.hasOwnProperty("otherEffect") ? (
                      <h6>
                        Effect: {m.otherEffect.effect}{" "}
                        {"(" + m.otherEffect.chance * 100 + "%)"}
                      </h6>
                    ) : (
                      ""
                    )}
                    {m.hasOwnProperty("status") ? (
                      <h6>
                        Status: {m.status.effect}{" "}
                        {"(" + m.status.chance * 100 + "%)"}
                      </h6>
                    ) : (
                      ""
                    )}
                    {m.hasOwnProperty("statChange") ? (
                      <div>
                        <h6>
                          Stats:{" "}
                          {m.statChange.factor > 0
                            ? "+" + m.statChange.factor
                            : m.statChange.factor}{" "}
                          {m.statChange.stats.join()}
                        </h6>
                        <h6>
                          Target: {m.statChange.target}
                          {"(" + m.statChange.chance * 100 + "%)"}
                        </h6>
                      </div>
                    ) : (
                      ""
                    )}
                    <h6>
                      PP:{m.pp}/Acc:{m.accuracy}
                    </h6>
                  </Button>
                </Col>
              ))}
            </Row>
          ) : (
            <Row>
              <Col style={columnstyle} xs="6">
                <div>
                  <Row>
                    <Col xs="6">
                      <h3>{p.name}</h3>
                    </Col>
                    <Col xs="6">
                      <img
                        src={`${process.env.PUBLIC_URL}/assets/types/${p.type}.png`}
                        alt="put"
                        style={{
                          float: "right",
                          margin: 2,
                          height: props.tilesize,
                          width: props.tilesize,
                        }}
                      />
                      {p.hasOwnProperty("type2") ? (
                        <img
                          src={`${process.env.PUBLIC_URL}/assets/types/${p.type2}.png`}
                          alt="put"
                          style={{
                            float: "right",
                            margin: 2,
                            height: props.tilesize,
                            width: props.tilesize,
                          }}
                        />
                      ) : (
                        ""
                      )}
                    </Col>
                    <Col xs="12">
                      <h4>LVL:{Math.floor(Math.cbrt(p.exp))}</h4>
                    </Col>
                  </Row>
                </div>
                <div>
                  <Progress
                    style={{ marginBottom: props.tilesize * 0.1 }}
                    color="success"
                    value={p.currentHP}
                    max={p.stats.hp}
                  >
                    {p.currentHP}/{p.stats.hp}
                  </Progress>
                  <Progress
                    style={{ marginBottom: props.tilesize * 0.1 }}
                    color="primary"
                    value={p.exp - Math.pow(Math.floor(Math.cbrt(p.exp)), 3)}
                    max={
                      Math.pow(Math.floor(Math.cbrt(p.exp)) + 1, 3) -
                      Math.pow(Math.floor(Math.cbrt(p.exp)), 3)
                    }
                  >
                    {
                      //current XP-previous Level XP / next lvl xp-previous lvl xp
                      Math.floor(
                        ((p.exp - Math.pow(Math.floor(Math.cbrt(p.exp)), 3)) /
                          (Math.pow(Math.floor(Math.cbrt(p.exp)) + 1, 3) -
                            Math.pow(Math.floor(Math.cbrt(p.exp)), 3))) *
                          100,
                        2
                      )
                    }
                    %
                  </Progress>
                </div>

                <h6>
                  Type:{p.type}
                  {p.hasOwnProperty("type2") ? "/" + p.type2 : ""}
                </h6>
                {p.hasOwnProperty("held") ? (
                  <>
                    <h6>Item:{p.held.name}</h6>
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/items/${p.held.sprite}.png`}
                      alt="put"
                      style={{
                        marginRight: 2,
                        marginLeft: 2,
                        height: props.tilesize,
                        width: props.tilesize,
                      }}
                    />
                  </>
                ) : (
                  ""
                )}
                <h6>
                  evolves{" "}
                  {typeof p.evo === "number"
                    ? "at LVL " + p.evo
                    : "by " + p.evo}
                </h6>
              </Col>
              <Col style={columnstyle} xs="6">
                <img
                  src={`${process.env.PUBLIC_URL}/assets/pokemon/${p.name}.png`}
                  alt="put"
                  style={{
                    top: 0,
                    width: tilesize * 5,
                    height: tilesize * 5,
                    border: "solid",
                    borderWidth: "1px",
                    borderRadius: 4,
                    margin: 5,
                    marginLeft: tilesize,
                  }}
                />
              </Col>
              <Col style={columnstyle} xs="6">
                <Row>
                  <Col>
                    <h5>HP:{p.stats.hp}</h5>
                    <h5>ATK:{p.stats.atk}</h5>
                    <h5>DEF:{p.stats.def}</h5>
                  </Col>
                  <Col>
                    <h5>SP.D:{p.stats.spd}</h5>
                    <h5>SP.A:{p.stats.spa}</h5>
                    <h5>SPEED:{p.stats.speed}</h5>
                  </Col>
                </Row>
              </Col>
              <Col style={columnstyle} xs="6">
                <h5>{p.ability.name}</h5>
                <p>{p.ability.description}</p>
              </Col>
            </Row>
          )}
        </Container>
      </div>
    </div>
  );
};
export default IndividualScreen;
