const whitelistDomains = [
    'https://dejun-blog-client.herokuapp.com',
    'http://localhost:3000'
];

const whitelistMethods = ['GET','POST','DELETE','UPDATE','PUT','PATCH'];

module.exports = {
    whitelistDomains,
    whitelistMethods
}