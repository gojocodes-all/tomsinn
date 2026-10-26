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

  toggle(value, force) {
    if (force === false) {
      this.values.delete(value);
      return false;
    }

    this.values.add(value);
    return true;
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

  getContext() {
    return {
      clearRect() {},
      fillRect() {},
      restore() {},
      rotate() {},
      save() {},
      scale() {},
      translate() {}
    };
  }

  querySelector() {
    return new FakeElement();
  }

  scrollIntoView() {}

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }
}

test("promise acceptance locks both answers and celebrates only once", () => {
  const yesButton = new FakeElement();
  const noButton = new FakeElement();
  const buttonComment = new FakeElement();
  const finalSection = new FakeElement({ hidden: true });
  const confettiCanvas = new FakeElement();
  const selectors = new Map([
    ["#openLetter", new FakeElement()],
    ["#story", new FakeElement({ hidden: true })],
    ["#progressBar", new FakeElement()],
    ["#noButton", noButton],
    ["#yesButton", yesButton],
    ["#buttonStage", new FakeElement()],
    ["#buttonComment", buttonComment],
    ["#finalSection", finalSection],
    ["#savePromise", new FakeElement()],
    ["#confettiCanvas", confettiCanvas]
  ]);

  let acceptCalls = 0;
  let animationFrames = 0;
  const document = {
    createElement() {
      return new FakeElement();
    },
    documentElement: { scrollHeight: 0 },
    querySelector(selector) {
      return selectors.get(selector);
    },
    querySelectorAll() {
      return [];
    }
  };
  const window = {
    addEventListener() {},
    devicePixelRatio: 1,
    innerHeight: 800,
    innerWidth: 1200,
    matchMedia() {
      return { matches: false };
    },
    scrollY: 0,
    setTimeout(callback) {
      callback();
    }
  };

  vm.runInNewContext(source, {
    document,
    Math,
    promiseStorage: {
      accept() {
        acceptCalls += 1;
      },
      isAccepted() {
        return false;
      }
    },
    requestAnimationFrame() {
      animationFrames += 1;
    },
    window
  });

  const accept = yesButton.listeners.get("click");
  accept();
  accept();

  assert.equal(finalSection.hidden, false);
  assert.equal(yesButton.disabled, true);
  assert.equal(noButton.disabled, true);
  assert.equal(yesButton.textContent, "Promise accepted ✓");
  assert.equal(
    buttonComment.textContent,
    "Promise accepted. The answer is locked in."
  );
  assert.equal(acceptCalls, 1);
  assert.equal(animationFrames, 1);
});
