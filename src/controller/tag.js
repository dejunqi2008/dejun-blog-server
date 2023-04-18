const { exec } = require('../db/mysql')


const createTag = async (name) => {
    const sql = `INSERT INTO tags (tagname) VALUES ('${name}');`
    const resp = await exec(sql)
    if (resp.error) {
        return resp;
    }
    return {
        id: resp.insertId
    }
}

const getTags = (blog_id) => {
    let sql;
    if (!blog_id) {
        sql = `SELECT * FROM tags`;
    } else {
        sql = `SELECT * FROM tags WHERE id IN (SELECT tag_id FROM blog_tag WHERE blog_id='${blog_id}');`
    }

    return exec(sql);
}

module.exports = {
    createTag,
    getTags
}