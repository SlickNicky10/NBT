module.exports = {
    init: function(reposENV){
        const File = java.io.File;
        const API = (reposENV == null) ? manager.loadExternal(new File("plugins/Drupi/scripts/modules/NBT/item-nbt-api-2.3.0-SNAPSHOT.jar")) : manager.loadExternal(new File(reposENV.path+"/item-nbt-api-2.3.0-SNAPSHOT.jar"));
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
        const e = {
            NBTCompound,
            NBTCompoundList,
            NBTContainer: function(nbt){
                let constructor;
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
            NBTItem: function(item){
                const constructor = NBTItem.getDeclaredConstructors()[0];
                return constructor.newInstance(item);
            },
            NBTItemBuilder: function(item, nbt){
                const nbti = new module.exports.NBTItem(item);
                for(let i in nbt){
                    const obj = nbt[i];
                    if(typeof obj == "string"){
                        nbti.setString(i, obj);
                    } else if(typeof obj == "number"){
                        if(obj % 1 == 0){
                            nbti.setInteger(i, obj);
                        } else {
                            nbti.setDouble(i, cast.asDouble(obj));
                        }
                    } else if(typeof obj == "boolean"){
                        nbti.setBoolean(i, obj);
                    } else if(typeof obj == "object"){
                        // NBTItemBuilder custom syntax
                        // Example: {test: {$build: {type: "string", value: "Hello!"}}}
                        // Has key 'test' and a value "Hello!" as a string
                        if(obj["$build"] != null){
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
                                value.forEach(function(o){
                                    arr.push(cast.asByte(o));
                                });
                                nbti.setByteArray(i, arr);
                            } else if(type == "intArray"){
                                const arr = [];
                                value.forEach(function(o){
                                    arr.push(parseInt(o));
                                });
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
        const IUNative = new File("plugins/Drupi/scripts/modules/ItemUtils");
        if(IUNative.exists()){
            java.lang.System.out.println("[NBT-API] ItemUtils has been detected, registering ItemBuilder expansion...");
            java.lang.System.out.println("[NBT-API] Using ItemUtils installation from: plugins/Drupi/scripts/modules/ItemUtils");
            require("ItemUtils").registerItemBuilderCustomOption("nbt", function(item, value){
                return new e.NBTItemBuilder(item, value);
            });
        } else {
            if(reposENV != null){
                const IURepo = new File(reposENV.repo_path+"/modules/ItemUtils");
                if(IURepo.exists()){
                    java.lang.System.out.println("[NBT-API] ItemUtils has been detected, registering ItemBuilder expansion...");
                    java.lang.System.out.println("[NBT-API] Using ItemUtils installation from: "+reposENV.repo_path+"/modules/ItemUtils");
                    reposENV.instance.require(reposENV.repo_id, "ItemUtils").registerItemBuilderCustomOption("nbt", function(item, value){
                        return new e.NBTItemBuilder(item, value);
                    });
                }
            }
        }
        return e;
    }
}
