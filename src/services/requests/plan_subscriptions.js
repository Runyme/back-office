import http from '@/services/http'

export const subscriptionRequest = () => {
  return http.get(`/plans/subscription`);
};

export const createOrUpdateSubscriptionRequest = (data) => {
  return http.post('plans/subscription', data);
};

export const deleteSubscriptionRequest = (type, id) => {
  return http.delete('plans/subscription/' + type + '/' + id);
};
