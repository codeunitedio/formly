import FormlyErrors from './FormlyErrors'

export default class Formly {

  /**
   * Create a new Formly instance.
   *
   * @param {Object} data
   */
  constructor (data = {}) {
    this.originalData = data
    this.errors = new FormlyErrors()
    this.processing = false
    this.successful = false

    Object.assign(this, data)
  }

  /**
   * Get the form data
   */
  data () {
    return _.omit(JSON.parse(JSON.stringify(this)), [
      'processing',
      'successful',
      'errors',
      'originalData'
    ])
  }

  /**
   * Start processing the form.
   */
  startProcessing () {
    this.errors.clear()
    this.processing = true
    this.successful = false
  }

  /**
   * Finish processing the form.
   */
  onSuccess () {
    this.processing = false
    this.successful = true
  }

  /**
   * Finish processing the form with the given errors.
   */
  onFail (errors) {
    this.errors.set(errors)

    this.processing = false
  }

  /**
   * Reset the form back to its original state.
   */
  reset () {
    _.extend(true, this, this.originalData)
  }

  /**
   * Helper method for making POST HTTP requests.
   */
  post (uri) {
    return this.send('post', uri)
  }

  /**
   * Helper method for making PUT HTTP requests.
   */
  put (uri) {
    return this.send('put', uri)
  }

  /**
   * Helper method for making PATCH HTTP requests.
   */
  patch (uri) {
    return this.send('patch', uri)
  }

  /**
   * Helper method for making DELETE HTTP requests.
   */
  delete (uri) {
    return this.send('delete', uri)
  }

  /**
   * Send the form to the back-end server.
   */
  send (method, uri) {
    return new Promise((resolve, reject) => {
      this.startProcessing()

      axios[method](uri, this.data())
        .then((response) => {
          this.onSuccess()

          resolve(response.data)
        })
        .catch((errors) => {
          this.onFail(errors.response.data)

          reject(errors.response.data)
        })
    })
  }
}
