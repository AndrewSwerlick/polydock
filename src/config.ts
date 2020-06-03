/* eslint-disable @typescript-eslint/ban-ts-comment */
import GLib from "./types/GLib-2.0"
import { fileExists, resolve } from "./util"

export type WindowGrouping = "class" | "instance" | "title" | "visibility"

const defaults = {
  appearance: {
    position: "top" as "top" | "bottom" | "left" | "right",
    alignment: "center" as "start" | "center" | "end",
    offsetX: 0,
    offsetY: 0,
    iconSize: 40,
    theme: "default",
  },
  behaviour: {
    groupBy: ["instance", "visibility"] as WindowGrouping[],
    activeWorkspaceOnly: false,
    showHidden: true,
    showVisible: true,
    unhideCommand: "bspc node {window} -g hidden=off -f",
  },
  icons: {
    "google-agenda": "calendar.google.com",
    gmail: "mail.google.com",
    keep: "keep.google.com",
    messengerfordesktop: "www.messenger.com",
    whatsapp: "whatsapp",
  } as Record<string, string>,
}

export type Settings = typeof defaults

class Config {
  path: string
  settings: Settings
  theme: string
  file?: string

  constructor() {
    this.settings = { ...defaults }
    this.path = GLib.path_get_dirname(imports.system.programInvocationName)
    this.path = resolve(GLib.path_get_dirname(this.path))
    this.theme = resolve(`${this.path}/config/theme.css`)
    this.update()
  }

  update() {
    this.load(`${GLib.get_user_config_dir()}/polydock/settings.ini`) ||
      this.load(`${this.path}/config/settings.ini`)
    if (fileExists(this.settings.appearance.theme)) {
      this.theme = this.settings.appearance.theme
    }
    log(`[theme] ${this.theme}`)
  }

  load(file: string): boolean {
    file = resolve(file)
    if (!fileExists(file)) return false
    log(`[settings] ${file}`)
    this.file = file
    const ini = GLib.KeyFile.new()
    ini.load_from_file(file, GLib.KeyFileFlags.KEEP_COMMENTS)
    for (const [group, items] of Object.entries(this.settings)) {
      if (!ini.has_group(group)) continue
      let entries = Object.entries(items)
      if (group == "icons")
        entries = (ini.get_keys("icons")?.[0] || []).map((x) => [x, ""])
      const [haveKeys] = ini.get_keys(group)
      for (const [key, value] of entries) {
        if (!haveKeys || !haveKeys.includes(key)) continue

        const data = ini.get_value(group, key)
        if (data) {
          if (Array.isArray(value)) {
            // @ts-ignore
            this.settings[group][key] = ini.get_string_list(group, key)
          } else if (typeof value == "boolean")
            // @ts-ignore
            this.settings[group][key] = ini.get_boolean(group, key)
          else if (typeof value == "number")
            // @ts-ignore
            this.settings[group][key] = ini.get_integer(group, key)
          // @ts-ignore
          else this.settings[group][key] = ini.get_string(group, key)
        }
      }
    }
    return true
  }

  dump() {
    const ini = GLib.KeyFile.new()
    for (const [group, items] of Object.entries(this.settings)) {
      for (const [key, value] of Object.entries(items)) {
        if (Array.isArray(value)) ini.set_string_list(group, key, value)
        else ini.set_string(group, key, `${value}`)
      }
    }

    ini.set_comment(
      "appearance",
      "offsetX",
      "Addtional offsets to further fine-tune the position of the dock"
    )
    ini.set_comment("appearance", "position", "One of top, bottom, left, right")
    ini.set_comment("appearance", "alignment", "One of start, center, end")
    ini.set_string("appearance", "theme", this.theme)
    ini.set_comment(
      "appearance",
      "theme",
      `Full path to a css file, or 'default'.\nSee ${this.theme}`
    )
    ini.set_comment(
      "behaviour",
      "groupBy",
      "Specifiy a list of keys to group windows on: class;instance;title;visibility"
    )
    ini.set_comment(
      "icons",
      // eslint-disable-next-line unicorn/no-null
      null,
      `Rules for custom icons matching the class::instance of windows
icon-name=string to be part of class::instance`
    )
    return ini.to_data()[0]
  }
}

if (ARGV.includes("--help") || ARGV.includes("-h")) {
  print(`usage: polydock
--dump-config
  Prints the current config. Change in ~/.config/polydock/settings.ini`)
  imports.system.exit(0)
}

const config = new Config()
config.dump()

if (ARGV.includes("--dump-config")) {
  print(config.dump())
  imports.system.exit(0)
}

export default config
