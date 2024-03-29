const xss = require('xss');
const { exec } = require('../db/mysql')
const { mysql_real_escape_string } = require('../utils/commonUtils');

const LIMIT = 8;

const getList = async (author, page, tagname) => {
    let sql = `SELECT id FROM tags WHERE tagname='${tagname}';`
    let result = await exec(sql);
    const tag_id = result[0].id;
    const offset = (page - 1) * LIMIT;
    sql = `SELECT blog_id FROM blog_tag WHERE tag_id='${tag_id}' LIMIT ${LIMIT} OFFSET ${offset}`
    const ids = (await exec(sql)).map(obj => obj.blog_id);

    if (ids.length > 0) {
        sql = `
            SELECT * FROM blogs WHERE author='${author}' AND id IN (${ids});
        `
        const resp = await exec(sql);
        if (resp.error) {
            return [];
        }
        resp.sort((a, b) => b.createtime - a.createtime);
        return resp;
    } else {
        return [];
    }
}

const getListV2 = async (page, author, keyword) => {
    const offset = (page - 1) * LIMIT;
    let sql = `SELECT * FROM blogs WHERE author='${author}' `;
    if (keyword) {
        sql += `AND title like '%${keyword}%' `
    }
    sql += `ORDER BY createtime DESC LIMIT ${LIMIT} OFFSET ${offset}`
    const rows = await exec(sql)
    return rows;
}

const getTotalBlogNumber = async (author, keyword) => {
    const searchKeywordQuery = !!keyword ? ` AND title like '%${keyword}%' ` : '';
    const sql = `SELECT count(id) FROM blogs WHERE author='${author}'` + searchKeywordQuery;
    const countRes = await exec(sql);
    return countRes[0]['count(id)'];
}


const getTotalBlogNumberWithTag = async (tagname) => {
    let sql = `SELECT id FROM tags WHERE tagname='${tagname}';`
    let result = await exec(sql);
    const tag_id = result[0].id;
    sql = `SELECT count(id) FROM blog_tag WHERE tag_id=${tag_id};`
    const countRes = await exec(sql);
    return countRes[0]['count(id)'];
}


const getDetail = async (id) => {
    const sql = `SELECT * FROM blogs where id='${id}'`
    const rows = await exec(sql)
    return rows[0]
}

const newBlog = async (blogData = {}) => {
    const title = xss(mysql_real_escape_string(blogData.title));
    const content = xss(mysql_real_escape_string(blogData.content));
    const author = blogData.author
    const createTime = Date.now();
    
    const sql = `
        INSERT INTO blogs (title, content, createtime, author)
        values ('${title}', '${content}', ${createTime}, '${author}');
    `

    const response = await exec(sql)

    return {
        id: response.insertId
    }
}

const updateBlog = async (id, blogData = {}) => {
    const title = xss(mysql_real_escape_string(blogData.title));
    const content = xss(mysql_real_escape_string(blogData.content));

    const sql = `UPDATE blogs SET title='${title}', content='${content}' WHERE id=${id}`

    const updateData = await exec(sql)
    if (updateData.affectedRows > 0) {
        return true
    }
    return false
}

const delBlog = async (id, author) => {
    const sql = `DELETE FROM blogs WHERE id='${id}' AND author='${author}';`
    const delData = await exec(sql)
    if (delData.affectedRows > 0) {
        return true
    }
    return false
}

module.exports = {
    getList,
    getListV2,
    getDetail,
    newBlog,
    updateBlog,
    delBlog,
    getTotalBlogNumber,
    getTotalBlogNumberWithTag,
    LIMIT
}