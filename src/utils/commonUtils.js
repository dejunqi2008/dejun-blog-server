const preProcessTextContent = (str) => {
    return str.replace("\n", "<p></p>");
}

module.exports = {
    preProcessTextContent
}