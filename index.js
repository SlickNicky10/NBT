(function(){
    const File = java.io.File;
    const API = manager.loadExternal(new File("plugins/Drupi/scripts/modules/NBT/item-nbt-api-2.3.0-SNAPSHOT.jar"));
    const NBTCompound = API.loadClass("de.tr7zw.changeme.nbtapi.NBTCompound");
    const NBTCompoundList = API.loadClass("de.tr7zw.changeme.nbtapi.NBTCompoundList");
    const NBTContainer = API.loadClass("de.tr7zw.changeme.nbtapi.NBTContainer");
    const NBTEntity = API.loadClass("de.tr7zw.changeme.nbtapi.NBTEntity");
    const NBTFile = API.loadClass("de.tr7zw.changeme.nbtapi.NBTFile");
    const NBTIntegerList = API.loadClass("de.tr7zw.changeme.nbtapi.NBTIntegerList");
    const NBTItem = API.loadClass("de.tr7zw.changeme.nbtapi.NBTItem");
    const NBTList = API.loadClass("de.tr7zw.changeme.nbtapi.NBTList");
    const NBTListCompound = API.loadClass("de.tr7zw.changeme.nbtapi.NBTListCompound");
    const NBTReflectionUtil = API.loadClass("de.tr7zw.changeme.nbtapi.NBTReflectionUtil");
    const NBTStringList = API.loadClass("de.tr7zw.changeme.nbtapi.NBTStringList");
    const NBTTileEntity = API.loadClass("de.tr7zw.changeme.nbtapi.NBTTileEntity");
    const NBTType = API.loadClass("de.tr7zw.changeme.nbtapi.NBTType");
    const NbtApiException = API.loadClass("de.tr7zw.changeme.nbtapi.NbtApiException");
    if(new File("plugins/Drupi/scripts/modules/ItemUtils").exists()){
        java.lang.System.out.println("[NBT-API] ItemUtils has been detected, registering ItemBuilder expansion...");
        require("ItemUtils").registerItemBuilderCustomOption("nbt", (item, value) => new module.exports.NBTItemBuilder(item, value));
    }
    module.exports = {
        NBTCompound,
        NBTCompoundList,
        NBTContainer: nbt => {
            let constructor;
            console.log("Constructors: "+NBTContainer.getDeclaredConstructors().length);
            if(!nbt){
                constructor = NBTContainer.getDeclaredConstructors()[0];
                return constructor.newInstance();
            }
            if(typeof nbt == "object"){
                // Meant for use with an NBTCompound, not a JSON object!
                constructor = NBTContainer.getDeclaredConstructors()[1];
            }
            if(typeof nbt == "string"){
                constructor = NBTContainer.getDeclaredConstructors()[2];
            }
            return constructor.newInstance(nbt);
        },
        NBTEntity,
        NBTFile,
        NBTIntegerList,
        NBTItem: item => {
            const constructor = NBTItem.getDeclaredConstructors()[0];
            return constructor.newInstance(item);
        },
        NBTItemBuilder: (item, nbt) => {
            server.broadcastMessage("Ree");
            const nbti = new module.exports.NBTItem(item);
            server.broadcastMessage("Ree2");
            for(let i in nbt){
                server.broadcastMessage("Ree3");
                const obj = nbt[i];
                if(typeof obj == "string"){
                    server.broadcastMessage("Automatically using type STRING");
                    nbti.setString(i, obj);
                } else if(typeof obj == "number"){
                    if(obj % 1 == 0){
                        server.broadcastMessage("Automatically using type INTEGER");
                        nbti.setInteger(i, obj);
                    } else {
                        server.broadcastMessage("Automatically using type DOUBLE");
                        nbti.setDouble(i, cast.asDouble(obj));
                    }
                } else if(typeof obj == "boolean"){
                    server.broadcastMessage("Automatically using type BOOLEAN");
                    nbti.setBoolean(i, obj);
                } else if(typeof obj == "object"){
                    // NBTItemBuilder custom syntax
                    // Example: {test: {$build: {type: "string", value: "Hello!"}}}
                    // Has key 'test' and a value "Hello!" as a string
                    if(obj["$build"] != null){
                        server.broadcastMessage("Current object is an NBTItemBuilder type builder");
                        const build = obj["$build"];
                        const type = build.type;
                        let value = build.value;
                        if(type == "string"){
                            if(typeof value != "string") value = value.toString();
                            nbti.setString(i, value);
                        } else if(type == "integer"){
                            nbti.setInteger(i, Math.round(value));
                        } else if(type == "double"){
                            nbti.setDouble(i, cast.asDouble(value));
                        } else if(type == "boolean"){
                            nbti.setBoolean(i, value);
                        } else if(type == "object"){
                            nbti.setObject(i, value);
                        } else if(type == "short"){
                            nbti.setShort(i, cast.as("java.lang.Short", value));
                        } else if(type == "long"){
                            nbti.setLong(i, cast.as("java.lang.Long", value));
                        } else if(type == "float"){
                            nbti.setFloat(i, parseFloat(value));
                        } else if(type == "byteArray"){
                            const arr = [];
                            value.forEach(o => arr.push(cast.asByte(o)));
                            nbti.setByteArray(i, arr);
                        } else if(type == "intArray"){
                            const arr = [];
                            value.forEach(o => arr.push(parseInt(o)));
                            nbti.setIntArray(i, arr);
                        } else if(type == "itemStack"){
                            nbti.setItemStack(i, value);
                        } else {
                            nbti.set(i, value);
                        }
                    }
                }
            }
            return nbti.getItem();
        },
        NBTList,
        NBTListCompound,
        NBTReflectionUtil,
        NBTStringList,
        NBTTileEntity,
        NBTType,
        NbtApiException
    }
}());
