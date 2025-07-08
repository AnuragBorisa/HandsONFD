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


function tokenise(paths){
    let parts = paths.split('.')
    const tokens = []
    for (let part of parts){
        if(!part.includes('[')){
            tokens.push(part)
        }
        else{
            const [prop,...rest] = part.split('[')
            tokens.push(prop)
            for(let token in rest){
                const idx = token.replace(']','')
                tokens.push(Number(idx))
            }
        }
    }
}

function unflatten(flatMap){
    const result = {}
    for(paths in flatMap){
        const value = flatMap[paths]
        const tokens = tokenise(paths)
        let curr = result
        for(let i=0;i<tokens.length;i++){
            const tok = tokens[i]
            let lastIdx = i === tokens.length-1
            if(lastIdx){
                curr[tok] = value
            }
            else{
                let next = tokens[i+1]
                let needArray = typeof next === 'number'
                if(curr[tok] === undefined){
                    curr[tok] = needArray ? [] : {}
                }
                curr = curr[tok]
            }
        }
    }
    return result 
}

function flattenArray(arr) {
    return arr.reduce((acc, val) => 
      Array.isArray(val)
        ? acc.concat(flattenArray(val))    
        : acc.concat(val)                  
    , []);
  }

function unflattenArray(flatArr, shape) {
    let idx = 0;
  
    function build(dims) {
   
      if (dims.length === 0) {
        return flatArr[idx++];
      }
  
      const [len, ...restDims] = dims;
      const result = [];
      for (let i = 0; i < len; i++) {
        result.push(build(restDims));
      }
      return result;
    }
  
    return build(shape);
  }


