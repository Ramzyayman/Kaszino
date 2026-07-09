module.exports = function isOwner(userId) {

    const owners = process.env.OWNER_IDS
        .split(",")
        .map(id => id.trim());

    return owners.includes(userId);

};