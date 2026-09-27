const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const source = fs.readFileSync(
  path.join(__dirname, "..", "promise-storage.js"),
  "utf8"
);
const context = vm.createContext({});
vm.runInContext(source, context);
const promiseStorage = vm.runInContext("promiseStorage", context);

test("stores and reads an accepted promise", () => {
  const values = new Map();
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value)
  };
  const provideStorage = () => storage;

  assert.equal(promiseStorage.isAccepted(provideStorage), false);
  assert.equal(promiseStorage.accept(provideStorage), true);
  assert.equal(promiseStorage.isAccepted(provideStorage), true);
});

test("continues safely when browser storage is unavailable", () => {
  const unavailableStorage = () => {
    throw new Error("storage blocked");
  };

  assert.equal(promiseStorage.accept(unavailableStorage), false);
  assert.equal(promiseStorage.isAccepted(unavailableStorage), false);
});

test("continues safely when browser storage operations fail", () => {
  const storage = {
    getItem: () => {
      throw new Error("read blocked");
    },
    setItem: () => {
      throw new Error("write blocked");
    }
  };

  assert.equal(promiseStorage.accept(() => storage), false);
  assert.equal(promiseStorage.isAccepted(() => storage), false);
});
