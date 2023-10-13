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

    //returns categories and totals for 
    async getStatistics(periodType) {
        // const path = require("path");
        // await writeFile(path.join(__dirname, './log.txt'), 'period' + periodType);
        const currDate = new Date();
        const currMonth = currDate.getMonth();
        const prevDate = new Date();
        prevDate.setMonth(currMonth - 1);

        const data = await readFile(this.dataFile, 'utf-8');
        const items = JSON.parse(data);

        //get unique categories list
        const categories = items.map(item => item.category);
        var labels = [...new Set(categories)];

        let totals = [];
        
        //calculate total sum for each category for period
        labels.forEach(label => {
           const total = items
          .filter(item => item.category === label && (prevDate <= new Date(item.date) && new Date(item.date) <= currDate))
          .map(cat => +cat.sum)
          .reduce((acc, sum) => acc + sum, 0);
          totals.push(total);
          });   

        return {labels, totals};
    }

    async deleteItem(cache) {
        return await writeFile(this.dataFile, JSON.stringify(cache));
    }
}