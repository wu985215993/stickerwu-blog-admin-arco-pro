import defaultSettings from '../settings.json';
export interface GlobalState {
  settings?: typeof defaultSettings;
  userInfo?: {
    name?: string;
    avatar?: string;
    job?: string;
    organization?: string;
    location?: string;
    email?: string;
    permissions: Record<string, string[]>;
  };
  userLoading?: boolean;
  webSiteInfo?: Record<string, string>;
}

const initialState: GlobalState = {
  settings: defaultSettings,
  userInfo: {
    permissions: {},
  },
  webSiteInfo: {},
};

export default function store(state = initialState, action) {
  switch (action.type) {
    case 'update-settings': {
      const { settings } = action.payload;
      return {
        ...state,
        settings,
      };
    }
    case 'update-userInfo': {
      const {
        userInfo = initialState.userInfo,
        userLoading,
        webSiteInfo,
      } = action.payload;
      return {
        ...state,
        userLoading,
        userInfo: {
          ...userInfo,
          // TODO 后期如果需要加入别的角色登录需要更改这里
          permissions: {},
        },
        webSiteInfo: webSiteInfo || state.webSiteInfo,
      };
    }
    default:
      return state;
  }
}
