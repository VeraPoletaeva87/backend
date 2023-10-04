const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

module.exports = class TaskService {
    constructor(dataFile) {
        this.dataFile = dataFile;
    }

    async getList() {
        const data = await this.getData();

        return data;
    }

    async getData() {
        const data = await readFile(this.dataFile, 'utf-8');

        return JSON.parse(data);
    }

    async addEntry(purchase) {
       const data = (await this.getData()) || [];
       const arr = Object.values(data);
       arr.push(purchase);
       await writeFile(this.dataFile, JSON.stringify(arr));
       return true;
    }

    async removeEntry(name) {
        const data = (await this.getData()) || [];
        const dataNew = data.filter(elem => elem.name != name);
        return await writeFile(this.dataFile, JSON.stringify(dataNew));
    }
}