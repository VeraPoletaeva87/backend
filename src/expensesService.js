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

    async addItem(item) {
       const data = (await this.getData()) || [];
       const arr = Object.values(data);
       arr.push(item);
       await writeFile(this.dataFile, JSON.stringify(arr));
       return true;
    }

    async editItem(item) {
        let id = item.id;
        const data = (await this.getData()) || [];
        const arr = Object.values(data);
        arr[id] = item;
        await writeFile(this.dataFile, JSON.stringify(arr));
        return true;
    }

    async deleteItem(cache) {
        return await writeFile(this.dataFile, JSON.stringify(cache));
    }
}