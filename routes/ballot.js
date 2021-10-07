const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const axios = require("axios");
const requireLogin = require("../middleware/requirelogin");
const { restart } = require("nodemon");

//Register Models
require("../Models/ballot");
require("../Models/party");
//Models
const Ballot = mongoose.model("Ballot");
const Party = require("../Models/party");

router.post("/createballot", async (req, res) => {
  const { ballotid, ballotname } = req.body; //send objectId of AreaId

  if (!ballotid || !ballotname) {
    return res.status(400).json({ message: "one or more fields are empty" });
  }

  const found = await Ballot.findOne({ ballotid }).then((resp) => {
    if (resp) {
      return res.json({ message: "ballot already present with this id" });
    }
  });

  if (found) {
    return res.json({ message: "ballot already present with this id" });
  }

  const newBallot = new Ballot({
    ballotid,
    ballotname,
  });

  newBallot
    .save()
    .then((resp) => {
      return res.status(200).json({ message: "ballot successfully saved" });
    })
    .catch((err) => {
      return res.status(400).json({ message: err });
    });
});

router.get("/findballot", async (req, res) => {
  //use this on every insertion of ballot,
  //verifies if ballot is ok or not
  const { ballotid } = req.body;

  if (!ballotid) {
    return res.status(400).json({ message: "one or mor fields are empty" });
  }

  Ballot.findOne({ ballotid })
    .populate("campaignId")
    .exec((err, docs) => {
      if (err) {
        return res.status(400).json({ message: err });
      } else {
        return res.status(200).json({ message: docs });
      }
    });
});

router.delete("/deleteballot", async (req, res) => {
  const { ballotid } = req.body;

  if (!ballotid) {
    return res.status(400).json({ message: "field is empty" });
  }

  const found = await axios({
    method: "get",
    url: "http://localhost:1970/findballot",
    data: {
      ballotid: ballotid,
    },
  })
    .then((resp) => {
      console.log(resp.data);
      if (resp.data["message"] == null) {
        return res
          .status(403)
          .json({ message: "ballot not present with this id" });
      }
    })
    .catch((err) => console.log(err));

  Ballot.findOneAndDelete({ ballotid })
    .then(() => {
      res.status(200).json({ message: "ballot successfully deleted" });
    })
    .catch((err) => {
      res.status(400).json({ message: err });
    });
});

router.get("/findallballot", async (req, res) => {
  Ballot.find({})
    .populate("campaignId")
    .exec((err, docs) => {
      if (err) {
        return res.json({ message: err });
      } else {
        console.log(docs);
        return res.json({ message: docs });
      }
    });
});

//gets all the name of the ballots
router.get("/getballotname", async (req, res) => {
  Ballot.find({})
    .select("ballotname")
    .exec((err, docs) => {
      if (!err) {
        return res.status(200).json({ message: docs });
      } else {
        return res.status(400).json({ message: err });
      }
    })
    .catch((err) => console.log(err));
});

//first candidateid will be fetched from candidate after its creation
//then found and inserted in ballot
router.put(
  "/updatecandidatesinballot/:ballotid/:candidateid", //have to be _id
  async (req, res) => {
    const { ballotid, candidateid } = req.params;

    if (!ballotid || !candidateid) {
      res.status(400).json({ message: "field is empty" });
    }

    Ballot.findOne({ ballotid })
      .exec((err, doc) => {
        doc.candidate.push(candidateid);
        doc
          .save((err, res) => {
            if (!err) {
              res
                .status(200)
                .json({ message: "candidate successfully saved in ballot" });
            } else {
              res
                .status(400)
                .json({ message: "error in saving candidate in ballot" });
            }
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }
);

router.get("/getcandidateswithballotid/:ballotid", async (req, res) => {
  const { ballotid } = req.params;
  if (!ballotid) {
    return res.status(400).json({ message: "field is empty" });
  }
  Party.find({ "candidate.ballotid": ballotid }).exec((err, docs) => {
    if (!err) {
      return res.status(200).json({ message: docs });
    } else {
      return res.status(400).json({ message: err });
    }
  });
});

//get candidates with a specific ballot id

module.exports = router;
