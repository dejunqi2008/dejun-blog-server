const whitelistDomains = [
    'https://dejun-blog-client.herokuapp.com',
    'http://localhost:3000',
    'https://www.dejun-cms.com/'
];

const whitelistMethods = ['GET','POST','DELETE','UPDATE','PUT','PATCH'];

module.exports = {
    whitelistDomains,
    whitelistMethods
}