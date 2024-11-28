#!/usr/bin/env node

import { generateChangelog } from "./lib/index.js";


const write = process.argv[2];

console.log(generateChangelog({write: write ? true : false}));