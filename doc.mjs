import { CustomElementManifestGenerator } from 'wc-info/doc.js';
import { resolve } from "path";
const cemg = new CustomElementManifestGenerator(resolve("types.d.ts"), 'Package', console.log);
