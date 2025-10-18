class Response {
  constructor(status, success, message, data = null) {
    this.status = status;
    this.success = success;
    this.message = message;
    this.data = data;
  }

  static success(message, data = null, status = 200) {
    return new Response(status, true, message, data);
  }

  static error(message, status = 400, data = null) {
    return new Response(status, false, message, data);
  }

  static set(...args) {
    if (args.length === 0) {
      return new Response(404, false, 'Sin datos', null);
    } else if (args.length === 1) {
      return new Response(200, true, 'OK', args[0]);
    } else if (args.length === 2) {
      return new Response(args[0], true, args[1], null);
    } else if (args.length === 3) {
      return new Response(args[0], args[1], args[2]);
    }
  }
}

module.exports = Response;
