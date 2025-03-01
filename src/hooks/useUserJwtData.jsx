import { createContext, useContext } from "react";


export const defaultUserJwtData = {
	token: '',
    patient: {}
}

export const UserJwtContext = createContext({
    userJwtData: defaultUserJwtData,
    setUserJwtData: () => {}
});

export function useUserJwtContext(){
	return useContext(UserJwtContext);
}
