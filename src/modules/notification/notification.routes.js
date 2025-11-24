const { Router } = require("express");

module.exports = (controller) => {
  const router = Router();

  router.get("/notify/pending-supports", controller.notifyPending);

  return router;
};
