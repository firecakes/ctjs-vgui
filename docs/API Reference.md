# API Reference

This API reference is taken from the `types.d.ts` file that comes with the catmod.

# ct.vgui

## `ct.vgui.TextBox()`
* Creates a text box that accepts keyboard input
* @param {object} - template Pass "this" into this argument so that collision boundaries can be obtained
* @param {TextBoxProps} props - Extra configuration goes here
* @returns {TextBox} 

## `ct.vgui.Inventory()`
* Creates an inventory object to help facilitate the management of items in an array of cells

## `ct.vgui.InventoryEvent`
* SELECT
* ACTION
* REMOVE
* MOVE_FROM
* MOVE_TO

# TextBox
## `useDefaultBoxGraphics()`
* for when you're too lazy to make your own textbox graphics. only invoke once

## `useDefaultCursorGraphics()`
* for when you're too lazy to make your own textbox graphics. only invoke once

## `reload()`
* recalculates the textbox dimensions, style, and text positioning

## `step()`
* call this method on the Frame start event of your template. updates focus, text and cursor

## `isFocused: boolean`
* whether the textbox will accept input. automatically handled by the library depending where the user clicks

## `cursorPosition: number`
* which character in the string to add/remove text to. automatically handled by the library

## `container: PIXI.Container`
* top level graphics for the textbox, text and cursor

## `textGraphics: PIXI.Graphics`
* textbox graphics

## `textInput: PIXI.Text`
* text input font. this is what the user sees

## `hiddenInput: PIXI.Text`
* hidden text font that renders only up to the cursor position. this is so that the cursor renders at the right position

## `cursor: PIXI.Graphics`
* cursor graphics

# TextBoxProps
## `trueText?: string`
* text that is stored on the textbox. not necessarily what is rendered. use this for inserting default text

## `width?: number`
* How wide the text input should be. defaults to 256

## `height?: number`
* How tall the text input should be. defaults to 48

## `offsetX?: number`
* offset the location of text horizontally in pixels. defaults to 8

## `offsetY?: number`
* offset the location of text vertically in pixels. defaults to 2

## `maxLength?: number`
* maximum number of characters to store in the input. defaults to 32

## `lengthThresholdOffset?: number`
* how much sooner should text be cutoff when input reached end of textbox in pixels. defaults to 48

## `font?: object`
* a ct.styles font

## `hideText?: boolean`
* if true, replaces characters with '•'. good for password fields. defaults to false

# Inventory
## `setSize()`
* Initializes creation and drawing of the inventory. Each cell created is injected with the `cellIndex` property indicating its position in the cells array
* @param {number} inventorySize - How many cells the inventory should initialize
* @param {function} cb - Each cell to be initialized will call this callback function which expects a Copy returned that it can manage
* @param {InventorySize} defaultGraphics - An object with width and height properties that tells the library what dimensions to make each inventory cell

## `add()`
* Adds and draws an item to the inventory
* @param {number} index - The index in the inventory to add the item
* @param {string} textureName - A valid texture name the library can use to render a texture in the cell. Injected in copy's inventoryTextureName property
* @param {string} templateName - The name of the template associated with the item. Injected in copy's inventoryTemplateName property. The library will not use templateName to create copies.

## `push()`
* Adds and draws an item to the first unused slot in the inventory
* @param {string} textureName - A valid texture name the library can use to render a texture in the cell. Injected in copy's inventoryTextureName property
* @param {string} templateName - The name of the template associated with the item. Injected in copy's inventoryTemplateName property. The library will not use templateName to create copies.

# `listen()`
* Adds a listener for propagation of inventory related events
* @param {function} cb - A callback that will receive events of user interactions with the inventory

# `removeListener()`
* Removes a listener from receiving events
* @param {function} cb - A callback that receives events of user interactions with the inventory

# `clearListeners()`
* Removes all listeners from receiving events

# `select()`
* Signals that the player has selected this item in the inventory
* @param {number} index - The position of the item receiving the interaction

# `action()`
* Signals that the player wants to use this item in the inventory
* @param {number} index - The position of the item receiving the interaction

# `remove()`
* Signals that the player wants to remove this item from the inventory
* @param {number} index - The position of the item receiving the interaction

# `moveFrom()`
* Signals that the player intends to move an item from here
* @param {number} index - The position of the item receiving the interaction

# `moveTo()`
* Signals that the player intends to move an item to here
* @param {number} index The position of the item receiving the interaction

# `moveCancel()`
* Signals that the player does not wish to move an item anymore

## `readonly selectedIndex: number`
* The currently selected cell's position

## `readonly cells: Array<Copy>`
* The array of managed cell copies

## `readonly listeners: Array<function>`
* The array of listeners to receive inventory events

## `readonly moveIndex: number`
* The position of the cell whose item is intended to be moved. Note that even if allowMoving is false this property still gets updated

## `allowMoving: boolean`
* Whether the library should handle moving items between cells. Defaults to true

# InventorySize
## `width: number`
* How wide each inventory cell should be
## `height: number`
* How tall each inventory cell should be
