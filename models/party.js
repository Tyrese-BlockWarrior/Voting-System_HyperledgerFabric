const mongoose = require("mongoose");
const { Schema } = require("mongoose");

require("../Models/ballot");
const Ballot = mongoose.model("Ballot");

const partySchema = new Schema({
  partyId: {
    type: Number,
    required: true,
  },
  partyName: {
    type: String,
    required: true,
  },
  partyImg: {
    type: String,
    default: "...",
    required: true,
  },
  partyLeaderName: {
    type: String,
    required: true,
  },
  partyLeaderCnic: {
    type: Number,
    required: true,
  },
  partyLeaderPhoneNumber: {
    type: Number,
    required: true,
  },
  partyLeaderGender: {
    type: String,
    required: true,
  },
  partyLeaderAge: {
    type: Number,
    required: true,
  },
  partyLeaderReligion: {
    type: String,
    required: true,
  },
  partyLeaderAddress: {
    type: String,
    required: true,
  },
  candidate: [
    {
      name: {
        type: String,
        default: "",
      },

      cnic: {
        type: Number,
        default: 0000,
      },

      position: {
        type: String,
        default: "",
      },

      ballotid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ballot",
        default: null,
      },

      partyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Party",
        default: null,
      },

      is_criminal: {
        type: Boolean,
        default: false,
      },
    },
  ], //SUBDOCUMENT

  is_valid: {
    type: Boolean,
    default: false,
  },
});

global.Party = global.Party || mongoose.model("Party", partySchema);

module.exports = global.Party;
