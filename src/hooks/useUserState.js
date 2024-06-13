import { reactive, toRefs } from 'vue';

function useUserState() {
  // 创建一个响应式状态对象
  const state = reactive({
    // 登录token
    token: null,
    // 登录用户信息
    userInfo: {},
    // 角色
    roles: localStorage.roles ? JSON.parse(localStorage.roles) : [],
  });

  // 将响应式对象的引用暴露出去
  const stateRefs = toRefs(state);

  async function login(userInfo) {
    const { username } = userInfo;
    state.token = username;
    state.userInfo = userInfo;
    await getRoles();
    return username;
  }

  async function getRoles() {
    try {
      // 获取权限列表，默认就是超级管理员，因为没有进行接口请求，写死
      state.roles = ['admin'];
      localStorage.roles = JSON.stringify(state.roles);
      return state.roles;
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    }
  }

  async function getInfo(roles) {
    state.roles = roles;
    return roles;
  }

  async function logout() {
    state.token = null;
    state.userInfo = {};
    state.roles = [];
    localStorage.removeItem('roles');
    return null;
  }

  return {
    ...stateRefs, // 包含所有状态属性的引用
    login,
    getRoles,
    getInfo,
    logout,
  };
}

export default useUserState;