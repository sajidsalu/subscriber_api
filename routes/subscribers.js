const express = require("express");
const router = express.Router();
const Subscriber = require("../models/subscriber");

//getting all

router.get("/", async (req, res) => {
  try {
    const subscribers = await Subscriber.find();
    res.send(subscribers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//getting one

router.get("/:id", getSubscriber, async (req, res) => {
  res.json(res.subscriber);
});

//creating one

router.post("/", async (req, res) => {
  try {
    const subscriber = new Subscriber({
      name: req.body.name,
      subscribedToChannel: req.body.subscribedToChannel,
    });
    const newSubscriber = await subscriber.save();
    res.status(200).send(newSubscriber);
  } catch (err) {
    return res.status(404).json({
      success: false,
      message: err.message,
    });
  }
});

//updating one

router.patch("/:id", getSubscriber, async (req, res) => {
  if (req.body.name != null) {
    res.subscriber.name = req.body.name;
  }
  if (req.body.subscribedToChannel != null) {
    res.subscriber.subscribedToChannel = req.body.subscribedToChannel;
  }
  try {
    const updatedObj = await res.subscriber.save();
    res.json(updatedObj);
  } catch (err) {
    res.status(400).json({ message: "not found" });
  }
});

//delete one

router.delete("/:id", getSubscriber, async (req, res) => {
  try {
    await Subscriber.findOneAndRemove(req.params.id);
    res.json({ message: "successfully removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getSubscriber(req, res, next) {
  let subscriber;
  try {
    subscriber = await Subscriber.findById(req.params.id);
    if (subscriber == null) {
      return res.status(404).json({ message: "cannot find subscriber" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.subscriber = subscriber;
  next();
}
//

module.exports = router;
