const xss = require('xss');
const { exec } = require('../db/mysql')
const { preProcessTextContent } = require('../utils/commonUtils');

const LIMIT = 5;

const getList = (author, keyword) => {
    let sql = `SELECT * FROM blogs WHERE 1=1 `
    if (author) {
        sql += `AND author='${author}' `
    }
    if (keyword) {
        sql += `AND title like '%${keyword}%' `
    }
    sql += `ORDER BY createtime DESC LIMIT 20;`

    return exec(sql)
}

const getListV2 = async (page, author, keyword) => {

    const offset = (page - 1) * LIMIT;
    // SELECT * FROM myblog.blogs ORDER BY createtime DESC LIMIT 5 OFFSET 0
    let sql = `SELECT * FROM blogs WHERE author='${author}' `;
    if (keyword) {
        sql += `AND title like '%${keyword}%' `
    }
    sql += `ORDER BY createtime DESC LIMIT ${LIMIT} OFFSET ${offset}`
    const rows = await exec(sql)
    return rows;
}

const getCounts = async (author, keyword) => {
    const searchKeywordQuery = !!keyword ? ` AND title like '%${keyword}%' ` : '';
    const sql = `SELECT count(id) FROM blogs WHERE author='${author}'` + searchKeywordQuery;
    const countRes = await exec(sql);
    return countRes[0]['count(id)'];
}

const getDetail = async (id) => {
    const sql = `SELECT * FROM blogs where id='${id}'`
    const rows = await exec(sql)
    return rows[0]
}

const newBlog = async (blogData = {}) => {
    const title = xss(blogData.title)
    const content = preProcessTextContent(xss(blogData.content));
    const author = blogData.author
    const createTime = Date.now()

    const sql = `
        INSERT INTO blogs (title, content, createtime, author)
        values ('${title}', '${content}', ${createTime}, '${author}');
    `

    const insertData = await exec(sql)
    return {
        id: insertData.insertId
    }
}

const updateBlog = async (id, blogData = {}) => {
    const title = xss(blogData.title)
    const content = xss(blogData.content)

    const sql = `
        UPDATE blogs SET title='${title}', content='${content}' WHERE id=${id}
    `

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
    getCounts,
    LIMIT
}