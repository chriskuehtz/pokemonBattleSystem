const applyStatusDamage = (team) => {
  let p = team[0];
  let msg = "no damage";
  if (p.status === "poisoned" || p.status === "burned") {
    msg = "took damage";
    let div = 1;
    if (p.status === "poisoned") div = 16;
    else if (p.status === "burned") div = 8;

    p.currentHP - parseInt(p.stats.hp / div) > 0
      ? (p.currentHP -= parseInt(p.stats.hp / div))
      : (p.currentHP = 0);
    console.log(
      p.name +
        " took " +
        parseInt(p.stats.hp / div) +
        " damage from being " +
        p.status +
        " and has " +
        p.currentHP +
        " left"
    );
  }
  team[0] = p;
  let newTeam = [].concat(team);
  return { msg: msg, team: newTeam };
};
export default applyStatusDamage;
