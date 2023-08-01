/* global jsyaml, engine */

let story;
let inventory;
let counter1 = 0;
let counter2 = 0;
let counter3 = 0;
const arrayOfPlayersChoices = [];
let end_counter = false;

fetch("story.yaml")
  .then((res) => res.text())
  .then(start);

function start(storyText) {
  story = jsyaml.load(storyText);

  engine.setTitle(story["metadata"]["title"]);
  inventory = new Set(story["initially"]["inventory"]);

  arrive(story["initially"]["location"], story["initially"]["description"]);
  if(end_counter == true){
    record_button;
  }


}

function arrive(target, initialDescription) {
  engine.clearDescriptions();

  engine.addDescription(initialDescription);

  let currentTarget = story["locations"][target];
  updateInventory(currentTarget);
  engine.setBackground(currentTarget["bg_tag"]);
  engine.setFontColor(currentTarget["color_tag"]);
  let currentTargetDescription = currentTarget["descriptions"];

  currentTargetDescription.forEach((description) => {
    if (conditionsHold(description)) {
      engine.addDescription(description.text, description.tags);
    }
  });

  /*console.log(currentTarget["choices"])*/
  let currentTargetChoices = currentTarget["choices"];
  engine.clearChoices();
  currentTargetChoices.forEach((choiceText) => {
    if (conditionsHold(choiceText)) {
      engine.addChoice(
        choiceText.text,
        () => {
          arrive(choiceText.target, choiceText.narration);
          console.log(choiceText.text);
          arrayOfPlayersChoices.push(choiceText.text);
          //console.log(arrayOfPlayersChoices);
          engine.createRecord(choiceText.text);
          // if (arrayOfPlayersChoices.indexOf("SHOOT") >= 0) {
          //   console.log("!!!");
          //   end_counter = true;
          // }
        },
        [choiceText.tags] /*tags*/
      );
    }
  });
}

function all(arrR, setT) {
  let arrSet = new Set(arrR);
  for (let a of arrSet) {
    if (!setT.has(a)) {
      return false;
    }
  }
  return true;
}

function conditionsHold(obj) {
  let withArray = obj["with"];
  let withoutArray = obj["without"];
  let results = true;

  inventory.forEach((inventoryElement) => {
    if (typeof withArray !== "undefined") {
      if (!all(withArray, inventory)) {
        results = false;
      }
    }
    if (typeof withoutArray !== "undefined") {
      if (all(withoutArray, inventory)) {
        results = false;
      }
    }
  });
  return results;
}

function updateInventory(modify) {
  let modifyProvides = modify["provides"];
  let modifyConsume = modify["consumes"];
  if (typeof modifyProvides !== "undefined") {
    modifyProvides.forEach(inventory.add, inventory);
  }
  if (typeof modifyConsume !== "undefined") {
    modifyConsume.forEach(inventory.delete, inventory);
  }
}

function record_button() {
  let _button = document.createElement("button");
  _button.data = "hi";
  _button.innerHTML = "click me";
  _button.onclick = function () {
    alert("hello, world");
  };
}

function save_choices(text) {
  $.ajax({
    url: "save_choices",
    data: { choices: text },
    type: "POST",
  }).done(function (response) {
    console.log(response);
  });
  console.log("text");
  console.log("Done!");
}
