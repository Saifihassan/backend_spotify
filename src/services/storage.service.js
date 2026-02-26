const {ImageKit} = require('@imagekit/nodejs')

const client = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
})


async function uploadFile(file){
    
    const res = await client.files.upload({
        file,
        fileName:'music_'+Date.now(),
        folder:'Backend_DEV/spotify_clone/music'
    })

    return res
} 

module.exports = {
    uploadFile
}