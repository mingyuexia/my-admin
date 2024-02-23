import request from '@/request';


// 登录
export function loginApi(data){
  return request({
    url: '/uc/user/login',
    method: 'post',
    data
  });
}