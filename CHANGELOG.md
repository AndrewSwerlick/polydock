## [1.2.0](https://github.com/folke/polydock/compare/1.1.1...1.2.0) (2020-06-04)


### Features

* ✨ use Gtk.Application to parse cmd-line args ([dcadbc0](https://github.com/folke/polydock/commit/dcadbc0d7d168a66171769192d8619c5d01b3ccf))


### Bug Fixes

* 🐛 find config directory when symlinked ([11b33c0](https://github.com/folke/polydock/commit/11b33c0f743f852022b4a54ebbbbf4e7cc86a89f))
* 🐛 load system themes when no user themes availabel ([88fe332](https://github.com/folke/polydock/commit/88fe332dcdb905e869116c370b1e1cc54a891380))

### [1.1.1](https://github.com/folke/polydock/compare/1.1.0...1.1.1) (2020-06-03)

## 1.1.0 (2020-06-03)


### Features

* ✨ added config file loading ([881b54e](https://github.com/folke/polydock/commit/881b54e301e798c1f6ec6cddfaebcd105289f6de))
* ✨ added right-click dropdown with other windows in group ([998acf3](https://github.com/folke/polydock/commit/998acf3175ecf4214a8813ece8454be2fdca2c55))
* ✨ added settings to show visible or hidden windows ([e506f73](https://github.com/folke/polydock/commit/e506f731cd8cd9a76e64507da542fdf82ab717e0))
* ✨ added window grouping! ([1d20e2c](https://github.com/folke/polydock/commit/1d20e2c34dc397de5acd558c007dfacecef33c02))
* ✨ autohide dock when it overlaps with a window ([8180fbb](https://github.com/folke/polydock/commit/8180fbb0b88b1e7a84a6f3b3a9af5a34819de224))
* ✨ better handling of active workspace only windows ([2544313](https://github.com/folke/polydock/commit/2544313717bec8ebc3033c4db0974f9134dc0c0b))
* ✨ config position ([ccc2b04](https://github.com/folke/polydock/commit/ccc2b041a2a372eca17ab8a1a0a52f4287116478))
* ✨ initial commit with working polydock! ([7fee62e](https://github.com/folke/polydock/commit/7fee62e99781912ac4b3e4931eb98a1d752e7210))
* ✨ moved to Gjs ([f5c7b9b](https://github.com/folke/polydock/commit/f5c7b9b74cf8556faf9d849a5a11e50a7753e081))
* ✨ script to automatically restart polydock when it segfaults ([afba7db](https://github.com/folke/polydock/commit/afba7db0b9bb9f760372e0e80c58d50c0f88b6a0))
* ✨ utility function similar to path.resolve ([e55806b](https://github.com/folke/polydock/commit/e55806be6bbd290904d393f3c34439ec8c07803a))


### Bug Fixes

* 🐛 don't use window global object! ([b4c9b56](https://github.com/folke/polydock/commit/b4c9b56847898b29b0df928085f73db7c5342e57))
* **config:** 🐛 ⚙️ show all workspace windows by default ([815c16f](https://github.com/folke/polydock/commit/815c16f94e9274c5b13f97bb6ac713b099c8544f))
* 🐛 added gc to imports.system ([47e61f0](https://github.com/folke/polydock/commit/47e61f0628619c76c066dee4d55f91d77bafe7b6))
* 🐛 always operate on a fresh window from Wnck. trying to minimize segfaults. related to [#1](https://github.com/folke/polydock/issues/1) ([c8a6bb0](https://github.com/folke/polydock/commit/c8a6bb0ef7dc6b881fa622c2b817afe036c008e9))
* 🐛 check_resize ([6cad4ef](https://github.com/folke/polydock/commit/6cad4efd43dc0148c36f495709ab7dfa0fab972a))
* 🐛 fixes a segfault caused by incorrect unref on closed active windows (fixes [#1](https://github.com/folke/polydock/issues/1)) ([c45c139](https://github.com/folke/polydock/commit/c45c139d7c3a8a5d29ebee136f7d2f5a544ae687))
* 🐛 fullpath of $0 ([2196644](https://github.com/folke/polydock/commit/21966447b898081ca035603a0a470b036c880432))
* 🐛 hide the dock when no windows to show ([b288887](https://github.com/folke/polydock/commit/b288887a653ace804dd00447af972668bbb0a51d))
* 🐛 listen for state changes ([c175e02](https://github.com/folke/polydock/commit/c175e023842aecc2e36563c15433bdfe476b0b9c))
* 🐛 log always needs one arg ([c1ed368](https://github.com/folke/polydock/commit/c1ed368d4027427a2a5a137ead5e20e67aeb13ad))
* 🐛 moved Gtk main loop to index ([71b0e45](https://github.com/folke/polydock/commit/71b0e45c05433b5086a5f1fceff5dea4476110e8))
* 🐛 no-console ([fc8155e](https://github.com/folke/polydock/commit/fc8155e12d274fdf295d1a591e0cb71165e71998))
* 🐛 properly check for existing ini keys ([4be773a](https://github.com/folke/polydock/commit/4be773ae93a7c524787765bcda49962386f3b8c0))

