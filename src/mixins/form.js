export default {
  methods: {
    snackValidationMessage($v, validationsMessage) {
      const fieldsName = Object.keys(validationsMessage.form)
      const fields = fieldsName.map(curr => {
        const validations = Object.keys(validationsMessage.form[curr])
        return { name: curr, validations }
      })

      const filedsWithError = fields.filter(field => {
        field.validations = field.validations.filter(validation => !$v.form[field.name][validation])
        return field.validations.filter(validation => !$v.form[field.name][validation]).length
      })

      const messages = filedsWithError.map(curr => {
        const name = curr.name
        const validations = curr.validations
        return validationsMessage.form[name][validations]
      })

      this.$snack.error(messages[0])
    }
  }
}