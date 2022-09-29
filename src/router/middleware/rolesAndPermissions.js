import {hasRole, hasPermission} from '@/utils/can'
import { $snack } from '@/services/snack'

export default function example({next, to}) {
  return new Promise((resolve, reject) => {
    const roles = to.meta.roles
    const permissions = to.meta.permissions

    if (!roles && !permissions) return resolve()

    const notHasRole = !roles || !hasRole(...roles)
    const notHasPermission = !permissions || !hasPermission(...permissions)

    if (notHasRole && notHasPermission) {
      $snack.error('Você não tem permissão para acessar esta funcionalidade.')
      return reject(next({ name: 'dashboard' }));
    }
    resolve()
  })
}
