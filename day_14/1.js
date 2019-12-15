const { puzzleInput, testInputs } = require('./input');
const FUEL = 'FUEL';
const ORE = 'ORE';

// todo: need to re-use waste.

// testInputs.forEach(ti => console.log(solve(ti.input)));
console.log(solve(testInputs[3].input));
// console.log(solve(puzzleInput));

function solve(input) {
  const reactions = toReactions(input);
  const oreReactions = reactions.filter(r => r.inputs[0].name === ORE);
  const fuelReaction = reactions.find(r => r.output.name === FUEL);
  const chemsRequired = getChemsRequired(reactions, fuelReaction, 1, {});
  const chemsRequired2 = getChemsRequired2(reactions, fuelReaction, 1, 0, {});

  const res = oreReactions.reduce((acc, r) => {
    const neededAmount = chemsRequired[r.output.name];
    const producedAmount = Math.ceil(neededAmount / r.output.amount) * r.inputs[0].amount;

    return acc + producedAmount;
  }, 0);

  const res2 = oreReactions.reduce((acc, r) => {
    const neededAmount = chemsRequired2[r.output.name].amount;
    const producedAmount = Math.ceil(neededAmount / r.output.amount) * r.inputs[0].amount;

    return acc + producedAmount;
  }, 0);

  return [res, res2];
}

function getChemsRequired(reactions, reaction, multiplier, res) {
  return reaction.inputs.reduce((acc, chem) => {
    if (chem.name === ORE) {
      return acc;
    }

    acc[chem.name] = acc[chem.name] || 0;
    acc[chem.name] += (chem.amount * multiplier);

    const nextReaction = reactions.find(r => r.output.name === chem.name);

    return getChemsRequired(reactions, nextReaction, multiplier * Math.ceil(chem.amount / nextReaction.output.amount), acc);
  }, res);
}

function getChemsRequired2(reactions, reaction, multiplier, wasteMultiplier, res) {
  return reaction.inputs.reduce((acc, chem) => {
    if (chem.name === ORE) {
      return acc;
    }

    acc[chem.name] = acc[chem.name] || { amount: 0, waste: [] };
    acc[chem.name].amount += (chem.amount * multiplier);
    acc[chem.name].waste.push(chem.amount * wasteMultiplier);

    const nextReaction = reactions.find(r => r.output.name === chem.name);
    const nextMultiplier = Math.ceil(chem.amount * multiplier / nextReaction.output.amount);
    const nextWasteMultiplier = Math.floor(chem.amount * multiplier / nextReaction.output.amount);

    return getChemsRequired2(reactions, nextReaction, nextMultiplier, nextWasteMultiplier, acc);
  }, res);
}

function toReactions(input) {
  return input.split('\n').map(l => {
    const chems = l.match(/\d+ \w+/gi).map(c => {
      const [amount, name] = c.split(' ');
      return {
        amount: +amount,
        name
      };
    });
    const inputs = chems.slice(0, chems.length - 1);
    const output = chems[chems.length - 1];

    return {
      output,
      inputs
    };
  });
}