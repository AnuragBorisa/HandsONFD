
export function debounce(fn,wait){
    let timerId = null
    
    function debounced(...args){
        ctx = this
        clearTimeout(timerId)
        timeoutId = setTimeout(()=>{
             fn,apply(ctx,args)
             timerId = null;
        },wait)
    }

    debounced.cancel = () =>{
        clearTimeout(timerId)
        timerId = null
    }

    return debounced

}

