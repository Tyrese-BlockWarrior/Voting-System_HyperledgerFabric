const { Schema } = require("mongoose"); //Admin editable only
const mongoose = require("mongoose");

const pollsSchema = new mongoose.Schema({
  pollId: {
    type: Number,
  },

  pollname: {
    type: String,
  },

  type: {
    type: String,
  },

  valid: {
    type: Boolean,
    default: true,
  },

  description: {
    type: String,
  },

  startTime: {
    type: Date,
    default: new Date(Date.now().toString()),
  }, //default

  endTime: {
    type: Date,
  }, //enter this runtime

  candidate: [
    {
      id: {
        type: mongoose.Types.ObjectId,
        ref: "Candidate",
      },
      voteCount: {
        type: Number,
        defaut: 0,
      },
    },
  ],
});

global.Polls = global.Polls || mongoose.model("Polls", pollsSchema);
module.exports = global.Polls;