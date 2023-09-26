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
}

const initialState: GlobalState = {
  settings: defaultSettings,
  userInfo: {
    permissions: {},
  },
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
      const { userInfo = initialState.userInfo, userLoading } = action.payload;
      console.log(
        '%c [  action.payload ]-34',
        'font-size:13px; background:pink; color:#bf2c9f;',
        action.payload
      );

      return {
        ...state,
        userLoading,
        userInfo: {
          ...userInfo,
          // TODO
          permissions: {},
        },
      };
    }
    default:
      return state;
  }
}
