    function promiseAllSet(promises){
        return new Promise((res,rej)=>{
            const results = []
            let totalResolves = 0
    
            if(promises.length===0){
                res(results)
            }

            promises.forEach((p,i)=>{
                Promise.resolve(p)
                .then(value=>{
                    results[i] = {status:"fulfiled",value:value}
                    
                })
                .catch(err=>{
                    
                    results[i] = {status:"failed",value:err}
                })
                .finally(()=>{
                    totalResolves++
                    if(totalResolves === promises.length){
                        res(results)
                    }
                })

            })
        })
    }

    function promiseAny(promises){
        return new Promise((res,rej)=>{
            const errors = []
            let totalError = 0
        
            promises.forEach((p,i)=>{
                Promise.resolve(p)
                .then(value=>{
                    res(value)
                })
                .catch(err=>{
                    errors[i] = err
                    totalError++
                    if(totalError === promises.length){
                        rej(new AggregateError(errors, 'All promises were rejected'))
                    }
                })
            })
        })
        
    }

    function promiseRaceTimeout(promises,ms){
        const timeout = new Promise((_,rej)=>{
            setTimeout(()=>{
                rej(new Error(`Timed out after ${ms} ms`))
            },ms)
        })
        return new Promise((res,rej)=>{
            [
                ...promises.map(p=>Promise.resolve(p)),
                timeout
            ].forEach((p,i)=>{
                p
                .then(value=>{
                    res(value)
                })
                .catch(err=>{
                    rej(err)
                })
            })
        })
    }