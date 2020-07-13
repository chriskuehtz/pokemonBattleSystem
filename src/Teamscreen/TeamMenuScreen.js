import React, { useState } from "react";
import IndividualScreen from "./IndividualScreen.js";
import ControlButtons from "../UsefulComponents/ControlButtons";
import { Button } from "reactstrap";
import items from "../data/items.json";
const TeamMenuScreen = (props) => {
  const [highlight, setHighlight] = useState(0);
  const [itemHighlight, setItemHighlight] = useState(0);
  const [clicked, setClicked] = useState(false);
  const fieldOptions = ["Switch", "Summary", "Take Item", "Give Item"];
  const fightOptions = ["Switch", "Summary"];
  const options = props.sit === "field" ? fieldOptions : fightOptions;
  const tilesize = props.tilesize;
  const buttonStyle = {
    minWidth: "100%",
    borderRadius: 0,
    height: tilesize * 1.5,
  };

  const handleHighlight = (x) => {
    if (highlight + x < 0) {
      return;
    } else if (highlight + x >= options.length) {
      return;
    } else {
      setHighlight(highlight + x);
    }
  };

  const showHighlight = () => {
    if (clicked == true) {
      if (highlight === 0) {
        //Switch screen
        props.sit === "field" ? props.setshowPos(true) : props.switchIn();
        return (
          <ControlButtons
            UpFunction={() => props.switchUp()}
            DownFunction={() => props.switchDown()}
            LeftFunction={() => props.switchLeft()}
            RightFunction={() => props.switchRight()}
            AFunction={() => props.reorderTeam()}
            BFunction={() => setClicked(false)}
            StartFunction={() => {
              console.log("unassigned");
            }}
            SelectFunction={() => {
              console.log("unassigned");
            }}
            tilesize={tilesize}
          />
        );
      } else if (highlight === 1) {
        //Individual pokemon view
        return (
          <IndividualScreen
            p={props.p}
            closeIndiv={() => props.closeIndiv()}
            next={() => props.next()}
            prev={() => props.prev()}
            z={props.z + 1}
            tilesize={tilesize}
          />
        );
      } else if (highlight === 2) {
        console.log("takeItem");
        //Take Item
        props.closeTeamMenu();
        props.takeItem(props.highlight);
      } else if (highlight === 3) {
        console.log("giveItem");
        //Give Item
        let filteredItems = props.bag.filter((item) => item.hold === true);
        const handleItemHighlight = (x) => {
          if (itemHighlight + x < 0) {
            return;
          } else if (
            itemHighlight + x >=
            filteredItems.filter((item) =>
              props.bag.map((b) => b.name).includes(item.name)
            ).length
          ) {
            return;
          } else {
            setItemHighlight(itemHighlight + x);
          }
        };
        const giveItem = () => {
          let item = filteredItems[itemHighlight];
          props.giveItem(props.highlight, item);
          setClicked(false);
        };
        return (
          <div>
            <ControlButtons
              UpFunction={() => handleItemHighlight(-1)}
              DownFunction={() => handleItemHighlight(1)}
              LeftFunction={() => {
                console.log("unassigned");
              }}
              RightFunction={() => {
                console.log("unassigned");
              }}
              AFunction={() => giveItem()}
              BFunction={() => setClicked(false)}
              StartFunction={() => {
                console.log("unassigned");
              }}
              SelectFunction={() => {
                console.log("unassigned");
              }}
              tilesize={tilesize}
            />
            <div
              style={{
                zIndex: props.z,
                position: "absolute",
                bottom: 0,
                left: tilesize * 5,
                width: tilesize * 5,
                height: tilesize * 11,
                backgroundColor: "white",
                border: "solid",
                borderColor: "blue",
                borderWidth: 0,
              }}
            >
              {filteredItems
                .filter((item) =>
                  props.bag.map((b) => b.name).includes(item.name)
                )
                .map((item, i) =>
                  i === itemHighlight ? (
                    <p style={{ border: "solid", borderWidth: 1 }}>
                      {item.name}
                    </p>
                  ) : (
                    <p>{item.name}</p>
                  )
                )}
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div>
      {clicked === false ? (
        <ControlButtons
          UpFunction={() => handleHighlight(-1)}
          DownFunction={() => handleHighlight(1)}
          LeftFunction={() => {
            console.log("unassigned");
          }}
          RightFunction={() => {
            console.log("unassigned");
          }}
          AFunction={() => setClicked(true)}
          BFunction={() => props.closeTeamMenu()}
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
      {showHighlight()}
      <div
        style={{
          zIndex: props.z,
          position: "absolute",
          bottom: 0,
          right: 0,
          width: tilesize * 5,
          height: tilesize * 6,
          backgroundColor: "white",
          border: "solid",
          borderColor: "blue",
          borderWidth: 0,
        }}
      >
        {options.map((o, i) =>
          i === highlight ? (
            <Button color="dark" style={buttonStyle}>
              <h4>{o}</h4>
            </Button>
          ) : (
            <Button color="dark" style={buttonStyle} outline>
              <h4>{o}</h4>
            </Button>
          )
        )}
      </div>
    </div>
  );
};
export default TeamMenuScreen;
