import { writable } from "svelte/store";

let darkmodeActive
let darkmodeValue

const PollStore = writable([
        darkmodeActive = false,
        darkmodeValue = 0
    ]);

export default PollStore;