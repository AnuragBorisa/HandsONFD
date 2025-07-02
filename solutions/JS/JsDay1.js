
export function debounce(fn,wait){
    let timerId = null
    
    function debounced(...args){
        let ctx = this
        clearTimeout(timerId)
        timerId = setTimeout(()=>{
             fn.apply(ctx,args)
             timerId = null;
        },wait)
    }

    debounced.cancel = () =>{
        clearTimeout(timerId)
        timerId = null
    }

    return debounced

}

// simple throttle 

export function simpleThrottle(fn,wait){
    let lastTime = 0;

    return function simpleThrottled(...args){
        let ctx = this 
        const now = Date.now()

        if(now-lastTime>=wait){
            lastTime = now 
            fn.apply(ctx,args)
        }
    }
}

export function throttle(fn,wait=0,leading=true,traling=true){
    let lastTime = 0;
    let timeoutId = null
    let lastArgs = null
    let lastThis = null

    function invoke(time){
        fn.apply(lastThis,lastArgs)
        lastTime = time
        lastArgs = lastThis = null
    }
    
    function throttled(...args){
        let now = Date.now()
        lastArgs = args
        lastThis = this
        if(lastTime===0 && !leading){
            lastTime = now
        }
        let remaining = wait - (now - lastTime)
        if(remaining <=0) {
            if(timeoutId){
                clearTimeout(timeoutId)
                timeoutId = null
            }
            invoke(now)
        }
        else if(traling && !timeoutId){
            timeoutId = setTimeout(()=>{
                invoke(Date.now())
                timeoutId = null
            },remaining)
        }

    }
    return throttled
}