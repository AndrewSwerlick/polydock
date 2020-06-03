import sucrase from "@rollup/plugin-sucrase"
import resolve from "@rollup/plugin-node-resolve"
import replace from "@rollup/plugin-replace"
// import { terser } from "rollup-plugin-terser"
import path from "path"
import { chmodSync } from "fs"
import copy from "rollup-plugin-copy"

function executable() {
  let file
  return {
    generateBundle(options) {
      file = options.file
    },

    writeBundle() {
      if (file) chmodSync(file, 0o751)
    },
  }
}

const externals = new Map()

export default {
  input: "src/index.ts",
  output: {
    file: "dist/bin/polydock",
    banner: () => {
      let ret = `#!/usr/bin/gjs`
      for (const [lib, version] of externals.entries()) {
        ret += `\nimports.gi.versions.${lib} = "${version}"`
      }
      return ret
    },
    format: "iife",
    /**
     * @param {string} id
     */
    globals: (id) => `imports.gi.${path.basename(id).replace(/-.*/u, "")}`,
  },
  /**
   * @param {string} id
   */
  external: (id) => {
    const m = id.match(/^\.\/types\/(.*)-(\d+.\d+)/u)
    if (m) {
      externals.set(m[1], m[2])
      return true
    }
    return false
  },
  plugins: [
    replace({ "console.log": "log" }),
    resolve({
      extensions: [".js", ".ts"],
    }),
    sucrase({
      production: false,
      exclude: ["node_modules/**"],
      transforms: ["typescript"],
    }),
    // terser(),
    executable(),
    copy({
      targets: [{ src: "config/*", dest: "dist/config/" }],
    }),
  ],
}
