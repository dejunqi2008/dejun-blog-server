const { exec } = require('../db/mysql');
const {getUserId} = require('../utils/commonUtils');

const addImgaes = async (imagepaths, username, album_id) => {
    let resp = await getUserId(username);
    if (resp.error) {
        return resp;
    }
    const {id} = resp[0];
    sql = `
        INSERT INTO photos (album_id, author_id, image_path) VALUES`;
    
    for (let i = 0; i < imagepaths.length; i++) {
        sql += ` ('${album_id}', '${id}', '${imagepaths[i]}')`;
        if (i < imagepaths.length - 1) {
            sql += ',';
        }
    }
    sql += ';'
    return await exec(sql);
}

const getImages = async (username, album_id) => {

    let resp = await getUserId(username);;
    if (resp.error) {
        return resp;
    }
    const {id} = resp[0];
    sql = `
        SELECT image_path FROM photos WHERE author_id='${id}' AND album_id='${album_id}';
    `
    return await exec(sql);
}

module.exports = {
    addImgaes,
    getImages
}
