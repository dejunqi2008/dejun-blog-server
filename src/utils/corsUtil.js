const whitelistDomains = [
    // 'https://dejun-blog-client.herokuapp.com',
    'http://localhost:3000',
    'https://www.dejun-cms.com',
    'https://test-deploy.d1ut9q9f8s2667.amplifyapp.com',
    'https://mainline.d1ut9q9f8s2667.amplifyapp.com'
];

const whitelistMethods = ['GET','POST','DELETE','UPDATE','PUT','PATCH'];

module.exports = {
    whitelistDomains,
    whitelistMethods
}