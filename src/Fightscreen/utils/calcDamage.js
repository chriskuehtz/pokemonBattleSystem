//type of attack: effectiveness against other types
const typeChart = {
  normal: { super: [], notvery: ["rock", "steel"], none: ["ghost"] },
  fire: {
    super: ["grass", "ice", "bug", "steel"],
    notvery: ["fire", "water", "rock", "dragon"],
    none: [],
  },
  water: {
    super: ["fire", "rock"],
    notvery: ["grass", "water", "dragon"],
    none: [],
  },
  electric: {
    super: ["flying", "water"],
    notvery: ["steel", "dragon", "grass"],
    none: ["ground"],
  },
  grass: {
    super: ["rock", "water", "ground"],
    notvery: ["poison", "fire", "grass", "flying", "bug", "dragon"],
    none: [],
  },
  ice: {
    super: ["flying", "ground", "dragon", "grass"],
    notvery: ["water", "fire", "ice", "steel"],
    none: [],
  },
  fighting: {
    super: ["normal", "rock", "dark", "steel", "ice"],
    notvery: ["poison", "psychic", "fairy", "flying", "bug"],
    none: ["ghost"],
  },
  poison: {
    super: ["grass", "fairy"],
    notvery: ["poison", "ground", "rock", "ghost"],
    none: ["steel"],
  },
  ground: {
    super: ["electric", "poison", "rock", "steel", "fire"],
    notvery: ["grass", "bug"],
    none: ["flying"],
  },
  flying: {
    super: ["fighting", "grass", "bug"],
    notvery: ["steel", "rock", "electric"],
    none: [],
  },
  psychic: {
    super: ["poison", "fighting"],
    notvery: ["steel", "psychic"],
    none: ["dark"],
  },
  bug: {
    super: ["grass", "psychic", "dark"],
    notvery: [
      "fire",
      "fighting",
      "poison",
      "flying",
      "ghost",
      "steel",
      "fairy",
    ],
    none: [],
  },
  rock: {
    super: ["flying", "fire", "bug", "ice"],
    notvery: ["steel", "fighting", "steel"],
    none: [],
  },
  ghost: {
    super: ["psychic", "ghost"],
    notvery: ["dark"],
    none: ["normal"],
  },
  dragon: {
    super: ["dragon"],
    notvery: ["steel"],
    none: ["fairy"],
  },
  dark: {
    super: ["psychic", "ghost"],
    notvery: ["fighting", "dark", "fairy"],
    none: [],
  },
  steel: {
    super: ["ice", "rock", "fairy"],
    notvery: ["fire", "water", "electric", "steel"],
    none: [],
  },
  fairy: {
    super: ["fighting", "dragon", "dark"],
    notvery: ["steel", "fire", "poison"],
    none: [],
  },
};

const calcDamage = (atkr, target, move, weather) => {
  //aktr => attacker
  console.log(atkr.name + " used " + move.name);
  let msg = "";
  let attack = 0;
  let defense = 0;
  if (move.movetype === "phys") {
    attack = (atkr.stats.atk * atkr.buffs.atk.u) / atkr.buffs.atk.d;
    defense = (target.stats.def * target.buffs.def.u) / target.buffs.def.d;
  } else if (move.movetype === "spec") {
    attack = (atkr.stats.spa * atkr.buffs.spa.u) / atkr.buffs.spa.d;
    defense = (target.stats.spd * target.buffs.spd.u) / target.buffs.spd.d;
  } else {
    throw "Error: wrong move type";
  }

  let lvl = 0;
  if (atkr.hasOwnProperty("lvl")) {
    lvl = atkr.lvl;
  } else {
    lvl = Math.floor(Math.cbrt((atkr.exp * 5) / 4));
  }
  //console.log(lvl, move.power, attack, defense);

  const modifier = (atkr, target, move) => {
    //modifier=0.75 for double battles, no plans to integrate right now
    /*Weather is 1.5 if a Water-type move is being used during rain or a Fire-type move during harsh sunlight, 
    and 0.5 if a Water-type move is used during harsh sunlight or a Fire-type move during rain, and 1 otherwise.*/
    let w = 1;
    if (weather === "rain") {
      if (move.type === "water") {
        w = 1.5;
        console.log("weatherbuffed " + move.name);
      }
      if (move.type === "fire") {
        w = 0.5;
        console.log("weatherbuffed " + move.name);
      }
    }
    if (
      move.hasOwnProperty("weatherBuff") &&
      move.weatherBuff.weather === weather
    ) {
      w = move.weatherBuff.buff;
      console.log("weatherbuffed " + move.name);
    }

    //critical hit:
    let crit = 1;
    if (move.name !== "HitHimself") {
      let r = Math.random();
      if (move.hasOwnProperty("critRate")) {
        r = r * move.critRate;
      }
      if (r > 15 / 16) {
        console.log("golpe critico");
        msg = msg.concat(" Critical Hit!");
        crit = 2;
      }
    }
    //hold item:
    let item = 1;
    if (atkr.hasOwnProperty("held")) {
      if (atkr.held.hasOwnProperty("boost") && atkr.held.boost === move.type) {
        item = atkr.held.factor;
        console.log(
          "attack boosted by " + move.name + " to " + atkr.held.factor
        );
      }
    } else {
      console.log("Where is the fuckin item???");
    }

    //random factor
    let randomfactor = Math.random() * (1 - 0.85) + 0.85;

    let stab = 1;
    let effectiveness = 1;
    if (move.hasOwnProperty("type") && move.type !== "none") {
      //STAB
      if (atkr.type === move.type) {
        console.log("STAAAAB");
        stab = 1.5;
      }

      if (atkr.hasOwnProperty("type2") && atkr.type2 === move.type) {
        console.log("STAAAAB");
        stab = 1.5;
      }

      //effectiveness
      if (typeChart[move.type].super.includes(target.type)) {
        console.log(move.name + " is super effective against " + target.name);
        effectiveness *= 2;
      } else if (typeChart[move.type].notvery.includes(target.type)) {
        console.log(
          move.name + " is not very effective against " + target.name
        );
        effectiveness *= 0.5;
      } else if (typeChart[move.type].none.includes(target.type)) {
        console.log(move.name + " has no effect on " + target.name);
        effectiveness = 0;
      }
      if (target.hasOwnProperty("type2")) {
        if (typeChart[move.type].super.includes(target.type2)) {
          console.log(move.name + " is super effective against " + target.name);
          effectiveness *= 2;
        } else if (typeChart[move.type].notvery.includes(target.type2)) {
          console.log(
            move.name + " is not very effective against " + target.name
          );
          effectiveness *= 0.5;
        } else if (typeChart[move.type].none.includes(target.type2)) {
          console.log(move.name + " has no effect on " + target.name);
          effectiveness = 0;
        }
      }
    }
    //burn
    let burn = 1;
    if (atkr.status === "burned") burn = 0.5;

    if (effectiveness === 0) {
      msg = " It doesnt affect " + target.name + ".";
    } else if (effectiveness < 1) {
      msg = msg.concat(" Its not very effective.");
    } else if (effectiveness > 1) {
      msg = msg.concat(" Its super effective.");
    }

    let modifier = crit * randomfactor * stab * effectiveness * burn * w * item;
    /*console.log(
      "random: " +
        randomfactor +
        " stab: " +
        stab +
        " effective: " +
        effectiveness +
        " burn: " +
        burn
    );
    console.log("modifier:" + modifier);*/
    return modifier;
  };
  let dmg = parseInt(
    ((0.6 * lvl * move.power * (attack / defense)) / 50 + 2) *
      modifier(atkr, target, move)
  );

  const hp = target.currentHP - dmg;

  console.log(
    target.name + " took " + dmg + " damage and has " + hp + "hp left"
  );
  console.log(msg);
  //Return the HP the opponent has left
  if (hp > 0) return { msg: msg, hp: hp, dmg: dmg };
  else return { msg: msg, hp: 0, dmg: target.currentHP };
};

export default calcDamage;
