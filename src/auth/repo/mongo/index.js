const { accountMapper } = require("../../mapper");
const { AccountModel } = require("./model");

async function save(account) {
  const mapped = accountMapper.mapToPersistence(account);
  const upsetData = { ...mapped };
  await AccountModel.findByIdAndUpdate(account.id, upsetData, {
    upsert: true,
  }).exec();
  return;
}

async function exist(idOrErmail) {
  return await AccountModel.exists({
    $or: [{ email: idOrErmail }, { id: idOrErmail }],
  });
}

async function findByEmail(email) {
  const res = await AccountModel.findOne({ email }).exec();
  if (!res) return null;
  return accountMapper.mapToDomain(res);
}

async function find(id) {
  const exists = await AccountModel.findById(id).exec();
  if (exists) return accountMapper.mapToDomain(exists);
  return null;
}

async function _delete(id) {
  await AccountModel.findByIdAndDelete(id).exec();
  return;
}

async function findPaginated(offset = 0) {
  const exists = await AccountModel.find({})
    .limit(10)
    .skip(offset)
    .exec();
  if (exists) {
    return exists.map(item => {
      return accountMapper.mapToDomain(item);
    })
  }
  return null;
}


module.exports = {
  AccountMongoRepo: {
    save,
    findByEmail,
    delete: _delete,
    find,
    exist,
    findPaginated
  }
}