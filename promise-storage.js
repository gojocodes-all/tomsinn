const promiseStorage = (() => {
  const key = "tomisinFriendshipPromise";

  function getStorage() {
    return globalThis.localStorage;
  }

  function accept(storageProvider = getStorage) {
    try {
      storageProvider().setItem(key, "accepted");
      return true;
    } catch {
      return false;
    }
  }

  function isAccepted(storageProvider = getStorage) {
    try {
      return storageProvider().getItem(key) === "accepted";
    } catch {
      return false;
    }
  }

  return Object.freeze({ accept, isAccepted });
})();
