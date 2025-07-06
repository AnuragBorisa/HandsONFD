
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

