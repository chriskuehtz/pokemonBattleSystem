const checkAttack = (p, a1) => {
  let r = Math.random();
  if (p.status === "paralyzed" && r < 0.25) {
    return { msg: p.name + " is fully paralyzed", score: 1 };
  } else if (p.status === "asleep") {
    return { msg: p.name + " is fast asleep", score: 1 };
  } else if (p.status === "frozen") {
    return { msg: p.name + " is frozen solid", score: 1 };
  } else if (p.hasOwnProperty("confused") && r < 0.5) {
    return { msg: p.name + " is confused", score: -1 };
  } else if (p.hasOwnProperty("confused")) {
    return { msg: p.name + " is confused", score: -2 };
  } else {
    return { msg: p.name + " can use " + a1.name, score: 0 };
  }
};
export default checkAttack;
