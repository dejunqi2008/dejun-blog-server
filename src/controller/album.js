const { exec } = require('../db/mysql')

const createAlbum = async (name, description, author_id) => {
    const createTime = Date.now();
    const sql = `
        INSERT INTO album (name, owner_id, description, createtime) VALUES ('${name}', '${author_id}', '${description}', '${createTime}');
    `
    const resp = await exec(sql);
    if (resp.error) {
        return resp;
    }
    return {id: resp.insertId};
}

const getAlbums = async (username) => {
    sql = `SELECT id FROM users WHERE username='${username}'`;
    let resp = await exec(sql);
    if (resp.error) {
        return resp;
    }

    const { id } = resp[0];
    sql = `SELECT * FROM album WHERE owner_id=${id}`;
    return await exec(sql);
}

module.exports = {
    createAlbum,
    getAlbums
}