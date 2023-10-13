declare namespace ct {
    /**
     * Vector Graphics User Interface library
     */
    namespace vgui {

        class TextBox {

            /**
             * Creates a text box that accepts keyboard input
             * @param {object} template Pass "this" into this argument so that collision boundaries can be obtained
             * @param {TextBoxProps} props Extra configuration goes here
             */
            constructor(template: object, props: TextBoxProps);

            /**
             * For when you're too lazy to make your own textbox graphics. only invoke once
             */
            useDefaultBoxGraphics(): void;
            /**
             * For when you're too lazy to make your own textbox graphics. only invoke once
             */
            useDefaultCursorGraphics(): void;
            /**
             * Recalculates the textbox dimensions, style, and text positioning
             */
            reload(): void;
            /**
             * Call this method on the Frame start of your template. updates focus, text and cursor
             */
            step(): void;
            /** Whether the textbox will accept input. automatically handled by the library depending where the user clicks */
            isFocused: boolean;
            /** Which character in the string to add/remove text to. automatically handled by the library */
            cursorPosition: number;
            /** Top level graphics for the textbox, text and cursor */
            container: PIXI.Container;
            /** Textbox graphics */
            textGraphics: PIXI.Graphics;
            /** Text input font. this is what the user sees */
            textInput: PIXI.Text;
            /** Hidden text font that renders only up to the cursor position. this is so that the cursor renders at the right position */
            hiddenInput: PIXI.Text;
            /** Cursor graphics */
            cursor: PIXI.Graphics;
        }

        class Inventory {
            /**
             * Creates an inventory object to help facilitate the management of items in an array of cells
             */
            constructor();

            /**
             * Initializes creation and drawing of the inventory. Each cell created is injected with the `cellIndex` property indicating its position in the cells array
             * @param {number} inventorySize How many cells the inventory should initialize
             * @param {function} cb Each cell to be initialized will call this callback function which expects a Copy returned that it can manage
             * @param {InventorySize} defaultGraphics An object with width and height properties that tells the library what dimensions to make each inventory cell
             */
            setSize(inventorySize: number, cb: (index: number) => Copy, defaultGraphics?: InventorySize): void;

            /**
             * Adds and draws an item to the inventory
             * @param {number} index The index in the inventory to add the item
             * @param {string} textureName A valid texture name the library can use to render a texture in the cell. Injected in copy's inventoryTextureName property
             * @param {string} templateName The name of the template associated with the item. Injected in copy's inventoryTemplateName property. The library will not use templateName to create copies.
             */
            add (index: number, textureName: string, templateName: string): void;

            /**
             * Adds and draws an item to the first unused slot in the inventory
             * @param {string} textureName A valid texture name the library can use to render a texture in the cell. Injected in copy's inventoryTextureName property
             * @param {string} templateName The name of the template associated with the item. Injected in copy's inventoryTemplateName property. The library will not use templateName to create copies.
             */
            push (textureName: string, templateName: string): void;

            /**
             * Adds a listener for propagation of inventory related events
             * @param {function} cb A callback that will receive events of user interactions with the inventory
             */
            listen (cb: (event: InventoryEvent, cell: Copy)): void;

            /**
             * Removes a listener from receiving events
             * @param {function} cb A callback that receives events of user interactions with the inventory
             */
            removeListener (cb: (event: InventoryEvent, cell: Copy)): void;

            /**
             * Removes all listeners from receiving events
             */
            clearListeners (): void;

            /**
             * Signals that the player has selected this item in the inventory
             * @param {number} index The position of the item receiving the interaction
             */
            select (index: number): void;

            /**
             * Signals that the player wants to use this item in the inventory
             * @param {number} index The position of the item receiving the interaction
             */
            action (index: number): void;

            /**
             * Signals that the player wants to remove this item from the inventory
             * @param {number} index The position of the item receiving the interaction
             */
            remove (index: number): void;

            /**
             * Signals that the player intends to move an item from here
             * @param {number} index The position of the item receiving the interaction
             */
            moveFrom (index: number): void;

            /**
             * Signals that the player intends to move an item to here
             * @param {number} index The position of the item receiving the interaction
             */
            moveTo (index: number): void;

            /**
             * Signals that the player does not wish to move an item anymore
             */
            moveCancel (): void;

            /** The currently selected cell's position */
            readonly selectedIndex: number;
            /** The array of managed cell copies */
            readonly cells: Array<Copy>;
            /** The array of listeners to receive inventory events */
            readonly listeners: Array<function>;
            /** The position of the cell whose item is intended to be moved. Note that even if allowMoving is false this property still gets updated */
            readonly moveIndex: number;
            /** Whether the library should handle moving items between cells. Defaults to true */
            allowMoving: boolean;
        }


        interface TextBoxProps {
            /** Text that is stored on the textbox. Not necessarily what is rendered. Use this for inserting default text */
            trueText?: string;
            /** How wide the text input should be. Defaults to 256 */
            width?: number;
            /** How tall the text input should be. Defaults to 48 */
            height?: number;
            /** Offset the location of text horizontally in pixels. Defaults to 8 */
            offsetX?: number;
            /** Offset the location of text vertically in pixels. Defaults to 2 */
            offsetY?: number;
            /** Maximum number of characters to store in the input. Defaults to 32 */
            maxLength?: number;
            /** How much sooner should text be cutoff when input reached end of textbox in pixels. Defaults to 48 */
            lengthThresholdOffset?: number;
            /** A ct.styles font */
            font?: object;
            /** If true, replaces characters with '•'. Good for password fields. Defaults to false */
            hideText?: boolean;
        }

        interface InventorySize {
            /** How wide each inventory cell should be */
            width: number;
            /** How tall each inventory cell should be */
            height: number;
        }

        enum InventoryEvent {
            SELECT,
            ACTION,
            ADD,
            REMOVE,
            MOVE_FROM,
            MOVE_TO
        }
    }
}