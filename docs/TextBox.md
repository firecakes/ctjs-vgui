# TextBox

Make some text boxes! This text box will only have its text modified when the user clicks on the text box, and it will disable editing the text box when the user clicks away from it. It handles keyboard input for you, and even supports backspace and delete inputs. You can also use the arrow keys to seek the cursor left and right in the text! It also supports hidden text and text cutoff when the text goes outside the boundaries of the text box. It's smart!

Simple example:
```js
this.textbox = new ct.vgui.TextBox(this, {
    trueText: "Placeholder",
    width: 350,
    height: 200,
})
```

Example using all "public" properties
```js
this.textbox = new ct.vgui.TextBox(this, {
    trueText: "Placeholder",
    width: 350,
    height: 200,
    offsetX: 20,
    offsetY: -5,
    maxLength: 32,
    lengthThresholdOffset: -5,
    font: ct.styles.get('Testing'),
    hideText: false,
})
```

You can choose to let the library make default graphics for you. This uses PIXI.Graphics to render some primitives.
Put this in the On Create event:

```js
this.textbox = new ct.vgui.TextBox(this, {
    trueText: "Placeholder",
    width: 350,
    height: 200,
    font: ct.styles.get('Testing')
})

this.textbox.useDefaultBoxGraphics() // creates a default text box surrounding the text
this.textbox.useDefaultCursorGraphics() // creates a default cursor graphic for seeking through text
this.textbox.reload() // re-render the graphics so they show up
```

Or, you can use your own graphics! The TextBox class object has exposed properties you can edit to use the full power of PIXI.Graphics.

```js
this.textbox = new ct.vgui.TextBox(this, {
    trueText: "Placeholder",
    width: 350,
    height: 200,
    font: ct.styles.get('Testing')
})

// change the text box
let textGraphics = this.textbox.textGraphics
textGraphics.lineStyle(5, 0xFFAAFF, 1)
textGraphics.beginFill(0xAAFFAA, 1)
textGraphics.drawRoundedRect(0, 0, 350, 200, 0)
textGraphics.endFill()

// change the font dynamically
this.textbox.props.font = ct.styles.get('Testing')
// changing the font requires the use of reload()
this.textbox.reload()
```

If you want to change the cursor, that requires a redraw on every step so code should be added in the Step event. Be aware that you will also need to handle the case of whether the text box is in focus by the user.
```js
// change the cursor
this.textbox.cursor.clear()
if (this.textbox.isFocused) { // check if the user is focused on this text box
    this.textbox.cursor.beginFill(0xFF3366)
    this.textbox.cursor.drawRect(this.textbox.hiddenInput.width + 5, 2, 2, this.textbox.hiddenInput.height);
    this.textbox.cursor.endFill();
}
```

Don't want to use vector graphics at all for the text box? Not a problem. Simply assign a sprite to the template through the ct.js UI. Don't use `useDefaultBoxGraphics()` because it will draw over your sprite!