const ReasonPhrase = {
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.3
   *
   * The request has been received but not yet acted upon. It is non-committal, meaning that there is no way in HTTP to later send an asynchronous response indicating the outcome of processing the request. It is intended for cases where another process or server handles the request, or for batch processing.
   */
  ACCEPTED: 'Accepted',
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.3
   *
   * This error response means that the server, while working as a gateway to get a response needed to handle the request, got an invalid response.
   */
  BAD_GATEWAY: 'Bad Gateway',
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.1
   *
   * This response means that server could not understand the request due to invalid syntax.
   */
  BAD_REQUEST: 'Bad Request',
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.8
   *
   * This response is sent when a request conflicts with the current state of the server.
   */
  CONFLICT: 'Conflict',
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.2.1
   *
   * This interim response indicates that everything so far is OK and that the client should continue with the request or ignore it if it is already finished.
   */
  CONTINUE: 'Continue',
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.2
   *
   * The request has succeeded and a new resource has been created as a result of it. This is typically the response sent after a PUT request.
   */
  CREATED: 'Created',
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.3
   *
   * The client does not have access rights to the content, i.e. they are unauthorized, so server is rejecting to give proper response. Unlike 401, the client's identity is known to the server.
   */
  FORBIDDEN: 'Forbidden',
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.5
   *
   * This error response is given when the server is acting as a gateway and cannot get a response in time.
   */

  GATEWAY_TIMEOUT: 'Gateway Timeout',
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.5
   *
   * The request method is known by the server but has been disabled and cannot be used. For example, an API may forbid DELETE-ing a resource. The two mandatory methods, GET and HEAD, must never be disabled and should not return this error code.
   */
  METHOD_NOT_ALLOWED: 'Method Not Allowed',
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.5
   *
   * There is no content to send for this request, but the headers may be useful. The user-agent may update its cached headers for this resource with the new ones.
   */
  NO_CONTENT: 'No Content',
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.4
   *
   * The server can not find requested resource. In the browser, this means the URL is not recognized. In an API, this can also mean that the endpoint is valid but the resource itself does not exist. Servers may also send this response instead of 403 to hide the existence of a resource from an unauthorized client. This response code is probably the most famous one due to its frequent occurence on the web.
   */
  NOT_FOUND: 'Not Found',
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.2
   *
   * The request method is not supported by the server and cannot be handled. The only methods that servers are required to support (and therefore that must not return this code) are GET and HEAD.
   */
  NOT_IMPLEMENTED: 'Not Implemented',
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7232#section-4.1
   *
   * This is used for caching purposes. It is telling to client that response has not been modified. So, client can continue to use same cached version of response.
   */
  NOT_MODIFIED: 'Not Modified',
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.1
   *
   * The request has succeeded. The meaning of a success varies depending on the HTTP method:
   * GET: The resource has been fetched and is transmitted in the message body.
   * HEAD: The entity headers are in the message body.
   * POST: The resource describing the result of the action is transmitted in the message body.
   * TRACE: The message body contains the request message as received by the server
   */
  OK: 'OK',
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc6585#section-4
   *
   * The user has sent too many requests in a given amount of time ("rate limiting").
   */
  TOO_MANY_REQUESTS: 'Too Many Requests',
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7235#section-3.1
   *
   * Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated". That is, the client must authenticate itself to get the requested response.
   */
  UNAUTHORIZED: 'Unauthorized',
  /**
   * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.1
   *
   * The server encountered an unexpected condition that prevented it from fulfilling the request.
   */
  INTERNAL_SERVER_ERROR: 'Internal Server Error'
}

module.exports = {
  ReasonPhrase
}
