class DTOInterface {
    toJSON() {
        throw new Error("Method 'toJSON()' must be implemented.");
    }
}

module.exports = DTOInterface;