# NBT
NBT module for use with Drupi. Download Drupi at https://stacket.net/drupi

The current latest version of NBT is **0.1**, and this documentation will always be in reference to the latest version of NBT.

# Using the NBTItem constructor
The most basic method of using the NBT module to manipulate item NBT is by creating an NBTItem. Let's create a test item where we will set `test` to `"Hello!"`.

```js
const NBT = require("NBT");
const NBTItem = NBT.NBTItem;

command.create("test", "test", sender => {
    const player = cast.asPlayer(sender);
    const nbti = new NBTItem(player.getInventory().getItemInHand());
    nbti.setString("test", "Hello!");
    player.getInventory().setItemInHand(nbti.getItem());
});
```

# Using NBTItemBuilder
NBTItemBuilder is a constructor provided by the NBT module to make it easier to apply multiple NBT tags of various types to an item at once.

Usage: `new NBTItemBuilder(item, nbt)`

`item` - a regular ItemStack, NOT an NBTItem. NBTItemBuilder will automatically create an NBTItem, and return the modified ItemStack.

`nbt` - a JSON object containing all NBT tags you wish to apply, including NBTItemBuilder's custom $build tag.

## Structuring an NBT JSON object
NBTItemBuilder can automatically identify and use the following types of values:

* String
* Integer
* Double
* Boolean

Example:

```json
{"test":"Hello!","test2":123,"test3":123.45,"test4":false}
```

### Type declaration with $build
For other types you may wish to store within NBT, such as objects, floating point numbers, or integer arrays, you will need to strictly declare what type you wish to use. NBTItemBuilder will automatically handle all casting for you, you just need to provide the original values.

For the sake of example, let's structure an NBT object where we will have the "test" field set to an integer array.

```json
{"test": {"$build": {"type": "intArray", "value": [1, 2, 3]}}}
```

Complete list of valid options for the `type` parameter:

* string
* integer
* double
* boolean
* object
* short
* long
* float
* byteArray
* intArray
* itemStack

# ItemUtils expansion
If you have ItemUtils version **1.1** or newer, the NBT module will register a custom `nbt` option for the ItemBuilder constructor. This will allow you to declare custom NBT tags directly in your ItemBuilder constructor. The value expected to be passed to the `nbt` option is the same as the NBTItemBuilder constructor, and supports strict type declaration with $build. Let's have a look at some examples.

```js
// Less clean, but still functional method
let item = new ItemBuilder("STICK", "Fancy Stick", null);
item = new NBTItemBuilder(item, {test: "Hello!"});

// ItemBuilder custom option (recommended)
let item = new ItemBuilder("STICK", "Fancy Stick", null, {nbt: {test: "Hello!"}});
```

# More coming soon
This is a pre-release of the NBT module. Ease-of-use interfaces for the remaining classes within the NBT API will come in future updates to the module. This first release was primarily focused on NBT manipulation for items, not entities.
