import store from '@/store/'

function validateRules(ruleType, args) {
  const user = store.getters.getUser
  const joker = user.role.includes('super-admin')
  const rules = user[ruleType]
  const verifiedRules = args.filter((item) => rules.includes(item))
  return joker || !!verifiedRules.length
}

export const hasRole = (...args) => {
  return validateRules('role', args)
}

export const hasPermission = (...args) => {
  return validateRules('permissions', args)
}
