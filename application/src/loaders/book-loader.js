import * as Dataloader from 'dataloader'
export const bookLoader = () => new Dataloader(keys => batchGetBooks(keys))

async function batchGetBooks(keys){
    const results = await db.fetchAllKeys(keys)
    return keys.map(key => results[key])
}
