/**/
import React, { useState, useEffect } from "react";
import { Button, Progress, Row, Col } from "reactstrap";
import ControlButtons from "../UsefulComponents/ControlButtons";
import StatusButton from "../UsefulComponents/StatusButton";
import TeamMenuScreen from "./TeamMenuScreen.js";
import types from "../data/types.json";
import dex from "../data/pokedex.json";
import moves from "../data/moves.json";
function TeamScreen(props) {
  const [highlight, setHighlight] = useState(0);
  const [clicked, setClicked] = useState(false);
  const [pos, setPos] = useState(0);
  const [showPos, setshowPos] = useState(false);
  const [warning, setWarning] = useState("");
  const [team, setTeam] = useState([]);
  const tilesize = props.tilesize;

  const handleHighlight = (x) => {
    setWarning("");
    if (highlight + x < 0) {
      return;
    } else if (
      highlight + x >=
      props.team.filter((p) => p.hasOwnProperty("name")).length
    ) {
      return;
    } else {
      setHighlight(highlight + x);
    }
  };
  const updateStats = (p) => {
    const dexEntry = dex[p.name];
    const lvl = Math.floor(Math.cbrt(p.exp));
    let stats = {};
    stats.hp = Math.round(
      lvl +
        10 +
        ((2 * dexEntry.baseStats.hp + p.iv.hp + p.ev.hp / 4) * lvl) / 100
    );
    stats.atk = Math.round(
      5 + ((2 * dexEntry.baseStats.atk + p.iv.atk + p.ev.atk / 4) * lvl) / 100
    );
    stats.def = Math.round(
      5 + ((2 * dexEntry.baseStats.def + p.iv.def + p.ev.def / 4) * lvl) / 100
    );
    stats.spa = Math.round(
      5 + ((2 * dexEntry.baseStats.spa + p.iv.spa + p.ev.spa / 4) * lvl) / 100
    );
    stats.spd = Math.round(
      5 + ((2 * dexEntry.baseStats.spd + p.iv.spd + p.ev.spd / 4) * lvl) / 100
    );
    stats.speed = Math.round(
      5 +
        ((2 * dexEntry.baseStats.speed + p.iv.speed + p.ev.speed / 4) * lvl) /
          100
    );
    return stats;
  };
  useEffect(() => {
    const makeData = (pokemonArray) => {
      console.log("makePlayerData");

      //gets the move data for the players team
      pokemonArray.map((p) => {
        if (p.hasOwnProperty("loaded") === false) {
          const dexEntry = dex[p.name];
          p.loaded = true;
          p.foughtAgainst = [];
          p.evo = dexEntry.evo;
          p.into = dexEntry.into;
          p.spriteId = dexEntry.spriteId;
          p.type = dexEntry.type;
          if (dexEntry.hasOwnProperty("type2")) {
            p.type2 = dexEntry.type2;
          }
          p.stats = updateStats(p);
          if (p.hasOwnProperty("currentHP") === false) {
            p.currentHP = p.stats.hp;
          }
        }
      });
      setTeam(pokemonArray);
    };

    makeData(props.team);
  }, []);
  const handlePos = (x) => {
    if (pos + x < 0) {
      return;
    } else if (
      pos + x >=
      props.team.filter((p) => p.hasOwnProperty("name")).length
    ) {
      return;
    } else {
      console.log("pos set to:", pos + x);

      setPos(pos + x);
    }
  };
  const reorderTeam = () => {
    console.log("reorderTeam");
    props.reorderTeam(props.team[highlight], pos, highlight);
    setHighlight(pos);
    setPos(0);
    setshowPos(false);
    setClicked(false);
  };
  const switchIn = () => {
    console.log("switchIn");
    if (props.team[highlight].currentHP > 0 && highlight !== 0) {
      props.switchIn({
        name: "switch",
        speed: 10000,
        p: props.team[highlight],
        i: highlight,
      });
      props.closeTeam();
      return;
    } else {
      setshowPos(false);
      setClicked(false);
      setWarning(props.team[highlight].name + " is not prepared to battle");
    }
  };
  const applyItem = () => {
    console.log(props.item);
    console.log(props.team[highlight]);
    let item = props.item;
    let p = props.team[highlight];
    if (item.hasOwnProperty("heal") && p.currentHP < p.stats.hp) {
      console.log("healing");
      p.currentHP =
        p.currentHP + item.heal > p.stats.hp
          ? p.stats.hp
          : p.currentHP + item.heal;
      props.applyItem(p, highlight, highlight, item);
    }
    if (item.hasOwnProperty("statusheal") && p.status === item.statusheal) {
      p.status = "normal";
      props.applyItem(p, highlight, highlight, item);
      props.closeTeam();
    } else {
      setWarning("It wont have any effect");
    }
  };
  const showMenuScreen = () => {
    if (clicked == true) {
      return (
        <TeamMenuScreen
          p={props.team[highlight]}
          highlight={highlight}
          pos={pos}
          sit={props.sit}
          bag={props.bag}
          switchUp={() => handlePos(-2)}
          switchDown={() => handlePos(2)}
          switchLeft={() => handlePos(-1)}
          switchRight={() => handlePos(1)}
          next={() => handleHighlight(1)}
          prev={() => handleHighlight(-1)}
          setshowPos={(x) => setshowPos(x)}
          closeIndiv={() => setClicked(false)}
          closeTeamMenu={() => setClicked(false)}
          reorderTeam={() => reorderTeam()}
          switchIn={() => switchIn()}
          updateBag={(stuff) => props.updateBag(stuff)}
          giveItem={(n, item) => props.giveItem(n, item)}
          takeItem={(n) => props.takeItem(n)}
          z={props.z + 2}
          tilesize={tilesize}
        />
      );
    }
  };

  return (
    <div>
      <div>
        <div
          style={{
            zIndex: props.z,
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "black",
          }}
        >
          {clicked === false ? (
            <ControlButtons
              UpFunction={() => handleHighlight(-2)}
              DownFunction={() => handleHighlight(2)}
              LeftFunction={() => handleHighlight(-1)}
              RightFunction={() => handleHighlight(1)}
              AFunction={
                props.sit === "bag" ? () => applyItem() : () => setClicked(true)
              }
              BFunction={() => props.closeTeam()}
              StartFunction={() => {
                console.log("unassigned");
              }}
              SelectFunction={() => {
                console.log("unassigned");
              }}
              tilesize={tilesize}
            />
          ) : (
            ""
          )}
          <div
            style={{
              zIndex: props.z + 2,
              position: "absolute",
              top: 0,
              left: 0,
              width: tilesize * 15,
              height: tilesize * 1,
              backgroundColor: warning === "" ? "" : "white",
              color: "red",
              fontSize: "5vh",
            }}
          >
            {warning}
          </div>
          {showMenuScreen()}
          {team
            .filter((p) => p.hasOwnProperty("name"))
            .map((p, i) => {
              const focus = `radial-gradient(
                ${types.types.filter((t) => t.name === p.type)[0].color},
                ${"black"}
              )`;
              const unfocus = `linear-gradient(
                to bottom right,
                ${types.types.filter((t) => t.name === p.type)[0].color},
                ${
                  p.hasOwnProperty("type2")
                    ? types.types.filter((t) => t.name === p.type2)[0].color
                    : "white"
                }
              )`;
              const fainted = `radial-gradient(
                ${"black"},
                ${"gray"}
              )`;
              return (
                <div
                  style={{
                    zIndex: props.z + 1,
                    position: "absolute",
                    top:
                      i === 1 || i === 3 || i === 5
                        ? (((i - 1) / 2) * tilesize * 11) / 3
                        : (parseInt(i / 2) * tilesize * 11) / 3,
                    //left: (i % 2) * tilesize * 7.5,
                    left: "" + (i % 2) * 50 + "vw",
                    width: "50vw",
                    height: (tilesize * 11) / 3,
                    backgroundImage:
                      i == highlight || (showPos === true && i === pos)
                        ? focus
                        : p.currentHP === 0
                        ? fainted
                        : unfocus,
                    color: "white",
                    border: "solid",
                    borderWidth: 1,
                    borderRadius: 3,
                  }}
                >
                  <Row>
                    <Col>
                      <h6>
                        LVL:{Math.floor(Math.cbrt(p.exp))} {p.name}
                      </h6>
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
                        value={
                          p.exp - Math.pow(Math.floor(Math.cbrt(p.exp)), 3)
                        }
                        max={
                          Math.pow(Math.floor(Math.cbrt(p.exp)) + 1, 3) -
                          Math.pow(Math.floor(Math.cbrt(p.exp)), 3)
                        }
                      />
                      {p.status !== "normal" ? (
                        <StatusButton
                          status={p.status}
                          tilesize={props.tilesize}
                          float="left"
                        />
                      ) : (
                        ""
                      )}
                      {p.hasOwnProperty("held") ? (
                        <img
                          src={`${process.env.PUBLIC_URL}/assets/items/${p.held.sprite}.png`}
                          alt="put"
                          style={{
                            filter: p.currentHP === 0 ? "grayscale(100%)" : "",
                            marginRight: 2,
                            marginLeft: 2,
                            height: props.tilesize,
                            width: props.tilesize,
                          }}
                        />
                      ) : (
                        ""
                      )}
                    </Col>
                    <Col>
                      <img
                        src={`${process.env.PUBLIC_URL}/assets/pokemon/${p.name}.png`}
                        alt="put"
                        style={{
                          filter: p.currentHP === 0 ? "grayscale(100%)" : "",
                          height: tilesize * 3,
                          width: tilesize * 3,
                          border: "solid",
                          borderWidth: "1px",
                          borderRadius: tilesize / 10,
                          margin: tilesize / 15,
                        }}
                      />
                    </Col>
                  </Row>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
export default TeamScreen;
