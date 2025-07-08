function flatten(obj){
    const result = {}

    function recursive(val,path){
        if(val !==null && typeof val === 'object'){
            if(Array.isArray(val)){
                if(val.length===0){
                    result[path] = []
                }
                else{
                    val.forEach((item,idx)=>{
                        recursive(item,`${path}[${idx}]`)
                    })
                }
            }
            else{
                keys = Object.keys(val)
                if(keys.length === 0){
                    result[path] = {}
                }
                else{
                    keys.forEach((key,i)=>{
                        newPath = path ? `${path}.${key}`:key
                        recursive(val[key],newPath)
                    })
                }
            }
        }
        else{
            result[path] = val
        }
    }
    recursive(obj, '');       
    delete result[''];       
    return result;
}
