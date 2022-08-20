import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Loading from "react-fullscreen-loading";
import { API_PATHS } from "utils/apis";
import { useAppDispatch, useAppSelector } from "store/helpers";
import { setUser } from "store/actions/auth/auth.actions";
import { useRequest } from "hooks/useRequest.hook";
import { LOCAL_STORAGE_KEYS } from "utils/constants";
import { socket } from "socket";

export function ProtectedRoute() {
	const dispatch = useAppDispatch()
	const user = useAppSelector(state => state.auth.user)

	const [loading, setLoading] = useState<boolean>(true)

	const [getUser] = useRequest({
		url: API_PATHS.user.getLoggedInUser,
		showNotification: false,
		onSuccess: getUserSuccess,
		loadingFn: setLoading,
	})

	function connectToSocket() {
		const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN)
		if (token) {
			socket.init(token)
		}
	}

	function getUserSuccess(data: any) {
		if (!data) return
		dispatch(setUser(data.data.user))
		connectToSocket()
	}

	function validateUser() {
		if (user) {
			setLoading(false)
			connectToSocket()
			return
		}
		getUser()
	}

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(validateUser, [])

	return (
		loading ?
			<Loading loading={loading} background="#fffff7" loaderColor="#3498db" /> :
			<Outlet />
	)
};