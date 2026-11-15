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
  add() {}
  contains() {
    return false;
  }
  toggle() {
    return false;
  }
}

class FakeElement {
  constructor() {
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

  querySelector() {
    return new FakeElement();
  }

  scrollIntoView() {}
  setAttribute() {}
}

function createProgressHarness() {
  const progressBar = new FakeElement();
  const selectors = new Map([
    ["#openLetter", new FakeElement()],
    ["#story", new FakeElement()],
    ["#progressBar", progressBar],
    ["#noButton", new FakeElement()],
    ["#yesButton", new FakeElement()],
    ["#buttonStage", new FakeElement()],
    ["#buttonComment", new FakeElement()],
    ["#finalSection", new FakeElement()],
    ["#savePromise", new FakeElement()],
    ["#confettiCanvas", new FakeElement()]
  ]);
  const document = {
    documentElement: { scrollHeight: 0 },
    querySelector(selector) {
      return selectors.get(selector);
    },
    querySelectorAll() {
      return [];
    }
  };
  const listeners = new Map();
  const window = {
    addEventListener(type, listener) {
      listeners.set(type, listener);
    },
    innerHeight: 0,
    matchMedia() {
      return { matches: true };
    },
    scrollY: 0,
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

  return {
    update({ scrollHeight, scrollY, viewportHeight }) {
      document.documentElement.scrollHeight = scrollHeight;
      window.innerHeight = viewportHeight;
      window.scrollY = scrollY;
      listeners.get("scroll")();
      return progressBar.style.width;
    }
  };
}

test("reading progress remains within its visual 0–100 percent range", () => {
  const progress = createProgressHarness();

  assert.equal(
    progress.update({ scrollHeight: 800, scrollY: 0, viewportHeight: 800 }),
    "0%"
  );
  assert.equal(
    progress.update({ scrollHeight: 1600, scrollY: -48, viewportHeight: 800 }),
    "0%"
  );
  assert.equal(
    progress.update({ scrollHeight: 1600, scrollY: 400, viewportHeight: 800 }),
    "50%"
  );
  assert.equal(
    progress.update({ scrollHeight: 1600, scrollY: 920, viewportHeight: 800 }),
    "100%"
  );
});
