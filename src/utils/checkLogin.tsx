/** 判断用户是否登录 */
export const checkLogin = () => {
  /** 判断之前是否登陆过 */
  return localStorage.getItem('adminToken');
};

/** 退出登录移除token */
export const logout = () => {
  localStorage.removeItem('adminToken')
  window.location.pathname = '/login';
};
