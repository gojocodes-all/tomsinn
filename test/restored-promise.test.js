const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const source = fs.readFileSync(
  path.join(__dirname, "..", "script.js"),
  "utf8"
);

class FakeClassList {
  constructor() {
    this.values = new Set();
  }

  add(value) {
    this.values.add(value);
  }

  contains(value) {
    return this.values.has(value);
  }

  toggle(value) {
    if (this.contains(value)) this.values.delete(value);
    else this.add(value);
  }
}

class FakeElement {
  constructor({ hidden = false } = {}) {
    this.attributes = new Map();
    this.classList = new FakeClassList();
    this.hidden = hidden;
    this.listeners = new Map();
    this.style = {};
  }

  addEventListener(type, listener) {
    this.listeners.set(type, listener);
  }

  getBoundingClientRect() {
    return { width: 300, height: 200 };
  }

  querySelector() {
    return new FakeElement();
  }

  scrollIntoView() {}

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }
}

test("a remembered promise reveals the story and its restored ending", () => {
  const openLetterButton = new FakeElement();
  const story = new FakeElement({ hidden: true });
  const finalSection = new FakeElement({ hidden: true });
  const revealSections = [new FakeElement(), new FakeElement()];
  const selectors = new Map([
    ["#openLetter", openLetterButton],
    ["#story", story],
    ["#progressBar", new FakeElement()],
    ["#noButton", new FakeElement()],
    ["#yesButton", new FakeElement()],
    ["#buttonStage", new FakeElement()],
    ["#buttonComment", new FakeElement()],
    ["#finalSection", finalSection],
    ["#savePromise", new FakeElement()],
    ["#confettiCanvas", new FakeElement()]
  ]);

  const document = {
    querySelector(selector) {
      return selectors.get(selector);
    },
    querySelectorAll(selector) {
      return selector === ".reveal" ? revealSections : [];
    }
  };
  const window = {
    addEventListener() {},
    matchMedia() {
      return { matches: true };
    },
    setTimeout() {}
  };

  vm.runInNewContext(source, {
    document,
    promiseStorage: {
      accept() {},
      isAccepted() {
        return true;
      }
    },
    window
  });

  assert.equal(story.hidden, false);
  assert.equal(finalSection.hidden, false);
  assert.equal(openLetterButton.classList.contains("opening"), true);
  assert.equal(openLetterButton.attributes.get("aria-label"), "Letter opened");
  assert.equal(
    revealSections.every((section) => section.classList.contains("visible")),
    true
  );
});
