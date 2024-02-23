import request from '@/request';

export function userHomeApi(data) {
  return request({
    url: '/apis/user/pc-info',
    method: 'post',
    data
  });
}
