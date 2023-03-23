const { exec } = require('../db/mysql')

const associate = async (blogId, tagIds) => {
    let sql = `INSERT INTO blog_tag (blog_id, tag_id) VALUES `;
    // const sql = `INSERT INTO blog_tag (blog_id, tag_id) VALUES ('${blogId}', '${tagId}');`
    const len = tagIds.length;

    for (let i = 0; i < len; i++) {
        sql += `('${blogId}', '${tagIds[i]}')`
        if (i < len - 1) {
            sql += ', ';
        } else {
            sql += ';'
        }
    }

    const resp = await exec(sql)
    return resp.affectedRows > 0;
}


module.exports = {
    associate,
}

