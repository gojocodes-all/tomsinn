const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const source = fs.readFileSync(
  path.join(__dirname, "..", "script.js"),
  "utf8"
);
const html = fs.readFileSync(
  path.join(__dirname, "..", "index.html"),
  "utf8"
);

test("note cards define an accessible initial state in the document", () => {
  assert.equal(
    (html.match(/class="note" type="button" aria-pressed="false"/g) ?? []).length,
    4
  );
  assert.equal(
    (html.match(/class="note-back" aria-hidden="true"/g) ?? []).length,
    4
  );
});

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

  toggle(value, force) {
    if (force === true) {
      this.add(value);
      return true;
    }

    if (force === false) {
      this.values.delete(value);
      return false;
    }

    if (this.contains(value)) {
      this.values.delete(value);
      return false;
    }

    this.add(value);
    return true;
  }
}

class FakeElement {
  constructor(children = {}) {
    this.attributes = new Map();
    this.children = children;
    this.classList = new FakeClassList();
    this.hidden = false;
    this.listeners = new Map();
    this.style = {};
  }

  addEventListener(type, listener) {
    this.listeners.set(type, listener);
  }

  getBoundingClientRect() {
    return { width: 300, height: 200 };
  }

  querySelector(selector) {
    return this.children[selector] ?? new FakeElement();
  }

  scrollIntoView() {}

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }
}

test("note cards expose only the visible face and keep pressed state in sync", () => {
  const front = new FakeElement();
  const back = new FakeElement();
  const note = new FakeElement({
    ".note-front": front,
    ".note-back": back
  });
  const selectors = new Map([
    ["#openLetter", new FakeElement()],
    ["#story", new FakeElement()],
    ["#progressBar", new FakeElement()],
    ["#noButton", new FakeElement()],
    ["#yesButton", new FakeElement()],
    ["#buttonStage", new FakeElement()],
    ["#buttonComment", new FakeElement()],
    ["#finalSection", new FakeElement()],
    ["#savePromise", new FakeElement()],
    ["#confettiCanvas", new FakeElement()]
  ]);
  const document = {
    querySelector(selector) {
      return selectors.get(selector);
    },
    querySelectorAll(selector) {
      return selector === ".note" ? [note] : [];
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
        return false;
      }
    },
    window
  });

  assert.equal(note.attributes.get("aria-pressed"), "false");
  assert.equal(front.attributes.get("aria-hidden"), "false");
  assert.equal(back.attributes.get("aria-hidden"), "true");

  note.listeners.get("click")();

  assert.equal(note.classList.contains("open"), true);
  assert.equal(note.attributes.get("aria-pressed"), "true");
  assert.equal(front.attributes.get("aria-hidden"), "true");
  assert.equal(back.attributes.get("aria-hidden"), "false");

  note.listeners.get("click")();

  assert.equal(note.classList.contains("open"), false);
  assert.equal(note.attributes.get("aria-pressed"), "false");
  assert.equal(front.attributes.get("aria-hidden"), "false");
  assert.equal(back.attributes.get("aria-hidden"), "true");
});
