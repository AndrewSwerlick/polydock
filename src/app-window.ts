import config from "./config"
import { Dock } from "./dock"
import Gdk from "./types/Gdk-3.0"
import Gtk from "./types/Gtk-3.0"
import Wnck from "./types/Wnck-3.0"

export class AppWindow {
  window: Gtk.ApplicationWindow
  dock: Dock
  hidden = true

  constructor(application: Gtk.Application) {
    const win = new Gtk.ApplicationWindow({
      title: "Polydock",
      type: Gtk.WindowType.TOPLEVEL,
      application,
    })
    this.window = win

    win.set_wmclass("polydock", "Polydock")
    win.get_style_context().add_class("top")
    win.set_decorated(false)
    win.set_type_hint(Gdk.WindowTypeHint.DOCK)
    win.stick()
    win.set_keep_above(true)
    win.set_skip_taskbar_hint(true)
    win.connect("destroy", () => Gtk.main_quit())
    win.connect("delete-event", () => false)

    win.set_resizable(true)

    this.loadStyles()

    win.connect("size-allocate", () => this.updatePosition())
    win.connect("screen-changed", () => this.updateSize())

    this.dock = new Dock(
      ["top", "bottom"].includes(config.settings.appearance.position)
    )

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    win.add(this.dock.toolbar)
    this.dock.toolbar.connect("check-resize", () => this.updateSize())
    this.updateSize()
  }

  loadStyles() {
    // Make window transparent if possible
    const haveAlpha = this.window.get_screen().get_rgba_visual() ? true : false

    log(`Alpha Visuals: ${haveAlpha}`)
    log(`Composited: ${this.window.is_composited()}`)

    if (haveAlpha) {
      this.window.set_visual(this.window.get_screen().get_rgba_visual())
      this.window.set_app_paintable(true)
    }

    // Load CSS
    const css = new Gtk.CssProvider()
    css.load_from_path(config.theme)
    Gtk.StyleContext.add_provider_for_screen(
      this.window.get_screen(),
      css,
      Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION
    )
  }

  updateSize() {
    if (this.hidden) this.autoHide()

    // Hide window when dock is hidden
    if (this.hidden) return

    // Resize the window to fit the toolbar
    const [, naturalSize] = this.dock.toolbar.get_preferred_size()
    const size = this.window.get_size()
    if (
      naturalSize &&
      naturalSize.height > 0 &&
      naturalSize.width > 0 &&
      (naturalSize.width !== size[0] || naturalSize.height !== size[1])
    ) {
      // log(`Size updated to ${naturalSize.width}, ${naturalSize.height}`)
      this.window.resize(naturalSize.width, naturalSize.height)
    }
    this.autoHide()
  }

  updatePosition() {
    let x = 0
    let y = 0

    const screenSize = {
      width: this.window.get_screen().get_width(),
      height: this.window.get_screen().get_height(),
    }
    const size = {
      width: this.window.get_allocated_width(),
      height: this.window.get_allocated_height(),
    }

    if (["top", "bottom"].includes(config.settings.appearance.position)) {
      if (config.settings.appearance.position == "top") y = 0
      if (config.settings.appearance.position == "bottom")
        y = screenSize.height - size.height

      if (config.settings.appearance.alignment == "start") x = 0
      if (config.settings.appearance.alignment == "center")
        x = Math.round(screenSize.width / 2 - size.width / 2)
      if (config.settings.appearance.alignment == "end")
        x = Math.round(screenSize.width - size.width)
    }

    if (["left", "right"].includes(config.settings.appearance.position)) {
      if (config.settings.appearance.position == "left") x = 0
      if (config.settings.appearance.position == "right")
        x = screenSize.width - size.width

      if (config.settings.appearance.alignment == "start") y = 0
      if (config.settings.appearance.alignment == "center")
        y = Math.round(screenSize.height / 2 - size.height / 2)
      if (config.settings.appearance.alignment == "end")
        y = Math.round(screenSize.height - size.height)
    }

    x += config.settings.appearance.offsetX ?? 0
    y += config.settings.appearance.offsetY ?? 0

    const pos = this.window.get_position()
    if (pos[0] != x || pos[1] != y) {
      this.window.move(x, y)
      this.autoHide()
    }
  }

  overlapsWithActiveWindow(): boolean {
    let active: Wnck.Window | undefined = this.dock.screen.get_active_window()
    if (active?.is_skip_tasklist()) active = undefined

    if (active && this.window) {
      const [ax1, ay1, aw, ah] = active.get_geometry()
      const [bx1, by1] = this.window.get_position()
      const [bw, bh] = this.window.get_size()

      let overlaps = true

      // No geometry
      if (bw === null || bh === null || bx1 === null || by1 === null)
        overlaps = false
      else if (aw === null || ah === null || ax1 === null || ay1 === null)
        overlaps = false
      // no horizontal overlap
      else if (ax1 >= bx1 + bw || bx1 >= ax1 + aw) overlaps = false
      // no vertical overlap
      else if (ay1 >= by1 + bh || by1 >= ay1 + ah) overlaps = false
      return overlaps
    }
    return false
  }

  autoHide() {
    const overlaps = this.overlapsWithActiveWindow()
    const show = this.dock.show && !overlaps

    if (show) {
      if (this.hidden) {
        log("[autohide] showing dock")
        this.hidden = false
      }
      this.window.show()
    } else {
      if (!this.hidden) {
        log(
          `[autohide] hiding dock [overlaps=${overlaps}] [items=${this.dock.show}]`
        )
        this.hidden = true
      }
      this.window.hide()
    }
  }
}
