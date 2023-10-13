# Inventory

Many, many games use some kind of inventory system where you want to accumulate and manage items in a space of cells. This library can help jump start that process!

### Starting Out

Simple example (Add in the Creation event):
```js
this.inventory = new ct.vgui.Inventory()
this.inventory.setSize(12, (index) => {
    return ct.templates.copy("cell", this.x + index*64, 0);
}, {width: 64, height: 64})
```

This will initialize an inventory of 12 cells represented by 12 copies belonging to a "cell" template you have created, laid across one row, and also render a square `PIXI.Graphics` object for each cell of size 64x64.

Want the inventory out in a grid instead? Here's an easy way to put them in multiple rows:
```js
this.inventory = new ct.vgui.Inventory()
this.inventory.setSize(12, (index) => {
    let columns = 4
    return ct.templates.copy("cell", this.x + (index % columns)*64, this.y + Math.floor(index / columns)*64)
}, {width: 64, height: 64})
```

Or perhaps you want something more exotic? How about all the cells displayed in a circle?
```js
this.inventory = new ct.vgui.Inventory()
this.inventory.setSize(12, (index) => {
    return ct.templates.copy("cell", this.x + 200*Math.sin(index*2*Math.PI / 12), this.y + 200*Math.cos(index*2*Math.PI / 12))
}, {width: 64, height: 64})
```

Now, since an inventory system is typically part of a UI layer, you will likely also want your cell and inventory copies to exist in a UI layer, which in CT.js means making your own UI room to then append onto the main room.

Let's say you already have your main room append a UI room called "ui" to itself, via `ct.rooms.append('ui', {isUi: true})`, and you placed your inventory object in the UI room. Let's also say you don't like the default graphics rendered for each cell and want to use your own textures. As long as your cell template has a texture associated with it then that will be what is drawn for each cell. This is what the code will look like now:

```js
this.inventory = new ct.vgui.Inventory()

setTimeout(() => { //ct.rooms data not available until next "frame" 
    const uiLayer = ct.rooms.list['ui'][0]

    this.inventory.setSize(12, index => {
        const copy = ct.templates.copyIntoRoom('cell', this.x + index* 64, 0, uiLayer, {
            width: 64,
            height: 64
        })
        return copy
    })
})
```

Note that we removed the final argument in `setSize`, which tells the library we do not want it to create default graphics for us. Also note the `setTimeout()` surrounding the code. This is because accessing the room data is not available on the initial creation event, and so we need a tiny delay before that data is populated so we can then find the UI room. Finally, we are using `copyIntoRoom` which lets us specify which room to instantiate the copies in. 

### Populating the Inventory
These cells are pretty cool, but they're not very useful without being able to add items into them. The Inventory class comes with a lot of useful methods that let you easily insert and manage cell data.

```js
this.inventory.add(3, "item_tex", "item")
this.inventory.push("item_tex", "item")
```

This code first adds an item at index 3 in the cells (4th position), and then adds another item in the first unoccupied cell that the library can find. `push` is useful for when you don't care what position an item goes in, just that it should go somewhere in the inventory. "item_text" is assumed to be a texture that you have defined, and the library will automatically find and render that texture into the appropriate cell. "item" is assumed to be the name of a template that could get instantiated when you use an item. The library won't actually do or assume anything with the template string; passing this string is merely a convenience for you if you need to read the cell data in the future and figure out what copy to spawn in based on the cell contents. 

The texture string you pass in is accessible through the cell copy's `inventoryTextureName` property, and the template string through the cell copy's `inventoryTemplateName` property:

```js
this.inventory.push("item_tex", "item")
console.log(this.inventory.cells[0].inventoryTextureName) // item_tex
console.log(this.inventory.cells[0].inventoryTemplateName) // item
```

Be careful about accidentally overwriting an existing item in the same position, or using `push` if the inventory is full! This library will not protect you from deleting items on accident.

### Inventory Events
We can manipulate the inventory in these little scripts all we want, but the real value comes in when we listen to player input and respond accordingly with inventory changes. How do we make this inventory truly interactable? This is where inventory events come into play. You are still responsible for firing the events, but the idea is they can be activated from anywhere in the project, and then you have a centralized location to handle all the events fired in the form of listeners. The following is an example of hooking up a listener to these events.

```js
this.inventory.listen((event, cell) => {
    if (event === ct.vgui.InventoryEvent.SELECT) {
        // TODO: react to SELECT event
    }
    if (event === ct.vgui.InventoryEvent.ACTION) {
        // TODO: react to ACTION event
    }
    if (event === ct.vgui.InventoryEvent.MOVE_FROM) {
        // TODO: react to MOVE_FROM event
    }
    if (event === ct.vgui.InventoryEvent.MOVE_TO) {
        // TODO: react to MOVE_TO event
    }
    if (event === ct.vgui.InventoryEvent.ADD) {
        // TODO: react to ADD event
    }
    if (event === ct.vgui.InventoryEvent.REMOVE) {
        // TODO: react to REMOVE event
    }
})
```

Not all events will be necessary to react to for your use case, as the library does some background work with some of these. Let's start with SELECT.

#### InventoryEvent.SELECT 
You are meant to use the SELECT event when the player has a focus over an item in the inventory. Think of it like a cursor that is hovering over an item; it's not necessarily meaning that the player wants to use it, although you could use it like that. How should a SELECT event be fired? Two common methods are listening to the mouse's scroll wheel to go backward and forward across the cells, and you could also have the cell listen to the player clicking on it. Use whatever works for your game, but here I will show you how you could do this with listening to the scroll wheel.

I will assume you created a Scroll action that listens to the `pointer.Wheel` value. Create an "On Scroll down" event in the Inventory template and write the following in it:

```js
if (this.inventory.selectedIndex === null) { // default to 0 if it has no value
    this.inventory.select(0)
    return
}

let newIndex = this.inventory.selectedIndex

if (value === 1) { // scroll up detected
    newIndex--
}

if (value === -1) { // scroll down detected
    newIndex++
}

newIndex = ct.u.clamp(0, newIndex, this.inventory.cells.length - 1) // prevent the index from going out of bounds
this.inventory.select(newIndex) // sets the new selected index

console.log(this.inventory.selectedIndex) // read the new selectedIndex
```

The `selectedIndex` property will start null, so either define it earlier or make sure it has a value by the time this event is called. This code will read the scroll wheel and change the selected cell's index by 1 depending on the direction of the scroll. You could then render a texture over the selected cell to indicate that it is selected and smartly remove or change the position of the selected texture depending on what selectedIndex changes to:

```js
this.inventory = new ct.vgui.Inventory()

setTimeout(() => { //ct.rooms data not available until next "frame" 
    const uiLayer = ct.rooms.list['ui'][0]
    const selectedTex = new PIXI.Sprite(ct.res.getTexture("Ui_Select", 0))
    selectedTex.tint = 0xFF0000

    this.inventory.setSize(12, index => {
        const copy = ct.templates.copyIntoRoom('cell', this.x + index* 64, 0, uiLayer, {
            width: 64,
            height: 64
        })
        return copy
    })

    this.inventory.listen((event, cell) => {
        if (event === ct.vgui.InventoryEvent.SELECT) {
            cell.addChild(selectedTex)
        }
    })

})
```

This updated code in the inventory's Creation event now listens for the SELECT event we fired in the "On Scroll down" event and draws a "Ui_Select" texture over that selected cell. Very lean!

#### InventoryEvent.ACTION 
The ACTION event is intended for when the player wants to do something with the selected item. The effect can be whatever you want: consuming and destroying the item, making the player wield the item, attempt to combine it with another item, or whatever. The library will do nothing extra with this event, so it is entirely up to you to implement what it should do. So what am I going to do with it? I'm going to add another CT.js action to the inventory template so when you press the spacebar it will spawn the item from the inventory onto wherever the mouse is.

In the "On Spawn press" event for the inventory template:

```js
this.inventory.action(this.inventory.selectedIndex)
```

Yep. As simple as that. Now we handle the ACTION event in our inventory's Creation event:

```js
this.inventory = new ct.vgui.Inventory()

setTimeout(() => { //ct.rooms data not available until next "frame" 
    const uiLayer = ct.rooms.list['ui'][0]
    const selectedTex = new PIXI.Sprite(ct.res.getTexture("Ui_Select", 0))
    selectedTex.tint = 0xFF0000

    this.inventory.setSize(12, index => {
        const copy = ct.templates.copyIntoRoom('cell', this.x + index* 64, 0, uiLayer, {
            width: 64,
            height: 64
        })
        return copy
    })

    this.inventory.push("Tile_Tree", "item")

    this.inventory.listen((event, cell) => {
        if (event === ct.vgui.InventoryEvent.SELECT) {
            cell.addChild(selectedTex)
        }
        if (event === ct.vgui.InventoryEvent.ACTION) {
            if (!cell.inventoryTemplateName) {
                return
            }
            ct.templates.copy(cell.inventoryTemplateName, ct.pointer.x, ct.pointer.y)
        }
    })

})
```

Here I push in an inventory item at the start of the game so that there is an item to select, and in the ACTION event case I check whether there is a template string to use to spawn an item and then spawn it where the mouse is.

#### InventoryEvent.MOVE_FROM and InventoryEvent.MOVE_TO 
ADD and REMOVE are fairly straightforward events and I don't have a good idea on how to use them anyways, so the focus will instead be on the most complex events, MOVE_FROM and MOVE_TO. The MOVE_FROM event is used when the player is indicating that they want to move an item in a certain cell to another location. The MOVE_TO event is used when the player has indicated which other cell the item should move to. The library will actually handle the moving process for you, unless you disable it by setting `this.inventory.allowMoving = false`. In fact, if you run the following somewhere the library will move an item from index 0 to index 3:

```js
this.inventory.moveFrom(0)
this.inventory.moveTo(3)
```

Technically what the library does is swap the items at those two positions. But, if one of the cells is empty, then it just looks like the item moves to the empty spot. If there is another item at the `moveTo` index then that item will move to the `moveFrom` index.

If `moveFrom()` is called but there is an intent that the user wants to cancel the move before `moveTo()`, you may call `moveCancel()`. This will reset the `moveIndex` property inside the inventory object back to null instead of keeping the index set by `moveFrom()`.

### Tricks

One cool way to use the move events is to make a "drag and drop" effect where the user is dragging an item from one cell to another and there is a ghost of the item following the cursor during the drag. First, add a "Pointer down" event to the cell template and add this:

```js
const invTemplate = ct.templates.list['inventory'][0]
invTemplate.inventory.moveFrom(this.cellIndex)
```

Fun fact: the library injects each cell copy with the index it's positioned in, through `cellIndex`. Now for this to work, create a "dragndrop" template and add `this.alpha = .5` to the Creation event, add `this.kill = true` to the Pointer up event, and add the following to the Frame Start event:
```js
if (this.tex) {
    this.x = ct.pointer.xui - this.width / 2
    this.y = ct.pointer.yui - this.height / 2
}
this.move();
```

When this object is created, whatever texture it has will be translucent and will follow the player around. The texture check makes it so we know that the copy will have width and height properties which we can use to center the texture on the mouse, and specifically on the mouse's coordinates on the UI layer, hence xui and yui. The pointer up event will destroy the copy once the user lifts the finger off the mouse button.

Now since the pointer up will be detected and consumed by the dragndrop copy we won't be able to also trigger it for the cell. Instead, make a new action that listens to pointer.Primary (ex. Click) and add "On Click release" to the cell template with this code:

```js
if (ct.place.traceRect(new PIXI.Rectangle(ct.pointer.xui, ct.pointer.yui, 1, 1), "cells") === this) {
    const invTemplate = ct.templates.list['inventory'][0]
    invTemplate.inventory.moveTo(this.cellIndex)
}
```

Since this is a "global" event it will fire for every cell copy, so we must limit its code to run on only the cell we have released the click on. Once we find the specific cell the mouse is over on release, call `moveTo` to fire the events and start the swapping process. Also, edit the cell template to add a collision group called "cells" since the collision check here tries to find only copies under that collision group of "cells".

Oh my gosh why is that if statement so long though? Can't we just use `ct.pointer.collidesUi(this)`? Yes, if you don't care about touch events. That will work for a mouse but not for mobile if you're exporting to the web. So what this method does is dynamically create a rectangle of size 0 where the mouse is and perform a collision check with the cells wherever the pointer is at the moment of release, then checks if the returned copy it collides with is the same cell we're on right now.

But we still need a way to spawn the dragndrop copy and give it the appropriate texture. This leads us back to the inventory's new listener code:

```js
this.inventory = new ct.vgui.Inventory()

setTimeout(() => { //ct.rooms data not available until next "frame" 
    const uiLayer = ct.rooms.list['ui'][0]
    const selectedTex = new PIXI.Sprite(ct.res.getTexture("Ui_Select", 0))
    selectedTex.tint = 0xFF0000

    this.inventory.setSize(12, index => {
        const copy = ct.templates.copyIntoRoom('cell', this.x + index* 64, 0, uiLayer, {
            width: 64,
            height: 64
        })
        return copy
    })

    this.inventory.push("Tile_Tree", "item")

    this.inventory.listen((event, cell) => {
        if (event === ct.vgui.InventoryEvent.SELECT) {
            cell.addChild(selectedTex)
        }
        if (event === ct.vgui.InventoryEvent.ACTION) {
            if (!cell.inventoryTemplateName) {
                return
            }
            ct.templates.copy(cell.inventoryTemplateName, ct.pointer.x, ct.pointer.y)
        }
        if (event === ct.vgui.InventoryEvent.MOVE_FROM) {
            const dragndrop = ct.templates.copyIntoRoom("dragndrop", 0, 0, uiLayer)
            if (cell.inventoryTextureName) {
                dragndrop.tex = cell.inventoryTextureName
            } else {
                this.inventory.moveCancel()
            }
        }
    })

})
```

In the MOVE_FROM event we create the dragndrop copy in the UI layer so that it moves with the mouse properly. Then we set the texture of the copy to that of the cell's containing item. Finally, if there was not an item at the cell's location we call `moveCancel()` to prevent a move from an empty cell onto a populated cell. And that's it!