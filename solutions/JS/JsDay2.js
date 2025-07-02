function deepClone(obj,cache= new WeakMap()){
    if (obj === null || typeof obj !='object'){
        return obj
    }
    if(cache.has(obj)){
        return cache.get(obj)
    }
    let clone;

    if(obj instanceof Date){
        clone = new Date(obj)
        cache.set(obj,clone)
        return clone
    }
    if(obj instanceof Map){
        clone = new Map()
        cache.set(obj,clone)
        for (const [k,v] of obj){
            clone.set(deepClone(k,cache),deepClone(v,cache))
        }
        return clone
    }
    if (obj instanceof Set){
        clone = new Set()
        cache.set(obj,clone)
        for (const v of obj){
            clone.set(deepClone(v,cache))
        }
        return clone
    }
    if(Array.isArray(obj)){
        clone = []
        cache.set(obj,clone)
        for(let i=0;i<obj.length;i++){
            clone[i] = deepClone(obj[i],cache)
        }
        return clone
    }
    clone = Object.create(Object.getPrototypeOf(obj));
    cache.set(obj,clone)
    for(const key of  Reflect.ownKeys(obj)){
         const desc = Object.getOwnPropertyDescriptors(obj,key)
         if(desc.get || desc.set){
            Object.defineProperties(clone,key,desc)
         }
         else {
            clone[key] = deepClone(obj[key],cache)
         }
       
    }
    return clone;
}