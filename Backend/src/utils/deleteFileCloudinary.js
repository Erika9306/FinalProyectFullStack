const cloudinary = require('cloudinary').v2;

const deleteFile =async (url) => {
    try{
        const array = url.split('/');
        const name = array.at(-1).split('.')[0];
        let publicId = `${array.at(-2)}/${name}`;

        const res = await cloudinary.uploader.destroy(publicId);
            console.log('File deleted successfully!', res);
    }catch(err){
        console.log('Error deleting file', err);
    }
}
module.exports = deleteFile;