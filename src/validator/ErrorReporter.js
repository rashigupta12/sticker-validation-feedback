import { errors } from '@vinejs/vine';

/**
 * A custom error reporter class for VineJS validation errors.
 */
export default class ErrorReporter {
  /**
   * A flag to know if one or more errors have been reported.
   */
  hasErrors = false;

  /**
   * A collection of errors.
   */
  errors = {};

  /**
   * VineJS calls this method to report errors.
   * 
   * @param {string} message - The error message.
   * @param {string} rule - The validation rule that failed.
   * @param {Object} field - Context of the field that caused the error.
   * @param {any} [meta] - Optional metadata about the error.
   */
  report(message, rule, field, meta) {
    this.hasErrors = true;

    /**
     * Collecting errors as per the JSONAPI spec.
     */
    this.errors[field.wildCardPath] = message;
  }

  /**
   * Creates and returns an instance of the ValidationError class.
   * 
   * @returns {errors.E_VALIDATION_ERROR} - The validation error instance.
   */
  createError() {
    return new errors.E_VALIDATION_ERROR(this.errors);
  }
}
