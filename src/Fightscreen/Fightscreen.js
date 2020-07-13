/**/
import React, { useState, useEffect } from "react";
import { Button, ButtonGroup, Progress, Container, Row, Col } from "reactstrap";
import ControlButtons from "../UsefulComponents/ControlButtons";
import StatusButton from "../UsefulComponents/StatusButton";
import MenuBox from "./MenuBox";
import TeamScreen from "../Teamscreen/TeamScreen.js";
import MoveScreen from "../Teamscreen/MoveScreen.js";
import dex from "../data/pokedex.json";
import moves from "../data/moves.json";
import calcDamage from "./utils/calcDamage.js";
import checkAttack from "./utils/canAttack.js";
import applyStatusDamage from "./utils/applyStatusDamage.js";

function FightScreen(props) {
  //Player Team:
  let t = props.team;
  const [team, setTeam] = useState(t);
  //Enemy Team:
  const opponent = props.opponent;
  let eT = props.enemyTeam.filter((e) => e.pokemon !== "");
  const [enemyTeam, setenemyTeam] = useState(eT);
  //Info state:
  const [info, setInfo] = useState({
    msg:
      opponent.class === "wild"
        ? "You encountered a wild " + opponent.name
        : opponent.class + " " + opponent.name + " wants to fight",
    next: () => {
      opponent.class === "wild"
        ? setInfo({
            msg: "Go " + team[0].name + "!",
            next: () => {
              setIntro(false);
              setInfo(null);
            },
          })
        : setInfo({
            msg:
              opponent.class +
              " " +
              opponent.name +
              " sent out " +
              eT[0].pokemon +
              ".",
            next: () =>
              setInfo({
                msg: "Go " + team[0].name + "!",
                next: () => {
                  setIntro(false);
                  setInfo(null);
                },
              }),
          });
    },
  });
  const [fainted, setFainted] = useState(false);
  const [tempAttack, setTempAttack] = useState("");
  const [playerTwoTurnAttack, setPlayerTwoTurnAttack] = useState("");
  const [enemyTwoTurnAttack, setEnemyTwoTurnAttack] = useState("");
  const [weather, setWeather] = useState(props.weather);
  const [intro, setIntro] = useState(
    props.opponent.class === "wild" ? false : true
  );
  const [moveScreen, setMoveScreen] = useState(false);
  const [lastmove, setLastMove] = useState(0);
  const [moveToLearn, setMovetoLearn] = useState(null);
  const [tempState, setTempState] = useState("");
  const [evos, setEvos] = useState([]);

  //Actions(counts if both parties have used their action):
  let count = 0;
  //React asynchronous state assignment is a dumb piece of shit
  let shakeCounter = 0;
  //used to assign pokeball sprite when catching
  let enemySprite = `${process.env.PUBLIC_URL}/assets/frontsprites/${enemyTeam[0].spriteId}.png`;

  const makeEnemyData = (pokemonArray) => {
    //receives the enemy's pokemon as {"id": 0,"pokemon": "Charmander","lvl": 1}
    console.log("makeEnemyData");
    let newArray = [];
    //creates necessary data for each mon
    pokemonArray.forEach((p) => {
      let pokemon = {
        name: p.pokemon,
        id: Math.random(),

        trainer: props.opponent,
        status: "normal",
        statuscounter: 0,
        stats: {},
        buffs: {
          atk: { u: 2, d: 2 },
          def: { u: 2, d: 2 },
          spa: { u: 2, d: 2 },
          spd: { u: 2, d: 2 },
          speed: { u: 2, d: 2 },
          accu: { u: 2, d: 2 },
          eva: { u: 2, d: 2 },
        },
        lvl: p.lvl, //p.lvl,
        moves: [],
      };
      //get additional info from the pokedex
      let dexEntry = dex[pokemon.name];
      //IVs and Stats

      pokemon.stats.hp = Math.round(
        pokemon.lvl +
          10 +
          ((2 * dexEntry.baseStats.hp + Math.random() * 31) * pokemon.lvl) / 100
      );
      pokemon.currentHP = pokemon.stats.hp;
      pokemon.stats.atk = Math.round(
        5 +
          ((2 * dexEntry.baseStats.atk + Math.random() * 31) * pokemon.lvl) /
            100
      );
      pokemon.stats.def = Math.round(
        5 +
          ((2 * dexEntry.baseStats.def + Math.random() * 31) * pokemon.lvl) /
            100
      );
      pokemon.stats.spa = Math.round(
        5 +
          ((2 * dexEntry.baseStats.spa + Math.random() * 31) * pokemon.lvl) /
            100
      );
      pokemon.stats.spd = Math.round(
        5 +
          ((2 * dexEntry.baseStats.spd + Math.random() * 31) * pokemon.lvl) /
            100
      );
      pokemon.stats.speed = Math.round(
        5 +
          ((2 * dexEntry.baseStats.speed + Math.random() * 31) * pokemon.lvl) /
            100
      );
      pokemon.type = dexEntry.type;
      pokemon.spriteId = dexEntry.spriteId;
      pokemon.baseEXP = dexEntry.baseEXP;
      pokemon.evGain = dexEntry.evGain;
      pokemon.catchrate = dexEntry.catchrate;
      if (dexEntry.hasOwnProperty("type2")) {
        pokemon.type2 = dexEntry.type2;
      }
      //Moves, takes the 4 highest level moves from the dex entry
      let tempset = dexEntry.moveset.filter((m) => m.lvl <= pokemon.lvl);
      let moveset = [];
      tempset.forEach((m) => {
        if (!moveset.map((move) => move.move).includes(m.name)) {
          moveset.push(m);
        }
      });

      if (moveset.length > 4) {
        moveset = moveset.slice(-4);
      }
      moveset.map((m) => {
        pokemon.moves.push(moves[m.move]);
      });
      newArray.push(pokemon);
    });
    console.log(newArray);
    setenemyTeam(newArray);
    makePlayerData(team);
  };
  const makePlayerData = (pokemonArray) => {
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
        //p.stats = updateStats(p);
        if (p.hasOwnProperty("currentHP") === false) {
          p.currentHP = p.stats.hp;
        }
      }
    });
    setTeam(pokemonArray);
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
  const decideEnemyMove = (t1, t2, a1, h) => {
    if (h !== undefined) {
      setLastMove(h);
    }
    console.log("decideEnemyMove");
    //decide the enemy's move, random for now
    let a2 =
      enemyTeam[0].moves[
        Math.round(Math.random() * (enemyTeam[0].moves.length - 1))
      ];
    if (enemyTwoTurnAttack !== "") {
      a2 = enemyTwoTurnAttack;
      setEnemyTwoTurnAttack("");
    }
    speedCheck(t1, t2, a1, a2);
    return;
  };
  const speedCheck = (t1, t2, a1, a2) => {
    //decides who goes first
    //run,switch and items are actions too, but have a speed value that makes them faster than any attack
    //if both people use items/switch, it doesnt matter who goes first
    //parameters are always: players team, enemy team, player move, enemy move
    console.log("speedCheck");
    if (t1[0].stats.speed * a1.speed > t2[0].stats.speed * a2.speed) {
      console.log("player goes first");
      canAttack(t1, t2, a1, a2);
      return;
    } else if (t1[0].stats.speed * a1.speed < t2[0].stats.speed * a2.speed) {
      console.log("enemy goes first");
      canAttack(t2, t1, a2, a1);
      return;
    } else if (t1[0].stats.speed * a1.speed === t2[0].stats.speed * a2.speed) {
      let r = Math.random();
      if (r > 0.5) {
        console.log("player goes first");
        canAttack(t1, t2, a1, a2);
        return;
      } else {
        console.log("enemy goes first");
        canAttack(t2, t1, a2, a1);
        return;
      }
    } else {
      console.log("ALERT ALERT");
    }
  };
  const accuracyCheck = (t1, t2, a1) => {
    let r = Math.random() * 100;
    console.log(t1[0].buffs.accu.u + "/" + t1[0].buffs.accu.d);
    console.log(a1.accuracy);
    let accu = a1.accuracy;
    if (a1.name === "Protect") {
      if (t1[0].hasOwnProperty("protectCounter")) {
        t1[0].protectCounter += 1;
        accu /= t1[0].protectCounter;
      } else {
        t1[0].protectCounter = 1;
      }
    }
    if (
      a1.hasOwnProperty("weatherAccBuff") &&
      weather.weather === a1.weatherAccBuff.weather
    ) {
      accu = a1.weatherAccBuff.buff;
      console.log("weatherbuffed Accu:" + accu);
    }
    if (
      (t1[0].buffs.accu.u / t1[0].buffs.accu.d) *
        (t2[0].buffs.eva.u / t2[0].buffs.eva.d) *
        accu >
        r ||
      accu === 0
    ) {
      return 1;
    } else return 0;
  };
  const canAttack = (t1, t2, a1, a2) => {
    console.log("canAttack");
    //checks if a mon can attack
    let p = t1[0];
    //run and switch always work
    if (a1.name === "run" || a1.name === "switch") {
      executeAttack(t1, t2, a1, a2);
    } else {
      //checkAttack checks for paralysis,sleep etc.
      if (p.hasOwnProperty("statusCounter")) {
        p.statusCounter--;
        console.log("statuscounter: " + p.statusCounter);
        if (p.statusCounter === 0) {
          let temp = [].concat(p.status);
          delete p.statusCounter;
          p.status = "normal";
          setInfo({
            msg: p.name + (temp === "frozen" ? " was thawed." : " woke up."),
            next: () => executeAttack(t1, t2, a1, a2),
          });
          return;
        }
      }
      if (p.hasOwnProperty("confusionCounter")) {
        p.confusionCounter--;
        console.log("confusioncounter: " + p.confusionCounter);
        if (p.confusionCounter === 0) {
          delete p.confusionCounter;
          delete p.confused;

          setInfo({
            msg: p.name + " snapped out of its confusion.",
            next: () => executeAttack(t1, t2, a1, a2),
          });
          return;
        }
      }
      let res = checkAttack(p, a1);

      if (res.score === 0) {
        //score 0=>can Attack

        executeAttack(t1, t2, a1, a2);
        return;
      } else if (res.score === -1) {
        //score -1=>confusion: user hits himself with 40 power
        setInfo({
          msg: p.name + " is confused.",
          next: () =>
            executeAttack(
              t1,
              t2,
              {
                name: "HitHimself",
                movetype: "phys",
                power: 40,
                type: "normal",
                accuracy: 0,
              },
              a2
            ),
        });

        return;
      } else if (res.score === -2) {
        //score -1=>confusion: user hits himself with 40 power
        setInfo({
          msg: p.name + " is confused.",
          next: () => executeAttack(t1, t2, a1, a2),
        });

        return;
      } else {
        //score 1=>cannot attack, move gets skipped
        count += 1;
        setInfo({
          msg: res.msg,
          next: () => {
            progress(t1, t2, a1, a2);
          },
        });
      }
    }
    return;
  };
  const executeAttack = (t1, t2, a1, a2) => {
    if (a1.hasOwnProperty("pp")) {
      t1[0].moves.filter((m) => m.name === a1.name)[0].pp -= 1;
    }
    if (
      t1[0].trainer === "player" &&
      t1[0].foughtAgainst.includes(t2[0].id) === false
    ) {
      t1[0].foughtAgainst.push(t2[0].id);
    }
    console.log("executeAttack");
    let msg = "";
    //special cases
    if (a1.name === "run") {
      run(t1, t2, a1, a2);
      count += 1;
      return;
    } else if (a1.name === "switch") {
      switchIn(t1, t2, a1, a2);
      count = 1;
      return;
    } else if (a1.movetype === "item") {
      setInfo({
        msg: "Player used " + a1.name,
        next: () => {
          progress(t1, t2, a1, a2);
        },
      });
      count += 1;
      return;
    } else if (a1.movetype === "ball") {
      setInfo({
        msg: "Player used " + a1.name,
        next: () => {
          throwBall(t1, t2, a1, a2);
        },
      });
      count += 1;
      return;
    } else if (a1.name === "HitHimself") {
      const res = calcDamage(t1[0], t1[0], a1);
      t1[0].currentHP = res.hp;
      setInfo({
        msg: t1[0].name + " hit himself in confusion",
        next: () => progress(t1, t2, a1, a2),
      });
      count += 1;
      return;
    } else if (a1.movetype === "weather") {
      console.log("weather move");
      setWeather({
        weather: a1.weather,
        counter: a1.counter,
        msg: a1.activeMsg,
      });
      setInfo({
        msg: t1[0].name + " used " + a1.name,
        next: () =>
          setInfo({
            msg: a1.msg,
            next: () => progress(t1, t2, a1, a2),
          }),
      });
      count += 1;
      return;
    } else if (t2[0].hasOwnProperty("protected")) {
      setInfo({
        msg: t1[0].name + " used " + a1.name,
        next: () =>
          setInfo({
            msg: t2[0].name + " is protected",
            next: () => progress(t1, t2, a1, a2),
          }),
      });
      count += 1;
      return;
    } else if (a1.name === "Leech Seed") {
      if (t2[0].hasOwnProperty("leeched")) {
        setInfo({
          msg: t1[0].name + " used " + a1.name + ". ",
          next: () => {
            setInfo({
              msg: t2[0].name + " is already seeded",
              next: () => {
                progress(t1, t2, a1, a2);
              },
            });
          },
        });
      } else {
        t2[0].leeched = true;
        setInfo({
          msg: t1[0].name + " used " + a1.name + ". ",
          next: () => {
            setInfo({
              msg: t2[0].name + " was  seeded",
              next: () => {
                progress(t1, t2, a1, a2);
              },
            });
          },
        });
      }
      count += 1;
      return;
    } else if (
      ["Solar Beam", "Skull Bash"].includes(a1.name) &&
      t1[0].trainer === "opponent" &&
      enemyTwoTurnAttack === ""
    ) {
      let msg = " is taking in sunlight.";
      if (a1.name === "Skull Bash") {
        msg = "lowered its head to raise defense";
        if (t1[0].buffs.def.u < 8) {
          t1[0].buffs.def.u += 1;
        }
      }
      setEnemyTwoTurnAttack(a1);
      count += 1;
      setInfo({
        msg: t1[0].name + msg,
        next: () => progress(t1, t2, a1, a2),
      });
      return;
    } else if (
      ["Solar Beam", "Skull Bash"].includes(a1.name) &&
      playerTwoTurnAttack === ""
    ) {
      let msg = " is taking in sunlight.";
      if (a1.name === "Skull Bash") {
        msg = " lowered its head to raise defense.";
        if (t1[0].buffs.def.u < 8) {
          t1[0].buffs.def.u += 1;
        }
      }
      setPlayerTwoTurnAttack(a1);
      count += 1;
      setInfo({
        msg: t1[0].name + msg,
        next: () => progress(t1, t2, a1, a2),
      });
      return;
    }
    //regular case
    else {
      if (t1[0].trainer === "opponent") {
        setEnemyTwoTurnAttack("");
      }
      if (t1[0].trainer === "player") {
        setPlayerTwoTurnAttack("");
      }
      if (accuracyCheck(t1, t2, a1) === 1) {
        if (a1.name === "Petal Dance" || a1.name === "Thrash") {
          if (t1[0].hasOwnProperty("moveCounter") === false) {
            t1[0].moveCounter = Math.round(Math.random() * 2);
            console.log("moveCounter:" + t1[0].moveCounter);
            if (t1[0].trainer === "opponent") {
              setEnemyTwoTurnAttack(a1);
            }
            if (t1[0].trainer === "player") {
              setPlayerTwoTurnAttack(a1);
            }
          } else if (t1[0].moveCounter > 0) {
            console.log("moveCounter:" + t1[0].moveCounter);
            t1[0].moveCounter--;
            if (t1[0].trainer === "opponent") {
              setEnemyTwoTurnAttack(a1);
            }
            if (t1[0].trainer === "player") {
              setPlayerTwoTurnAttack(a1);
            }
          } else if (t1[0].moveCounter === 0) {
            console.log("moveCounter:" + t1[0].moveCounter);
            delete t1[0].moveCounter;
            t1[0].confused = true;
            t1[0].confusionCounter = Math.round(Math.random() * 5);
          }
        }
        if (a1.name === "Fire Spin" || a1.name === "Whirlpool") {
          t2[0].vortex = Math.round(Math.random() + 4);
        }
        if (a1.name === "Rapid Spin") {
          delete t1[0].leeched;
          delete t1[0].vortex;
        }
        if (a1.name === "Protect") {
          t1[0].protected = true;
          setInfo({
            msg: t1[0].name + " used Protect",
            next: () => progress(t1, t2, a1, a2),
          });
        }
        if (a1.name !== "Protect") {
          delete t1[0].protectCounter;
        }

        if (a1.movetype === "fixed") {
          setInfo({
            msg: t1[0].name + " used " + a1.name + ". " + msg,
            next: () => {
              t2[0].currentHP - a1.power > 0
                ? (t2[0].currentHP -= a1.power)
                : (t2[0].currentHP = 0);
              progress(t1, t2, a1, a2);
            },
          });
          count += 1;
          return;
        }
        if (a1.hasOwnProperty("power")) {
          let res = calcDamage(t1[0], t2[0], a1, weather.weather);
          msg = res.msg;
          t2[0].currentHP = res.hp;
          setInfo({
            msg: t1[0].name + " used " + a1.name + ". " + msg,
            next: () => {
              progress(t1, t2, a1, a2);
            },
          });
          if (a1.hasOwnProperty("recoil")) {
            setInfo({
              msg: t1[0].name + " used " + a1.name + ". " + msg,
              next: () => {
                setInfo({
                  msg: t1[0].name + " was hit with recoil",
                  next: () => {
                    t1[0].currentHP -= Math.round(res.dmg * a1.recoil);
                    progress(t1, t2, a1, a2);
                  },
                });
              },
            });
          }
          //info about effectiveness, critical hits
        }
        if (t2[0].currentHP > 0) {
          //effects only need to be applied if enemy is still conscious
          if (a1.hasOwnProperty("status")) {
            let r = Math.random();
            if (t2[0].status === "normal") {
              if (
                r <= a1.status.chance &&
                ["paralyzed", "burned", "poisoned"].includes(a1.status.effect)
              ) {
                t2[0].status = a1.status.effect;
                count += 1;
                setInfo({
                  msg: t1[0].name + " used " + a1.name + ". " + msg,
                  next: () => {
                    setInfo({
                      msg: t2[0].name + " was " + a1.status.effect,
                      next: () => {
                        progress(t1, t2, a1, a2);
                      },
                    });
                  },
                });
                return;
              } else if (
                r <= a1.status.chance &&
                ["frozen", "asleep"].includes(a1.status.effect)
              ) {
                t2[0].status = a1.status.effect;
                t2[0].statusCounter = Math.round(r * 5);
                count += 1;
                setInfo({
                  msg: t1[0].name + " used " + a1.name + ". " + msg,
                  next: () => {
                    setInfo({
                      msg:
                        t2[0].name +
                        " " +
                        (a1.status.effect === "frozen"
                          ? " was frozen"
                          : "fell asleep"),
                      next: () => {
                        progress(t1, t2, a1, a2);
                      },
                    });
                  },
                });
                return;
              } else if (
                r <= a1.status.chance &&
                a1.status.effect === "confused" &&
                t2[0].hasOwnProperty("confused") === false
              ) {
                t2[0].confused = true;
                t2[0].confusionCounter = Math.round(1 + Math.random() * 4);
              }
            } else if (a1.movetype === "status") {
              count += 1;
              setInfo({
                msg: t1[0].name + " used " + a1.name + ". " + msg,
                next: () => {
                  setInfo({
                    msg: "it had no effect",
                    next: () => {
                      progress(t1, t2, a1, a2);
                    },
                  });
                },
              });
              return;
            }
          }
          if (a1.hasOwnProperty("otherEffect")) {
            //flinch only works for the first attacker
            let r = Math.random();
            if (
              count === 0 &&
              a1.otherEffect.effect === "flinch" &&
              r < a1.otherEffect.chance
            ) {
              count += 2;
              //recursively calling setInfo to display two messages after each other
              setInfo({
                msg: t1[0].name + " used " + a1.name + ". " + msg,
                next: () => {
                  setInfo({
                    msg: t2[0].name + " flinched",
                    next: () => {
                      progress(t1, t2, a1, a2);
                    },
                  });
                },
              });

              return;
            }
          }
          if (a1.hasOwnProperty("statChange")) {
            console.log(a1);
            //target can be self or enemy
            let target = t2[0];
            if (a1.statChange.target === "self") {
              target = t1[0];
            }
            a1.statChange.stats.forEach((stat) => {
              if (target.buffs[stat].u < 8 && target.buffs[stat].d < 8) {
                if (a1.statChange.factor > 0) {
                  target.buffs[stat].u += a1.statChange.factor;
                } else if (a1.statChange.factor < 0) {
                  target.buffs[stat].d -= a1.statChange.factor;
                }
              }
            });
            setInfo({
              msg: t1[0].name + " used " + a1.name + ". " + msg,
              next: () => {
                setInfo({
                  msg:
                    target.name +
                    "'s " +
                    a1.statChange.stats.join(" and ") +
                    (a1.statChange.factor > 0 ? " rose!" : " fell!"),
                  next: () => {
                    progress(t1, t2, a1, a2);
                  },
                });
              },
            });

            console.log(target);
            if (a1.movetype === "stat") {
              console.log("stat");
              count += 1;
              return;
            }
          }
          if (a1.hasOwnProperty("heal")) {
            let heal = a1.heal;
            if (
              a1.hasOwnProperty("weatherBuff") &&
              weather.weather === a1.weatherBuff.weather
            ) {
              heal *= a1.weatherBuff.buff;
              console.log("weatherbuffed heal:" + heal);
            }

            t1[0].currentHP + heal * t1[0].stats.hp > t1[0].stats.hp
              ? (t1[0].currentHP = t1[0].stats.hp)
              : (t1[0].currentHP += Math.round(heal * t1[0].stats.hp));
            if (a1.movetype === "heal") {
              setInfo({
                msg: t1[0].name + " used " + a1.name + ". " + msg,
                next: () => {
                  progress(t1, t2, a1, a2);
                },
              });
              count += 1;
              return;
            }
          }
        }

        count += 1;
        return;
      } else {
        setInfo({
          msg: t1[0].name + " used " + a1.name + ". " + msg,
          next: () => {
            setInfo({
              msg: "it missed",
              next: () => {
                progress(t1, t2, a1, a2);
              },
            });
          },
        });
        count += 1;
        return;
      }
    }
  };
  const executeStatusDamage = (t1, t2, a1, a2) => {
    console.log("executeStatusDamage");
    if (count === 2) {
      count += 1;

      let res = applyStatusDamage(t1);
      t = res.team;
      if (res.msg === "took damage") {
        setInfo({
          msg: t1[0].name + " took damage from being " + t1[0].status,
          next: () => progress(t, t2, a1, a2),
        });
      } else progress(t, t2, a1, a2);
    } else if (count === 3) {
      count += 1;

      let res = applyStatusDamage(t2);
      t = res.team;
      if (res.msg === "took damage") {
        setInfo({
          msg: t2[0].name + " took damage from being " + t2[0].status,
          next: () => progress(t1, t, a1, a2),
        });
      } else progress(t1, t, a1, a2);
    }
  };
  const executeOtherDamage = (t1, t2, a1, a2) => {
    console.log("executeOtherDamage");
    count += 1;
    if (t1[0].hasOwnProperty("leeched")) {
      console.log(t1[0] + " is leeched");
      let dmg = parseInt(t1[0].stats.hp / 8);
      //leeched mon looses 1/8 hp

      if (t1[0].currentHP - dmg > 0) {
        t1[0].currentHP -= dmg;
      } else {
        t1[0].currentHP = 0;
      }
      //opponent gets healed by that amount, but obviously not over his max HP
      if (t2[0].currentHP + dmg > t2[0].stats.hp) {
        t2[0].currentHP = t2[0].stats.hp;
      } else {
        t2[0].currentHP += dmg;
      }
      setInfo({
        msg: t1[0].name + " was sapped by Leech Seed",
        next: () => progress(t1, t2, a1, a2),
      });
    } else if (t1[0].hasOwnProperty("vortex")) {
      let dmg = parseInt(t1[0].stats.hp / 8);

      if (t1[0].currentHP - dmg > 0) {
        t1[0].currentHP -= dmg;
      } else {
        t1[0].currentHP = 0;
      }
      setInfo({
        msg: t1[0].name + " is trapped in the vortex",
        next: () => progress(t1, t2, a1, a2),
      });
      t1[0].vortex -= 1;
      if (t1[0].vortex === 0) {
        delete t1[0].vortex;
      }
    } else {
      progress(t1, t2, a1, a2);
    }
  };
  const throwBall = (t1, t2, a1, a2) => {
    console.log("throwBall");

    let stat = 1;
    if (["poisoned", "burned", "paralyzed"].includes(t2[0].status)) {
      stat = 1.5;
    }
    if (["frozen", "asleep"].includes(t2[0].status)) {
      stat = 2;
    }
    let a =
      (((3 * t2[0].stats.hp - 2 * t2[0].currentHP) *
        a1.catchrate *
        t2[0].catchrate) /
        (3 * t2[0].stats.hp)) *
      stat;
    let b = 1048560 / Math.sqrt(Math.sqrt(16711680 / a));
    let r = Math.random() * 65535;

    console.log("b:" + b);
    console.log("r:" + r);
    if (b > r && shakeCounter < 4) {
      console.log("buffbuffbuff" + shakeCounter);
      shakeCounter += 1;

      throwBall(t1, t2, a1, a2);
    } else if (b > r || shakeCounter === 4) {
      let newMon = {
        name: t2[0].name,
        exp: Math.pow(t2[0].lvl, 3),
        status: t2[0].status,
        iv: {
          hp: Math.round(Math.random() * 31),
          atk: Math.round(Math.random() * 31),
          def: Math.round(Math.random() * 31),
          spa: Math.round(Math.random() * 31),
          spd: Math.round(Math.random() * 31),
          speed: Math.round(Math.random() * 31),
        },
        ev: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, speed: 0 },
        buffs: {
          atk: { u: 2, d: 2 },
          def: { u: 2, d: 2 },
          spa: { u: 2, d: 2 },
          spd: { u: 2, d: 2 },
          speed: { u: 2, d: 2 },
          accu: { u: 2, d: 2 },
          eva: { u: 2, d: 2 },
        },
        moves: t2[0].moves,
        ability: {
          name: "Pick Up",
          description: "can pick up item after battle",
        },
        trainer: "player",
      };
      if (t2[0].hasOwnProperty("statusCounter")) {
        newMon.statusCounter = t2[0].statusCounter;
      }
      console.log(newMon);
      if (t1.length < 6) {
        t1.push(newMon);
        console.log(t1);
      }

      setInfo({
        msg: t2[0].name + " was caught!",
        next: () => {
          props.closeFight();
        },
      });
      props.updateBag({ item: a1.item, amount: -1 });
      shakeCounter = 0;
    } else {
      setInfo({
        msg: t2[0].name + " escaped!",
        next: () => {
          progress(t1, t2, a1, a2);
        },
      });
      props.updateBag({ item: a1.item, amount: -1 });
      shakeCounter = 0;
    }
  };
  const progress = (t1, t2, a1, a2) => {
    console.log("progress");
    console.log(count);
    //check if somebody fainted
    if (
      checkFaint(t1, t2, a1, a2) === false &&
      checkFaint(t2, t1, a2, a1) === false
    ) {
      if (count === 0) {
        setInfo(null);
      } else if (count === 1) {
        canAttack(t2, t1, a2, a1);
      } else if (count === 2) {
        executeStatusDamage(t2, t1, a1, a2);
      } else if (count === 3) {
        executeStatusDamage(t1, t2, a1, a2);
      } else if (count === 4) {
        executeOtherDamage(t1, t2, a1, a2);
      } else if (count === 5) {
        executeOtherDamage(t2, t1, a1, a2);
      } else if (count === 6) {
        delete t1[0].protected;
        delete t2[0].protected;
        console.log("round over");
        console.log(weather);
        count = 0;
        if (weather.weather !== "") {
          let temp = weather;

          if (temp.counter > 0) {
            setInfo({ msg: weather.msg, next: () => setInfo(null) });
            temp.counter--;
            setWeather(temp);
          } else {
            setWeather({ weather: "", counter: 100000, msg: "no weather" });
            setInfo(null);
          }
        } else setInfo(null);
      }
    }
  };
  const checkFaint = (t1, t2, a1, a2) => {
    console.log("checkFaint");
    console.log(t1);
    console.log(t2);
    if (t1[0].currentHP <= 0) {
      //if the opponents pokemon fainted, he sends out the next one
      if (t1[0].trainer.name == opponent.name) {
        //check if team has unfainted members
        //if everybody is fainted
        if (t1.filter((p) => p.currentHP > 0).length === 0) {
          //Exp are not relevant in the battle sim
          //calculateEXP(t1, t2, "win", a1, a2);
          props.closeFight();
        }
        //if there are still healthy pokemon
        else {
          //Exp are not relevant in the battle sim
          //calculateEXP(t1, t2, "switch", a1, a2);
          console.log("new pokemon must come in ");
          let newP = t1.filter((p) => p.currentHP > 0)[0];
          let newTeam = [newP].concat(t1.filter((p) => p !== newP));
          setenemyTeam(newTeam);
          count += 1;
          setInfo({
            msg: t1[0].name + " fainted ",
            next: () => {
              setInfo({
                msg:
                  t1[0].trainer.class +
                  " " +
                  t1[0].trainer.name +
                  " switches in " +
                  newP.name,
                next: () => {
                  progress(newTeam, t2, a1, a2);
                },
              });
            },
          });
        }
      }
      //if players pokemon fainted, go to the TeamScreen
      else if (t1[0].trainer === "player") {
        console.log("player mon fainted");
        if (count === 2) {
          count = 6;
        } else count += 1;

        if (t1.filter((p) => p.currentHP !== 0).length > 0) {
          setTempAttack(a2);
          setInfo({
            msg: t1[0].name + " fainted ",
            next: () => {
              setFainted(true);
            },
          });
        } else if (t1.filter((p) => p.currentHP !== 0).length === 0) {
          setInfo({
            msg: t1[0].name + " fainted ",
            next: () =>
              setInfo({
                msg: props.player.name + " lost",
                next: () => {
                  props.closeFight();
                },
              }),
          });
        }
      } else {
        console.log("wtf");
        console.log("opponent");
        console.log(opponent);
        console.log("t1[0].trainer");
        console.log(t1[0].trainer);
      }
    } else return false;
  };
  const run = (t1, t2, a1, a2) => {
    console.log("run");
    let r = Math.random();
    if (opponent.class === "wild") {
      if (r > 0.5 || team[0].stats.speed > enemyTeam[0].stats.speed) {
        setInfo({
          msg: "escaped successfully",

          next: () => {
            props.closeFight();
          },
        });
      } else {
        setInfo({
          msg: "can't escape",

          next: () => {
            progress(t1, t2, a1, a2);
          },
        });
      }
    } else {
      setInfo({
        msg: "you cannot run away from trainer battles ",

        next: () => {
          setInfo(null);
        },
      });
    }
  };
  const switchIn = (t1, t2, a1, a2) => {
    console.log("switchIn");
    setPlayerTwoTurnAttack("");
    let tempTeam = [].concat(t1);
    let temp = Object.assign(tempTeam[0]);
    a1.p.buffs = {
      atk: { u: 2, d: 2 },
      def: { u: 2, d: 2 },
      spa: { u: 2, d: 2 },
      spd: { u: 2, d: 2 },
      speed: { u: 2, d: 2 },
      accu: { u: 2, d: 2 },
      eva: { u: 2, d: 2 },
    };
    tempTeam[0] = a1.p;
    tempTeam[a1.i] = temp;
    if (t1[0].trainer === "player") {
      setTeam(tempTeam);
    } else {
      setenemyTeam(tempTeam);
    }
    setInfo({
      msg: a1.p.name + " comes out ",
      next: () => {
        progress(tempTeam, t2, a1, a2);
      },
    });
    setFainted(false);
  };
  const calculateEXP = (t1, t2, sit, a1, a2) => {
    console.log("giveEXP");
    //calculating the exp
    const b = t1[0].baseEXP;
    let a = 1;
    if (opponent.class !== "wild") a = 1.5;
    const l = t1[0].lvl;

    const exp = (b * a * l) / 7;
    console.log("total EXP:" + exp);
    const lucky = (m) => {
      if (m.hasOwnProperty("held")) {
        if (m.held.name === "Lucky Egg") return 1.5;
        else return 1;
      } else return 1;
    };
    const expRewards = [];
    t2.filter((p) => p.foughtAgainst.includes(t1[0].id)).forEach((p) => {
      console.log(
        p.name +
          " gets " +
          Math.round(
            (exp * lucky(p)) /
              t2.filter((p) => p.foughtAgainst.includes(t1[0].id)).length
          ) +
          " XP"
      );
      expRewards.push({
        p: p,
        exp: Math.round(
          (exp * lucky(p)) /
            t2.filter((p) => p.foughtAgainst.includes(t1[0].id)).length
        ),
        evGain: t1[0].evGain,
      });
    });
    //determining the next Info states

    setInfo({
      msg: t1[0].name + " fainted ",
      next: () => {
        giveEXP(expRewards, sit, t1, t2, a1, a2);
      },
    });
  };
  const giveEXP = (r, sit, t1, t2, a1, a2) => {
    console.log("giveEXP");
    console.log(r);
    //after everyone has their xp
    if (r.length === 0) {
      if (sit === "win") {
        setInfo({
          msg:
            props.player.name +
            " defeated " +
            opponent.class +
            " " +
            opponent.name +
            ".",
          next: () => {
            if (opponent.class === "wild") {
              //check for evolving
              evolve(evos, "afterEVO");
            } else {
              setInfo({
                msg:
                  props.player.name +
                  " received " +
                  opponent.rewardMoney +
                  "$" +
                  (opponent.hasOwnProperty("rewardItem")
                    ? " and one " + opponent.rewardItem + "."
                    : "."),
                next: () =>
                  //check for evolving
                  evolve(evos, "afterEVO"),
              });
            }
          },
        });
      } else if (sit === "switch") {
        console.log("new pokemon must come in ");
        let newP = t1.filter((p) => p.currentHP > 0)[0];
        let newTeam = [newP].concat(t1.filter((p) => p !== newP));
        setenemyTeam(newTeam);
        count += 1;
        setInfo({
          msg: t1[0].name + " fainted ",
          next: () => {
            setInfo({
              msg:
                t1[0].trainer.class +
                " " +
                t1[0].trainer.name +
                " switches in " +
                newP.name,
              next: () => {
                progress(newTeam, t2, a1, a2);
              },
            });
          },
        });
      }
    }
    //give the first mon xp
    else {
      let name = r[0].p.name;
      let lvl = Math.floor(Math.cbrt(r[0].p.exp));
      let nextlvl = Math.floor(Math.cbrt(r[0].p.exp + r[0].exp));
      console.log(name + " lvl:" + lvl + " nextlvl:" + nextlvl);
      //if the mon levels up
      if (nextlvl > lvl) {
        setInfo({
          msg:
            name +
            " gained " +
            r[0].exp +
            " EXP. " +
            name +
            " grew to lvl " +
            nextlvl +
            ". ",
          next: () => {
            r[0].p.exp += r[0].exp;
            if (sumEV(r[0].p) < 510 && r[0].p.ev[r[0].evGain.stat] < 255) {
              r[0].p.ev[r[0].evGain.stat] += r[0].evGain.value;
            }
            learnMove(r, sit, t1, t2, a1, a2);
          },
        });
        //if it doesnt
      } else {
        setInfo({
          msg: name + " gained " + r[0].exp + " EXP.",
          next: () => {
            r[0].p.exp += r[0].exp;
            if (sumEV(r[0].p) < 510 && r[0].p.ev[r[0].evGain.stat] < 255) {
              r[0].p.ev[r[0].evGain.stat] += r[0].evGain.value;
            }
            let rewards = r.slice(1);
            giveEXP(rewards, sit, t1, t2, a1, a2);
          },
        });
      }
    }
  };
  const learnMove = (r, sit, t1, t2, a1, a2) => {
    console.log("learnMove");
    console.log(r);
    //check if it learns a move
    let name = r[0].p.name;
    let lvl = Math.floor(Math.cbrt(r[0].p.exp));
    if (dex[name].moveset.filter((m) => m.lvl === lvl).length !== 0) {
      if (r[0].p.moves.length === 4) {
        setInfo({
          msg:
            name +
            " wants to learn " +
            dex[name].moveset.filter((m) => m.lvl === lvl)[0].move,
          next: () => {
            setMoveScreen(true);
            setMovetoLearn(
              moves[dex[name].moveset.filter((m) => m.lvl === lvl)[0].move]
            );
            setTempState({
              r: r,
              sit: sit,
              t1: t1,
              t2: t2,
              a1: a1,
              a2: a2,
            });
          },
        });
        return;
      } else {
        r[0].p.moves = r[0].p.moves.concat(
          moves[dex[name].moveset.filter((m) => m.lvl === lvl)[0].move]
        );
        setInfo({
          msg:
            name +
            " learned " +
            dex[name].moveset.filter((m) => m.lvl === lvl)[0].move,
          next: () => {
            checkEvolving(r, sit, t1, t2, a1, a2);
          },
        });
        return;
      }
    }
    //continue depending on situation
    if (["win", "switch"].includes(sit)) {
      checkEvolving(r, sit, t1, t2, a1, a2);
    } else if (sit === "afterEVO") {
      let mons = r.slice(1);
      console.log(mons);
      evolve(mons, sit);
    }
  };
  const checkEvolving = (r, sit, t1, t2, a1, a2) => {
    console.log("checkEvolving");
    console.log(r);
    let lvl = Math.floor(Math.cbrt(r[0].p.exp));

    if (lvl === r[0].p.evo) {
      console.log(r[0].p.name + " will evolve");
      let temp = evos;
      temp.push(r[0]);
      setEvos(temp);
    }
    let rewards = r.slice(1);
    giveEXP(rewards, sit, t1, t2, a1, a2);
  };
  const evolve = (mons, sit) => {
    console.log("evolve");
    console.log(mons);
    // sit= "afterEVO"
    //evolutions only happen at the end of battle
    //learnMove needs to run again after evolution
    if (mons.length === 0) {
      if (opponent.class !== "wild") {
        //props.updateMoney(opponent.rewardMoney);
        props.updateBag({ name: opponent.rewardItem, amount: 1 });
      }
      props.closeFight();
    } else {
      let p = mons[0].p;
      let oldName = [].concat(p.name);
      const damage = Object.assign(p.stats.hp - p.currentHP);
      console.log("damage:" + damage);
      console.log(p.name + " will evolve");
      p.name = p.into;
      const dexEntry = dex[p.name];

      p.evo = dexEntry.evo;
      p.into = dexEntry.into;
      p.spriteId = dexEntry.spriteId;
      p.type = dexEntry.type;
      if (dexEntry.hasOwnProperty("type2")) {
        p.type2 = dexEntry.type2;
      }
      p.stats = updateStats(p);
      p.currentHP = p.stats.hp - damage;

      setInfo({
        msg: oldName + " evolved into " + p.name,
        next: () => {
          learnMove(mons, sit);
        },
      });
    }
  };
  const sumEV = (mon) => {
    console.log("sumEV");
    let sum =
      mon.ev.hp +
      mon.ev.atk +
      mon.ev.def +
      mon.ev.spa +
      mon.ev.spd +
      mon.ev.speed;
    console.log(sum);
    return sum;
  };
  //fight display:
  return fainted === true ? (
    <TeamScreen
      team={team}
      sit="fight"
      z={props.z + 1}
      closeTeam={() => console.log("you have to switch in someone")}
      switchIn={(a) => switchIn(team, enemyTeam, a, tempAttack)}
      tilesize={props.tilesize}
    />
  ) : moveScreen === true ? (
    <MoveScreen
      pokemon={tempState.r[0].p}
      team={team}
      move={moveToLearn}
      sit="learn"
      z={props.z + 1}
      closeMoveScreen={() => {
        setMoveScreen(false);
        setInfo({
          msg:
            tempState.r[0].p.name + " did not learn " + moveToLearn.name + ".",
          next: () => {
            if (tempState.sit === "afterEVO") {
              evolve(tempState.r.slice(1), tempState.sit);
            } else {
              checkEvolving(
                tempState.r,
                tempState.sit,
                tempState.t1,
                tempState.t2,
                tempState.a1,
                tempState.a2
              );
            }
          },
        });
      }}
      learnMove={(t) => {
        setMoveScreen(false);
        setInfo({
          msg: tempState.r[0].p.name + " learned " + moveToLearn.name + ".",
          next: (t) => {
            if (tempState.sit === "afterEVO") {
              evolve(tempState.r.slice(1), tempState.sit);
            } else {
              checkEvolving(
                tempState.r,
                tempState.sit,
                tempState.t1,
                tempState.t2,
                tempState.a1,
                tempState.a2
              );
            }
          },
        });
      }}
      tilesize={props.tilesize}
    />
  ) : (
    <div
      style={{
        zIndex: props.z,
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        backgroundColor: "white",
      }}
    >
      <Container fluid>
        {enemyTeam === eT ? makeEnemyData(eT) : ""}

        <Row
          noGutters //Background Div
        >
          {intro === true ? (
            <>
              <Col
                xs="6"
                style={{
                  zIndex: props.z + 1,
                  height: props.tilesize * 8,
                }}
              >
                <img
                  src={`${process.env.PUBLIC_URL}/assets/trainerbacks/player.png`}
                  alt="put"
                  style={{
                    position: "absolute",
                    left: 0,
                    bottom: 0,
                    width: props.tilesize * 6,
                    height: props.tilesize * 6,
                  }}
                />
              </Col>
              <Col
                xs="6"
                style={{
                  zIndex: props.z + 1,
                  height: props.tilesize * 8,
                }}
              >
                <img
                  src={`${process.env.PUBLIC_URL}/assets/${
                    opponent.class === "wild"
                      ? "frontSprites/" + dex[opponent.name].spriteId
                      : "trainerfronts/" + opponent.class
                  }.png`}
                  alt="put"
                  style={{
                    float: "right",
                    top: 0,
                    width: props.tilesize * 6,
                    height: props.tilesize * 6,
                  }}
                />
              </Col>
            </>
          ) : (
            <>
              <Col
                xs="6" //Enemy Text Box
                style={{
                  zIndex: props.z + 1,
                  height: props.tilesize * 4,
                }}
              >
                <div>
                  <ButtonGroup
                    style={{
                      height: props.tilesize,
                      minWidth: "100%",
                      marginBottom: props.tilesize * 0.1,
                      marginTop: 2,
                    }}
                  >
                    <Button style={{ color: "black" }} disabled outline>
                      Lvl {enemyTeam[0].lvl + " "}
                    </Button>
                    <Button style={{ color: "black" }} disabled outline>
                      {enemyTeam[0].name}
                    </Button>
                  </ButtonGroup>
                </div>
                <div>
                  <Progress
                    style={{
                      marginBottom: props.tilesize * 0.1,
                    }}
                    color="success"
                    value={enemyTeam[0].currentHP}
                    max={
                      enemyTeam[0].hasOwnProperty("stats")
                        ? enemyTeam[0].stats.hp
                        : 0
                    }
                  />{" "}
                </div>
                {enemyTeam[0].status !== "normal" ? (
                  <StatusButton
                    status={enemyTeam[0].status}
                    tilesize={props.tilesize}
                    float="left"
                  ></StatusButton>
                ) : (
                  ""
                )}
                {enemyTeam[0].hasOwnProperty("confused") ? (
                  <StatusButton
                    status={"confused"}
                    tilesize={props.tilesize}
                    float="left"
                  ></StatusButton>
                ) : (
                  ""
                )}

                <img
                  src={`${process.env.PUBLIC_URL}/assets/types/${enemyTeam[0].type}.png`}
                  alt="put"
                  style={{
                    marginRight: 2,
                    marginLeft: 2,
                    height: props.tilesize,
                    width: props.tilesize,
                  }}
                />
                {enemyTeam[0].hasOwnProperty("type2") ? (
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/types/${enemyTeam[0].type2}.png`}
                    alt="put"
                    style={{
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
              <Col
                xs="6" //Enemy Pokemon Box
                style={{
                  zIndex: props.z + 1,
                  height: props.tilesize * 4,
                }}
              >
                {enemyTeam[0].currentHP !== 0 ? (
                  <img
                    src={enemySprite}
                    alt="put"
                    style={{
                      float: "right",
                      top: 0,
                      width: props.tilesize * 4,
                      height: props.tilesize * 4,
                    }}
                  />
                ) : (
                  ""
                )}
              </Col>
              <Col
                xs="6" //Own Pokemon Box
                style={{
                  zIndex: props.z + 1,
                  height: props.tilesize * 4,
                }}
              >
                {team[0].currentHP !== 0 ? (
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/backsprites/${team[0].spriteId}.png`}
                    alt="put"
                    style={{
                      top: 0,
                      width: props.tilesize * 4,
                      height: props.tilesize * 4,
                    }}
                  />
                ) : (
                  ""
                )}
              </Col>
              <Col
                xs="6" //Own Text Box
                style={{
                  zIndex: props.z + 1,
                  height: props.tilesize * 4,
                }}
              >
                <div>
                  <ButtonGroup
                    style={{
                      height: props.tilesize,
                      minWidth: "100%",
                      marginBottom: props.tilesize * 0.1,
                      marginTop: props.tilesize * 0.8,
                    }}
                  >
                    <Button disabled outline color="dark">
                      Lvl {Math.floor(Math.cbrt(team[0].exp))}
                    </Button>
                    <Button disabled color="dark" outline>
                      {" " + team[0].name + " "}
                    </Button>
                  </ButtonGroup>
                </div>
                <div>
                  <Progress
                    style={{ marginBottom: props.tilesize * 0.1 }}
                    color="success"
                    value={team[0].currentHP}
                    max={team[0].stats.hp}
                  >
                    {team[0].currentHP}/{team[0].stats.hp}
                  </Progress>
                </div>
                <div>
                  <Progress
                    style={{ marginBottom: props.tilesize * 0.1 }}
                    color="primary"
                    value={
                      team[0].exp -
                      Math.pow(Math.floor(Math.cbrt(team[0].exp)), 3)
                    }
                    max={
                      Math.pow(Math.floor(Math.cbrt(team[0].exp)) + 1, 3) -
                      Math.pow(Math.floor(Math.cbrt(team[0].exp)), 3)
                    }
                  />
                </div>
                {team[0].status !== "normal" ? (
                  <StatusButton
                    status={team[0].status}
                    tilesize={props.tilesize}
                    float="right"
                  ></StatusButton>
                ) : (
                  ""
                )}
                {team[0].hasOwnProperty("confused") ? (
                  <StatusButton
                    status={"confused"}
                    tilesize={props.tilesize}
                    float="right"
                  ></StatusButton>
                ) : (
                  ""
                )}
                {team[0].hasOwnProperty("held") ? (
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/items/${team[0].held.sprite}.png`}
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

                <img
                  src={`${process.env.PUBLIC_URL}/assets/types/${team[0].type}.png`}
                  alt="put"
                  style={{
                    float: "right",
                    marginRight: 2,
                    marginLeft: 2,
                    height: props.tilesize,
                    width: props.tilesize,
                  }}
                />
                {team[0].hasOwnProperty("type2") ? (
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/types/${team[0].type2}.png`}
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
              </Col>
            </>
          )}
          {info === null ? (
            <MenuBox
              closeFight={() => props.closeFight()}
              decideEnemyMove={(t1, t2, a1, h) =>
                decideEnemyMove(t1, t2, a1, h)
              }
              reorderTeam={(p, n, o) => props.reorderTeam(p, n, o)}
              updateBag={(stuff) => props.updateBag(stuff)}
              setInfo={(a) => setInfo(a)}
              team={team}
              enemyTeam={enemyTeam}
              active={team[0]}
              opponent={opponent.class === "wild" ? "wild" : "trainer"}
              playerTwoTurnAttack={playerTwoTurnAttack}
              lastmove={lastmove}
              bag={props.bag}
              z={props.z + 2}
              tilesize={props.tilesize}
            />
          ) : (
            <Col
              xs="12"
              style={{
                zIndex: props.z + 1,
                height: props.tilesize * 3,
              }}
            >
              <Button
                style={{
                  width: "100%",
                  height: props.tilesize * 3,
                }}
                outline
                color="dark"
              >
                <h1>{info.msg}</h1>
              </Button>
              <ControlButtons
                UpFunction={() => {
                  console.log("unassigned");
                }}
                DownFunction={() => {
                  console.log("unassigned");
                }}
                LeftFunction={() => {
                  console.log("unassigned");
                }}
                RightFunction={() => {
                  console.log("unassigned");
                }}
                AFunction={() => info.next()}
                BFunction={() => info.next()}
                StartFunction={() => {
                  console.log("unassigned");
                }}
                SelectFunction={() => {
                  console.log("unassigned");
                }}
                tilesize={props.tilesize}
              />
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
}

export default FightScreen;
