/* global titleContainer, descriptionsContainer, choicesContainer */
let arrayOfChoices = [];
let engine = {
  setTitle: function (title) {
    document.title = title;
    titleContainer.innerText = title;
  },

  clearDescriptions: function () {
    descriptionsContainer.innerText = "";
  },

  addDescription: function (text, tags) {
    let p = document.createElement("p");
    p.innerHTML = text;
    for (let tag of tags || []) {
      p.classList.add(tags);
    }
    descriptionsContainer.appendChild(p);
  },

  clearChoices: function () {
    choicesContainer.innerText = "";
  },

  addChoice: function (text, onClick, tags) {
    let button = document.createElement("button");
    button.innerHTML = text;
    button.onclick = onClick;
    button.id = "choice";
    for (let tag of tags || []) {
      button.classList.add(tag);
    }
    choicesContainer.appendChild(button);
  },
  createRecord: function (text) {
    arrayOfChoices.push(text);
    console.log(arrayOfChoices);
    document.getElementById('players_choices').value = arrayOfChoices;
  },

  setBackground: function (url_tag) {
    /*  console.log(url_tag);*/
    descriptionsContainer.style.backgroundImage = url_tag;
  },
  setFontColor: function (color_tag) {
    /*console.log(color_tag);*/
    descriptionsContainer.style.color = color_tag;
  },
};
