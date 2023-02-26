const whitelistDomains = [
    // for local dev
    'http://localhost:8001', 
    'http://localhost:3000',
    'https://dejun-blog-client.herokuapp.com'
];

const whitelistMethods = ['GET','POST','DELETE','UPDATE','PUT','PATCH'];

module.exports = {
    whitelistDomains,
    whitelistMethods
}