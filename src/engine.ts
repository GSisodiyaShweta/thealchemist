import * as yaml from 'js-yaml';


export type HasPreconditions = {
  with?: string[];
  without?: string[];
}

export type ChoiceData = {
  text: string;
  target: string;
  narration: string;
  tags?: string[];
} & HasPreconditions;

export type DialogData = {
  text: string;
  tags?: string[];
} & HasPreconditions;

export type StoryMetadata = {
  title: string;
  author: string;
  email: string;
}

export type StoryNode = {
  bg_tag: string;
  provides?: string[];
  consumes?: string[];
  color_tag?: string;
  descriptions: DialogData[];
  choices: ChoiceData[];
  background: {
    url_tags: string[];
  }[];
}

export type StoryData = {
  metadata: StoryMetadata;
  initially: {
    description: string;
    location: string;
    inventory: string[];
  };
  locations: {
    [key: string]: StoryNode
  };
}

function getElement<T>(id: string): T {
  const elem = document.getElementById(id) as T;

  if (elem === null)
    throw new Error(`Div with id '${id}' not found.`)

  return elem;
}

export class Engine {
  /** Choices currently presented to the player */
  private choices: ChoiceData[];

  /** The player's previous choices */
  private choiceHistory: string[];

  /** Names of items currently in the player's inventory */
  private playerInventory: Set<string>;

  /** Reference to description text div */
  private descriptionText: HTMLDivElement;

  /** Reference to div containing choice buttons */
  private choicesContainer: HTMLDivElement;

  /** Reference to div containing choice container */
  private choicesOverlay: HTMLDivElement;

  /** Reference to the div containing the entire game */
  private gameContainer: HTMLDivElement;

  /** The story data */
  private story: StoryData;

  constructor(storyText: string) {
    this.story = yaml.load(storyText) as StoryData;
    this.choices = [];
    this.playerInventory = new Set<string>();
    this.choiceHistory = [];
    this.descriptionText = getElement<HTMLDivElement>("description-text");
    this.choicesContainer = getElement<HTMLDivElement>("choices-container");
    this.gameContainer = getElement<HTMLDivElement>("game-container");
    this.choicesOverlay = getElement<HTMLDivElement>("choices-overlay");
  }

  /** Start the story */
  start(): void {
    this.setChoicesVisible(false);
    this.setTitle(this.story.metadata.title);
    this.playerInventory = new Set(this.story.initially.inventory);
    this.arrive(this.story.initially.location, this.story.initially.description);
  }

  /** Set the title of the story in the document */
  setTitle(title: string): void {
    document.title = title;
  }

  /** Clear the text box */
  clearDescriptionText(): void {
    this.descriptionText.innerHTML = "";
  }

  /** Set the text box text */
  setDescriptionText(text: string, tags: string[] = []): void {
    let p = document.createElement("p");
    p.innerHTML = text;
    for (let tag of tags || []) {
      p.classList.add(tag);
    }
    this.descriptionText.appendChild(p);
  }

  /** Toggle if choices are visible */
  setChoicesVisible(visible: boolean): void {
    if (visible) {
      this.choicesOverlay.style.display = "flex"
    } else {
      this.choicesOverlay.style.display = "none";
    }
  }

  /** Adds a choice button */
  addChoice(text: string, onClick: () => void, tags: string[]): void {
    const button = document.createElement("button");

    button.innerText = text;

    button.onclick = onClick;

    button.id = "choice";

    for (let tag of tags || []) {
      button.classList.add(tag);
    }

    button.classList.add('btn');
    button.classList.add('btn-primary');

    this.choicesContainer.appendChild(button);
  }

  /** Removes all the displayed choice buttons */
  clearChoices(): void {
    let child = this.choicesContainer.firstElementChild;
    while (child !== null) {
      child.remove();
      child = this.choicesContainer.firstElementChild;
    }
  }

  /** Records the players last choice */
  recordPlayerChoice(text: string): void {
    this.choiceHistory.push(text);
    console.log(this.choiceHistory);
  }

  /** Changes the background of the game */
  setBackground(url_tag: string): void {
    this.gameContainer.style.backgroundImage = url_tag;
  }

  /** Changes the font used in the text box */
  setFontColor(color_tag: string): void {
    this.descriptionText.style.color = color_tag;
  }

  /** Change to the story node mapped to the given target name */
  arrive(target: string, initialDescription: string) {
    this.clearDescriptionText();

    this.setDescriptionText(initialDescription);

    let currentTarget = this.story.locations[target];
    this.updateInventory(currentTarget);
    this.setBackground(currentTarget.bg_tag);

    // if (currentTarget.color_tag !== undefined) {
    //   this.setFontColor(currentTarget.color_tag);
    // }

    let currentTargetDescription = currentTarget.descriptions;

    // This sets the description to the last description with passing preconditions
    currentTargetDescription.forEach((description) => {
      if (this.conditionsHold(description)) {
        this.setDescriptionText(description.text, description.tags);
      }
    });

    let currentTargetChoices = currentTarget.choices;
    this.clearChoices();

    let availableChoices = 0;

    currentTargetChoices.forEach((choiceText) => {
      if (this.conditionsHold(choiceText)) {
        availableChoices += 1;
        this.addChoice(
          choiceText.text,
          () => {
            this.arrive(choiceText.target, choiceText.narration);
            console.log(choiceText.text);
            this.choiceHistory.push(choiceText.text);
            this.recordPlayerChoice(choiceText.text);
          },
          choiceText.tags || []
        );
      }
    });

    this.setChoicesVisible(availableChoices > 0);
  }

  /** Check if the player meets the provided inventory preconditions */
  conditionsHold(obj: HasPreconditions): boolean {

    if (obj.with !== undefined) {
      for (const item of obj.with) {
        if (!this.playerInventory.has(item)) {
          return false;
        }
      }
    }

    if (obj.without !== undefined) {
      for (const item of obj.without) {
        if (this.playerInventory.has(item)) {
          return false;
        }
      }
    }

    return true;
  }

  /** Update the player's inventory based on the current story node */
  updateInventory(node: StoryNode) {
    if (node.provides !== undefined) {
      for (const item of node.provides) {
        this.playerInventory.add(item);
      }
    }

    if (node.consumes !== undefined) {
      for (const item of node.consumes) {
        this.playerInventory.delete(item);
      }
    }
  }
}
