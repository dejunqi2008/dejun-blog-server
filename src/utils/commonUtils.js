const preProcessTextContent = (str) => {
    return str.replace('p', 'div').replace("\n", "<p></p>");
}

module.exports = {
    preProcessTextContent
}