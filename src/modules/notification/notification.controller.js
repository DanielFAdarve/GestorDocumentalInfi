class NotificationController {
  constructor(notificationService) {
    this.service = notificationService;
  }

  notifyPending = async (req, res, next) => {
    try {
      const result = await this.service.notifyPendingSupports();
      res.json({ ok: true, result });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = NotificationController;
