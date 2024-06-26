const { GiveawaysManager: gw} = require('discord-giveaways');
const giveawayModel = require('./Schemas.js/giveawayschema');

module.exports = class GiveawaysManager extends gw {
    async getAllGiveaways() {
        return await giveawayModel.find().lean().exec();
    }

    async saveGiveaway(messageId, giveawayData) {
        return await giveawayModel.create(giveawayData);
    }

    async editGiveaway(messageId, giveawayData) {
        return await giveawayModel.updateOne({ messageId }, giveawayData, { omitInderfined: true }).exec();
    }

    async deleteGiveaway(messageId) {
        return await giveawayModel.deleteOne({ messageId }).exec();
    }
}