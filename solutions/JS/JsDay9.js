

async function fetchWithRetires(nextUrl,{maxRetires=3,initialDelay=100}={}){
       let attempt = 0;
       let delayMs = initialDelay
       while(true){
        try{
            const res = await fetch(nextUrl)
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res
        }
        catch(err){
            attempt++
            if(attempt>maxRetires){
                throw new err
            }
            await new Promise((res,rej)=>{setTimeout(()=>{res()},delayMs)})
            delayMs*=2
        }
       }           
}



async function* fetchPages(startUrl){
    const nextUrl = startUrl
    const nextFetch = fetchWithRetires(nextFetch)

    while(nextFetch){
        const res = await nextFetch
        const data = await res.json()
        if(data.nextPage){
            nextUrl = data.nextPage
            nextFetch = fetchWithRetires(nextUrl)
        }
        else{
            nextFetch = null;
        }
        yield data.items
    }
}