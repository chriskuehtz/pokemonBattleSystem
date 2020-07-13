import React, { useState } from "react";
import { Button, Container, Row, Col } from "reactstrap";
import ControlButtons from "../UsefulComponents/ControlButtons";
import BagScreen from "../BagScreen";
import TeamScreen from "../Teamscreen/TeamScreen";
import AttackBox from "./AttackBox";
const MenuBox = (props) => {
  const [highlight, setHighlight] = useState(0);
  const [clicked, setClicked] = useState(false);
  const options = [
    { text: "ATTACK", color: "#D81159" },
    { text: "BAG", color: "#119DA4" },
    { text: "SWITCH", color: "#FBB13C" },
    { text: "RUN", color: "#080926" },
  ];

  const handleHighlight = (x) => {
    if (highlight + x < 0) {
      return;
    } else if (highlight + x >= 4) {
      return;
    } else {
      setHighlight(highlight + x);
    }
  };
  const calculateRound = (a) => {
    setClicked(false);
    props.calculateRound(a);
  };
  const setInfo = (a) => {
    setClicked(false);
    props.setInfo(a);
  };
  const clickOnHighlight = () => {
    if (clicked == true) {
      if (highlight === 0) {
        //Attacks
        return (
          <AttackBox
            active={props.active}
            team={props.team}
            enemyTeam={props.enemyTeam}
            lastmove={props.lastmove}
            z={props.z + 1}
            closeAttackBox={() => setClicked(false)}
            decideEnemyMove={(t1, t2, a1, h) =>
              props.decideEnemyMove(t1, t2, a1, h)
            }
            playerTwoTurnAttack={props.playerTwoTurnAttack}
            setInfo={(a) => setInfo(a)}
            tilesize={props.tilesize}
          />
        );
      }
      if (highlight === 1) {
        //Bag
        return (
          <BagScreen
            team={props.team}
            sit="fight"
            opponent={props.opponent}
            bag={props.bag}
            z={props.z + 1}
            closeBag={() => setClicked(false)}
            handleItem={(a) =>
              props.decideEnemyMove(props.team, props.enemyTeam, a)
            }
            updateBag={(stuff) => props.updateBag(stuff)}
            reorderTeam={(p, n, o) => props.reorderTeam(p, n, o)}
            tilesize={props.tilesize}
          />
        );
      }
      if (highlight === 2) {
        //Team
        return (
          <TeamScreen
            team={props.team}
            sit="fight"
            z={props.z + 1}
            closeTeam={() => setClicked(false)}
            switchIn={(a) =>
              props.decideEnemyMove(props.team, props.enemyTeam, a)
            }
            tilesize={props.tilesize}
          />
        );
      }
      if (highlight === 3) {
        //Run away
        props.decideEnemyMove(props.team, props.enemyTeam, {
          name: "run",
          speed: 100000,
        });
      }
    }
  };
  return (
    <div>
      {/*console.log("menubox rendered")*/}
      {!clicked ? (
        <div>
          <div //Log and Menu Box
            style={{
              zIndex: props.z,
              position: "absolute",
              top: props.tilesize * 8,
              left: 0,
              width: "100%",
              height: props.tilesize * 3,
              backgroundColor: "white",
            }}
          >
            <ControlButtons
              UpFunction={() => handleHighlight(-2)}
              DownFunction={() => handleHighlight(2)}
              LeftFunction={() => handleHighlight(-1)}
              RightFunction={() => handleHighlight(1)}
              AFunction={() => setClicked(true)}
              BFunction={() => {
                console.log("unassigned");
              }}
              StartFunction={() => {
                console.log("unassigned");
              }}
              SelectFunction={() => props.closeFight()}
              tilesize={props.tilesize}
            />
            <div
              Menu
              Box
              style={{
                zIndex: props.z,
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                backgroundColor: "white",
              }}
            >
              <Container fluid>
                <Row noGutters>
                  {options.map((o, i) =>
                    i === highlight ? (
                      <Col xs="6">
                        <div
                          style={{
                            backgroundColor: o.color,
                            color: "white",
                            minWidth: "100%",
                            height: props.tilesize * 1.5,
                            lineHeight: props.tilesize * 1.5,
                            textAlign: "center",
                            border: "solid",
                            borderWidth: 1,
                            borderRadius: 3,
                          }}
                        >
                          <h1>{o.text}</h1>
                        </div>
                      </Col>
                    ) : (
                      <Col xs="6">
                        <div
                          outline
                          style={{
                            color: o.color,
                            minWidth: "100%",
                            height: props.tilesize * 1.5,

                            border: "solid",
                            borderWidth: 1,
                            borderRadius: 3,
                            textAlign: "center",
                          }}
                        >
                          <h2>{o.text}</h2>
                        </div>
                      </Col>
                    )
                  )}
                </Row>
              </Container>
            </div>
          </div>
        </div>
      ) : (
        clickOnHighlight()
      )}
    </div>
  );
};

export default MenuBox;
