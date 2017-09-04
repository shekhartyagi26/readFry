const findOne = (db, data) => {
    return new Promise((resolve, reject) => {
        db.findOne(data, function(err, user) {
            if (err) {
                reject(err);
            } else {
                resolve(user);
            }
        })
    })
};

const save = (db, data) => {
    let record = new db(data);
    return new Promise((resolve, reject) => {
        record.save((err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result)
            }
        })
    })
};
const update = (db, checkData, updateData) => {
    return new Promise((resolve, reject) => {
        db.findOneAndUpdate(checkData, { $set: updateData }, { new: true }, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        })
    })
};

const find = (db, data) => {
    return new Promise((resolve, reject) => {
        db.find(data, function(err, user) {
            if (err) {
                reject(err);
            } else {
                resolve(user);
            }
        })
    })
};


export default {
    findOne,
    save,
    update,
    find
};