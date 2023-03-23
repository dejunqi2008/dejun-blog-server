const { exec } = require('../db/mysql')


const createTag = async (name) => {
    const sql = `INSERT INTO tags (tagname) VALUES ('${name}');`
    const insertData = await exec(sql)
    console.log(insertData)
    return {
        id: insertData.insertId
    }
}

const getTags = (blog_id) => {
    let sql;
    if (!blog_id) {
        sql = `SELECT * FROM tags`;
    } else {
        sql = `SELECT * FROM tags WHERE id IN (SELECT tag_id FROM blog_tag WHERE blog_id='${blog_id}');`
    }

    console.log(sql);
    return exec(sql);
}

module.exports = {
    createTag,
    getTags
}