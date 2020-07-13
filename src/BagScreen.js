/**/
import React, { useState } from "react";
import { ButtonGroup, Button, Container, Col, Row } from "reactstrap";
import ControlButtons from "./UsefulComponents/ControlButtons";
import TeamScreen from "./Teamscreen/TeamScreen";

function BagScreen(props) {
  const [items, setItems] = useState(props.bag);
  const [highlight, setHighlight] = useState(0);
  const [menuHighlight, setMenuHighlight] = useState(0);
  const [menuClick, setMenuClick] = useState(0);
  const [clicked, setClicked] = useState(false);
  const [categoryMark, setCategoryMark] = useState(0);
  const categories = [
    "Heal Items",
    "Pokeballs",
    "Hold Items",
    "TM's",
    "Key Items",
  ];

  let tempBag = [];
  if (
    items.filter((i) => i.amount > 0 && i.category === categories[categoryMark])
      .length <= 6
  ) {
    tempBag = items.filter(
      (i) => i.amount > 0 && i.category === categories[categoryMark]
    );
  } else if (
    highlight >
    items.filter((i) => i.amount > 0 && i.category === categories[categoryMark])
      .length -
      6
  ) {
    tempBag = items
      .filter((i) => i.amount > 0 && i.category === categories[categoryMark])
      .slice(-6);
  } else {
    tempBag = items
      .filter((i) => i.amount > 0 && i.category === categories[categoryMark])
      .slice(highlight, highlight + 6);
  }

  const handleHighlight = (x) => {
    if (x === 1 && highlight < tempBag.length - 1) {
      let temp = highlight + 1;
      setHighlight(temp);
    } else if (x === -1 && highlight > 0) {
      let temp = highlight - 1;
      setHighlight(temp);
    } else {
      console.log("what the fuck");
    }
  };
  const applyItem = (p, h, h2, i) => {
    props.reorderTeam(p, h, h2);
    if (i.amount === 1 && props.sit === "field") {
      setClicked(false);
    } else if (props.sit === "fight") {
      setClicked(false);
      props.handleItem({ name: i.name, movetype: "item", speed: 10000 });
    }
    props.updateBag({ item: i, amount: -1 });
  };
  const handleMenuClick = () => {
    console.log("handleMenuClick");
    if (menuClick === true) {
      if (
        tempBag[highlight].category === "Heal Items" &&
        props.sit !== "market"
      ) {
        return (
          <TeamScreen
            closeTeam={() => setClicked(false)}
            applyItem={(p, h, h2, i) => applyItem(p, h, h2, i)}
            updateBag={(stuff) => props.updateBag(stuff)}
            updateHeldItem={(n, item) => props.updateHeldItem(n, item)}
            sit="bag"
            team={props.team}
            bag={items}
            item={tempBag[highlight]}
            z={props.z + 1}
            tilesize={props.tilesize}
          />
        );
      } else if (props.sit === "fight") {
        if (
          props.opponent === "wild" &&
          tempBag[highlight].category === "Pokeballs"
        ) {
          setMenuClick(false);
          setClicked(false);
          props.handleItem({
            name: tempBag[highlight].name,
            item: tempBag[highlight],
            movetype: "ball",
            catchrate: tempBag[highlight].catchrate,
            speed: 10000,
          });
          return;
        }
      } else if (
        props.sit === "market" &&
        tempBag[highlight].category !== "Key Items"
      ) {
        const item = tempBag[highlight];
        if (menuHighlight === 0) {
          console.log("sell one");
          props.updateBag({ item: item, amount: -1 });
          props.updateMoney(item.price / 2);
          setMenuClick(false);
          return;
        } else if (menuHighlight === 1) {
          console.log("sell all");
          props.updateBag({
            item: item,
            amount: -item.amount,
          });
          props.updateMoney((item.amount * item.price) / 2);
          setMenuClick(false);
          return;
        }
      } else {
        setMenuClick(false);
        setClicked(false);
      }
    }
  };
  const menu = () => {
    const handleMenuHighlight = (x) => {
      if (x === 1 && menuHighlight < options.length - 1) {
        let temp = menuHighlight + 1;
        setMenuHighlight(temp);
      } else if (x === -1 && menuHighlight > 0) {
        let temp = menuHighlight - 1;
        setMenuHighlight(temp);
      } else {
        console.log("what the fuck");
      }
    };

    let options = [];
    if (props.sit === "field") {
      options = ["use", "give"];
    } else if (props.sit === "fight") {
      options = ["use"];
    } else if (props.sit === "market") {
      options = ["sell", "sell all"];
    }

    return (
      <div>
        <ControlButtons
          UpFunction={() => handleMenuHighlight(-1)}
          DownFunction={() => handleMenuHighlight(1)}
          LeftFunction={() => {
            console.log("unassigned");
          }}
          RightFunction={() => {
            console.log("unassigned");
          }}
          AFunction={() => setMenuClick(true)}
          BFunction={() => setClicked(false)}
          StartFunction={() => {
            console.log("unassigned");
          }}
          SelectFunction={() => {
            console.log("unassigned");
          }}
          tilesize={props.tilesize}
        />
        <div
          style={{
            zIndex: props.z + 1,
            position: "absolute",
            width: props.tilesize * 4,
            bottom: 0,
            right: 0,
            backgroundColor: "white",
          }}
        >
          {options.map((o, i) => (
            <Button
              outline={menuHighlight !== i}
              color="dark"
              style={{ width: "100%", height: props.tilesize * 2 }}
            >
              {menuHighlight === i ? <h1>{o}</h1> : <h2>{o}</h2>}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div
        style={{
          zIndex: props.z,
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "white",
        }}
      >
        {clicked ? (
          menuClick ? (
            handleMenuClick()
          ) : (
            menu()
          )
        ) : (
          <ControlButtons
            UpFunction={() => handleHighlight(-1)}
            DownFunction={() => handleHighlight(1)}
            LeftFunction={() => {
              setHighlight(0);
              if (categoryMark === 0) {
                setCategoryMark(categories.length - 1);
              } else {
                setCategoryMark(categoryMark - 1);
              }
            }}
            RightFunction={() => {
              setHighlight(0);
              if (categoryMark === categories.length - 1) {
                setCategoryMark(0);
              } else {
                setCategoryMark(categoryMark + 1);
              }
            }}
            AFunction={() => {
              setClicked(true);
            }}
            BFunction={() => props.closeBag()}
            StartFunction={() => {
              console.log("unassigned");
            }}
            SelectFunction={() => {
              console.log("unassigned");
            }}
            tilesize={props.tilesize}
          />
        )}
        <Container fluid>
          <Row>
            <Col xs="12">
              <Button
                style={{
                  width: "100%",
                  height: props.tilesize * 2,
                }}
                color="dark"
                outline
              >
                <h1>{categories[categoryMark]}</h1>
              </Button>
            </Col>
            <Col xs="8">
              <Row>
                {tempBag.map((item, i) => (
                  <Col xs="12">
                    <ButtonGroup
                      style={{
                        width: "100%",
                      }}
                    >
                      <Button
                        color={i === highlight ? "success" : "dark"}
                        style={{
                          maxWidth: "25%",
                          height: props.tilesize * 1.5,
                        }}
                        outline
                      >
                        <img
                          src={`${process.env.PUBLIC_URL}/assets/items/${item.sprite}.png`}
                          alt="put"
                          style={{
                            height: props.tilesize,
                            width: props.tilesize,
                          }}
                        />
                      </Button>
                      <Button
                        color={i === highlight ? "success" : "dark"}
                        style={{
                          minWidth: "50%",
                          height: props.tilesize * 1.5,
                        }}
                        outline
                      >
                        {i === highlight ? (
                          <h4>{item.name}</h4>
                        ) : (
                          <h5>{item.name}</h5>
                        )}
                        {props.sit === "market" ? (
                          <h4>{item.price / 2}</h4>
                        ) : (
                          ""
                        )}
                      </Button>
                      <Button
                        color={i === highlight ? "success" : "dark"}
                        style={{ height: props.tilesize * 1.5 }}
                        outline
                      >
                        {item.amount}
                      </Button>
                    </ButtonGroup>
                  </Col>
                ))}
              </Row>
            </Col>
            <Col xs="4">
              {highlight === -1 ? (
                ""
              ) : (
                <div>
                  {props.sit === "market" ? <h2>${props.money}</h2> : ""}
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/items/${tempBag[highlight].sprite}.png`}
                    alt="put"
                    style={{
                      height: "100%",
                      width: "100%",
                    }}
                  />
                  <Button color="dark" outline style={{ width: "100%" }}>
                    {" "}
                    <h2>{tempBag[highlight].description}</h2>
                  </Button>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}
export default BagScreen;
