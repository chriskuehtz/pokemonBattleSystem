import React, { useState } from "react";
import { Button, Card } from "reactstrap";
import logo from "./logo.svg";
import "./App.css";
import FightScreen from "./Fightscreen/Fightscreen.js";
import opponents from "./data/opponents.json";
import pokedex from "./data/pokedex.json";
import moves from "./data/moves.json";

const App = () => {
  //state hooks:
  const [fightScreen, setFightScreen] = useState(false);
  const [congrats, setCongrats] = useState(false);
  const [teamCreated, setTeamCreated] = useState(false);
  const [player, setPlayer] = useState({
    name: "Chris",
    id: "42486",
    money: 42001,
    badges: ["Rock Badge"],
    playerUrl: `${process.env.PUBLIC_URL}/assets/objects/HGSS_018.10.png`,
  });
  const [opponent, setOpponent] = useState({
    name: "Tom",
    class: "Hiker",
    rewardMoney: 1000,
    trainerInventory: [],
  });
  const [team, setTeam] = useState([
    {
      name: "Caterpie",
      exp: 342,
      status: "poisoned",
      iv: { hp: 24, atk: 13, def: 16, spa: 19, spd: 27, speed: 31 },
      ev: { hp: 255, atk: 255, def: 255, spa: 0, spd: 0, speed: 0 },
      buffs: {
        atk: { u: 2, d: 2 },
        def: { u: 2, d: 2 },
        spa: { u: 2, d: 2 },
        spd: { u: 2, d: 2 },
        speed: { u: 2, d: 2 },
        accu: { u: 2, d: 2 },
        eva: { u: 2, d: 2 },
      },

      moves: [
        {
          name: "Headbutt",
          type: "normal",
          power: 70,
          otherEffect: { effect: "flinch", chance: 0.3 },
          movetype: "phys",
          pp: 15,
          maxpp: 15,
          accuracy: 100,
          speed: 1,
        },
        {
          name: "Bite",
          type: "dark",
          power: 60,
          otherEffect: { effect: "flinch", chance: 0.3 },
          movetype: "phys",
          pp: 25,
          maxpp: 25,
          accuracy: 100,
          speed: 1,
        },
        {
          name: "Bug Bite",
          type: "bug",
          power: 60,
          movetype: "phys",
          pp: 20,
          maxpp: 20,
          accuracy: 100,
          speed: 1,
        },
        {
          name: "Rapid Spin",
          type: "normal",
          power: 50,
          statChange: {
            stats: ["speed"],
            target: "self",
            factor: 1,
            chance: 1,
          },
          movetype: "phys",
          pp: 40,
          maxpp: 40,
          accuracy: 100,
          speed: 1,
        },
      ],
      ability: {
        name: "Pick Up",
        description: "can pick up item after battle",
      },
      trainer: "player",
    },
    {
      name: "Squirtle",
      exp: 342,
      status: "normal",
      iv: { hp: 24, atk: 13, def: 16, spa: 19, spd: 27, speed: 31 },
      ev: { hp: 255, atk: 255, def: 255, spa: 0, spd: 0, speed: 0 },
      buffs: {
        atk: { u: 2, d: 2 },
        def: { u: 2, d: 2 },
        spa: { u: 2, d: 2 },
        spd: { u: 2, d: 2 },
        speed: { u: 2, d: 2 },
        accu: { u: 2, d: 2 },
        eva: { u: 2, d: 2 },
      },

      moves: [
        {
          name: "Headbutt",
          type: "normal",
          power: 70,
          otherEffect: { effect: "flinch", chance: 0.3 },
          movetype: "phys",
          pp: 15,
          maxpp: 15,
          accuracy: 100,
          speed: 1,
        },
        {
          name: "Bite",
          type: "dark",
          power: 60,
          otherEffect: { effect: "flinch", chance: 0.3 },
          movetype: "phys",
          pp: 25,
          maxpp: 25,
          accuracy: 100,
          speed: 1,
        },
        {
          name: "Bug Bite",
          type: "bug",
          power: 60,
          movetype: "phys",
          pp: 20,
          maxpp: 20,
          accuracy: 100,
          speed: 1,
        },
        {
          name: "Rapid Spin",
          type: "normal",
          power: 50,
          statChange: {
            stats: ["speed"],
            target: "self",
            factor: 1,
            chance: 1,
          },
          movetype: "phys",
          pp: 40,
          maxpp: 40,
          accuracy: 100,
          speed: 1,
        },
      ],
      ability: {
        name: "Pick Up",
        description: "can pick up item after battle",
      },
      trainer: "player",
    },
  ]);
  const [enemyTeam, setEnemyTeam] = useState([
    {
      id: 0,
      pokemon: "Metapod",
      lvl: 8,
    },
    {
      id: 1,
      pokemon: "",
      lvl: 1,
    },
    {
      id: 2,
      pokemon: "",
      lvl: 1,
    },
    {
      id: 3,
      pokemon: "",
      lvl: 1,
    },
    {
      id: 4,
      pokemon: "",
      lvl: 1,
    },
    {
      id: 5,
      pokemon: "",
      lvl: 1,
    },
  ]);
  const [bag, setBag] = useState([
    {
      name: "Potion",
      sprite: "potion",
      price: "300",
      heal: 20,
      hold: false,
      description: "heals by 20 HP",
      category: "Heal Items",
      amount: 2,
    },
    {
      name: "Antidote",
      sprite: "antidote",
      price: "100",
      statusheal: "poisoned",
      description: "heals poisoning",
      hold: false,
      category: "Heal Items",
      amount: 1,
    },
    {
      name: "Para Heal",
      sprite: "paralyze-heal",
      price: "100",
      statusheal: "paralyzed",
      description: "heals paralysis",
      hold: false,
      category: "Heal Items",
      amount: 1,
    },
  ]);
  //methods:

  const makerandomTeams = () => {
    setTeamCreated(true);
    let dex = Object.entries(pokedex);
    const randomNumber = (l) => {
      let n = Math.round(Math.random() * l);
      if (n !== 0) {
        n -= 1;
      }
      return n;
    };
    let op = {
      class: opponents.classes[randomNumber(opponents.classes.length)],
      name: opponents.names[randomNumber(opponents.names.length)],
      rewardMoney: 1000,
      trainerInventory: [],
    };

    const teamMember = () => {
      let p = dex[randomNumber(dex.length)][1];
      let mon = {
        name: p.name,
        type: p.type,
        spriteId: p.spriteId,
        exp: 125000,
        status: "normal",
        lvl: 50,
        buffs: {
          atk: { u: 2, d: 2 },
          def: { u: 2, d: 2 },
          spa: { u: 2, d: 2 },
          spd: { u: 2, d: 2 },
          speed: { u: 2, d: 2 },
          accu: { u: 2, d: 2 },
          eva: { u: 2, d: 2 },
        },
        stats: {},
        moves: [],
        ability: {
          name: "Pick Up",
          description: "can pick up item after battle",
        },
        trainer: "player",
      };
      if (p.hasOwnProperty("type2")) {
        mon.type2 = p.type2;
      }
      //stats:
      mon.stats.hp = Math.round(
        mon.lvl +
          10 +
          ((2 * p.baseStats.hp + Math.random() * 31) * mon.lvl) / 100
      );
      mon.currentHP = mon.stats.hp;
      mon.stats.atk = Math.round(
        5 + ((2 * p.baseStats.atk + Math.random() * 31) * mon.lvl) / 100
      );
      mon.stats.def = Math.round(
        5 + ((2 * p.baseStats.def + Math.random() * 31) * mon.lvl) / 100
      );
      mon.stats.spa = Math.round(
        5 + ((2 * p.baseStats.spa + Math.random() * 31) * mon.lvl) / 100
      );
      mon.stats.spd = Math.round(
        5 + ((2 * p.baseStats.spd + Math.random() * 31) * mon.lvl) / 100
      );
      mon.stats.speed = Math.round(
        5 + ((2 * p.baseStats.speed + Math.random() * 31) * mon.lvl) / 100
      );
      //moves:
      let tempset = p.moveset.filter((m) => m.lvl <= mon.lvl);
      console.log(tempset);
      let moveset = [];
      tempset.forEach((m) => {
        if (moveset.map((move) => move.move).includes(m.name) === false) {
          moveset.push(m);
          console.log(moveset);
        }
      });

      if (moveset.length > 4) {
        moveset = moveset.slice(-4);
        console.log(moveset);
      }
      moveset.map((m) => {
        mon.moves.push(moves[m.move]);
      });
      return mon;
    };
    let team = [teamMember(), teamMember(), teamMember()];
    const enemyTeamMember = () => {
      return {
        pokemon: dex[randomNumber(dex.length)][1].name,
        lvl: 50,
      };
    };
    let enemyTeam = [enemyTeamMember(), enemyTeamMember(), enemyTeamMember()];
    console.log(team);
    console.log(enemyTeam);
    console.log(op);
    setOpponent(op);
    setEnemyTeam(enemyTeam);
    setTeam(team);
    return;
  };
  const updateBag = (x) => {
    console.log(x); //{item:"",amount:""}
    if (x.hasOwnProperty("item") === false) {
      return;
    } else {
      let backpack = Object.assign(bag);
      if (backpack.filter((b) => b.name === x.item.name).length > 0) {
        backpack.filter((b) => b.name === x.item.name)[0].amount += x.amount;
      } else {
        let temp = x.item;
        temp.amount = x.amount;
        backpack.push(temp);
      }
      backpack = backpack.filter((b) => b.amount > 0);
      console.log(backpack);
      setBag(backpack);
    }
  };
  const reorderTeam = (pokemon, newPos, oldPos) => {
    console.log(pokemon.name, newPos, oldPos);
    let temp = [].concat(team);

    const switched = Object.assign(temp[newPos]);

    temp[newPos] = Object.assign(pokemon);
    temp.splice(oldPos, 1, switched);

    setTeam(temp);
  };
  //styles:
  const fullscreen = {
    position: "absolute",
    top: 0,
    left: 0,
    minHeight: "100vh",
    heigth: "100%",
    width: "100vw",
    backgroundColor: "#95ADBE",
  };
  //components:
  const showFightScreen = () => {
    if (fightScreen === true) {
      if (teamCreated === false) {
        makerandomTeams();
      }

      return (
        <FightScreen
          closeFight={() => {
            setFightScreen(false);
            setCongrats(true);
            setTeamCreated(false);
          }}
          opponent={opponent}
          team={team}
          player={player}
          enemyTeam={enemyTeam}
          bag={bag}
          updateBag={(stuff) => updateBag(stuff)}
          reorderTeam={(p, n, o) => reorderTeam(p, n, o)}
          weather={{ weather: "", counter: 100000, msg: "no weather" }}
          z={1}
          interval={100}
          tilesize={window.innerHeight / 11}
        />
      );
    }
  };

  return (
    <div className="App" style={fullscreen}>
      <Card style={{ marginTop: "10%", width: "90%", marginLeft: "5%" }}>
        <div
          style={{
            marginLeft: "10%",
            paddingTop: "10%",
            paddingBottom: "10%",
            width: "80%",
          }}
        >
          <h1>Pokemon Battle System</h1>
          <p>
            This battle simulator will become part of an online multiplayer
            Pokemon game written in Javascript and React{" "}
          </p>
          <p>
            The Layout is completely responsive and designed for
            mobile(landscape mode) first.
          </p>
          <p>
            For now, there are only 12 Pokemon, but more will follow over time.
            Implementing all kinds of unique attacks( e.g. Solar Beam, which
            takes two turns), takes a lot of time and custom code instead of
            just damage=attack-defense
          </p>
          <p>
            <h5>
              Check out the code on Github:
              <a href="https://github.com/chriskuehtz/pokemonBattleSystem">
                {" "}
                GitHub
              </a>
            </h5>
            There is a non game-breaking bug with the Power Points of attacks, I
            am working on it.
          </p>
          <p>
            For now, you can try Quick Battles, where you battle an AI opponent
            in a 3v3 battle.
          </p>

          <Button
            style={{ width: "100%" }}
            color="danger"
            onClick={() => {
              setFightScreen(true);
              setCongrats(false);
            }}
          >
            {congrats ? "Play Again" : "Quick Battle"}
          </Button>
          <p>Pokemon is a trademark of Nintendo</p>
        </div>
      </Card>

      {showFightScreen()}
    </div>
  );
};

export default App;
