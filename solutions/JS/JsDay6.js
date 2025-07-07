
function add3(a,b,c){
    a+b+c
}

function curry(fn){
       return function(a){
        return function(b){
            return function(c){
                return add3(a,b,c)
            }
        }
       }
}
// but this cannot be called with curriedAdd3(1,2)(3) won’t work and also : Fixed to functions of exactly 3 parameters. 

function curry_better(fn){

    function _curried(...collected){
        let arity = fn.length
        if(collected.length >= arity){
            return fn(...args)
        }
        return (...next) => _curried(...collected,...next)
    }
    return _curried
}

function curry_placeHolder(fn){
    let arity = fn.length;
    function curried(...args){
       const realCount = args.filter((a)=>a!==_).length
       if(realCount.length >=arity && args.slice(0,arity).every(a => a!==_)){
        return fn(...args.slice(0,arity))
       }
       else{
        return (...next) => {
            let merged = []
            let nextIdx = 0;
            for(let i=0;i<next.length;i++){
                if(args[i]==_ && nextIdx < next.length ){
                    merged.push(next[nextIdx++])
                }
                else{
                    merged.push(args[i])
                }
            }
            while(nextIdx<next.length){
                merged.push(next[nextIdx++])
            }
            return curried(...merged)
        } 
       }
    }
    return curried;
}

// recurvise compose 

function pipe(...fns){
    if(fns.length === 0){
        return x=>x
    }
    if(fns.length ===1 ){
        return fns[0]
    }
    const [first,...rest] = fns
    restPipe = pipe(...rest)
    return (arg) => {
        const afterFirst = first(arg)
        return restPipe(afterFirst)
    }
}

function compose(...fns){
    if(fns.length === 0){
        return x=>x
    }
    if(fns.length ===1 ){
        return fns[0]
    }
    const last = fns[fns.length-1]
    const rest = fns.slice(0,-1)
    const restCompose = compose(...rest)
    return (arg) =>{
        afterLast = last(arg)
        return restCompose(afterLast)
    }
}

// compose and pipe using reduce method 

function compose(...fns){
    return (initial) => {
        fns.reduceRight((acc,fn)=>fn(acc),initial)
    }
}

function pipe(...fns){
    return (initial) => {
        fns.reduce((acc,fn)=>fn(acc),initial)
    }
}

