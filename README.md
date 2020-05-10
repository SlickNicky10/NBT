# NBT
NBT module for use with Drupi. Download Drupi at https://stacket.net/drupi

The current latest version of NBT is **0.1.1**, and this documentation will always be in reference to the latest version of NBT.

# Importing the NBT module

How this module should be imported depends on how it is installed.

## Installed natively (using /drupi install or similar):

```js
const NBT = require("NBT").init();
```

## Installed using Repos (https://github.com/SlickNicky10/Repos):

```js
const NBT = Repos.require(Repos.getRepoIdByURL("https://repo.sn10hub.net", "NBT", true, "init"));
```

### Why is this required?

Modules installed through Repos have a different base path than modules installed normally. This is what allows modules of the same name from multiple different repositories to be installed without any issues. However, for the NBT module to properly function, it needs access to the Repos ENV, which is what the `true` and `"init"` arguments are for. Otherwise, if you have installed NBT through Repos, it will fail to load.

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
If your server has ItemUtils version **1.1** or newer installed, the NBT module will register a custom `nbt` option for the ItemBuilder constructor. This will allow you to declare custom NBT tags directly in your ItemBuilder constructor. The value expected to be passed to the `nbt` option is the same as the NBTItemBuilder constructor, and supports strict type declaration with $build. Let's have a look at some examples.

```js
// Less clean, but still functional method
let item = new ItemBuilder("STICK", "Fancy Stick", null);
item = new NBTItemBuilder(item, {test: "Hello!"});

// ItemBuilder custom option (recommended)
let item = new ItemBuilder("STICK", "Fancy Stick", null, {nbt: {test: "Hello!"}});
```

# More coming soon
This is a pre-release of the NBT module. Ease-of-use interfaces for the remaining classes within the NBT API will come in future updates to the module. This first release was primarily focused on NBT manipulation for items, not entities.
